import React from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { ValuesContent } from "../content/types";

/** Values variant: card grid (vs the divided-columns band). */
export const ValuesCards: React.FC<{ content: ValuesContent; more?: MoreLink }> = ({ content, more }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 4)}, minmax(0,1fr))`, gap: "1.2rem" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div aria-hidden style={{ width: "2.4rem", height: "2.4rem", borderRadius: "var(--ds-radius)", background: "var(--ds-primary-soft)" }} />
            <h4 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)", margin: 0 }}>{v.title}</h4>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 }}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
