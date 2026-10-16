#!/usr/bin/env node
/**
 * Pulls verifiable company facts from Wikidata and writes src/data/generated/companies.json.
 *
 * Rules that keep the data trustworthy (E-E-A-T):
 *  - Only QIDs a human put in scripts/registry.json are fetched; nothing is guessed.
 *  - Every fact carries its source URL and retrieval date.
 *  - Missing data stays missing. We never fill gaps with invented values.
 *  - Logos are only used when Wikimedia Commons reports a free licence; otherwise null.
 *
 * Run: node scripts/sync-wikidata.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const UA = { 'User-Agent': 'marketplayace-data-sync/1.0 (https://marketplayace.com; sumit.bagewadi@indiabulls.com)' }
const API = 'https://www.wikidata.org/w/api.php'
const retrievedAt = new Date().toISOString().slice(0, 10)

const registry = JSON.parse(await readFile(new URL('./registry.json', import.meta.url)))
const entries = registry.companies.filter((c) => c.qid)

async function wd(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`
  const res = await fetch(url, { headers: UA })
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
const claimIds = (e, p) =>
  (e.claims?.[p] ?? []).filter((c) => c.rank !== 'deprecated').map((c) => c.mainsnak?.datavalue?.value?.id).filter(Boolean)

const REF_PROPS = ['P159', 'P17', 'P452', 'P112', 'P127', 'P749', 'P355', 'P414']
const needed = new Set()
for (const e of Object.values(entities)) for (const p of REF_PROPS) claimIds(e, p).forEach((id) => needed.add(id))
const labels = {}
for (const ids of chunk([...needed], 40)) {
  const data = await wd({ action: 'wbgetentities', ids: ids.join('|'), props: 'labels', languages: 'en' })
  for (const [id, ent] of Object.entries(data.entities)) labels[id] = ent.labels?.en?.value ?? null
}

// helpers -------------------------------------------------------------
const lab = (id) => labels[id] ?? null
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
  const page = Object.values((await (await fetch(url, { headers: UA })).json()).query.pages)[0]
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
  const bin = await fetch(info.mime === 'image/svg+xml' ? info.url : info.thumburl ?? info.url, { headers: UA })
  if (!bin.ok) return { usable: false, path: null, ...base }
  await writeFile(new URL(`../public/logos/${slug}.${ext}`, import.meta.url), Buffer.from(await bin.arrayBuffer()))
  return { usable: true, path: `/logos/${slug}.${ext}`, ...base }
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
    name: entry.displayName ?? e.labels?.en?.value ?? null,
    cik: best(e, 'P5531')?.mainsnak.datavalue.value ?? null,
    description: fact(e.descriptions?.en?.value ?? null, q, 'description'),
    founded: fact(parseYear(inception), q, 'P571'),
    headquarters: fact(claimIds(e, 'P159').map(lab).filter(Boolean)[0] ?? null, q, 'P159'),
    country: fact(claimIds(e, 'P17').map(lab).filter(Boolean)[0] ?? null, q, 'P17'),
    industries: fact(claimIds(e, 'P452').map(lab).filter(Boolean), q, 'P452'),
    founders: fact(claimIds(e, 'P112').map(lab).filter(Boolean), q, 'P112'),
    parent: fact(claimIds(e, 'P749').map(lab).filter(Boolean)[0] ?? null, q, 'P749'),
    website: fact(website, q, 'P856'),
    listings: fact(ticker, q, 'P414'),
    employees: fact(employees, q, 'P1128'),
    revenue: fact(revenue, q, 'P2139'),
    netIncome: fact(netIncome, q, 'P2295'),
    marketCap: fact(marketCap, q, 'P2226'),
    logo: await logoFor(e, entry.slug),
    categories: entry.categories ?? [],
    wikipedia: e.sitelinks?.enwiki ? `https://en.wikipedia.org/wiki/${encodeURIComponent(e.sitelinks.enwiki.title.replace(/ /g, '_'))}` : null,
    dataNote: entry.dataNote ?? null
  })
}

// Resolve currency QIDs (units) to ISO-ish labels
const unitIds = new Set()
for (const r of out) for (const k of ['revenue', 'netIncome', 'marketCap']) if (r[k]?.value?.unit) unitIds.add(r[k].value.unit)
for (const ids of chunk([...unitIds], 40)) {
  const data = await wd({ action: 'wbgetentities', ids: ids.join('|'), props: 'labels|claims', languages: 'en' })
  for (const [id, ent] of Object.entries(data.entities)) {
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

// Undated financial figures are not trustworthy; drop them rather than show a number with no period.
for (const r of out) for (const k of ['revenue', 'netIncome', 'marketCap']) if (r[k] && !r[k].value.asOf) r[k] = null

// 5) SEC EDGAR: primary-source HQ address and reported financials for US filers.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
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

await writeFile(new URL('../src/data/generated/companies.json', import.meta.url), JSON.stringify({ generatedAt: retrievedAt, source: 'Wikidata (CC0)', companies: out }, null, 2) + '\n')

// Coverage report
const fields = ['founded', 'headquarters', 'founders', 'website', 'listings', 'employees', 'revenue', 'marketCap']
console.log(`\nSynced ${out.length}/${registry.companies.length} companies (${registry.companies.length - entries.length} unresolved in registry)`)
for (const f of fields) console.log(`  ${f.padEnd(13)} ${out.filter((r) => r[f]).length}/${out.length}`)
console.log(`  SEC-sourced   ${out.filter((r) => r.headquarters?.provider === 'SEC EDGAR').length}/${out.length}`)
console.log(`  logo (free)   ${out.filter((r) => r.logo?.usable).length}/${out.length}`)
