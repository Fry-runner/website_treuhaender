import React from "react";
import { Container, Eyebrow } from "./primitives";

/** Inner-page hero-lite: breadcrumb + eyebrow + H1 on a tinted band. Token-only. */
export const PageHeader: React.FC<{ eyebrow: string; title: string; breadcrumb?: string }> = ({ eyebrow, title, breadcrumb }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "calc(var(--ds-section-y) * 0.7)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      {breadcrumb && (
        <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-text-muted)", marginBottom: "0.8rem" }}>
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
