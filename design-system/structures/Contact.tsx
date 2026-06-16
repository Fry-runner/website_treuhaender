import React from "react";
import { Container, Button } from "./primitives";
import { SectionHead } from "./SectionHead";
import type { ContactContent } from "../content/types";

const field: React.CSSProperties = {
  width: "100%", padding: "0.75rem 0.9rem", borderRadius: "var(--ds-radius)",
  border: "1px solid var(--ds-border)", background: "var(--ds-bg)", color: "var(--ds-text)",
  fontFamily: "var(--ds-font-body)", fontSize: "0.92rem",
};
const label: React.CSSProperties = {
  fontFamily: "var(--ds-font-mono)", fontSize: "0.68rem", textTransform: "uppercase",
  letterSpacing: "0.08em", color: "var(--ds-text-muted)", marginBottom: "0.35rem", display: "block",
};

/** Contact: form (left) + office info card (right). */
export const Contact: React.FC<{ content: ContactContent }> = ({ content }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><label style={label}>Name *</label><input style={field} /></div>
            <div><label style={label}>E-Mail *</label><input style={field} type="email" /></div>
          </div>
          <div><label style={label}>Nachricht *</label><textarea style={{ ...field, minHeight: "7rem", resize: "vertical" }} /></div>
          <div><Button variant="primary">{content.formCta}</Button></div>
        </form>
        <aside style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {content.info.address && <InfoRow label="Adresse" value={content.info.address} />}
          {content.info.phone && <InfoRow label="Telefon" value={content.info.phone} />}
          {content.info.email && <InfoRow label="E-Mail" value={content.info.email} />}
          {content.info.hours && <InfoRow label="Öffnungszeiten" value={content.info.hours} />}
        </aside>
      </div>
    </Container>
  </section>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label: l, value }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
    <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-text-muted)" }}>{l}</span>
    <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", color: "var(--ds-text)" }}>{value}</span>
  </div>
);
