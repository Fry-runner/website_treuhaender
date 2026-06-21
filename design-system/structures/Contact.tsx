import React from "react";
import { Container, Button } from "./primitives";
import { Icon, type IconName } from "../icons/iconSets";
import { SectionHead } from "./SectionHead";
import type { ContactContent } from "../content/types";

const field: React.CSSProperties = {
  width: "100%", padding: "0.85rem 1rem", minHeight: "2.75rem", borderRadius: "var(--ds-radius)",
  border: "1px solid var(--ds-border)", background: "var(--ds-bg)", color: "var(--ds-text)",
  fontFamily: "var(--ds-font-body)", fontSize: "0.95rem",
};
const label: React.CSSProperties = {
  fontFamily: "var(--ds-font-body)", fontSize: "0.82rem", fontWeight: 600,
  color: "var(--ds-text)", marginBottom: "0.4rem", display: "block" };

/** Contact: form (left) + office info card (right). With `infoOnly`, the form is
 *  dropped and the info card spans the full width (contact = info-only). */
export const Contact: React.FC<{ content: ContactContent; infoOnly?: boolean }> = ({ content, infoOnly }) => {
  const id = React.useId();
  return (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: infoOnly ? "minmax(0,1fr)" : "minmax(0,1.6fr) minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>
        {!infoOnly && (
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><label style={label} htmlFor={`${id}-name`}>Name <span aria-hidden="true">*</span></label><input id={`${id}-name`} name="name" type="text" autoComplete="name" required style={field} /></div>
            <div><label style={label} htmlFor={`${id}-email`}>E-Mail <span aria-hidden="true">*</span></label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required style={field} /></div>
          </div>
          <div><label style={label} htmlFor={`${id}-msg`}>Nachricht <span aria-hidden="true">*</span></label><textarea id={`${id}-msg`} name="message" required style={{ ...field, minHeight: "7rem", resize: "vertical" }} /></div>
          <div><Button variant="primary" type="submit">{content.formCta}</Button></div>
        </form>
        )}
        <aside style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {content.info.address && <InfoRow icon="location" label="Adresse" value={content.info.address} />}
          {content.info.phone && <InfoRow icon="phone" label="Telefon" value={content.info.phone} />}
          {content.info.email && <InfoRow icon="mail" label="E-Mail" value={content.info.email} />}
          {content.info.hours && <InfoRow icon="clock" label="Öffnungszeiten" value={content.info.hours} />}
        </aside>
      </div>
    </Container>
  </section>
  );
};

const InfoRow: React.FC<{ icon: IconName; label: string; value: string }> = ({ icon, label: l, value }) => {
  const valueStyle: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", color: "var(--ds-text)" };
  const href = icon === "phone" ? `tel:${value.replace(/[^\d+]/g, "")}`
    : icon === "mail" ? `mailto:${value.trim()}` : undefined;
  return (
  <div style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
    <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", marginTop: "0.15rem", display: "inline-flex" }}><Icon name={icon} size={18} /></span>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
      <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.66rem", color: "var(--ds-text-muted)" }}>{l}</span>
      {href
        ? <a href={href} style={{ ...valueStyle, textDecoration: "none" }}>{value}</a>
        : <span style={valueStyle}>{value}</span>}
    </div>
  </div>
  );
};
