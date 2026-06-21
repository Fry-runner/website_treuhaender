/**
 * Hero STRUCTURES — batch 2. Ten more token-only hero skeletons for HeroContent,
 * distinct from the originals and HeroExtended. Read every colour/font/radius
 * from var(--ds-*).
 */
import React from "react";
import { Container, Eyebrow, Heading, Accent, Lede, Button, ActionButton } from "./primitives";
import { Icon } from "../icons/iconSets";
import type { HeroContent } from "../content/types";

const sectionBase: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const ctaRow: React.CSSProperties = { display: "flex", gap: "0.9rem", flexWrap: "wrap", marginTop: "0.4rem" };
const Title: React.FC<{ c: HeroContent }> = ({ c }) => (<>{c.titleLead} <Accent>{c.titleAccent}</Accent>{c.titleTail ? <> {c.titleTail}</> : null}</>);
const photo = (src: string): React.CSSProperties => ({ backgroundImage: `url("${src}")`, backgroundSize: "cover", backgroundPosition: "center" });

/** 1) Centered content inside a floating surface card on a tinted band. */
export const HeroCenteredCard: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
      <div style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "clamp(2rem, 5vw, 3.4rem)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.4rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading><Title c={content} /></Heading>
        <Lede style={{ maxWidth: "50ch" }}>{content.lede}</Lede>
        <div style={{ ...ctaRow, justifyContent: "center" }}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>
    </Container>
  </section>
);

/** 2) Mirror split — aside quote left, text right. */
export const HeroSplitReverse: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr)", gap: "3rem", alignItems: "center" }}>
        <aside style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem", order: 0 }}>
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.66rem",   color: "var(--ds-text-muted)" }}>{content.asideLabel}</div>
          <p style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.15rem", lineHeight: 1.4, color: "var(--ds-text)", margin: 0, fontStyle: "italic" }}>“{content.asideQuote}”</p>
          <div style={{ height: "2px", width: "2.5rem", background: "var(--ds-primary)" }} />
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", color: "var(--ds-text-muted)" }}>{content.asideAttribution}</div>
        </aside>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading><Title c={content} /></Heading>
          <Lede>{content.lede}</Lede>
          <div style={ctaRow}><Button variant="primary">{content.primaryCta}</Button><Button variant="outline">{content.secondaryCta}</Button></div>
        </div>
      </div>
    </Container>
  </section>
);

/** 3) Type-forward, accent word on its own line. */
export const HeroTwoLine: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "calc(var(--ds-section-y) * 1.25)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 1000px)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading style={{ fontSize: "calc(var(--ds-display) * 1.25)", lineHeight: 1.0 }}>
          {content.titleLead}<br /><Accent>{content.titleAccent}</Accent>{content.titleTail ? ` ${content.titleTail}` : ""}
        </Heading>
        <Lede style={{ maxWidth: "46ch" }}>{content.lede}</Lede>
        <div style={ctaRow}><Button variant="primary">{content.primaryCta}</Button><Button variant="outline">{content.secondaryCta}</Button></div>
      </div>
    </Container>
  </section>
);

/** 4) Centered with vertically stacked, full-width CTAs. */
export const HeroStackedCta: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 600px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.4rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading><Title c={content} /></Heading>
        <Lede style={{ maxWidth: "44ch" }}>{content.lede}</Lede>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", width: "100%", maxWidth: "320px", marginTop: "0.4rem" }}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>
    </Container>
  </section>
);

/** 5) Compact wide banner — eyebrow+headline left, CTA right. */
export const HeroBanner: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "calc(var(--ds-section-y) * 0.8)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "2.4rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading style={{ fontSize: "calc(var(--ds-display) * 0.6)" }}><Title c={content} /></Heading>
          <Lede style={{ maxWidth: "54ch" }}>{content.lede}</Lede>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <Button variant="primary">{content.primaryCta}</Button>
          <Button variant="outline">{content.secondaryCta}</Button>
        </div>
      </div>
    </Container>
  </section>
);

/** 6) Text left + an offset framed photo right. */
export const HeroPortraitFrame: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "3rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading><Title c={content} /></Heading>
          <Lede>{content.lede}</Lede>
          <div style={ctaRow}><Button variant="primary">{content.primaryCta}</Button><Button variant="outline">{content.secondaryCta}</Button></div>
        </div>
        <div style={{ position: "relative", paddingTop: "1rem", paddingRight: "1rem" }}>
          <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: "82%", height: "88%", border: "1px solid var(--ds-primary)", borderRadius: "var(--ds-radius)" }} />
          <div aria-hidden style={{ position: "relative", minHeight: "360px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", boxShadow: "var(--ds-shadow-card)", ...(content.image ? photo(content.image) : { backgroundImage: "linear-gradient(135deg, var(--ds-primary), var(--ds-secondary))" }) }} />
        </div>
      </div>
    </Container>
  </section>
);

/** 7) Inverted dark split — light text left, surface card right. */
export const HeroDarkSplit: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "3rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
          <h1 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display)", letterSpacing: "var(--ds-headline-tracking)", lineHeight: 1.05, color: "var(--ds-bg)", margin: 0 }}>
            {content.titleLead} <span style={{ color: "var(--ds-primary)" }}>{content.titleAccent}</span>{content.titleTail ? ` ${content.titleTail}` : ""}
          </h1>
          <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1.1rem", lineHeight: 1.6, color: "var(--ds-bg)", opacity: 0.92, maxWidth: "46ch", margin: 0 }}>{content.lede}</p>
          <div style={ctaRow}>
            <Button variant="primary">{content.primaryCta}</Button>
            <ActionButton to="/leistungen" style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.78rem",   fontWeight: 600, padding: "0.9rem 1.6rem", borderRadius: "var(--ds-radius)", cursor: "pointer", background: "transparent", color: "var(--ds-bg)", border: "1px solid var(--ds-bg)" }}>{content.secondaryCta}</ActionButton>
          </div>
        </div>
        <aside style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "var(--ds-radius)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.66rem",   color: "var(--ds-primary)" }}>{content.asideLabel}</div>
          <p style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.1rem", lineHeight: 1.4, color: "var(--ds-bg)", margin: 0, fontStyle: "italic" }}>“{content.asideQuote}”</p>
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.82rem", color: "var(--ds-bg)", opacity: 0.8 }}>{content.asideAttribution}</div>
        </aside>
      </div>
    </Container>
  </section>
);

/** 8) Centered content over a dotted-grid background. */
export const HeroGridBg: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={{ position: "relative", overflow: "hidden", paddingBlock: "calc(var(--ds-section-y) * 1.15)", borderBottom: "1px solid var(--ds-border)", background: "var(--ds-bg)" }}>
    <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(var(--ds-border) 1px, transparent 1px)", backgroundSize: "22px 22px", maskImage: "radial-gradient(ellipse at center, #000 35%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 35%, transparent 75%)" }} />
    <Container style={{ position: "relative", maxWidth: "min(var(--ds-container), 860px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.4rem" }}>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading><Title c={content} /></Heading>
        <Lede style={{ maxWidth: "52ch" }}>{content.lede}</Lede>
        <div style={{ ...ctaRow, justifyContent: "center" }}><Button variant="primary">{content.primaryCta}</Button><Button variant="outline">{content.secondaryCta}</Button></div>
      </div>
    </Container>
  </section>
);

/** 9) Numbered chapter opener — big index, rule, headline. */
export const HeroChapter: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 920px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "start" }}>
        <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 800, fontSize: "calc(var(--ds-display) * 0.9)", color: "var(--ds-primary-ink, var(--ds-primary))", lineHeight: 0.9 }}>01</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div style={{ height: "2px", width: "100%", background: "var(--ds-border)" }} />
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading><Title c={content} /></Heading>
          <Lede>{content.lede}</Lede>
          <div style={ctaRow}><Button variant="primary">{content.primaryCta}</Button><Button variant="outline">{content.secondaryCta}</Button></div>
        </div>
      </div>
    </Container>
  </section>
);

/** 10) Text left + a single big focal metric/credential panel right. */
export const HeroAsideStat: React.FC<{ content: HeroContent }> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "3rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading><Title c={content} /></Heading>
          <Lede>{content.lede}</Lede>
          <div style={ctaRow}><Button variant="primary">{content.primaryCta}</Button><Button variant="outline">{content.secondaryCta}</Button></div>
        </div>
        <div style={{ background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "2rem", display: "flex", flexDirection: "column", gap: "0.6rem", textAlign: "center" }}>
          <div style={{ color: "var(--ds-primary-ink, var(--ds-primary))", lineHeight: 1, display: "flex" }}><Icon name="star" size={36} /></div>
          <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)" }}>{content.asideLabel}</div>
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", color: "var(--ds-text-muted)" }}>{content.asideAttribution}</div>
        </div>
      </div>
    </Container>
  </section>
);
