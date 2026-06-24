/**
 * Blueprints — composition layer (the "Structure" sequencing).
 * Encodes the briefing's canonical Treuhänder homepage backbone (§2.1) and the
 * business-model archetypes (§9) + preset→archetype reading (§4). The generator
 * uses composeHomepage(archetype) to get the ordered slot sequence for a client.
 */
import type { Slot } from "./component-inventory";

export type LayoutSlot = Slot | "nav" | "footer";
export type Presence = "always" | "often" | "optional";

export interface BlueprintSection {
  slot: LayoutSlot;
  presence: Presence;
  note?: string;
}

/**
 * Canonical homepage section order shared by the strongest reference sites (§2.1).
 * NOTE: `presence: "always"` here is the BACKBONE intent; the home still respects the
 * budget in ia-rules.ts (HOME_MAX_CONTENT) — supporting "always" sections like
 * testimonials/faq can be trimmed on an over-stuffed home. Only slots with a renderer
 * appear here; planned-but-unrendered slots (intro/profile/quote/article-body) are
 * intentionally kept out of the backbone (`map` stays as a gated optional).
 */
// Order follows the UI/UX Pro Max "Trust & Authority + Conversion" landing pattern:
// Hero → PROOF (credentials) → SOLUTION → supporting → SOCIAL PROOF → CTA. Hard
// credibility (accreditation badges) sits right under the hero; the persuasive
// proof (stats, named quotes) clusters directly before the conversion ask. Every
// proof slot is still content-gated in plan.ts (kept only with REAL data), so a
// firm without badges/quotes simply collapses that step.
export const canonicalHomepage: BlueprintSection[] = [
  { slot: "nav",          presence: "always",   note: "logo L · nav C · 'Termin buchen' R + language switch" },
  { slot: "hero",         presence: "always",   note: "benefit headline + 2 CTAs + in-hero trust nibble (rating/clients)" },
  // — Proof: immediate credibility under the hero —
  { slot: "partners",     presence: "often",    note: "Treuhand Suisse, Expert Suisse, Swiss GAAP FER, software badges — accreditation up front" },
  // — Solution overview —
  { slot: "services",     presence: "always",   note: "cards; inline 'ab CHF X/Monat' where the model allows" },
  { slot: "values",       presence: "always",   note: "4-6 pillars: digital · transparent · personal · compliant" },
  { slot: "audience",     presence: "often",    note: "industry pages or persona cards" },
  { slot: "process",      presence: "often",    note: "3 steps; reduces switching anxiety" },
  { slot: "team",         presence: "often",    note: "real faces; central for boutique/owner-led" },
  { slot: "pricing",      presence: "often",    note: "tiers or calculator (doubles as lead tool)" },
  { slot: "faq",          presence: "always",   note: "5-8 objection-handling Q&A" },
  // — Social proof directly before the conversion ask —
  { slot: "stats",        presence: "often",    note: "clients, cantons, languages, years" },
  { slot: "testimonials", presence: "always",   note: "named quotes (person·company·city) + aggregate metric/rating" },
  { slot: "map",          presence: "optional", note: "multi-location firms only" },
  { slot: "cta",          presence: "always",   note: "'Bereit? Termin buchen.'" },
  { slot: "contact",      presence: "always",   note: "form + office info + map; booking as primary path" },
  { slot: "footer",       presence: "always",   note: "sitemap, offices, legal (Impressum/Datenschutz), social, © year" },
];

export type ArchetypeId = "swiss-digital" | "boutique" | "intl-conversion";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  reference: string;
  presets: string[];               // recommended preset ids (tokens.ts)
  pricing: "inline" | "hidden";
  heroStyle: string;
  voice: string;
  emphasize: LayoutSlot[];         // force ON / lead with
  downplay: LayoutSlot[];          // drop or de-emphasize
}

/** Business-model archetypes (§9) — pick the one matching the client's reality. */
export const archetypes: Record<ArchetypeId, Archetype> = {
  "swiss-digital": {
    id: "swiss-digital", name: "Swiss digital fiduciary", reference: "Nexova, Findea",
    presets: ["tureva-soft", "swiss-clean", "boost-editorial"],
    pricing: "inline", heroStyle: "benefit + price + rating", voice: "efficient, modern",
    emphasize: ["services", "pricing", "audience", "stats", "partners", "faq"],
    downplay: [],
  },
  "boutique": {
    id: "boutique", name: "Swiss/DE boutique (owner-led)", reference: "Controva, Gruber Renger",
    presets: ["ruerup-swiss", "boost-editorial", "uds-warm-editorial", "dark-premium"],
    pricing: "hidden", heroStyle: "restrained statement", voice: "calm, understated",
    // (profile/quote dropped — no renderer; re-add here once those structures exist.)
    emphasize: ["team", "values", "testimonials"],
    downplay: ["pricing", "map", "audience"],
  },
  "intl-conversion": {
    id: "intl-conversion", name: "Conversion-driven", reference: "Osome, Avalon",
    presets: ["tureva-soft", "swiss-clean", "uds-warm-editorial"],
    pricing: "inline", heroStyle: "benefit + heavy social proof", voice: "warm, witty, direct",
    emphasize: ["testimonials", "audience", "process", "cta"],
    downplay: [],
  },
};

/** Preset → archetype reading (§4) — for picking a look per client. */
export const presetArchetype: Record<string, { reads: string; bestFor: string }> = {
  "boost-editorial":    { reads: "Premium, established", bestFor: "Classic boutique / advisory" },
  "ruerup-swiss":       { reads: "Precise, corporate",   bestFor: "Owner-led Swiss/German practice" },
  "tureva-soft":        { reads: "Friendly, modern",     bestFor: "Startup-focused digital fiduciary" },
  "uds-warm-editorial": { reads: "Boutique, human",      bestFor: "Small relationship-led firm" },
};

/** Resolve the homepage section sequence for a given archetype. */
export function composeHomepage(id: ArchetypeId): BlueprintSection[] {
  const a = archetypes[id];
  return canonicalHomepage
    .filter((s) => !a.downplay.includes(s.slot))
    .map((s) =>
      a.emphasize.includes(s.slot) && s.presence !== "always"
        ? { ...s, presence: "always" as Presence }
        : s,
    );
}
