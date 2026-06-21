/**
 * Ten additional FAQ STRUCTURES. Same FaqContent ({q, a}[]) as the original two
 * (native accordion / 2-col grid); token-only. Each is a distinct Q&A layout.
 */
import React, { useState } from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import { Icon } from "../icons/iconSets";
import type { FaqContent } from "../content/types";

type Props = { content: FaqContent };
const sectionBase: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const q: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--ds-text)", margin: 0 };
const a: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 };
const num = (i: number) => String(i + 1).padStart(2, "0");

/** 1) Numbered Q&A rows. */
export const FaqNumbered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div>
        {content.items.map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.2rem", padding: "1.3rem 0", borderTop: "1px solid var(--ds-border)" }}>
            <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "1rem", color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 700 }}>{num(i)}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}><h3 style={q}>{f.q}</h3><p style={a}>{f.a}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Zero-gap hairline grid. */
export const FaqBordered: React.FC<Props> = ({ content }) => {
  const cols = content.items.length > 3 ? 2 : 1;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {content.items.map((f, i) => (
            <div key={i} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", borderLeft: i % cols === 0 ? "none" : "1px solid var(--ds-border)", borderTop: i >= cols ? "1px solid var(--ds-border)" : "none" }}>
              <h3 style={q}>{f.q}</h3><p style={a}>{f.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 3) Heading left, native-accordion right. */
export const FaqSplitIntro: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "3rem", alignItems: "start" }}>
        <div style={{ position: "sticky", top: "6rem" }}><SectionHead eyebrow={content.eyebrow} heading={content.heading} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {content.items.map((f, i) => (
            <details key={i} style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", background: "var(--ds-surface)", padding: "1rem 1.2rem" }}>
              <summary style={{ ...q, cursor: "pointer", listStyle: "none" }}>{f.q}</summary>
              <p style={{ ...a, marginTop: "0.7rem" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

/** 4) Single-open controlled accordion (+/-). */
export const FaqControlled: React.FC<Props> = ({ content }) => {
  const [open, setOpen] = useState(0);
  const uid = React.useId();
  return (
    <section style={sectionBase}>
      <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
        <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {content.items.map((f, i) => (
            <div key={i} style={{ borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
              <button aria-expanded={open === i} aria-controls={`${uid}-p${i}`} onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", textAlign: "left", background: open === i ? "var(--ds-surface)" : "var(--ds-bg)", border: "none", cursor: "pointer", padding: "1.1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <span style={q}>{f.q}</span>
                <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", lineHeight: 1, display: "inline-flex" }}>{open === i ? <Icon name="minus" size={18} /> : <Icon name="plus" size={18} />}</span>
              </button>
              {open === i && <p id={`${uid}-p${i}`} role="region" style={{ ...a, padding: "0 1.4rem 1.2rem" }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 5) Shadowed Q&A cards grid. */
export const FaqCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem" }}>
        {content.items.map((f, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", fontFamily: "var(--ds-font-mono)", fontWeight: 700 }}>?</span>
            <h3 style={q}>{f.q}</h3><p style={a}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Borderless single column, hairline divided. */
export const FaqMinimal: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 720px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <div>
        {content.items.map((f, i) => (
          <div key={i} style={{ padding: "1.4rem 0", borderTop: "1px solid var(--ds-border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <h3 style={{ ...q, fontSize: "1.05rem" }}>{f.q}</h3><p style={a}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 7) Compact definition-list (Q | A columns). */
export const FaqInlineDl: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <dl style={{ margin: 0 }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,0.8fr) minmax(0,1.2fr)", gap: "1.6rem", padding: "1.1rem 0", borderTop: "1px solid var(--ds-border)" }}>
            <dt style={q}>{f.q}</dt><dd style={{ ...a, margin: 0 }}>{f.a}</dd>
          </div>
        ))}
      </dl>
    </Container>
  </section>
);

/** 8) Chat-bubble style. */
export const FaqBubble: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ alignSelf: "flex-start", maxWidth: "85%", background: "var(--ds-primary-soft)", color: "var(--ds-text)", borderRadius: "1rem 1rem 1rem 0.2rem", padding: "0.8rem 1.1rem" }}><span style={q}>{f.q}</span></div>
            <div style={{ alignSelf: "flex-end", maxWidth: "85%", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "1rem 1rem 0.2rem 1rem", padding: "0.8rem 1.1rem" }}><p style={a}>{f.a}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 9) Large question headings, answers below, spacious. */
export const FaqBigQuestions: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "calc(var(--ds-section-y) * 1.1)" }}>
    <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "flex", flexDirection: "column", gap: "2.2rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.25, color: "var(--ds-text)", margin: 0 }}>{f.q}</h3>
            <p style={{ ...a, fontSize: "1rem", maxWidth: "62ch" }}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 10) Controlled single-open accordion laid out in two columns. */
export const FaqTwoColAccordion: React.FC<Props> = ({ content }) => {
  const [open, setOpen] = useState(-1);
  const uid = React.useId();
  const mid = Math.ceil(content.items.length / 2);
  const cols = [content.items.slice(0, mid), content.items.slice(mid)];
  let idx = -1;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1rem" }}>
          {cols.map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {col.map((f) => {
                idx += 1; const i = idx;
                return (
                  <div key={i} style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", background: "var(--ds-surface)", overflow: "hidden" }}>
                    <button aria-expanded={open === i} aria-controls={`${uid}-p${i}`} onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "0.95rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.8rem" }}>
                      <span style={q}>{f.q}</span><span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", lineHeight: 1, display: "inline-flex" }}>{open === i ? <Icon name="minus" size={16} /> : <Icon name="plus" size={16} />}</span>
                    </button>
                    {open === i && <p id={`${uid}-p${i}`} role="region" style={{ ...a, padding: "0 1.2rem 1.1rem" }}>{f.a}</p>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
