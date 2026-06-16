import React from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import type { FaqContent } from "../content/types";

/** Objection-handling FAQ (briefing §3 / §10). Native <details> accordion. */
export const Faq: React.FC<{ content: FaqContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {content.items.map((f, i) => (
          <details key={i} style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", background: "var(--ds-surface)", padding: "1rem 1.2rem" }}>
            <summary style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--ds-text)", cursor: "pointer", listStyle: "none" }}>
              {f.q}
            </summary>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: "0.7rem 0 0" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </Container>
  </section>
);
