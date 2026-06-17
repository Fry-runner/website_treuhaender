/**
 * CTA STRUCTURES — batch 2. Same CtaContent ({heading, sub, button}); token-only.
 */
import React from "react";
import { Container, Button } from "./primitives";
import { Icon } from "../icons/iconSets";
import type { CtaContent } from "../content/types";

type Props = { content: CtaContent };
const sectionBase: React.CSSProperties = { paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const h2: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display-h2, 2.1rem)", letterSpacing: "var(--ds-headline-tracking)", color: "var(--ds-text)", margin: 0 };
const sub: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "1.05rem", lineHeight: 1.55, color: "var(--ds-text-muted)", maxWidth: "46ch", margin: 0 };

/** 1) Gradient band, heading/sub left, light button right. */
export const CtaGradientSplit: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, backgroundImage: "linear-gradient(120deg, var(--ds-primary), var(--ds-secondary))" }}>
    <Container>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "48ch" }}>
          <h2 style={{ ...h2, color: "var(--ds-primary-fg)" }}>{content.heading}</h2>
          <p style={{ ...sub, color: "var(--ds-primary-fg)", opacity: 0.92 }}>{content.sub}</p>
        </div>
        <button style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.8rem",   fontWeight: 600, padding: "0.95rem 1.8rem", borderRadius: "var(--ds-radius-pill)", background: "var(--ds-bg)", color: "var(--ds-text)", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>{content.button} <Icon name="arrowRight" size={14} style={{ verticalAlign: "-0.1em" }} /></button>
      </div>
    </Container>
  </section>
);

/** 2) Inverted dark band, heading left, button right. */
export const CtaDarkSplit: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-text)" }}>
    <Container>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "48ch" }}>
          <h2 style={{ ...h2, color: "var(--ds-bg)" }}>{content.heading}</h2>
          <p style={{ ...sub, color: "var(--ds-bg)", opacity: 0.9 }}>{content.sub}</p>
        </div>
        <Button variant="primary">{content.button}</Button>
      </div>
    </Container>
  </section>
);

/** 3) Strongly elevated surface card, centered. */
export const CtaElevatedCard: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <div style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "0 30px 60px -24px rgba(0,0,0,0.45)", padding: "clamp(2rem, 5vw, 3.4rem)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.1rem" }}>
        <h2 style={h2}>{content.heading}</h2>
        <p style={sub}>{content.sub}</p>
        <div style={{ marginTop: "0.4rem" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 4) Minimal — hairline top/bottom, heading + arrow link. */
export const CtaMinimalLine: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)", borderTop: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <h2 style={{ ...h2, fontSize: "1.7rem" }}>{content.heading}</h2>
        <Button variant="primary">{content.button}</Button>
      </div>
    </Container>
  </section>
);

/** 5) Centered with decorative corner brackets. */
export const CtaCornerFrame: React.FC<Props> = ({ content }) => {
  const corner: React.CSSProperties = { position: "absolute", width: "1.6rem", height: "1.6rem", borderColor: "var(--ds-primary)" };
  return (
    <section style={{ ...sectionBase, background: "var(--ds-bg)" }}>
      <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
        <div style={{ position: "relative", padding: "2.6rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.1rem" }}>
          <span aria-hidden style={{ ...corner, top: 0, left: 0, borderTop: "2px solid", borderLeft: "2px solid" }} />
          <span aria-hidden style={{ ...corner, top: 0, right: 0, borderTop: "2px solid", borderRight: "2px solid" }} />
          <span aria-hidden style={{ ...corner, bottom: 0, left: 0, borderBottom: "2px solid", borderLeft: "2px solid" }} />
          <span aria-hidden style={{ ...corner, bottom: 0, right: 0, borderBottom: "2px solid", borderRight: "2px solid" }} />
          <h2 style={h2}>{content.heading}</h2>
          <p style={sub}>{content.sub}</p>
          <div style={{ marginTop: "0.3rem" }}><Button variant="primary">{content.button}</Button></div>
        </div>
      </Container>
    </section>
  );
};

/** 6) Centered with an eyebrow + accent rule above the heading. */
export const CtaEyebrowBand: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-primary-soft)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem" }}>
        <div style={{ height: "2px", width: "3rem", background: "var(--ds-primary)" }} />
        <h2 style={h2}>{content.heading}</h2>
        <p style={sub}>{content.sub}</p>
        <div style={{ marginTop: "0.4rem" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 7) Centered with a small pill badge above the heading. */
export const CtaBadge: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 720px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.1rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.9rem", borderRadius: "9999px", background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)", fontFamily: "var(--ds-font-body)", fontSize: "0.68rem",   color: "var(--ds-primary)" }}>
          <span style={{ width: "0.4rem", height: "0.4rem", borderRadius: "9999px", background: "var(--ds-primary)" }} /> Jetzt starten
        </span>
        <h2 style={h2}>{content.heading}</h2>
        <p style={sub}>{content.sub}</p>
        <div style={{ marginTop: "0.4rem" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 8) Oversized centered, generous space. */
export const CtaStackedCenter: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)", paddingBlock: "calc(var(--ds-section-y) * 1.3)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem" }}>
        <h2 style={{ ...h2, fontSize: "calc(var(--ds-display) * 0.85)", lineHeight: 1.08, maxWidth: "16ch" }}>{content.heading}</h2>
        <p style={sub}>{content.sub}</p>
        <div style={{ marginTop: "0.5rem" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 9) Heading/sub left, button in a bordered cell right. */
export const CtaSidebar: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <h2 style={{ ...h2, fontSize: "1.8rem" }}>{content.heading}</h2>
          <p style={{ ...sub, fontSize: "1rem" }}>{content.sub}</p>
        </div>
        <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid var(--ds-border)", background: "var(--ds-surface)" }}>
          <Button variant="primary">{content.button}</Button>
        </div>
      </div>
    </Container>
  </section>
);

/** 10) Two-tone split panels (tint + surface). */
export const CtaTwoTone: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", borderRadius: "var(--ds-radius)", overflow: "hidden", border: "1px solid var(--ds-border)" }}>
        <div style={{ background: "var(--ds-primary-soft)", padding: "2.2rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.6rem" }}>
          <h2 style={{ ...h2, fontSize: "1.8rem" }}>{content.heading}</h2>
        </div>
        <div style={{ background: "var(--ds-surface)", padding: "2.2rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1rem", alignItems: "flex-start" }}>
          <p style={{ ...sub, fontSize: "1rem" }}>{content.sub}</p>
          <Button variant="primary">{content.button}</Button>
        </div>
      </div>
    </Container>
  </section>
);
