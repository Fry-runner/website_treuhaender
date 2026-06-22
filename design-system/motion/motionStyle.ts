/**
 * Motion STYLE — the per-design-direction animation PERSONALITY, distinct from the
 * intensity MAGNITUDE (subtle/moderate/expressive set by the look's motion token).
 *
 * Two orthogonal axes compose:
 *   • intensity (magnitude) → how far things move      (applyLook → --ds-hover-* vars)
 *   • style     (character) → how they move + signature (this file → data-motion attr)
 *
 * Each style KIT (variants/kits.ts) maps to one of a few motion families. MotionStyles.tsx
 * defines the easing + hover signature per family, selected via the `data-motion`
 * attribute on the `.ds-motion` root. Families distilled from references/motion.ts
 * (languageMotion): editorial = slow restrained fades; precise = clean snappy/functional;
 * soft = bouncy playful; premium = smooth glow/gradient; bold = dramatic high-contrast.
 */
export type MotionStyleId = "editorial" | "precise" | "soft" | "premium" | "bold";
/** All motion families — exposed in the studio / Durchwinken overlay for manual pick. */
export const MOTION_STYLE_IDS: MotionStyleId[] = ["editorial", "precise", "soft", "premium", "bold"];

/** kit id (variants/kits.ts) → motion family. */
const KIT_MOTION: Record<string, MotionStyleId> = {
  "editorial-minimal": "editorial",
  "boutique-luxe": "editorial",
  "editorial-magazine": "editorial",
  "warm-editorial": "editorial",
  "mono-quiet": "editorial",
  "swiss-grid": "precise",
  "corporate-trust": "precise",
  "modern-tech": "precise",
  "soft-rounded": "soft",
  "playful-soft": "soft",
  "premium-gradient": "premium",
  "bold-dark": "bold",
};

/** Resolve the motion family for a kit; `precise` is the neutral default. */
export function motionStyleForKit(kitId?: string): MotionStyleId {
  return (kitId && KIT_MOTION[kitId]) || "precise";
}
