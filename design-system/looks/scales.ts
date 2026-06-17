/**
 * Scale maps — translate the semantic token enums (radius "lg", shadow "md",
 * sectionY "py-20", etc.) into concrete CSS values. This is the only place that
 * knows the numeric meaning of a token step.
 */
const RADIUS: Record<string, string> = {
  none: "0", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem",
};
const SHADOW: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px 0 rgba(15,23,42,0.06)",
  md: "0 12px 34px -12px rgba(15,23,42,0.18)",
  lg: "0 26px 50px -12px rgba(15,23,42,0.28)",
};
const WEIGHT: Record<string, number> = {
  light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800,
};
const TRACKING: Record<string, string> = { wide: "0.05em", wider: "0.1em", widest: "0.18em" };
const DISPLAY: Record<string, string> = {
  "5xl": "clamp(2rem, 1.4rem + 2.6vw, 2.8rem)",
  "6xl": "clamp(2.4rem, 1.6rem + 3.2vw, 3.6rem)",
  "7xl": "clamp(2.6rem, 1.5rem + 4vw, 4.3rem)",
};
// Section-heading (H2) step — a fluid level below the hero display, kept
// proportional to the same displayMax so the modular scale holds at every
// viewport (on mobile the old flat 2rem collapsed to ~hero size; this fixes it).
const DISPLAY_H2: Record<string, string> = {
  "5xl": "clamp(1.5rem, 1.2rem + 1.3vw, 2.1rem)",
  "6xl": "clamp(1.6rem, 1.2rem + 1.7vw, 2.4rem)",
  "7xl": "clamp(1.75rem, 1.25rem + 2vw, 2.7rem)",
};
const HEAD_TRACK: Record<string, string> = { tighter: "-0.04em", tight: "-0.02em", normal: "0" };

export const sectionY = (py: string) => `${Number(py.replace("py-", "")) * 0.25}rem`;
export const radius = (b: string) => RADIUS[b] ?? "0.5rem";
export const shadow = (c: string) => SHADOW[c] ?? "none";
export const weight = (w: string) => WEIGHT[w] ?? 600;
export const tracking = (t: string) => TRACKING[t] ?? "0.1em";
export const display = (d: string) => DISPLAY[d] ?? DISPLAY["6xl"];
export const displayH2 = (d: string) => DISPLAY_H2[d] ?? DISPLAY_H2["6xl"];
export const headTracking = (t: string) => HEAD_TRACK[t] ?? "0";
