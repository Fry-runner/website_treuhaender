/**
 * Values STRUCTURES — batch 2. Same ValuesContent ({title, body}[]); token-only.
 */
import React from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { ValuesContent } from "../content/types";

type Props = { content: ValuesContent; more?: MoreLink };
const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const titleS: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0 };
const bodyS: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 };

/** 1) Centered cards with a circular dot/icon badge. */
export const ValuesIconCircle: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 4)}, minmax(0,1fr))`, gap: "1.65rem" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.6rem" }}>
            <div style={{ width: "3rem", height: "3rem", borderRadius: "9999px", background: "var(--ds-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ width: "0.7rem", height: "0.7rem", borderRadius: "9999px", background: "var(--ds-primary)" }} /></div>
            <h4 style={titleS}>{v.title}</h4><p style={bodyS}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Vertical timeline with dots. */
export const ValuesTimeline: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ position: "relative", paddingLeft: "2rem" }}>
        <div aria-hidden style={{ position: "absolute", left: "0.45rem", top: "0.4rem", bottom: "0.4rem", width: "1px", background: "var(--ds-border)" }} />
        {content.items.map((v, i) => (
          <div key={i} style={{ position: "relative", paddingBottom: "1.6rem" }}>
            <span aria-hidden style={{ position: "absolute", left: "-1.65rem", top: "0.25rem", width: "0.7rem", height: "0.7rem", borderRadius: "9999px", background: "var(--ds-primary)", border: "2px solid var(--ds-surface)" }} />
            <h4 style={titleS}>{v.title}</h4><p style={bodyS}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Zero-gap hairline grid. */
export const ValuesBorderedGrid: React.FC<Props> = ({ content, more }) => {
  const cols = Math.min(content.items.length, 3);
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", background: "var(--ds-bg)" }}>
          {content.items.map((v, i) => (
            <div key={i} style={{ padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.5rem", borderLeft: i % cols === 0 ? "none" : "1px solid var(--ds-border)", borderTop: i >= cols ? "1px solid var(--ds-border)" : "none" }}>
              <h4 style={titleS}>{v.title}</h4><p style={bodyS}>{v.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 4) Values as italic statements with an accent bar. */
export const ValuesQuote: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ height: "2px", width: "2.2rem", background: "var(--ds-primary)" }} />
            <h4 style={{ ...titleS, fontStyle: "italic", fontSize: "1.3rem" }}>{v.title}</h4>
            <p style={bodyS}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 5) Single tinted band, values inline. */
export const ValuesBanner: React.FC<Props> = ({ content, more }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 4)}, minmax(0,1fr))`, gap: "1.85rem" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "center", alignItems: "center" }}>
            <span aria-hidden style={{ width: "0.55rem", height: "0.55rem", borderRadius: "9999px", background: "var(--ds-primary)" }} />
            <h4 style={titleS}>{v.title}</h4><p style={bodyS}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Horizontal numbered stepper. */
export const ValuesStepper: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1.45rem" }}>
        <div aria-hidden style={{ position: "absolute", top: "0.85rem", left: "8%", right: "8%", height: "1px", background: "var(--ds-border)" }} />
        {content.items.map((v, i) => (
          <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.5rem" }}>
            <div style={{ width: "1.7rem", height: "1.7rem", borderRadius: "9999px", background: "var(--ds-primary)", color: "var(--ds-primary-fg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ds-font-mono)", fontSize: "0.7rem", fontWeight: 700, border: "3px solid var(--ds-surface)" }}>{i + 1}</div>
            <h4 style={{ ...titleS, fontSize: "1rem" }}>{v.title}</h4><p style={{ ...bodyS, fontSize: "0.85rem" }}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 7) First value featured, rest as a compact list. */
export const ValuesFeature: React.FC<Props> = ({ content, more }) => {
  const [first, ...rest] = content.items;
  if (!first) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "1.65rem", alignItems: "stretch" }}>
          <div style={{ background: "var(--ds-primary-soft)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.05rem" }}>
            <h4 style={{ ...titleS, fontSize: "1.6rem" }}>{first.title}</h4><p style={bodyS}>{first.body}</p>
          </div>
          <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
            {rest.map((v, i) => (
              <div key={i} style={{ padding: "1.1rem 1.4rem", borderTop: i ? "1px solid var(--ds-border)" : "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}><h4 style={{ ...titleS, fontSize: "1.02rem" }}>{v.title}</h4><p style={{ ...bodyS, fontSize: "0.85rem" }}>{v.body}</p></div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

/** 8) Striped alternating-background rows. */
export const ValuesZebra: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ padding: "1.2rem 1.5rem", background: i % 2 ? "var(--ds-bg)" : "transparent" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}><h4 style={{ ...titleS, fontSize: "1.05rem" }}>{v.title}</h4><p style={{ ...bodyS, fontSize: "0.88rem" }}>{v.body}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 9) Value title as a pill chip, body below. */
export const ValuesPillHeaders: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 4)}, minmax(0,1fr))`, gap: "1.65rem" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.95rem" }}>
            <span style={{ display: "inline-block", padding: "0.45rem 1rem", borderRadius: "9999px", background: "var(--ds-primary)", color: "var(--ds-primary-fg)", fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "0.95rem" }}>{v.title}</span>
            <p style={bodyS}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 10) Cards with a top accent bar. */
export const ValuesTopAccent: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 4)}, minmax(0,1fr))`, gap: "1.45rem" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div aria-hidden style={{ height: "3px", background: "var(--ds-primary)" }} />
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}><h4 style={titleS}>{v.title}</h4><p style={bodyS}>{v.body}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
