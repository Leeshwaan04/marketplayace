#!/usr/bin/env node
/**
 * Enumerates companies and brands for one category from Wikidata, using a small reviewed spec.
 *
 *   node scripts/enumerate.mjs scripts/specs/footwear.json [--preview] [--out file.json]
 *
 * Spec shape (see scripts/specs/README.md):
 *   (requireAnyType: [qid] = direct instance of any listed class, much cheaper than requireTypes)
 *   { category, includes: [{via:'P31'|'P452'|'P1056', qid, exact?, why}], includeQids?: [{qid,name}], requireTypes?: [qid],
 *     minSitelinks, excludeQids?: [], excludeLabelRegex?: string, excludeDescriptionRegex?: string, maxCount, notes }
 *
 * Quality rules baked in: dissolved entities are dropped, only entities with at least `minSitelinks`
 * Wikipedia language editions are kept (a notability proxy), people are excluded, and each entity gets one
 * current country. Output is a list of candidates for human review, never published automatically.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const UA = { 'User-Agent': 'marketplayace-data-sync/1.0 (https://marketplayace.com; sumit.bagewadi@indiabulls.com)', Accept: 'application/sparql-results+json' }
const LOCK = '/tmp/wdqs-throttle.json'
const GAP_MS = 1800

async function throttle() {
  // Shared across processes so parallel workers do not exceed the public endpoint's limits.
  for (;;) {
    let last = 0
    try { last = JSON.parse(await readFile(LOCK, 'utf8')).t } catch { /* first call */ }
    const wait = last + GAP_MS - Date.now()
    if (wait <= 0) break
    await new Promise((r) => setTimeout(r, wait + Math.random() * 300))
  }
  await writeFile(LOCK, JSON.stringify({ t: Date.now() }))
}

export async function sparql(query) {
  for (let attempt = 0; attempt < 5; attempt++) {
    await throttle()
    const res = await fetch('https://query.wikidata.org/sparql?format=json', {
      method: 'POST',
      headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'query=' + encodeURIComponent(query)
    })
    if (res.ok) return (await res.json()).results.bindings
    if (res.status === 429 || res.status >= 500) {
      const ra = Number(res.headers.get('retry-after')) || 10 * (attempt + 1)
      await new Promise((r) => setTimeout(r, ra * 1000))
      continue
    }
    throw new Error(`SPARQL ${res.status}: ${(await res.text()).slice(0, 300)}`)
  }
  throw new Error('SPARQL: gave up after retries')
}

export function buildQuery(spec) {
  const parts = (spec.includes ?? []).map((i) => {
    if (!/^P(31|452|1056)$/.test(i.via) || !/^Q\d+$/.test(i.qid)) throw new Error(`bad include ${JSON.stringify(i)}`)
    // exact: match the class itself; default also matches every subclass (can pull in unrelated things).
    return i.exact ? `{ ?c wdt:${i.via} wd:${i.qid} . }` : `{ ?c wdt:${i.via}/wdt:P279* wd:${i.qid} . }`
  })
  const explicit = (spec.includeQids ?? []).map((i) => {
    const q = typeof i === 'string' ? i : i.qid
    if (!/^Q\d+$/.test(q)) throw new Error(`bad includeQid ${q}`)
    return q
  })
  if (explicit.length) parts.push(`{ VALUES ?c { ${explicit.map((q) => 'wd:' + q).join(' ')} } }`)
  const types = (spec.requireTypes ?? []).map((q) => {
    if (!/^Q\d+$/.test(q)) throw new Error(`bad requireType ${q}`)
    return `?c wdt:P31/wdt:P279* wd:${q} .`
  })
  const min = Number(spec.minSitelinks ?? 10)
  const anyType = (spec.requireAnyType ?? []).map((q) => {
    if (!/^Q\d+$/.test(q)) throw new Error(`bad requireAnyType ${q}`)
    return 'wd:' + q
  })
  // Cheap alternative to requireTypes: the item must be a DIRECT instance of one of these classes.
  if (anyType.length) types.push(`VALUES ?t { ${anyType.join(' ')} } ?c wdt:P31 ?t .`)
  const rules = parts.filter((p) => !p.includes('VALUES'))
  const curated = parts.filter((p) => p.includes('VALUES'))
  // Curated (explicitly reviewed) entities bypass the type and notability filters; discovered ones do not.
  const discovered = rules.length ? `{ ${rules.join(' UNION ')} ${types.join(' ')} ?c wikibase:sitelinks ?sl0 . FILTER(?sl0 >= ${min}) }` : ''
  const body = [discovered, ...curated].filter(Boolean).join(' UNION ')
  return `SELECT ?c ?cLabel ?cDescription ?sl ?country ?countryLabel ?code WHERE {
  ${body}
  ?c wikibase:sitelinks ?sl .
  FILTER NOT EXISTS { ?c wdt:P576 [] }
  FILTER NOT EXISTS { ?c wdt:P31 wd:Q5 }
  # Country is only for preview here; the sync step resolves the final country (with fallbacks) from each entity.
  OPTIONAL { ?c wdt:P17 ?country . OPTIONAL { ?country wdt:P297 ?code } }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 6000`
}

export function collapse(rows, spec) {
  const byQid = new Map()
  const excludeQ = new Set(spec.excludeQids ?? [])
  const rx = spec.excludeLabelRegex ? new RegExp(spec.excludeLabelRegex, 'i') : null
  const dx = spec.excludeDescriptionRegex ? new RegExp(spec.excludeDescriptionRegex, 'i') : null
  for (const r of rows) {
    const qid = r.c.value.split('/').pop()
    const label = r.cLabel?.value ?? ''
    if (excludeQ.has(qid) || !label || /^Q\d+$/.test(label) || (rx && rx.test(label)) || (dx && dx.test(r.cDescription?.value ?? ''))) continue
    const e = byQid.get(qid) ?? { qid, name: label, description: r.cDescription?.value ?? null, sitelinks: Number(r.sl.value), countries: [] }
    if (r.countryLabel && !e.countries.some((c) => c.name === r.countryLabel.value)) {
      e.countries.push({ name: r.countryLabel.value, code: r.code?.value ?? null })
    }
    byQid.set(qid, e)
  }
  return [...byQid.values()]
    .map((e) => ({ ...e, country: e.countries[0] ?? null, multiCountry: e.countries.length > 1 }))
    .sort((a, b) => b.sitelinks - a.sitelinks)
    .slice(0, Number(spec.maxCount ?? 200))
}

export async function enumerate(spec) {
  return collapse(await sparql(buildQuery(spec)), spec)
}

if (process.argv[1] && process.argv[1].endsWith('enumerate.mjs')) {
  const [file, ...flags] = process.argv.slice(2)
  if (!file) throw new Error('usage: node scripts/enumerate.mjs <spec.json> [--preview] [--out file]')
  const spec = JSON.parse(await readFile(file, 'utf8'))
  const outIdx = flags.indexOf('--out')
  const out = outIdx >= 0 ? flags[outIdx + 1] : null
  const t = Date.now()
  const list = await enumerate(spec)
  if (out) {
    await mkdir(path.dirname(out), { recursive: true })
    await writeFile(out, JSON.stringify({ category: spec.category, spec, count: list.length, items: list }, null, 1))
  }
  const byCountry = {}
  for (const e of list) (byCountry[e.country?.name ?? '(none)'] ??= []).push(`${e.name} (${e.sitelinks})`)
  console.log(`${spec.category}: ${list.length} candidates in ${Date.now() - t}ms${out ? ` -> ${out}` : ''}`)
  if (flags.includes('--preview') || !out) {
    for (const [c, v] of Object.entries(byCountry).sort((a, b) => b[1].length - a[1].length)) console.log(`  ${c.padEnd(24)} ${String(v.length).padStart(3)}  ${v.slice(0, 6).join(', ')}`)
  }
}
