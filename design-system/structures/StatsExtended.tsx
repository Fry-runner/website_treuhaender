/**
 * Ten additional Stats STRUCTURES. Same StatsContent ({value, label}[]) as the
 * original two (divided band / tinted panel); token-only, animated numbers via
 * CountUp. Each is a distinct metrics layout.
 */
import React from "react";
import { Container } from "./primitives";
import { CountUp } from "../motion/CountUp";
import type { StatsContent } from "../content/types";

type Props = { content: StatsContent };
const sectionBase: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const label: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   color: "var(--ds-text-muted)" };
const big = (size: string, color = "var(--ds-text)"): React.CSSProperties => ({ fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number, fontSize: size, color, lineHeight: 1 });

/** 1) Few huge display numbers, borderless. */
export const StatsBigNumbers: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "2rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "center" }}>
            <div style={big("calc(var(--ds-display) * 0.7)", "var(--ds-primary)")}><CountUp value={s.value} /></div>
            <div style={label}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Stacked rows — value left, label right, hairline divided. */
export const StatsRows: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 720px)" }}>
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1.4rem", padding: "1.3rem 1.6rem", borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
            <div style={{ ...label, fontSize: "0.8rem" }}>{s.label}</div>
            <div style={big("2rem")}><CountUp value={s.value} /></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Compact inline strip with dot separators. */
export const StatsInline: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "1.6rem" }}>
    <Container>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "1.4rem" }}>
        {content.items.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span aria-hidden style={{ width: "0.4rem", height: "0.4rem", borderRadius: "9999px", background: "var(--ds-primary)" }} />}
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={big("1.5rem", "var(--ds-primary)")}><CountUp value={s.value} /></span>
              <span style={label}>{s.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Container>
  </section>
);

/** 4) Shadowed cards grid. */
export const StatsCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1.2rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.8rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={big("2.4rem")}><CountUp value={s.value} /></div>
            <div style={label}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 5) Inverted dark band. */
export const StatsDark: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1.4rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={big("2.6rem", "var(--ds-bg)")}><CountUp value={s.value} /></div>
            <div style={{ ...label, color: "var(--ds-bg)", opacity: 0.75 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) First stat featured large, rest small beside it. */
export const StatsLeading: React.FC<Props> = ({ content }) => {
  const [first, ...rest] = content.items;
  if (!first) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "2.4rem", alignItems: "center" }}>
          <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "2rem", textAlign: "center" }}>
            <div style={big("calc(var(--ds-display) * 0.65)", "var(--ds-primary)")}><CountUp value={first.value} /></div>
            <div style={{ ...label, marginTop: "0.5rem" }}>{first.label}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(rest.length, 3) || 1}, minmax(0,1fr))`, gap: "1.4rem" }}>
            {rest.map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <div style={big("1.9rem")}><CountUp value={s.value} /></div>
                <div style={label}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

/** 7) Label above number (reversed hierarchy). */
export const StatsLabelTop: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: 0, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ padding: "1.8rem", textAlign: "center", borderLeft: i === 0 ? "none" : "1px solid var(--ds-border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={label}>{s.label}</div>
            <div style={big("2.4rem", "var(--ds-primary)")}><CountUp value={s.value} /></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 8) Bordered pill chips in a wrapping row. */
export const StatsChips: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "1.8rem" }}>
    <Container>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.9rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "baseline", gap: "0.6rem", padding: "0.7rem 1.2rem", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-pill)", background: "var(--ds-surface)" }}>
            <span style={big("1.3rem", "var(--ds-primary)")}><CountUp value={s.value} /></span>
            <span style={label}>{s.label}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 9) Telemetry-style label→value rows. */
export const StatsTelemetry: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 620px)" }}>
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        <div aria-hidden style={{ height: "3px", background: "var(--ds-primary)" }} />
        {content.items.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", padding: "0.9rem 1.4rem", borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
            <span style={label}>{s.label}</span>
            <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "1.1rem", fontWeight: 700, color: "var(--ds-text)" }}><CountUp value={s.value} /></span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 10) Gradient band with light numbers. */
export const StatsGradientBand: React.FC<Props> = ({ content }) => (
  <section style={{ paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)", backgroundImage: "linear-gradient(120deg, var(--ds-primary), var(--ds-secondary))" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1.4rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={big("2.6rem", "var(--ds-primary-fg)")}><CountUp value={s.value} /></div>
            <div style={{ ...label, color: "var(--ds-primary-fg)", opacity: 0.85 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
