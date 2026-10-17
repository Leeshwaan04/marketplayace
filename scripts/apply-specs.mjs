#!/usr/bin/env node
/**
 * Runs the reviewed category specs and merges their candidates into scripts/registry.json.
 *
 *   node scripts/apply-specs.mjs [slug ...]      (default: every spec in scripts/specs/*.json)
 *
 * New entries are marked source:"query" (found by a spec, not hand-picked) so the site can say so honestly.
 * Existing entries only gain the category. Nothing is fetched here; run sync-wikidata.mjs afterwards.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { enumerate } from './enumerate.mjs'

const REG = new URL('./registry.json', import.meta.url)
const registry = JSON.parse(await readFile(REG, 'utf8'))
const today = new Date().toISOString().slice(0, 10)

export function slugify(name) {
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[øØ]/g, 'o').replace(/[æÆ]/g, 'ae').replace(/ß/g, 'ss').replace(/[đĐ]/g, 'd').replace(/[łŁ]/g, 'l')
    .replace(/&/g, ' and ').replace(/['’`]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const wanted = process.argv.slice(2)
const files = (await readdir(new URL('./specs/', import.meta.url))).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''))
const slugs = wanted.length ? wanted : files

const byQid = new Map(registry.companies.filter((c) => c.qid).map((c) => [c.qid, c]))
const taken = new Set(registry.companies.map((c) => c.slug))
const stats = []

for (const cat of slugs) {
  const spec = JSON.parse(await readFile(new URL(`./specs/${cat}.json`, import.meta.url), 'utf8'))
  const items = await enumerate(spec)
  const produced = new Set(items.map((i) => i.qid))
  let added = 0, merged = 0, pruned = 0
  // Query-found entries that no longer qualify under this spec lose the category (and are dropped if it was their only one).
  for (const c of [...registry.companies]) {
    if (c.source === 'query' && c.categories.includes(cat) && !produced.has(c.qid) && !(spec.includeQids ?? []).some((i) => i.qid === c.qid)) {
      c.categories = c.categories.filter((k) => k !== cat)
      pruned++
      if (c.categories.length === 0) registry.companies.splice(registry.companies.indexOf(c), 1)
    }
  }
  for (const it of items) {
    const existing = byQid.get(it.qid)
    if (existing) {
      if (!existing.categories.includes(cat)) { existing.categories.push(cat); merged++ }
      continue
    }
    let slug = slugify(it.name) || it.qid.toLowerCase()
    if (taken.has(slug)) slug = `${slug}-${it.qid.toLowerCase()}`
    taken.add(slug)
    const entry = { slug, qid: it.qid, name: it.name, categories: [cat], source: 'query', discoveredAt: today }
    registry.companies.push(entry)
    byQid.set(it.qid, entry)
    added++
  }
  stats.push({ cat, found: items.length, added, merged, pruned })
  console.log(`${cat.padEnd(28)} found ${String(items.length).padStart(4)}  new ${String(added).padStart(4)}  merged ${String(merged).padStart(3)}  pruned ${String(pruned).padStart(3)}`)
}
await writeFile(REG, JSON.stringify(registry, null, 2) + '\n')
console.log(`registry now has ${registry.companies.length} entries`)
