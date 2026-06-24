/**
 * Twenty-one additional Pricing STRUCTURES. Same PricingContent
 * ({ eyebrow, heading, tiers: { name, price, period, features[], recommended? }[] })
 * as the original Pricing; token-only, so they re-skin with the active look.
 * The recommended tier is highlighted consistently per layout (no AI-tell side-tabs).
 */
import React, { useState } from "react";
import { Container, Button, InvertedTone } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { PricingContent, PricingTier } from "../content/types";

type Props = { content: PricingContent; more?: MoreLink };
const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const nameS: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ds-text)", margin: 0 };
const priceS: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "2rem", color: "var(--ds-text)", lineHeight: 1 };
const perS: React.CSSProperties = { fontFamily: "var(--ds-font-mono)", fontSize: "0.8rem", color: "var(--ds-text-muted)" };
const num = (i: number) => String(i + 1).padStart(2, "0");

const Price: React.FC<{ t: PricingTier; light?: boolean; big?: boolean }> = ({ t, light, big }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
    <span style={{ ...priceS, fontSize: big ? "2.8rem" : "2rem", color: light ? "var(--ds-bg)" : "var(--ds-text)" }}>{t.price}</span>
    <span style={{ ...perS, color: light ? "rgba(255,255,255,0.7)" : "var(--ds-text-muted)" }}>{t.period}</span>
  </div>
);

const Feats: React.FC<{ items: string[]; light?: boolean; max?: number }> = ({ items, light, max }) => (
  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
    {(max ? items.slice(0, max) : items).map((f, j) => (
      <li key={j} style={{ display: "flex", gap: "0.5rem", fontSize: "0.88rem", lineHeight: 1.45, color: light ? "rgba(255,255,255,0.88)" : "var(--ds-text)" }}>
        <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 700 }} aria-hidden><Icon name="check" size={15} style={{ verticalAlign: "-0.15em" }} /></span>{f}
      </li>
    ))}
  </ul>
);

const RecoBadge: React.FC = () => (
  <div style={{ alignSelf: "flex-start", fontFamily: "var(--ds-font-body)", fontSize: "0.62rem",   color: "var(--ds-primary-fg)", background: "var(--ds-primary)", padding: "0.2rem 0.6rem", borderRadius: "var(--ds-radius-pill)" }}>Empfohlen</div>
);

const cols = (n: number, cap = 4) => `repeat(${Math.min(n, cap)}, minmax(0,1fr))`;

/** 1) Horizontal rows — name+price left, features centre, CTA right. */
export const PricingRows: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 920px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{ display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.6fr) auto", gap: "1.6rem", alignItems: "center", background: "var(--ds-bg)", border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.5rem 1.7rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>{t.recommended && <RecoBadge />}<h3 style={nameS}>{t.name}</h3><Price t={t} /></div>
            <Feats items={t.features} max={4} />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Borderless minimal — a top rule per tier. */
export const PricingMinimal: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "2.4rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} style={{ borderTop: t.recommended ? "2px solid var(--ds-primary)" : "2px solid var(--ds-text)", paddingTop: "1.1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={nameS}>{t.name}</h3><Price t={t} /><Feats items={t.features} />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Three-up grid with the centre/recommended tier scaled up. */
export const PricingCenterFeatured: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.2rem", alignItems: "center" }}>
        {content.tiers.map((t, i) => (
          <div key={i} style={{ background: "var(--ds-bg)", border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: t.recommended ? "2.2rem 1.8rem" : "1.6rem", boxShadow: t.recommended ? "var(--ds-shadow-card)" : "none", display: "flex", flexDirection: "column", gap: "1rem", transform: t.recommended ? "scale(1.04)" : "none" }}>
            {t.recommended && <RecoBadge />}<h3 style={nameS}>{t.name}</h3><Price t={t} big={t.recommended} /><Feats items={t.features} />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 4) Inverted dark band with light cards. */
export const PricingDark: React.FC<Props> = ({ content, more }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "var(--ds-section-y)" }}>
    <Container>
      <div style={{ marginBottom: "2.2rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "var(--ds-display-h2, 2rem)", color: "var(--ds-bg)", margin: 0 }}>{content.heading}</h2>
      </div>
      {/* The whole band paints --ds-text as its ground → every CTA is on dark. Wrap the
          grid so each Button flips to its inverted, ground-independent style. */}
      <InvertedTone>
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.2rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} style={{ background: t.recommended ? "rgba(255,255,255,0.08)" : "transparent", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "var(--ds-radius)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {t.recommended && <RecoBadge />}<h3 style={{ ...nameS, color: "var(--ds-bg)" }}>{t.name}</h3><Price t={t} light /><Feats items={t.features} light />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
      </InvertedTone>
    </Container>
  </section>
);

/** 5) Recommended tier carries a gradient fill. */
export const PricingGradientFeatured: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.2rem", alignItems: "stretch" }}>
        {content.tiers.map((t, i) => {
          const g = t.recommended;
          return (
            <div key={i} className="ds-card" style={{ borderRadius: "var(--ds-radius)", padding: "1.9rem", display: "flex", flexDirection: "column", gap: "1rem", border: g ? "none" : "1px solid var(--ds-border)", backgroundImage: g ? "linear-gradient(150deg, var(--ds-primary), var(--ds-secondary))" : "none", background: g ? undefined : "var(--ds-bg)", boxShadow: g ? "var(--ds-shadow-card)" : "none" }}>
              {g && <RecoBadge />}<h3 style={{ ...nameS, color: g ? "var(--ds-primary-fg)" : "var(--ds-text)" }}>{t.name}</h3><Price t={t} light={g} /><Feats items={t.features} light={g} />
              {/* Gradient-filled card: flip the button to a legible inverted solid. */}
              {g
                ? <InvertedTone><Button variant="primary">Auswählen</Button></InvertedTone>
                : <Button variant="primary">Auswählen</Button>}
            </div>
          );
        })}
      </div>
    </Container>
  </section>
);

/** 6) Zero-gap bordered grid. */
export const PricingBordered: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.tiers.map((t, i) => (
          <div key={i} style={{ borderLeft: i ? "1px solid var(--ds-border)" : "none", background: t.recommended ? "var(--ds-primary-soft)" : "var(--ds-bg)", padding: "1.9rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {t.recommended && <RecoBadge />}<h3 style={nameS}>{t.name}</h3><Price t={t} /><Feats items={t.features} />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 7) All tiers inside one tinted panel. */
export const PricingPanel: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "2.2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.2rem" }}>
          {content.tiers.map((t, i) => (
            <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", borderRadius: "var(--ds-radius)", border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)", padding: "1.7rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {t.recommended && <RecoBadge />}<h3 style={nameS}>{t.name}</h3><Price t={t} /><Feats items={t.features} />
              <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

/** 8) Single-column stacked wide cards. */
export const PricingStacked: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "1.4rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}><h3 style={nameS}>{t.name}</h3>{t.recommended && <RecoBadge />}</div>
              <Feats items={t.features} max={4} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: "flex-end" }}><Price t={t} /><Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 9) Outline cards; the recommended one is filled solid. */
export const PricingOutline: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.2rem" }}>
        {content.tiers.map((t, i) => {
          const f = t.recommended;
          return (
            <div key={i} className="ds-card" style={{ borderRadius: "var(--ds-radius)", padding: "1.9rem", display: "flex", flexDirection: "column", gap: "1rem", border: "1.5px solid var(--ds-primary)", background: f ? "var(--ds-primary)" : "transparent" }}>
              {f && <RecoBadge />}<h3 style={{ ...nameS, color: f ? "var(--ds-primary-fg)" : "var(--ds-text)" }}>{t.name}</h3>
              <Price t={t} light={f} /><Feats items={t.features} light={f} />
              {/* On the primary-filled (often dark) card a plain outline button is dark-on-dark; InvertedTone flips it to a legible --ds-bg solid. */}
              {f
                ? <InvertedTone><Button variant="primary">Auswählen</Button></InvertedTone>
                : <Button variant="primary">Auswählen</Button>}
            </div>
          );
        })}
      </div>
    </Container>
  </section>
);

/** 10) Cards with a corner ribbon on the recommended tier. */
export const PricingRibbon: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.2rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{ position: "relative", overflow: "hidden", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.9rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {t.recommended && <span style={{ position: "absolute", top: "0.9rem", right: "-2.4rem", transform: "rotate(45deg)", background: "var(--ds-primary)", color: "var(--ds-primary-fg)", fontFamily: "var(--ds-font-body)", fontSize: "0.6rem",   padding: "0.25rem 2.4rem" }}>Top</span>}
            <h3 style={nameS}>{t.name}</h3><Price t={t} /><Feats items={t.features} />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 11) Tiers prefixed with an index numeral. */
export const PricingNumbered: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.2rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ds-primary-ink, var(--ds-primary))" }}>{num(i)}</span>
            <h3 style={nameS}>{t.name}</h3><Price t={t} /><Feats items={t.features} />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 12) Price-forward — oversized numerals lead each card. */
export const PricingHeadlinePrice: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.4rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.9rem", padding: "1.6rem 0", borderTop: "1px solid var(--ds-border)" }}>
            <Price t={t} big />
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexWrap: "wrap" }}><h3 style={nameS}>{t.name}</h3>{t.recommended && <RecoBadge />}</div>
            <Feats items={t.features} />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 13) Recommended tier large on the left, the rest stacked on the right. */
export const PricingSplitFeature: React.FC<Props> = ({ content, more }) => {
  const lead = content.tiers.find((t) => t.recommended) ?? content.tiers[0];
  const rest = content.tiers.filter((t) => t !== lead);
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "1.4rem", alignItems: "start" }}>
          <div className="ds-card" style={{ background: "var(--ds-primary-soft)", border: "2px solid var(--ds-primary)", borderRadius: "var(--ds-radius)", padding: "2.2rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <RecoBadge /><h3 style={{ ...nameS, fontSize: "1.4rem" }}>{lead.name}</h3><Price t={lead} big /><Feats items={lead.features} />
            <Button variant="primary">Auswählen</Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {rest.map((t, i) => (
              <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}><h3 style={nameS}>{t.name}</h3><Price t={t} /></div>
                <Feats items={t.features} max={3} /><Button variant="outline">Auswählen</Button>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

/** 14) Slim compact cards — name+price inline, up to 3 features. */
export const PricingCompact: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.8rem" }}><h3 style={{ ...nameS, fontSize: "1rem" }}>{t.name}</h3><span style={{ ...priceS, fontSize: "1.4rem" }}>{t.price}</span></div>
            <Feats items={t.features} max={3} /><Button variant={t.recommended ? "primary" : "outline"}>Wählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 15) Each tier a row with wrap-flowing checkmark features. */
export const PricingChecklistRows: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 900px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.tiers.map((t, i) => (
          <div key={i} style={{ borderTop: i ? "1px solid var(--ds-border)" : "none", background: t.recommended ? "var(--ds-primary-soft)" : "transparent", padding: "1.5rem 1.7rem", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "1.2rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.9rem", flexWrap: "wrap" }}><h3 style={nameS}>{t.name}</h3><Price t={t} /></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.4rem" }}>{t.features.slice(0, 5).map((f, j) => <span key={j} style={{ fontSize: "0.84rem", color: "var(--ds-text-muted)" }}><span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 700 }}><Icon name="check" size={15} style={{ verticalAlign: "-0.15em" }} /></span> {f}</span>)}</div>
            </div>
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 16) Cards with features laid out in two columns. */
export const PricingTwoColFeatures: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length, 3), gap: "1.2rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.9rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {t.recommended && <RecoBadge />}<h3 style={nameS}>{t.name}</h3><Price t={t} />
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1rem", flex: 1 }}>
              {t.features.map((f, j) => <li key={j} style={{ display: "flex", gap: "0.4rem", fontSize: "0.84rem", color: "var(--ds-text)" }}><span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 700 }}><Icon name="check" size={15} style={{ verticalAlign: "-0.15em" }} /></span>{f}</li>)}
            </ul>
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 17) Horizontal scroll-snap rail (good for many tiers). */
export const PricingRail: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "flex", gap: "1.2rem", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "0.6rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{ flex: "0 0 76%", maxWidth: "300px", scrollSnapAlign: "start", background: "var(--ds-bg)", border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {t.recommended && <RecoBadge />}<h3 style={nameS}>{t.name}</h3><Price t={t} /><Feats items={t.features} />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 18) Vertical tabs — tier names left, selected tier detail right. */
export const PricingTabs: React.FC<Props> = ({ content, more }) => {
  const [sel, setSel] = useState(content.tiers.findIndex((t) => t.recommended) >= 0 ? content.tiers.findIndex((t) => t.recommended) : 0);
  const t = content.tiers[sel] ?? content.tiers[0];
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,0.8fr) minmax(0,1.6fr)", gap: "1.6rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {content.tiers.map((x, i) => (
              <button key={i} onClick={() => setSel(i)} style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1rem 1.2rem", background: i === sel ? "var(--ds-primary-soft)" : "var(--ds-bg)", color: "var(--ds-text)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.8rem", fontFamily: "var(--ds-font-heading)", fontWeight: 600 }}>
                <span>{x.name}</span><span style={{ ...perS }}>{x.price}</span>
              </button>
            ))}
          </div>
          <div style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.9rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap" }}><h3 style={{ ...nameS, fontSize: "1.3rem" }}>{t.name}</h3>{t.recommended && <RecoBadge />}</div>
            <Price t={t} big /><Feats items={t.features} /><Button variant="primary">Auswählen</Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

/** 19) Price shown as a large pill chip atop each card. */
export const PricingPills: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.2rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", border: t.recommended ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.9rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem" }}>
            <h3 style={nameS}>{t.name}</h3>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: "0.3rem", background: "var(--ds-primary-soft)", color: "var(--ds-primary-ink, var(--ds-primary))", borderRadius: "var(--ds-radius-pill)", padding: "0.5rem 1.2rem" }}><span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.6rem" }}>{t.price}</span><span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem" }}>{t.period}</span></div>
            <Feats items={t.features} /><Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 20) Soft shadowed rounded cards. */
export const PricingSoftCards: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "1.4rem" }}>
        {content.tiers.map((t, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", borderRadius: "1rem", padding: "2rem", boxShadow: t.recommended ? "0 18px 40px -16px var(--ds-primary)" : "var(--ds-shadow-card)", border: "1px solid var(--ds-border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {t.recommended && <RecoBadge />}<h3 style={nameS}>{t.name}</h3><Price t={t} /><Feats items={t.features} />
            <Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 21) Table-like — tier header row, then its features as listed rows. */
export const PricingTable: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 960px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: cols(content.tiers.length), gap: "0", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.tiers.map((t, i) => (
          <div key={i} style={{ borderLeft: i ? "1px solid var(--ds-border)" : "none", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "1.5rem", background: t.recommended ? "var(--ds-primary)" : "var(--ds-primary-soft)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h3 style={{ ...nameS, color: t.recommended ? "var(--ds-primary-fg)" : "var(--ds-text)" }}>{t.name}</h3>
              <Price t={t} light={t.recommended} />
            </div>
            <div style={{ padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column" }}>
              {t.features.map((f, j) => <span key={j} style={{ padding: "0.5rem 0", borderTop: j ? "1px solid var(--ds-border)" : "none", fontSize: "0.86rem", color: "var(--ds-text)" }}>{f}</span>)}
            </div>
            <div style={{ padding: "1.2rem 1.5rem", marginTop: "auto" }}><Button variant={t.recommended ? "primary" : "outline"}>Auswählen</Button></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
