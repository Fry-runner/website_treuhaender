/**
 * ResponsiveStyles — one global stylesheet that makes the generated sites adapt
 * to narrow screens WITHOUT annotating every structure. The structures lay out
 * with inline `grid-template-columns`, which a normal class can't override — but
 * an `!important` author rule DOES beat a normal inline declaration, so these
 * structural attribute selectors collapse the common grid patterns on small
 * screens.
 *
 * Matching is done against the inline `style` string the browser serialises, so
 * the patterns are chosen to be serialisation-robust: `repeat(` (every uniform/
 * gallery/footer grid), `1fr 1fr` (duos) and `fr) minmax(` (two-column splits
 * like `minmax(0,2fr) minmax(0,1fr)`). We deliberately do NOT match `1fr auto`
 * toolbars (nav, label→value rows) — they serialise to `…1fr) auto`, which has
 * no `fr) minmax(`, so they keep their intended layout.
 */
import React from "react";

const css = `
/* Media never exceeds its container. */
img, svg, video { max-width: 100%; }

/* Keyboard focus: a visible, token-coloured ring on every interactive element.
   :focus-visible keeps it keyboard-only (no ring on mouse click). Inline styles
   can't express :focus, so the one place focus indication lives is here. */
a:focus-visible, button:focus-visible, [role="button"]:focus-visible,
input:focus-visible, textarea:focus-visible, select:focus-visible, summary:focus-visible {
  outline: 2px solid var(--ds-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
/* Form fields also shift their border to the brand colour on focus. */
input:focus, textarea:focus, select:focus { border-color: var(--ds-primary); }

/* Nav links: a quiet hover/active affordance + a clear current-page indicator. */
.ds-nav-link { transition: color var(--ds-duration, 200ms) var(--ds-ease, ease); }
.ds-nav-link:hover { color: var(--ds-text); }
.ds-nav-link[aria-current="page"] { color: var(--ds-text); font-weight: 600; }

/* Mobile navigation: collapse the inline link cluster into a toggle + dropdown.
   The toggle is hidden on wider screens; .ds-nav-links is an inline row there
   and an absolutely-positioned panel (shown only when data-open) on phones. */
.ds-nav-toggle { display: none; }
@media (max-width: 760px) {
  .ds-nav-toggle { display: inline-flex; }
  .ds-nav-links {
    position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; align-items: flex-start; gap: 0.9rem;
    padding: 1.1rem var(--ds-gutter) 1.4rem;
    background: var(--ds-bg); border-bottom: 1px solid var(--ds-border);
    box-shadow: var(--ds-shadow-card);
    /* animatable open/close (the motion itself lives in MotionStyles, so it stays
       reduced-motion-safe): hidden + offset when closed, out of flow via absolute. */
    opacity: 0; visibility: hidden; transform: translateY(-8px); pointer-events: none;
  }
  .ds-nav-links[data-open="true"] { opacity: 1; visibility: visible; transform: none; pointer-events: auto; }
}

/* Tablet: thin 3+ column content grids down to 2 columns. */
@media (max-width: 900px) {
  [style*="grid-template-columns"][style*="repeat(3,"],
  [style*="grid-template-columns"][style*="repeat(4,"],
  [style*="grid-template-columns"][style*="repeat(5,"],
  [style*="grid-template-columns"][style*="repeat(6,"] { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
}
/* Phone: content grids become a single column (1fr-auto toolbars keep their layout). */
@media (max-width: 560px) {
  [style*="grid-template-columns"][style*="repeat("],
  [style*="grid-template-columns"][style*="1fr 1fr"],
  [style*="grid-template-columns"][style*="fr) minmax("] { grid-template-columns: 1fr !important; }
  /* Feature overlap card: drop the desktop negative overlap on phones (no left bleed). */
  .ds-feat-overlap { margin-left: 0 !important; }
}
`;

export const ResponsiveStyles: React.FC = () => <style>{css}</style>;
