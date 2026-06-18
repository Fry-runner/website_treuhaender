/**
 * quality_audit — READ-ONLY calibration tool. Recomputes the Tier-1 technical
 * quality score (via the shared ./imageQuality maths) for every photo/hero asset
 * across all generated example firms, by reading the files already in
 * public/images/<slug>/, and prints the distribution + role-floor pass rates +
 * the lowest-scoring shots. Use it to sanity-check / tune the weights and floors.
 * Writes nothing. Run:  node content/quality_audit.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { compositeQuality, rankIn, QUALITY_FLOOR } from "./imageQuality.ts";

const DS = join(import.meta.dirname, "..");
const examplesDir = join(import.meta.dirname, "examples");
const pubPath = (src: string) => join(DS, "public", src); // src begins with /images/...

let sharp: any;
try { sharp = (await import("sharp")).default; } catch { console.error("sharp unavailable — cannot audit."); process.exit(1); }

async function stats(buf: Buffer) {
  try {
    const st = await sharp(buf, { failOn: "none" }).stats();
    const ch = st.channels.slice(0, 3);
    const mean = ch.reduce((s: number, c: any) => s + c.mean, 0) / ch.length;
    const contrast = ch.reduce((s: number, c: any) => s + c.stdev, 0) / ch.length;
    return { entropy: st.entropy ?? 0, sharpness: typeof st.sharpness === "number" ? st.sharpness : NaN, contrast, mean, opaque: st.isOpaque !== false };
  } catch { return undefined; }
}

interface Row { slug: string; src: string; kind: string; subject?: string; w: number; h: number; q: number; stock: boolean; }
const rows: Row[] = [];
const files = readdirSync(examplesDir).filter((f) => f.endsWith(".json") && f !== "active.json");

for (const file of files) {
  const slug = file.replace(/\.json$/, "");
  let content: any;
  try { content = JSON.parse(readFileSync(join(examplesDir, file), "utf8")); } catch { continue; }
  const assets: any[] = (content.media?.assets || []).filter((a: any) => (a.kind === "photo" || a.kind === "hero") && !/\.svg$/i.test(a.src || ""));
  // gather pixel stats per asset (skip files no longer on disk)
  const gathered: { a: any; st: NonNullable<Awaited<ReturnType<typeof stats>>> }[] = [];
  for (const a of assets) {
    const p = pubPath(a.src);
    if (!existsSync(p)) continue;
    const st = await stats(readFileSync(p));
    if (st) gathered.push({ a, st });
  }
  const sv = gathered.map((g) => g.st.sharpness).filter((x) => !Number.isNaN(x)).sort((x, y) => x - y);
  for (const { a, st } of gathered) {
    const px = a.width && a.height ? a.width * a.height : 0;
    const q = compositeQuality({ entropy: st.entropy, sharpRank: rankIn(sv, st.sharpness), contrast: st.contrast, mean: st.mean, opaque: st.opaque, bpp: px ? a.bytes / px : 0 });
    rows.push({ slug, src: a.src, kind: a.kind, subject: a.subject, w: a.width || 0, h: a.height || 0, q, stock: !!a.stock });
  }
}

const qs = rows.map((r) => r.q).sort((a, b) => a - b);
const pct = (p: number) => qs.length ? qs[Math.min(qs.length - 1, Math.floor(p * qs.length))] : 0;
const hist: Record<string, number> = {};
for (const r of rows) { const b = (Math.floor(r.q * 10) / 10).toFixed(1); hist[b] = (hist[b] || 0) + 1; }

console.log(`\n=== Tier-1 quality audit · ${files.length} firms · ${rows.length} photo/hero assets ===\n`);
console.log("distribution (quality bucket → count):");
for (let b = 0; b <= 10; b++) { const k = (b / 10).toFixed(1); const n = hist[k] || 0; console.log(`  ${k}  ${"█".repeat(n)} ${n || ""}`); }
console.log(`\npercentiles  p10=${pct(0.1).toFixed(2)}  p25=${pct(0.25).toFixed(2)}  median=${pct(0.5).toFixed(2)}  p75=${pct(0.75).toFixed(2)}  p90=${pct(0.9).toFixed(2)}`);

const nonFace = rows.filter((r) => r.subject !== "portrait");
const passHero = nonFace.filter((r) => r.w >= 1400 && r.h >= 0 && (r.w / (r.h || 1)) >= 1.15 && r.q >= QUALITY_FLOOR.hero).length;
const landscapeWide = nonFace.filter((r) => r.w >= 1400 && (r.w / (r.h || 1)) >= 1.15).length;
console.log(`\nhero-role eligibility: ${passHero}/${landscapeWide} wide-landscape non-portrait shots clear the q≥${QUALITY_FLOOR.hero} floor`);
const firmsWithHero = new Set(nonFace.filter((r) => r.w >= 1400 && (r.w / (r.h || 1)) >= 1.15 && r.q >= QUALITY_FLOOR.hero).map((r) => r.slug));
console.log(`firms with ≥1 quality hero-role pool asset: ${firmsWithHero.size}/${files.length}`);

// Tier-1.5 prune simulation: non-stock photo/hero with q ≤ floor get removed.
const PRUNE = 0.25;
const prunable = rows.filter((r) => !r.stock && r.q <= PRUNE);
const realPhotosBefore = rows.filter((r) => !r.stock);
const byFirmAfter: Record<string, number> = {};
for (const r of realPhotosBefore) if (r.q > PRUNE) byFirmAfter[r.slug] = (byFirmAfter[r.slug] || 0) + 1;
const firmsEmptied = [...new Set(realPhotosBefore.map((r) => r.slug))].filter((s) => !byFirmAfter[s]);
console.log(`\nTier-1.5 prune (non-stock photo/hero, q≤${PRUNE}): ${prunable.length}/${realPhotosBefore.length} real assets removed`);
console.log(`firms left with 0 real photos after prune (→ stock refills): ${firmsEmptied.length} ${firmsEmptied.length ? "[" + firmsEmptied.join(", ") + "]" : ""}`);

console.log(`\nlowest-scoring 18 photo/hero (audit these — should be graphics/blurry/banners):`);
for (const r of [...rows].sort((a, b) => a.q - b.q).slice(0, 18))
  console.log(`  q=${r.q.toFixed(2)}  ${r.kind.padEnd(5)} ${(r.subject || "").padEnd(8)} ${(r.w + "x" + r.h).padEnd(10)} ${r.slug}/${r.src.split("/").pop()}`);
