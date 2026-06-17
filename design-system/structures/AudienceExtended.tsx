/**
 * Twenty-two Audience / "Für wen" STRUCTURES. Content = AudienceContent
 * ({ eyebrow, heading, items: { title, body }[] }) — client segments / personas
 * (KMU, Selbständige, Vereine, Privatpersonen …). Token-only. Unlike Process,
 * segments are unordered → markers are categorical (dots/initials), not step numbers.
 */
import React, { useState } from "react";
import { Container } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead } from "./SectionHead";
import type { AudienceContent } from "../content/sectionContent";

type Props = { content: AudienceContent };
const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const titleS: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0 };
const bodyS: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 };
const cols = (n: number, cap = 4) => `repeat(${Math.min(n, cap)}, minmax(0,1fr))`;
const initial = (s: string) => (s.trim()[0] ?? "•").toUpperCase();
const Mark: React.FC<{ s: string; light?: boolean }> = ({ s, light }) => (
  <span style={{ flex: "0 0 auto", width: "2.4rem", height: "2.4rem", borderRadius: "9999px", background: light ? "rgba(255,255,255,0.12)" : "var(--ds-primary-soft)", color: light ? "#fff" : "var(--ds-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "0.95rem" }}>{initial(s)}</span>
);

/** 1) Card grid. */
export const AudienceCards: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), gap: "1.2rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <Mark s={v.title} /><h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 2) Zero-gap bordered grid. */
export const AudienceBordered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ borderLeft: i % Math.min(content.items.length, 4) ? "1px solid var(--ds-border)" : "none", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 3) Bento tiles — first segment spans wider. */
export const AudienceTiles: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "1.2rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ gridColumn: i === 0 ? "span 2" : "span 1", background: i === 0 ? "var(--ds-primary-soft)" : "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: i === 0 ? "2rem" : "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <h3 style={{ ...titleS, fontSize: i === 0 ? "1.4rem" : "1.1rem" }}>{v.title}</h3><p style={{ ...bodyS, color: "var(--ds-text)" }}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 4) Horizontal row cards with an initial marker. */
export const AudienceRows: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.1rem", alignItems: "start", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.3rem 1.5rem" }}>
          <Mark s={v.title} /><div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}><h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p></div>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 5) Heading left, segments right. */
export const AudienceSplitIntro: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "3rem", alignItems: "start" }}>
      <div style={{ position: "sticky", top: "6rem" }}><SectionHead eyebrow={content.eyebrow} heading={content.heading} /></div>
      <div>{content.items.map((v, i) => (
        <div key={i} style={{ padding: "1.2rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}><h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p></div>
      ))}</div>
    </div>
  </Container></section>
);

/** 6) Oversized faint initial per card. */
export const AudienceBigLetter: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), gap: "1.4rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ position: "relative", overflow: "hidden", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span aria-hidden style={{ position: "absolute", top: "-0.8rem", right: "0.4rem", fontFamily: "var(--ds-font-heading)", fontWeight: 800, fontSize: "4.2rem", color: "var(--ds-primary-soft)", lineHeight: 1 }}>{initial(v.title)}</span>
          <h3 style={{ ...titleS, position: "relative" }}>{v.title}</h3><p style={{ ...bodyS, position: "relative" }}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 7) Checkmark segments grid. */
export const AudienceChecklist: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 2)}, minmax(0,1fr))`, gap: "1.2rem 2.4rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.9rem", alignItems: "start", padding: "0.6rem 0" }}>
          <span style={{ color: "var(--ds-primary)", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3 }}><Icon name="check" size={16} /></span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}><h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p></div>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 8) Two-column list. */
export const AudienceTwoCol: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.2rem 2.4rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", alignItems: "start", padding: "0.6rem 0" }}>
          <Mark s={v.title} /><div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}><h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p></div>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 9) Borderless minimal — top rule per cell. */
export const AudienceMinimal: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), gap: "2rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ borderTop: "2px solid var(--ds-text)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}><h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p></div>
      ))}
    </div>
  </Container></section>
);

/** 10) Inverted dark band. */
export const AudienceDark: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "var(--ds-section-y)" }}><Container>
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.72rem", color: "rgba(255,255,255,0.75)", marginBottom: "0.5rem" }}>{content.eyebrow}</div>
      <h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "var(--ds-display-h2, 2rem)", color: "#fff", margin: 0 }}>{content.heading}</h2>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), gap: "1.2rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ border: "1px solid rgba(255,255,255,0.18)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Mark s={v.title} light /><h3 style={{ ...titleS, color: "#fff" }}>{v.title}</h3><p style={{ ...bodyS, color: "rgba(255,255,255,0.9)" }}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 11) Tinted soft cards. */
export const AudienceTinted: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), gap: "1.2rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <h3 style={titleS}>{v.title}</h3><p style={{ ...bodyS, color: "var(--ds-text)" }}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 12) Pill title + body. */
export const AudiencePillHeaders: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), gap: "1.2rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.7rem", alignItems: "flex-start" }}>
          <span style={{ background: "var(--ds-primary-soft)", color: "var(--ds-primary)", borderRadius: "var(--ds-radius-pill)", padding: "0.4rem 0.9rem", fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "0.92rem" }}>{v.title}</span>
          <p style={bodyS}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 13) First segment featured, the rest a list. */
export const AudienceFeatureFirst: React.FC<Props> = ({ content }) => {
  const [first, ...rest] = content.items;
  if (!first) return null;
  return (
    <section style={sectionBase}><Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "1.6rem", alignItems: "start" }}>
        <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <Mark s={first.title} /><h3 style={{ ...titleS, fontSize: "1.4rem" }}>{first.title}</h3><p style={{ ...bodyS, color: "var(--ds-text)" }}>{first.body}</p>
        </div>
        <div>{rest.map((v, i) => (
          <div key={i} style={{ padding: "1rem 0", borderTop: i ? "1px solid var(--ds-border)" : "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}><h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p></div>
        ))}</div>
      </div>
    </Container></section>
  );
};

/** 14) Divided columns band. */
export const AudienceColumns: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", background: "var(--ds-bg)" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ borderLeft: i % Math.min(content.items.length, 4) ? "1px solid var(--ds-border)" : "none", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "center", alignItems: "center" }}>
          <Mark s={v.title} /><h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 15) Single-open accordion. */
export const AudienceAccordion: React.FC<Props> = ({ content }) => {
  const [open, setOpen] = useState(0);
  const uid = React.useId();
  return (
    <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
            <button type="button" aria-expanded={open === i} aria-controls={`${uid}-p${i}`} onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", textAlign: "left", background: open === i ? "var(--ds-bg)" : "transparent", border: "none", cursor: "pointer", padding: "1.1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <span style={titleS}>{v.title}</span><span style={{ color: "var(--ds-primary)", lineHeight: 1, display: "inline-flex" }}>{open === i ? <Icon name="minus" size={18} /> : <Icon name="plus" size={18} />}</span>
            </button>
            {open === i && <p id={`${uid}-p${i}`} role="region" style={{ ...bodyS, padding: "0 1.4rem 1.2rem" }}>{v.body}</p>}
          </div>
        ))}
      </div>
    </Container></section>
  );
};

/** 16) Zig-zag alternating rows. */
export const AudienceAlternating: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 900px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      {content.items.map((v, i) => {
        const right = i % 2 === 1;
        return (
          <div key={i} style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "64%", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.3rem 1.5rem", textAlign: right ? "right" : "left", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  </Container></section>
);

/** 17) Tinted inline band (compact). */
export const AudienceBanner: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "var(--ds-section-y)" }}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ flex: "1 1 14rem", maxWidth: "20rem", background: "var(--ds-bg)", borderRadius: "var(--ds-radius)", padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 18) Horizontal scroll-snap rail. */
export const AudienceRail: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", gap: "1.2rem", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "0.6rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ flex: "0 0 74%", maxWidth: "300px", scrollSnapAlign: "start", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Mark s={v.title} /><h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 19) Circular dot-marker cards. */
export const AudienceDots: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), gap: "1.4rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.7rem" }}>
          <span style={{ width: "0.9rem", height: "0.9rem", borderRadius: "9999px", background: "var(--ds-primary)" }} />
          <h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 20) Segment as an italic statement. */
export const AudienceQuote: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", alignItems: "start", paddingBlock: "1.4rem", borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
          <span aria-hidden style={{ fontFamily: "var(--ds-font-heading)", fontSize: "2rem", lineHeight: 0.9, color: "var(--ds-primary)" }}>„</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <h3 style={{ ...titleS, fontStyle: "italic" }}>{v.title}</h3><p style={bodyS}>{v.body}</p>
          </div>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 21) Top accent border cards. */
export const AudienceTopAccent: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: cols(content.items.length), gap: "1.2rem" }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderTop: "3px solid var(--ds-primary)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <h3 style={titleS}>{v.title}</h3><p style={bodyS}>{v.body}</p>
        </div>
      ))}
    </div>
  </Container></section>
);

/** 22) Definition-list style. */
export const AudienceInlineList: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <dl style={{ margin: 0 }}>
      {content.items.map((v, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,0.6fr) minmax(0,1fr)", gap: "1.4rem", padding: "1rem 0", borderTop: "1px solid var(--ds-border)" }}>
          <dt style={{ ...titleS, fontSize: "1rem" }}>{v.title}</dt><dd style={{ ...bodyS, margin: 0 }}>{v.body}</dd>
        </div>
      ))}
    </dl>
  </Container></section>
);
