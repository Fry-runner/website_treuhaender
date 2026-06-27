import React from "react";
import { Container, PORTRAIT_FOCUS } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import { balancedColumns, fillGrid } from "./grid";
import type { TeamContent } from "../content/types";

/** Team grid with monogram avatars + role + bio. Token-only. */
export const Team: React.FC<{ content: TeamContent; more?: MoreLink }> = ({ content, more }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div className="ds-fill-grid" style={fillGrid(balancedColumns(content.members.length, 3), "1.45rem")}>
        {content.members.map((m, i) => (
          <div key={i} className={m.photo ? "ds-card ds-img-zoom" : "ds-card"} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div role="img" aria-label={m.name} className={m.photo ? "ds-zoom" : undefined} style={{ aspectRatio: "4 / 5", background: "var(--ds-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center", ...(m.photo ? { backgroundImage: `url("${m.photo}")`, backgroundSize: "cover", backgroundPosition: PORTRAIT_FOCUS } : {}) }}>
              {!m.photo && <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "2rem", color: "var(--ds-primary-ink, var(--ds-primary))" }}>{m.initials}</span>}
            </div>
            <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0 }}>{m.name}</h3>
              <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.7rem",   color: "var(--ds-primary-ink, var(--ds-primary))" }}>{m.role}</div>
              {m.bio && <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: "0.3rem 0 0" }}>{m.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
