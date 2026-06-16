/**
 * Motion system — the animation layer of the design system, distilled from the
 * 20 reference sites + 4 built templates. Defines timing tokens, per-language
 * motion intensity, and a library of named animation presets. references/
 * animations.ts assigns presets to each inventory element.
 *
 * Guiding rule (shared by every great reference site): motion is SUBTLE by
 * default + ONE signature flourish, never gratuitous, always reduced-motion safe.
 */

export interface MotionToken { duration: string; easing: string; }

/** Duration/easing tokens. Map to --ds-duration/--ds-ease per look where useful. */
export const motionTokens: Record<string, MotionToken> = {
  instant: { duration: "120ms", easing: "ease-out" },                    // taps, toggles
  fast:    { duration: "180ms", easing: "cubic-bezier(0.4,0,0.2,1)" },   // hovers
  base:    { duration: "260ms", easing: "cubic-bezier(0.4,0,0.2,1)" },   // state changes
  reveal:  { duration: "520ms", easing: "cubic-bezier(0.16,1,0.3,1)" },  // scroll reveals (expo-out)
  slow:    { duration: "800ms", easing: "cubic-bezier(0.22,1,0.36,1)" }, // hero, premium
  ambient: { duration: "24s",   easing: "ease-in-out" },                 // gradient/blob loops
};

export type MotionIntensity = "subtle" | "moderate" | "expressive" | "high-craft";

/** How much motion each design language uses, and its default feel. */
export const languageMotion: Record<string, { intensity: MotionIntensity; token: string; signature: string }> = {
  "editorial-trust": { intensity: "subtle",     token: "slow",   signature: "slow fades, restrained; gravitas via stillness (Mercury)" },
  "data-precise":    { intensity: "subtle",     token: "fast",   signature: "functional only — interactive widgets snap; no decorative motion (Wise/Vercel)" },
  "swiss-clean":     { intensity: "moderate",   token: "base",   signature: "clean hover + carousel; tidy, never flashy (bexio/Numarics)" },
  "fintech-clean":   { intensity: "moderate",   token: "reveal", signature: "hover lifts + gradient drift + autoplay carousels (Stripe/Qonto)" },
  "soft-friendly":   { intensity: "expressive", token: "reveal", signature: "gentle bouncy reveals, playful hovers (Gusto/Selma)" },
  "dark-premium":    { intensity: "high-craft", token: "reveal", signature: "ambient gradients, mouse-tracking spotlights, layered micro-interactions (Linear/Vercel)" },
};

export interface AnimationPreset {
  id: string;
  trigger: "load" | "scroll-in" | "hover" | "active" | "state-change" | "ambient" | "route";
  transform: string;
  token: string;            // key into motionTokens
  designLanguages: string[]; // languages that use this (["all"] = every)
  note?: string;
}

/** The reusable animation primitives the structures should implement. */
export const animationPresets: Record<string, AnimationPreset> = {
  "fade-up":         { id: "fade-up", trigger: "scroll-in", transform: "opacity 0→1, translateY 20→0px", token: "reveal", designLanguages: ["all"], note: "default section/element entrance; fire once at ~15% in view" },
  "fade-in":         { id: "fade-in", trigger: "scroll-in", transform: "opacity 0→1", token: "base", designLanguages: ["all"], note: "reduced-motion fallback (no transform)" },
  "stagger-children":{ id: "stagger-children", trigger: "scroll-in", transform: "children fade-up, 60–90ms delay step", token: "reveal", designLanguages: ["all"], note: "grids, lists, nav items" },
  "hover-lift":      { id: "hover-lift", trigger: "hover", transform: "translateY -2…-4px + shadow/border emphasis", token: "fast", designLanguages: ["all"], note: "Pilot translateY(-4px)" },
  "hover-darken":    { id: "hover-darken", trigger: "hover", transform: "bg/border color shift", token: "fast", designLanguages: ["all"] },
  "icon-nudge":      { id: "icon-nudge", trigger: "hover", transform: "arrow translateX +4px", token: "fast", designLanguages: ["all"], note: "link-arrow / 'read more'" },
  "press-scale":     { id: "press-scale", trigger: "active", transform: "scale 0.97", token: "instant", designLanguages: ["all"] },
  "underline-grow":  { id: "underline-grow", trigger: "hover", transform: "::after scaleX 0→1, origin bottom-left", token: "base", designLanguages: ["editorial-trust", "swiss-clean", "soft-friendly"], note: "UDS hover-underline-anim" },
  "slide-underline": { id: "slide-underline", trigger: "state-change", transform: "shared-layout (layoutId) underline springs between active items", token: "base", designLanguages: ["all"], note: "active nav indicator (Ruerup/UDS)" },
  "accordion-expand":{ id: "accordion-expand", trigger: "state-change", transform: "height 0→auto + opacity, chevron rotate 180°", token: "base", designLanguages: ["all"] },
  "carousel":        { id: "carousel", trigger: "ambient", transform: "auto-advance crossfade/slide, pause on hover", token: "slow", designLanguages: ["swiss-clean", "fintech-clean", "soft-friendly", "editorial-trust"], note: "testimonials/logos (bexio/Pennylane)" },
  "count-up":        { id: "count-up", trigger: "scroll-in", transform: "number tweens 0→value", token: "slow", designLanguages: ["all"], note: "stats/metrics bands" },
  "logo-marquee":    { id: "logo-marquee", trigger: "ambient", transform: "infinite horizontal scroll; greyscale→color on hover", token: "ambient", designLanguages: ["fintech-clean", "swiss-clean", "editorial-trust"] },
  "gradient-drift":  { id: "gradient-drift", trigger: "ambient", transform: "mesh-gradient position/hue drift", token: "ambient", designLanguages: ["fintech-clean", "dark-premium", "editorial-trust"], note: "Stripe/Vercel hero" },
  "parallax-float":  { id: "parallax-float", trigger: "scroll-in", transform: "subtle Y parallax / slow float on hero product/aside", token: "slow", designLanguages: ["fintech-clean", "dark-premium", "editorial-trust"] },
  "pulse-dot":       { id: "pulse-dot", trigger: "ambient", transform: "scale + opacity ping loop", token: "ambient", designLanguages: ["all"], note: "status/availability dot" },
  "bloom-glow":      { id: "bloom-glow", trigger: "state-change", transform: "colored box-shadow bloom on active/nearest CTA", token: "slow", designLanguages: ["soft-friendly", "fintech-clean", "dark-premium"], note: "Tureva scroll-driven bloom; cubic-bezier(0.16,1,0.3,1)" },
  "line-draw":       { id: "line-draw", trigger: "scroll-in", transform: "divider/accent-bar scaleX 0→1", token: "reveal", designLanguages: ["all"] },
  "image-zoom":      { id: "image-zoom", trigger: "hover", transform: "media scale 1→1.03, overflow hidden", token: "base", designLanguages: ["soft-friendly", "editorial-trust", "swiss-clean"] },
  "modal-scale":     { id: "modal-scale", trigger: "state-change", transform: "backdrop blur-in + dialog scale 0.96→1", token: "base", designLanguages: ["all"] },
  "drawer-expand":   { id: "drawer-expand", trigger: "state-change", transform: "height/opacity expand, item stagger (AnimatePresence)", token: "base", designLanguages: ["all"], note: "mobile menu" },
  "page-transition": { id: "page-transition", trigger: "route", transform: "crossfade + 8px rise (AnimatePresence mode=wait)", token: "base", designLanguages: ["all"] },
  "spotlight":       { id: "spotlight", trigger: "hover", transform: "mouse-tracking radial highlight on card/surface", token: "base", designLanguages: ["dark-premium"], note: "Linear; high-craft only" },
};

export const reducedMotion =
  "Honor prefers-reduced-motion: drop transforms/parallax/ambient loops and keep opacity fades; never gate essential content behind motion. Every reference site respects this (Digits/Betterment explicitly).";
