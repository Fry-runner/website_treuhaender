/**
 * HeroTextLeft — left-aligned, type-only hero on a tinted surface band, with a
 * short accent rule. Same HeroContent; no aside. (Ruerup/boutique style.)
 */
import React from "react";
import { Container, Eyebrow, Heading, Accent, Lede, Button } from "./primitives";
import type { HeroContent } from "../content/types";

export const HeroTextLeft: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 920px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1.65rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading>
          {content.titleLead} <Accent>{content.titleAccent}</Accent>
          {content.titleTail ? <> {content.titleTail}</> : null}
        </Heading>
        <div style={{ height: "3px", width: "3.5rem", background: "var(--ds-primary)", borderRadius: "9999px" }} />
        <Lede style={{ maxWidth: "56ch" }}>{content.lede}</Lede>
        <div style={{ display: "flex", gap: "1.15rem", flexWrap: "wrap", marginTop: "0.3rem" }}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>
    </Container>
  </section>
);
