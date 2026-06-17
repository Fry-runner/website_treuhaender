/**
 * applyLook — the binder between the LOOK layer and the STRUCTURE layer.
 *
 * Takes a DesignTokens preset and returns a flat map of `--ds-*` CSS custom
 * properties. Spread it onto any wrapper element's `style`; every token-only
 * structure component beneath it will re-skin automatically. Because the
 * variables are scoped to the wrapper (not global), multiple looks can coexist
 * on the same page — which is exactly what the playground demonstrates.
 */
import type { CSSProperties } from "react";
import type { DesignTokens } from "../tokens";
import { radius, shadow, sectionY, weight, tracking, display, displayH2, headTracking } from "./scales";
import { ensureContrast, luminance } from "./color";

export type LookVars = CSSProperties & Record<string, string | number>;

export function applyLook(t: DesignTokens): LookVars {
  // Supporting text must stay legible on whichever surface it lands on. Several
  // presets ship a muted grey that fails WCAG AA on their own bg (e.g. boost
  // #94A3B8 ≈ 2.8:1). Enforce ≥4.5:1 against the harder of bg/surface — the one
  // whose luminance sits closest to the muted tone — so the other passes too.
  const lm = luminance(t.color.textMuted);
  const harderBg = Math.abs(luminance(t.color.surface) - lm) < Math.abs(luminance(t.color.bg) - lm)
    ? t.color.surface : t.color.bg;
  const textMuted = ensureContrast(t.color.textMuted, harderBg, 4.5);
  return {
    // colors
    "--ds-bg": t.color.bg,
    "--ds-surface": t.color.surface,
    "--ds-text": t.color.text,
    "--ds-text-muted": textMuted,
    "--ds-border": t.color.border,
    "--ds-primary": t.color.primary,
    "--ds-primary-fg": t.color.primaryFg,
    "--ds-primary-soft": t.color.primarySoft,
    "--ds-secondary": t.color.secondary ?? t.color.primary,
    // type
    "--ds-font-body": t.font.body,
    "--ds-font-heading": t.font.heading,
    "--ds-font-mono": t.font.mono ?? t.font.body,
    "--ds-display": display(t.type.displayMax),
    "--ds-display-h2": displayH2(t.type.displayMax),
    "--ds-headline-weight": weight(t.type.headlineWeight),
    "--ds-headline-tracking": headTracking(t.type.headlineTracking),
    "--ds-body-weight": weight(t.type.bodyWeight),
    "--ds-eyebrow-weight": weight(t.type.eyebrow.weight),
    "--ds-eyebrow-tracking": tracking(t.type.eyebrow.tracking),
    "--ds-eyebrow-transform": t.type.eyebrow.uppercase ? "uppercase" : "none",
    // shape & elevation
    "--ds-radius": radius(t.radius.base),
    "--ds-radius-pill": "9999px",
    "--ds-shadow-card": shadow(t.shadow.card),
    // spacing & motion
    "--ds-section-y": sectionY(t.spacing.sectionY),
    "--ds-container": t.spacing.containerMax,
    "--ds-gutter": t.spacing.gutter,
    "--ds-duration": `${t.motion.durationMs}ms`,
    "--ds-ease": t.motion.easing,
    // scroll-reveal distance/duration scale with the look's motion intensity
    "--ds-reveal-dist": t.motion.intensity === "subtle" ? "10px" : t.motion.intensity === "expressive" ? "26px" : "18px",
    "--ds-reveal-dur": t.motion.intensity === "subtle" ? "500ms" : t.motion.intensity === "expressive" ? "640ms" : "560ms",
    // also set the inherited base so children read sensible defaults
    background: "var(--ds-bg)",
    color: "var(--ds-text)",
    fontFamily: "var(--ds-font-body)",
  };
}
