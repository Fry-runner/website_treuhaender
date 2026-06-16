/**
 * Image-background hero arrangements (3 variants of the "text + image" idea).
 * The "image" is a token-driven gradient + dot-pattern placeholder until real
 * per-firm hero images are wired via the content model + scraped assets.
 */
import React from "react";
import { Container, Eyebrow, Heading, Accent, Lede, Button } from "./primitives";
import type { HeroContent } from "../content/types";

// light textured "image" (works with normal text/button colors)
const lightImage: React.CSSProperties = {
  backgroundImage: "radial-gradient(var(--ds-border) 1px, transparent 1px), linear-gradient(135deg, var(--ds-primary-soft), var(--ds-surface))",
  backgroundSize: "18px 18px, 100% 100%",
};
// vivid "photo" block (used as a side image)
const vividImage: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(135deg, var(--ds-primary), var(--ds-secondary))",
  backgroundSize: "20px 20px, 100% 100%",
};
const lightBtn: React.CSSProperties = {
  fontFamily: "var(--ds-font-mono)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em",
  fontWeight: 600, padding: "0.9rem 1.6rem", borderRadius: "var(--ds-radius)", cursor: "pointer", lineHeight: 1,
};

/** 1) Text centered over a textured image background. */
export const HeroImageCentered: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ ...lightImage, paddingBlock: "calc(var(--ds-section-y) * 1.3)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading>{content.titleLead} <Accent>{content.titleAccent}</Accent>{content.titleTail ? <> {content.titleTail}</> : null}</Heading>
        <Lede style={{ maxWidth: "52ch" }}>{content.lede}</Lede>
        <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>
    </Container>
  </section>
);

/** 2) Text left, vivid image block right. */
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
        <div aria-hidden style={{ ...vividImage, minHeight: "320px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)" }} />
      </div>
    </Container>
  </section>
);

/** 3) Full-bleed image with scrim, light text bottom-left. */
export const HeroImageFull: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--ds-border)", backgroundImage: "linear-gradient(120deg, var(--ds-primary), var(--ds-secondary))" }}>
    <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.62), rgba(0,0,0,0.25))" }} />
    <Container style={{ position: "relative", paddingBlock: "calc(var(--ds-section-y) * 1.7)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem", maxWidth: "60ch" }}>
        <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.85)" }}>{content.eyebrow}</div>
        <h1 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display)", letterSpacing: "var(--ds-headline-tracking)", lineHeight: 1.05, color: "#fff", margin: 0 }}>
          {content.titleLead} {content.titleAccent} {content.titleTail ?? ""}
        </h1>
        <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1.1rem", lineHeight: 1.6, color: "rgba(255,255,255,0.9)", maxWidth: "50ch", margin: 0 }}>{content.lede}</p>
        <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", marginTop: "0.3rem" }}>
          <button style={{ ...lightBtn, background: "#fff", color: "#111", border: "none" }}>{content.primaryCta} →</button>
          <button style={{ ...lightBtn, background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.7)" }}>{content.secondaryCta}</button>
        </div>
      </div>
    </Container>
  </section>
);
