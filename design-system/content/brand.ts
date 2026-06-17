/**
 * brand.ts — recover a firm's VISUAL CORE from its scrape.
 *
 * The website creator should embody a firm's identity (its colours, logo and —
 * where sensible — its fonts) while dressing it in a newer, better design
 * language. This module extracts only that visual core from the on-disk scrape
 * (scraper/output/<slug>/raw_html/*.html + the image asset manifest). The look
 * layer (looks/deriveLook.ts) then tints a curated modern preset with it.
 *
 * It is deliberately conservative: fonts are adopted only when the scraped face
 * is a recognised quality web font; colours fall back to "none" (let the preset
 * decide) rather than guessing a neutral grey as a brand accent.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { normHex, isNeutral, saturation, hue, luminance } from "../looks/color.ts";

export interface BrandFont {
  family: string;
  serif: boolean;
}
export interface BrandSignals {
  /** Best brand accent (#RRGGBB upper-case) or undefined when none recoverable. */
  primary?: string;
  /** Optional distinct second accent. */
  secondary?: string;
  /** Ranked brandish colours (most→least confident), for diagnostics. */
  palette: string[];
  /** Adopted heading face (only set when scraped font is a quality web font). */
  heading?: BrandFont;
  /** Adopted body face. */
  body?: BrandFont;
  /** Every Google-font family seen (diagnostics). */
  fontsSeen: string[];
  confidence: "high" | "medium" | "low";
}

/** WordPress/Gutenberg default palette + common builder defaults — not brand. */
const DEFAULT_PALETTE = new Set([
  "#F78DA7", "#CF2E2E", "#FF6900", "#FCB900", "#7BDCB5", "#00D084", "#8ED1FC",
  "#0693E3", "#9B51E0", "#ABB8C3", "#EEEEEE", "#313131", "#32373C", "#1E73BE",
]);

// --- font knowledge --------------------------------------------------------
/** Quality web fonts we are happy to carry over (the "wenn sinnvoll" gate). */
const ADOPT_SANS = new Set([
  "Montserrat", "Raleway", "Poppins", "Lato", "Work Sans", "Nunito", "Nunito Sans",
  "Manrope", "Be Vietnam Pro", "Mulish", "Rubik", "Sora", "DM Sans", "Plus Jakarta Sans",
  "Outfit", "Inter", "Figtree", "Albert Sans", "Archivo", "Lexend", "Public Sans",
  "IBM Plex Sans", "Hanken Grotesk", "Space Grotesk", "Karla", "Jost", "Urbanist",
]);
const ADOPT_SERIF = new Set([
  "Playfair Display", "Faustina", "Lora", "Cormorant", "Cormorant Garamond",
  "Source Serif Pro", "Source Serif 4", "Libre Baskerville", "Spectral", "Fraunces",
  "EB Garamond", "Crimson Pro", "DM Serif Display", "Roboto Slab", "Newsreader", "Bitter",
]);
const SERIF_HINT = /(serif|playfair|lora|cormorant|garamond|baskerville|spectral|fraunces|faustina|newsreader|bitter|slab)/i;

function readHtml(slug: string, root: string, max = 4): string {
  const dir = join(root, "scraper", "output", slug, "raw_html");
  if (!existsSync(dir)) return "";
  const files = readdirSync(dir).filter((f) => /\.html?$/i.test(f)).sort().slice(0, max);
  return files.map((f) => { try { return readFileSync(join(dir, f), "utf8"); } catch { return ""; } }).join("\n");
}

function extractColors(html: string): { primary?: string; secondary?: string; palette: string[]; confidence: "high" | "medium" | "low" } {
  const ranked: { hex: string; score: number }[] = [];
  const seen = new Set<string>();
  const add = (raw: string | undefined, score: number) => {
    if (!raw) return;
    const hex = normHex(raw);
    if (!hex || DEFAULT_PALETTE.has(hex) || isNeutral(hex)) return;
    if (seen.has(hex)) { const e = ranked.find((r) => r.hex === hex); if (e) e.score += score; return; }
    seen.add(hex); ranked.push({ hex, score });
  };

  let confidence: "high" | "medium" | "low" = "low";

  // 1) Elementor curated brand colours — highest confidence.
  const eg = (k: string) => (html.match(new RegExp(`--e-global-color-${k}\\s*:\\s*(#[0-9a-fA-F]{3,6})`, "i")) || [])[1];
  const egP = eg("primary"), egS = eg("secondary"), egA = eg("accent");
  if (egP && !isNeutral(normHex(egP) || "#888888")) confidence = "high";
  add(egP, 1000); add(egS, 600); add(egA, 400);

  // 2) CSS vars literally named *brand* — medium confidence.
  for (const m of html.matchAll(/--[\w-]*brand[\w-]*\s*:\s*(#[0-9a-fA-F]{3,6})/gi)) add(m[1], 300);

  // 3) <meta name="theme-color"> — medium, but often white (skipped by isNeutral).
  const tc = (html.match(/name=["']theme-color["'][^>]*content=["'](#[0-9a-fA-F]{3,6})/i) || [])[1];
  if (tc) { add(tc, 250); if (confidence === "low") confidence = "medium"; }

  // 4) Frequency of brandish hex across inline styles/style blocks.
  const freq = new Map<string, number>();
  for (const m of html.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    const hex = m[0].toUpperCase();
    if (DEFAULT_PALETTE.has(hex) || isNeutral(hex)) continue;
    freq.set(hex, (freq.get(hex) || 0) + 1);
  }
  const topFreq = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  if (topFreq.length && topFreq[0][1] >= 6 && confidence === "low") confidence = "medium";
  for (const [hex, n] of topFreq.slice(0, 12)) add(hex, Math.min(n, 200));

  ranked.sort((a, b) => b.score - a.score);
  const palette = ranked.map((r) => r.hex);
  const primary = palette[0];
  // secondary: a genuinely distinct, usable accent — not a near-black/near-grey.
  const secondary = primary
    ? palette.slice(1).find((h) => {
        const dh = Math.abs(((hue(h) - hue(primary)) + 540) % 360 - 180);
        return dh > 40 && saturation(h) > 0.3 && luminance(h) > 0.05 && luminance(h) < 0.75;
      })
    : undefined;
  return { primary, secondary, palette, confidence };
}

function extractFonts(html: string): { heading?: BrandFont; body?: BrandFont; fontsSeen: string[] } {
  const fams = new Set<string>();
  for (const m of html.matchAll(/fonts\.googleapis\.com\/css2?\?([^"'>]+)/gi)) {
    const q = decodeURIComponent(m[1].replace(/&amp;/g, "&"));
    for (const fm of q.matchAll(/family=([^:&|]+)/g)) fams.add(fm[1].replace(/\+/g, " ").trim());
    // legacy css?family=A:...|B:... syntax
    const legacy = (q.match(/family=([^&]+)/) || [])[1];
    if (legacy) for (const part of legacy.split("|")) fams.add(part.split(":")[0].replace(/\+/g, " ").trim());
  }
  const fontsSeen = [...fams].filter(Boolean);
  const adoptable = fontsSeen.map((f) => ({ family: f, serif: SERIF_HINT.test(f) }))
    .filter((f) => ADOPT_SANS.has(f.family) || ADOPT_SERIF.has(f.family));

  const serif = adoptable.find((f) => f.serif);
  const displaySans = adoptable.find((f) => !f.serif && /Montserrat|Raleway|Poppins|Be Vietnam|Sora|Space Grotesk|Outfit|Archivo|Jost|Urbanist|Lexend/.test(f.family));
  const cleanSans = adoptable.find((f) => !f.serif);

  // Heading: prefer a serif (editorial accent) or a distinctive display sans.
  const heading = serif || displaySans;
  // Body: a clean sans (but not the same face we picked for the heading unless it's the only one).
  const body = cleanSans && cleanSans.family !== heading?.family ? cleanSans
    : (!heading?.serif ? undefined : cleanSans);
  return { heading, body, fontsSeen };
}

/**
 * Recover the firm's visual core (colours + fonts) from its scrape. The logo
 * is handled separately by extract.ts's media pool (media.logo), so it is not
 * re-extracted here. `root` = repo root.
 */
export function extractBrand(slug: string, root: string): BrandSignals {
  const html = readHtml(slug, root);
  const { primary, secondary, palette, confidence } = extractColors(html);
  const { heading, body, fontsSeen } = extractFonts(html);
  return { primary, secondary, palette, heading, body, fontsSeen, confidence };
}
