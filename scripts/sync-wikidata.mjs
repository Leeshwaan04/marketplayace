#!/usr/bin/env node
/**
 * Pulls verifiable company facts from Wikidata (plus SEC EDGAR for US filers) and writes the generated
 * company data: a light index in src/data/generated/ and full records in public/data/ shards.
 *
 * Rules that keep the data trustworthy (E-E-A-T):
 *  - Only QIDs a human put in scripts/registry.json are fetched; nothing is guessed.
 *  - Every fact carries its source URL and retrieval date.
 *  - Missing data stays missing. We never fill gaps with invented values.
 *  - Logos are only used when Wikimedia Commons reports a free licence; otherwise null.
 *
 * Run: node scripts/sync-wikidata.mjs          sync only registry entries not yet generated (fast)
 *      node scripts/sync-wikidata.mjs --all    re-fetch everything
 */
import { readFile, writeFile, mkdir, stat, readdir, rm } from 'node:fs/promises'
import { readAllCompanies, writeAllCompanies } from './lib/data.mjs'

const UA = { 'User-Agent': 'marketplayace-data-sync/1.0 (https://marketplayace.com; sumit.bagewadi@indiabulls.com)' }
const API = 'https://www.wikidata.org/w/api.php'

// One shared gate spaces out every request to Wikimedia, and 429/5xx responses are retried with backoff.
const nap = (ms) => new Promise((r) => setTimeout(r, ms))
let gateChain = Promise.resolve()
const GAP_MS = 220
const gate = () => (gateChain = gateChain.then(() => nap(GAP_MS)))
async function politeFetch(url, tries = 7) {
  for (let i = 0; i < tries; i++) {
    await gate()
    const res = await fetch(url, { headers: UA })
    if (res.status === 429 || res.status >= 500) {
      const wait = (Number(res.headers.get('retry-after')) || 4 * 2 ** i) * 1000
      console.warn(`  ${res.status} from ${new URL(url).host}, waiting ${Math.round(wait / 1000)}s (try ${i + 1}/${tries})`)
      await nap(wait)
      continue
    }
    return res
  }
  throw new Error(`gave up after ${tries} tries: ${url.slice(0, 120)}`)
}
const retrievedAt = new Date().toISOString().slice(0, 10)

const registry = JSON.parse(await readFile(new URL('./registry.json', import.meta.url)))
const ALL = process.argv.includes('--all')
const inRegistry = new Set(registry.companies.filter((c) => c.qid).map((c) => c.slug))
// Records for entries that left the registry (for example pruned by a stricter spec) are dropped.
const previous = ALL ? [] : (await readAllCompanies()).filter((c) => inRegistry.has(c.slug))
const have = new Set(previous.map((c) => c.slug))
// Incremental by default: only registry entries we have no record for yet.
const registered = registry.companies.filter((c) => c.qid)
const entries = registered.filter((c) => ALL || !have.has(c.slug))
console.log(`registry: ${registered.length} entries, ${previous.length} already generated, fetching ${entries.length}`)
if (entries.length === 0) {
  // Registry-only changes (categories, overrides) still need to be applied to existing records.
  const by = new Map(registered.map((c) => [c.slug, c]))
  for (const r of previous) if (by.get(r.slug)) r.categories = by.get(r.slug).categories ?? r.categories
  await writeAllCompanies(previous, new Date().toISOString().slice(0, 10))
  await removeUnusedLogos(previous)
  console.log(`nothing new to fetch; index rewritten (${previous.length} companies)`)
  process.exit(0)
}

async function wd(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`
  const res = await politeFetch(url)
  if (!res.ok) throw new Error(`Wikidata ${res.status}`)
  return res.json()
}

const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))

// 1) Fetch all entities
const entities = {}
for (const ids of chunk(entries.map((e) => e.qid), 40)) {
  const data = await wd({ action: 'wbgetentities', ids: ids.join('|'), props: 'labels|descriptions|claims|sitelinks', languages: 'en' })
  Object.assign(entities, data.entities)
}

// 2) Collect every referenced entity so we can print human-readable labels
const claimIds = (e, p) => {
  const live = (e.claims?.[p] ?? []).filter((c) => c.rank !== 'deprecated')
  // Prefer statements that have not ended (no "end time" qualifier), so a company shows its current country, not a historical one.
  const current = live.filter((c) => !c.qualifiers?.P582)
  return (current.length ? current : live).map((c) => c.mainsnak?.datavalue?.value?.id).filter(Boolean)
}

const REF_PROPS = ['P159', 'P17', 'P495', 'P178', 'P176', 'P452', 'P112', 'P127', 'P749', 'P355', 'P414']
const needed = new Set()
for (const e of Object.values(entities)) for (const p of REF_PROPS) claimIds(e, p).forEach((id) => needed.add(id))
const labels = {}
for (const ids of chunk([...needed], 40)) {
  const data = await wd({ action: 'wbgetentities', ids: ids.join('|'), props: 'labels', languages: 'en' })
  for (const [id, ent] of Object.entries(data.entities)) labels[id] = ent.labels?.en?.value ?? null
}

// Country fallback: the headquarters' own country, for entities with neither P17 nor P495.
const hqCountry = {}
{
  const hqIds = new Set()
  for (const e of Object.values(entities)) {
    // No country of its own: look at where its headquarters, developer or manufacturer is.
    if (claimIds(e, 'P17').length === 0 && claimIds(e, 'P495').length === 0) {
      for (const p of ['P159', 'P178', 'P176']) claimIds(e, p).forEach((id) => hqIds.add(id))
    }
  }
  const countryIds = new Set()
  for (const ids of chunk([...hqIds], 40)) {
    const data = await wd({ action: 'wbgetentities', ids: ids.join('|'), props: 'claims', languages: 'en' })
    for (const [id, ent] of Object.entries(data.entities)) {
      const c = claimIds(ent, 'P17')[0]
      if (c) { hqCountry[id] = c; countryIds.add(c) }
    }
  }
  const missing = [...countryIds].filter((id) => !(id in labels))
  for (const ids of chunk(missing, 40)) {
    const data = await wd({ action: 'wbgetentities', ids: ids.join('|'), props: 'labels', languages: 'en' })
    for (const [id, ent] of Object.entries(data.entities)) labels[id] = ent.labels?.en?.value ?? null
  }
}

// helpers -------------------------------------------------------------
// Strip invisible bidi/control characters that sometimes sit inside Wikidata labels.
const clean = (t) => (t ? t.replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '').trim() : t)
const lab = (id) => clean(labels[id]) ?? null
// A headquarters that is a building, street address or district is not a useful city. Leave it blank instead.
const NOT_A_CITY = /\d|building|district|tower|plaza|square|centre|center|campus/i
const best = (e, p) => {
  const list = (e.claims?.[p] ?? []).filter((c) => c.rank !== 'deprecated' && c.mainsnak?.datavalue)
  return list.find((c) => c.rank === 'preferred') ?? list[list.length - 1] ?? null
}
// Keep the precision Wikidata actually has: '2024-00-00' -> '2024', '2017-12-00' -> '2017-12'
const dateOf = (c) => {
  const t = c?.qualifiers?.P585?.[0]?.datavalue?.value?.time?.slice(1, 11)
  return t ? t.replace(/-00-00$/, '').replace(/-00$/, '') : null
}
const parseYear = (t) => (t ? Number(t.slice(1, 5)) : null)

function quantity(e, p) {
  const list = (e.claims?.[p] ?? []).filter((c) => c.rank !== 'deprecated' && c.mainsnak?.datavalue)
  if (!list.length) return null
  // newest by point-in-time
  list.sort((a, b) => (dateOf(b) ?? '').localeCompare(dateOf(a) ?? ''))
  const c = list[0]
  const v = c.mainsnak.datavalue.value
  return { amount: Number(v.amount), unit: v.unit?.split('/').pop() ?? null, asOf: dateOf(c) }
}

const fact = (value, qid, property) =>
  value === null || value === undefined || (Array.isArray(value) && value.length === 0)
    ? null
    : { value, provider: 'Wikidata', source: `https://www.wikidata.org/wiki/${qid}#${property}`, retrievedAt }

// 3) Logo licensing via Commons. Free-licence files are downloaded and served from our own origin.
await mkdir(new URL('../public/logos/', import.meta.url), { recursive: true })
async function logoFor(e, slug) {
  const file = best(e, 'P154')?.mainsnak.datavalue.value
  if (!file) return null
  const url = `https://commons.wikimedia.org/w/api.php?${new URLSearchParams({
    action: 'query', titles: `File:${file}`, prop: 'imageinfo', iiprop: 'url|extmetadata|mime', iiurlwidth: '256', format: 'json', origin: '*'
  })}`
  const apiRes = await politeFetch(url)
  const page = Object.values((await apiRes.json()).query.pages)[0]
  const info = page?.imageinfo?.[0]
  if (!info) return null
  const md = info.extmetadata ?? {}
  const license = md.LicenseShortName?.value ?? null
  const isFree = !!license && /^(public domain|pd|cc0|cc[- ]by)/i.test(license)
  const strip = (h) => (h ? h.replace(/<[^>]+>/g, '').trim() : null)
  const base = {
    license,
    licenseUrl: md.LicenseUrl?.value ?? null,
    author: strip(md.Artist?.value),
    commonsPage: info.descriptionurl
  }
  if (!isFree) return { usable: false, path: null, ...base }
  const ext = info.mime === 'image/svg+xml' ? 'svg' : info.mime === 'image/png' ? 'png' : info.mime === 'image/jpeg' ? 'jpg' : null
  if (!ext) return { usable: false, path: null, ...base }
  const target = new URL(`../public/logos/${slug}.${ext}`, import.meta.url)
  const already = await stat(target).then((st) => st.size > 0, () => false)
  if (!already) {
    const bin = await politeFetch(info.mime === 'image/svg+xml' ? info.url : info.thumburl ?? info.url)
    if (!bin.ok) return { usable: false, path: null, ...base }
    await writeFile(target, Buffer.from(await bin.arrayBuffer()))
  }
  return { usable: true, path: `/logos/${slug}.${ext}`, ...base }
}

// Download logos with a small worker pool (the Commons API and file CDN are the slow part).
async function pool(items, size, fn) {
  const results = new Array(items.length)
  let next = 0
  await Promise.all(Array.from({ length: size }, async () => {
    while (next < items.length) {
      const i = next++
      try { results[i] = await fn(items[i]) } catch (err) { console.warn(`! logo ${items[i].slug}: ${err.message}`); results[i] = null }
    }
  }))
  return results
}
const logoResults = new Map()
{
  const todo = entries.filter((e) => entities[e.qid] && e.qid && entities[e.qid].missing === undefined)
  const got = await pool(todo, 3, (e) => logoFor(entities[e.qid], e.slug))
  todo.forEach((e, i) => logoResults.set(e.slug, got[i]))
}

// 4) Build records
const currencyLabel = {}
const out = []
for (const entry of entries) {
  const e = entities[entry.qid]
  if (!e || e.missing !== undefined) {
    console.warn(`! ${entry.slug}: ${entry.qid} not found`)
    continue
  }
  const q = entry.qid
  const inception = best(e, 'P571')?.mainsnak.datavalue.value.time ?? null
  const revenue = quantity(e, 'P2139')
  const netIncome = quantity(e, 'P2295')
  const employees = quantity(e, 'P1128')
  const marketCap = quantity(e, 'P2226')
  const website = best(e, 'P856')?.mainsnak.datavalue.value ?? null
  const ticker = (e.claims?.P414 ?? []).map((c) => ({
    exchange: lab(c.mainsnak?.datavalue?.value?.id),
    symbol: c.qualifiers?.P249?.[0]?.datavalue?.value ?? null
  })).filter((t) => t.symbol)

  out.push({
    slug: entry.slug,
    wikidataId: q,
    name: clean(entry.displayName ?? e.labels?.en?.value ?? entry.name) ?? null,
    cik: best(e, 'P5531')?.mainsnak.datavalue.value ?? null,
    description: fact(e.descriptions?.en?.value ?? null, q, 'description'),
    founded: fact(parseYear(inception), q, 'P571'),
    headquarters: fact(claimIds(e, 'P159').map(lab).filter((l) => l && !NOT_A_CITY.test(l))[0] ?? null, q, 'P159'),
    country: (() => {
      const direct = claimIds(e, 'P17').map(lab).filter(Boolean)[0]
      if (direct) return fact(direct, q, 'P17')
      const origin = claimIds(e, 'P495').map(lab).filter(Boolean)[0]
      if (origin) return fact(origin, q, 'P495')
      for (const p of ['P159', 'P178', 'P176']) {
        const via = claimIds(e, p).map((id) => lab(hqCountry[id])).filter(Boolean)[0]
        if (via) return fact(via, q, p)
      }
      return null
    })(),
    industries: fact(claimIds(e, 'P452').map(lab).filter(Boolean), q, 'P452'),
    founders: fact(claimIds(e, 'P112').map(lab).filter(Boolean), q, 'P112'),
    parent: fact(claimIds(e, 'P749').map(lab).filter(Boolean)[0] ?? null, q, 'P749'),
    website: fact(website, q, 'P856'),
    listings: fact(ticker, q, 'P414'),
    employees: fact(employees, q, 'P1128'),
    revenue: fact(revenue, q, 'P2139'),
    netIncome: fact(netIncome, q, 'P2295'),
    marketCap: fact(marketCap, q, 'P2226'),
    logo: logoResults.get(entry.slug) ?? null,
    sitelinks: Object.keys(e.sitelinks ?? {}).length,
    categories: entry.categories ?? [],
    wikipedia: e.sitelinks?.enwiki ? `https://en.wikipedia.org/wiki/${encodeURIComponent(e.sitelinks.enwiki.title.replace(/ /g, '_'))}` : null,
    dataNote: entry.dataNote ?? null,
    discovery: entry.source === 'query' ? 'query' : 'curated'
  })
}

// Resolve currency QIDs (units) to ISO-ish labels
const unitIds = new Set()
for (const r of out) for (const k of ['revenue', 'netIncome', 'marketCap']) if (/^Q\d+$/.test(r[k]?.value?.unit ?? '')) unitIds.add(r[k].value.unit)
for (const ids of chunk([...unitIds], 40)) {
  const data = await wd({ action: 'wbgetentities', ids: ids.join('|'), props: 'labels|claims', languages: 'en' })
  for (const [id, ent] of Object.entries(data.entities ?? {})) {
    currencyLabel[id] = ent.claims?.P498?.[0]?.mainsnak?.datavalue?.value ?? ent.labels?.en?.value ?? id
  }
}
for (const r of out) for (const k of ['revenue', 'netIncome', 'marketCap']) {
  if (r[k]?.value?.unit) r[k].value.currency = currencyLabel[r[k].value.unit] ?? null
}

// Reviewed overrides: a human checked the primary source and recorded it in registry.json.
for (const entry of entries) {
  const r = out.find((x) => x.slug === entry.slug)
  for (const [field, o] of Object.entries(entry.overrides ?? {})) {
    if (r) r[field] = { value: o.value, provider: o.provider, source: o.source, retrievedAt: o.reviewedAt }
  }
}

// Suppressions: values we know are wrong upstream are shown as blank, with the reason kept in registry.json.
for (const entry of entries) {
  const r = out.find((x) => x.slug === entry.slug)
  for (const field of entry.suppress ?? []) {
    if (r && !(entry.overrides ?? {})[field]) r[field] = null
  }
}

// Undated financial figures are not trustworthy; drop them rather than show a number with no period.
for (const r of out) for (const k of ['revenue', 'netIncome', 'marketCap']) if (r[k] && !r[k].value.asOf) r[k] = null

// 5) SEC EDGAR: primary-source HQ address and reported financials for US filers.
const sleep = nap
const titleCase = (t) => t.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())
const REVENUE_CONCEPTS = ['Revenues', 'RevenueFromContractWithCustomerExcludingAssessedTax', 'RevenueFromContractWithCustomerIncludingAssessedTax', 'SalesRevenueNet']

function latestAnnual(facts, concepts) {
  let best = null
  for (const k of concepts) {
    for (const x of facts?.[k]?.units?.USD ?? []) {
      if (x.form !== '10-K' || x.fp !== 'FY' || !x.start) continue
      const days = (new Date(x.end) - new Date(x.start)) / 864e5
      if (days < 350 || days > 380) continue
      if (!best || x.end > best.end || (x.end === best.end && x.filed > best.filed)) best = x
    }
  }
  return best
}

for (const r of out) {
  if (!r.cik) continue
  const cik10 = String(r.cik).padStart(10, '0')
  try {
    const sub = await (await fetch(`https://data.sec.gov/submissions/CIK${cik10}.json`, { headers: UA })).json()
    const addr = sub.addresses?.business
    const secPage = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik10}&type=10-K`
    // Only domestic filers (10-K) have a business address that reflects their real HQ.
    const files10K = (sub.filings?.recent?.form ?? []).includes('10-K')
    if (files10K && addr?.city && /^[A-Z]{2}$/.test(addr.stateOrCountry ?? '')) {
      r.headquarters = { value: `${titleCase(addr.city)}, ${addr.stateOrCountry}`, provider: 'SEC EDGAR', source: secPage, retrievedAt }
      r.country = { value: 'United States', provider: 'SEC EDGAR', source: secPage, retrievedAt }
    }
    await sleep(150)
    const cf = await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik10}.json`, { headers: UA })
    if (cf.ok) {
      const gaap = (await cf.json()).facts?.['us-gaap']
      const rev = latestAnnual(gaap, REVENUE_CONCEPTS)
      const net = latestAnnual(gaap, ['NetIncomeLoss'])
      const filing = (x) => `https://www.sec.gov/Archives/edgar/data/${Number(r.cik)}/${x.accn.replace(/-/g, '')}/`
      if (rev) r.revenue = { value: { amount: rev.val, currency: 'USD', asOf: `FY${rev.fy} (to ${rev.end})` }, provider: 'SEC EDGAR 10-K', source: filing(rev), retrievedAt }
      if (net) r.netIncome = { value: { amount: net.val, currency: 'USD', asOf: `FY${net.fy} (to ${net.end})` }, provider: 'SEC EDGAR 10-K', source: filing(net), retrievedAt }
    }
    await sleep(150)
  } catch (err) {
    console.warn(`! SEC lookup failed for ${r.slug}: ${err.message}`)
  }
}

async function removeUnusedLogos(records) {
  const used = new Set(records.map((r) => r.logo?.path).filter(Boolean).map((p) => p.split('/').pop()))
  const dir = new URL('../public/logos/', import.meta.url)
  let removed = 0
  for (const f of await readdir(dir)) if (!used.has(f)) { await rm(new URL(f, dir)); removed++ }
  if (removed) console.log(`removed ${removed} unused logo files`)
}

// Merge with records from earlier runs, then write the index and shards.
const mergedBySlug = new Map(previous.map((c) => [c.slug, c]))
for (const r of out) mergedBySlug.set(r.slug, r)
const merged = [...mergedBySlug.values()]
await writeAllCompanies(merged, retrievedAt)
await removeUnusedLogos(merged)

// Coverage report
const fields = ['founded', 'headquarters', 'founders', 'website', 'listings', 'employees', 'revenue', 'marketCap']
console.log(`\nSynced ${out.length} new companies this run (${merged.length} total)`)
for (const f of fields) console.log(`  ${f.padEnd(13)} ${out.filter((r) => r[f]).length}/${out.length}`)
console.log(`  SEC-sourced   ${out.filter((r) => r.headquarters?.provider === 'SEC EDGAR').length}/${out.length}`)
console.log(`  logo (free)   ${out.filter((r) => r.logo?.usable).length}/${out.length}`)
