/**
 * Ten additional hero STRUCTURES (skeletons only). Each defines a distinct
 * placement/hierarchy for the same HeroContent and reads every color/font/
 * radius/shadow/spacing from var(--ds-*), so they re-skin with the active look.
 * They extend the original seven (split, centered, text-left, gradient,
 * image-centered/-split/-full) with non-image layout ideas.
 */
import React from "react";
import { Container, Eyebrow, Heading, Accent, Lede, Button, InvertedTone } from "./primitives";
import { Icon } from "../icons/iconSets";
import type { HeroContent } from "../content/types";

const sectionBase: React.CSSProperties = {
  background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)",
};
const ctaRow: React.CSSProperties = { display: "flex", gap: "0.9rem", flexWrap: "wrap", marginTop: "0.4rem" };
const Title: React.FC<{ c: HeroContent }> = ({ c }) => (
  <>{c.titleLead} <Accent>{c.titleAccent}</Accent>{c.titleTail ? <> {c.titleTail}</> : null}</>
);

/** 1) Centered hero with an attached hairline-divided credential bar below. */
export const HeroFactband: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.4rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading><Title c={content} /></Heading>
        <Lede style={{ maxWidth: "52ch" }}>{content.lede}</Lede>
        <div style={ctaRow}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>
    </Container>
    <Container style={{ marginTop: "2.6rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)" }}>
        <div style={{ padding: "1.1rem 1.4rem", borderRight: "1px solid var(--ds-border)", fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" }}>
          <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", verticalAlign: "-0.12em" }}><Icon name="star" size={14} /></span> {content.asideLabel}
        </div>
        <div style={{ padding: "1.1rem 1.4rem", fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", color: "var(--ds-text-muted)" }}>
          {content.asideAttribution}
        </div>
      </div>
    </Container>
  </section>
);

/** 2) Inverted "spotlight" hero — dark surface, light text, centered. */
export const HeroSpotlight: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "calc(var(--ds-section-y) * 1.2)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.4rem" }}>
        <h1 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display)", letterSpacing: "var(--ds-headline-tracking)", lineHeight: 1.05, color: "var(--ds-bg)", margin: 0 }}>
          {content.titleLead} <span style={{ color: "var(--ds-primary)" }}>{content.titleAccent}</span>{content.titleTail ? ` ${content.titleTail}` : ""}
        </h1>
        <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1.1rem", lineHeight: 1.6, color: "var(--ds-bg)", opacity: 0.92, maxWidth: "52ch", margin: 0 }}>{content.lede}</p>
        {/* DARK (--ds-text) ground: InvertedTone makes <Button> render the
            ground-independent inverted buttons instead of the firm's primary
            style (which is often transparent + --ds-primary-ink for a LIGHT bg). */}
        <InvertedTone>
          <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.3rem" }}>
            <Button variant="primary">{content.primaryCta}</Button>
            <Button variant="outline" to="/leistungen">{content.secondaryCta}</Button>
          </div>
        </InvertedTone>
      </div>
    </Container>
  </section>
);

/** 3) Text left + a telemetry-style meta card (label→value rows) right. */
export const HeroSideMeta: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "3rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading><Title c={content} /></Heading>
          <Lede>{content.lede}</Lede>
          <div style={ctaRow}>
            <Button variant="primary">{content.primaryCta}</Button>
            <Button variant="outline">{content.secondaryCta}</Button>
          </div>
        </div>
        <aside style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", overflow: "hidden" }}>
          <div style={{ height: "3px", background: "var(--ds-primary)" }} />
          {[["Auszeichnung", content.asideLabel], ["Referenz", content.asideAttribution]].map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "1rem 1.4rem", borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
              <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.66rem",   color: "var(--ds-text-muted)" }}>{k}</span>
              <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", color: "var(--ds-text)", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </aside>
      </div>
    </Container>
  </section>
);

/** 4) Editorial masthead — overline rule, big centered headline, lede/CTA split row. */
export const HeroOverline: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 960px)" }}>
      <div style={{ height: "2px", background: "var(--ds-primary)", width: "100%" }} />
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1.2rem" }}><Eyebrow>{content.eyebrow}</Eyebrow></div>
      <Heading style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "calc(var(--ds-display) * 1.05)" }}><Title c={content} /></Heading>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "2.4rem", alignItems: "end", marginTop: "2.4rem", paddingTop: "1.6rem", borderTop: "1px solid var(--ds-border)" }}>
        <Lede style={{ maxWidth: "48ch" }}>{content.lede}</Lede>
        <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>
    </Container>
  </section>
);

/** 5) Two columns separated by a hairline divider: headline left, lede+CTA right. */
export const HeroColumnsDivider: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "3rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading><Title c={content} /></Heading>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem", paddingLeft: "3rem", borderLeft: "1px solid var(--ds-border)" }}>
          <Lede>{content.lede}</Lede>
          <div style={ctaRow}>
            <Button variant="primary">{content.primaryCta}</Button>
            <Button variant="outline">{content.secondaryCta}</Button>
          </div>
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.7rem",   color: "var(--ds-text-muted)" }}>
            <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", verticalAlign: "-0.12em" }}><Icon name="star" size={14} /></span> {content.asideLabel}
          </div>
        </div>
      </div>
    </Container>
  </section>
);

/** 6) Framed hero — content inside one bordered box with a divided footer strip. */
export const HeroFramed: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", background: "var(--ds-surface)" }}>
        <div style={{ padding: "clamp(1.8rem, 5vw, 3.4rem)", display: "flex", flexDirection: "column", gap: "1.3rem", maxWidth: "62ch" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading><Title c={content} /></Heading>
          <Lede>{content.lede}</Lede>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "1rem", padding: "1.2rem clamp(1.8rem, 5vw, 3.4rem)", borderTop: "1px solid var(--ds-border)", background: "var(--ds-bg)" }}>
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.7rem",   color: "var(--ds-text-muted)" }}>
            <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", verticalAlign: "-0.12em" }}><Icon name="star" size={14} /></span> {content.asideLabel}
          </div>
          <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
            <Button variant="primary">{content.primaryCta}</Button>
            <Button variant="outline">{content.secondaryCta}</Button>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

/** 7) Ultra type-forward minimal hero — tiny eyebrow, oversized headline, single CTA. */
export const HeroMinimalType: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "calc(var(--ds-section-y) * 1.35)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 1040px)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading style={{ fontSize: "calc(var(--ds-display) * 1.35)", lineHeight: 1.0, maxWidth: "16ch" }}><Title c={content} /></Heading>
        <Lede style={{ maxWidth: "44ch" }}>{content.lede}</Lede>
        <div style={{ marginTop: "0.6rem" }}>
          <Button variant="primary">{content.primaryCta}</Button>
        </div>
      </div>
    </Container>
  </section>
);

/** 8) Headline/lede left, stacked offset quote panels right (layered cards). */
export const HeroOffsetAside: React.FC<{ content: HeroContent }> = ({ content }) => {
  const showAside = !!content.asideQuote && content.asideQuote.trim() !== content.lede.trim();
  return (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: showAside ? "minmax(0,1.3fr) minmax(0,1fr)" : "minmax(0,1fr)", gap: "3.2rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem", maxWidth: showAside ? undefined : "62ch" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading><Title c={content} /></Heading>
          <Lede>{content.lede}</Lede>
          <div style={ctaRow}>
            <Button variant="primary">{content.primaryCta}</Button>
            <Button variant="outline">{content.secondaryCta}</Button>
          </div>
        </div>
        {showAside && (
        <div style={{ position: "relative", paddingTop: "1.2rem", paddingRight: "1.2rem" }}>
          <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: "78%", height: "82%", background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)" }} />
          <blockquote style={{ position: "relative", margin: 0, background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.66rem",   color: "var(--ds-text-muted)" }}>{content.asideLabel}</span>
            <p style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.2rem", lineHeight: 1.4, color: "var(--ds-text)", margin: 0, fontStyle: "italic" }}>“{content.asideQuote}”</p>
            <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", color: "var(--ds-text-muted)" }}>{content.asideAttribution}</span>
          </blockquote>
        </div>
        )}
      </div>
    </Container>
  </section>
  );
};

/** 9) Centered hero with a bottom marquee ribbon of repeated trust labels. */
export const HeroRibbon: React.FC<{ content: HeroContent }> = ({ content }) => {
  const css = `
@keyframes ds-hero-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@media (prefers-reduced-motion: reduce){ .ds-hero-ribbon{ animation:none !important } }`;
  const items = [content.asideLabel, content.eyebrow, content.asideAttribution].filter(Boolean);
  const row = [...items, ...items, ...items, ...items];
  return (
    <section style={{ ...sectionBase, paddingBottom: 0, overflow: "hidden" }}>
      <style>{css}</style>
      <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.4rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading><Title c={content} /></Heading>
          <Lede style={{ maxWidth: "52ch" }}>{content.lede}</Lede>
          <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.3rem" }}>
            <Button variant="primary">{content.primaryCta}</Button>
            <Button variant="outline">{content.secondaryCta}</Button>
          </div>
        </div>
      </Container>
      <div style={{ marginTop: "2.8rem", borderTop: "1px solid var(--ds-border)", background: "var(--ds-surface)", paddingBlock: "0.9rem", whiteSpace: "nowrap" }}>
        <div className="ds-hero-ribbon" style={{ display: "inline-flex", gap: "2.5rem", animation: "ds-hero-marquee 26s linear infinite", willChange: "transform" }}>
          {row.map((t, i) => (
            <span key={i} style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" }}>
              <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", marginRight: "0.5rem", display: "inline-flex", verticalAlign: "-0.1em" }}><Icon name="check" size={12} /></span>{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

/** 10) Quote-led hero — a large pull-quote opens, headline/CTA follow beneath. */
export const HeroQuoteLead: React.FC<{ content: HeroContent }> = ({ content }) => {
  // The big pull-quote leads; use a real distinct quote, else the lede (and then don't
  // repeat that same lede again below — it would show the identical sentence twice).
  const distinctQuote = !!content.asideQuote && content.asideQuote.trim() !== content.lede.trim();
  const bigQuote = distinctQuote ? content.asideQuote : content.lede;
  return (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 920px)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <p style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "calc(var(--ds-display) * 0.8)", lineHeight: 1.15, letterSpacing: "var(--ds-headline-tracking)", color: "var(--ds-text)", margin: 0, maxWidth: "20ch" }}>
          “{bigQuote}”
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "2.4rem", alignItems: "end", paddingTop: "1.4rem", borderTop: "1px solid var(--ds-border)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <h1 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.6rem", lineHeight: 1.15, color: "var(--ds-text)", margin: 0 }}><Title c={content} /></h1>
            {distinctQuote && <Lede>{content.lede}</Lede>}
          </div>
          <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Button variant="primary">{content.primaryCta}</Button>
            <Button variant="outline">{content.secondaryCta}</Button>
          </div>
        </div>
      </div>
    </Container>
  </section>
  );
};
