import React from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import { Icon } from "../icons/iconSets";

/** Related-items strip (e.g. other services). onPick navigates to that item;
 *  onAll (when given) renders a final "back to the overview" cell in the grid. */
export const Related: React.FC<{
  heading: string;
  items: { title: string }[];
  onPick?: (title: string) => void;
  onAll?: () => void;
  allLabel?: string;
}> = ({ heading, items, onPick, onAll, allLabel = "Alle Leistungen" }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow="Weitere Leistungen" heading={heading} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "1rem" }}>
        {items.map((s, i) => (
          <button key={i} onClick={() => onPick?.(s.title)} style={{
            textAlign: "left", cursor: "pointer", background: "var(--ds-bg)",
            border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.2rem",
            fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--ds-text)",
            transition: "all var(--ds-duration) var(--ds-ease)",
          }}>
            {s.title} <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", verticalAlign: "-0.1em" }}><Icon name="arrowRight" size={16} /></span>
          </button>
        ))}
        {onAll && (
          <button onClick={onAll} style={{
            textAlign: "left", cursor: "pointer", background: "var(--ds-primary-soft)",
            border: "1px solid var(--ds-primary)", borderRadius: "var(--ds-radius)", padding: "1.2rem",
            fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--ds-primary-ink, var(--ds-primary))",
            transition: "all var(--ds-duration) var(--ds-ease)",
          }}>
            {allLabel} <span style={{ display: "inline-flex", verticalAlign: "-0.1em" }}><Icon name="arrowRight" size={16} /></span>
          </button>
        )}
      </div>
    </Container>
  </section>
);
