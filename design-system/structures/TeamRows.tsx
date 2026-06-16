import React from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { TeamContent } from "../content/types";

/** Team variant: horizontal rows (monogram + name/role/bio) vs the card grid. */
export const TeamRows: React.FC<{ content: TeamContent; more?: MoreLink }> = ({ content, more }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {content.members.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: "1.4rem", alignItems: "flex-start", padding: "1.4rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
            <div style={{ width: "3.5rem", height: "3.5rem", flexShrink: 0, borderRadius: "var(--ds-radius)", background: "var(--ds-primary-soft)", color: "var(--ds-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ds-font-heading)", fontWeight: 700 }}>{m.initials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <div style={{ display: "flex", gap: "0.7rem", alignItems: "baseline", flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)", margin: 0 }}>{m.name}</h3>
                <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ds-primary)" }}>{m.role}</span>
              </div>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 }}>{m.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
