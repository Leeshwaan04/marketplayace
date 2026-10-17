# Marketplayace

Company and industry intelligence for India and the world. Browse 80 industries and open a company or brand profile, by country, in which **every fact links to its source and shows when it was retrieved**. Anything we cannot verify is left blank.

Live at [marketplayace.com](https://marketplayace.com).

## Principles (E-E-A-T)

- **Sourced or absent.** No estimated, inferred or invented values. Each fact carries `provider`, `source` (URL) and `retrievedAt`.
- **Primary sources win.** US filers use SEC EDGAR (HQ address, 10-K revenue and net income). Other facts come from Wikidata (CC0). Corrections are recorded as reviewed overrides with a citation.
- **No paid placement, no invented scores.** No rankings, "Ace scores" or promo codes unless supplied by a brand or official partner programme.
- **Logos** only when Wikimedia Commons lists a free licence; hosted locally with licence recorded. Otherwise a monogram.
- **Labs** (`/labs`) is an experimental shop with sample listings. It is labelled, `noindex`, and disallowed in `robots.txt`.

## Stack

React 19, Vite, Tailwind CSS v4, TypeScript. Deployed to Cloudflare Pages. No analytics, cookies or third-party requests; fonts are self-hosted.

## Data pipeline

Two ways a company enters the site, and every profile says which:

- **Matched by hand:** `scripts/registry.json` entries with a reviewed Wikidata `qid`, optional `overrides` (cited) and `suppress` (with a reason).
- **Found by an industry rule:** `scripts/specs/<category>.json` describes how to find a category's companies in open data (classes, notability threshold, exclusions, plus a reviewed list of extra entities). Entries it adds are marked `source: "query"` and shown as "added automatically, not individually checked".

```bash
node scripts/resolve-names.mjs scripts/specs/curated/footwear.txt   # propose Wikidata matches for a list of brand names (review by hand)
node scripts/enumerate.mjs scripts/specs/footwear.json --preview     # test a spec: candidates grouped by country
node scripts/apply-specs.mjs [category ...]                          # merge spec results into the registry (prunes entries that no longer qualify)
npm run data:sync                                                    # fetch facts + logos for new entries, rebuild index, shards and sitemap
node scripts/sync-wikidata.mjs --all                                 # re-fetch every entry (refresh dates and countries)
```

Output layout: a light index (`src/data/generated/index.json`) ships in the app for lists, search and counts; full records live in 64 shards (`public/data/shard-NN.json`) that the browser fetches on demand and the prerender reads from disk. US filers get HQ, revenue and net income from SEC EDGAR; everything else from Wikidata (CC0). Financial figures without a period or currency are never published.

**Coverage is bounded by open data.** A brand with no Wikidata entry (many regional brands) cannot be added this way. See `scripts/specs/README.md` for the spec format.

**Add a company by hand:** find its Wikidata QID, confirm it is the right entity, add an entry to `registry.json`, run `npm run data:sync`, and spot-check the output against the company's own site.

Taxonomy lives in `src/data/taxonomy.ts` (the `planned` lists are coverage targets, not rankings).

## Pages

`/` · `/categories` · `/category/:industry` · `/category/:industry/:country` · `/countries` · `/country/:country` · `/company/:slug` · `/methodology` · `/about` · `/privacy` · `/terms` · `/compare` and `/labs` (not indexed). Every page except Compare and Labs is prerendered to static HTML at build time (`npm run build`).

## Scripts

```bash
npm run dev       # local dev
npm run build     # sitemap + typecheck + production build
npm run lint      # oxlint
npm test          # data-integrity, E-E-A-T guardrail and security checks
```

## Operator details

Set `legalEntity` and `contactEmail` in `src/config/site.ts`. The About, Footer and correction links appear only when these are set.
