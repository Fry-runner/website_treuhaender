/**
 * TrustBar — STRUCTURE only (briefing §8.4: certification / partner logo strip).
 * A quiet band of credential chips. Token-only; in production the text chips are
 * swapped for greyscale SVG logos.
 */
import React from "react";
import { Container } from "./primitives";

export const TrustBar: React.FC<{ label: string; items: string[] }> = ({ label, items }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "1.6rem", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "var(--ds-eyebrow-tracking)", color: "var(--ds-text-muted)" }}>
          {label}
        </span>
        {items.map((it) => (
          <span key={it} style={{
            fontFamily: "var(--ds-font-heading)", fontSize: "0.9rem", fontWeight: 600,
            color: "var(--ds-text-muted)", opacity: 0.75, whiteSpace: "nowrap",
          }}>
            {it}
          </span>
        ))}
      </div>
    </Container>
  </section>
);
