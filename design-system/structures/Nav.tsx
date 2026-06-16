import React from "react";
import { Container } from "./primitives";
import { useNavigate } from "../compose/nav-context";
import type { NavContent } from "../content/types";

export const Nav: React.FC<{ content: NavContent }> = ({ content }) => {
  const navigate = useNavigate();
  const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); navigate(href); };
  return (
  <header style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--ds-bg)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4.5rem" }}>
      <a href="/" onClick={go("/")} style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.1rem", color: "var(--ds-text)", letterSpacing: "-0.01em", textDecoration: "none", cursor: "pointer" }}>
        {content.brand}
      </a>
      <nav style={{ display: "flex", gap: "1.6rem", alignItems: "center" }}>
        {content.links.map((l) => (
          <a key={l.label} href={l.href} onClick={go(l.href)} style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", color: "var(--ds-text-muted)", textDecoration: "none", cursor: "pointer" }}>
            {l.label}
          </a>
        ))}
        {content.languages.length > 1 && (
          <div style={{ display: "flex", gap: "0.4rem", fontFamily: "var(--ds-font-mono)", fontSize: "0.7rem", textTransform: "uppercase" }}>
            {content.languages.map((lng, i) => (
              <span key={lng} style={{ color: i === 0 ? "var(--ds-text)" : "var(--ds-text-muted)" }}>{lng}</span>
            ))}
          </div>
        )}
        <button onClick={() => navigate("/kontakt")} style={{
          fontFamily: "var(--ds-font-mono)", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em",
          fontWeight: 600, padding: "0.6rem 1.1rem", borderRadius: "var(--ds-radius)",
          background: "var(--ds-primary)", color: "var(--ds-primary-fg)", border: "1px solid var(--ds-primary)", cursor: "pointer",
        }}>
          {content.cta}
        </button>
      </nav>
    </Container>
  </header>
  );
};
