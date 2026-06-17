/**
 * Ten additional Services STRUCTURES. Same ServicesContent + optional more/onPick
 * as the original three (cards / bordered grid / accordion); token-only, so they
 * re-skin with the active look. Each is a distinct way to lay out the items.
 */
import React, { useState } from "react";
import { Container } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { ServicesContent } from "../content/types";

type Props = { content: ServicesContent; more?: MoreLink; onPick?: (title: string) => void };
const sectionBase: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const moreLinkStyle: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" };

/** 1) Full-width editorial rows (no cards). */
export const ServicesNumberedList: React.FC<Props> = ({ content, more: m, onPick }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 920px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
      <div>
        {content.items.map((s, i) => (
          <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ padding: "1.5rem 0", borderTop: "1px solid var(--ds-border)", cursor: onPick ? "pointer" : "default" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.3rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
                {s.price && <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.8rem", color: "var(--ds-primary)", fontWeight: 600 }}>{s.price}</span>}
              </div>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0, maxWidth: "60ch" }}>{s.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Zig-zag alternating rows. */
export const ServicesAlternating: React.FC<Props> = ({ content, more: m, onPick }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 900px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
        {content.items.map((s, i) => {
          const right = i % 2 === 1;
          return (
            <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start", cursor: onPick ? "pointer" : "default" }}>
              <article style={{ maxWidth: "62%", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.4rem 1.6rem", textAlign: right ? "right" : "left", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
                <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 }}>{s.summary}</p>
              </article>
            </div>
          );
        })}
      </div>
    </Container>
  </section>
);

/** 3) Bento grid — first item is a large featured tile. */
export const ServicesBento: React.FC<Props> = ({ content, more: m, onPick }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gridAutoRows: "1fr", gap: "1.2rem" }}>
        {content.items.map((s, i) => {
          const feature = i === 0;
          return (
            <article key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{
              gridColumn: feature ? "span 2" : "span 1", gridRow: feature ? "span 2" : "span 1",
              background: feature ? "var(--ds-primary-soft)" : "var(--ds-surface)", border: "1px solid var(--ds-border)",
              borderRadius: "var(--ds-radius)", padding: feature ? "2rem" : "1.5rem", cursor: onPick ? "pointer" : "default",
              display: "flex", flexDirection: "column", gap: "0.7rem",
            }}>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: feature ? "1.6rem" : "1.1rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0, flex: 1 }}>{s.summary}</p>
              {s.price && <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.78rem", color: "var(--ds-primary)", fontWeight: 600 }}>{s.price}</span>}
            </article>
          );
        })}
      </div>
    </Container>
  </section>
);

/** 4) Sticky heading left, item rows right. */
export const ServicesSplitList: React.FC<Props> = ({ content, more: m, onPick }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "3rem", alignItems: "start" }}>
        <div style={{ position: "sticky", top: "6rem" }}>
          <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
        </div>
        <div>
          {content.items.map((s, i) => (
            <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ padding: "1.3rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none", display: "flex", flexDirection: "column", gap: "0.4rem", cursor: onPick ? "pointer" : "default" }}>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 }}>{s.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

/** 5) Large cards with a checklist of bullets. */
export const ServicesChecklist: React.FC<Props> = ({ content, more: m, onPick }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.4rem" }}>
        {content.items.map((s, i) => (
          <article key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "0.9rem", cursor: onPick ? "pointer" : "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.25rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
              {s.price && <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.78rem", color: "var(--ds-primary)", fontWeight: 600 }}>{s.price}</span>}
            </div>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 }}>{s.summary}</p>
            {(s.bullets?.length ? s.bullets : [s.summary]).slice(0, 4).map((b, j) => (
              <div key={j} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", color: "var(--ds-text)" }}>
                <span style={{ color: "var(--ds-primary)", fontWeight: 700, lineHeight: 1.4 }}><Icon name="check" size={15} style={{ verticalAlign: "-0.15em" }} /></span>{b}
              </div>
            ))}
          </article>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Vertical tab list + detail pane (interactive selector). */
export const ServicesTabs: React.FC<Props> = ({ content, more: m, onPick }) => {
  const [active, setActive] = useState(0);
  const sel = content.items[active] ?? content.items[0];
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "1.4rem", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          <div role="tablist" style={{ borderRight: "1px solid var(--ds-border)", background: "var(--ds-surface)" }}>
            {content.items.map((s, i) => (
              <button key={i} role="tab" aria-selected={i === active} onClick={() => setActive(i)} style={{ width: "100%", textAlign: "left", border: "none", borderTop: i ? "1px solid var(--ds-border)" : "none", cursor: "pointer", padding: "1.1rem 1.3rem", background: i === active ? "var(--ds-bg)" : "transparent", color: i === active ? "var(--ds-primary)" : "var(--ds-text)", fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1rem", display: "flex", gap: "0.7rem", alignItems: "center" }}>
                {s.title}
              </button>
            ))}
          </div>
          <div role="tabpanel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.4rem", color: "var(--ds-text)", margin: 0 }}>{sel.title}</h3>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: "var(--ds-text-muted)", margin: 0 }}>{sel.body ?? sel.summary}</p>
            {sel.bullets?.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {sel.bullets.slice(0, 5).map((b, j) => (
                  <div key={j} style={{ display: "flex", gap: "0.6rem", fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", color: "var(--ds-text)" }}><span style={{ color: "var(--ds-primary)" }}><Icon name="check" size={15} style={{ verticalAlign: "-0.15em" }} /></span>{b}</div>
                ))}
              </div>
            ) : null}
            {onPick && <button onClick={() => onPick(sel.title)} style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", ...moreLinkStyle }}>Mehr erfahren <Icon name="arrowRight" size={13} style={{ verticalAlign: "-0.1em" }} /></button>}
          </div>
        </div>
      </Container>
    </section>
  );
};

/** 7) Borderless minimal grid — top hairline per cell. */
export const ServicesMinimal: React.FC<Props> = ({ content, more: m, onPick }) => {
  const cols = Math.min(content.items.length, 3);
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: "2.4rem 2rem" }}>
          {content.items.map((s, i) => (
            <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ borderTop: "2px solid var(--ds-text)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", cursor: onPick ? "pointer" : "default" }}>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 }}>{s.summary}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 8) Vertical timeline with connector line + dots. */
export const ServicesTimeline: React.FC<Props> = ({ content, more: m, onPick }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
      <div style={{ position: "relative", paddingLeft: "2rem" }}>
        <div aria-hidden style={{ position: "absolute", left: "0.45rem", top: "0.4rem", bottom: "0.4rem", width: "1px", background: "var(--ds-border)" }} />
        {content.items.map((s, i) => (
          <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ position: "relative", paddingBottom: "1.8rem", cursor: onPick ? "pointer" : "default" }}>
            <span aria-hidden style={{ position: "absolute", left: "-1.65rem", top: "0.3rem", width: "0.7rem", height: "0.7rem", borderRadius: "9999px", background: "var(--ds-primary)", border: "2px solid var(--ds-bg)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.15rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 }}>{s.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 9) Rate-list — title/summary left, price right, hairline rows. */
export const ServicesPriceList: React.FC<Props> = ({ content, more: m, onPick }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.items.map((s, i) => (
          <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.2rem", alignItems: "center", padding: "1.2rem 1.5rem", borderTop: i ? "1px solid var(--ds-border)" : "none", cursor: onPick ? "pointer" : "default" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
              <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 }}>{s.summary}</p>
            </div>
            <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.95rem", color: "var(--ds-primary)", fontWeight: 700, whiteSpace: "nowrap" }}>{s.price ?? "auf Anfrage"}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 10) First item as a featured panel, rest as a compact list beside it. */
export const ServicesFeatureSplit: React.FC<Props> = ({ content, more: m, onPick }) => {
  const [first, ...rest] = content.items;
  if (!first) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={m} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "1.4rem", alignItems: "stretch" }}>
          <article role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(first.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(first.title); } } : undefined} style={{ background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "2rem", display: "flex", flexDirection: "column", gap: "0.9rem", cursor: onPick ? "pointer" : "default" }}>
            <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.7rem", color: "var(--ds-text)", margin: 0 }}>{first.title}</h3>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: "var(--ds-text-muted)", margin: 0 }}>{first.body ?? first.summary}</p>
            {first.price && <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.82rem", color: "var(--ds-primary)", fontWeight: 600 }}>{first.price}</span>}
          </article>
          <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
            {rest.map((s, i) => (
              <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ padding: "1.1rem 1.4rem", borderTop: i ? "1px solid var(--ds-border)" : "none", display: "flex", flexDirection: "column", gap: "0.35rem", cursor: onPick ? "pointer" : "default" }}>
                <h4 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.02rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h4>
                <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.86rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 }}>{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
