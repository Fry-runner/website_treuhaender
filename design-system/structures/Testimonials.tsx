/**
 * Testimonials — STRUCTURE only (briefing §8.1: the first-class social-proof slot).
 * Header + aggregate rating badge + named quote cards (person·company·city).
 * Token-only: every color/font/radius/shadow comes from var(--ds-*).
 */
import React from "react";
import { Container, Eyebrow } from "./primitives";
import { Icon } from "../icons/iconSets";

export interface Testimonial {
  quote: string;
  person: string;
  company: string;
  city: string;
}
export interface TestimonialsContent {
  eyebrow: string;
  heading: string;
  rating: string;        // e.g. "5.0"
  reviewCount: string;   // e.g. "93 Bewertungen"
  items: Testimonial[];
}

export const Testimonials: React.FC<{ content: TestimonialsContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2.2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display-h2, 2rem)", letterSpacing: "var(--ds-headline-tracking)", color: "var(--ds-text)", margin: 0 }}>
            {content.heading}
          </h2>
        </div>
        {/* aggregate rating badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 1rem", borderRadius: "var(--ds-radius-pill)", background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "var(--ds-primary)", fontWeight: 700, letterSpacing: "0.05em" }}><Icon name="star" size={16} /> {content.rating}</span>
          <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" }}>{content.reviewCount}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "1.2rem" }}>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.98rem", lineHeight: 1.55, color: "var(--ds-text)" }}>
              “{t.quote}”
            </blockquote>
            <div style={{ height: "2px", width: "2rem", background: "var(--ds-primary)" }} />
            <figcaption style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--ds-text)" }}>{t.person}</strong><br />
              {t.company} · {t.city}
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);
