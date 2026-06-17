/**
 * TrustBar — STRUCTURE only (briefing §8.4: certification / partner logo strip).
 * A quiet band of credential chips. When real badge logos are supplied (from the
 * media pool) they render as greyscale marks; otherwise the text chips are shown.
 */
import React from "react";
import { Container } from "./primitives";

export const TrustBar: React.FC<{ label: string; items: string[]; badges?: string[] }> = ({ label, items, badges }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "1.6rem", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.8rem", fontWeight: 600, color: "var(--ds-text-muted)" }}>
          {label}
        </span>
        {badges && badges.length
          ? badges.map((src) => (
              <img key={src} src={src} alt="" style={{
                height: "2.2rem", width: "auto", maxWidth: "9rem", objectFit: "contain",
                filter: "grayscale(1)", opacity: 0.7,
              }} />
            ))
          : items.map((it) => (
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
