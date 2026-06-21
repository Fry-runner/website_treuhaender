import React from "react";
import { Container, Button } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { PricingContent } from "../content/types";

/** Pricing tiers; recommended tier highlighted with a ring + tint. Token-only. */
export const Pricing: React.FC<{ content: PricingContent; more?: MoreLink }> = ({ content, more }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.tiers.length}, minmax(0,1fr))`, gap: "1.2rem", alignItems: "start" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{
            background: "var(--ds-bg)", borderRadius: "var(--ds-radius)", padding: "1.8rem",
            border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)",
            boxShadow: t.recommended ? "var(--ds-shadow-card)" : "none",
            display: "flex", flexDirection: "column", gap: "1rem",
          }}>
            {t.recommended && (
              <div style={{ alignSelf: "flex-start", fontFamily: "var(--ds-font-body)", fontSize: "0.64rem",   color: "var(--ds-primary-fg)", background: "var(--ds-primary)", padding: "0.2rem 0.6rem", borderRadius: "var(--ds-radius-pill)" }}>Empfohlen</div>
            )}
            <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.2rem", color: "var(--ds-text)" }}>{t.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
              <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "2rem", color: "var(--ds-text)" }}>{t.price}</span>
              <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.8rem", color: "var(--ds-text-muted)" }}>{t.period}</span>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
              {t.features.map((f, j) => (
                <li key={j} style={{ display: "flex", gap: "0.5rem", fontSize: "0.9rem", color: "var(--ds-text)" }}>
                  <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 700 }}><Icon name="check" size={15} style={{ verticalAlign: "-0.15em" }} /></span> {f}
                </li>
              ))}
            </ul>
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
