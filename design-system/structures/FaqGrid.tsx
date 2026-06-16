import React from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import type { FaqContent } from "../content/types";

/** FAQ variant: static two-column Q&A grid (vs the single-open accordion). */
export const FaqGrid: React.FC<{ content: FaqContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.6rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--ds-text)", margin: 0 }}>{f.q}</h3>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 }}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
