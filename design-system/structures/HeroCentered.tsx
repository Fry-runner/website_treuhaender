/**
 * HeroCentered — centered benefit hero with an in-hero trust nibble.
 * Same HeroContent as HeroSplit; different STRUCTURE (centered single column,
 * rating badge below CTAs). Reads only var(--ds-*). (Tureva/Stripe/Vanta style.)
 */
import React from "react";
import { Container, Eyebrow, Heading, Accent, Lede, Button } from "./primitives";
import { Icon } from "../icons/iconSets";
import type { HeroContent } from "../content/types";

export const HeroCentered: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.75rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading style={{ fontSize: "var(--ds-display)" }}>
          {content.titleLead} <Accent>{content.titleAccent}</Accent>
          {content.titleTail ? <> {content.titleTail}</> : null}
        </Heading>
        <Lede style={{ maxWidth: "52ch" }}>{content.lede}</Lede>
        <div style={{ display: "flex", gap: "1.15rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.3rem" }}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
        {/* in-hero trust nibble */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.6rem", marginTop: "0.4rem",
          padding: "0.5rem 1rem", borderRadius: "var(--ds-radius-pill)",
          background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)",
          fontFamily: "var(--ds-font-body)", fontSize: "0.72rem", 
           color: "var(--ds-text-muted)" }}>
          <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex" }}><Icon name="star" size={14} /></span> {content.asideLabel}
        </div>
      </div>
    </Container>
  </section>
);
