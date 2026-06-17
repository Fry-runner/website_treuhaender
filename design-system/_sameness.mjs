import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "content/examples";
const files = readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "active.json");
const firms = files.map((f) => ({ slug: f.replace(/\.json$/, ""), data: JSON.parse(readFileSync(join(dir, f), "utf8")) }));
console.log(`Loaded ${firms.length} firms\n`);

// ---- 1. constant scalar leaf paths (array indices collapsed to []) ----
function* leaves(obj, path = "") {
  if (obj === null || obj === undefined) return;
  if (Array.isArray(obj)) {
    for (const v of obj) yield* leaves(v, path + "[]");
  } else if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) yield* leaves(v, path ? path + "." + k : k);
  } else {
    yield [path, obj];
  }
}

// path -> Map(value -> Set(firm))
const byPath = new Map();
for (const { slug, data } of firms) {
  for (const [p, v] of leaves(data)) {
    if (typeof v !== "string") continue;
    if (!byPath.has(p)) byPath.set(p, new Map());
    const m = byPath.get(p);
    if (!m.has(v)) m.set(v, new Set());
    m.get(v).add(slug);
  }
}

console.log("=== FIELDS WHERE ONE VALUE DOMINATES (>=50% of firms that have the field) ===\n");
const rows = [];
for (const [p, m] of byPath) {
  const firmsWithField = new Set();
  for (const set of m.values()) for (const s of set) firmsWithField.add(s);
  const total = firmsWithField.size;
  if (total < 5) continue; // ignore rare fields
  let top = null, topCount = 0;
  for (const [v, set] of m) if (set.size > topCount) { top = v; topCount = set.size; }
  const frac = topCount / total;
  if (frac >= 0.5 && topCount >= 5) rows.push({ p, top, topCount, total, frac });
}
rows.sort((a, b) => b.frac - a.frac || b.topCount - a.topCount);
for (const r of rows) {
  const val = r.top.length > 70 ? r.top.slice(0, 67) + "..." : r.top;
  console.log(`${(r.frac * 100).toFixed(0).padStart(3)}%  ${r.topCount}/${r.total}  ${r.p}\n        = ${JSON.stringify(val)}`);
}

// ---- 2. global string frequency: appears in how many distinct firms ----
console.log("\n\n=== STRINGS APPEARING IN THE MOST FIRMS (any location) ===\n");
const strFirms = new Map(); // string -> Set(firm)
for (const { slug, data } of firms) {
  for (const [, v] of leaves(data)) {
    if (typeof v !== "string") continue;
    const s = v.trim();
    if (s.length < 3 || s.length > 80) continue;
    if (/^https?:|^\/|\.(png|jpg|jpeg|svg|webp|pdf)$/i.test(s)) continue; // skip urls/paths
    if (!strFirms.has(s)) strFirms.set(s, new Set());
    strFirms.get(s).add(slug);
  }
}
const top = [...strFirms.entries()].map(([s, set]) => ({ s, n: set.size })).filter((x) => x.n >= 5).sort((a, b) => b.n - a.n);
for (const { s, n } of top.slice(0, 60)) console.log(`${String(n).padStart(3)}  ${JSON.stringify(s)}`);
