/**
 * CtaGradient — a bold gradient CTA band (premium SaaS pattern), token-driven.
 * White text over a primary→secondary gradient. Reduced-motion safe.
 */
import React from "react";
import { Container } from "./primitives";
import { Icon } from "../icons/iconSets";
import type { CtaContent } from "../content/types";

const css = `
@keyframes ds-cta-drift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@media (prefers-reduced-motion: reduce){ .ds-cta-grad{ animation:none !important } }
`;

export const CtaGradient: React.FC<{ content: CtaContent }> = ({ content }) => (
  <section className="ds-cta-grad" style={{
    paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)",
    backgroundImage: "linear-gradient(120deg, var(--ds-primary), var(--ds-secondary), var(--ds-primary))",
    backgroundSize: "200% 200%", animation: "ds-cta-drift 14s ease-in-out infinite",
  }}>
    <style>{css}</style>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.1rem" }}>
        <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display-h2, 2.2rem)", letterSpacing: "var(--ds-headline-tracking)", color: "var(--ds-primary-fg)", margin: 0 }}>
          {content.heading}
        </h2>
        <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1.05rem", lineHeight: 1.55, color: "var(--ds-primary-fg)", opacity: 0.92, maxWidth: "46ch", margin: 0 }}>{content.sub}</p>
        <button style={{
          marginTop: "0.4rem", fontFamily: "var(--ds-font-body)", fontSize: "0.8rem", 
           fontWeight: 600, padding: "0.9rem 1.8rem", borderRadius: "var(--ds-radius-pill)",
          background: "var(--ds-bg)", color: "var(--ds-text)", border: "none", cursor: "pointer" }}>
          {content.button} <Icon name="arrowRight" size={14} style={{ verticalAlign: "-0.1em" }} />
        </button>
      </div>
    </Container>
  </section>
);
