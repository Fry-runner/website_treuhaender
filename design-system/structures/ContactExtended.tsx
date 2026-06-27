/**
 * Twenty-one additional Contact STRUCTURES. Content = ContactContent
 * ({ eyebrow, heading, info{address?,phone?,email?,hours?}, formCta }). Token-only.
 * All forms are inert (onSubmit prevented) — the same contract as the base Contact.
 */
import React from "react";
import { Container, Button, InvertedTone } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead } from "./SectionHead";
import type { ContactContent, ContactInfo } from "../content/types";

type Props = { content: ContactContent };
const sectionBase: React.CSSProperties = { background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const fieldFor = (light?: boolean): React.CSSProperties => ({
  width: "100%", padding: "0.85rem 1rem", minHeight: "2.75rem", borderRadius: "var(--ds-radius)",
  border: light ? "1px solid rgba(255,255,255,0.45)" : "1px solid var(--ds-border)",
  background: light ? "rgba(255,255,255,0.10)" : "var(--ds-bg)", color: light ? "var(--ds-bg)" : "var(--ds-text)",
  fontFamily: "var(--ds-font-body)", fontSize: "0.95rem",
});
const labelFor = (light?: boolean): React.CSSProperties => ({
  fontFamily: "var(--ds-font-body)", fontSize: "0.82rem", fontWeight: 600,
  color: light ? "rgba(255,255,255,0.9)" : "var(--ds-text)", marginBottom: "0.4rem", display: "block" });

const Req = () => <span aria-hidden="true"> *</span>;

const Form: React.FC<{ cta: string; light?: boolean }> = ({ cta, light }) => {
  const id = React.useId();
  return (
  <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
      <div><label style={labelFor(light)} htmlFor={`${id}-name`}>Name<Req /></label><input id={`${id}-name`} name="name" type="text" autoComplete="name" required style={fieldFor(light)} /></div>
      <div><label style={labelFor(light)} htmlFor={`${id}-email`}>E-Mail<Req /></label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required style={fieldFor(light)} /></div>
    </div>
    <div><label style={labelFor(light)} htmlFor={`${id}-msg`}>Nachricht<Req /></label><textarea id={`${id}-msg`} name="message" required style={{ ...fieldFor(light), minHeight: "7rem", resize: "vertical" }} /></div>
    {/* `light` ⇒ the form sits on a dark (--ds-text) ground → InvertedTone keeps the submit
        button legible and in the firm's silhouette, like every other dark-ground CTA. */}
    <div>{light
      ? <InvertedTone><Button variant="primary" type="submit">{cta}</Button></InvertedTone>
      : <Button variant="primary" type="submit">{cta}</Button>}</div>
  </form>
  );
};

const infoRows = (info: ContactInfo): { l: string; v: string }[] => [
  info.address && { l: "Adresse", v: info.address },
  info.phone && { l: "Telefon", v: info.phone },
  info.email && { l: "E-Mail", v: info.email },
  info.hours && { l: "Öffnungszeiten", v: info.hours },
].filter(Boolean) as { l: string; v: string }[];

const InfoList: React.FC<{ info: ContactInfo; light?: boolean }> = ({ info, light }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
    {infoRows(info).map((r, i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.66rem",   color: light ? "rgba(255,255,255,0.6)" : "var(--ds-text-muted)" }}>{r.l}</span>
        <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", color: light ? "var(--ds-bg)" : "var(--ds-text)" }}>{r.v}</span>
      </div>
    ))}
  </div>
);

/** 1) Form on top, info as a row beneath. */
export const ContactStacked: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <Form cta={content.formCta} />
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.6rem 3rem", marginTop: "2rem", paddingTop: "1.6rem", borderTop: "1px solid var(--ds-border)" }}><InfoList info={content.info} /></div>
  </Container></section>
);

/** 2) Info card left, form right (mirror of the base). */
export const ContactInfoLeft: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "2rem", alignItems: "start" }}>
      <aside style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem" }}><InfoList info={content.info} /></aside>
      <Form cta={content.formCta} />
    </div>
  </Container></section>
);

/** 3) Info chips above a card-wrapped form. */
export const ContactCardForm: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.05rem", justifyContent: "center", marginBottom: "1.6rem" }}>
      {infoRows(content.info).map((r, i) => <span key={i} style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.74rem", color: "var(--ds-text-muted)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-pill)", padding: "0.4rem 0.9rem" }}>{r.v}</span>)}
    </div>
    <div style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.9rem" }}><Form cta={content.formCta} /></div>
  </Container></section>
);

/** 4) Dark info panel left, form right. */
export const ContactSplitDark: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "0", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
      <div style={{ background: "var(--ds-text)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.65rem" }}>
        <div><h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.6rem", color: "var(--ds-bg)", margin: 0 }}>{content.heading}</h2></div>
        <InfoList info={content.info} light />
      </div>
      <div style={{ background: "var(--ds-bg)", padding: "2rem" }}><Form cta={content.formCta} /></div>
    </div>
  </Container></section>
);

/** 5) Borderless minimal — form with a single quiet info line. */
export const ContactMinimal: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 680px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <Form cta={content.formCta} />
    <p style={{ textAlign: "center", marginTop: "1.4rem", fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", color: "var(--ds-text-muted)" }}>
      {infoRows(content.info).map((r) => r.v).join("  ·  ")}
    </p>
  </Container></section>
);

/** 6) Everything inside one bordered box. */
export const ContactBoxed: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "2.2rem" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>
        <Form cta={content.formCta} />
        <InfoList info={content.info} />
      </div>
    </div>
  </Container></section>
);

/** 7) Centered narrow form, info centered below. */
export const ContactCentered: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 640px)" }}>
    <div style={{ textAlign: "center", marginBottom: "1.8rem", display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "center" }}>
      <h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "var(--ds-display-h2, 2rem)", color: "var(--ds-text)", margin: 0 }}>{content.heading}</h2>
    </div>
    <Form cta={content.formCta} />
    <div style={{ display: "flex", gap: "1.4rem 2.4rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1.6rem" }}><InfoList info={content.info} /></div>
  </Container></section>
);

/** 8) Info as a card grid, form beneath. */
export const ContactInfoGrid: React.FC<Props> = ({ content }) => {
  const rows = infoRows(content.info);
  return (
    <section style={sectionBase}><Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(rows.length, 4)}, minmax(0,1fr))`, gap: "1.25rem", marginBottom: "2rem" }}>
        {rows.map((r, i) => <div key={i} style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.3rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}><span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.64rem",   color: "var(--ds-text-muted)" }}>{r.l}</span><span style={{ fontSize: "0.9rem", color: "var(--ds-text)" }}>{r.v}</span></div>)}
      </div>
      <div style={{ maxWidth: "680px", marginInline: "auto" }}><Form cta={content.formCta} /></div>
    </Container></section>
  );
};

/** 9) Compact: form left, small info aside. */
export const ContactCompact: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "calc(var(--ds-section-y) * 0.7)" }}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.8fr) minmax(0,1fr)", gap: "2rem", alignItems: "center" }}>
      <div><h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.5rem", color: "var(--ds-text)", margin: "0 0 1rem" }}>{content.heading}</h2><Form cta={content.formCta} /></div>
      <InfoList info={content.info} />
    </div>
  </Container></section>
);

/** 10) Tinted soft panel. */
export const ContactTinted: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "var(--ds-section-y)" }}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>
      <div style={{ background: "var(--ds-bg)", borderRadius: "var(--ds-radius)", padding: "1.8rem" }}><Form cta={content.formCta} /></div>
      <InfoList info={content.info} />
    </div>
  </Container></section>
);

/** 11) Oversized heading left, form right. */
export const ContactBigHeading: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)", gap: "2.4rem", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.45rem" }}>
        <h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "var(--ds-display)", lineHeight: 1.05, color: "var(--ds-text)", margin: 0 }}>{content.heading}</h2>
        <InfoList info={content.info} />
      </div>
      <Form cta={content.formCta} />
    </div>
  </Container></section>
);

/** 12) Info cards across the top, form beneath. */
export const ContactInfoCards: React.FC<Props> = ({ content }) => {
  const rows = infoRows(content.info);
  return (
    <section style={sectionBase}><Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(rows.length, 4)}, minmax(0,1fr))`, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", marginBottom: "2rem" }}>
        {rows.map((r, i) => <div key={i} style={{ borderLeft: i ? "1px solid var(--ds-border)" : "none", padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}><span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.64rem",   color: "var(--ds-text-muted)" }}>{r.l}</span><span style={{ fontSize: "0.9rem", color: "var(--ds-text)" }}>{r.v}</span></div>)}
      </div>
      <Form cta={content.formCta} />
    </Container></section>
  );
};

/** 13) Inverted dark section with a light form. */
export const ContactDarkForm: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-text)", paddingBlock: "var(--ds-section-y)" }}><Container>
    <div style={{ marginBottom: "1.8rem" }}><h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "var(--ds-display-h2, 2rem)", color: "var(--ds-bg)", margin: 0 }}>{content.heading}</h2></div>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>
      <Form cta={content.formCta} light />
      <InfoList info={content.info} light />
    </div>
  </Container></section>
);

/** 14) Equal two columns, both bordered. */
export const ContactTwoCol: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "1.65rem", alignItems: "start" }}>
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem" }}><Form cta={content.formCta} /></div>
      <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem", background: "var(--ds-bg)" }}><InfoList info={content.info} /></div>
    </div>
  </Container></section>
);

/** 15) Info as a horizontal chip rail, full-width form below. */
export const ContactRail: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "flex", gap: "1.25rem", overflowX: "auto", paddingBottom: "0.6rem", marginBottom: "1.6rem" }}>
      {infoRows(content.info).map((r, i) => <div key={i} style={{ flex: "0 0 auto", background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "0.9rem 1.2rem", display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: "10rem" }}><span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.62rem",  color: "var(--ds-text-muted)" }}>{r.l}</span><span style={{ fontSize: "0.88rem", color: "var(--ds-text)" }}>{r.v}</span></div>)}
    </div>
    <Form cta={content.formCta} />
  </Container></section>
);

/** 16) Form in an elevated floating card, centered. */
export const ContactFloatingCard: React.FC<Props> = ({ content }) => (
  <section style={{ background: "var(--ds-primary-soft)", paddingBlock: "var(--ds-section-y)" }}><Container style={{ maxWidth: "min(var(--ds-container), 700px)" }}>
    <div style={{ background: "var(--ds-bg)", borderRadius: "1rem", boxShadow: "0 24px 60px -24px rgba(0,0,0,0.35)", padding: "2.2rem" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
      <Form cta={content.formCta} />
      <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "0.85rem", color: "var(--ds-text-muted)" }}>{infoRows(content.info).map((r) => r.v).join("  ·  ")}</p>
    </div>
  </Container></section>
);

/** 17) Top accent rule over the form. */
export const ContactTopRule: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <div style={{ borderTop: "3px solid var(--ds-primary)", paddingTop: "1.6rem" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>
        <Form cta={content.formCta} /><InfoList info={content.info} />
      </div>
    </div>
  </Container></section>
);

/** 18) Address-forward location block + info, form beside. */
export const ContactLocation: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "2rem", alignItems: "stretch" }}>
      <div style={{ background: "var(--ds-primary-soft)", borderRadius: "var(--ds-radius)", padding: "1.8rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.6rem" }}>
        <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.66rem",   color: "var(--ds-primary-ink, var(--ds-primary))" }}>Standort</span>
        <span style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.2rem", color: "var(--ds-text)", lineHeight: 1.4 }}>{content.info.address ?? "—"}</span>
        <InfoList info={{ phone: content.info.phone, email: content.info.email, hours: content.info.hours }} />
      </div>
      <div style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.8rem" }}><Form cta={content.formCta} /></div>
    </div>
  </Container></section>
);

/** 19) Big phone/email quick-action buttons + compact form. */
export const ContactQuickActions: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
    <SectionHead eyebrow={content.eyebrow} heading={content.heading} center />
    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.8rem" }}>
      {content.info.phone && <a href={`tel:${content.info.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", textDecoration: "none", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "0.9rem 1.4rem", color: "var(--ds-text)", fontFamily: "var(--ds-font-body)", fontSize: "0.92rem" }}><span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex" }}><Icon name="phone" size={16} /></span>{content.info.phone}</a>}
      {content.info.email && <a href={`mailto:${content.info.email}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", textDecoration: "none", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "0.9rem 1.4rem", color: "var(--ds-text)", fontFamily: "var(--ds-font-body)", fontSize: "0.92rem" }}><span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex" }}><Icon name="mail" size={16} /></span>{content.info.email}</a>}
    </div>
    <Form cta={content.formCta} />
  </Container></section>
);

/** 20) One-line inline form (email + button) + info row. */
export const ContactInlineForm: React.FC<Props> = ({ content }) => (
  <section style={{ ...sectionBase, paddingBlock: "calc(var(--ds-section-y) * 0.8)" }}><Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
    <div style={{ textAlign: "center", marginBottom: "1.4rem" }}><h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "1.7rem", color: "var(--ds-text)", margin: 0 }}>{content.heading}</h2></div>
    <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", gap: "1.05rem", flexWrap: "wrap", justifyContent: "center" }}>
      <label htmlFor="inline-contact-email" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }}>Ihre E-Mail-Adresse</label>
      <input id="inline-contact-email" name="email" type="email" autoComplete="email" required placeholder="Ihre E-Mail" style={{ ...fieldFor(), width: "auto", flex: "1 1 16rem" }} />
      <Button variant="primary" type="submit">{content.formCta}</Button>
    </form>
    <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "0.85rem", color: "var(--ds-text-muted)" }}>{infoRows(content.info).map((r) => r.v).join("  ·  ")}</p>
  </Container></section>
);

/** 21) Heading, info row, then full form (vertical flow). */
export const ContactHeadingInfoForm: React.FC<Props> = ({ content }) => (
  <section style={sectionBase}><Container style={{ maxWidth: "min(var(--ds-container), 800px)" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.4rem" }}>
      <h2 style={{ fontFamily: "var(--ds-font-heading)", fontSize: "var(--ds-display-h2, 2rem)", color: "var(--ds-text)", margin: 0 }}>{content.heading}</h2>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem 2.4rem", padding: "1.2rem 0", borderBlock: "1px solid var(--ds-border)", marginBottom: "1.6rem" }}><InfoList info={content.info} /></div>
    <Form cta={content.formCta} />
  </Container></section>
);
