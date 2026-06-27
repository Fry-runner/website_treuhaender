import React from "react";
import { Container, Button } from "./primitives";
import type { CtaContent } from "../content/types";

/** Final CTA band — centered, primary-tinted (briefing §6 persistent CTA).
 *  Optional bgImage (real or CC stock) sits behind a brand scrim for legibility. */
export const CtaBand: React.FC<{ content: CtaContent; bgImage?: string }> = ({ content, bgImage }) => (
  <section style={{
    position: "relative", overflow: "hidden", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)",
    ...(bgImage
      ? { backgroundImage: `url("${bgImage}")`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: "var(--ds-primary-soft)" }),
  }}>
    {bgImage && <div aria-hidden style={{ position: "absolute", inset: 0, background: "color-mix(in srgb, var(--ds-primary-soft) 94%, transparent)" }} />}
    <Container style={{ position: "relative", maxWidth: "min(var(--ds-container), 760px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.35rem" }}>
        <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display-h2, 2.2rem)", letterSpacing: "var(--ds-headline-tracking)", color: "var(--ds-text)", margin: 0 }}>
          {content.heading}
        </h2>
        <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1.05rem", lineHeight: 1.55, color: "var(--ds-text-muted)", maxWidth: "46ch", margin: 0 }}>{content.sub}</p>
        <div style={{ marginTop: "0.4rem" }}>
          <Button variant="primary" cta>{content.button}</Button>
        </div>
      </div>
    </Container>
  </section>
);
