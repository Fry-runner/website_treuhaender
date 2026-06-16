import React from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { PostsContent } from "../content/types";

const FALLBACK: PostsContent = {
  eyebrow: "Wissen", heading: "Aktuelles & Merkblätter",
  items: [
    { tag: "Steuern", title: "Steuererklärung 2026: die 7 häufigsten Fehler", date: "12.05.2026", excerpt: "" },
    { tag: "Buchhaltung", title: "Digital buchen: so sparen KMU jede Woche Zeit", date: "28.04.2026", excerpt: "" },
    { tag: "MWST", title: "MWST-Abrechnung Schritt für Schritt erklärt", date: "09.04.2026", excerpt: "" },
  ],
};

/** Blog/insights list, driven by the firm's posts content. */
export const BlogList: React.FC<{ content?: PostsContent; more?: MoreLink }> = ({ content = FALLBACK, more }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "1.2rem" }}>
        {content.items.map((post, i) => (
          <article key={i} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: "8rem", background: "var(--ds-primary-soft)" }} />
            <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--ds-font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ds-text-muted)" }}>
                <span style={{ color: "var(--ds-primary)" }}>{post.tag}</span><span>{post.date}</span>
              </div>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)", margin: 0, lineHeight: 1.3 }}>{post.title}</h3>
              <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-text-muted)" }}>Lesen →</span>
            </div>
          </article>
        ))}
      </div>
    </Container>
  </section>
);
