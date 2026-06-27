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

/* Header floating over a DARK home hero → light link text (the quiet default above
   would be invisible). On phones the links live in a SOLID dropdown panel, so the
   media block below forces them back to dark there. */
header[data-nav-tone="dark"] .ds-nav-link { color: rgba(255,255,255,0.82); }
header[data-nav-tone="dark"] .ds-nav-link:hover,
header[data-nav-tone="dark"] .ds-nav-link[aria-current="page"] { color: #fff; }

/* Home hero: a full-height immersive opener (90vh), pulled up under the sticky header
   so the transparent-at-top header floats over it (overlay = negative margin). The
   section centres its own content vertically within that height. */
.ds-home-hero { margin-top: calc(-1 * var(--ds-nav-h, 4.5rem)); }
.ds-home-hero > section { min-height: 90vh; display: flex; flex-direction: column; justify-content: center; }

/* Contact page fills the viewport: the page is a >=100vh flex column (footer pinned to
   the bottom), and the contact section grows to occupy the space between the sticky
   header and the footer with its content optically centred — so a sparse contact page
   never ends mid-screen with a sea of empty space below the footer. The section keeps
   its own padding as minimum breathing room, so it stays balanced (not stretched). */
.ds-motion[data-fill="contact"] { min-height: 100vh; display: flex; flex-direction: column; }
.ds-motion[data-fill="contact"] > .ds-contact-fill { flex: 1 0 auto; display: flex; flex-direction: column; }
.ds-motion[data-fill="contact"] > .ds-contact-fill > section { flex: 1 0 auto; display: flex; flex-direction: column; justify-content: center; }

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
  /* The open dropdown is a solid light panel → keep its links dark even when the bar
     above floats over a dark hero (overrides the inline light colour). */
  header[data-nav-tone="dark"] .ds-nav-links .ds-nav-link { color: var(--ds-text-muted) !important; }
}

/* Always-"filled" card grids (balancedColumns + fillGrid): a flex-wrap row whose full
   rows fill the width exactly and whose PARTIAL last row is CENTRED — so a list never ends
   on a left-stuck orphan ("three on top, one underneath"). Cards size to --ds-fill-basis
   (set inline from the balanced column count); flex-grow:0 keeps the remainder at its real
   width so justify-content:center can pull it to the middle. Collapses to 2 / 1 columns at
   the same breakpoints as the rest of the site's grids below. */
.ds-fill-grid { display: flex; flex-wrap: wrap; justify-content: center; align-items: stretch; }
.ds-fill-grid > * { flex: 0 1 var(--ds-fill-basis, 100%); min-width: 0; }

/* Tablet: thin 3+ column content grids down to 2 columns. */
@media (max-width: 900px) {
  [style*="grid-template-columns"][style*="repeat(3,"],
  [style*="grid-template-columns"][style*="repeat(4,"],
  [style*="grid-template-columns"][style*="repeat(5,"],
  [style*="grid-template-columns"][style*="repeat(6,"] { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .ds-fill-grid > * { flex-basis: calc((100% - var(--ds-fill-gap, 0px)) / 2); }
}
/* Phone: content grids become a single column (1fr-auto toolbars keep their layout). */
@media (max-width: 560px) {
  [style*="grid-template-columns"][style*="repeat("],
  [style*="grid-template-columns"][style*="1fr 1fr"],
  [style*="grid-template-columns"][style*="fr) minmax("] { grid-template-columns: 1fr !important; }
  .ds-fill-grid > * { flex-basis: 100%; }
  /* Bento/mosaic/collage tiles: an item with "grid-area/column: span N" keeps spanning
     even after the grid collapses to one column — the extra span spills into an implicit,
     content-sized auto column (→ horizontal overflow). Drop every explicit span on phones
     so the tiles flow as a single stacked column. */
  [style*="grid-area: span"], [style*="grid-column: span"], [style*="grid-row: span"] {
    grid-area: auto !important;
  }
  /* Feature overlap card: drop the desktop negative overlap on phones (no left bleed). */
  .ds-feat-overlap { margin-left: 0 !important; }
}
`;

export const ResponsiveStyles: React.FC = () => <style>{css}</style>;
