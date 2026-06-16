import React from "react";
import { Container } from "./primitives";
import type { StatsContent } from "../content/types";

/** Metrics band: big number + label, divided cells. */
export const Stats: React.FC<{ content: StatsContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: 0, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ padding: "1.8rem", textAlign: "center", borderLeft: i === 0 ? "none" : "1px solid var(--ds-border)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "2.4rem", color: "var(--ds-text)", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
