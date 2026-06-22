import React from "react";
import { Container, Lede } from "./primitives";
import { Icon } from "../icons/iconSets";

/** A single service's deep content: lead + (optional) prose, with an "included"
 *  checklist aside when real bullets exist. `body`/`bullets` are passed ONLY when they
 *  are genuine, per-service material — the composer drops generic copy shared across
 *  services, so a detail page never repeats the same filler paragraph on every service.
 *  With neither, the real per-service summary stands on its own (honest, not padded). */
export const ServiceBody: React.FC<{ title: string; summary: string; bullets: string[]; body?: string; image?: string }> = ({ summary, bullets, body, image }) => {
  const hasAside = bullets.length > 0;
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container>
        {image && (
          <div aria-hidden style={{ height: "16rem", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", marginBottom: "2rem", backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
        )}
        <div style={{ display: "grid", gridTemplateColumns: hasAside ? "minmax(0,1.6fr) minmax(0,1fr)" : "minmax(0, 68ch)", gap: "3rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <Lede style={{ maxWidth: "60ch", fontSize: "1.2rem", color: "var(--ds-text)" }}>{summary}</Lede>
            {body && (
              <p style={{ fontFamily: "var(--ds-font-body)", lineHeight: 1.7, color: "var(--ds-text-muted)", margin: 0, maxWidth: "60ch" }}>{body}</p>
            )}
          </div>
          {hasAside && (
            <aside style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.68rem", color: "var(--ds-text-muted)" }}>Inklusive</div>
              {bullets.map((b, i) => (
                <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.92rem", color: "var(--ds-text)" }}>
                  <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", marginTop: "0.1rem" }}><Icon name="check" size={16} /></span> {b}
                </div>
              ))}
            </aside>
          )}
        </div>
      </Container>
    </section>
  );
};
