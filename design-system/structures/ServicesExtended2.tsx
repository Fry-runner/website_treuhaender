/**
 * Services STRUCTURES — batch 2. Same ServicesContent + more/onPick; token-only.
 */
import React, { useState } from "react";
import { Container } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { ServicesContent } from "../content/types";

type Props = { content: ServicesContent; more?: MoreLink; onPick?: (title: string) => void };
const sectionBase: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const titleS: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.1rem", color: "var(--ds-text)", margin: 0 };
const bodyS: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0 };
const priceS: React.CSSProperties = { fontFamily: "var(--ds-font-mono)", fontSize: "0.78rem", color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 600 };

/** 1) Cards with a circular icon badge, centered. */
export const ServicesIconCards: React.FC<Props> = ({ content, more, onPick }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} center />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "1.2rem" }}>
        {content.items.map((s, i) => (
          <article key={i} className="ds-card" role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.8rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.7rem", cursor: onPick ? "pointer" : "default" }}>
            <div style={{ width: "3rem", height: "3rem", borderRadius: "9999px", background: "var(--ds-primary-soft)", color: "var(--ds-primary-ink, var(--ds-primary))", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={18} /></div>
            <h3 style={titleS}>{s.title}</h3>
            <p style={bodyS}>{s.summary}</p>
            {s.price && <span style={priceS}>{s.price}</span>}
          </article>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Full-width link rows with a trailing arrow. */
export const ServicesListArrow: React.FC<Props> = ({ content, more, onPick }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div>
        {content.items.map((s, i) => (
          <div key={i} className="ds-nudge" role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.4rem", alignItems: "center", padding: "1.3rem 0", borderTop: "1px solid var(--ds-border)", cursor: onPick ? "pointer" : "default" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}><h3 style={titleS}>{s.title}</h3><p style={bodyS}>{s.summary}</p></div>
            <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex" }}><Icon name="arrowRight" size={20} /></span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Four-column compact tiles. */
export const ServicesGrid4: React.FC<Props> = ({ content, more, onPick }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1rem" }}>
        {content.items.map((s, i) => (
          <article key={i} className="ds-card" role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.3rem", display: "flex", flexDirection: "column", gap: "0.5rem", cursor: onPick ? "pointer" : "default" }}>
            <h3 style={{ ...titleS, fontSize: "1rem" }}>{s.title}</h3>
            <p style={{ ...bodyS, fontSize: "0.85rem" }}>{s.summary}</p>
          </article>
        ))}
      </div>
    </Container>
  </section>
);

/** 4) Horizontal pill-tab selector + detail pane. */
export const ServicesPillTabs: React.FC<Props> = ({ content, more, onPick }) => {
  const [active, setActive] = useState(0);
  const sel = content.items[active] ?? content.items[0];
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} center />
        <div role="tablist" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.6rem", marginBottom: "1.6rem" }}>
          {content.items.map((s, i) => (
            <button key={i} role="tab" aria-selected={i === active} onClick={() => setActive(i)} style={{ border: "1px solid var(--ds-border)", cursor: "pointer", borderRadius: "9999px", padding: "0.55rem 1.1rem", fontFamily: "var(--ds-font-body)", fontSize: "0.72rem",   background: i === active ? "var(--ds-primary)" : "transparent", color: i === active ? "var(--ds-primary-fg)" : "var(--ds-text-muted)" }}>{s.title}</button>
          ))}
        </div>
        <div role="tabpanel" style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "2rem", display: "flex", flexDirection: "column", gap: "0.9rem", maxWidth: "640px", marginInline: "auto", textAlign: "center" }}>
          <h3 style={{ ...titleS, fontSize: "1.4rem" }}>{sel.title}</h3>
          <p style={{ ...bodyS, fontSize: "0.95rem" }}>{sel.body ?? sel.summary}</p>
          {onPick && <button className="ds-nudge" onClick={() => onPick(sel.title)} style={{ alignSelf: "center", background: "none", border: "none", cursor: "pointer", ...priceS, color: "var(--ds-text-muted)" }}>Mehr erfahren <Icon name="arrowRight" size={13} style={{ verticalAlign: "-0.1em" }} /></button>}
        </div>
      </Container>
    </section>
  );
};

/** 5) Horizontal numbered stepper with a connector line. */
export const ServicesStepper: React.FC<Props> = ({ content, more, onPick }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${content.items.length}, minmax(0,1fr))`, gap: "1.2rem" }}>
        <div aria-hidden style={{ position: "absolute", top: "0.85rem", left: "8%", right: "8%", height: "1px", background: "var(--ds-border)" }} />
        {content.items.map((s, i) => (
          <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.6rem", cursor: onPick ? "pointer" : "default" }}>
            <div style={{ width: "1.7rem", height: "1.7rem", borderRadius: "9999px", background: "var(--ds-primary)", color: "var(--ds-primary-fg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--ds-font-mono)", fontSize: "0.7rem", fontWeight: 700, border: "3px solid var(--ds-bg)" }}>{i + 1}</div>
            <h3 style={{ ...titleS, fontSize: "1rem" }}>{s.title}</h3>
            <p style={{ ...bodyS, fontSize: "0.85rem" }}>{s.summary}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Image-top tall media cards (emphasize the real service photo). */
export const ServicesMediaCards: React.FC<Props> = ({ content, more, onPick }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "1.2rem" }}>
        {content.items.map((s, i) => (
          <article key={i} className={s.image ? "ds-card ds-img-zoom" : "ds-card"} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", display: "flex", flexDirection: "column", cursor: onPick ? "pointer" : "default" }}>
            <div aria-hidden className={s.image ? "ds-zoom" : undefined} style={{ height: "11rem", ...(s.image ? { backgroundImage: `url("${s.image}")`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: "linear-gradient(135deg, var(--ds-primary-soft), var(--ds-surface))" }) }} />
            <div style={{ padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
              <h3 style={titleS}>{s.title}</h3>
              <p style={{ ...bodyS, flex: 1 }}>{s.summary}</p>
              {s.price && <span style={priceS}>{s.price}</span>}
            </div>
          </article>
        ))}
      </div>
    </Container>
  </section>
);

/** 7) Plain bordered cards. */
export const ServicesWatermark: React.FC<Props> = ({ content, more, onPick }) => {
  const cols = Math.min(content.items.length, 3);
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: "1.2rem" }}>
          {content.items.map((s, i) => (
            <article key={i} className="ds-card" role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "0.6rem", cursor: onPick ? "pointer" : "default" }}>
              <h3 style={titleS}>{s.title}</h3>
              <p style={bodyS}>{s.summary}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 8) Two-column compact rows. */
export const ServicesTwoColRows: React.FC<Props> = ({ content, more, onPick }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "0 2.4rem" }}>
        {content.items.map((s, i) => (
          <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ padding: "1.1rem 0", borderTop: "1px solid var(--ds-border)", cursor: onPick ? "pointer" : "default" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}><h3 style={{ ...titleS, fontSize: "1.02rem" }}>{s.title}</h3><p style={{ ...bodyS, fontSize: "0.85rem" }}>{s.summary}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 9) Single tinted band, services as a checklist grid. */
export const ServicesBannerList: React.FC<Props> = ({ content, more, onPick }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "0.9rem 2rem" }}>
        {content.items.map((s, i) => (
          <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.8rem", alignItems: "start", cursor: onPick ? "pointer" : "default" }}>
            <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3 }}><Icon name="check" size={16} /></span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}><h3 style={{ ...titleS, fontSize: "1.02rem" }}>{s.title}</h3><p style={{ ...bodyS, fontSize: "0.85rem" }}>{s.summary}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 10) Striped alternating-background rows. */
export const ServicesZebra: React.FC<Props> = ({ content, more, onPick }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 900px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
        {content.items.map((s, i) => (
          <div key={i} role={onPick ? "button" : undefined} tabIndex={onPick ? 0 : undefined} onClick={onPick ? () => onPick(s.title) : undefined} onKeyDown={onPick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.title); } } : undefined} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.2rem", alignItems: "center", padding: "1.2rem 1.5rem", background: i % 2 ? "var(--ds-surface)" : "var(--ds-bg)", cursor: onPick ? "pointer" : "default" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}><h3 style={{ ...titleS, fontSize: "1.05rem" }}>{s.title}</h3><p style={{ ...bodyS, fontSize: "0.85rem" }}>{s.summary}</p></div>
            {s.price && <span style={priceS}>{s.price}</span>}
          </div>
        ))}
      </div>
    </Container>
  </section>
);
