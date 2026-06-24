/**
 * Selection engine — picks a coherent set of variants per firm.
 * Deterministic by firm domain (so a firm always gets the same site), but a
 * `seed` lets you regenerate alternatives. Only ever picks variants compatible
 * with the chosen palette's design-language affinity.
 */
import { presets } from "../tokens";
import { archetypes, type ArchetypeId } from "../blueprints";
import { heroVariants, primaryStyleVariants, presetAffinity, sectionVariants, pageHeaderVariants } from "./registry";
import { kitById, kitsForAffinity } from "./kits";
import { pickPersona } from "../looks/deriveLook";
import { pickIconSet } from "../icons/iconSets";
import type { StyleAffinity } from "../component-inventory";
import type { PrimaryStyle, MoreStyle, SectionAlign } from "../structures/primitives";
import type { SiteContent } from "../content/types";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h | 0);
}
function pick<T>(list: T[], seed: number): T { return list[seed % list.length]; }
function compatible<T extends { looks: StyleAffinity[] }>(list: T[], aff: StyleAffinity): T[] {
  const f = list.filter((v) => v.looks.includes(aff) || v.looks.includes("any"));
  return f.length ? f : list;
}
/** Pick within a kit's allowed ids for an axis; fall back to affinity if the kit
 *  doesn't constrain this axis (or lists nothing that still exists). */
function pickFrom<T extends { id: string; looks: StyleAffinity[] }>(list: T[], allowed: string[] | undefined, aff: StyleAffinity, seed: number): T {
  if (allowed && allowed.length) {
    const inKit = list.filter((v) => allowed.includes(v.id));
    if (inKit.length) return pick(inKit, seed);
  }
  return pick(compatible(list, aff), seed);
}

/** How many real items the firm has for a content slot (Infinity = not item-gated). */
function slotCount(content: SiteContent, slot: string): number {
  switch (slot) {
    case "services": return content.services?.items?.length ?? 0;
    case "values": return content.values?.items?.length ?? 0;
    case "team": return content.team?.members?.length ?? 0;
    case "testimonials": return content.testimonials?.items?.length ?? 0;
    case "stats": return content.stats?.items?.length ?? 0;
    case "faq": return content.faq?.items?.length ?? 0;
    case "gallery": return content.media?.photos?.length ?? 0;
    case "pricing": return content.pricing?.tiers?.length ?? 0;
    case "partners": return (content.media?.badges?.length || content.trust?.items?.length) ?? 0;
    default: return Infinity;
  }
}
const hasHeroImage = (content: SiteContent) => !!(content.hero?.image || content.media?.hero);

/** Whether a slot's per-ITEM images are present, to gate image-only variants.
 *  Services: the media-cards variant needs EVERY card imaged (real OR stock
 *  fallback) — otherwise a card renders an empty placeholder tile. Other slots
 *  aren't item-image-gated here (team is handled by an explicit no-photo override). */
function slotHasImage(content: SiteContent, slot: string): boolean {
  if (slot === "services") {
    const items = content.services?.items ?? [];
    return items.length > 0 && items.every((s) => !!s.image);
  }
  return true;
}

/** Like pickFrom, but skips variants that would look empty for this firm: drops
 *  image-only variants when no real image exists, and variants whose `min` item
 *  count isn't met. Hard image gate widens kit→affinity; the `min` gate falls
 *  back to the closest (lowest-min) fit so a slot always renders something. */
// Trust-first dial (UI/UX taste-skill): a fiduciary avoids GLOW-GRADIENT bands
// (hero/gradient, cta/gradient(-split), stats/gradient-band, pricing/gradient-featured)
// and AUTO-MARQUEES (testimonials/partners/gallery marquee) — both read as SaaS/agency
// tells. Dropped industry-wide from EVERY pool (hero + sections). Scroll-snap "rail"/
// "scroller" stay — they're user-driven, not endless auto-scroll.
const TRUST_OFF_CONCEPT = /\/(gradient|marquee)(-|$)/;
function eligiblePool<T extends { id: string; looks: StyleAffinity[]; min?: number; needsImage?: boolean }>(
  list: T[], allowed: string[] | undefined, aff: StyleAffinity, count: number, hasImage: boolean,
): T[] {
  list = list.filter((v) => !TRUST_OFF_CONCEPT.test(v.id));
  const affPool = compatible(list, aff);
  let pool = affPool;
  if (allowed && allowed.length) {
    const inKit = list.filter((v) => allowed.includes(v.id));
    if (inKit.length) pool = inKit;
  }
  let imgOk = pool.filter((v) => !v.needsImage || hasImage);
  if (!imgOk.length) imgOk = affPool.filter((v) => !v.needsImage || hasImage);
  if (!imgOk.length) imgOk = pool;
  let finalPool = imgOk.filter((v) => (v.min ?? 1) <= count);
  if (!finalPool.length) {
    const lowest = Math.min(...imgOk.map((v) => v.min ?? 1));
    finalPool = imgOk.filter((v) => (v.min ?? 1) === lowest);
  }
  return finalPool;
}
function pickFit<T extends { id: string; looks: StyleAffinity[]; min?: number; needsImage?: boolean }>(
  list: T[], allowed: string[] | undefined, aff: StyleAffinity, seed: number, count: number, hasImage: boolean,
): T {
  return pick(eligiblePool(list, allowed, aff, count, hasImage), seed);
}

/**
 * Trust & Authority selection bias (the Zusammenspiel lever). The proof slots now sit
 * in load-bearing roles — `partners` as the credibility band right under the hero,
 * `stats`/`testimonials` as the social-proof cluster before the CTA — so prefer the
 * AUTHORITATIVE / PERSUASIVE layouts for each over the showy or weak ones. Matched by
 * variant-id suffix; intersected with the firm's eligible pool. Falls back to the full
 * pool when a firm's kit/affinity offers none of the preferred set, so per-firm variety
 * (a core goal) is preserved — this only biases WHICH eligible variant wins, never adds
 * an ineligible one. Source: the UI/UX Pro Max "Trust & Authority" landing pattern.
 */
const TRUST_PREFER: Record<string, string[]> = {
  // a tidy accreditation/logo WALL (Treuhand Suisse, Expert Suisse, GAAP …) — not a
  // gimmicky auto-scroll marquee or a loud tinted/dark band
  partners:     ["strip", "grid", "badges-large", "divided", "boxed", "left-label", "stacked", "columns", "checklist", "two-rows", "bordered", "heading"],
  // bold, legible metric displays
  stats:        ["big-numbers", "panel", "gradient-band", "telemetry", "ring", "divided", "leading", "cards", "bordered-cards", "headline-pair"],
  // prominent, persuasive proof directly before the ask — not a thin minimal list
  testimonials: ["spotlight", "big-quote", "split-rating", "feature-side", "panel", "rating-header", "two-col", "grid", "carousel", "avatar-cards"],
};
function preferTrust<T extends { id: string }>(pool: T[], slot: string): T[] {
  const pref = TRUST_PREFER[slot];
  if (!pref) return pool;
  const narrowed = pool.filter((v) => pref.includes(v.id.split("/")[1] || ""));
  return narrowed.length ? narrowed : pool;
}

/** A section variant's loud visual "treatment". The diversity pass below caps how
 *  many sections on one page may share a loud treatment, so a site never becomes
 *  dark-band-after-dark-band (or all zig-zag). Quiet textures (cards, lists,
 *  bordered grids) are intentionally NOT capped — they're a kit's deliberate
 *  character (e.g. Swiss-grid IS bordered everywhere). */
function archetypeTag(id: string): string {
  const s = id.split("/")[1] ?? id;
  if (/dark|inverted|spotlight/.test(s)) return "dark";
  if (/gradient/.test(s)) return "gradient";
  if (/alternating|zigzag/.test(s)) return "alternating";
  if (/marquee|carousel|scroller|rail/.test(s)) return "rail";
  return "other";
}
/** Max sections per page allowed to share each loud treatment. */
const ARCHETYPE_CAP: Record<string, number> = { dark: 1, gradient: 1, alternating: 2, rail: 2 };

/** Layout FAMILY of a section variant — variants that read as the same structure
 *  share a family. Where ARCHETYPE_CAP limits the page-wide COUNT of a few loud
 *  treatments, this drives the ADJACENCY rule: two sections of the same family
 *  directly stacked make a page look monotonous ("everything looks the same"), so
 *  `decollideSections` keeps them apart — across all families, quiet ones included.
 *  Heuristic by id suffix; an unknown suffix is its own family, so distinct layouts
 *  are never falsely merged. */
export function familyOf(id: string): string {
  const s = (id.split("/")[1] || id).toLowerCase();
  const has = (...k: string[]) => k.some((x) => s.includes(x));
  if (has("dark", "inverted", "spotlight")) return "dark";            // inverted dark band
  if (has("marquee", "scroller", "carousel", "rail")) return "scroll"; // horizontal motion
  if (has("zebra", "stripe")) return "zebra";                         // striped rows
  if (has("accordion", "controlled")) return "accordion";            // single-open list
  if (has("timeline", "dotted-vertical")) return "timeline";         // vertical connector line
  if (has("stepper", "arrow-flow") || s === "horizontal") return "stepper";
  if (has("alternating", "zigzag", "zig-zag")) return "alternating"; // zig-zag rows
  if (has("numbered", "big-index", "big-letter", "watermark", "milestones")) return "numbered";
  if (has("bento", "tiles", "mosaic", "collage")) return "bento";    // asymmetric tiles
  if (has("quote", "statement")) return "quote";                     // large pull-quotes
  if (has("checklist", "banner-list")) return "checklist";           // checkmark band
  if (has("inline-list", "inline-dl", "definition")) return "deflist"; // dt/dd rows
  if (has("bordered", "divided", "plain-divide", "zero-gap")) return "bordered"; // hairline grid
  if (has("minimal")) return "minimal";                              // borderless top-rule grid
  if (has("tinted", "banner", "panel", "gradient-band")) return "tinted"; // soft-tint band
  if (has("split", "sidebar", "feature", "leading", "highlight")) return "split"; // featured asymmetric
  if (has("card", "tile", "circle", "avatar", "polaroid", "masonry", "chip", "pill", "ring", "icon", "grid", "badge", "dots", "top-accent")) return "cards";
  if (has("rows", "list", "two-col", "columns")) return "rows";      // plain stacked rows
  return s;                                                          // distinctive → its own family
}
/** Pick from a gated pool the first variant (rotating from `seed`) whose family is
 *  NOT `avoid`. Returns undefined when the whole pool is that one family. */
function pickAvoiding<T extends { id: string }>(pool: T[], seed: number, avoid: string): T | undefined {
  if (!pool.length) return undefined;
  const start = seed % pool.length;
  for (let k = 0; k < pool.length; k++) {
    const v = pool[(start + k) % pool.length];
    if (familyOf(v.id) !== avoid) return v;
  }
  return undefined;
}

/** An INVERTED very-dark section — `cta/inverted`, `feature/dark`, `stats/dark`, …
 *  All render `background: var(--ds-text)` (near-black on a light look, light on a
 *  dark look). Matched by the `dark`/`inverted` id suffix ONLY — NOT `spotlight`,
 *  which `familyOf` lumps in but which (team/testimonials spotlight) is a light
 *  "featured" layout, not a dark band. */
function isInvertedSection(id: string): boolean {
  return /dark|inverted/.test((id.split("/")[1] || id).toLowerCase());
}
/** First variant in `pool` (rotating from `seed`) that is NOT an inverted dark band. */
function pickNonInverted<T extends { id: string }>(pool: T[], seed: number): T | undefined {
  if (!pool.length) return undefined;
  const start = seed % pool.length;
  for (let k = 0; k < pool.length; k++) {
    const v = pool[(start + k) % pool.length];
    if (!isInvertedSection(v.id)) return v;
  }
  return undefined;
}

/** Perceived lightness (sRGB luma, 0..1) of a hex colour; unknown → 1 (treat light). */
function hexLuma(hex?: string): number {
  if (!hex) return 1;
  const h = hex.replace("#", "").trim();
  const s = h.length === 3 ? h.replace(/(.)/g, "$1$1") : h;
  if (s.length < 6) return 1;
  const n = parseInt(s.slice(0, 6), 16);
  if (Number.isNaN(n)) return 1;
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}
/** Does the site render on a LIGHT background? A light site must never drop a very-dark
 *  inverted band into its flow — that reads as a jarring break. On a genuinely dark
 *  look those bands invert to LIGHT and stay coherent, so they're kept. Uses the
 *  concrete preset planSite was handed (matches a studio look-override AND the curated
 *  base frame), falling back to the firm's brand-tinted look. */
function looksLight(content: SiteContent, lookId: string): boolean {
  const tokens = presets[lookId] ?? content.meta.look ?? presets[content.meta.lookId];
  return hexLuma(tokens?.color?.bg) >= 0.5;
}

export interface SitePlan {
  lookId: string;
  heroId: string;
  /** subpage header variant id — one per firm (subpages consistent), picked to
   *  contrast with the home hero. */
  pageHeaderId: string;
  primaryStyle: PrimaryStyle;
  /** the minimalist section→subpage "view all" link style — one per firm, supplied
   *  site-wide via MoreStyleProvider (consistent within a site, varied across firms). */
  moreStyle: MoreStyle;
  /** section-heading alignment — one per firm so headings don't mix left & centre
   *  across sections (consistency); supplied site-wide via SectionAlignProvider. */
  sectionAlign: SectionAlign;
  affinity: StyleAffinity;
  /** the coherent style kit that constrained this plan */
  kitId: string;
  /** chosen icon set id (icons/iconSets) — supplied via IconSetProvider so every
   *  <Icon> across the site shares one style, like the primary-button style. */
  iconSetId: string;
  /** slot -> chosen section-variant id */
  sections: Record<string, string>;
}

/** Minimalist section→subpage "view all" styles, biased per affinity so the chosen
 *  forward link harmonises with the look. One is picked per firm (deterministic), then
 *  applied site-wide — so these links are consistent within a site but differ across
 *  firms (no single hardcoded "text + arrow"). */
const MORE_STYLES_BY_AFF: Record<string, MoreStyle[]> = {
  // 11 forward-link looks, spread per affinity. `underline` is deliberately NOT first
  // anywhere (it had dominated, so every site showed the same animated line) — it's now
  // just one editorial option among many.
  editorial: ["bracket", "arrow-up", "dot", "underline", "arrow"],
  swiss:     ["boxed", "arrow-box", "bracket", "chevron", "arrow"],
  soft:      ["ghost", "pill-arrow", "chip", "dot", "chevron"],
  warm:      ["pill-arrow", "arrow-up", "ghost", "dot", "chip"],
  any:       ["arrow", "arrow-up", "dot", "bracket", "chip", "ghost", "boxed", "chevron", "arrow-box", "pill-arrow", "underline"],
};
function pickMoreStyle(aff: StyleAffinity, firmKey: string, seed: number): MoreStyle {
  const pool = MORE_STYLES_BY_AFF[aff] ?? MORE_STYLES_BY_AFF.any;
  return pick(pool, hash(firmKey) + seed);
}

/** Choose a palette compatible with the firm's archetype. */
export function pickPalette(archetype: ArchetypeId, seed: number): string {
  const opts = (archetypes[archetype]?.presets ?? []).filter((id) => presets[id]);
  const pool = opts.length ? opts : Object.keys(presets);
  return pick(pool, seed);
}

/** The full variant plan for one firm (palette + kit + hero + button + sections).
 *  A coherent style kit (variants/kits.ts) is chosen first; every axis then only
 *  picks variants the kit allows, so the whole site reads as one system. */
export function planSite(content: SiteContent, opts: { seed?: number; lookId?: string; kitId?: string } = {}): SitePlan {
  const archetype = ((content.meta.archetype as ArchetypeId) || "boutique");
  const base = hash(content.meta.domain || content.meta.firm || "x") + (opts.seed ?? 0);
  const lookId = opts.lookId ?? pickPalette(archetype, base + 2);
  // The firm's DESIGN PERSONA (deriveLook) drives the variant AFFINITY too — so the chosen
  // kit + section variants read in the same character as the persona's shape/type/density
  // (a "swiss-precise" firm gets swiss-minimal layouts, "editorial-heritage" editorial ones).
  // This is what makes the whole site cohere AND firms differ. Same inputs as the look's
  // baked persona (domain + primary), so plan and look always agree. Preset affinity is the
  // fallback when no look exists yet.
  const persona = pickPersona(content.meta.domain || content.meta.firm || "x", content.meta.look?.color?.primary ?? "#000");
  const affinity = persona.affinity ?? presetAffinity[lookId] ?? "any";
  const kit = (opts.kitId ? kitById(opts.kitId) : undefined) ?? pick(kitsForAffinity(affinity), base + 3);
  // Hero variants whose SIGNATURE element is a customer quote (an aside-quote card or a
  // pull-quote lead). Only pick one when the firm has a REAL testimonial — otherwise the
  // aside is empty (no fake firm voice) and the variant collapses to a plain single
  // column, wasting its distinction. No testimonial ⇒ prefer a quote-independent hero.
  const hasQuote = (content.testimonials?.items?.length ?? 0) > 0;
  const QUOTE_HEROES = /^hero\/(split|offset-aside|quote-lead|split-reverse|dark-split)\b/;
  const heroPool = hasQuote ? heroVariants : heroVariants.filter((h) => !QUOTE_HEROES.test(h.id));
  let heroId = pickFit(heroPool, kit.hero, affinity, base, Infinity, hasHeroImage(content)).id;
  // Photo-forward but DIFFERENTIATED across firms. A photo hero is the default strong
  // move, but a ~92% image-full bias made every firm's hero identical — fighting the
  // per-firm differentiation goal. Spread the photo heroes instead: ~58% image-full,
  // ~28% image-split (photo beside text), ~6% image-centered (kept a minority — it
  // lays a heavy wash over the photo so it barely shows), ~8% keep the kit/affinity
  // pick (genuine variety; SiteRouter still guarantees the home is imaged, falling
  // back to a photo hero when the firm has no other imagery).
  if (hasHeroImage(content)) {
    const byId = (re: RegExp) => heroVariants.filter((h) => re.test(h.id));
    const full = byId(/hero\/image-full/);
    const split = byId(/hero\/image-split/);
    const centered = byId(/hero\/image-centered/);
    const r = base % 100;
    if (r < 58 && full.length) heroId = pick(full, base).id;
    else if (r < 86 && split.length) heroId = pick(split, base).id;
    else if (r < 92 && centered.length) heroId = pick(centered, base).id;
    // else (r >= 92): keep the kit/affinity hero chosen above.
  }
  // Subpage header: ONE variant for the whole site (subpages stay consistent), in a
  // different VISUAL FAMILY than the home hero so inner pages don't echo it — a photo
  // hero ⇒ text/toned header; a plain-text hero ⇒ photo/dark/tinted header; etc.
  const heroFamily = /image-|portrait-frame/.test(heroId) ? "photo"
    : /spotlight|dark-split/.test(heroId) ? "dark"
    : /gradient/.test(heroId) ? "tint" : "plain";
  const phFamily = (id: string) => /photo-|image-/.test(id) ? "photo"
    : /dark/.test(id) ? "dark"
    : /brand-band|tint-wash|gradient|banner-tint/.test(id) ? "tint" : "plain";
  const hasSubpageImg = hasHeroImage(content) || (content.media?.photos?.length ?? 0) > 0 || (content.media?.sectionBackgrounds?.length ?? 0) > 0;
  // WARMTH GUARANTEE: every subpage must carry at least one real image. The per-site
  // subpage header is the ONE element present on every subpage (home uses the hero,
  // contact none), so when the firm has any usable image we force it to a PHOTO header
  // — it fronts the firm's real photo, and no inner page is a cold, image-less text
  // band. When the home hero is itself a full-bleed photo, prefer a differently-shaped
  // photo header (framed split / overlap card) so subpages are warm without echoing it.
  // Only a firm with NO usable image at all falls back to a text/brand header.
  const heroIsFullBleedPhoto = /image-(full|centered)|image-band/.test(heroId);
  const photoHeaders = pageHeaderVariants.filter((v) => v.needsImage && !(heroIsFullBleedPhoto && /signature/.test(v.id)));
  const textHeaders = pageHeaderVariants.filter((v) => phFamily(v.id) !== heroFamily);
  const phPool = hasSubpageImg && photoHeaders.length ? photoHeaders : (textHeaders.length ? textHeaders : pageHeaderVariants);
  const pageHeaderId = pickFit(phPool, undefined, affinity, base + hash("page-header"), Infinity, hasSubpageImg).id;
  // Trust-first dial (UI/UX taste-skill): a fiduciary never wears a glassmorphism or
  // glow-gradient CTA — those read as SaaS/agency. Drop them from the button pool so the
  // per-firm button style stays restrained. (Shape variety — offset / bevel / mono /
  // bordered / pill — stays: that's coherent variety, not a slop tell.)
  const TRUST_FIRST_EXCLUDE_BUTTON = new Set(["glass", "bloom", "gradient", "gradientPill", "gradientBorder"]);
  const buttonPool = primaryStyleVariants.filter((b) => !TRUST_FIRST_EXCLUDE_BUTTON.has(b.id));
  const primaryStyle: PrimaryStyle = pickFrom(buttonPool, kit.button, affinity, base + 1).id;
  const iconSetId = pickIconSet(affinity, content.meta.domain || content.meta.firm || "x", opts.seed ?? 0, kit.icons).id;
  const sections: Record<string, string> = {};
  for (const [slot, list] of Object.entries(sectionVariants)) {
    // `min` gates by real item count (sparse firms avoid half-empty multi-col
    // layouts); slotHasImage gates image-only section variants (e.g. services
    // media-cards only when every card has a photo — real or stock fallback).
    // preferTrust then biases the PROOF slots toward authoritative/persuasive
    // layouts within that eligible pool (falls back to the full pool otherwise).
    const pool = eligiblePool(list, kit.sections[slot], affinity, slotCount(content, slot), slotHasImage(content, slot));
    sections[slot] = pick(preferTrust(pool, slot), base + hash(slot)).id;
  }
  // Tonal coherence: on a LIGHT site a very-dark inverted band (cta/inverted,
  // feature/dark, stats/dark …) reads as a jarring break in the otherwise light flow.
  // Swap each to the first eligible NON-inverted variant in the same slot/kit. On a
  // genuinely dark look the inverted bands flip to light and stay coherent → kept.
  const siteLight = looksLight(content, lookId);
  if (siteLight) {
    for (const slot of Object.keys(sectionVariants)) {
      const id = sections[slot];
      if (!id || !isInvertedSection(id)) continue;
      const pool = preferTrust(eligiblePool(sectionVariants[slot], kit.sections[slot], affinity, slotCount(content, slot), slotHasImage(content, slot)), slot);
      const alt = pickNonInverted(pool, base + hash(slot));
      if (alt) sections[slot] = alt.id;
    }
  }
  // Diversity pass: a single loud treatment (dark/gradient bands, zig-zag rows,
  // auto-scroll rails) must not repeat across the page. Over-budget slots swap to
  // the first eligible alternative whose treatment still has headroom. Deterministic;
  // quiet textures (cards/lists/bordered) are uncapped by design.
  const tagCounts: Record<string, number> = {};
  for (const slot of Object.keys(sectionVariants)) {
    const id = sections[slot];
    if (!id) continue;
    const tag = archetypeTag(id);
    const cap = ARCHETYPE_CAP[tag];
    if (cap === undefined) continue;
    if ((tagCounts[tag] ?? 0) < cap) { tagCounts[tag] = (tagCounts[tag] ?? 0) + 1; continue; }
    const pool = preferTrust(eligiblePool(sectionVariants[slot], kit.sections[slot], affinity, slotCount(content, slot), slotHasImage(content, slot)), slot);
    const alt = pool.find((v) => {
      // On a light site, "dark" still has headroom after suppression (count 0), so the
      // generic swap below could pull an inverted band back in — forbid it explicitly.
      if (siteLight && isInvertedSection(v.id)) return false;
      const t = archetypeTag(v.id);
      const c = ARCHETYPE_CAP[t];
      return c === undefined || (tagCounts[t] ?? 0) < c;
    });
    if (alt) {
      sections[slot] = alt.id;
      const t2 = archetypeTag(alt.id);
      if (ARCHETYPE_CAP[t2] !== undefined) tagCounts[t2] = (tagCounts[t2] ?? 0) + 1;
    } else {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1; // no alternative; keep it
    }
  }
  // Page-wide SOFT cap on the "cards" family. Adjacency de-collision keeps two card
  // grids off each other's heels, but a page that is card-grid after card-grid (just
  // not adjacent) is still the "identical card grids repeated endlessly" anti-pattern.
  // Allow at most CARDS_CAP card-family sections; over-budget slots swap to the first
  // in-kit non-cards alternative (so the kit's coherence is preserved). Deterministic.
  const CARDS_CAP = 4;
  let cardsUsed = 0;
  for (const slot of Object.keys(sectionVariants)) {
    const id = sections[slot];
    if (!id || familyOf(id) !== "cards") continue;
    if (cardsUsed < CARDS_CAP) { cardsUsed += 1; continue; }
    const pool = preferTrust(eligiblePool(sectionVariants[slot], kit.sections[slot], affinity, slotCount(content, slot), slotHasImage(content, slot)), slot);
    const alt = pool.find((v) => familyOf(v.id) !== "cards" && !(siteLight && isInvertedSection(v.id)));
    if (alt) sections[slot] = alt.id;
    else cardsUsed += 1; // no non-cards option in this slot/kit → keep it
  }
  // No real person photos (incl. pitch/Kaltakquise mode, where portraits are always
  // stripped): the team variants ALL degrade gracefully to an initials monogram — so
  // don't collapse every photo-less team to a single layout (that made every cold-
  // acquisition site's team read identical). Only the BIG-photo-tile variants look empty
  // as all-monogram; swap just those to a layout that wears monograms well, and keep the
  // kit's pick otherwise for real variety.
  const PHOTO_HEAVY_TEAM = new Set(["team/grid-photo", "team/polaroid", "team/duo", "team/strip", "team/overlay", "team/masonry", "team/cards"]);
  const NO_PHOTO_TEAM = ["team/plain", "team/rows", "team/bordered", "team/minimal-grid", "team/circles", "team/badge-role", "team/numbered", "team/centered-bio", "team/two-col", "team/list-right", "team/circle-row", "team/compact-4"];
  if (sectionVariants.team && !(content.team?.members?.some((m) => m.photo)) && PHOTO_HEAVY_TEAM.has(sections.team)) {
    const noPhoto = sectionVariants.team.filter((v) => NO_PHOTO_TEAM.includes(v.id));
    const alt = pick(compatible(noPhoto, affinity), base + hash("team-nophoto"));
    if (alt) sections.team = alt.id;
  }
  // A 1-2 person team in a multi-column grid reads as sparse (one lonely card). When
  // those few people DO have photos, feature them prominently: a centered solo bio, or
  // two large side-by-side cards. (No-photo small teams keep the clean text block above.)
  const teamMembers = content.team?.members ?? [];
  if (sectionVariants.team && teamMembers.some((m) => m.photo) && teamMembers.length <= 2) {
    sections.team = teamMembers.length === 1 ? "team/centered-bio" : "team/two-col";
  }
  const moreStyle = pickMoreStyle(affinity, content.meta.domain || content.meta.firm || "x", opts.seed ?? 0);
  // One heading alignment per firm (≈1/3 centred, 2/3 left — left is the safer editorial
  // default): keeps section headings consistent instead of mixing left & centre.
  const sectionAlign: SectionAlign = hash((content.meta.domain || content.meta.firm || "x") + "·align") % 3 === 0 ? "center" : "left";
  return { lookId, heroId, pageHeaderId, primaryStyle, moreStyle, sectionAlign, affinity, kitId: kit.id, iconSetId, sections };
}

/** Adjacency de-collision: walk a page's ACTUAL section order and, wherever two
 *  neighbouring sections would render the same layout family (see familyOf), re-pick
 *  the later one from a different family. This is what keeps the page from reading as
 *  the same block stacked over and over. Deterministic; only slots backed by a
 *  variant pool participate (nav/hero/footer/page-header carry no family), and
 *  `locked` slots (e.g. studio overrides) are never re-picked. Returns a new
 *  sections map; pass it as `{ ...plan, sections }` to the renderer. */
export function decollideSections(
  order: string[], plan: SitePlan, content: SiteContent,
  opts: { seed?: number; locked?: Set<string> } = {},
): Record<string, string> {
  const base = hash(content.meta.domain || content.meta.firm || "x") + (opts.seed ?? 0);
  const kit = kitById(plan.kitId);
  // Same tonal-coherence rule as planSite: on a light site the adjacency re-pick must
  // not pull a very-dark inverted band back in (planSite already removed them).
  const siteLight = looksLight(content, plan.lookId);
  const out: Record<string, string> = { ...plan.sections };
  let prevFam: string | null = null;
  for (const slot of order) {
    const list = sectionVariants[slot];
    if (!list) continue;                                  // chrome/structure slot: no family
    let id = out[slot];
    if (id && prevFam && familyOf(id) === prevFam && !opts.locked?.has(slot)) {
      let pool = preferTrust(eligiblePool(list, kit?.sections[slot], plan.affinity, slotCount(content, slot), slotHasImage(content, slot)), slot);
      if (siteLight) { const nd = pool.filter((v) => !isInvertedSection(v.id)); if (nd.length) pool = nd; }
      const alt = pickAvoiding(pool, base + hash(slot), prevFam);
      if (alt) { id = alt.id; out[slot] = id; }
    }
    if (id) prevFam = familyOf(id);
  }
  return out;
}

/** Team layouts that give each person GENEROUS room (big portraits, ≤2 columns,
 *  full-width rows or a featured lead) — used on the standalone Team page instead
 *  of the compact homepage grid. Covers every palette affinity. */
const SPACIOUS_TEAM = [
  "team/two-col",      // 2-col large cards         (warm/soft)
  "team/split-lead",   // lead portrait + grid      (warm/editorial)
  "team/spotlight",    // featured + rest           (warm/editorial)
  "team/centered-bio", // centered avatar + big bio (editorial/warm)
  "team/alternating",  // zig-zag full-width rows   (warm/editorial)
  "team/rows",         // full-width list rows      (editorial/swiss)
];

/** Pick a roomy team layout for the dedicated Team page (≥5 people), honouring
 *  palette affinity and the no-photo rule (text-only stays text-only — we never
 *  fake faces). Returns undefined when no override is warranted, so the caller
 *  keeps the plan's chosen variant. */
export function spaciousTeamVariant(content: SiteContent, plan: SitePlan, seed = 0): string | undefined {
  const members = content.team?.members ?? [];
  if (!members.some((m) => m.photo)) return undefined; // honour the team/plain no-photo force
  const base = hash(content.meta.domain || content.meta.firm || "x") + seed;
  const pool = sectionVariants.team.filter((v) => SPACIOUS_TEAM.includes(v.id) && (v.min ?? 1) <= members.length);
  if (!pool.length) return undefined;
  return pick(compatible(pool, plan.affinity), base + hash("team-page")).id;
}

export const heroById = (id: string) => heroVariants.find((v) => v.id === id) ?? heroVariants[0];

export const pageHeaderById = (id: string) => pageHeaderVariants.find((v) => v.id === id) ?? pageHeaderVariants[0];

/** Resolve the chosen section-variant component for a slot (or undefined). */
export function sectionComponent(slot: string, plan: SitePlan) {
  const list = sectionVariants[slot];
  if (!list) return undefined;
  return (list.find((v) => v.id === plan.sections[slot]) ?? list[0]).component;
}
