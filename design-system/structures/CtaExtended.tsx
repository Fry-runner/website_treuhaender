/**
 * Ten additional CTA STRUCTURES. Same CtaContent ({heading, sub, button}) as the
 * original three (band / split / gradient); token-only, so they re-skin with the
 * active look. Each is a distinct final-CTA layout.
 */
import React from "react";
import { Container, Button } from "./primitives";
import type { CtaContent } from "../content/types";

type Props = { content: CtaContent };
const sectionBase: React.CSSProperties = { paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const h2: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display-h2, 2.1rem)", letterSpacing: "var(--ds-headline-tracking)", color: "var(--ds-text)", margin: 0 };
const sub: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "1.05rem", lineHeight: 1.55, color: "var(--ds-text-muted)", maxWidth: "46ch", margin: 0 };

/** 1) Content inside a framed bordered box, centered. */
export const CtaBoxed: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "clamp(2rem, 5vw, 3.4rem)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.1rem" }}>
        <h2 style={h2}>{content.heading}</h2>
        <p style={sub}>{content.sub}</p>
        <div style={{ marginTop: "0.4rem" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 2) Inverted dark full-bleed band, light text. */
export const CtaInverted: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-text)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.1rem" }}>
        <h2 style={{ ...h2, color: "var(--ds-bg)" }}>{content.heading}</h2>
        <p style={{ ...sub, color: "var(--ds-bg)", opacity: 0.9 }}>{content.sub}</p>
        <div style={{ marginTop: "0.4rem" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 3) Card with an offset primary-soft block behind it. */
export const CtaOffsetCard: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <div style={{ position: "relative", paddingTop: "1rem", paddingLeft: "1rem" }}>
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "60%", height: "70%", background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)" }} />
        <div style={{ position: "relative", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "2.4rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={h2}>{content.heading}</h2>
          <p style={sub}>{content.sub}</p>
          <div style={{ marginTop: "0.3rem" }}><Button variant="primary">{content.button}</Button></div>
        </div>
      </div>
    </Container>
  </section>
);

/** 4) Left-aligned with a top accent rule. */
export const CtaLeftRule: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-primary-soft)" }}>
    <Container>
      <div style={{ height: "2px", width: "3rem", background: "var(--ds-primary)" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.2rem", maxWidth: "52ch" }}>
        <h2 style={h2}>{content.heading}</h2>
        <p style={sub}>{content.sub}</p>
        <div style={{ marginTop: "0.3rem" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 5) Transparent band inside a hairline-bordered box, centered. */
export const CtaBordered: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "clamp(2rem, 5vw, 3rem)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "50ch" }}>
          <h2 style={{ ...h2, fontSize: "1.8rem" }}>{content.heading}</h2>
          <p style={{ ...sub, fontSize: "1rem" }}>{content.sub}</p>
        </div>
        <Button variant="primary">{content.button}</Button>
      </div>
    </Container>
  </section>
);

/** 6) Text + vertical hairline divider + button column. */
export const CtaSideline: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-primary-soft)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "2.4rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <h2 style={{ ...h2, fontSize: "1.9rem" }}>{content.heading}</h2>
          <p style={{ ...sub, fontSize: "1rem" }}>{content.sub}</p>
        </div>
        <div style={{ paddingLeft: "2.4rem", borderLeft: "1px solid var(--ds-border)" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 7) Oversized type-forward heading, single button. */
export const CtaBig: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)", paddingBlock: "calc(var(--ds-section-y) * 1.2)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 900px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.4rem" }}>
        <h2 style={{ ...h2, fontSize: "calc(var(--ds-display) * 0.8)", lineHeight: 1.1, maxWidth: "18ch" }}>{content.heading}</h2>
        <p style={sub}>{content.sub}</p>
        <div style={{ marginTop: "0.4rem" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 8) Dark rounded card centered within a normal-bg section. */
export const CtaPanelDark: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={{ background: "var(--ds-text)", borderRadius: "var(--ds-radius)", padding: "clamp(2.2rem, 5vw, 3.6rem)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.1rem" }}>
        <h2 style={{ ...h2, color: "var(--ds-bg)" }}>{content.heading}</h2>
        <p style={{ ...sub, color: "var(--ds-bg)", opacity: 0.9 }}>{content.sub}</p>
        <div style={{ marginTop: "0.4rem" }}><Button variant="primary">{content.button}</Button></div>
      </div>
    </Container>
  </section>
);

/** 9) Asymmetric — big heading left, sub + button right. */
export const CtaAsymmetric: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, background: "var(--ds-primary-soft)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
        <h2 style={{ ...h2, fontSize: "2.3rem" }}>{content.heading}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
          <p style={{ ...sub, fontSize: "1rem" }}>{content.sub}</p>
          <Button variant="primary">{content.button}</Button>
        </div>
      </div>
    </Container>
  </section>
);

/** 10) Slim recurring strip — inline heading + button, low height. */
export const CtaSlim: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "1.4rem", borderBlock: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.4rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.9rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ds-text)" }}>{content.heading}</span>
          <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", color: "var(--ds-text-muted)" }}>{content.sub}</span>
        </div>
        <Button variant="primary">{content.button}</Button>
      </div>
    </Container>
  </section>
);
