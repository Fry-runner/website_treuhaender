/**
 * Image-background hero arrangements (3 variants of the "text + image" idea).
 * Uses the firm's real hero photo (content.image, copied from scraped assets)
 * when present; otherwise falls back to a token-driven gradient placeholder.
 */
import React from "react";
import { Container, Eyebrow, Heading, Accent, Lede, Button, ActionButton } from "./primitives";
import { Icon } from "../icons/iconSets";
import type { HeroContent } from "../content/types";

const gradientLight: React.CSSProperties = {
  backgroundImage: "radial-gradient(var(--ds-border) 1px, transparent 1px), linear-gradient(135deg, var(--ds-primary-soft), var(--ds-surface))",
  backgroundSize: "18px 18px, 100% 100%",
};
const gradientVivid: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(135deg, var(--ds-primary), var(--ds-secondary))",
  backgroundSize: "20px 20px, 100% 100%",
};
const photo = (src: string): React.CSSProperties => ({ backgroundImage: `url("${src}")`, backgroundSize: "cover", backgroundPosition: "center" });
const lightBtn: React.CSSProperties = {
  fontFamily: "var(--ds-font-body)", fontSize: "0.9rem",
  fontWeight: 600, padding: "0.95rem 1.7rem", minHeight: "2.75rem", borderRadius: "var(--ds-radius)", cursor: "pointer", lineHeight: 1,
  display: "inline-flex", alignItems: "center", gap: "0.4rem" };

/** 1) Text centered over the image, with a light scrim for legibility. */
export const HeroImageCentered: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ position: "relative", overflow: "hidden", paddingBlock: "calc(var(--ds-section-y) * 1.3)", borderBottom: "1px solid var(--ds-border)", ...(content.image ? photo(content.image) : gradientLight) }}>
    {content.image && <div aria-hidden style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.88)" }} />}
    <Container style={{ position: "relative", maxWidth: "min(var(--ds-container), 820px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading>{content.titleLead} <Accent>{content.titleAccent}</Accent>{content.titleTail ? <> {content.titleTail}</> : null}</Heading>
        <Lede style={{ maxWidth: "52ch", color: "var(--ds-text)" }}>{content.lede}</Lede>
        <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>
    </Container>
  </section>
);

/** 2) Text left, real photo (or vivid gradient) block right. */
export const HeroImageSplit: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "3rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading>{content.titleLead} <Accent>{content.titleAccent}</Accent></Heading>
          <Lede>{content.lede}</Lede>
          <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
            <Button variant="primary">{content.primaryCta}</Button>
            <Button variant="outline">{content.secondaryCta}</Button>
          </div>
        </div>
        <div aria-hidden style={{ minHeight: "340px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...(content.image ? photo(content.image) : gradientVivid) }} />
      </div>
    </Container>
  </section>
);

/** 3) Full-bleed photo with scrim, light text bottom-left. */
export const HeroImageFull: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--ds-border)", ...(content.image ? photo(content.image) : { backgroundImage: "linear-gradient(120deg, var(--ds-primary), var(--ds-secondary))" }) }}>
    <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0.48))" }} />
    <Container style={{ position: "relative", paddingBlock: "calc(var(--ds-section-y) * 1.8)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem", maxWidth: "60ch" }}>
        <h1 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display)", letterSpacing: "var(--ds-headline-tracking)", lineHeight: 1.05, color: "#fff", margin: 0 }}>
          {content.titleLead} {content.titleAccent} {content.titleTail ?? ""}
        </h1>
        <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1.1rem", lineHeight: 1.6, color: "rgba(255,255,255,0.92)", maxWidth: "50ch", margin: 0 }}>{content.lede}</p>
        <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", marginTop: "0.3rem" }}>
          <ActionButton to="/kontakt" style={{ ...lightBtn, background: "#fff", color: "#111", border: "none" }}>{content.primaryCta} <Icon name="arrowRight" size={14} style={{ verticalAlign: "-0.1em" }} /></ActionButton>
          <ActionButton to="/leistungen" style={{ ...lightBtn, background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.7)" }}>{content.secondaryCta}</ActionButton>
        </div>
      </div>
    </Container>
  </section>
);
