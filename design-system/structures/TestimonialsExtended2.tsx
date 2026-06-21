/**
 * Testimonials STRUCTURES — batch 2. Same TestimonialsContent; token-only.
 * Render only the items given (real-data gating happens upstream).
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
const cap: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)", lineHeight: 1.5 };
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const Rating: React.FC<{ c: TestimonialsContent }> = ({ c }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 1rem", borderRadius: "var(--ds-radius-pill)", background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)" }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--ds-primary)", fontWeight: 700 }}><Icon name="star" size={14} /> {c.rating}</span>
    <span style={cap}>{c.reviewCount}</span>
  </div>
);
const Head: React.FC<{ c: TestimonialsContent; rating?: boolean }> = ({ c, rating = true }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2.2rem" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}><Eyebrow>{c.eyebrow}</Eyebrow><h2 style={headingStyle}>{c.heading}</h2></div>
    {rating && <Rating c={c} />}
  </div>
);
const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => (
  <div style={{ width: size, height: size, flexShrink: 0, borderRadius: "9999px", background: "var(--ds-primary-soft)", color: "var(--ds-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: `${size / 90 + 0.45}rem` }}>{initials(name)}</div>
);

/** 1) Giant centered quote with a faint watermark glyph. */
export const TestimonialsBigQuote: React.FC<Props> = ({ content }) => {
  const t = content.items[0];
  if (!t) return null;
  return (
    <section style={sectionBase}>
      <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
        <div style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.4rem" }}>
          <span aria-hidden style={{ position: "absolute", top: "-2.5rem", left: "50%", transform: "translateX(-50%)", fontFamily: "var(--ds-font-heading)", fontSize: "8rem", color: "var(--ds-primary-soft)", lineHeight: 1 }}>“</span>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <blockquote style={{ position: "relative", margin: 0, fontFamily: "var(--ds-font-heading)", fontSize: "2rem", lineHeight: 1.3, color: "var(--ds-text)" }}>{t.quote}</blockquote>
          <div style={cap}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaFull(t) && <> · {metaFull(t)}</>}</div>
        </div>
      </Container>
    </section>
  );
};

/** 2) Cards with a monogram avatar. */
export const TestimonialsAvatarCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <Head c={content} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.2rem" }}>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.98rem", lineHeight: 1.55, color: "var(--ds-text)", flex: 1 }}>“{t.quote}”</blockquote>
            <figcaption style={{ display: "flex", alignItems: "center", gap: "0.8rem", borderTop: "1px solid var(--ds-border)", paddingTop: "0.9rem" }}>
              <Avatar name={t.person} />
              <div style={{ display: "flex", flexDirection: "column" }}><strong style={{ fontFamily: "var(--ds-font-heading)", fontSize: "0.92rem", color: "var(--ds-text)" }}>{t.person}</strong>{metaCompany(t) && <span style={cap}>{metaCompany(t)}</span>}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Masonry columns of quote cards. */
export const TestimonialsMasonry: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <Head c={content} />
      <div style={{ columnCount: 3, columnGap: "1.2rem" }}>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: "0 0 1.2rem", breakInside: "avoid", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.4rem", display: "inline-block", width: "100%" }}>
            <blockquote style={{ margin: "0 0 0.8rem", fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
            <figcaption style={cap}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaCity(t) && <> · {metaCity(t)}</>}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

/** 4) Inverted dark band of quote cards. */
export const TestimonialsDark: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2.2rem" }}>
        <h2 style={{ ...headingStyle, color: "var(--ds-bg)" }}>{content.heading}</h2>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--ds-primary)", fontWeight: 700 }}><Icon name="star" size={15} /> {content.rating} <span style={{ ...cap, color: "var(--ds-bg)", opacity: 0.75 }}>{content.reviewCount}</span></span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.2rem" }}>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: "var(--ds-radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.98rem", lineHeight: 1.55, color: "var(--ds-bg)" }}>“{t.quote}”</blockquote>
            <figcaption style={{ ...cap, color: "var(--ds-bg)", opacity: 0.75 }}><strong style={{ color: "var(--ds-bg)" }}>{t.person}</strong>{metaCompany(t) && <> · {metaCompany(t)}</>}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

/** 5) Borderless minimal hairline list. */
export const TestimonialsMinimalList: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <Head c={content} rating={false} />
      <div>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, padding: "1.4rem 0", borderTop: "1px solid var(--ds-border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "1.05rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
            <figcaption style={cap}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaFull(t) && <> · {metaFull(t)}</>}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Full-width rating banner + cards below. */
export const TestimonialsRatingHeader: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.6rem", background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", marginBottom: "1.4rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "2.4rem", color: "var(--ds-primary)", lineHeight: 1 }}><Icon name="star" size={30} /> {content.rating}</div>
        <div style={cap}>{content.reviewCount} · {content.heading}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "1.2rem" }}>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
            <figcaption style={cap}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaCity(t) && <> · {metaCity(t)}</>}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

/** 7) Zig-zag rows with monogram avatar. */
export const TestimonialsZigzagAvatar: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
      <Head c={content} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
        {content.items.map((t, i) => {
          const right = i % 2 === 1;
          return (
            <div key={i} style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start" }}>
              <figure style={{ margin: 0, maxWidth: "72%", display: "flex", gap: "1rem", flexDirection: right ? "row-reverse" : "row", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.3rem 1.5rem" }}>
                <Avatar name={t.person} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: right ? "right" : "left" }}>
                  <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.96rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
                  <figcaption style={cap}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaCompany(t) && <> · {metaCompany(t)}</>}</figcaption>
                </div>
              </figure>
            </div>
          );
        })}
      </div>
    </Container>
  </section>
);

/** 8) Auto-scrolling marquee of quote chips. */
export const TestimonialsMarquee: React.FC<Props> = ({ content }) => {
  const css = `@keyframes ds-tm-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion: reduce){.ds-tm-row{animation:none !important}}`;
  const row = [...content.items, ...content.items];
  return (
    <section style={{ ...sectionBase, overflow: "hidden" }}>
      <style>{css}</style>
      <Container><Head c={content} /></Container>
      <div style={{ display: "flex", gap: "1.2rem", whiteSpace: "normal" }} className="ds-tm-row-wrap">
        <div className="ds-tm-row" style={{ display: "flex", gap: "1.2rem", animation: "ds-tm-marquee 40s linear infinite", willChange: "transform" }}>
          {row.map((t, i) => (
            <figure key={i} style={{ margin: 0, flex: "0 0 320px", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.5, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
              <figcaption style={cap}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaCity(t) && <> · {metaCity(t)}</>}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

/** 9) Quote cards (no per-item rating exists, so no fabricated star row). */
export const TestimonialsStars: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <Head c={content} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.2rem" }}>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "0.96rem", lineHeight: 1.55, color: "var(--ds-text)", flex: 1 }}>“{t.quote}”</blockquote>
            <figcaption style={cap}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaCompany(t) && <> · {metaCompany(t)}</>}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

/** 10) Quotes inside one tinted panel, hairline-divided. */
export const TestimonialsPanel: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
      <Head c={content} />
      <div style={{ background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "0.4rem 1.8rem" }}>
        {content.items.map((t, i) => (
          <figure key={i} style={{ margin: 0, padding: "1.4rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-body)", fontSize: "1rem", lineHeight: 1.55, color: "var(--ds-text)" }}>“{t.quote}”</blockquote>
            <figcaption style={cap}><strong style={{ color: "var(--ds-text)" }}>{t.person}</strong>{metaFull(t) && <> · {metaFull(t)}</>}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);
