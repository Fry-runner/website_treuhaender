import React from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import { useNavigate } from "../compose/nav-context";
import { slugify } from "../pages";
import type { ServicesContent } from "../content/types";

/** Services card grid. Cards link to their detail page. Inline price when present. */
export const Services: React.FC<{ content: ServicesContent; more?: MoreLink }> = ({ content, more }) => {
  const navigate = useNavigate();
  return (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "1.2rem" }}>
        {content.items.map((s, i) => (
          <article key={i} onClick={() => navigate(`/leistungen/${slugify(s.title)}`)} style={{
            background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)",
            boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.7rem",
            cursor: "pointer",
          }}>
            <div style={{ width: "2.6rem", height: "2.6rem", borderRadius: "var(--ds-radius)", background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ds-primary)", fontWeight: 700 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0, flex: 1 }}>{s.summary}</p>
            {s.price && (
              <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ds-primary)", fontWeight: 600 }}>{s.price}</div>
            )}
            <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-text-muted)" }}>Mehr →</span>
          </article>
        ))}
      </div>
    </Container>
  </section>
  );
};
