import React from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import { balancedColumns, fillGrid } from "./grid";
import { Icon } from "../icons/iconSets";
import type { ServicesContent } from "../content/types";

/** Services card grid. Cards link via onPick when a target exists. */
export const Services: React.FC<{ content: ServicesContent; more?: MoreLink; onPick?: (title: string) => void }> = ({ content, more, onPick }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div className="ds-fill-grid" style={fillGrid(balancedColumns(content.items.length, 3), "1.45rem")}>
        {content.items.map((s, i) => (
          <article
            key={i}
            className={onPick ? "ds-card ds-nudge ds-img-zoom" : "ds-img-zoom"}
            onClick={onPick ? () => onPick(s.title) : undefined}
            role={onPick ? "button" : undefined}
            tabIndex={onPick ? 0 : undefined}
            onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined}
            style={{
            background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)",
            boxShadow: "var(--ds-shadow-card)", overflow: "hidden", display: "flex", flexDirection: "column",
            cursor: onPick ? "pointer" : "default",
          }}>
            {s.image && (
              <div aria-hidden className="ds-zoom" style={{ height: "9rem", backgroundImage: `url("${s.image}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
            )}
            <div style={{ padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.95rem", flex: 1 }}>
            <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0, flex: 1 }}>{s.summary}</p>
            {s.price && (
              <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.78rem",   color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 600 }}>{s.price}</div>
            )}
            <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" }}>Mehr <Icon name="arrowRight" size={13} style={{ verticalAlign: "-0.1em" }} /></span>
            </div>
          </article>
        ))}
      </div>
    </Container>
  </section>
);
