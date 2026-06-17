/**
 * Stats STRUCTURES — batch 2. Same StatsContent ({value, label}[]); token-only,
 * animated numbers via CountUp.
 */
import React from "react";
import { Container } from "./primitives";
import { CountUp } from "../motion/CountUp";
import type { StatsContent } from "../content/types";

type Props = { content: StatsContent };
const sectionBase: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const label: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" };
const big = (size: string, color = "var(--ds-text)"): React.CSSProperties => ({ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: size, color, lineHeight: 1 });

/** 1) Number inside a static decorative ring (no data-driven fill). */
export const StatsRing: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1.4rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", textAlign: "center" }}>
            <div style={{ position: "relative", width: "7rem", height: "7rem" }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }} aria-hidden>
                <circle cx="50" cy="50" r="44" fill="none" stroke="var(--ds-primary)" strokeWidth="6" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...big("1.4rem", "var(--ds-primary)") }}><CountUp value={s.value} /></div>
            </div>
            <div style={label}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Bordered cards (no shadow). */
export const StatsBorderedCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1.2rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={big("2.4rem")}><CountUp value={s.value} /></div>
            <div style={label}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Number with an accent underline + label. */
export const StatsUnderline: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "2rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={big("2.6rem", "var(--ds-primary)")}><CountUp value={s.value} /></div>
            <div style={{ height: "2px", width: "2.4rem", background: "var(--ds-primary)" }} />
            <div style={label}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 4) Number + label rows, hairline divided. */
export const StatsProgress: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 720px)" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1.4rem", padding: "1.1rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
            <span style={label}>{s.label}</span>
            <span style={big("1.8rem", "var(--ds-primary)")}><CountUp value={s.value} /></span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 5) Left-aligned huge stacked numbers. */
export const StatsStackedBig: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 720px)" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "1.2rem", padding: "1rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
            <div style={big("calc(var(--ds-display) * 0.6)", "var(--ds-primary)")}><CountUp value={s.value} /></div>
            <div style={{ ...label, fontSize: "0.8rem" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Primary-soft tinted cards. */
export const StatsTintCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1.2rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "1.8rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={big("2.4rem", "var(--ds-primary)")}><CountUp value={s.value} /></div>
            <div style={label}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 7) Outlined (stroked) numerals. */
export const StatsOutlineNumbers: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1.4rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.4rem", textAlign: "center" }}>
            <div style={{ ...big("calc(var(--ds-display) * 0.62)"), color: "transparent", WebkitTextStroke: "1.5px var(--ds-primary)" } as React.CSSProperties}><CountUp value={s.value} /></div>
            <div style={label}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 8) Borderless cells separated by vertical hairlines. */
export const StatsPlainDivide: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))` }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ padding: "0 1.6rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.4rem", borderLeft: i === 0 ? "none" : "1px solid var(--ds-border)" }}>
            <div style={big("2.4rem")}><CountUp value={s.value} /></div>
            <div style={label}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 9) Bordered pills with a leading dot. */
export const StatsBadgePills: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "1.8rem" }}>
    <Container>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.9rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem", padding: "0.7rem 1.3rem", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-pill)", background: "var(--ds-surface)" }}>
            <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", background: "var(--ds-primary)" }} />
            <span style={big("1.2rem", "var(--ds-primary)")}><CountUp value={s.value} /></span>
            <span style={label}>{s.label}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 10) Number + label as left-aligned headline pairs. */
export const StatsHeadlinePair: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 2)}, minmax(0,1fr))`, gap: "1.2rem 3rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "1rem", padding: "0.9rem 0", borderBottom: "1px solid var(--ds-border)" }}>
            <div style={big("2.2rem", "var(--ds-primary)")}><CountUp value={s.value} /></div>
            <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1rem", color: "var(--ds-text)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
