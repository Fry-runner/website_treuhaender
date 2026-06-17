import React, { useState } from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import { Icon } from "../icons/iconSets";
import type { ServicesContent } from "../content/types";

/** Services variant: single-open accordion (vs card / bordered grids). */
export const ServicesAccordion: React.FC<{ content: ServicesContent; more?: MoreLink; onPick?: (title: string) => void }> = ({ content, more, onPick }) => {
  const [open, setOpen] = useState(0);
  const uid = React.useId();
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {content.items.map((s, i) => (
            <div key={i} style={{ borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} aria-controls={`${uid}-p${i}`} style={{ width: "100%", textAlign: "left", background: open === i ? "var(--ds-surface)" : "var(--ds-bg)", border: "none", cursor: "pointer", padding: "1.1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)" }}>{s.title}</span>
                <span style={{ color: "var(--ds-primary)", lineHeight: 1, display: "inline-flex" }}>{open === i ? <Icon name="minus" size={18} /> : <Icon name="plus" size={18} />}</span>
              </button>
              {open === i && (
                <div id={`${uid}-p${i}`} role="region" style={{ padding: "0 1.4rem 1.3rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {s.image && (
                    <div aria-hidden style={{ height: "10rem", borderRadius: "var(--ds-radius)", backgroundImage: `url("${s.image}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  )}
                  <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 }}>{s.summary}</p>
                  {onPick && <button onClick={() => onPick(s.title)} style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-primary)" }}>Mehr erfahren <Icon name="arrowRight" size={13} style={{ verticalAlign: "-0.1em" }} /></button>}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
