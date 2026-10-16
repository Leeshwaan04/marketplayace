# Marketplayace

Company and industry intelligence for India and the world. Browse 61 industries and open a company profile in which **every fact links to its source and shows when it was retrieved**. Anything we cannot verify is left blank.

Live at [marketplayace.com](https://marketplayace.com).

## Principles (E-E-A-T)

- **Sourced or absent.** No estimated, inferred or invented values. Each fact carries `provider`, `source` (URL) and `retrievedAt`.
- **Primary sources win.** US filers use SEC EDGAR (HQ address, 10-K revenue and net income). Other facts come from Wikidata (CC0). Corrections are recorded as reviewed overrides with a citation.
- **No paid placement, no invented scores.** No rankings, "Ace scores" or promo codes unless supplied by a brand or official partner programme.
- **Logos** only when Wikimedia Commons lists a free licence; hosted locally with licence recorded. Otherwise a monogram.
- **Labs** (`/labs`) is an experimental shop with sample listings. It is labelled, `noindex`, and disallowed in `robots.txt`.

## Stack

React 19, Vite, Tailwind CSS v4, TypeScript. Deployed to Cloudflare Pages. No analytics, cookies or third-party requests; fonts are self-hosted.

## Routes

`/` home · `/categories` · `/category/:slug` · `/company/:slug` · `/methodology` · `/about` · `/privacy` · `/labs`

## Data pipeline

```bash
npm run data:sync      # fetch facts + logos, regenerate sitemap.xml and robots.txt
```

1. `scripts/registry.json` is the human-reviewed list of companies. Each entry maps our `slug` to a Wikidata `qid`, lists `categories`, and may carry `overrides` (with `source` and `reviewedAt`) and a public `dataNote`.
2. `scripts/sync-wikidata.mjs` fetches facts, then replaces HQ and financials with SEC EDGAR data for 10-K filers. Output: `src/data/generated/companies.json` and `public/logos/`.
3. `scripts/build-sitemap.mjs` writes `public/sitemap.xml` and `public/robots.txt`.

**Add a company:** find its Wikidata QID, confirm it is the right entity (names are ambiguous), add an entry to `registry.json`, run `npm run data:sync`, and spot-check the output against the company's own site.

Taxonomy lives in `src/data/taxonomy.ts`. The `planned` lists are coverage targets, not rankings.

## Scripts

```bash
npm run dev       # local dev
npm run build     # sitemap + typecheck + production build
npm run lint      # oxlint
npm test          # data-integrity, E-E-A-T guardrail and security checks
```

## Operator details

Set `legalEntity` and `contactEmail` in `src/config/site.ts`. The About, Footer and correction links appear only when these are set.
