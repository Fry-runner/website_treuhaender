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
import { radius, shadow, sectionY, weight, tracking, display, headTracking } from "./scales";

export type LookVars = CSSProperties & Record<string, string | number>;

export function applyLook(t: DesignTokens): LookVars {
  return {
    // colors
    "--ds-bg": t.color.bg,
    "--ds-surface": t.color.surface,
    "--ds-text": t.color.text,
    "--ds-text-muted": t.color.textMuted,
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
