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
import { radius, shadow, sectionY, weight, display, displayH2, headTracking, space, spaceBlock, gutter } from "./scales";
import { ensureContrast, luminance, contrast } from "./color";

export type LookVars = CSSProperties & Record<string, string | number>;

export function applyLook(t: DesignTokens): LookVars {
  // Supporting text must clear WCAG AA on EVERY surface it can land on — the page bg,
  // the neutral surface, AND the faint primary-soft tint that FAQ / feature bands paint.
  // Several presets ship a muted grey that fails on the tinted bands specifically
  // (e.g. #6A7378 ≈ 4.3:1 on a soft tint). Darken progressively against each candidate;
  // the darkest requirement wins, so it passes on all three.
  let textMuted = t.color.textMuted;
  for (const b of [t.color.bg, t.color.surface, t.color.primarySoft].filter(Boolean) as string[]) {
    textMuted = ensureContrast(textMuted, b, 4.5);
  }
  // The brand primary used AS TEXT / links on a page surface must stay legible too:
  // vibrant accents (lime, signal-red) fail AA as small text on white. `--ds-primary-ink`
  // is the primary corrected to >=4.5:1 against the harder of bg/surface for text/link
  // roles; the raw `--ds-primary` stays for fills/borders (paired with --ds-primary-fg).
  const lp = luminance(t.color.primary);
  const harderForPrimary = Math.abs(luminance(t.color.surface) - lp) < Math.abs(luminance(t.color.bg) - lp)
    ? t.color.surface : t.color.bg;
  const primaryInk = ensureContrast(t.color.primary, harderForPrimary, 4.5);
  // A primary-FILLED button/CTA must clear AA between its label and the fill. The baked
  // --ds-primary-fg used a crude luminance split (white when primary lum < 0.5), leaving
  // white at ~3.9–4.3:1 on mid-luminance brand colours (a medium blue, a terracotta).
  // Pick the label with the better REAL contrast; if a mid-tone accent leaves even the
  // best below 4.5, darken the FILL just enough for white to clear AA. The brand hue is
  // preserved for text/links via --ds-primary-ink; only genuine mid-tones shift the fill.
  let primaryFill = t.color.primary;
  let primaryFg = contrast("#FFFFFF", primaryFill) >= contrast(t.color.text, primaryFill) ? "#FFFFFF" : t.color.text;
  if (contrast(primaryFg, primaryFill) < 4.5) {
    primaryFill = ensureContrast(primaryFill, "#FFFFFF", 4.5);
    primaryFg = "#FFFFFF";
  }
  // Micro-interaction magnitudes scale with the look's motion intensity, so hover
  // lifts / presses / image zoom / arrow nudges stay COHERENT per firm (a "subtle"
  // look barely moves; an "expressive" one is livelier). Consumed by the global
  // MotionStyles classes (.ds-btn/.ds-card/.ds-nudge/.ds-img-zoom), all of which are
  // gated behind prefers-reduced-motion: no-preference.
  // TRUST-FIRST DIAL (UI/UX taste-skill): a fiduciary is a trust-first industry — the
  // skill's dial table caps MOTION at 2-3 (low). "expressive" (cinematic) reads as a
  // SaaS/agency tell here, so cap it to "moderate" site-wide (calm, never static).
  const ix = t.motion.intensity === "expressive" ? "moderate" : t.motion.intensity;
  const m3 = (s: string, m: string, e: string) => (ix === "subtle" ? s : ix === "expressive" ? e : m);
  return {
    // colors
    "--ds-bg": t.color.bg,
    "--ds-surface": t.color.surface,
    "--ds-text": t.color.text,
    "--ds-text-muted": textMuted,
    "--ds-border": t.color.border,
    "--ds-primary": primaryFill,
    "--ds-primary-ink": primaryInk,
    "--ds-primary-fg": primaryFg,
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
    // (eyebrow CSS vars removed — the Eyebrow primitive renders null site-wide, so
    //  --ds-eyebrow-* advertised a styling capability that no longer exists.)
    // shape & elevation
    "--ds-radius": radius(t.radius.base),
    "--ds-radius-pill": "9999px",
    "--ds-shadow-card": shadow(t.shadow.card),
    // spacing & motion — section padding & gutter are fluid (clamp); --ds-space /
    // --ds-space-block carry the look's rhythm/density into intra-section spacing.
    // Trust-first density (taste-skill): nudge an "airy" rhythm to "normal" so a fiduciary
    // reads substantive, not art-gallery-sparse. Enforced here for already-baked looks too.
    "--ds-section-y": sectionY(t.spacing.sectionY),
    "--ds-space": space(t.spacing.rhythm === "airy" ? "normal" : t.spacing.rhythm),
    "--ds-space-block": spaceBlock(t.spacing.rhythm === "airy" ? "normal" : t.spacing.rhythm),
    "--ds-container": t.spacing.containerMax,
    "--ds-gutter": gutter(t.spacing.gutter),
    "--ds-duration": `${t.motion.durationMs}ms`,
    "--ds-ease": t.motion.easing,
    // scroll-reveal distance/duration scale with the look's motion intensity
    "--ds-reveal-dist": ix === "subtle" ? "10px" : ix === "expressive" ? "26px" : "18px",
    "--ds-reveal-dur": ix === "subtle" ? "500ms" : ix === "expressive" ? "640ms" : "560ms",
    // micro-interaction magnitudes (hover/press/zoom/nudge), intensity-scaled
    "--ds-hover-lift": m3("-2px", "-3px", "-5px"),
    "--ds-hover-dur": `${Math.round(t.motion.durationMs * 0.7)}ms`,
    "--ds-press-scale": m3("0.99", "0.985", "0.97"),
    "--ds-img-zoom": m3("1.012", "1.018", "1.025"),
    "--ds-nudge": m3("2px", "3px", "4px"),
    "--ds-stagger-step": m3("50ms", "70ms", "90ms"),
    "--ds-shadow-hover": "0 18px 40px -16px rgba(0,0,0,0.34)",
    // also set the inherited base so children read sensible defaults
    background: "var(--ds-bg)",
    color: "var(--ds-text)",
    fontFamily: "var(--ds-font-body)",
  };
}
