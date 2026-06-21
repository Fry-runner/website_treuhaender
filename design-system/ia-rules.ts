/**
 * IA composition rules — the SINGLE source of truth for the homepage budget, the
 * supporting-section drop order, and the owner-page preview map.
 *
 * Imported by BOTH the renderer (`compose/SiteRouter.tsx`) and the guard
 * (`scripts/audit-ia.mjs`), so a rule change is enforced in one place instead of
 * being mirrored by hand (the guard used to re-parse these out of the renderer
 * source with regexes — fragile, and silently stale when the renderer changed).
 *
 * Keep this file dependency-free (no React, no heavy imports) so the Node guard can
 * import it directly under TS type-stripping.
 */

/** A focused Treuhänder home shows ~this many CONTENT sections, not 12. */
export const HOME_MAX_CONTENT = 8;

/**
 * When the home exceeds the budget, drop the lowest-priority SUPPORTING sections —
 * generic/proof/secondary first. Never hero/services/cta/contact, never values/team
 * (those are not in this list, so they are never dropped). The renderer applies a
 * CONTENT-STRENGTH tie-break on top of this order (a section the firm has little real
 * material for is dropped before a richer one); this list is the priority baseline.
 */
export const HOME_DROP_ORDER: string[] = ["stats", "process", "audience", "testimonials", "gallery", "partners", "faq"];

export interface PreviewRule {
  /** owner subpage pageType this section belongs to */
  type: string;
  /** "view all" link label shown on the teaser */
  label: string;
  /** max items shown in the teaser (the full set lives on the owner page) */
  cap: number;
}

/**
 * Owner-page principle: a section with a dedicated OWNER page renders FULL only on
 * that page; everywhere else (home + other subpages) it shows a capped preview with
 * an integrated "view all" link — never a full duplicate, never a separate band.
 */
export const PREVIEW: Record<string, PreviewRule> = {
  services: { type: "services", label: "Alle Leistungen",   cap: 3 },
  team:     { type: "team",     label: "Team kennenlernen", cap: 3 },
  values:   { type: "about",    label: "Mehr über uns",     cap: 3 },
  gallery:  { type: "about",    label: "Mehr Einblicke",    cap: 6 },
  pricing:  { type: "pricing",  label: "Alle Pakete",       cap: 3 },
};

/**
 * On the home, when several sections preview the SAME subpage (e.g. `values` AND
 * `gallery` both → /ueber-uns) keep exactly ONE — earlier in this list = preferred.
 */
export const PREVIEW_PREF: string[] = ["services", "team", "pricing", "values", "gallery"];
