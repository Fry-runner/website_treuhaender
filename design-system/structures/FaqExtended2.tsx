/**
 * FAQ STRUCTURES — batch 2. Same FaqContent ({q, a}[]); token-only.
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

/** 1) Each row with a circular "?" badge. */
export const FaqIconQ: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.3rem 1.5rem" }}>
            <div style={{ width: "2.2rem", height: "2.2rem", borderRadius: "9999px", background: "var(--ds-primary-soft)", color: "var(--ds-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontFamily: "var(--ds-font-mono)" }}>?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}><h3 style={q}>{f.q}</h3><p style={a}>{f.a}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Vertical timeline of Q&A. */
export const FaqTimeline: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 780px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ position: "relative", paddingLeft: "2rem" }}>
        <div aria-hidden style={{ position: "absolute", left: "0.45rem", top: "0.4rem", bottom: "0.4rem", width: "1px", background: "var(--ds-border)" }} />
        {content.items.map((f, i) => (
          <div key={i} style={{ position: "relative", paddingBottom: "1.6rem" }}>
            <span aria-hidden style={{ position: "absolute", left: "-1.65rem", top: "0.25rem", width: "0.7rem", height: "0.7rem", borderRadius: "9999px", background: "var(--ds-primary)", border: "2px solid var(--ds-bg)" }} />
            <h3 style={q}>{f.q}</h3><p style={{ ...a, marginTop: "0.4rem" }}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Striped alternating rows. */
export const FaqZebra: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ padding: "1.3rem 1.5rem", background: i % 2 ? "var(--ds-surface)" : "var(--ds-bg)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <h3 style={q}>{f.q}</h3><p style={a}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 4) Static three-column grid. */
export const FaqThreeCol: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.8rem 2rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.7rem", color: "var(--ds-primary)", fontWeight: 700 }}>{num(i)}</span>
            <h3 style={q}>{f.q}</h3><p style={a}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 5) Bordered (no shadow) cards. */
export const FaqCardsBordered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "1rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <h3 style={q}>{f.q}</h3><p style={a}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Question heading + answer as an indented quote. */
export const FaqQuoteAnswers: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 800px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <h3 style={{ ...q, fontSize: "1.15rem" }}>{f.q}</h3>
            <p style={{ ...a, padding: "0.9rem 1.1rem", background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", fontStyle: "italic" }}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 7) Numbered cards grid. */
export const FaqNumberedCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.2rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 800, fontSize: "1.6rem", color: "var(--ds-primary)" }}>{num(i)}</div>
            <h3 style={q}>{f.q}</h3><p style={a}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 8) Dense two-column compact list. */
export const FaqCompact: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "0 2.4rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ padding: "1rem 0", borderTop: "1px solid var(--ds-border)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <h3 style={{ ...q, fontSize: "0.95rem" }}>{f.q}</h3><p style={{ ...a, fontSize: "0.86rem" }}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 9) First Q featured panel + rest as a controlled accordion. */
export const FaqHighlightFirst: React.FC<Props> = ({ content }) => {
  const [open, setOpen] = useState(-1);
  const uid = React.useId();
  const [first, ...rest] = content.items;
  if (!first) return null;
  return (
    <section style={sectionBase}>
      <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
        <div style={{ background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h3 style={{ ...q, fontSize: "1.2rem" }}>{first.q}</h3><p style={a}>{first.a}</p>
        </div>
        <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {rest.map((f, i) => (
            <div key={i} style={{ borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
              <button aria-expanded={open === i} aria-controls={`${uid}-p${i}`} onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", textAlign: "left", background: open === i ? "var(--ds-surface)" : "transparent", border: "none", cursor: "pointer", padding: "1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <span style={q}>{f.q}</span><span style={{ color: "var(--ds-primary)", lineHeight: 1, display: "inline-flex" }}>{open === i ? <Icon name="minus" size={18} /> : <Icon name="plus" size={18} />}</span>
              </button>
              {open === i && <p id={`${uid}-p${i}`} role="region" style={{ ...a, padding: "0 1.4rem 1.1rem" }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 10) Centered single column, alternating question alignment. */
export const FaqCentered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 720px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {content.items.map((f, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.6rem" }}>
            <h3 style={{ ...q, fontSize: "1.3rem" }}>{f.q}</h3>
            <p style={{ ...a, maxWidth: "56ch" }}>{f.a}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
