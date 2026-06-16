import React from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { ServicesContent } from "../content/types";

/** Services variant: zero-gap hairline-divided grid (editorial/swiss feel). */
export const ServicesBordered: React.FC<{ content: ServicesContent; more?: MoreLink; onPick?: (title: string) => void }> = ({ content, more, onPick }) => {
  const cols = Math.min(content.items.length, 3);
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {content.items.map((s, i) => (
            <article key={i} onClick={onPick ? () => onPick(s.title) : undefined} style={{
              padding: "1.6rem", cursor: onPick ? "pointer" : "default", display: "flex", flexDirection: "column", gap: "0.6rem",
              borderLeft: i % cols === 0 ? "none" : "1px solid var(--ds-border)",
              borderTop: i >= cols ? "1px solid var(--ds-border)" : "none",
            }}>
              <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", color: "var(--ds-primary)", fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</div>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0, textTransform: "none" }}>{s.title}</h3>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0, flex: 1 }}>{s.summary}</p>
              {s.price && <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.78rem", color: "var(--ds-primary)", fontWeight: 600 }}>{s.price}</div>}
              <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-text-muted)" }}>Mehr →</span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
