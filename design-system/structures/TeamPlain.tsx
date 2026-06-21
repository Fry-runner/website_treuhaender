import React from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { TeamContent } from "../content/types";

/**
 * TeamPlain — a TEXT-ONLY team layout with NO photo/avatar/monogram tiles.
 * The generator picks this when the scrape yielded no real person photos, so the
 * team page never shows empty placeholder image tiles (we never fake faces with
 * stock). Each member is a text card: name + role + bio, with a top accent rule.
 * Token-only.
 */
export const TeamPlain: React.FC<{ content: TeamContent; more?: MoreLink }> = ({ content, more }) => {
  const cols = Math.min(content.members.length, 3) || 1;
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: "1.2rem" }}>
          {content.members.map((m, i) => (
            <article key={i} className="ds-card" style={{
              background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)",
              boxShadow: "var(--ds-shadow-card)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem",
              borderTop: "3px solid var(--ds-primary)",
            }}>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ds-text)", margin: 0 }}>{m.name}</h3>
              <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.7rem",   color: "var(--ds-primary-ink, var(--ds-primary))" }}>{m.role}</div>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: "0.3rem 0 0" }}>{m.bio}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
