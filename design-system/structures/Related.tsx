import React from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import { Icon } from "../icons/iconSets";

/** Related-items strip (e.g. other services). onPick navigates to that item. */
export const Related: React.FC<{ heading: string; items: { title: string }[]; onPick?: (title: string) => void }> = ({ heading, items, onPick }) => (
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
            {s.title} <span style={{ color: "var(--ds-primary)", display: "inline-flex", verticalAlign: "-0.1em" }}><Icon name="arrowRight" size={16} /></span>
          </button>
        ))}
      </div>
    </Container>
  </section>
);
