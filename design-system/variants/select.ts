/**
 * Selection engine — picks a coherent set of variants per firm.
 * Deterministic by firm domain (so a firm always gets the same site), but a
 * `seed` lets you regenerate alternatives. Only ever picks variants compatible
 * with the chosen palette's design-language affinity.
 */
import { presets } from "../tokens";
import { archetypes, type ArchetypeId } from "../blueprints";
import { heroVariants, primaryStyleVariants, presetAffinity, sectionVariants } from "./registry";
import { kitById, kitsForAffinity } from "./kits";
import { pickIconSet } from "../icons/iconSets";
import type { StyleAffinity } from "../component-inventory";
import type { PrimaryStyle } from "../structures/primitives";
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
function eligiblePool<T extends { id: string; looks: StyleAffinity[]; min?: number; needsImage?: boolean }>(
  list: T[], allowed: string[] | undefined, aff: StyleAffinity, count: number, hasImage: boolean,
): T[] {
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

export interface SitePlan {
  lookId: string;
  heroId: string;
  primaryStyle: PrimaryStyle;
  affinity: StyleAffinity;
  /** the coherent style kit that constrained this plan */
  kitId: string;
  /** chosen icon set id (icons/iconSets) — supplied via IconSetProvider so every
   *  <Icon> across the site shares one style, like the primary-button style. */
  iconSetId: string;
  /** slot -> chosen section-variant id */
  sections: Record<string, string>;
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
  const affinity = presetAffinity[lookId] ?? "any";
  const kit = (opts.kitId ? kitById(opts.kitId) : undefined) ?? pick(kitsForAffinity(affinity), base + 3);
  let heroId = pickFit(heroVariants, kit.hero, affinity, base, Infinity, hasHeroImage(content)).id;
  // Bias HARD toward a LARGE, FULL-BLEED image hero whenever the firm has a usable
  // image — a big photo hero is the default look. ~92% full-bleed (image-full/
  // centered), ~7% large photo incl. split, ~1% keep kit pick. We never force the
  // small framed portrait hero here (not "großflächig").
  if (hasHeroImage(content)) {
    const big = heroVariants.filter((h) => /hero\/image-(full|centered)/.test(h.id));
    const wide = heroVariants.filter((h) => /hero\/image-(full|centered|split)/.test(h.id));
    const r = base % 100;
    if (r < 92 && big.length) heroId = pick(big, base).id;
    else if (r < 99 && wide.length) heroId = pick(wide, base).id;
  }
  const primaryStyle: PrimaryStyle = pickFrom(primaryStyleVariants, kit.button, affinity, base + 1).id;
  const iconSetId = pickIconSet(affinity, content.meta.domain || content.meta.firm || "x", opts.seed ?? 0, kit.icons).id;
  const sections: Record<string, string> = {};
  for (const [slot, list] of Object.entries(sectionVariants)) {
    // `min` gates by real item count (sparse firms avoid half-empty multi-col
    // layouts); slotHasImage gates image-only section variants (e.g. services
    // media-cards only when every card has a photo — real or stock fallback).
    sections[slot] = pickFit(list, kit.sections[slot], affinity, base + hash(slot), slotCount(content, slot), slotHasImage(content, slot)).id;
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
    const pool = eligiblePool(sectionVariants[slot], kit.sections[slot], affinity, slotCount(content, slot), slotHasImage(content, slot));
    const alt = pool.find((v) => {
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
  // No real person photos → force the tile-free text team layout, so employee
  // cards never show empty placeholder image tiles (we never fake faces with stock).
  if (sectionVariants.team && !(content.team?.members?.some((m) => m.photo))) sections.team = "team/plain";
  return { lookId, heroId, primaryStyle, affinity, kitId: kit.id, iconSetId, sections };
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
  const out: Record<string, string> = { ...plan.sections };
  let prevFam: string | null = null;
  for (const slot of order) {
    const list = sectionVariants[slot];
    if (!list) continue;                                  // chrome/structure slot: no family
    let id = out[slot];
    if (id && prevFam && familyOf(id) === prevFam && !opts.locked?.has(slot)) {
      const pool = eligiblePool(list, kit?.sections[slot], plan.affinity, slotCount(content, slot), slotHasImage(content, slot));
      const alt = pickAvoiding(pool, base + hash(slot), prevFam);
      if (alt) { id = alt.id; out[slot] = id; }
    }
    if (id) prevFam = familyOf(id);
  }
  return out;
}

export const heroById = (id: string) => heroVariants.find((v) => v.id === id) ?? heroVariants[0];

/** Resolve the chosen section-variant component for a slot (or undefined). */
export function sectionComponent(slot: string, plan: SitePlan) {
  const list = sectionVariants[slot];
  if (!list) return undefined;
  return (list.find((v) => v.id === plan.sections[slot]) ?? list[0]).component;
}
