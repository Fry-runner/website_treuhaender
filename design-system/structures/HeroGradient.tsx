/**
 * HeroGradient — a premium animated mesh-gradient hero (Stripe / Vercel pattern),
 * rebuilt token-driven (gradient uses --ds-primary / --ds-secondary). Centered
 * benefit hero on a drifting blurred gradient. Reduced-motion safe.
 */
import React from "react";
import { Container, Eyebrow, Heading, Accent, Lede, Button } from "./primitives";
import { Icon } from "../icons/iconSets";
import type { HeroContent } from "../content/types";

const css = `
@keyframes ds-grad-drift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@media (prefers-reduced-motion: reduce){ .ds-grad-layer{ animation:none !important } }
`;

export const HeroGradient: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ position: "relative", overflow: "hidden", paddingBlock: "calc(var(--ds-section-y) * 1.2)", borderBottom: "1px solid var(--ds-border)", background: "var(--ds-bg)" }}>
    <style>{css}</style>
    <div className="ds-grad-layer" aria-hidden style={{
      position: "absolute", inset: "-20%", opacity: 0.22, pointerEvents: "none",
      backgroundImage: "linear-gradient(120deg, var(--ds-primary), var(--ds-secondary), var(--ds-primary))",
      backgroundSize: "220% 220%", filter: "blur(60px)",
      animation: "ds-grad-drift 16s ease-in-out infinite",
    }} />
    <Container style={{ position: "relative", maxWidth: "min(var(--ds-container), 880px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading>
          {content.titleLead} <Accent>{content.titleAccent}</Accent>
          {content.titleTail ? <> {content.titleTail}</> : null}
        </Heading>
        <Lede style={{ maxWidth: "54ch" }}>{content.lede}</Lede>
        <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.3rem" }}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
        <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)", marginTop: "0.2rem" }}>
          <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", verticalAlign: "-0.12em" }}><Icon name="star" size={14} /></span> {content.asideLabel}
        </div>
      </div>
    </Container>
  </section>
);
