import React from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import { Icon } from "../icons/iconSets";

/** Related-items strip (e.g. other services). onPick navigates to that item;
 *  onAll (when given) renders a "back to the overview" affordance.
 *
 *  One of three internal LAYOUTS is chosen deterministically per block via
 *  `hash(heading) % 3` — so the same firm always renders the same shape, but the
 *  "weitere Leistungen" block is no longer a single hardcoded grid everywhere:
 *
 *   0 cards    — the classic card grid; items as boxed cards + a tinted "all" card.
 *   1 rows     — compact list rows with a trailing arrow + a single "all" text link.
 *   2 feature  — two large feature cards beside one tall "all services" CTA tile.
 *
 *  Token-only; all grids are repeat(N, minmax(0,1fr)) so the global stylesheet can
 *  collapse them at ≤900/≤560px. Props signature is unchanged.
 */
function hash(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h | 0); }

export const Related: React.FC<{
  heading: string;
  items: { title: string }[];
  onPick?: (title: string) => void;
  onAll?: () => void;
  allLabel?: string;
}> = ({ heading, items, onPick, onAll, allLabel = "Alle Leistungen" }) => {
  const variant = hash(heading || "x") % 3;
  const arrow = (size = 16) => (
    <span className="ds-arrow" style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", verticalAlign: "-0.1em" }}>
      <Icon name="arrowRight" size={size} />
    </span>
  );

  // ── 1 · compact list rows: each item is a full-width row with a trailing arrow;
  //        the "all" affordance is a quiet text link under the list ──────────────
  if (variant === 1) {
    return (
      <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
        <Container>
          <SectionHead eyebrow="Weitere Leistungen" heading={heading} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "0.6rem" }}>
            {items.map((s, i) => (
              <button key={i} className="ds-nudge" onClick={() => onPick?.(s.title)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
                textAlign: "left", cursor: "pointer", background: "var(--ds-bg)",
                border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.05rem 1.3rem",
                fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)",
                transition: "all var(--ds-duration) var(--ds-ease)",
              }}>
                <span>{s.title}</span>
                {arrow(18)}
              </button>
            ))}
          </div>
          {onAll && (
            <div style={{ marginTop: "1.5rem" }}>
              <button onClick={onAll} className="ds-nudge" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer",
                background: "transparent", border: "none", padding: 0,
                fontFamily: "var(--ds-font-body)", fontWeight: 600, fontSize: "0.95rem",
                color: "var(--ds-primary-ink, var(--ds-primary))",
                borderBottom: "1.5px solid var(--ds-primary-ink, var(--ds-primary))", paddingBottom: "0.25rem",
                transition: "all var(--ds-duration) var(--ds-ease)",
              }}>
                {allLabel} {arrow(15)}
              </button>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ── 2 · feature layout: the first two items become tall feature cards; the
  //        "all services" affordance is a co-equal CTA tile in the same row ──────
  if (variant === 2) {
    const featured = items.slice(0, 2);
    const cols = featured.length + (onAll ? 1 : 0) || 1;
    return (
      <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
        <Container>
          <SectionHead eyebrow="Weitere Leistungen" heading={heading} />
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: "1.2rem" }}>
            {featured.map((s, i) => (
              <button key={i} className="ds-nudge" onClick={() => onPick?.(s.title)} style={{
                display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "2.5rem",
                minHeight: "11rem", textAlign: "left", cursor: "pointer", background: "var(--ds-bg)",
                border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-lg, var(--ds-radius))", padding: "1.6rem",
                transition: "all var(--ds-duration) var(--ds-ease)",
              }}>
                <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.3rem", lineHeight: 1.2, color: "var(--ds-text)" }}>
                  {s.title}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", fontWeight: 600, color: "var(--ds-primary-ink, var(--ds-primary))" }}>
                  Mehr erfahren {arrow(15)}
                </span>
              </button>
            ))}
            {onAll && (
              <button onClick={onAll} className="ds-nudge" style={{
                display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "2.5rem",
                minHeight: "11rem", textAlign: "left", cursor: "pointer", background: "var(--ds-primary-soft)",
                border: "1px solid var(--ds-primary)", borderRadius: "var(--ds-radius-lg, var(--ds-radius))", padding: "1.6rem",
                color: "var(--ds-primary-ink, var(--ds-primary))",
                transition: "all var(--ds-duration) var(--ds-ease)",
              }}>
                <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.3rem", lineHeight: 1.2 }}>
                  {allLabel}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", fontWeight: 600 }}>
                  Zur Übersicht {arrow(15)}
                </span>
              </button>
            )}
          </div>
        </Container>
      </section>
    );
  }

  // ── 0 · classic card grid (default) — boxed cards + a tinted "all" card ────────
  return (
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
              {s.title} {arrow(16)}
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
};
