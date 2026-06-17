import React from "react";
import { Container, Eyebrow } from "./primitives";

/**
 * Inner-page hero-lite: breadcrumb + eyebrow + H1.
 * When an `image` is supplied it renders as a photo-backed band (scrim + white
 * text) so EVERY subpage carries real imagery; without one it falls back to the
 * token-tinted text band. Token-only otherwise.
 */
export const PageHeader: React.FC<{ eyebrow: string; title: string; breadcrumb?: string; image?: string }> = ({ eyebrow, title, breadcrumb, image }) => {
  if (image) {
    return (
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--ds-border)", backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0.45))" }} />
        <Container style={{ position: "relative", paddingBlock: "calc(var(--ds-section-y) * 0.95)" }}>
          {breadcrumb && (
            <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.68rem",   color: "rgba(255,255,255,0.8)", marginBottom: "0.8rem" }}>
              {breadcrumb}
            </div>
          )}
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "rgba(255,255,255,0.85)" }}>
            {eyebrow}
          </div>
          <h1 style={{
            fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number,
            fontSize: "clamp(2rem, 1.4rem + 2.4vw, 3rem)", letterSpacing: "var(--ds-headline-tracking)",
            color: "#fff", margin: "0.9rem 0 0", lineHeight: 1.1,
          }}>
            {title}
          </h1>
        </Container>
      </section>
    );
  }
  return (
    <section style={{ background: "var(--ds-surface)", paddingBlock: "calc(var(--ds-section-y) * 0.7)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container>
        {breadcrumb && (
          <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.68rem",   color: "var(--ds-text-muted)", marginBottom: "0.8rem" }}>
            {breadcrumb}
          </div>
        )}
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 style={{
          fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number,
          fontSize: "clamp(2rem, 1.4rem + 2.4vw, 3rem)", letterSpacing: "var(--ds-headline-tracking)",
          color: "var(--ds-text)", margin: "0.9rem 0 0", lineHeight: 1.1,
        }}>
          {title}
        </h1>
      </Container>
    </section>
  );
};
