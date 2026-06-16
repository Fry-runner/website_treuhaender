import React from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import type { TeamContent } from "../content/types";

/** Team grid with monogram avatars + role + bio. Token-only. */
export const Team: React.FC<{ content: TeamContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "1.2rem" }}>
        {content.members.map((m, i) => (
          <div key={i} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: "9rem", background: "var(--ds-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "2rem", color: "var(--ds-primary)" }}>{m.initials}</span>
            </div>
            <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0 }}>{m.name}</h3>
              <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-primary)" }}>{m.role}</div>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: "0.3rem 0 0" }}>{m.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
