import React from "react";
import { Container, Lede } from "./primitives";

/** A single service's deep content: lead + prose, with an "included" checklist aside. */
export const ServiceBody: React.FC<{ title: string; summary: string; bullets: string[] }> = ({ title, summary, bullets }) => (
  <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: "3rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <Lede style={{ maxWidth: "60ch", fontSize: "1.2rem", color: "var(--ds-text)" }}>{summary}</Lede>
          <p style={{ fontFamily: "var(--ds-font-body)", lineHeight: 1.7, color: "var(--ds-text-muted)", margin: 0, maxWidth: "60ch" }}>
            Wir übernehmen {title.toLowerCase()} vollständig und termingerecht – digital, transparent und persönlich
            betreut. So behalten Sie jederzeit den Überblick über Ihre Zahlen und gewinnen Zeit für Ihr Kerngeschäft.
          </p>
        </div>
        <aside style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ds-text-muted)" }}>Inklusive</div>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: "0.6rem", fontSize: "0.92rem", color: "var(--ds-text)" }}>
              <span style={{ color: "var(--ds-primary)", fontWeight: 700 }}>✓</span> {b}
            </div>
          ))}
        </aside>
      </div>
    </Container>
  </section>
);
