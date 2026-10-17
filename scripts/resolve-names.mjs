#!/usr/bin/env node
/**
 * Resolves a list of brand names to Wikidata entities for human review.
 *
 *   node scripts/resolve-names.mjs scripts/specs/curated/footwear.txt [--out resolved.json]
 *
 * Input: one name per line, optional "| Country" hint (used to pick between same-named entities).
 * For each name it prints the best candidate and flags ambiguous or unresolved names. A person reviews the
 * output before any QID is added to a spec's includeQids. Nothing here is published automatically.
 */
import { readFile, writeFile } from 'node:fs/promises'

const UA = { 'User-Agent': 'marketplayace-data-sync/1.0 (https://marketplayace.com; sumit.bagewadi@indiabulls.com)' }
const GOOD = /(company|corporation|brand|label|manufacturer|maker|retailer|chain|group|firm|enterprise|business|producer|house|footwear|shoe|boot|sneaker|clothing|apparel|garment|fashion|automobile|car |cars|motorcycle|scooter|vehicle|chatbot|language model|assistant|software|startup|developer|platform|service|tool|model|generator|app)/i
const BAD = /(family name|given name|album|song|film|disambiguation|scholarly|article|surname|fictional|village|municipality|river|species|taxon|genus|city in|commune|district|football club|band)/i

async function wd(params) {
  const res = await fetch(`https://www.wikidata.org/w/api.php?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`, { headers: UA })
  if (!res.ok) throw new Error(`Wikidata ${res.status}`)
  return res.json()
}

const [file, ...flags] = process.argv.slice(2)
const lines = (await readFile(file, 'utf8')).split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
const out = []
for (const line of lines) {
  const [name, hint] = line.split('|').map((x) => x.trim())
  const r = await wd({ action: 'wbsearchentities', search: name, language: 'en', limit: '7' })
  const cands = (r.search ?? []).filter((c) => c.description && GOOD.test(c.description) && !BAD.test(c.description))
  const pick = (hint && cands.find((c) => c.description.toLowerCase().includes(hint.toLowerCase()))) || cands[0] || null
  out.push({ input: name, hint: hint ?? null, qid: pick?.id ?? null, label: pick?.label ?? null, description: pick?.description ?? null, alternatives: cands.filter((c) => c !== pick).slice(0, 2).map((c) => `${c.id} ${c.label}: ${(c.description ?? '').slice(0, 50)}`) })
  await new Promise((r) => setTimeout(r, 120))
}
for (const o of out) console.log(`${o.input.padEnd(26)} => ${o.qid ? `${o.qid} [${o.label}] ${(o.description ?? '').slice(0, 58)}` : 'NOT FOUND'}${o.alternatives.length ? '   (alt: ' + o.alternatives[0].slice(0, 50) + ')' : ''}`)
const idx = flags.indexOf('--out')
if (idx >= 0) await writeFile(flags[idx + 1], JSON.stringify(out, null, 1))
console.error(`\n${out.filter((o) => o.qid).length}/${out.length} resolved`)
