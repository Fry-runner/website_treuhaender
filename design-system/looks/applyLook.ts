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
  // SURFACE = full-bleed section bands + cards. A neutral off-the-shelf GREY rarely
  // tones with a brand-coloured site, so on LIGHT looks we replace it with a very faint
  // wash of the brand colour (≈6% toward primary) — subtle enough not to shout, but it
  // always belongs to the palette instead of reading as a generic grey. Dark looks keep
  // their panel (a brand-tinted near-black would erase card definition).
  // SURFACE = section bands + cards. Avoids BOTH a generic grey (clashes with a coloured
  // brand) AND a pastel WASH of the accent (any perceptible accent tint at this lightness
  // reads as "light blue/peach of the brand"; no tint reads as grey — there is no middle).
  // So we drop the FILL distinction entirely: surface = bg, and elements are separated by
  // the structures' existing hairline borders, shadows and spacing (the skill: "group with
  // border / divide / negative space, not a fill"). Genuine accent moments stay on
  // --ds-primary-soft (sparse, intentional). Dark looks keep their distinct panel.
  const bgLight = luminance(t.color.bg) > 0.6;
  const surface = bgLight ? t.color.bg : t.color.surface;
  // Supporting text must clear WCAG AA on EVERY surface it can land on — the page bg,
  // the surface band, AND the faint primary-soft tint that FAQ / feature bands paint.
  // Several presets ship a muted grey that fails on the tinted bands specifically
  // (e.g. #6A7378 ≈ 4.3:1 on a soft tint). Darken progressively against each candidate;
  // the darkest requirement wins, so it passes on all three.
  let textMuted = t.color.textMuted;
  for (const b of [t.color.bg, surface, t.color.primarySoft].filter(Boolean) as string[]) {
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
  // CTA LABEL only: the brand FILL is NEVER altered — we just pick the label colour that
  // reads best on it. Pure WHITE on darker fills, near-BLACK on lighter ones (whichever
  // has the higher contrast against the actual fill). Works for any baked brand colour or
  // a hand-picked accent. (--ds-primary-ink still carries the brand hue for text/links.)
  const DARK_LABEL = "#111111";
  const primaryFill = t.color.primary;
  const primaryFg = contrast("#FFFFFF", primaryFill) >= contrast(DARK_LABEL, primaryFill) ? "#FFFFFF" : DARK_LABEL;
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
    "--ds-surface": surface,
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
    // Guaranteed MINIMUM gap between adjacent sections — added as margin-top on every
    // section block (incl. the first one under the hero), so two sections can never sit
    // tight against each other even when one carries little padding (a thin trust strip,
    // or the full-bleed hero with no bottom padding). Fluid: gentler on phones.
    "--ds-section-gap": "clamp(1rem, 0.5rem + 1.5vw, 1.75rem)",
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
