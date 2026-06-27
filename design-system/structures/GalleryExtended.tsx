/**
 * Image-embedding axis ("Bildeinbindung") — ten STRUCTURES for how the firm's
 * scraped media pool (content.media) is shown on the page. Each is token-only and
 * fed from a GalleryContent slice the composer builds from MediaLibrary. Every
 * variant renders nothing when it has no images to show, so it stays honest.
 */
import React from "react";
import { Container } from "./primitives";
import { SectionHead, SectionMore, type MoreLink } from "./SectionHead";
import { useNavigate } from "../compose/nav-context";
import { Icon } from "../icons/iconSets";

export interface GalleryContent {
  eyebrow: string;
  heading: string;
  images: string[];      // general photo pool (best-first)
  logo?: string;
  badges?: string[];     // certification / partner logos
}

type Props = { content: GalleryContent; more?: MoreLink };
const sectionBase: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const cover = (src: string): React.CSSProperties => ({ backgroundImage: `url("${src}")`, backgroundSize: "cover", backgroundPosition: "center" });

/** "View all" link for use over dark imagery (full-bleed / band variants) — the
 *  per-firm minimalist forward style, rendered in its light-on-dark tone. */
const OverlayMore: React.FC<{ more?: MoreLink }> = ({ more }) =>
  more ? <div style={{ marginTop: "1.1rem" }}><SectionMore link={more} tone="onImage" /></div> : null;

/** 1) Uniform responsive photo grid. */
export const GalleryGrid: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 8);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.05rem" }}>
          {imgs.map((src, i) => <div key={i} aria-hidden style={{ aspectRatio: "1 / 1", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />)}
        </div>
      </Container>
    </section>
  );
};

/** 2) Bento mosaic — first photo spans 2×2. */
export const GalleryMosaic: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 5);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "140px", gap: "1.05rem" }}>
          {imgs.map((src, i) => (
            <div key={i} aria-hidden style={{ gridColumn: i === 0 ? "span 2" : "span 1", gridRow: i === 0 ? "span 2" : "span 1", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 3) Horizontal scroll-snap photo rail. */
export const GalleryCarousel: React.FC<Props> = ({ content, more }) => {
  if (!content.images.length) return null;
  return (
    <section style={sectionBase}>
      <Container><SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} /></Container>
      <div style={{ display: "flex", gap: "1.25rem", overflowX: "auto", paddingInline: "var(--ds-gutter)", scrollSnapType: "x mandatory", paddingBottom: "0.6rem" }}>
        {content.images.slice(0, 12).map((src, i) => (
          <div key={i} aria-hidden style={{ flex: "0 0 min(70%, 320px)", height: "240px", scrollSnapAlign: "start", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />
        ))}
      </div>
    </section>
  );
};

/** 4) One full-bleed banner image with overlaid heading. */
export const GalleryFullBleed: React.FC<Props> = ({ content, more }) => {
  const src = content.images[0];
  if (!src) return null;
  return (
    <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--ds-border)", minHeight: "360px", display: "flex", alignItems: "flex-end", ...cover(src) }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))" }} />
      <Container style={{ position: "relative", paddingBlock: "2.4rem" }}>
        <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display-h2, 2.2rem)", color: "#fff", margin: "0.4rem 0 0" }}>{content.heading}</h2>
        <OverlayMore more={more} />
      </Container>
    </section>
  );
};

/** 5) Heading/text left, single image right. */
export const GallerySplitMedia: React.FC<Props> = ({ content, more }) => {
  const src = content.images[0];
  if (!src) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", gap: "2.6rem", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.05rem" }}>
            <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
            {content.images[1] && <div aria-hidden style={{ height: "120px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(content.images[1]) }} />}
          </div>
          <div aria-hidden style={{ minHeight: "320px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />
        </div>
      </Container>
    </section>
  );
};

/** 6) Uniform thin photo strip. */
export const GalleryStrip: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 6);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${imgs.length}, 1fr)`, gap: "0.6rem", height: "160px" }}>
          {imgs.map((src, i) => <div key={i} aria-hidden style={{ borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />)}
        </div>
      </Container>
    </section>
  );
};

/** 7) Certification / partner logo strip (greyscale → color on the page). */
export const GalleryLogoStrip: React.FC<Props> = ({ content }) => {
  const logos = (content.badges ?? []).filter(Boolean);
  if (!logos.length) return null;
  return (
    <section style={{ background: "var(--ds-surface)", paddingBlock: "calc(var(--ds-section-y) * 0.7)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.65rem" }}>
          <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" }}>{content.heading}</span>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "2.4rem" }}>
            {logos.map((src, i) => <img key={i} src={src} alt="" style={{ height: "44px", width: "auto", objectFit: "contain", filter: "grayscale(1)", opacity: 0.8 }} />)}
          </div>
        </div>
      </Container>
    </section>
  );
};

/** 8) Portrait images in layered offset frames. */
export const GalleryFramed: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 3);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2.4rem" }}>
          {imgs.map((src, i) => (
            <div key={i} style={{ position: "relative", paddingTop: "0.8rem", paddingLeft: "0.8rem" }}>
              <div aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "var(--ds-radius)", background: "var(--ds-primary-soft)" }} />
              <div aria-hidden style={{ position: "relative", width: "200px", height: "260px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", boxShadow: "var(--ds-shadow-card)", ...cover(src) }} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 9) Two large side-by-side images. */
export const GalleryDuo: React.FC<Props> = ({ content, more }) => {
  const imgs = content.images.slice(0, 2);
  if (!imgs.length) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: imgs.length > 1 ? "1fr 1fr" : "1fr", gap: "1.25rem", height: "340px" }}>
          {imgs.map((src, i) => <div key={i} aria-hidden style={{ borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />)}
        </div>
      </Container>
    </section>
  );
};

/** 10) One big feature image + small thumbnail row beneath. */
export const GalleryFeature: React.FC<Props> = ({ content, more }) => {
  const [hero, ...rest] = content.images;
  if (!hero) return null;
  const thumbs = rest.slice(0, 4);
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.05rem" }}>
          <div aria-hidden style={{ height: "380px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(hero) }} />
          {thumbs.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${thumbs.length}, 1fr)`, gap: "1.05rem", height: "110px" }}>
              {thumbs.map((src, i) => <div key={i} aria-hidden style={{ borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", ...cover(src) }} />)}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
