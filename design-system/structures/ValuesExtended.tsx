/**
 * Ten additional Values STRUCTURES. Same ValuesContent ({title, body}[]) as the
 * original two (divided columns / card grid); token-only, so they re-skin with
 * the active look.
 */
import React, { useState } from "react";
import { Container } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { ValuesContent } from "../content/types";

type Props = { content: ValuesContent; more?: MoreLink };
const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const title: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0 };
const body: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 };

/** 1) Full-width rows. */
export const ValuesNumberedRows: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div>
        {content.items.map((v, i) => (
          <div key={i} style={{ padding: "1.3rem 0", borderTop: "1px solid var(--ds-border)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}><h4 style={title}>{v.title}</h4><p style={body}>{v.body}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Horizontal row cards with a dot marker. */
export const ValuesRowsIcon: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {content.items.map((v, i) => (
          <div key={i} className="ds-card" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.1rem", alignItems: "start", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.3rem 1.5rem" }}>
            <span aria-hidden style={{ flex: "0 0 auto", marginTop: "0.55rem", width: "0.7rem", height: "0.7rem", borderRadius: "9999px", background: "var(--ds-primary)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}><h4 style={title}>{v.title}</h4><p style={body}>{v.body}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Single-open accordion. */
export const ValuesAccordion: React.FC<Props> = ({ content, more }) => {
  const [open, setOpen] = useState(0);
  const uid = React.useId();
  return (
    <section style={sectionBase}>
      <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {content.items.map((v, i) => (
            <div key={i} style={{ borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
              <button aria-expanded={open === i} aria-controls={`${uid}-p${i}`} onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", textAlign: "left", background: open === i ? "var(--ds-bg)" : "transparent", border: "none", cursor: "pointer", padding: "1.1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <span style={title as React.CSSProperties}>{v.title}</span>
                <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", lineHeight: 1, display: "inline-flex" }}>{open === i ? <Icon name="minus" size={18} /> : <Icon name="plus" size={18} />}</span>
              </button>
              {open === i && <p id={`${uid}-p${i}`} role="region" style={{ ...body, padding: "0 1.4rem 1.2rem" }}>{v.body}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 4) Zig-zag alternating rows. */
export const ValuesAlternating: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 900px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {content.items.map((v, i) => {
          const right = i % 2 === 1;
          return (
            <div key={i} style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start" }}>
              <div className="ds-card" style={{ maxWidth: "64%", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.3rem 1.5rem", textAlign: right ? "right" : "left", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <h4 style={title}>{v.title}</h4><p style={body}>{v.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  </section>
);

/** 5) Heading left, value rows right. */
export const ValuesSplitIntro: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "3rem", alignItems: "start" }}>
        <div style={{ position: "sticky", top: "6rem" }}><SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} /></div>
        <div>
          {content.items.map((v, i) => (
            <div key={i} style={{ padding: "1.2rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}><h4 style={title}>{v.title}</h4><p style={body}>{v.body}</p></div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

/** 6) Top-accent grid cards. */
export const ValuesBigIndex: React.FC<Props> = ({ content, more }) => {
  const cols = Math.min(content.items.length, 3);
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: "1.4rem" }}>
          {content.items.map((v, i) => (
            <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderTop: "3px solid var(--ds-primary)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <h4 style={title}>{v.title}</h4>
              <p style={body}>{v.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 7) Bento tiles — first value spans wider. */
export const ValuesTiles: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "1.2rem" }}>
        {content.items.map((v, i) => (
          <div key={i} className="ds-card" style={{ gridColumn: i === 0 ? "span 2" : "span 1", background: i === 0 ? "var(--ds-primary-soft)" : "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: i === 0 ? "2rem" : "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <h4 style={{ ...title, fontSize: i === 0 ? "1.4rem" : "1.1rem" }}>{v.title}</h4>
            <p style={body}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 8) Borderless minimal grid — top rule per cell. */
export const ValuesMinimal: React.FC<Props> = ({ content, more }) => {
  const cols = Math.min(content.items.length, 4);
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: "2rem" }}>
          {content.items.map((v, i) => (
            <div key={i} style={{ borderTop: "2px solid var(--ds-text)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}><h4 style={title}>{v.title}</h4><p style={body}>{v.body}</p></div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 9) Compact stacked definition list. */
export const ValuesInlineList: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <dl style={{ margin: 0 }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,0.6fr) minmax(0,1fr)", gap: "1.4rem", padding: "1rem 0", borderTop: "1px solid var(--ds-border)" }}>
            <dt style={{ ...title, fontSize: "1rem" }}>{v.title}</dt>
            <dd style={{ ...body, margin: 0 }}>{v.body}</dd>
          </div>
        ))}
      </dl>
    </Container>
  </section>
);

/** 10) Grid with checkmark bullets. */
export const ValuesCheckList: React.FC<Props> = ({ content, more }) => {
  const cols = Math.min(content.items.length, 2);
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: "1.2rem 2.4rem" }}>
          {content.items.map((v, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.9rem", alignItems: "start", padding: "0.6rem 0" }}>
              <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3 }}><Icon name="check" size={16} /></span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}><h4 style={title}>{v.title}</h4><p style={body}>{v.body}</p></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
