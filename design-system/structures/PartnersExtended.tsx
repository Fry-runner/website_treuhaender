/**
 * Twenty-two Partners / TrustBar STRUCTURES (certification + partner-logo strip,
 * briefing §8.4). Content = TrustContent ({ label, items[], badges? }). When real
 * badge logos exist they render as quiet greyscale marks; otherwise the text
 * credentials (associations + software) are shown. Token-only.
 */
import React from "react";
import { Container } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead } from "./SectionHead";
import type { TrustContent } from "../content/types";

type Props = { content: TrustContent };
const band: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "1.8rem", borderBottom: "1px solid var(--ds-border)" };
const section: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const labelS: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.68rem",   color: "var(--ds-text-muted)" };
const itemS: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontSize: "0.9rem", fontWeight: 600, color: "var(--ds-text-muted)", opacity: 0.8, whiteSpace: "nowrap" };
const badgeS: React.CSSProperties = { height: "2.2rem", width: "auto", maxWidth: "9rem", objectFit: "contain", filter: "grayscale(1)", opacity: 0.7 };

/** Render badge logos if present, else text credential chips. */
const Marks: React.FC<{ content: TrustContent; item?: React.CSSProperties; badge?: React.CSSProperties; light?: boolean }> = ({ content, item, badge, light }) =>
  content.badges && content.badges.length
    ? <>{content.badges.map((src, i) => <img key={i} src={src} alt="" style={{ ...badgeS, ...(light ? { filter: "grayscale(1) brightness(3)" } : {}), ...badge }} />)}</>
    : <>{content.items.map((it, i) => <span key={i} style={{ ...itemS, ...(light ? { color: "rgba(255,255,255,0.8)", opacity: 1 } : {}), ...item }}>{it}</span>)}</>;

/** 1) Centered single-line chip/logo strip (the quiet default). */
export const PartnersStrip: React.FC<Props> = ({ content }) => (
  <section style={band}><Container>
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
      <span style={labelS}>{content.label}</span><Marks content={content} />
    </div>
  </Container></section>
);

/** 2) Label left, marks flowing to the right. */
export const PartnersLeftLabel: React.FC<Props> = ({ content }) => (
  <section style={band}><Container>
    <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap", justifyContent: "space-between" }}>
      <span style={labelS}>{content.label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", flexWrap: "wrap" }}><Marks content={content} /></div>
    </div>
  </Container></section>
);

/** 3) Centered label above a row of marks. */
export const PartnersStacked: React.FC<Props> = ({ content }) => (
  <section style={band}><Container>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.1rem" }}>
      <span style={labelS}>{content.label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "1.8rem", flexWrap: "wrap", justifyContent: "center" }}><Marks content={content} /></div>
    </div>
  </Container></section>
);

/** 4) Marks in a centered auto-fitting grid. */
export const PartnersGrid: React.FC<Props> = ({ content }) => (
  <section style={section}><Container>
    <div style={{ textAlign: "center", marginBottom: "1.6rem" }}><span style={labelS}>{content.label}</span></div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.6rem 2.4rem", justifyContent: "center", alignItems: "center" }}><Marks content={content} /></div>
  </Container></section>
);

/** 5) Zero-gap bordered cells. */
export const PartnersBordered: React.FC<Props> = ({ content }) => {
  const marks = content.badges && content.badges.length ? content.badges : content.items;
  const isImg = !!(content.badges && content.badges.length);
  return (
    <section style={section}><Container>
      <div style={{ textAlign: "center", marginBottom: "1.4rem" }}><span style={labelS}>{content.label}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(marks.length, 4)}, minmax(0,1fr))`, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {marks.map((m, i) => (
          <div key={i} style={{ borderLeft: i % Math.min(marks.length, 4) ? "1px solid var(--ds-border)" : "none", padding: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "4rem" }}>
            {isImg ? <img src={m} alt="" style={badgeS} /> : <span style={itemS}>{m}</span>}
          </div>
        ))}
      </div>
    </Container></section>
  );
};

/** 6) Auto-scrolling marquee row (respects reduced motion). */
export const PartnersMarquee: React.FC<Props> = ({ content }) => {
  const marks = content.badges && content.badges.length ? content.badges : content.items;
  const isImg = !!(content.badges && content.badges.length);
  const loop = [...marks, ...marks];
  return (
    <section style={{ ...band, overflow: "hidden" }}>
      <style>{`@keyframes ds-partners-marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion: reduce){.ds-partners-marq{animation:none!important}}`}</style>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}><span style={labelS}>{content.label}</span></div>
      <div style={{ display: "flex", width: "max-content", gap: "3rem", alignItems: "center", animation: "ds-partners-marq 22s linear infinite" }} className="ds-partners-marq">
        {loop.map((m, i) => isImg ? <img key={i} src={m} alt="" style={badgeS} /> : <span key={i} style={itemS}>{m}</span>)}
      </div>
    </section>
  );
};

/** 7) Each credential in a small bordered card. */
export const PartnersCards: React.FC<Props> = ({ content }) => {
  const marks = content.badges && content.badges.length ? content.badges : content.items;
  const isImg = !!(content.badges && content.badges.length);
  return (
    <section style={section}><Container>
      <div style={{ textAlign: "center", marginBottom: "1.6rem" }}><span style={labelS}>{content.label}</span></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
        {marks.map((m, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1rem 1.4rem", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "8rem", minHeight: "3.4rem" }}>
            {isImg ? <img src={m} alt="" style={badgeS} /> : <span style={itemS}>{m}</span>}
          </div>
        ))}
      </div>
    </Container></section>
  );
};

/** 8) Inverted dark band. */
export const PartnersDark: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "2rem" }}><Container>
    <div style={{ display: "flex", alignItems: "center", gap: "1.8rem", flexWrap: "wrap", justifyContent: "center" }}>
      <span style={{ ...labelS, color: "rgba(255,255,255,0.6)" }}>{content.label}</span><Marks content={content} light />
    </div>
  </Container></section>
);

/** 9) Label row, hairline, marks row. */
export const PartnersTwoRows: React.FC<Props> = ({ content }) => (
  <section style={band}><Container>
    <div style={{ textAlign: "center", paddingBottom: "1rem" }}><span style={labelS}>{content.label}</span></div>
    <div style={{ borderTop: "1px solid var(--ds-border)", paddingTop: "1.2rem", display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}><Marks content={content} /></div>
  </Container></section>
);

/** 10) Text credentials as bordered pills (logos if present). */
export const PartnersPills: React.FC<Props> = ({ content }) => (
  <section style={band}><Container>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
      <span style={labelS}>{content.label}</span>
      {content.badges && content.badges.length
        ? content.badges.map((src, i) => <img key={i} src={src} alt="" style={badgeS} />)
        : content.items.map((it, i) => <span key={i} style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.74rem", color: "var(--ds-text-muted)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-pill)", padding: "0.4rem 0.9rem", whiteSpace: "nowrap" }}>{it}</span>)}
    </div>
  </Container></section>
);

/** 11) Marks separated by vertical hairlines. */
export const PartnersDivided: React.FC<Props> = ({ content }) => {
  const marks = content.badges && content.badges.length ? content.badges : content.items;
  const isImg = !!(content.badges && content.badges.length);
  return (
    <section style={band}><Container>
      <div style={{ display: "flex", alignItems: "center", gap: "0", flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ ...labelS, paddingRight: "1.5rem" }}>{content.label}</span>
        {marks.map((m, i) => (
          <span key={i} style={{ padding: "0 1.5rem", borderLeft: "1px solid var(--ds-border)", display: "inline-flex", alignItems: "center" }}>
            {isImg ? <img src={m} alt="" style={badgeS} /> : <span style={itemS}>{m}</span>}
          </span>
        ))}
      </div>
    </Container></section>
  );
};

/** 12) Section header + centered marks grid. */
export const PartnersHeading: React.FC<Props> = ({ content }) => (
  <section style={section}><Container>
    <SectionHead eyebrow={content.label} heading="Zertifizierungen & Partner" center />
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.6rem 2.6rem", justifyContent: "center", alignItems: "center" }}><Marks content={content} badge={{ height: "2.6rem" }} /></div>
  </Container></section>
);

/** 13) Compact inline with bullet separators. */
export const PartnersInline: React.FC<Props> = ({ content }) => (
  <section style={{ ...band, paddingBlock: "1.3rem" }}><Container>
    <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap", justifyContent: "center" }}>
      <span style={labelS}>{content.label}</span>
      {content.badges && content.badges.length
        ? content.badges.map((src, i) => <img key={i} src={src} alt="" style={{ ...badgeS, height: "1.8rem" }} />)
        : content.items.map((it, i) => <React.Fragment key={i}>{i > 0 && <span style={{ color: "var(--ds-border)" }}>•</span>}<span style={itemS}>{it}</span></React.Fragment>)}
    </div>
  </Container></section>
);

/** 14) Larger logos, centered. */
export const PartnersBadgesLarge: React.FC<Props> = ({ content }) => (
  <section style={section}><Container>
    <div style={{ textAlign: "center", marginBottom: "1.6rem" }}><span style={labelS}>{content.label}</span></div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2.4rem 3rem", justifyContent: "center", alignItems: "center" }}>
      <Marks content={content} badge={{ height: "3.2rem", maxWidth: "12rem", opacity: 0.85 }} item={{ fontSize: "1.05rem" }} />
    </div>
  </Container></section>
);

/** 15) Heading left, marks grid right. */
export const PartnersSplit: React.FC<Props> = ({ content }) => (
  <section style={section}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "2.4rem", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <span style={labelS}>{content.label}</span>
        <h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.5rem", color: "var(--ds-text)", margin: 0 }}>Vertrauen, belegt.</h2>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.4rem 2rem", alignItems: "center" }}><Marks content={content} /></div>
    </div>
  </Container></section>
);

/** 16) Tinted soft band. */
export const PartnersTinted: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "2rem" }}><Container>
    <div style={{ display: "flex", alignItems: "center", gap: "1.8rem", flexWrap: "wrap", justifyContent: "center" }}>
      <span style={{ ...labelS, color: "var(--ds-primary-ink, var(--ds-primary))" }}>{content.label}</span><Marks content={content} />
    </div>
  </Container></section>
);

/** 17) Text credentials as a checkmark list grid (memberships). */
export const PartnersChecklist: React.FC<Props> = ({ content }) => (
  <section style={section}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <div style={{ textAlign: "center", marginBottom: "1.6rem" }}><span style={labelS}>{content.label}</span></div>
    {content.badges && content.badges.length
      ? <div style={{ display: "flex", flexWrap: "wrap", gap: "1.6rem 2.4rem", justifyContent: "center", alignItems: "center" }}><Marks content={content} /></div>
      : <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 2)}, minmax(0,1fr))`, gap: "0.8rem 2rem" }}>
          {content.items.map((it, i) => <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.92rem", color: "var(--ds-text)" }}><span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 700 }}><Icon name="check" size={15} style={{ verticalAlign: "-0.15em" }} /></span>{it}</div>)}
        </div>}
  </Container></section>
);

/** 18) Marks in fixed equal columns. */
export const PartnersColumns: React.FC<Props> = ({ content }) => {
  const marks = content.badges && content.badges.length ? content.badges : content.items;
  const isImg = !!(content.badges && content.badges.length);
  return (
    <section style={section}><Container>
      <div style={{ textAlign: "center", marginBottom: "1.4rem" }}><span style={labelS}>{content.label}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(marks.length, 5)}, minmax(0,1fr))`, gap: "1.6rem", alignItems: "center", justifyItems: "center" }}>
        {marks.map((m, i) => isImg ? <img key={i} src={m} alt="" style={badgeS} /> : <span key={i} style={{ ...itemS, textAlign: "center", whiteSpace: "normal" }}>{m}</span>)}
      </div>
    </Container></section>
  );
};

/** 19) Horizontal scroll rail. */
export const PartnersScroller: React.FC<Props> = ({ content }) => {
  const marks = content.badges && content.badges.length ? content.badges : content.items;
  const isImg = !!(content.badges && content.badges.length);
  return (
    <section style={band}><Container>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}><span style={labelS}>{content.label}</span></div>
      <div style={{ display: "flex", gap: "2.4rem", overflowX: "auto", alignItems: "center", paddingBottom: "0.4rem", scrollSnapType: "x proximity" }}>
        {marks.map((m, i) => <div key={i} style={{ flex: "0 0 auto", scrollSnapAlign: "start" }}>{isImg ? <img src={m} alt="" style={badgeS} /> : <span style={itemS}>{m}</span>}</div>)}
      </div>
    </Container></section>
  );
};

/** 20) Very quiet tiny mono items. */
export const PartnersMinimal: React.FC<Props> = ({ content }) => (
  <section style={{ ...band, paddingBlock: "1.2rem" }}><Container>
    <div style={{ display: "flex", alignItems: "center", gap: "1.4rem", flexWrap: "wrap", justifyContent: "center" }}>
      <span style={labelS}>{content.label}</span>
      {content.badges && content.badges.length
        ? content.badges.map((src, i) => <img key={i} src={src} alt="" style={{ ...badgeS, height: "1.6rem", opacity: 0.6 }} />)
        : content.items.map((it, i) => <span key={i} style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.68rem",   color: "var(--ds-text-muted)", whiteSpace: "nowrap" }}>{it}</span>)}
    </div>
  </Container></section>
);

/** 21) Bordered box containing centered marks. */
export const PartnersBoxed: React.FC<Props> = ({ content }) => (
  <section style={section}><Container>
    <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}>
      <span style={labelS}>{content.label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.6rem 2.4rem", justifyContent: "center", alignItems: "center" }}><Marks content={content} /></div>
    </div>
  </Container></section>
);

/** 22) Label as a small tag chip, marks beside it. */
export const PartnersTagLabel: React.FC<Props> = ({ content }) => (
  <section style={band}><Container>
    <div style={{ display: "flex", alignItems: "center", gap: "1.4rem", flexWrap: "wrap", justifyContent: "center" }}>
      <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.62rem",   color: "var(--ds-primary-ink, var(--ds-primary))", background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius-pill)", padding: "0.3rem 0.8rem" }}>{content.label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", flexWrap: "wrap" }}><Marks content={content} /></div>
    </div>
  </Container></section>
);
