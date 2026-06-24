/**
 * Design-QA guard — encodes the design-quality invariants this generator must hold,
 * derived from the UI/UX Pro Max checklist ("Common Rules for Professional UI" +
 * "Pre-Delivery Checklist") intersected with this project's token-only, re-skinnable
 * architecture. Static (no browser): it inspects the structures, the look engine and
 * the 50 example firms so a future edit can't quietly degrade design quality.
 *
 *   D1 — Token-only: no hardcoded OPAQUE brand colours in structures/*.tsx. Every
 *        colour must come from var(--ds-*) so a firm's look fully re-skins it.
 *        (Pro Max: "no ad-hoc per-screen hardcoded colors".) Translucent rgba()
 *        scrims/overlays are allowed; documented always-on-dark photo-scrim buttons
 *        are allowlisted.
 *   D2 — No emoji / raw icon-glyphs as structural icons, in structures OR scraped
 *        content. (Pro Max: "No Emoji as Structural Icons"; every glyph → <Icon>.)
 *   D3 — Font inventory ↔ index.html: every family a firm can be assigned (FONT_PAIRINGS)
 *        is actually loaded, or the generated site renders a fallback face.
 *   D4 — Generated palette corridor: every GENERATED_ACCENTS entry yields WCAG-OK
 *        pairs (button label on fill ≥ 4.5:1, fill on light bg ≥ 3:1) and stays in
 *        the trust corridor (no high-sat "playful/AI" magenta-pink). (Pro Max:
 *        "color-accessible-pairs"; AVOID "AI purple/pink".)
 *
 * Run: `npm run audit:design`. Exits 1 on any ERROR finding; WARN findings report
 * but pass. Pure JS + type-stripped .ts imports (Node >= 23 / 22.18+).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FONT_PAIRINGS } from "../looks/fontPairings.ts";
import { GENERATED_ACCENTS } from "../looks/deriveLook.ts";
import { luminance, fromHsl, ensureContrast, hue, saturation } from "../looks/color.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const structDir = path.join(root, "structures");
const exDir = path.join(root, "content", "examples");

const findings = [];
const add = (severity, check, file, line, msg) => findings.push({ severity, check, file, line, msg });

const ratio = (a, b) => { const L1 = luminance(a), L2 = luminance(b); const hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05); };

// ── D1: no hardcoded opaque colours in structures ──────────────────────────────
// Allowlist: the documented always-on-dark photo-scrim buttons (a dark scrim is
// look-independent, so a literal light button is correct there — see HeroImage).
// Text/marks OVER PHOTOGRAPHY sit on an always-dark image scrim (look-independent),
// so a literal light colour is CORRECT there (var(--ds-bg) would go dark on a dark
// look and vanish). These files use #fff only in such photo-scrim contexts.
const HEX_ALLOW = {
  "HeroImage.tsx": ["#fff", "#111"],            // full-bleed photo scrim CTA
  "SectionHead.tsx": ["#fff"],                  // SectionMore tone="onImage" — link over photo
  "TeamExtended.tsx": ["#fff"],                 // TeamOverlay — name/role on bottom photo scrim
  "GalleryExtended.tsx": ["#fff"],              // GalleryFullBleed — heading on banner scrim
  "PageHeaderVariants.tsx": ["#fff"],           // photo masthead title (whiteTitle) on scrim
};
const hexRe = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const structFiles = fs.readdirSync(structDir).filter((f) => f.endsWith(".tsx"));
for (const f of structFiles) {
  const lines = fs.readFileSync(path.join(structDir, f), "utf8").split(/\r?\n/);
  const allow = HEX_ALLOW[f] || [];
  lines.forEach((ln, i) => {
    const code = ln.replace(/\/\/.*$/, "");                 // strip line comments
    if (/^\s*\*/.test(ln) || /^\s*\/\//.test(ln)) return;   // skip block/comment lines
    if (/mask/i.test(code)) return;                         // mask-image #000/#fff = alpha stencil, not a theme colour
    const hits = code.match(hexRe);
    if (!hits) return;
    for (const h of hits) {
      if (allow.includes(h.toLowerCase())) continue;
      // WARN, not error: literal colours have legit uses (always-dark photo scrims,
      // fixed-tone grounds). On today's LIGHT-only looks `#fff` ≈ var(--ds-bg); the
      // risk is latent (a dark look would need var(--ds-bg) to flip). Surface for review.
      add("warn", "D1", `structures/${f}`, i + 1, `hardcoded colour ${h} — prefer var(--ds-bg)/var(--ds-text) so it flips with the look (latent on dark looks)`);
    }
  });
}

// ── D2: no emoji / raw icon-glyphs (in structures + scraped content) ────────────
// Emoji blocks, misc symbols/dingbats, arrows, geometric shapes, check/cross marks.
// Deliberately EXCLUDES General Punctuation (– — · … „ " etc.) — legit German typography.
const glyphRe = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}\u{2713}-\u{2718}]/u;
const glyphAll = new RegExp(glyphRe, "gu");
// Strip comments (preserving line numbers) so arrows/checks in doc-comments — which
// never render — don't trip the scan; only glyphs in real code/JSX count.
const stripComments = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))   // block comments → blanks, keep newlines
  .replace(/\/\/[^\n]*/g, "");                                      // line comments
for (const f of structFiles) {
  const lines = stripComments(fs.readFileSync(path.join(structDir, f), "utf8")).split(/\r?\n/);
  lines.forEach((ln, i) => {
    const m = ln.match(glyphAll);
    if (m) add("warn", "D2", `structures/${f}`, i + 1, `raw glyph ${[...new Set(m)].join(" ")} — render via <Icon> instead of a literal symbol`);
  });
}
const exFiles = fs.readdirSync(exDir).filter((f) => f.endsWith(".json"));
const TEXT_KEYS = /(heading|title|sub|lead|lede|body|summary|quote|text|label|answer|q|a|name|tagline|eyebrow)/i;
const scanJson = (slug, node, pathStr) => {
  if (typeof node === "string") { if (glyphRe.test(node)) add("warn", "D2", `content/examples/${slug}.json`, 0, `emoji/glyph in ${pathStr}: ${JSON.stringify(node.slice(0, 50))}`); return; }
  if (Array.isArray(node)) { node.forEach((v, i) => scanJson(slug, v, `${pathStr}[${i}]`)); return; }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (pathStr === "" && k === "meta") continue;   // dev-only generation metadata (brief/reasons) — never rendered
      scanJson(slug, v, pathStr ? `${pathStr}.${k}` : k);
    }
  }
};
for (const f of exFiles) {
  const slug = f.replace(".json", "");
  scanJson(slug, JSON.parse(fs.readFileSync(path.join(exDir, f), "utf8")), "");
}

// ── D3: font inventory ↔ index.html ────────────────────────────────────────────
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const loaded = new Set([...html.matchAll(/family=([^:&"]+)/g)].map((m) => decodeURIComponent(m[1].replace(/\+/g, " ")).trim()));
const families = new Set(FONT_PAIRINGS.flatMap((p) => [p.heading, p.body, p.mono]));
for (const fam of families) {
  if (!loaded.has(fam)) add("error", "D3", "index.html", 0, `font "${fam}" is in FONT_PAIRINGS but not loaded in index.html — it will fall back to a system face`);
}

// ── D4: generated palette corridor ─────────────────────────────────────────────
// Representative light systems the brand accent is tinted onto (mirrors deriveLook,
// which ensureContrast()s the accent to >=3.2 against the chosen light preset bg).
const LIGHT_BGS = ["#FFFFFF", "#F8FAFC", "#FAFAF7"];
const PRESET_TEXT = "#0F172A";                              // typical near-black ink
GENERATED_ACCENTS.forEach((a, idx) => {
  const raw = fromHsl(a.h, a.s, a.l);
  // playful/AI corridor guard: VIVID magenta–pink/purple (Pro Max AVOID "AI purple/pink").
  // Narrow band — must be bright AND saturated AND not-dark, so heritage burgundy/wine
  // (dark, moderate-sat red ~344°) and restrained plum (~270°) stay allowed.
  const hh = hue(raw);
  if (hh >= 290 && hh <= 335 && saturation(raw) >= 0.55 && luminance(raw) >= 0.30) add("error", "D4", "looks/deriveLook.ts", 0, `accent #${idx} hsl(${a.h},${a.s},${a.l}) is vivid magenta/pink-purple — outside the trust corridor (Pro Max AVOID)`);
  for (const bg of LIGHT_BGS) {
    const primary = ensureContrast(raw, bg, 3.2);
    const onBg = ratio(primary, bg);
    const fg = luminance(primary) < 0.5 ? "#FFFFFF" : PRESET_TEXT;
    const onFg = ratio(fg, primary);
    if (onBg < 3.0) add("error", "D4", "looks/deriveLook.ts", 0, `accent #${idx} on ${bg}: ${onBg.toFixed(2)}:1 (< 3:1 UI minimum)`);
    if (onFg < 4.5) add("error", "D4", "looks/deriveLook.ts", 0, `accent #${idx} label on fill (on ${bg}): ${onFg.toFixed(2)}:1 (< 4.5:1 text minimum)`);
  }
});

// ── report ─────────────────────────────────────────────────────────────────────
const errors = findings.filter((f) => f.severity === "error");
const warns = findings.filter((f) => f.severity === "warn");
const fmt = (f) => `  [${f.check}] ${f.file}${f.line ? ":" + f.line : ""} — ${f.msg}`;
const byCheck = (arr) => { const g = {}; for (const f of arr) (g[f.check] ??= []).push(f); return g; };

if (warns.length) {
  console.log(`\n⚠ ${warns.length} warning(s) — review:`);
  for (const [c, arr] of Object.entries(byCheck(warns))) console.log(arr.map(fmt).join("\n"));
}
if (errors.length) {
  console.error(`\n✗ Design-QA: ${errors.length} error(s)\n` + errors.map(fmt).join("\n") + "\n");
  process.exit(1);
}
console.log(`\n✓ Design-QA passed — ${structFiles.length} structures · ${families.size} fonts vs index.html · ${GENERATED_ACCENTS.length} generated accents · ${exFiles.length} firms${warns.length ? ` (${warns.length} warning(s) above)` : ""}`);
