/**
 * Image-embedding STRUCTURES — batch 2. Same GalleryContent; token-only, fed from
 * the firm's media pool. Each renders nothing when it has no images.
 */
import React from "react";
import { Container } from "./primitives";
import { SectionHead, SectionMore, type MoreLink } from "./SectionHead";
import { useNavigate } from "../compose/nav-context";
import { Icon } from "../icons/iconSets";
import type { GalleryContent } from "./GalleryExtended";

type Props = { content: GalleryContent; more?: MoreLink };
const sectionBase: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const cover = (src: string): React.CSSProperties => ({ backgroundImage: `url("${src}")`, backgroundSize: "cover", backgroundPosition: "center" });

/** 1) Masonry columns of photos. */
export const GalleryMasonry: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 9);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ columnCount: 3, columnGap: "0.8rem" }}>
          {imgs.map((src, i) => <div key={i} aria-hidden style={{ width: "100%", marginBottom: "0.8rem", height: i % 3 === 1 ? "240px" : "160px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", breakInside: "avoid", ...cover(src) }} />)}
        </div>
      </Container>
    </section>
  );
};

/** 2) Varied-span collage grid. */
export const GalleryCollage: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 6);
  if (!imgs.length) return null;
  const span = (i: number) => (i === 0 ? { gridColumn: "span 2", gridRow: "span 2" } : i === 3 ? { gridColumn: "span 2" } : {});
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "130px", gap: "1.05rem" }}>
          {imgs.map((src, i) => <div key={i} aria-hidden style={{ ...span(i), borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />)}
        </div>
      </Container>
    </section>
  );
};

/** 3) Row of circular photo bubbles. */
export const GalleryCircles: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 6);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.65rem" }}>
          {imgs.map((src, i) => <div key={i} aria-hidden style={{ width: "8rem", height: "8rem", borderRadius: "9999px", border: "1px solid var(--ds-border)", boxShadow: "var(--ds-shadow-card)", ...cover(src) }} />)}
        </div>
      </Container>
    </section>
  );
};

/** 4) Tilted polaroid photos. */
export const GalleryPolaroid: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 5);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.65rem" }}>
          {imgs.map((src, i) => (
            <div key={i} className="ds-img-zoom" style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", boxShadow: "var(--ds-shadow-card)", padding: "0.6rem 0.6rem 1.4rem", transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>
              <div className="ds-zoom" aria-hidden style={{ width: "180px", height: "180px", ...cover(src) }} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 5) Three equal images with thin gaps. */
export const GalleryTriptych: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 3);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${imgs.length}, 1fr)`, gap: "0.5rem", height: "320px" }}>
          {imgs.map((src, i) => <div key={i} aria-hidden style={{ borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />)}
        </div>
      </Container>
    </section>
  );
};

/** 6) Auto-scrolling photo marquee. */
export const GalleryMarquee: React.FC<Props> = ({ content, more }) => {
  if (!content.images.length) return null;
  const css = `@keyframes ds-gal-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion: reduce){.ds-gal-row{animation:none !important}}`;
  const row = [...content.images, ...content.images];
  return (
    <section style={{ ...sectionBase, overflow: "hidden" }}>
      <style>{css}</style>
      <Container><SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} /></Container>
      <div className="ds-gal-row" style={{ display: "flex", gap: "1.05rem", animation: "ds-gal-marquee 38s linear infinite", willChange: "transform" }}>
        {row.map((src, i) => <div key={i} aria-hidden style={{ flex: "0 0 280px", height: "200px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />)}
      </div>
    </section>
  );
};

/** 7) Big left image + two stacked right. */
export const GalleryShowcase: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 3);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: imgs.length > 1 ? "minmax(0,1.6fr) minmax(0,1fr)" : "1fr", gap: "1.05rem", height: "420px" }}>
          <div aria-hidden style={{ borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(imgs[0]) }} />
          {imgs.length > 1 && (
            <div style={{ display: "grid", gridTemplateRows: `repeat(${Math.min(imgs.length - 1, 2)}, 1fr)`, gap: "1.05rem" }}>
              {imgs.slice(1, 3).map((src, i) => <div key={i} aria-hidden style={{ borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />)}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

/** 8) Single large framed image + caption, centered. */
export const GalleryFrameSingle: React.FC<Props> = ({ content, more }) => {
  const nav = useNavigate();
  const src = content.images[0];
  if (!src) return null;
  return (
    <section style={sectionBase}>
      <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
        <div style={{ position: "relative", paddingTop: "1rem", paddingLeft: "1rem" }}>
          <div aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "70%", height: "70%", border: "1px solid var(--ds-primary)", borderRadius: "var(--ds-radius)" }} />
          <div aria-hidden style={{ position: "relative", height: "420px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", boxShadow: "var(--ds-shadow-card)", ...cover(src) }} />
        </div>
        <div style={{ textAlign: "center", marginTop: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.15rem" }}>
          <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" }}>{content.heading}</span>
          {more && <SectionMore link={more} />}
        </div>
      </Container>
    </section>
  );
};

/** 9) Extra-rounded grid tiles. */
export const GalleryRoundedGrid: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 6);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "1.25rem" }}>
          {imgs.map((src, i) => <div key={i} aria-hidden style={{ aspectRatio: "4 / 3", borderRadius: "1.4rem", border: "1px solid var(--ds-border)", ...cover(src) }} />)}
        </div>
      </Container>
    </section>
  );
};

/** 10) Wide band of images with a soft gradient overlay. */
export const GalleryBandOverlay: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 3);
  if (!imgs.length) return null;
  return (
    <section style={{ ...sectionBase, paddingInline: 0 }}>
      <Container><SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} /></Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${imgs.length}, 1fr)`, gap: "2px" }}>
        {imgs.map((src, i) => (
          <div key={i} aria-hidden style={{ position: "relative", height: "300px", ...cover(src) }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)" }} />
          </div>
        ))}
      </div>
    </section>
  );
};
