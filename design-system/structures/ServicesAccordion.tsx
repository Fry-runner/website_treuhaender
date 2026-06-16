import React, { useState } from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { ServicesContent } from "../content/types";

/** Services variant: single-open accordion (vs card / bordered grids). */
export const ServicesAccordion: React.FC<{ content: ServicesContent; more?: MoreLink; onPick?: (title: string) => void }> = ({ content, more, onPick }) => {
  const [open, setOpen] = useState(0);
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {content.items.map((s, i) => (
            <div key={i} style={{ borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", textAlign: "left", background: open === i ? "var(--ds-surface)" : "var(--ds-bg)", border: "none", cursor: "pointer", padding: "1.1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <span style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", color: "var(--ds-primary)", fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)" }}>{s.title}</span>
                </span>
                <span style={{ color: "var(--ds-primary)", fontSize: "1.3rem", lineHeight: 1 }}>{open === i ? "–" : "+"}</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 1.4rem 1.3rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 }}>{s.summary}</p>
                  {onPick && <button onClick={() => onPick(s.title)} style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-primary)" }}>Mehr erfahren →</button>}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
