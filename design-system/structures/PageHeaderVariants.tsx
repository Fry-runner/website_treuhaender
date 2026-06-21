/**
 * Subpage header ("hero-lite") BUILDING BLOCKS — token-only, title-only (no
 * eyebrow/breadcrumb). The selector picks ONE per firm so every subpage shares the
 * same header (home uses the real hero; the contact page has none). Each is a
 * deliberate, brand-forward treatment — a thin accent rule, a tinted/branded/dark
 * ground, an editorial masthead, or the firm's real photo under a cinematic scrim —
 * so inner pages read as designed, not as a bare title in a grey band.
 *
 * Three photo blocks (needsImage) front the firm's real image; each falls back to a
 * sibling non-image block when a given page has no photo, so they never break.
 */
import React from "react";
import { Container } from "./primitives";

export interface PageHeaderProps {
  title: string;
  image?: string;
}

const titleS: React.CSSProperties = {
  fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number,
  fontSize: "clamp(2.2rem, 1.5rem + 3vw, 3.6rem)", letterSpacing: "var(--ds-headline-tracking)",
  lineHeight: 1.08, color: "var(--ds-text)", margin: 0, textWrap: "balance" as React.CSSProperties["textWrap"],
};
const whiteTitle: React.CSSProperties = { ...titleS, color: "#fff" };

/** Short brand kicker rule (a horizontal accent line, not a card side-border). */
const Accent: React.FC<{ color?: string; opacity?: number; align?: "left" | "center"; mb?: string }> = ({ color = "var(--ds-primary)", opacity = 1, align = "left", mb = "1.1rem" }) => (
  <div aria-hidden style={{ width: 52, height: 3, borderRadius: 2, background: color, opacity, marginBottom: mb, marginInline: align === "center" ? "auto" : undefined }} />
);

const photoGround = (image: string): React.CSSProperties => ({
  position: "relative", overflow: "hidden", borderBottom: "1px solid var(--ds-border)",
  backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center",
});

/* ── non-image blocks ──────────────────────────────────────────────────────── */

/** Bold branded masthead — title on a solid brand ground, light text. */
export const PageHeaderBrandBand: React.FC<PageHeaderProps> = ({ title }) => (
  <section style={{ background: "var(--ds-primary)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ paddingBlock: "calc(var(--ds-section-y) * 1.15)" }}>
      <Accent color="var(--ds-primary-fg)" opacity={0.55} />
      <h1 style={{ ...titleS, color: "var(--ds-primary-fg)" }}>{title}</h1>
    </Container>
  </section>
);

/** Editorial masthead — full-width hairline, oversized title, brand full-stop. */
export const PageHeaderEditorial: React.FC<PageHeaderProps> = ({ title }) => (
  <section style={{ background: "var(--ds-bg)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container style={{ paddingBlock: "calc(var(--ds-section-y) * 1.1)" }}>
      <div aria-hidden style={{ height: 2, background: "var(--ds-text)", marginBottom: "clamp(1.4rem, 4vw, 2.6rem)" }} />
      <h1 style={{ ...titleS, fontSize: "clamp(2.6rem, 1.6rem + 4vw, 4.4rem)" }}>
        {title}{/[.!?]$/.test(title) ? null : <span style={{ color: "var(--ds-primary)" }}>.</span>}
      </h1>
    </Container>
  </section>
);

/** Soft diagonal brand wash — centered title with a brand underline. */
export const PageHeaderTintWash: React.FC<PageHeaderProps> = ({ title }) => (
  <section style={{ backgroundImage: "linear-gradient(135deg, var(--ds-primary-soft), var(--ds-surface) 72%)", borderBottom: "1px solid var(--ds-border)", textAlign: "center" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)", paddingBlock: "calc(var(--ds-section-y) * 1.2)" }}>
      <h1 style={titleS}>{title}</h1>
      <Accent align="center" mb="0" />
    </Container>
  </section>
);

/** Inverted ink panel — light title over the look's ink, brand kicker. */
export const PageHeaderDarkPanel: React.FC<PageHeaderProps> = ({ title }) => (
  <section style={{ background: "var(--ds-text)", borderBottom: "none" }}>
    <Container style={{ paddingBlock: "calc(var(--ds-section-y) * 1.2)" }}>
      <Accent />
      <h1 style={{ ...titleS, color: "var(--ds-bg)" }}>{title}</h1>
    </Container>
  </section>
);

/* ── photo blocks (needsImage) ─────────────────────────────────────────────── */

/** Signature full-bleed photo masthead — cinematic scrim + faint brand wash,
 *  white title bottom-left. Falls back to the branded band with no image. */
export const PageHeaderPhotoSignature: React.FC<PageHeaderProps> = ({ title, image }) =>
  image ? (
    <section style={photoGround(image)}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.80), rgba(0,0,0,0.34) 58%, rgba(0,0,0,0.14))" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "var(--ds-primary)", opacity: 0.12 }} />
      <Container style={{ position: "relative", paddingBlock: "calc(var(--ds-section-y) * 1.55)" }}>
        <Accent />
        <h1 style={{ ...whiteTitle, maxWidth: "22ch" }}>{title}</h1>
      </Container>
    </section>
  ) : <PageHeaderBrandBand title={title} />;

/** Title left on surface, framed photo right (rounded + soft shadow).
 *  Falls back to the editorial masthead with no image. */
export const PageHeaderPhotoSplit: React.FC<PageHeaderProps> = ({ title, image }) =>
  image ? (
    <section style={{ background: "var(--ds-surface)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container style={{ display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: "clamp(1.5rem, 4vw, 3.5rem)", alignItems: "center" }}>
        <div style={{ paddingBlock: "calc(var(--ds-section-y) * 1.05)" }}>
          <Accent mb="1rem" />
          <h1 style={titleS}>{title}</h1>
        </div>
        <div aria-hidden style={{ minHeight: "clamp(220px, 30vw, 340px)", margin: "1.2rem 0", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
      </Container>
    </section>
  ) : <PageHeaderEditorial title={title} />;

/** Photo band with the title on a floating surface card that overlaps it.
 *  Falls back to the soft tint wash with no image. */
export const PageHeaderPhotoCard: React.FC<PageHeaderProps> = ({ title, image }) =>
  image ? (
    <section style={{ background: "var(--ds-bg)", borderBottom: "1px solid var(--ds-border)" }}>
      <div aria-hidden style={{ height: "clamp(200px, 26vw, 300px)", backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <Container>
        <div style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "clamp(1.4rem, 3vw, 2.2rem)", marginTop: "clamp(-3.2rem, -5vw, -2rem)", marginBottom: "calc(var(--ds-section-y) * 0.5)", position: "relative", maxWidth: "min(100%, 760px)" }}>
          <Accent mb="0.9rem" />
          <h1 style={titleS}>{title}</h1>
        </div>
      </Container>
    </section>
  ) : <PageHeaderTintWash title={title} />;
