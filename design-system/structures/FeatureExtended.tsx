/**
 * Sixteen image-forward "Feature" STRUCTURES (Bild + Text band). Content =
 * FeatureContent ({ eyebrow, heading, body, bullets?, image, cta? }). These are
 * the main lever against a "generic / image-poor" page — every variant pairs a
 * real/stock photo with copy. Token-only. All require an image (needsImage in the
 * registry), so they only render where a picture is actually available.
 */
import React from "react";
import { Container, Button } from "./primitives";
import { Icon } from "../icons/iconSets";

type FeatureContent = { eyebrow: string; heading: string; body: string; bullets?: string[]; image: string; cta?: { label: string; href?: string } };
type Props = { content: FeatureContent };

const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const cover = (img: string): React.CSSProperties => ({ backgroundImage: `url("${img}")`, backgroundSize: "cover", backgroundPosition: "center" });
const eyebrowS = (light?: boolean): React.CSSProperties => ({ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: light ? "rgba(255,255,255,0.7)" : "var(--ds-text-muted)" });
const headingS = (light?: boolean): React.CSSProperties => ({ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display-h2, 1.9rem)", lineHeight: 1.15, color: light ? "#fff" : "var(--ds-text)", margin: 0 });
const bodyS = (light?: boolean): React.CSSProperties => ({ fontFamily: "var(--ds-font-body)", fontSize: "1.02rem", lineHeight: 1.6, color: light ? "rgba(255,255,255,0.85)" : "var(--ds-text-muted)", margin: 0 });

const Bullets: React.FC<{ items?: string[]; light?: boolean }> = ({ items, light }) => !items?.length ? null : (
  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
    {items.map((b, i) => (
      <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.92rem", lineHeight: 1.45, color: light ? "rgba(255,255,255,0.9)" : "var(--ds-text)" }}>
        <span aria-hidden style={{ color: "var(--ds-primary)", display: "inline-flex", marginTop: "0.15rem" }}><Icon name="check" size={15} /></span>{b}
      </li>
    ))}
  </ul>
);

const Text: React.FC<{ c: FeatureContent; light?: boolean }> = ({ c, light }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
    <span style={eyebrowS(light)}>{c.eyebrow}</span>
    <h2 style={headingS(light)}>{c.heading}</h2>
    <p style={bodyS(light)}>{c.body}</p>
    <Bullets items={c.bullets} light={light} />
    {c.cta && <div style={{ marginTop: "0.3rem" }}><Button variant="primary" to={c.cta.href}>{c.cta.label}</Button></div>}
  </div>
);

const Photo: React.FC<{ img: string; style?: React.CSSProperties }> = ({ img, style }) => (
  <div aria-hidden style={{ minHeight: "320px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(img), ...style }} />
);

/** 1) Image left, text right. */
export const FeatureSplitLeft: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
      <Photo img={content.image} /><Text c={content} />
    </div>
  </Container></section>
);

/** 2) Text left, image right. */
export const FeatureSplitRight: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
      <Text c={content} /><Photo img={content.image} />
    </div>
  </Container></section>
);

/** 3) Text narrow, wide image right. */
export const FeatureWideImage: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "2.4rem", alignItems: "center" }}>
      <Text c={content} /><Photo img={content.image} style={{ minHeight: "380px" }} />
    </div>
  </Container></section>
);

/** 4) Image with an overlapping text card. */
export const FeatureOverlapCard: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "0", alignItems: "center" }}>
      <Photo img={content.image} style={{ minHeight: "420px" }} />
      <div className="ds-feat-overlap" style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "2rem", marginLeft: "-3rem", position: "relative", zIndex: 1 }}><Text c={content} /></div>
    </div>
  </Container></section>
);

/** 5) Image + text inside one bordered frame. */
export const FeatureBordered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "0", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", alignItems: "stretch" }}>
      <div aria-hidden style={{ minHeight: "340px", ...cover(content.image) }} />
      <div style={{ padding: "2.2rem", display: "flex", alignItems: "center" }}><Text c={content} /></div>
    </div>
  </Container></section>
);

/** 6) Text on a tinted panel beside the image. */
export const FeatureTinted: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "1.6rem", alignItems: "stretch" }}>
      <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "2.2rem", display: "flex", alignItems: "center" }}><Text c={content} /></div>
      <Photo img={content.image} style={{ minHeight: "360px" }} />
    </div>
  </Container></section>
);

/** 7) Wide image on top, text below. */
export const FeatureImageTop: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 900px)" }}>
    <Photo img={content.image} style={{ minHeight: "300px", marginBottom: "1.8rem" }} />
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}><span style={eyebrowS()}>{content.eyebrow}</span><h2 style={headingS()}>{content.heading}</h2><p style={bodyS()}>{content.body}</p></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}><Bullets items={content.bullets} />{content.cta && <Button variant="primary" to={content.cta.href}>{content.cta.label}</Button>}</div>
    </div>
  </Container></section>
);

/** 8) Inverted dark band, image + light text. */
export const FeatureDark: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "var(--ds-section-y)" }}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
      <Text c={content} light /><div aria-hidden style={{ minHeight: "360px", borderRadius: "var(--ds-radius)", border: "1px solid rgba(255,255,255,0.18)", ...cover(content.image) }} />
    </div>
  </Container></section>
);

/** 9) Offset framed image + text. */
export const FeatureOffsetFrame: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
      <div style={{ position: "relative", paddingTop: "1rem", paddingLeft: "1rem" }}>
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "82%", height: "88%", border: "1px solid var(--ds-primary)", borderRadius: "var(--ds-radius)" }} />
        <Photo img={content.image} style={{ position: "relative", minHeight: "360px", boxShadow: "var(--ds-shadow-card)" }} />
      </div>
      <Text c={content} />
    </div>
  </Container></section>
);

/** 10) Extra-rounded large image + text. */
export const FeatureRounded: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
      <div aria-hidden style={{ minHeight: "400px", borderRadius: "1.4rem", ...cover(content.image) }} /><Text c={content} />
    </div>
  </Container></section>
);

/** 11) Full-bleed image band with a scrim and overlaid text. */
export const FeatureBandFull: React.FC<Props> = ({ content }) => (
  <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--ds-border)", ...cover(content.image) }}>
    <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.72), rgba(0,0,0,0.30))" }} />
    <Container style={{ position: "relative", paddingBlock: "calc(var(--ds-section-y) * 1.4)" }}>
      <div style={{ maxWidth: "44ch", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <span style={{ ...eyebrowS(true) }}>{content.eyebrow}</span>
        <h2 style={{ ...headingS(true), fontSize: "var(--ds-display-h2, 2.2rem)" }}>{content.heading}</h2>
        <p style={bodyS(true)}>{content.body}</p>
        <Bullets items={content.bullets} light />
        {content.cta && <div style={{ marginTop: "0.3rem" }}><Button variant="primary" to={content.cta.href}>{content.cta.label}</Button></div>}
      </div>
    </Container>
  </section>
);

/** 12) Wide image + caption strip beneath. */
export const FeatureCaption: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div aria-hidden style={{ minHeight: "360px", borderRadius: "var(--ds-radius) var(--ds-radius) 0 0", ...cover(content.image) }} />
    <div style={{ border: "1px solid var(--ds-border)", borderTop: "none", borderRadius: "0 0 var(--ds-radius) var(--ds-radius)", padding: "1.8rem 2rem", display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: "1.6rem", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}><span style={eyebrowS()}>{content.eyebrow}</span><h2 style={{ ...headingS(), fontSize: "1.5rem" }}>{content.heading}</h2><p style={bodyS()}>{content.body}</p></div>
      {content.cta && <div style={{ justifySelf: "end" }}><Button variant="primary" to={content.cta.href}>{content.cta.label}</Button></div>}
    </div>
  </Container></section>
);

/** 13) Two-thirds image, one-third text. */
export const FeatureTwoThirds: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: "2.2rem", alignItems: "center" }}>
      <Photo img={content.image} style={{ minHeight: "420px" }} /><Text c={content} />
    </div>
  </Container></section>
);

/** 14) Minimal split, no chrome on the image. */
export const FeatureMinimal: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "3rem", alignItems: "center" }}>
      <Text c={content} />
      <div aria-hidden style={{ minHeight: "340px", borderRadius: "var(--ds-radius)", ...cover(content.image) }} />
    </div>
  </Container></section>
);

/** 15) Image with the eyebrow as a chip overlay + text beside. */
export const FeatureChipOverlay: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        <Photo img={content.image} style={{ minHeight: "360px" }} />
        <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--ds-bg)", color: "var(--ds-primary)", fontFamily: "var(--ds-font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: "var(--ds-radius-pill)", padding: "0.35rem 0.8rem", boxShadow: "var(--ds-shadow-card)" }}>{content.eyebrow}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}><h2 style={headingS()}>{content.heading}</h2><p style={bodyS()}>{content.body}</p><Bullets items={content.bullets} />{content.cta && <div><Button variant="primary" to={content.cta.href}>{content.cta.label}</Button></div>}</div>
    </div>
  </Container></section>
);

/** 16) Statement heading + bullets, image right. */
export const FeatureStatement: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <span style={eyebrowS()}>{content.eyebrow}</span>
        <h2 style={{ ...headingS(), fontSize: "var(--ds-display-h2, 2.2rem)", lineHeight: 1.2 }}>{content.heading}</h2>
        <Bullets items={content.bullets} />
        {content.cta && <div><Button variant="primary" to={content.cta.href}>{content.cta.label}</Button></div>}
      </div>
      <Photo img={content.image} style={{ minHeight: "380px" }} />
    </div>
  </Container></section>
);
