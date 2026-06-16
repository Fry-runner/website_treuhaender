import React from "react";
import { Eyebrow } from "./primitives";
import { useNavigate } from "../compose/nav-context";

export interface MoreLink { label: string; href: string; }

/** Shared section header: eyebrow + H2, with an optional "view all" link that
 *  routes to the matching subpage (teaser pattern). Token-only. */
export const SectionHead: React.FC<{ eyebrow: string; heading: string; center?: boolean; more?: MoreLink }> = ({ eyebrow, heading, center, more }) => {
  const navigate = useNavigate();
  const headingBlock = (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: center ? "center" : "flex-start", textAlign: center ? "center" : "left" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 style={{
        fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number,
        fontSize: "2rem", letterSpacing: "var(--ds-headline-tracking)", lineHeight: 1.1, color: "var(--ds-text)", margin: 0,
      }}>
        {heading}
      </h2>
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "2.2rem" }}>
      {headingBlock}
      {more && (
        <a href={more.href} onClick={(e) => { e.preventDefault(); navigate(more.href); }} style={{
          fontFamily: "var(--ds-font-mono)", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.08em",
          color: "var(--ds-primary)", textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap", paddingBottom: "0.3rem",
        }}>
          {more.label} →
        </a>
      )}
    </div>
  );
};
