/**
 * Twenty-two About / "Über uns" STRUCTURES. Content = AboutContent
 * ({ eyebrow, heading, lead, paragraphs[], highlights?: { value, label }[] }).
 * Token-only. A story/prose section — variants treat heading + lead + body
 * paragraphs (+ optional credential highlights). Highlight rows render only when
 * highlights exist (we never fabricate numbers), so all variants degrade cleanly.
 */
import React from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import type { AboutContent } from "../content/sectionContent";

type Props = { content: AboutContent };
const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const leadS: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "1.15rem", lineHeight: 1.55, color: "var(--ds-text)", margin: 0 };
const paraS: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ds-text-muted)", margin: 0 };
const hasHi = (c: AboutContent) => !!(c.highlights && c.highlights.length);

const Paras: React.FC<{ items: string[]; light?: boolean }> = ({ items, light }) => (
  <>{items.map((p, i) => <p key={i} style={{ ...paraS, ...(light ? { color: "rgba(255,255,255,0.9)" } : {}) }}>{p}</p>)}</>
);
const Highlights: React.FC<{ c: AboutContent; light?: boolean }> = ({ c, light }) => !hasHi(c) ? null : (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.highlights!.length, 4)}, minmax(0,1fr))`, gap: "1.2rem" }}>
    {c.highlights!.map((h, i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.8rem", color: light ? "#fff" : "var(--ds-text)" }}>{h.value}</span>
        <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.78rem", color: light ? "rgba(255,255,255,0.7)" : "var(--ds-text-muted)" }}>{h.label}</span>
      </div>
    ))}
  </div>
);

/** 1) Text left, optional highlight panel right. */
export const AboutSplit: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
        <p style={leadS}>{content.lead}</p><Paras items={content.paragraphs} />
      </div>
      {hasHi(content)
        ? <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>{content.highlights!.map((h, i) => <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}><span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "2rem", color: "var(--ds-text)" }}>{h.value}</span><span style={{ fontSize: "0.82rem", color: "var(--ds-text-muted)" }}>{h.label}</span></div>)}</div>
        : <p style={{ ...leadS, fontStyle: "italic", color: "var(--ds-text-muted)" }}>{content.lead}</p>}
    </div>
  </Container></section>
);

/** 2) Centered, narrow column. */
export const AboutCentered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 720px)" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", alignItems: "center", textAlign: "center" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <p style={leadS}>{content.lead}</p><Paras items={content.paragraphs} />
    </div>
  </Container></section>
);

/** 3) Lead full-width, paragraphs in two columns. */
export const AboutTwoColParagraphs: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <p style={{ ...leadS, maxWidth: "60ch", marginBottom: "1.4rem" }}>{content.lead}</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.4rem 2.4rem" }}><Paras items={content.paragraphs} /></div>
  </Container></section>
);

/** 4) Text + a highlights bar beneath. */
export const AboutHighlightsBar: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <p style={leadS}>{content.lead}</p><div style={{ marginTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}><Paras items={content.paragraphs} /></div>
    {hasHi(content) && <div style={{ marginTop: "1.8rem", paddingTop: "1.6rem", borderTop: "1px solid var(--ds-border)" }}><Highlights c={content} /></div>}
  </Container></section>
);

/** 5) Oversized lead statement, paragraphs beneath. */
export const AboutLeadQuote: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <p style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.6rem", lineHeight: 1.4, color: "var(--ds-text)", margin: "0 0 1.4rem" }}>{content.lead}</p>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxWidth: "62ch" }}><Paras items={content.paragraphs} /></div>
  </Container></section>
);

/** 6) Heading+lead sticky left, paragraphs right. */
export const AboutSidebar: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "3rem", alignItems: "start" }}>
      <div style={{ position: "sticky", top: "6rem", display: "flex", flexDirection: "column", gap: "1rem" }}><SectionHead eyebrow={content.eyebrow} heading={content.heading} /><p style={paraS}>{content.lead}</p></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}><Paras items={content.paragraphs} />{hasHi(content) && <div style={{ marginTop: "1rem" }}><Highlights c={content} /></div>}</div>
    </div>
  </Container></section>
);

/** 7) Bordered box. */
export const AboutBordered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
    <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "2.2rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <p style={leadS}>{content.lead}</p><Paras items={content.paragraphs} />
    </div>
  </Container></section>
);

/** 8) Inverted dark band. */
export const AboutDark: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "var(--ds-section-y)" }}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.6rem" }}>{content.eyebrow}</div>
    <h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "var(--ds-display-h2, 2rem)", color: "#fff", margin: "0 0 1.1rem" }}>{content.heading}</h2>
    <p style={{ ...leadS, color: "#fff" }}>{content.lead}</p>
    <div style={{ marginTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}><Paras items={content.paragraphs} light /></div>
    {hasHi(content) && <div style={{ marginTop: "1.8rem", paddingTop: "1.6rem", borderTop: "1px solid rgba(255,255,255,0.18)" }}><Highlights c={content} light /></div>}
  </Container></section>
);

/** 9) Soft-tint panel. */
export const AboutTinted: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "2.2rem", display: "grid", gridTemplateColumns: hasHi(content) ? "minmax(0,1.6fr) minmax(0,1fr)" : "1fr", gap: "2rem", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}><SectionHead eyebrow={content.eyebrow} heading={content.heading} /><p style={leadS}>{content.lead}</p><Paras items={content.paragraphs} /></div>
      {hasHi(content) && <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>{content.highlights!.map((h, i) => <div key={i}><div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.8rem", color: "var(--ds-text)" }}>{h.value}</div><div style={{ fontSize: "0.8rem", color: "var(--ds-text-muted)" }}>{h.label}</div></div>)}</div>}
    </div>
  </Container></section>
);

/** 10) Borderless minimal — big lead. */
export const AboutMinimal: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 780px)" }}>
    <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ds-text-muted)" }}>{content.eyebrow}</span>
    <p style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.7rem", lineHeight: 1.35, color: "var(--ds-text)", margin: "0.8rem 0 1.4rem" }}>{content.lead}</p>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}><Paras items={content.paragraphs} /></div>
  </Container></section>
);

/** 11) Editorial masthead — rule, heading, lead, paragraphs. */
export const AboutEyebrowRule: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ borderTop: "2px solid var(--ds-text)", paddingTop: "1.2rem" }}>
      <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ds-text-muted)", marginBottom: "0.6rem" }}>{content.eyebrow}</div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "2.4rem", alignItems: "start" }}>
        <h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "var(--ds-display-h2, 1.9rem)", lineHeight: 1.15, color: "var(--ds-text)", margin: 0 }}>{content.heading}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}><p style={leadS}>{content.lead}</p><Paras items={content.paragraphs} /></div>
      </div>
    </div>
  </Container></section>
);

/** 12) Paragraphs as ruled columns. */
export const AboutColumns: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <p style={{ ...leadS, textAlign: "center", maxWidth: "60ch", margin: "0 auto 1.8rem" }}>{content.lead}</p>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.paragraphs.length, 3) || 1}, minmax(0,1fr))`, gap: "1.6rem" }}>
      {content.paragraphs.map((p, i) => <div key={i} style={{ borderTop: "2px solid var(--ds-primary)", paddingTop: "1rem" }}><p style={paraS}>{p}</p></div>)}
    </div>
  </Container></section>
);

/** 13) Highlight cards above the text. */
export const AboutHighlightsCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    {hasHi(content) && <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.highlights!.length, 4)}, minmax(0,1fr))`, gap: "1rem", marginBottom: "1.8rem" }}>
      {content.highlights!.map((h, i) => <div key={i} style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.2rem", textAlign: "center" }}><div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.6rem", color: "var(--ds-text)" }}>{h.value}</div><div style={{ fontSize: "0.78rem", color: "var(--ds-text-muted)" }}>{h.label}</div></div>)}
    </div>}
    <p style={{ ...leadS, textAlign: "center", maxWidth: "62ch", margin: "0 auto 1rem" }}>{content.lead}</p>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxWidth: "62ch", marginInline: "auto" }}><Paras items={content.paragraphs} /></div>
  </Container></section>
);

/** 14) First paragraph featured panel, rest beside. */
export const AboutFeatureLead: React.FC<Props> = ({ content }) => {
  const [p0, ...rest] = content.paragraphs;
  return (
    <section style={sectionBase}><Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>
        <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "1.8rem" }}><p style={leadS}>{content.lead}</p>{p0 && <p style={{ ...paraS, marginTop: "0.8rem" }}>{p0}</p>}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}><Paras items={rest} />{hasHi(content) && <Highlights c={content} />}</div>
      </div>
    </Container></section>
  );
};

/** 15) Centered + highlights row beneath. */
export const AboutCenteredHighlights: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <p style={leadS}>{content.lead}</p><Paras items={content.paragraphs} />
    </div>
    {hasHi(content) && <div style={{ marginTop: "1.8rem", display: "flex", justifyContent: "center", gap: "2.4rem", flexWrap: "wrap", textAlign: "center" }}>{content.highlights!.map((h, i) => <div key={i}><div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.8rem", color: "var(--ds-text)" }}>{h.value}</div><div style={{ fontSize: "0.78rem", color: "var(--ds-text-muted)" }}>{h.label}</div></div>)}</div>}
  </Container></section>
);

/** 16) Offset heading + indented body. */
export const AboutOffset: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "var(--ds-display)", lineHeight: 1.05, color: "var(--ds-text)", margin: "0 0 1.6rem", maxWidth: "16ch" }}>{content.heading}</h2>
    <div style={{ marginLeft: "auto", maxWidth: "60ch", display: "flex", flexDirection: "column", gap: "0.9rem" }}><p style={leadS}>{content.lead}</p><Paras items={content.paragraphs} /></div>
  </Container></section>
);

/** 17) Full tinted band with highlights. */
export const AboutBandHighlights: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "var(--ds-section-y)" }}><Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <p style={{ ...leadS, textAlign: "center", maxWidth: "60ch", margin: "0 auto 1.6rem" }}>{content.lead}</p>
    {hasHi(content) && <div style={{ background: "var(--ds-bg)", borderRadius: "var(--ds-radius)", padding: "1.6rem" }}><Highlights c={content} /></div>}
  </Container></section>
);

/** 18) Big heading, lead, paragraphs stacked. */
export const AboutStackedBig: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ds-text-muted)" }}>{content.eyebrow}</span>
    <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "var(--ds-display)", lineHeight: 1.05, color: "var(--ds-text)", margin: "0.6rem 0 1.2rem" }}>{content.heading}</h2>
    <p style={leadS}>{content.lead}</p>
    <div style={{ marginTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}><Paras items={content.paragraphs} /></div>
  </Container></section>
);

/** 19) Paragraphs + inline highlight chips. */
export const AboutInlineStats: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <p style={leadS}>{content.lead}</p>
    <div style={{ marginTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}><Paras items={content.paragraphs} /></div>
    {hasHi(content) && <div style={{ marginTop: "1.4rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>{content.highlights!.map((h, i) => <span key={i} style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-pill)", padding: "0.45rem 1rem", fontSize: "0.82rem", color: "var(--ds-text)" }}><strong>{h.value}</strong> {h.label}</span>)}</div>}
  </Container></section>
);

/** 20) Quiet prose column. */
export const AboutQuietProse: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 680px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}><p style={leadS}>{content.lead}</p><Paras items={content.paragraphs} /></div>
  </Container></section>
);

/** 21) Two-column: lead+highlights left, paragraphs right. */
export const AboutLeadHighlightsSplit: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)", gap: "2.4rem", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}><p style={leadS}>{content.lead}</p>{hasHi(content) && <Highlights c={content} />}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}><Paras items={content.paragraphs} /></div>
    </div>
  </Container></section>
);

/** 22) Ruled paragraph milestones. */
export const AboutMilestones: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <p style={{ ...leadS, marginBottom: "1.4rem" }}>{content.lead}</p>
    <div>{content.paragraphs.map((p, i) => (
      <div key={i} style={{ padding: "1rem 0", borderTop: "1px solid var(--ds-border)" }}>
        <p style={paraS}>{p}</p>
      </div>
    ))}</div>
  </Container></section>
);
