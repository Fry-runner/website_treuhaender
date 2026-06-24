import React from "react";
import { Container, btnBase, primaryStyleProps, usePrimaryStyle } from "./primitives";
import { Icon } from "../icons/iconSets";
import { useNavigate } from "../compose/nav-context";
import type { NavContent } from "../content/types";

/**
 * Site header. Two independent per-firm axes give every firm a distinct header while
 * staying consistent across its own pages (UX rule: navigation-consistency):
 *
 *  • LAYOUT (`HEADER_VARIANTS`) — the desktop arrangement / chrome.
 *  • LINK INDICATOR (`NAVLINK_STYLES`) — how the nav links show hover/current. The
 *    actual treatment lives in MotionStyles (keyed off `data-navlink`), since :hover
 *    and [aria-current] need CSS — so it's no longer one global underline everywhere.
 *
 * All layouts share the same building blocks (brand · mobile toggle · the
 * `.ds-nav-links` cluster of links + the firm-styled CTA) and the SAME responsive
 * contract (ResponsiveStyles collapses `.ds-nav-links` into a dropdown under
 * `.ds-nav-toggle` on phones). Token-only.
 *
 *   classic  — brand left · links + CTA clustered right
 *   split    — brand left · links left · CTA pushed to the far right
 *   center   — brand left · links + CTA centered
 *   elevated — taller bar, larger logo, soft shadow (no hairline), roomier links
 */
const HEADER_VARIANTS = ["classic", "split", "center", "elevated"] as const;
type HeaderVariant = (typeof HEADER_VARIANTS)[number];
const NAVLINK_STYLES = ["underline", "topbar", "pill", "color", "dot"] as const;
function hash(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h | 0); }

export const Nav: React.FC<{ content: NavContent; current?: string; variant?: HeaderVariant }> = ({ content, current, variant }) => {
  const navigate = useNavigate();
  const primaryStyle = usePrimaryStyle();
  const [open, setOpen] = React.useState(false);
  const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); navigate(href); };
  const key = content.brand || "x";
  const v: HeaderVariant = variant ?? HEADER_VARIANTS[hash(key) % HEADER_VARIANTS.length];
  const navLink = NAVLINK_STYLES[hash(key + "·navlink") % NAVLINK_STYLES.length];
  const elevated = v === "elevated";

  // ── shared building blocks (plain JSX factories, not nested components — so the
  //    nav never remounts on toggle, keeping the open/close transition intact) ──
  const brand = (
    <a href="/" onClick={go("/")} style={{ display: "flex", alignItems: "center", fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: elevated ? "1.25rem" : "1.1rem", color: "var(--ds-text)", letterSpacing: "-0.01em", textDecoration: "none", cursor: "pointer", flex: "0 0 auto" }}>
      {content.logo
        ? <img src={content.logo} alt={content.brand} style={{ height: elevated ? "2.5rem" : "2.1rem", width: "auto", maxWidth: "13rem", objectFit: "contain", display: "block" }} />
        : content.brand}
    </a>
  );
  const toggle = (
    <button className="ds-nav-toggle" aria-label="Menü" aria-expanded={open} onClick={() => setOpen((o) => !o)}
      style={{ alignItems: "center", justifyContent: "center", width: "2.6rem", height: "2.6rem", background: "transparent", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", color: "var(--ds-text)", cursor: "pointer", padding: 0, flex: "0 0 auto" }}>
      <Icon name={open ? "close" : "menu"} size={18} />
    </button>
  );
  const cta = (pushRight?: boolean) => (
    // Adopt the firm's site-wide button style; override only sizing to stay compact
    // in the sticky header. pushRight separates it from a left-aligned link row.
    <button className="ds-btn" onClick={() => { setOpen(false); navigate("/kontakt"); }}
      style={{ ...btnBase, ...primaryStyleProps(primaryStyle), fontSize: "0.85rem", padding: "0.7rem 1.3rem", minHeight: "2.75rem", ...(pushRight ? { marginLeft: "auto" } : {}) }}>
      {content.cta}
    </button>
  );
  const links = (justify: React.CSSProperties["justifyContent"], ctaRight?: boolean) => (
    <nav className="ds-nav-links" data-open={open} data-navlink={navLink} style={{ display: "flex", gap: elevated ? "2rem" : "1.6rem", alignItems: "center", flex: 1, justifyContent: justify }}>
      {content.links.map((l) => (
        <a key={l.label} className="ds-nav-link" href={l.href} onClick={go(l.href)} aria-current={current === l.href ? "page" : undefined}
           style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", color: "var(--ds-text-muted)", textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
          {l.label}
        </a>
      ))}
      {cta(ctaRight)}
    </nav>
  );

  // ── per-variant desktop arrangement (mobile is identical: justify-between puts
  //    brand left + toggle right; the flex:1 link cluster is absolute/out-of-flow) ─
  const justify = v === "split" ? "flex-start" : v === "center" ? "center" : "flex-end";
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--ds-bg)", ...(elevated ? { boxShadow: "var(--ds-shadow-card)" } : { borderBottom: "1px solid var(--ds-border)" }) }}>
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", height: elevated ? "5.5rem" : "4.5rem", position: "relative" }}>
        {brand}
        {toggle}
        {links(justify, v === "split")}
      </Container>
    </header>
  );
};
