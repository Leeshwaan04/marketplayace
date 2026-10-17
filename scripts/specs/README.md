# Category specs

One JSON file per category. A spec tells `scripts/enumerate.mjs` how to find the companies and brands of an
industry on Wikidata. Specs are reviewed by a person; the enumerator only produces *candidates*.

```json
{
  "category": "footwear",
  "includes": [
    { "via": "P31",  "qid": "Q123", "why": "instance of (a subclass of) shoe brand" },
    { "via": "P452", "qid": "Q456", "why": "industry: footwear industry" }
  ],
  "requireTypes": ["Q4830453"],
  "minSitelinks": 8,
  "excludeQids": [],
  "excludeLabelRegex": "",
  "maxCount": 300,
  "notes": "what was checked, known gaps",
  "precision": { "sampled": 40, "wrong": 1 }
}
```

- `via: P31` matches items that are an instance of the class (or any subclass). `via: P452` matches items whose industry is the class (or a subclass). Choose narrow classes; very broad ones (company, organization) time out.
- `requireTypes` (optional) further restricts to instances of a class, for example business (Q4830453).
- `minSitelinks` is a notability proxy (number of Wikipedia language editions).
- Dissolved entities and people are always excluded.
