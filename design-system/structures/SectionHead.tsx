import React from "react";
import { Eyebrow } from "./primitives";

/** Shared section header: eyebrow + H2. Token-only. */
export const SectionHead: React.FC<{ eyebrow: string; heading: string; center?: boolean }> = ({ eyebrow, heading, center }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: center ? "center" : "flex-start", textAlign: center ? "center" : "left", marginBottom: "2.2rem" }}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 style={{
      fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number,
      fontSize: "2rem", letterSpacing: "var(--ds-headline-tracking)", lineHeight: 1.1, color: "var(--ds-text)", margin: 0,
    }}>
      {heading}
    </h2>
  </div>
);
