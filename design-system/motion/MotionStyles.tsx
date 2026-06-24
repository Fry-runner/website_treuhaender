/**
 * MotionStyles — the global micro-interaction layer for the generated site.
 *
 * PHILOSOPHY (set by the user): elements that EFFECTIVELY ACT AS BUTTONS are clearly
 * animated; everything else is much subtler, if animated at all.
 *   • ANIMATED — every <button> / [role="button"] / .ds-btn, AND a whole card that is
 *     itself clickable (role="button" / tabindex / inline cursor:pointer). They get a
 *     hover lift + press, with a per-STYLE-family signature on the styled CTAs (.ds-btn).
 *     Disclosure/tab toggles (aria-expanded / aria-selected) get only a brightness nudge —
 *     a lift would visually detach an accordion header from its panel.
 *   • SUBTLE — .ds-card display cards: NO lift, only a faint shadow/border on hover.
 *     .ds-img-zoom: a barely-there scale. .ds-nudge: a small arrow slide.
 *
 * TWO orthogonal axes compose on the animated elements:
 *   • MAGNITUDE — intensity-scaled vars from applyLook (--ds-hover-lift/-dur/-press-scale).
 *   • CHARACTER — the motion STYLE family (motionStyle.ts) via the `data-motion` attribute
 *     on the .ds-motion root: editorial / precise / soft / premium / bold.
 *
 * Whole sheet inside `@media (prefers-reduced-motion: no-preference)` — reduced-motion
 * users get the static design. Section entrance is handled by <Reveal> (--ds-reveal-ease,
 * also per family). Scoped under .ds-motion so only generated-site markup is touched.
 */
import React from "react";

const M = (sels: string[], suffix = "") => sels.map((s) => `.ds-motion ${s}${suffix}`).join(",\n  ");

/** All button-ish elements (get the shared transition + press + brightness). */
const BTNISH = [`button`, `[role="button"]`, `.ds-btn`];
/** Whole cards that are themselves clickable (navigate on click). */
const CLICKCARD = [`.ds-card[role="button"]`, `.ds-card[tabindex]`, `.ds-card[style*="cursor: pointer"]`, `.ds-card[style*="cursor:pointer"]`];
/** Elements that LIFT on hover: action buttons (NOT disclosure/tab toggles) + clickable cards. */
const NOTOGGLE = `:not([aria-expanded]):not([aria-selected]):not(.ds-nav-toggle)`;
const LIFT = [`.ds-btn`, `button${NOTOGGLE}`, `[role="button"]${NOTOGGLE}`, ...CLICKCARD];

const CSS = `
@media (prefers-reduced-motion: no-preference) {
  /* ── per-family easing (hover + scroll-reveal) ─────────────────────────── */
  .ds-motion[data-motion="editorial"] { --ds-ease-hover: cubic-bezier(0.33,1,0.68,1);    --ds-reveal-ease: cubic-bezier(0.33,1,0.68,1); }
  .ds-motion[data-motion="precise"]   { --ds-ease-hover: cubic-bezier(0.4,0,0.2,1);      --ds-reveal-ease: cubic-bezier(0.4,0,0.2,1); }
  .ds-motion[data-motion="soft"]      { --ds-ease-hover: cubic-bezier(0.16,1,0.3,1);     --ds-reveal-ease: cubic-bezier(0.16,1,0.3,1); }
  .ds-motion[data-motion="premium"]   { --ds-ease-hover: cubic-bezier(0.22,1,0.36,1);    --ds-reveal-ease: cubic-bezier(0.22,1,0.36,1); }
  .ds-motion[data-motion="bold"]      { --ds-ease-hover: cubic-bezier(0.5,0,0.1,1);      --ds-reveal-ease: cubic-bezier(0.22,1,0.36,1); }

  /* ════ ANIMATED: every button-ish element + clickable cards ════ */
  ${M([...BTNISH, ...CLICKCARD])} {
    transition: transform var(--ds-hover-dur,200ms) var(--ds-ease-hover,var(--ds-ease,ease-out)),
                box-shadow var(--ds-hover-dur,200ms) var(--ds-ease-hover,var(--ds-ease,ease-out)),
                border-color var(--ds-hover-dur,200ms) var(--ds-ease-hover,var(--ds-ease,ease-out)),
                filter var(--ds-hover-dur,200ms) var(--ds-ease-hover,var(--ds-ease,ease-out));
  }
  /* universal feedback: every button-ish gets a brightness lift + a press */
  ${M(BTNISH, ":hover")} { filter: brightness(1.05); }
  ${M([...BTNISH, ...CLICKCARD], ":active")} { transform: scale(var(--ds-press-scale,0.985)); }

  /* the lift: action buttons (not toggles/tabs) + clickable cards */
  ${M(LIFT, ":hover")} { transform: translateY(var(--ds-hover-lift,-3px)); }
  /* clickable cards also gain the card shadow + accent border */
  ${M(CLICKCARD, ":hover")} {
    box-shadow: var(--ds-shadow-hover,0 18px 40px -16px rgba(0,0,0,0.34));
    border-color: var(--ds-primary);
  }

  /* per-family BUTTON signature — the style character lives on the styled CTAs */
  .ds-motion[data-motion="editorial"] .ds-btn:hover { transform: none; box-shadow: inset 0 -2px 0 var(--ds-primary); filter: brightness(1.02); }
  .ds-motion[data-motion="soft"] .ds-btn:hover     { transform: translateY(var(--ds-hover-lift,-3px)) scale(1.02); box-shadow: 0 12px 28px -8px var(--ds-primary); filter: brightness(1.04); }
  .ds-motion[data-motion="premium"] .ds-btn:hover  { transform: translateY(var(--ds-hover-lift,-4px)); box-shadow: 0 14px 38px -10px var(--ds-primary); filter: brightness(1.08); }
  .ds-motion[data-motion="bold"] .ds-btn:hover     { transform: translateY(calc(var(--ds-hover-lift,-3px) * 1.4)); box-shadow: 0 16px 34px -10px rgba(0,0,0,0.5); filter: brightness(1.1); }

  /* ════ SUBTLE: display (non-interactive) cards — faint, NO lift ════ */
  .ds-motion .ds-card { transition: box-shadow var(--ds-hover-dur,200ms) var(--ds-ease-hover,var(--ds-ease,ease-out)),
                                    border-color var(--ds-hover-dur,200ms) var(--ds-ease-hover,var(--ds-ease,ease-out)); }
  .ds-motion .ds-card:hover { box-shadow: var(--ds-shadow-card); border-color: var(--ds-text-muted); }

  /* arrow nudge — small slide marking an interactive affordance */
  .ds-motion .ds-nudge svg,
  .ds-motion .ds-nudge .ds-arrow { transition: transform var(--ds-hover-dur,200ms) var(--ds-ease-hover,var(--ds-ease,ease-out)); }
  .ds-motion .ds-nudge:hover svg,
  .ds-motion .ds-nudge:hover .ds-arrow { transform: translateX(var(--ds-nudge,3px)); }

  /* image zoom — kept barely-there (decorative) */
  .ds-motion .ds-img-zoom { overflow: hidden; }
  .ds-motion .ds-img-zoom img,
  .ds-motion .ds-img-zoom .ds-zoom { transition: transform calc(var(--ds-hover-dur,200ms) * 2) var(--ds-ease-hover,var(--ds-ease,ease-out)); will-change: transform; }
  .ds-motion .ds-img-zoom:hover img,
  .ds-motion .ds-img-zoom:hover .ds-zoom { transform: scale(var(--ds-img-zoom,1.02)); }

  /* ════ OPENING: disclosures (section accordions) + the mobile menu ════ */
  /* Every section accordion is a <button aria-expanded> followed by its panel as a
     sibling — so the open panel fades+slides in generically, no per-component class.
     The nav hamburger is excluded (it animates via the menu transition below). */
  @keyframes ds-disclose { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
  .ds-motion [aria-expanded="true"]:not(.ds-nav-toggle) ~ *,
  .ds-motion details[open] > summary ~ * {
    animation: ds-disclose calc(var(--ds-hover-dur,200ms) * 1.4) var(--ds-ease-hover,var(--ds-ease,ease-out)) both;
  }

  /* Mobile hamburger menu: animate the dropdown open (Responsive.tsx holds the
     open/closed visibility states; this only adds the motion). */
  /* FAIL-SAFE open animation: the open state is already statically visible
     (Responsive.tsx), so the menu shows even if the animation never runs (headless /
     reduced-motion); the keyframe just adds the fade+slide on top. A transition was
     avoided on purpose — a transitioned opacity/visibility can get stuck hidden. */
  .ds-motion .ds-nav-links[data-open="true"] {
    animation: ds-disclose calc(var(--ds-hover-dur,200ms) * 1.4) var(--ds-ease-hover,var(--ds-ease,ease-out));
  }

  /* Header links: the hover/current INDICATOR. The default is an underline that grows
     from the left; a data-navlink attribute on .ds-nav-links swaps it per firm (set in
     Nav.tsx) so the header links differ across sites instead of one global underline. */
  .ds-motion .ds-nav-link { position: relative; }
  .ds-motion .ds-nav-link::after {
    content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 1.5px;
    background: var(--ds-primary); transform: scaleX(0); transform-origin: left;
    transition: transform var(--ds-hover-dur,200ms) var(--ds-ease-hover,var(--ds-ease,ease-out));
  }
  .ds-motion .ds-nav-link:hover::after,
  .ds-motion .ds-nav-link[aria-current="page"]::after { transform: scaleX(1); }

  /* ── per-firm indicator variants ── */
  /* topbar: the same growing bar, but at the TOP edge */
  .ds-motion .ds-nav-links[data-navlink="topbar"] .ds-nav-link::after { bottom: auto; top: -3px; }
  /* color: no bar at all — the link just darkens (Responsive.tsx :hover/[aria-current]) */
  .ds-motion .ds-nav-links[data-navlink="color"] .ds-nav-link::after { display: none; }
  /* pill: a soft-tinted rounded highlight fades in instead of a bar */
  .ds-motion .ds-nav-links[data-navlink="pill"] .ds-nav-link::after { display: none; }
  .ds-motion .ds-nav-links[data-navlink="pill"] .ds-nav-link {
    padding: 0.42rem 0.8rem; border-radius: var(--ds-radius-pill, 9999px);
    transition: background-color var(--ds-hover-dur,200ms) var(--ds-ease-hover,var(--ds-ease,ease-out));
  }
  .ds-motion .ds-nav-links[data-navlink="pill"] .ds-nav-link:hover,
  .ds-motion .ds-nav-links[data-navlink="pill"] .ds-nav-link[aria-current="page"] { background: var(--ds-primary-soft); }
  /* dot: a small centred dot scales in below the link */
  .ds-motion .ds-nav-links[data-navlink="dot"] .ds-nav-link::after {
    left: 50%; right: auto; width: 5px; height: 5px; bottom: -6px; border-radius: 9999px;
    transform: translateX(-50%) scale(0); transform-origin: center;
  }
  .ds-motion .ds-nav-links[data-navlink="dot"] .ds-nav-link:hover::after,
  .ds-motion .ds-nav-links[data-navlink="dot"] .ds-nav-link[aria-current="page"]::after { transform: translateX(-50%) scale(1); }
}
`;

export const MotionStyles: React.FC = () => <style>{CSS}</style>;
