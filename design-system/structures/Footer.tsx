import React from "react";
import { Container } from "./primitives";
import { useNavigate } from "../compose/nav-context";
import type { FooterContent } from "../content/types";

/** Multi-column footer (briefing §3 footer). */
export const Footer: React.FC<{ content: FooterContent }> = ({ content }) => {
  const navigate = useNavigate();
  return (
  <footer style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `2fr repeat(${content.columns.length}, 1fr)`, gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.15rem", color: "var(--ds-text)" }}>{content.brand}</div>
          <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0, maxWidth: "34ch" }}>{content.tagline}</p>
        </div>
        {content.columns.map((c) => (
          <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-text-muted)" }}>{c.title}</div>
            {c.links.map((l) => (
              <a key={l} href="#" style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", color: "var(--ds-text)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "2rem", paddingTop: "1.2rem", borderTop: "1px solid var(--ds-border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.6rem", fontFamily: "var(--ds-font-body)", fontSize: "0.82rem", color: "var(--ds-text-muted)" }}>
        <span>© {content.year} {content.brand}</span>
        <span style={{ display: "flex", gap: "1rem" }}>{content.legal.map((l) => <a key={l} href={`/${l.toLowerCase()}`} onClick={(e) => { e.preventDefault(); navigate(`/${l.toLowerCase()}`); }} style={{ color: "var(--ds-text-muted)", textDecoration: "none", cursor: "pointer" }}>{l}</a>)}</span>
      </div>
    </Container>
  </footer>
  );
};
