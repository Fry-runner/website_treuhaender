/**
 * Subpage header ("hero-lite") VARIANTS — token-only. Each takes the same props
 * ({ eyebrow, title, image? }) so the selector can swap them like hero/section
 * variants; the generator picks one per firm so subpages don't all look alike.
 * NO breadcrumb (removed by design — the nav already shows location). Image-backed
 * variants render the firm's real photo under a legibility scrim; without an image
 * they fall back to a token-tinted band so they never break.
 */
import React from "react";
import { Container } from "./primitives";

export interface PageHeaderProps {
  eyebrow: string;
  title: string;
  image?: string;
}

const h1: React.CSSProperties = {
  fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number,
  fontSize: "clamp(2rem, 1.4rem + 2.4vw, 3rem)", letterSpacing: "var(--ds-headline-tracking)",
  lineHeight: 1.12, color: "var(--ds-text)", margin: 0, textWrap: "balance" as React.CSSProperties["textWrap"],
};
const eyebrow: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.8rem", fontWeight: 600, color: "var(--ds-text-muted)" };
const bandBase: React.CSSProperties = { borderBottom: "1px solid var(--ds-border)", paddingBlock: "calc(var(--ds-section-y) * 0.7)" };
const photoBand = (image: string): React.CSSProperties => ({
  position: "relative", overflow: "hidden", borderBottom: "1px solid var(--ds-border)",
  backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center",
});
const scrim: React.CSSProperties = { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.74), rgba(0,0,0,0.42))" };
const whiteH1: React.CSSProperties = { ...h1, color: "#fff" };
const whiteEyebrow: React.CSSProperties = { ...eyebrow, color: "rgba(255,255,255,0.85)" };

/* ── text-band variants ─────────────────────────────────────────────────── */

/** 1) Classic surface band, left-aligned eyebrow + title. */
export const PageHeaderClassic: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-surface)" }}>
    <Container>
      <div style={eyebrow}>{e}</div>
      <h1 style={{ ...h1, marginTop: "0.85rem" }}>{title}</h1>
    </Container>
  </section>
);

/** 2) Centered on a tinted band. */
export const PageHeaderCentered: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-surface)", textAlign: "center" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <div style={eyebrow}>{e}</div>
      <h1 style={{ ...h1, marginTop: "0.85rem" }}>{title}</h1>
    </Container>
  </section>
);

/** 3) Thin full-width top rule, then small eyebrow + title. */
export const PageHeaderTopRule: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={{ height: 2, background: "var(--ds-text)", width: "100%", marginBottom: "1.2rem" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1.5rem", flexWrap: "wrap" }}>
        <h1 style={h1}>{title}</h1>
        <div style={eyebrow}>{e}</div>
      </div>
    </Container>
  </section>
);

/** 4) Content inside a bordered box. */
export const PageHeaderBordered: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "clamp(1.4rem, 3vw, 2.4rem)", background: "var(--ds-surface)" }}>
        <div style={eyebrow}>{e}</div>
        <h1 style={{ ...h1, marginTop: "0.7rem" }}>{title}</h1>
      </div>
    </Container>
  </section>
);

/** 5) Oversized type, eyebrow small above. */
export const PageHeaderBigType: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)", paddingBlock: "calc(var(--ds-section-y) * 0.95)" }}>
    <Container>
      <div style={eyebrow}>{e}</div>
      <h1 style={{ ...h1, marginTop: "0.6rem", fontSize: "clamp(2.4rem, 1.6rem + 3.6vw, 4rem)" }}>{title}</h1>
    </Container>
  </section>
);

/** 6) Two-column: page-type label left, title right, hairline divider. */
export const PageHeaderSplitMeta: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-surface)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,0.5fr) minmax(0,1.5fr)", gap: "clamp(1.2rem, 4vw, 3rem)", alignItems: "start" }}>
        <div style={{ ...eyebrow, paddingTop: "0.4rem", borderTop: "2px solid var(--ds-primary)" }}>{e}</div>
        <h1 style={h1}>{title}</h1>
      </div>
    </Container>
  </section>
);

/** 7) Title with an accent underline bar. */
export const PageHeaderUnderline: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={eyebrow}>{e}</div>
      <h1 style={{ ...h1, marginTop: "0.7rem", display: "inline-block", paddingBottom: "0.5rem", borderBottom: "3px solid var(--ds-primary)" }}>{title}</h1>
    </Container>
  </section>
);

/** 8) Eyebrow as a soft pill chip, centered. */
export const PageHeaderChip: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)", textAlign: "center" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <span style={{ display: "inline-block", padding: "0.35rem 0.9rem", borderRadius: "9999px", background: "var(--ds-primary-soft)", color: "var(--ds-primary)", fontFamily: "var(--ds-font-body)", fontSize: "0.72rem", fontWeight: 600 }}>{e}</span>
      <h1 style={{ ...h1, marginTop: "1rem" }}>{title}</h1>
    </Container>
  </section>
);

/** 9) Soft gradient band (primary-soft → surface). */
export const PageHeaderGradient: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, backgroundImage: "linear-gradient(135deg, var(--ds-primary-soft), var(--ds-surface))" }}>
    <Container>
      <div style={eyebrow}>{e}</div>
      <h1 style={{ ...h1, marginTop: "0.85rem" }}>{title}</h1>
    </Container>
  </section>
);

/** 10) Inverted dark band, light text (uses the look's ink as the ground). */
export const PageHeaderDark: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-text)", borderBottom: "none" }}>
    <Container>
      <div style={{ ...eyebrow, color: "rgba(255,255,255,0.7)" }}>{e}</div>
      <h1 style={{ ...h1, color: "var(--ds-bg)", marginTop: "0.85rem" }}>{title}</h1>
    </Container>
  </section>
);

/** 11) Quiet minimal: tiny eyebrow, generous space, no band fill. */
export const PageHeaderMinimal: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)", paddingBlock: "calc(var(--ds-section-y) * 0.85)" }}>
    <Container>
      <div style={{ ...eyebrow, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.68rem" }}>{e}</div>
      <h1 style={{ ...h1, marginTop: "1.1rem" }}>{title}</h1>
    </Container>
  </section>
);

/** 12) Title with a leading hairline rule under it spanning the container. */
export const PageHeaderRuleUnder: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
        <h1 style={h1}>{title}</h1>
        <span style={eyebrow}>· {e}</span>
      </div>
      <div style={{ height: 1, background: "var(--ds-border)", width: "100%", marginTop: "1.1rem" }} />
    </Container>
  </section>
);

/* ── image-backed variants (needsImage) ─────────────────────────────────── */

/** 13) Full photo band + dark scrim, white text bottom-left. */
export const PageHeaderImageBand: React.FC<PageHeaderProps> = ({ eyebrow: e, title, image }) =>
  image ? (
    <section style={photoBand(image)}>
      <div aria-hidden style={scrim} />
      <Container style={{ position: "relative", paddingBlock: "calc(var(--ds-section-y) * 0.95)" }}>
        <div style={whiteEyebrow}>{e}</div>
        <h1 style={{ ...whiteH1, marginTop: "0.85rem" }}>{title}</h1>
      </Container>
    </section>
  ) : <PageHeaderClassic eyebrow={e} title={title} />;

/** 14) Photo band, centered white title (medium scrim — photo stays visible). */
export const PageHeaderImageCentered: React.FC<PageHeaderProps> = ({ eyebrow: e, title, image }) =>
  image ? (
    <section style={photoBand(image)}>
      <div aria-hidden style={{ ...scrim, background: "linear-gradient(to top, rgba(0,0,0,0.66), rgba(0,0,0,0.5))" }} />
      <Container style={{ position: "relative", paddingBlock: "calc(var(--ds-section-y) * 1.05)", textAlign: "center", maxWidth: "min(var(--ds-container), 780px)" }}>
        <div style={whiteEyebrow}>{e}</div>
        <h1 style={{ ...whiteH1, marginTop: "0.9rem" }}>{title}</h1>
      </Container>
    </section>
  ) : <PageHeaderCentered eyebrow={e} title={title} />;

/** 15) Split: text left on surface, photo block right. */
export const PageHeaderImageSplit: React.FC<PageHeaderProps> = ({ eyebrow: e, title, image }) =>
  image ? (
    <section style={{ borderBottom: "1px solid var(--ds-border)", background: "var(--ds-surface)" }}>
      <Container style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "clamp(1.5rem, 4vw, 3rem)", alignItems: "stretch" }}>
        <div style={{ paddingBlock: "calc(var(--ds-section-y) * 0.8)", alignSelf: "center" }}>
          <div style={eyebrow}>{e}</div>
          <h1 style={{ ...h1, marginTop: "0.8rem" }}>{title}</h1>
        </div>
        <div aria-hidden style={{ minHeight: "220px", margin: "1rem 0", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
      </Container>
    </section>
  ) : <PageHeaderClassic eyebrow={e} title={title} />;

/** 16) Eyebrow, short accent rule, then title. */
export const PageHeaderKickerLine: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={eyebrow}>{e}</div>
      <div style={{ width: 48, height: 3, background: "var(--ds-primary)", margin: "0.9rem 0" }} />
      <h1 style={h1}>{title}</h1>
    </Container>
  </section>
);

/** 17) Inverted dark rounded panel, light text. */
export const PageHeaderBoxedDark: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)" }}>
    <Container>
      <div style={{ background: "var(--ds-text)", borderRadius: "var(--ds-radius)", padding: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
        <div style={{ ...eyebrow, color: "rgba(255,255,255,0.7)" }}>{e}</div>
        <h1 style={{ ...h1, color: "var(--ds-bg)", marginTop: "0.7rem" }}>{title}</h1>
      </div>
    </Container>
  </section>
);

/** 18) Brand-soft tint band, accent eyebrow. */
export const PageHeaderBannerTint: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ background: "var(--ds-primary-soft)", borderBottom: "1px solid var(--ds-border)", paddingBlock: "calc(var(--ds-section-y) * 0.75)" }}>
    <Container>
      <div style={{ ...eyebrow, color: "var(--ds-primary)" }}>{e}</div>
      <h1 style={{ ...h1, marginTop: "0.8rem" }}>{title}</h1>
    </Container>
  </section>
);

/** 19) Oversized faint page-name watermark behind a solid title. */
export const PageHeaderWatermark: React.FC<PageHeaderProps> = ({ eyebrow: e, title }) => (
  <section style={{ ...bandBase, background: "var(--ds-bg)", position: "relative", overflow: "hidden" }}>
    <span aria-hidden style={{ position: "absolute", right: "-0.5rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--ds-font-heading)", fontWeight: 800, fontSize: "clamp(5rem, 14vw, 12rem)", color: "var(--ds-text)", opacity: 0.05, lineHeight: 1, whiteSpace: "nowrap", pointerEvents: "none" }}>{e}</span>
    <Container style={{ position: "relative" }}>
      <div style={eyebrow}>{e}</div>
      <h1 style={{ ...h1, marginTop: "0.85rem" }}>{title}</h1>
    </Container>
  </section>
);

/** 20) Full photo band with a left-anchored scrim (image stays visible right). */
export const PageHeaderImageSide: React.FC<PageHeaderProps> = ({ eyebrow: e, title, image }) =>
  image ? (
    <section style={photoBand(image)}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.82) 30%, rgba(0,0,0,0.15) 78%)" }} />
      <Container style={{ position: "relative", paddingBlock: "calc(var(--ds-section-y) * 0.95)" }}>
        <div style={{ maxWidth: "42ch" }}>
          <div style={whiteEyebrow}>{e}</div>
          <h1 style={{ ...whiteH1, marginTop: "0.85rem" }}>{title}</h1>
        </div>
      </Container>
    </section>
  ) : <PageHeaderClassic eyebrow={e} title={title} />;
