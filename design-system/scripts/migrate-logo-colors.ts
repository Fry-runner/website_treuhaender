// One-off: apply the new "logo colour fallback" rule to the EXISTING baked example
// JSONs (scraper/output is unavailable here, so we can't re-run the full extract).
// Re-derives each firm's look WITH its logo colour; only rewrites when that actually
// flips the colour source to "logo" (i.e. the page colour wasn't clearly the brand and
// the logo yields a usable accent). Scraped/no-logo firms are left byte-for-byte as-is.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { deriveLook } from "../looks/deriveLook.ts";
import { normHex, toHex, isNeutral, saturation, luminance } from "../looks/color.ts";

async function extractLogoColor(logoSrc?: string): Promise<string | undefined> {
  if (!logoSrc) return undefined;
  const file = join("public", logoSrc.replace(/^\//, ""));
  if (!existsSync(file)) return undefined;
  const chromatic = (hex?: string): hex is string =>
    !!hex && !isNeutral(hex) && saturation(hex) >= 0.2 && luminance(hex) <= 0.92 && luminance(hex) >= 0.035;
  if (/\.svg$/i.test(file)) {
    let txt = ""; try { txt = readFileSync(file, "utf8"); } catch { return undefined; }
    const score: Record<string, number> = {};
    for (const m of txt.matchAll(/(?:fill|stroke|stop-color|color)\s*[:=]\s*["']?\s*(#[0-9a-fA-F]{3,6}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\))/gi)) {
      const v = m[1]; let hex: string | undefined;
      if (v[0] === "#") hex = normHex(v); else { const n = (v.match(/\d+/g) || []).map(Number); hex = toHex(n[0], n[1], n[2]); }
      if (chromatic(hex)) score[hex] = (score[hex] ?? 0) + 1;
    }
    return Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0];
  }
  let sharp: any; try { sharp = (await import("sharp")).default; } catch { return undefined; }
  try {
    const { data, info } = await sharp(file, { failOn: "none" }).resize(64, 64, { fit: "inside" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const buckets: Record<string, { n: number; r: number; g: number; b: number }> = {};
    for (let i = 0; i + ch - 1 < data.length; i += ch) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = ch >= 4 ? data[i + 3] : 255;
      if (a < 128) continue;
      const hex = toHex(r, g, b);
      if (!chromatic(hex)) continue;
      const q = `${r >> 4}-${g >> 4}-${b >> 4}`;
      const bk = (buckets[q] ??= { n: 0, r: 0, g: 0, b: 0 });
      bk.n++; bk.r += r; bk.g += g; bk.b += b;
    }
    const top = Object.values(buckets).sort((a, b) => b.n - a.n)[0];
    if (!top || top.n < 4) return undefined;
    return toHex(Math.round(top.r / top.n), Math.round(top.g / top.n), Math.round(top.b / top.n));
  } catch { return undefined; }
}

const dir = "content/examples";
let changed = 0, scanned = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "active.json")) {
  const slug = f.replace(".json", "");
  const path = join(dir, f);
  const c = JSON.parse(readFileSync(path, "utf8"));
  const brand = c.meta?.brand;
  if (!brand) continue;
  scanned++;
  const logoColor = await extractLogoColor(c.media?.logo);
  const derived = deriveLook(brand, { firmKey: slug, archetype: c.meta?.archetype, logoColor });
  if (derived.colourSource !== "logo") continue;            // scraped/generated → unchanged, don't rewrite
  const before = c.meta?.look?.color?.primary;
  c.meta.look = derived.tokens;
  c.meta.basePresetId = derived.basePresetId;
  c.meta.lookId = derived.basePresetId;
  writeFileSync(path, JSON.stringify(c, null, 2) + "\n");
  changed++;
  console.log(`${slug.padEnd(26)} ${before} → ${derived.tokens.color.primary}  (logo ${logoColor})`);
}
console.log(`\nMigrated ${changed}/${scanned} firms to logo colour (rest unchanged: scraped or no usable logo).`);
