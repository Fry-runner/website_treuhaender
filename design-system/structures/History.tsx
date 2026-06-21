/**
 * History / "Unsere Geschichte" timeline STRUCTURES — token-only. Content =
 * HistoryContent ({ heading, entries: { year, title?, body }[] }). Entries are
 * inherently chronological, so every layout surfaces the YEAR prominently on a
 * connector/timeline. Rendered ONLY from real scraped milestones — extract.ts gates
 * ≥3 dated entries — so a firm without a documented history never shows one.
 */
import React from "react";
import { Container } from "./primitives";
import { SectionHead } from "./SectionHead";
import type { HistoryContent } from "../content/sectionContent";

type Props = { content: HistoryContent };
type Entry = HistoryContent["entries"][number];

const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const titleS: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)", margin: 0 };
const bodyS: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 };
const yearChip: React.CSSProperties = { fontFamily: "var(--ds-font-mono)", fontWeight: 700, fontSize: "0.82rem", color: "var(--ds-primary)", background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius-pill)", padding: "0.28rem 0.7rem", whiteSpace: "nowrap" };
const yearBig: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 800, fontSize: "1.6rem", color: "var(--ds-primary)", lineHeight: 1 };

const Body: React.FC<{ e: Entry }> = ({ e }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
    {e.title && <h3 style={titleS}>{e.title}</h3>}
    <p style={bodyS}>{e.body}</p>
  </div>
);

/** 1) Vertical connector timeline — year chip + body, joined by a rail. */
export const HistoryTimeline: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 780px)" }}>
    <SectionHead eyebrow="" heading={content.heading} />
    <div>
      {content.entries.map((e, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={yearChip}>{e.year}</span>
            {i < content.entries.length - 1 && <span aria-hidden style={{ flex: 1, width: 2, background: "var(--ds-border)", minHeight: "1.4rem" }} />}
          </div>
          <div style={{ paddingBottom: "1.7rem" }}><Body e={e} /></div>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 2) Full-width rows — big year left, body right, hairline between. */
export const HistoryRows: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
    <SectionHead eyebrow="" heading={content.heading} />
    <div>
      {content.entries.map((e, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,0.32fr) minmax(0,1.68fr)", gap: "1.6rem", alignItems: "baseline", padding: "1.3rem 0", borderTop: "1px solid var(--ds-border)" }}>
          <span style={yearBig}>{e.year}</span>
          <Body e={e} />
        </div>
      ))}
    </div>
  </Container></section>
);

/** 3) Dashed vertical line with year markers. */
export const HistoryDotted: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 740px)" }}>
    <SectionHead eyebrow="" heading={content.heading} />
    <div style={{ borderLeft: "2px dashed var(--ds-border)", paddingLeft: "1.8rem", display: "flex", flexDirection: "column", gap: "1.7rem" }}>
      {content.entries.map((e, i) => (
        <div key={i} style={{ position: "relative" }}>
          <span aria-hidden style={{ position: "absolute", left: "-2.25rem", top: "0.15rem", width: "0.85rem", height: "0.85rem", borderRadius: "9999px", background: "var(--ds-primary)", border: "3px solid var(--ds-surface)" }} />
          <span style={{ ...yearChip, display: "inline-block", marginBottom: "0.45rem" }}>{e.year}</span>
          <Body e={e} />
        </div>
      ))}
    </div>
  </Container></section>
);

/** 4) Year-headed cards grid. */
export const HistoryCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow="" heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.entries.length, 4)}, minmax(0,1fr))`, gap: "1.2rem" }}>
      {content.entries.map((e, i) => (
        <div key={i} style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <span style={yearBig}>{e.year}</span>
          <Body e={e} />
        </div>
      ))}
    </div>
  </Container></section>
);

/** 5) Sticky heading left, timeline right. */
export const HistorySidebar: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.7fr)", gap: "3rem", alignItems: "start" }}>
      <div style={{ position: "sticky", top: "6rem" }}><SectionHead eyebrow="" heading={content.heading} /></div>
      <div>
        {content.entries.map((e, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.1rem", alignItems: "baseline", padding: "0.9rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
            <span style={yearChip}>{e.year}</span>
            <Body e={e} />
          </div>
        ))}
      </div>
    </div>
  </Container></section>
);
