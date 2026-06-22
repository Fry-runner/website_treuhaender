/**
 * HeroSplit — a STRUCTURE (skeleton) only.
 *
 * It defines placement/hierarchy: eyebrow → headline (with accent) → lede →
 * primary+secondary buttons on the left (8 cols), a token-styled aside card on
 * the right (4 cols). It contains NO look decisions — every color/font/radius/
 * shadow/spacing comes from `var(--ds-*)`, supplied by whatever look wraps it.
 *
 * Content is injected via props (later sourced from the scraped site.json).
 */
import React from "react";
import { Container, Eyebrow, Heading, Accent, Lede, Button } from "./primitives";

export interface HeroContent {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  titleTail?: string;
  lede: string;
  primaryCta: string;
  secondaryCta: string;
  asideLabel: string;
  asideQuote: string;
  asideAttribution: string;
  image?: string; // real hero photo (from scraped assets), used by image-bg heroes
}

export const HeroSplit: React.FC<{ content: HeroContent }> = ({ content }) => {
  // The aside is a real-quote slot: only show it when there's a genuine quote that
  // isn't just the lede echoed back (the extractor cloned the lede on many firms).
  const showAside = !!content.asideQuote && content.asideQuote.trim() !== content.lede.trim();
  return (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: showAside ? "minmax(0,2fr) minmax(0,1fr)" : "minmax(0,1fr)", gap: "3rem", alignItems: "center" }}>
        {/* LEFT — content column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem", maxWidth: showAside ? undefined : "60ch" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading>
            {content.titleLead} <Accent>{content.titleAccent}</Accent>
            {content.titleTail ? <> {content.titleTail}</> : null}
          </Heading>
          <Lede>{content.lede}</Lede>
          <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
            <Button variant="primary">{content.primaryCta}</Button>
            <Button variant="outline">{content.secondaryCta}</Button>
          </div>
        </div>

        {/* RIGHT — token-styled aside (real quote/credential slot) */}
        {showAside && (
        <aside style={{
          background: "var(--ds-surface)", border: "1px solid var(--ds-border)",
          borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)",
          padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem",
        }}>
          <div style={{
            fontFamily: "var(--ds-font-body)", fontSize: "0.66rem",
             color: "var(--ds-text-muted)" }}>
            {content.asideLabel}
          </div>
          <p style={{
            fontFamily: "var(--ds-font-heading)", fontSize: "1.15rem", lineHeight: 1.4,
            color: "var(--ds-text)", margin: 0, fontStyle: "italic",
          }}>
            “{content.asideQuote}”
          </p>
          <div style={{ height: "2px", width: "2.5rem", background: "var(--ds-primary)" }} />
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", color: "var(--ds-text-muted)" }}>
            {content.asideAttribution}
          </div>
        </aside>
        )}
      </div>
    </Container>
  </section>
  );
};
