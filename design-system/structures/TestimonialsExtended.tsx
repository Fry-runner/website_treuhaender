/**
 * Ten additional Testimonials STRUCTURES (social-proof slot). Same
 * TestimonialsContent as the original two (grid / carousel); token-only, so they
 * re-skin with the active look. They only ever render the items they are given —
 * real-data gating happens upstream in selection, not here.
 */
import React from "react";
import { Container, Eyebrow } from "./primitives";
import { Icon } from "../icons/iconSets";
import type { TestimonialsContent } from "../content/types";

type Props = { content: TestimonialsContent };
type Item = TestimonialsContent["items"][number];
/** Attribution helpers — join only the present fields so empty company/city
 *  never produce a dangling or doubled "·". */
const metaFull = (t: Item) => [t.company, t.city].filter(Boolean).join(" · ");
const metaCompany = (t: Item) => (t.company || "").trim();
const metaCity = (t: Item) => (t.city || "").trim();
const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const headingStyle: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display-h2, 2rem)", letterSpacing: "var(--ds-headline-tracking)", color: "var(--ds-text)", margin: 0 };
const capStyle: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)", lineHeight: 1.5 };

const Rating: React.FC<{ c: TestimonialsContent }> = ({ c }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 1rem", borderRadius: "var(--ds-radius-pill)", background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)" }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--ds-primary)", fontWeight: 700 }}><Icon name="star" size={14} /> {c.rating}</span>
    <span style={capStyle}>{c.reviewCount}</span>
  </div>
);
const Head: React.FC<{ c: TestimonialsContent; rating?: boolean }> = ({ c, rating = true }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2.2rem" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}><Eyebrow>{c.eyebrow}</Eyebrow><h2 style={headingStyle}>{c.heading}</h2></div>
    {rating && <Rating c={c} />}
  </div>
);

/** 1) Single large featured quote, centered. */
export const TestimonialsSpotlight: React.FC<Props> = ({ content }) => {
  const t = content.items[0];
  if (!t) return null;
  return (
    <section style={sectionBase}>
      <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.4rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Rating c={content} />
          <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-heading)", fontSize: "1.7rem", lineHeight: 1.35, color: "var(--ds-text)", fontStyle: "italic" }}>“{t.quote}”</blockquote>
          <div style={capStyle}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaFull(t) && <> · {metaFull(t)}</>}</div>
        </div>
      </Container>
    </section>
  );
};

/** 2) Two-column larger cards. */
export const TestimonialsTwoCol: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <Head c={content} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.4rem" }}>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "1.05rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
            <div style={{ height: "2px", width: "2rem", background: "var(--ds-primary)" }} />
            <figcaption style={capStyle}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaFull(t) && <><br />{metaFull(t)}</>}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Full-width stacked rows, hairline divided. */
export const TestimonialsStacked: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
      <Head c={content} />
      <div>
        {content.items.map((t, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "2rem", alignItems: "baseline", padding: "1.6rem 0", borderTop: "1px solid var(--ds-border)" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-heading)", fontSize: "1.2rem", lineHeight: 1.45, color: "var(--ds-text)", fontStyle: "italic" }}>“{t.quote}”</blockquote>
            <div style={{ ...capStyle, textAlign: "right", whiteSpace: "nowrap" }}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaFull(t) && <><br />{metaFull(t)}</>}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 4) Zero-gap hairline-divided grid. */
export const TestimonialsBordered: React.FC<Props> = ({ content }) => {
  const cols = Math.min(content.items.length, 3);
  return (
    <section style={sectionBase}>
      <Container>
        <Head c={content} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {content.items.map((t, i) => (
            <figure key={i} style={{ margin: 0, padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.9rem", borderLeft: i % cols === 0 ? "none" : "1px solid var(--ds-border)", borderTop: i >= cols ? "1px solid var(--ds-border)" : "none" }}>
              <span style={{ color: "var(--ds-primary)", fontSize: "1.6rem", lineHeight: 1 }}>“</span>
              <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.96rem", lineHeight: 1.55, color: "var(--ds-text)", flex: 1 }}>{t.quote}</blockquote>
              <figcaption style={capStyle}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaCompany(t) && <> · {metaCompany(t)}</>}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 5) Dense quote-wall of small chips. */
export const TestimonialsQuoteWall: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <Head c={content} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
            <figcaption style={{ ...capStyle, fontSize: "0.66rem" }}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaCity(t) && <> · {metaCity(t)}</>}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Big rating panel left, stacked quotes right. */
export const TestimonialsSplitRating: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "2.4rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "3rem", color: "var(--ds-primary)", lineHeight: 1 }}><Icon name="star" size={38} /> {content.rating}</div>
          <div style={capStyle}>{content.reviewCount}</div>
          <h2 style={{ ...headingStyle, fontSize: "1.4rem" }}>{content.heading}</h2>
        </div>
        <div>
          {content.items.map((t, i) => (
            <figure key={i} style={{ margin: 0, padding: "1.3rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "1rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
              <figcaption style={capStyle}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaFull(t) && <> · {metaFull(t)}</>}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

/** 7) Zig-zag alternating quote rows. */
export const TestimonialsAlternating: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 900px)" }}>
      <Head c={content} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
        {content.items.map((t, i) => {
          const right = i % 2 === 1;
          return (
            <div key={i} style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start" }}>
              <figure style={{ margin: 0, maxWidth: "70%", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.4rem 1.6rem", textAlign: right ? "right" : "left", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.98rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
                <figcaption style={capStyle}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaCompany(t) && <> · {metaCompany(t)}</>}</figcaption>
              </figure>
            </div>
          );
        })}
      </div>
    </Container>
  </section>
);

/** 8) Horizontal scroll-snap rail of quote cards. */
export const TestimonialsRail: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <Head c={content} />
    </Container>
    <div style={{ display: "flex", gap: "1.2rem", overflowX: "auto", paddingInline: "var(--ds-gutter)", scrollSnapType: "x mandatory", paddingBottom: "0.6rem" }}>
      {content.items.map((t, i) => (
        <figure key={i} style={{ margin: 0, flex: "0 0 min(80%, 360px)", scrollSnapAlign: "start", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "1rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
          <div style={{ height: "2px", width: "2rem", background: "var(--ds-primary)" }} />
          <figcaption style={capStyle}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaFull(t) && <><br />{metaFull(t)}</>}</figcaption>
        </figure>
      ))}
    </div>
  </section>
);

/** 9) Hairline-divided quote list. */
export const TestimonialsNumbered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 840px)" }}>
      <Head c={content} />
      <div>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1.4rem 0", borderTop: "1px solid var(--ds-border)" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "1rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
            <figcaption style={capStyle}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaFull(t) && <> · {metaFull(t)}</>}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

/** 10) Featured quote left, compact attribution list right. */
export const TestimonialsFeatureSide: React.FC<Props> = ({ content }) => {
  const [first, ...rest] = content.items;
  if (!first) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
          <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-heading)", fontSize: "1.6rem", lineHeight: 1.4, color: "var(--ds-text)", fontStyle: "italic" }}>“{first.quote}”</blockquote>
            <figcaption style={capStyle}><strong style={{ color: "var(--ds-text)" }}>{first.person}</strong>{metaFull(first) && <> · {metaFull(first)}</>}</figcaption>
          </figure>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <Rating c={content} />
            {rest.map((t, i) => (
              <div key={i} style={{ padding: "0.9rem 0", borderTop: "1px solid var(--ds-border)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
                <span style={{ ...capStyle, fontSize: "0.66rem" }}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaCity(t) && <> · {metaCity(t)}</>}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
