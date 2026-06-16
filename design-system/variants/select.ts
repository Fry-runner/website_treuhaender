/**
 * Selection engine — picks a coherent set of variants per firm.
 * Deterministic by firm domain (so a firm always gets the same site), but a
 * `seed` lets you regenerate alternatives. Only ever picks variants compatible
 * with the chosen palette's design-language affinity.
 */
import { presets } from "../tokens";
import { archetypes, type ArchetypeId } from "../blueprints";
import { heroVariants, primaryStyleVariants, presetAffinity, sectionVariants } from "./registry";
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

export interface SitePlan {
  lookId: string;
  heroId: string;
  primaryStyle: PrimaryStyle;
  affinity: StyleAffinity;
  /** slot -> chosen section-variant id */
  sections: Record<string, string>;
}

/** Choose a palette compatible with the firm's archetype. */
export function pickPalette(archetype: ArchetypeId, seed: number): string {
  const opts = (archetypes[archetype]?.presets ?? []).filter((id) => presets[id]);
  const pool = opts.length ? opts : Object.keys(presets);
  return pick(pool, seed);
}

/** The full variant plan for one firm (palette + hero structure + button style). */
export function planSite(content: SiteContent, opts: { seed?: number; lookId?: string } = {}): SitePlan {
  const archetype = ((content.meta.archetype as ArchetypeId) || "boutique");
  const base = hash(content.meta.domain || content.meta.firm || "x") + (opts.seed ?? 0);
  const lookId = opts.lookId ?? pickPalette(archetype, base + 2);
  const affinity = presetAffinity[lookId] ?? "any";
  const heroId = pick(compatible(heroVariants, affinity), base).id;
  const primaryStyle = pick(compatible(primaryStyleVariants, affinity), base + 1).id;
  const sections: Record<string, string> = {};
  for (const [slot, list] of Object.entries(sectionVariants)) {
    sections[slot] = pick(compatible(list, affinity), base + hash(slot)).id;
  }
  return { lookId, heroId, primaryStyle, affinity, sections };
}

export const heroById = (id: string) => heroVariants.find((v) => v.id === id) ?? heroVariants[0];

/** Resolve the chosen section-variant component for a slot (or undefined). */
export function sectionComponent(slot: string, plan: SitePlan) {
  const list = sectionVariants[slot];
  if (!list) return undefined;
  return (list.find((v) => v.id === plan.sections[slot]) ?? list[0]).component;
}
