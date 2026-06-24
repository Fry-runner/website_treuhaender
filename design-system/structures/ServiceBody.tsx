import React from "react";
import { Container, Lede } from "./primitives";
import { Icon } from "../icons/iconSets";

const hash = (s: string): number => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h | 0); };

/** A single service's deep content: lead + (optional) prose, with an "included"
 *  checklist when real bullets exist. `body`/`bullets` are passed ONLY when they are
 *  genuine, per-service material. THREE per-service layouts (by hash(title)) so the
 *  service-detail body no longer reads identical on every page:
 *    0 aside       — prose left + "Inklusive" card aside (the classic)
 *    1 stacked     — lead + prose full width, bullets as a check-grid below
 *    2 split-image — photo column + content column (falls back to stacked w/o image) */
export const ServiceBody: React.FC<{ title: string; summary: string; bullets: string[]; body?: string; image?: string }> = ({ title, summary, bullets, body, image }) => {
  const hasAside = bullets.length > 0;
  const v = hash(title || "x") % 3;

  const lead = <Lede style={{ maxWidth: "60ch", fontSize: "1.2rem", color: "var(--ds-text)" }}>{summary}</Lede>;
  const prose = body ? <p style={{ fontFamily: "var(--ds-font-body)", lineHeight: 1.7, color: "var(--ds-text-muted)", margin: 0, maxWidth: "60ch" }}>{body}</p> : null;
  const checkItem = (b: string, i: number) => (
    <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.92rem", color: "var(--ds-text)" }}>
      <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", marginTop: "0.1rem", flexShrink: 0 }}><Icon name="check" size={16} /></span> {b}
    </div>
  );
  const asideCard = (
    <aside style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.68rem", color: "var(--ds-text-muted)" }}>Inklusive</div>
      {bullets.map(checkItem)}
    </aside>
  );
  const sectionStyle: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
  const imgBand = image ? <div aria-hidden style={{ height: "16rem", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", marginBottom: "2rem", backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center" }} /> : null;

  // ── 1 · STACKED (lead + prose full width, bullets as a check-grid) ──
  if (v === 1) {
    return (
      <section style={sectionStyle}>
        <Container>
          {imgBand}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem", maxWidth: "70ch" }}>{lead}{prose}</div>
          {hasAside && (
            <div style={{ marginTop: "2rem", paddingTop: "1.6rem", borderTop: "1px solid var(--ds-border)" }}>
              <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.68rem", color: "var(--ds-text-muted)", marginBottom: "1rem" }}>Inklusive</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem 1.6rem" }}>{bullets.map(checkItem)}</div>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ── 2 · SPLIT-IMAGE (photo column + content) — needs an image, else stacked ──
  if (v === 2 && image) {
    return (
      <section style={sectionStyle}>
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)", gap: "2.8rem", alignItems: "start" }}>
            <div aria-hidden style={{ minHeight: "20rem", height: "100%", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {lead}{prose}
              {hasAside && (
                <div style={{ marginTop: "0.4rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.68rem", color: "var(--ds-text-muted)" }}>Inklusive</div>
                  {bullets.map(checkItem)}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // ── 0 · ASIDE (classic, default) ──
  return (
    <section style={sectionStyle}>
      <Container>
        {imgBand}
        <div style={{ display: "grid", gridTemplateColumns: hasAside ? "minmax(0,1.6fr) minmax(0,1fr)" : "minmax(0, 68ch)", gap: "3rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>{lead}{prose}</div>
          {hasAside && asideCard}
        </div>
      </Container>
    </section>
  );
};
