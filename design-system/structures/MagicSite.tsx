/**
 * MagicSite — variants whose LAYOUT idea came from the 21st.dev component library,
 * rewritten TOKEN-ONLY and — crucially — SUBORDINATED to this site's design language:
 * the library's decorative "SaaS tells" (masked dotted grids, decorative offset cards,
 * floating overlay chips) were removed, so each section reads as the SAME restrained,
 * trustworthy family as the native inventory sections — not a foreign visual vocabulary.
 * Every colour/space/radius/shadow/font is `var(--ds-*)`; buttons use <Button> (per-firm
 * style), glyphs use <Icon>, dark grounds wrap CTAs in <InvertedTone>. See PORTING.md.
 */
import React from "react";
import { Container, Eyebrow, Heading, Accent, Lede, Button, InvertedTone } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead } from "./SectionHead";
import type { HeroContent } from "./HeroSplit";
import type { ServicesContent, ProcessContent, AboutContent, StatsContent, CtaContent, FeatureContent } from "../content/types";

/* ============================== HERO ==============================
 * Idea: 21st.dev "FinancialHero" (text-left + media right). De-gimmicked: the rotated
 * overlapping cards are gone; a single clean framed image sits right (restrained,
 * editorial), with the real credential/quote card as the no-photo fallback. */
export const HeroStackedCards: React.FC<{ content: HeroContent }> = ({ content }) => {
  const hasImg = !!content.image;
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "3rem", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem", maxWidth: "56ch" }}>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <Heading>
              {content.titleLead} <Accent>{content.titleAccent}</Accent>
              {content.titleTail ? <> {content.titleTail}</> : null}
            </Heading>
            <Lede>{content.lede}</Lede>
            <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
              <Button variant="primary">{content.primaryCta}</Button>
              <Button variant="outline">{content.secondaryCta}</Button>
            </div>
          </div>
          <div style={{
            minHeight: "340px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)",
            boxShadow: "var(--ds-shadow-card)", overflow: "hidden",
            ...(hasImg
              ? { backgroundImage: `url("${content.image}")`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: "var(--ds-surface)" }),
          }}>
            {!hasImg && (
              <div style={{ padding: "1.8rem", display: "flex", flexDirection: "column", gap: "0.9rem", height: "100%", justifyContent: "center" }}>
                <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.66rem", color: "var(--ds-text-muted)" }}>{content.asideLabel}</div>
                <p style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.15rem", lineHeight: 1.4, color: "var(--ds-text)", margin: 0, fontStyle: "italic" }}>“{content.asideQuote}”</p>
                <div style={{ height: "2px", width: "2.5rem", background: "var(--ds-primary)" }} />
                <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", color: "var(--ds-text-muted)" }}>{content.asideAttribution}</div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

/* ============================ SERVICES ============================
 * Idea: 21st.dev "Features" card grid. De-gimmicked: the masked dotted-grid behind the
 * icon is gone. A quiet per-service MONOGRAM in a hairline square badge, left-aligned
 * "spec-sheet" cards — same restrained family as the native services variants. */
export const ServicesCardDecorator: React.FC<{ content: ServicesContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "1.2rem", marginTop: "var(--ds-space-block, 2rem)" }}>
        {content.items.map((s, i) => (
          <article key={i} className="ds-card" style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.7rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <div aria-hidden style={{ width: "2.7rem", height: "2.7rem", display: "grid", placeItems: "center", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", color: "var(--ds-primary-ink, var(--ds-primary))", fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.05rem" }}>
              {(s.title.trim()[0] || "•").toUpperCase()}
            </div>
            <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0, maxWidth: "42ch" }}>{s.summary}</p>
          </article>
        ))}
      </div>
    </Container>
  </section>
);

/* ============================= FEATURE =============================
 * Idea: 21st.dev image + value-prop. De-gimmicked: the floating overlay chip is gone
 * (eyebrows are off site-wide anyway). A clean text-left / framed-image-right band with
 * a two-column bullet grid — the same family as the native feature variants. needsImage. */
export const FeatureFloatingBadge: React.FC<{ content: FeatureContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "2.6rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "var(--ds-display-h2, 1.9rem)", lineHeight: 1.15, color: "var(--ds-text)", margin: 0 }}>{content.heading}</h2>
          <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--ds-text-muted)", margin: 0, maxWidth: "60ch" }}>{content.body}</p>
          {content.bullets?.length ? (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px,1fr))", gap: "0.55rem 1.4rem" }}>
              {content.bullets.map((b, i) => (
                <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.92rem", lineHeight: 1.45, color: "var(--ds-text)" }}>
                  <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", marginTop: "0.15rem" }}><Icon name="check" size={15} /></span>{b}
                </li>
              ))}
            </ul>
          ) : null}
          {content.cta && <div style={{ marginTop: "0.3rem" }}><Button variant="primary" to={content.cta.href}>{content.cta.label}</Button></div>}
        </div>
        <div style={{ minHeight: "360px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", boxShadow: "var(--ds-shadow-card)", backgroundImage: `url("${content.image}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>
    </Container>
  </section>
);

/* ============================= PROCESS =============================
 * Idea: numbered step cards (already a native pattern — restrained, kept as is). */
export const ProcessBadgeSteps: React.FC<{ content: ProcessContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "1.2rem", marginTop: "var(--ds-space-block, 2rem)" }}>
        {content.steps.map((s, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <div aria-hidden style={{ width: "2.6rem", height: "2.6rem", borderRadius: "9999px", background: "var(--ds-primary-soft)", color: "var(--ds-primary-ink, var(--ds-primary))", display: "grid", placeItems: "center", fontFamily: "var(--ds-font-mono)", fontWeight: 700, fontSize: "0.95rem" }}>{String(i + 1).padStart(2, "0")}</div>
            <h3 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)", margin: 0 }}>{s.title}</h3>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ds-text-muted)", margin: 0, maxWidth: "42ch" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/* ============================== ABOUT ==============================
 * Idea: split-with-highlights. Prose left (capped to a readable measure), a hairline
 * highlights panel right only when real highlights exist — restrained, native-family. */
export const AboutSplitHighlights: React.FC<{ content: AboutContent }> = ({ content }) => {
  const hl = content.highlights ?? [];
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: hl.length ? "minmax(0,1.5fr) minmax(0,1fr)" : "minmax(0,1fr)", gap: "2.6rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "62ch" }}>
            {content.heading ? <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "var(--ds-display-h2, 1.9rem)", lineHeight: 1.15, color: "var(--ds-text)", margin: 0 }}>{content.heading}</h2> : null}
            {content.lead ? <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1.075rem", lineHeight: 1.6, color: "var(--ds-text)", margin: 0 }}>{content.lead}</p> : null}
            {content.paragraphs.map((p, i) => <p key={i} style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.96rem", lineHeight: 1.6, color: "var(--ds-text-muted)", margin: 0 }}>{p}</p>)}
          </div>
          {hl.length > 0 && (
            <aside style={{ display: "grid", gridTemplateColumns: hl.length > 1 ? "1fr 1fr" : "1fr", gap: "1px", background: "var(--ds-border)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
              {hl.map((h, i) => (
                <div key={i} style={{ background: "var(--ds-surface)", padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <span style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.6rem", color: "var(--ds-primary-ink, var(--ds-primary))" }}>{h.value}</span>
                  <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.82rem", color: "var(--ds-text-muted)" }}>{h.label}</span>
                </div>
              ))}
            </aside>
          )}
        </div>
      </Container>
    </section>
  );
};

/* =============================== STATS ==============================
 * Idea: figure cards. De-gimmicked: the masked grid is gone — clean hairline cells with
 * big primary numerals, the same family as the native stats variants. */
export const StatsDecoratorGrid: React.FC<{ content: StatsContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px,1fr))", gap: "1.2rem" }}>
        {content.items.map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "1.9rem 1rem", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", background: "var(--ds-bg)" }}>
            <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "2.4rem", lineHeight: 1, color: "var(--ds-primary-ink, var(--ds-primary))" }}>{s.value}</div>
            <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", color: "var(--ds-text-muted)", marginTop: "0.5rem" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/* =============================== CTA ===============================
 * Idea: centered CTA panel. De-gimmicked: the masked grid is gone — a clean inverted
 * panel (paints --ds-text), CTA wrapped in <InvertedTone> for legibility. Native-family
 * (like cta/panel-dark); the light-site suppression treats it as the inverted variant it is. */
export const CtaMaskedPanel: React.FC<{ content: CtaContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)" }}>
    <Container>
      <div style={{ borderRadius: "var(--ds-radius)", background: "var(--ds-text)", padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <h2 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "var(--ds-display-h2, 2rem)", color: "var(--ds-bg)", margin: 0 }}>{content.heading}</h2>
        <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "1.05rem", lineHeight: 1.55, color: "var(--ds-bg)", opacity: 0.82, margin: 0, maxWidth: "52ch" }}>{content.sub}</p>
        <div style={{ marginTop: "0.5rem" }}><InvertedTone><Button variant="primary">{content.button}</Button></InvertedTone></div>
      </div>
    </Container>
  </section>
);
