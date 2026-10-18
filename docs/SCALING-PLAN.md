# Scaling plan: from ~1,100 to tens of thousands of pages

Decided 2026-10-18. **Free Cloudflare plan. Quality-gated, staged release.** The goal is pages that each earn their place,
not a page count. Google treats mass-produced thin pages as spam ("scaled content abuse") and can demote a whole
domain, which would hurt the good pages too.

## What open data can supply

Real, still-operating companies by notability (number of Wikipedia language editions), measured 2026-10-18:

| Notability | Companies |
|---|---|
| 10 or more | ~6,700 |
| 5 or more | ~17,400 |
| 3 or more | ~34,500 |
| 2 or more | ~63,800 |

Going below 3 means companies with only a few verified facts. Those do not clear the quality gate.

## Constraints on the free plan

- **20,000 files per Pages deployment.** Static ceiling is ~15,000 to 18,000 pages (HTML + data shards + logos + assets).
  Logos for the long tail are dropped (monogram instead) to save files.
- **Beyond that** needs the paid plan (100,000 files) or on-demand serving (Pages Functions / Workers), where the free tier
  is 100,000 requests/day and 10 ms CPU per request. A quota error returned to Googlebot would be harmful, so the
  on-demand route is only for later, with monitoring.
- **Bundle size.** The light index must stop shipping in the JS bundle once it passes ~3,000 companies: load it lazily
  (search only) and fetch per-page list data.
- **Git size.** Generated data should not grow history without bound. Decide before ~10,000 companies: external store
  (for example R2) restored in CI, or shard data so only changed shards are rewritten.
- **Sitemap.** 50,000 URLs per file; use a sitemap index split into chunks (for example 5,000 per file).
- **Sync time.** Skip logo downloads for the long tail (`--no-logos`); fetch facts in batches of 40 (already done).

## Quality gate (a page is published and indexed only if it passes)

1. Real entity: not dissolved, not a person, a company/brand class, at least 3 Wikipedia editions.
2. Has a description, a country, and at least 3 of: founded, headquarters, website, industry, listing, employees.
3. Mapped to at least one of our industries through the reviewed industry map (`scripts/industry-map.json`).
4. Duplicate-name and duplicate-entity checks pass.
Pages that fail are not generated. Pages that pass but are thin on facts are generated `noindex`.

## Phases

1. **Classification.** Reviewed mapping from Wikidata industry/class to our 80 industries. Discovery by mapping instead of one hand-tuned spec per industry.
2. **Scale-ready pipeline.** `--no-logos`, quality gate, lazy index, sitemap index, data storage decision.
3. **Staged release.** About 5,000 pages per batch, one batch at a time. Watch Search Console (indexed vs "crawled, not indexed", Core Web Vitals) for a week before the next batch. Pause if de-indexing starts.
4. **Richer pages.** Parent and subsidiary links, ownership, multi-year financials from SEC filings, so each page has something unique.

## Expectations

A new domain is crawled slowly. The indexed count will lag the published count by weeks. Page count is a means; indexed,
useful pages and impressions are the measure.
