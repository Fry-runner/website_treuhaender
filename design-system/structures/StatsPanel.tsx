import React from "react";
import { Container } from "./primitives";
import { CountUp } from "../motion/CountUp";
import type { StatsContent } from "../content/types";

/** Stats variant: tinted panel with centered numbers (vs the bordered divided band). */
export const StatsPanel: React.FC<{ content: StatsContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "2.2rem", display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "2.4rem", color: "var(--ds-primary)", lineHeight: 1 }}><CountUp value={s.value} /></div>
            <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
