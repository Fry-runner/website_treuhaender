import React from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import type { ValuesContent } from "../content/types";

/** Why-us pillars in a divided column band (briefing §3 values). */
export const Values: React.FC<{ content: ValuesContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 4)}, minmax(0,1fr))`, gap: 0, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", background: "var(--ds-bg)" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ padding: "1.6rem", borderLeft: i === 0 ? "none" : "1px solid var(--ds-border)", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            <div style={{ width: "0.55rem", height: "0.55rem", borderRadius: "9999px", background: "var(--ds-primary)" }} />
            <h4 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)", margin: 0 }}>{v.title}</h4>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 }}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
