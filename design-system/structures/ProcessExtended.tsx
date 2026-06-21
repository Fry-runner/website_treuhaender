/**
 * Twenty-two Process / "So arbeiten wir" STRUCTURES. Content = ProcessContent
 * ({ eyebrow, heading, steps: { title, body }[] }). Token-only, so they re-skin
 * with the active look. Steps are inherently ordered → most layouts surface the
 * sequence (numbers, connectors, timelines).
 */
import React, { useState } from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import { Icon } from "../icons/iconSets";
import type { ProcessContent } from "../content/sectionContent";

type Props = { content: ProcessContent };
const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const titleS: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0 };
const bodyS: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 };
const num = (i: number) => String(i + 1).padStart(2, "0");
const cols = (n: number, cap = 4) => `repeat(${Math.min(n, cap)}, minmax(0,1fr))`;
const Dot: React.FC<{ i: number; light?: boolean }> = ({ i, light }) => (
  <span style={{ flex: "0 0 auto", width: "2.4rem", height: "2.4rem", borderRadius: "9999px", background: light ? "rgba(255,255,255,0.12)" : "var(--ds-primary-soft)", color: light ? "#fff" : "var(--ds-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ds-font-mono)", fontSize: "0.78rem", fontWeight: 700 }}>{num(i)}</span>
);

/** 1) Full-width numbered rows. */
export const ProcessNumberedRows: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div>{content.steps.map((s, i) => (
      <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.4rem", padding: "1.3rem 0", borderTop: "1px solid var(--ds-border)", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "1.2rem", color: "var(--ds-primary)", fontWeight: 700 }}>{num(i)}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}><h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p></div>
      </div>
    ))}</div>
  </Container></section>
);

/** 2) Vertical timeline with a connector line + dots. */
export const ProcessTimeline: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Dot i={i} />
            {i < content.steps.length - 1 && <span style={{ flex: 1, width: "2px", background: "var(--ds-border)", minHeight: "1.5rem" }} />}
          </div>
          <div style={{ paddingBottom: "1.6rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}><h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p></div>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 3) Horizontal steps with connectors. */
export const ProcessHorizontal: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.steps.length), gap: "1rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}><Dot i={i} />{i < content.steps.length - 1 && <span style={{ flex: 1, height: "2px", background: "var(--ds-border)" }} />}</div>
          <h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 4) Numbered cards grid. */
export const ProcessCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.steps.length), gap: "1.2rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <Dot i={i} /><h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 5) Cards with arrow separators between them. */
export const ProcessConnectedCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "flex", alignItems: "stretch", gap: "0.6rem", flexWrap: "wrap" }}>
      {content.steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ flex: "1 1 12rem", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", color: "var(--ds-primary)", fontWeight: 700 }}>Schritt {num(i)}</span>
            <h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
          </div>
          {i < content.steps.length - 1 && <span aria-hidden style={{ alignSelf: "center", color: "var(--ds-primary)", display: "inline-flex" }}><Icon name="arrowRight" size={22} /></span>}
        </React.Fragment>
      ))}
    </div>
  </Container></section>
);

/** 6) Zig-zag alternating rows. */
export const ProcessZigzag: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 900px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      {content.steps.map((s, i) => {
        const right = i % 2 === 1;
        return (
          <div key={i} style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "66%", display: "flex", gap: "1rem", alignItems: "flex-start", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.3rem 1.5rem" }}>
              <Dot i={i} /><div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}><h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  </Container></section>
);

/** 7) Oversized faint index numbers in cards. */
export const ProcessBigIndex: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.steps.length), gap: "1.4rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ position: "relative", overflow: "hidden", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span aria-hidden style={{ position: "absolute", top: "-0.6rem", right: "0.4rem", fontFamily: "var(--ds-font-heading)", fontWeight: 800, fontSize: "4rem", color: "var(--ds-primary-soft)", lineHeight: 1 }}>{num(i)}</span>
          <h3 style={{ ...titleS, position: "relative" }}>{s.title}</h3><p style={{ ...bodyS, position: "relative" }}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 8) Horizontal stepper with a progress rail. */
export const ProcessStepperBar: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ position: "relative", display: "grid", gridTemplateColumns: cols(content.steps.length), gap: "1rem" }}>
      <div aria-hidden style={{ position: "absolute", top: "1.2rem", left: "10%", right: "10%", height: "2px", background: "var(--ds-border)" }} />
      {content.steps.map((s, i) => (
        <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.6rem" }}>
          <span style={{ width: "2.4rem", height: "2.4rem", borderRadius: "9999px", background: "var(--ds-primary)", color: "var(--ds-primary-fg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ds-font-mono)", fontWeight: 700, fontSize: "0.8rem" }}>{num(i)}</span>
          <h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 9) Inline steps separated by arrows (compact flow). */
export const ProcessArrowFlow: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "calc(var(--ds-section-y) * 0.8)" }}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.8rem" }}>
      {content.steps.map((s, i) => (
        <React.Fragment key={i}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--ds-primary-soft)", color: "var(--ds-text)", borderRadius: "var(--ds-radius-pill)", padding: "0.5rem 1rem", fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "0.92rem" }}><span style={{ color: "var(--ds-primary)", fontFamily: "var(--ds-font-mono)" }}>{num(i)}</span>{s.title}</span>
          {i < content.steps.length - 1 && <span aria-hidden style={{ color: "var(--ds-primary)", display: "inline-flex", verticalAlign: "-0.1em" }}><Icon name="arrowRight" size={16} /></span>}
        </React.Fragment>
      ))}
    </div>
  </Container></section>
);

/** 10) Single-open accordion of steps. */
export const ProcessAccordion: React.FC<Props> = ({ content }) => {
  const [open, setOpen] = useState(0);
  const uid = React.useId();
  return (
    <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.steps.map((s, i) => (
          <div key={i} style={{ borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
            <button type="button" aria-expanded={open === i} aria-controls={`${uid}-p${i}`} onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", textAlign: "left", background: open === i ? "var(--ds-bg)" : "transparent", border: "none", cursor: "pointer", padding: "1.1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <span style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}><span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", color: "var(--ds-primary)", fontWeight: 700 }}>{num(i)}</span><span style={titleS}>{s.title}</span></span>
              <span style={{ color: "var(--ds-primary)", lineHeight: 1, display: "inline-flex" }}>{open === i ? <Icon name="minus" size={18} /> : <Icon name="plus" size={18} />}</span>
            </button>
            {open === i && <p id={`${uid}-p${i}`} role="region" style={{ ...bodyS, padding: "0 1.4rem 1.2rem" }}>{s.body}</p>}
          </div>
        ))}
      </div>
    </Container></section>
  );
};

/** 11) Heading left (sticky), steps right. */
export const ProcessSplitIntro: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "3rem", alignItems: "start" }}>
      <div style={{ position: "sticky", top: "6rem" }}><SectionHead eyebrow={content.eyebrow} heading={content.heading} /></div>
      <div>{content.steps.map((s, i) => (
        <div key={i} style={{ padding: "1.2rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <Dot i={i} /><div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}><h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p></div>
        </div>
      ))}</div>
    </div>
  </Container></section>
);

/** 12) Borderless minimal — top rule per cell. */
export const ProcessMinimal: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.steps.length), gap: "2rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ borderTop: "2px solid var(--ds-text)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.8rem", color: "var(--ds-primary)", fontWeight: 700 }}>{num(i)}</span>
          <h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 13) Inverted dark band. */
export const ProcessDark: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "var(--ds-section-y)" }}><Container>
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "var(--ds-display-h2, 2rem)", color: "#fff", margin: 0 }}>{content.heading}</h2>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: cols(content.steps.length), gap: "1.2rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ border: "1px solid rgba(255,255,255,0.18)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Dot i={i} light /><h3 style={{ ...titleS, color: "#fff" }}>{s.title}</h3><p style={{ ...bodyS, color: "rgba(255,255,255,0.9)" }}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 14) Numbered chips row + bodies beneath. */
export const ProcessChips: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.steps.length), gap: "1.2rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.7rem", alignItems: "center", textAlign: "center" }}>
          <span style={{ border: "1px solid var(--ds-primary)", color: "var(--ds-primary)", borderRadius: "var(--ds-radius-pill)", padding: "0.3rem 0.9rem", fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", fontWeight: 700 }}>Schritt {num(i)}</span>
          <h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 15) Vertical dotted line with markers. */
export const ProcessDottedVertical: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 720px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ borderLeft: "2px dashed var(--ds-border)", paddingLeft: "1.6rem", display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ position: "relative" }}>
          <span aria-hidden style={{ position: "absolute", left: "-2.05rem", top: "0.2rem", width: "0.8rem", height: "0.8rem", borderRadius: "9999px", background: "var(--ds-primary)", border: "3px solid var(--ds-surface)" }} />
          <h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 16) Two-column numbered list. */
export const ProcessTwoCol: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.2rem 2.4rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", alignItems: "start", padding: "0.6rem 0" }}>
          <Dot i={i} /><div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}><h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p></div>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 17) Zero-gap bordered cells. */
export const ProcessBordered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.steps.length), border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ borderLeft: i % Math.min(content.steps.length, 4) ? "1px solid var(--ds-border)" : "none", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.78rem", color: "var(--ds-primary)", fontWeight: 700 }}>{num(i)}</span>
          <h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 18) Tinted soft step cards. */
export const ProcessTinted: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.steps.length), gap: "1.2rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Dot i={i} /><h3 style={titleS}>{s.title}</h3><p style={{ ...bodyS, color: "var(--ds-text)" }}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 19) First step featured large, the rest a compact list. */
export const ProcessFeatureFirst: React.FC<Props> = ({ content }) => {
  const [first, ...rest] = content.steps;
  if (!first) return null;
  return (
    <section style={sectionBase}><Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "1.6rem", alignItems: "start" }}>
        <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <Dot i={0} /><h3 style={{ ...titleS, fontSize: "1.4rem" }}>{first.title}</h3><p style={{ ...bodyS, color: "var(--ds-text)" }}>{first.body}</p>
        </div>
        <div>{rest.map((s, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", padding: "1rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none", alignItems: "start" }}>
            <Dot i={i + 1} /><div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}><h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p></div>
          </div>
        ))}</div>
      </div>
    </Container></section>
  );
};

/** 20) Horizontal scroll-snap rail of step cards. */
export const ProcessRail: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", gap: "1.2rem", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "0.6rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ flex: "0 0 74%", maxWidth: "300px", scrollSnapAlign: "start", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Dot i={i} /><h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 21) Number + accent underline rows. */
export const ProcessUnderlineNumbers: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.steps.length, 3), gap: "1.8rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 800, fontSize: "1.8rem", color: "var(--ds-text)", borderBottom: "3px solid var(--ds-primary)", alignSelf: "flex-start", paddingBottom: "0.2rem" }}>{num(i)}</span>
          <h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 22) Left-aligned big numbered stack. */
export const ProcessStackedBig: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      {content.steps.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.4rem", alignItems: "baseline" }}>
          <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 800, fontSize: "2.6rem", color: "var(--ds-primary-soft)", lineHeight: 1 }}>{num(i)}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}><h3 style={{ ...titleS, fontSize: "1.25rem" }}>{s.title}</h3><p style={bodyS}>{s.body}</p></div>
        </div>
      ))}
    </div>
  </Container></section>
);
