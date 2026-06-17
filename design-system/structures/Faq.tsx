import React from "react";
import { Container } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead } from "./SectionHead";
import type { FaqContent } from "../content/types";

/** Objection-handling FAQ (briefing §3 / §10). Native <details> accordion. */
export const Faq: React.FC<{ content: FaqContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <style>{`.ds-faq-d .ds-faq-chev{transition:transform .2s ease}.ds-faq-d[open] .ds-faq-chev{transform:rotate(180deg)}`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {content.items.map((f, i) => (
          <details key={i} className="ds-faq-d" style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", background: "var(--ds-surface)", padding: "1rem 1.2rem" }}>
            <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--ds-text)", cursor: "pointer", listStyle: "none" }}>
              <span>{f.q}</span>
              <span className="ds-faq-chev" aria-hidden style={{ color: "var(--ds-text-muted)", display: "inline-flex", flexShrink: 0 }}><Icon name="chevronDown" size={18} /></span>
            </summary>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: "0.7rem 0 0" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </Container>
  </section>
);
