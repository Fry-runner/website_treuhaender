import React from "react";
import { Container, btnBase, primaryStyleProps, usePrimaryStyle } from "./primitives";
import { Icon } from "../icons/iconSets";
import { useNavigate } from "../compose/nav-context";
import type { NavContent } from "../content/types";

export const Nav: React.FC<{ content: NavContent; current?: string }> = ({ content, current }) => {
  const navigate = useNavigate();
  const primaryStyle = usePrimaryStyle();
  const [open, setOpen] = React.useState(false);
  const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); navigate(href); };
  return (
  <header style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--ds-bg)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4.5rem", position: "relative" }}>
      <a href="/" onClick={go("/")} style={{ display: "flex", alignItems: "center", fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.1rem", color: "var(--ds-text)", letterSpacing: "-0.01em", textDecoration: "none", cursor: "pointer" }}>
        {content.logo
          ? <img src={content.logo} alt={content.brand} style={{ height: "2.1rem", width: "auto", maxWidth: "12rem", objectFit: "contain", display: "block" }} />
          : content.brand}
      </a>

      {/* Mobile menu toggle — hidden ≥561px via the global ResponsiveStyles rule. */}
      <button
        className="ds-nav-toggle"
        aria-label="Menü"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          alignItems: "center", justifyContent: "center", width: "2.6rem", height: "2.6rem",
          background: "transparent", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)",
          color: "var(--ds-text)", cursor: "pointer", padding: 0,
        }}
      >
        <Icon name={open ? "close" : "menu"} size={18} />
      </button>

      {/* Link cluster — inline row on desktop; collapses to a dropdown panel on
          phones (see .ds-nav-links rules in ResponsiveStyles, toggled by data-open). */}
      <nav className="ds-nav-links" data-open={open} style={{ display: "flex", gap: "1.6rem", alignItems: "center" }}>
        {content.links.map((l) => (
          <a key={l.label} className="ds-nav-link" href={l.href} onClick={go(l.href)}
             aria-current={current === l.href ? "page" : undefined}
             style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", color: "var(--ds-text-muted)", textDecoration: "none", cursor: "pointer" }}>
            {l.label}
          </a>
        ))}
        <button className="ds-btn" onClick={() => { setOpen(false); navigate("/kontakt"); }} style={{
          // Adopt the firm's site-wide button style (fill/outline/pill/gradient…) so the
          // header CTA matches every other Button on the site, then override only the
          // sizing to keep the nav CTA compact within the sticky header.
          ...btnBase,
          ...primaryStyleProps(primaryStyle),
          fontSize: "0.85rem", padding: "0.7rem 1.3rem", minHeight: "2.75rem",
        }}>
          {content.cta}
        </button>
      </nav>
    </Container>
  </header>
  );
};
