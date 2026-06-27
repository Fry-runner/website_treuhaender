import React from "react";
import { Container, Button } from "./primitives";
import type { CtaContent } from "../content/types";

/** CTA variant: heading/sub left, button right (vs the centered CtaBand). */
export const CtaSplit: React.FC<{ content: CtaContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "48ch" }}>
          <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: "var(--ds-display-h2, 1.9rem)", letterSpacing: "var(--ds-headline-tracking)", color: "var(--ds-text)", margin: 0 }}>{content.heading}</h2>
          <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 }}>{content.sub}</p>
        </div>
        <Button variant="primary" cta>{content.button}</Button>
      </div>
    </Container>
  </section>
);
