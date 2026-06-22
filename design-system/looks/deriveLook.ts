/**
 * deriveLook — dress a firm's visual core in a newer, better design language.
 *
 * Colour rule (the thing this module guarantees): the accent colour(s) come from
 * the SCRAPE when that colour is suitable and sensible (clearly the brand, not a
 * washed-out / near-white default); otherwise they are GENERATED from a curated,
 * profession-appropriate palette — deterministically per firm, so the result is
 * stable and always tasteful. Either way a clean modern preset supplies the
 * neutral system, type scale, spacing and motion (the "better design language"),
 * and the chosen accent is tinted in with proper contrast.
 *
 * Fonts are still adopted only when the scraped face is a recognised quality web
 * font; otherwise the preset's fonts stay.
 *
 * Pure + browser-safe: BrandSignals is imported as a TYPE only, so the Node-only
 * brand.ts (which reads the filesystem) is never pulled into the Vite bundle.
 */
import { presets, type DesignTokens } from "../tokens.ts";
import type { BrandSignals } from "../content/brand.ts";
import { luminance, mix, ensureContrast, rgb, hue, saturation, fromHsl } from "./color.ts";
import { pickPairing } from "./fontPairings.ts";

/** Light, modern presets we dress brands in (dark-premium excluded by default). */
const WARM_BASES = ["uds-warm-editorial", "tureva-soft", "boost-editorial"];
const COOL_BASES = ["swiss-clean", "zueri-swiss", "quabba-editorial", "ruerup-swiss"];
const EDITORIAL_BASES = ["boost-editorial", "uds-warm-editorial", "quabba-editorial"];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h | 0);
}
const sansStack = (f: string) => `"${f}", ui-sans-serif, system-ui, -apple-system, sans-serif`;
const serifStack = (f: string) => `"${f}", Georgia, "Times New Roman", serif`;
const monoStack = (f: string) => `"${f}", ui-monospace, SFMono-Regular, Menlo, monospace`;

/**
 * Curated accent palette to GENERATE from when the scrape yields no usable brand
 * colour. Tuned to the Treuhänder tonality: trustworthy and restrained — finance
 * blues/navy/steel, precise teals/petrol, stable greens, and a few premium /
 * heritage warm tones (burgundy, wine, bronze). All expressed as HSL with
 * moderate saturation and a confident mid-dark luminance, so every result reads
 * professional on a light neutral system — never neon or playful. `shift` derives
 * a harmonious companion (secondary) accent. Ordered loosely cool → warm.
 */
const GENERATED_ACCENTS: { h: number; s: number; l: number; shift: number }[] = [
  { h: 215, s: 0.58, l: 0.30, shift: 22 },   // deep navy (classic finance trust)
  { h: 222, s: 0.55, l: 0.38, shift: -30 },  // royal blue → teal
  { h: 206, s: 0.40, l: 0.38, shift: 18 },   // steel / slate blue (swiss-precise)
  { h: 200, s: 0.58, l: 0.36, shift: 150 },  // azure + warm pop
  { h: 190, s: 0.55, l: 0.30, shift: -24 },  // petrol
  { h: 178, s: 0.52, l: 0.31, shift: 40 },   // teal
  { h: 168, s: 0.50, l: 0.30, shift: 30 },   // emerald-teal
  { h: 152, s: 0.48, l: 0.32, shift: 28 },   // emerald
  { h: 140, s: 0.42, l: 0.30, shift: -24 },  // forest / pine (stability, growth)
  { h: 246, s: 0.40, l: 0.42, shift: 24 },   // indigo
  { h: 270, s: 0.36, l: 0.40, shift: -26 },  // plum / violet (restrained premium)
  { h: 344, s: 0.45, l: 0.36, shift: -20 },  // burgundy
  { h: 355, s: 0.50, l: 0.32, shift: 188 },  // wine red + cool pop (heritage)
  { h: 6,   s: 0.54, l: 0.34, shift: 200 },  // confident deep red + steel pop
  { h: 32,  s: 0.50, l: 0.38, shift: 184 },  // bronze / ochre + cool pop
  { h: 18,  s: 0.46, l: 0.40, shift: 170 },  // deep terracotta + teal pop
];

/** Circular hue distance (0..180). */
function hueDist(a: number, b: number): number {
  return Math.abs(((a - b + 540) % 360) - 180);
}

/** Choose the modern preset whose design language best frames the brand. */
function pickBase(o: { serif: boolean; accentHue: number; firmKey?: string; seed?: number }): string {
  const seed = hash(o.firmKey || "x") + (o.seed ?? 0);
  let pool: string[];
  if (o.serif) {
    pool = EDITORIAL_BASES;                                   // serif brand → editorial frame
  } else {
    const warm = o.accentHue < 50 || o.accentHue >= 330;      // red / orange / yellow / pink
    pool = warm ? WARM_BASES : COOL_BASES;
  }
  const valid = pool.filter((id) => presets[id]);
  const fallback = Object.keys(presets);
  return (valid.length ? valid : fallback)[seed % (valid.length || fallback.length)];
}

/** The scraped primary, IF it is suitable & sensible to adopt as the brand accent. */
function usableScrapedColour(brand: BrandSignals): string | undefined {
  const p = brand.primary;
  if (!p) return undefined;
  if (brand.confidence === "low") return undefined;   // not clearly the brand → logo/generate
  if (saturation(p) < 0.18) return undefined;          // washed-out / greyish → logo/generate
  if (luminance(p) > 0.92) return undefined;           // near-white → logo/generate
  return p;
}

/** A colour recovered from the LOGO, IF it is a real chromatic accent (not a washed-out
 *  near-white or a monochrome black/grey mark). Used as the fallback when the scraped
 *  page colour isn't clearly the brand — the logo IS the brand, so its colour wins over
 *  a generated guess. No confidence dimension: the caller (extract) already vetted it. */
function usableLogoColour(c?: string): string | undefined {
  if (!c) return undefined;
  if (saturation(c) < 0.20) return undefined;          // greyscale / near-monochrome logo
  if (luminance(c) > 0.92 || luminance(c) < 0.02) return undefined; // near-white / true-black (a saturated dark navy/green stays)
  return c;
}

/**
 * A deterministic, tasteful generated accent pair for a firm. When a `hintHue`
 * is given (e.g. the firm DID have a scraped colour but it was too weak to adopt
 * verbatim), the palette entry nearest that hue is chosen — so the generated
 * accent still leans toward the brand's colour family. With no hint, the firm
 * key (+seed) picks deterministically.
 */
function generatedAccent(firmKey: string, seed: number, hintHue?: number): { primary: string; secondary: string } {
  let a: typeof GENERATED_ACCENTS[number];
  if (hintHue === undefined) {
    a = GENERATED_ACCENTS[(hash(firmKey || "x") + (seed | 0)) % GENERATED_ACCENTS.length];
  } else {
    a = GENERATED_ACCENTS.reduce((best, c) => (hueDist(c.h, hintHue) < hueDist(best.h, hintHue) ? c : best), GENERATED_ACCENTS[0]);
  }
  const primary = fromHsl(a.h, a.s, a.l);
  const secondary = fromHsl((a.h + a.shift + 360) % 360, Math.min(0.72, a.s + 0.05), Math.min(0.5, a.l + 0.06));
  return { primary, secondary };
}

export type ColourSource = "scraped" | "logo" | "generated";
export interface DerivedLook {
  tokens: DesignTokens;
  basePresetId: string;
  /** Where the accent colour(s) came from. */
  colourSource: ColourSource;
  notes: string[];
}

export function deriveLook(
  brand: BrandSignals,
  opts: { firmKey?: string; archetype?: string; seed?: number; logoColor?: string } = {},
): DerivedLook {
  const notes: string[] = [];

  // 1) Decide the accent. The LOGO's own colour ALWAYS wins — the logo IS the brand
  //    identity. ONLY when the logo is greyscale/monochrome (usableLogoColour → undefined)
  //    do we fall back to the scraped page colour when it's clearly the brand; and only
  //    when neither is determinable, a generated, profession-appropriate accent.
  const logo = usableLogoColour(opts.logoColor);
  const scraped = logo ? undefined : usableScrapedColour(brand);
  const colourSource: ColourSource = logo ? "logo" : scraped ? "scraped" : "generated";
  // A rejected-but-present logo/scraped colour still hints the generated hue family.
  const hintHue = opts.logoColor ? hue(opts.logoColor) : (brand.primary ? hue(brand.primary) : undefined);
  const gen = generatedAccent(opts.firmKey || "x", opts.seed ?? 0, hintHue);
  const accentPrimary = logo ?? scraped ?? gen.primary;
  const accentSecondary = scraped ? brand.secondary : (logo ? undefined : gen.secondary); // logo/scraped secondary may be undefined

  // 2) Frame it in a modern preset chosen for the effective accent hue.
  const basePresetId = pickBase({ serif: !!brand.heading?.serif, accentHue: hue(accentPrimary), firmKey: opts.firmKey, seed: opts.seed });
  notes.push(`base: ${basePresetId}`);
  const t: DesignTokens = structuredClone(presets[basePresetId]);
  const bg = t.color.bg;

  // 3) Tint the accent(s) in with proper contrast.
  const primary = ensureContrast(accentPrimary, bg, 3.2);
  t.color.primary = primary;
  t.color.primaryFg = luminance(primary) < 0.5 ? "#FFFFFF" : t.color.text;
  t.color.primarySoft = mix(bg, primary, 0.08);          // faint wash for highlight backgrounds
  if (accentSecondary) {
    const sec = ensureContrast(accentSecondary, bg, 3.0);
    t.color.secondary = sec;
    t.color.secondaryFg = luminance(sec) < 0.5 ? "#FFFFFF" : t.color.text;
  } else {
    t.color.secondary = primary;
    t.color.secondaryFg = t.color.primaryFg;
  }
  if (t.background.bloom) {
    const [r, g, b] = rgb(primary);
    t.background.bloom = `rgba(${r},${g},${b},0.18)`;
  }
  if (colourSource === "scraped") {
    notes.push(brand.primary === primary
      ? `accent ${primary} (scraped · ${brand.confidence})`
      : `accent ${brand.primary} → ${primary} (scraped · raised for contrast)`);
  } else if (colourSource === "logo") {
    notes.push(opts.logoColor === primary
      ? `accent ${primary} (logo)`
      : `accent ${opts.logoColor} → ${primary} (logo · raised for contrast)`);
  } else {
    notes.push(brand.primary
      ? `accent ${primary} (generated · scraped ${brand.primary} rejected: ${brand.confidence}; no usable logo colour)`
      : `accent ${primary} (generated · no scraped or logo colour)`);
  }

  // 4) Fonts — adopt the firm's REAL faces when the scrape recovered a quality
  //    web font; otherwise pick a varied pairing from the font inventory so two
  //    firms don't collapse onto the same default type. The pairing stays within
  //    the preset's heading role (serif brand → editorial) for coherence. Mono is
  //    never a scraped brand signal, so it always comes from the inventory — that
  //    also varies the eyebrow/label face across firms.
  const role = brand.heading?.serif ? "serif-editorial" : t.font.headingRole;
  const pair = pickPairing(role, opts.firmKey || basePresetId, opts.seed ?? 0);
  if (brand.heading) {
    t.font.heading = brand.heading.serif ? serifStack(brand.heading.family) : sansStack(brand.heading.family);
    t.font.headingRole = brand.heading.serif ? "serif-editorial" : "display-geometric";
    notes.push(`heading: ${brand.heading.family} (scraped)`);
  } else {
    t.font.heading = pair.serif ? serifStack(pair.heading) : sansStack(pair.heading);
    t.font.headingRole = pair.role;
    notes.push(`heading: ${pair.heading} (inventory)`);
  }
  if (brand.body) {
    t.font.body = sansStack(brand.body.family);
    notes.push(`body: ${brand.body.family} (scraped)`);
  } else {
    t.font.body = sansStack(pair.body);
    notes.push(`body: ${pair.body} (inventory)`);
  }
  t.font.mono = monoStack(pair.mono);
  notes.push(`mono: ${pair.mono} (inventory)`);

  t.meta = {
    ...t.meta,
    id: opts.firmKey ? `${opts.firmKey}-brand` : `${t.meta.id}-brand`,
    name: `${t.meta.name} · ${colourSource === "scraped" ? "brand-tinted" : colourSource === "logo" ? "logo-tinted" : "brand-generated"}`,
    source: `${t.meta.source} + ${colourSource === "scraped" ? "scraped brand" : colourSource === "logo" ? "logo colour" : "generated accent"}`,
    derived: [...(t.meta.derived ?? []), ...notes],
  };
  return { tokens: t, basePresetId, colourSource, notes };
}

/** Google-font families an applied look needs the page to load. */
export function fontsToLoad(brand: BrandSignals): string[] {
  return [brand.heading?.family, brand.body?.family].filter((f): f is string => !!f);
}
