import React from "react";
import { Container } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead } from "./SectionHead";
import type { DocAsset } from "../content/types";

const KIND_LABEL: Record<string, string> = { pdf: "PDF", doc: "DOC", xls: "XLS", other: "DATEI" };
const fmtSize = (b: number) => (b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");

/**
 * Downloads — a STRUCTURE that lists the media pool's documents (Merkblätter,
 * Checklisten, Formulare) as downloadable rows. Token-only.
 */
export const Downloads: React.FC<{
  documents: DocAsset[]; eyebrow?: string; heading?: string;
}> = ({ documents, eyebrow = "Downloads", heading = "Merkblätter & Formulare." }) => {
  const items = (documents || []).filter((d) => d.src).slice(0, 12);
  if (!items.length) return null;
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container style={{ maxWidth: "min(var(--ds-container), 860px)" }}>
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {items.map((d, i) => (
            <a key={i} href={d.src} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: "1rem", padding: "0.95rem 1.3rem", textDecoration: "none",
              borderTop: i ? "1px solid var(--ds-border)" : "none", background: "var(--ds-surface)",
            }}>
              <span style={{
                fontFamily: "var(--ds-font-mono)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em",
                color: "var(--ds-primary)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)",
                padding: "0.3rem 0.5rem", minWidth: "2.6rem", textAlign: "center",
              }}>{KIND_LABEL[d.kind] ?? "DATEI"}</span>
              <span style={{ flex: 1, fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", color: "var(--ds-text)" }}>{d.title}</span>
              <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", color: "var(--ds-text-muted)" }}>{fmtSize(d.bytes)}</span>
              <span aria-hidden style={{ color: "var(--ds-primary)", display: "inline-flex" }}><Icon name="download" size={18} /></span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
};
