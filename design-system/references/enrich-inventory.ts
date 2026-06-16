/**
 * Enriches every components/<category>/<slug>/meta.json with the patterns,
 * references and designLanguages from references/patterns.ts (specific entry if
 * present, else the category default). Run AFTER generate_scaffold.ts.
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { enrichments, categoryDefaults } from "./patterns.ts";

const COMP = join(import.meta.dirname, "..", "components");
let enriched = 0, skipped = 0;
const usedSpecific = new Set<string>();

for (const cat of readdirSync(COMP)) {
  const catDir = join(COMP, cat);
  if (!statSync(catDir).isDirectory()) continue;
  for (const slug of readdirSync(catDir)) {
    const dir = join(catDir, slug);
    if (!statSync(dir).isDirectory()) continue;
    const metaPath = join(dir, "meta.json");
    let meta: any;
    try { meta = JSON.parse(readFileSync(metaPath, "utf-8")); } catch { skipped++; continue; }

    const key = `${cat}/${slug}`;
    const specific = enrichments[key];
    const e = specific ?? categoryDefaults[cat];
    if (!e) { skipped++; continue; }
    if (specific) usedSpecific.add(key);

    meta.patterns = e.patterns;
    meta.references = e.references;
    meta.designLanguages = e.designLanguages;
    meta.enrichedFrom = specific ? "site-analysis (specific)" : "site-analysis (category default)";
    writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    enriched++;
  }
}

const orphans = Object.keys(enrichments).filter((k) => !usedSpecific.has(k));
console.log(`Enriched ${enriched} meta.json (skipped ${skipped}).`);
console.log(`Specific entries applied: ${usedSpecific.size}/${Object.keys(enrichments).length}.`);
if (orphans.length) console.log("Unmatched specific keys (check slug names):", orphans.join(", "));
