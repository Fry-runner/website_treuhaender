import React from "react";
import { Container } from "./primitives";
import { Icon } from "../icons/iconSets";
import { SectionHead } from "./SectionHead";
import type { DocAsset } from "../content/types";

const KIND_LABEL: Record<string, string> = { pdf: "PDF", doc: "DOC", xls: "XLS", other: "DATEI" };
const fmtSize = (b: number) => (b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");
const kindLabel = (k: string) => KIND_LABEL[k] ?? "DATEI";

// FNV-1a — same per-firm variant picker pattern as Nav.tsx, so the chosen
// layout is deterministic and stable for a given document set.
function hash(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h | 0); }

// Shared download-link props: keeps the href + download/open behaviour identical
// across every layout variant.
const linkProps = (src: string) => ({ href: src, target: "_blank" as const, rel: "noopener noreferrer" });
// Long file titles must wrap/ellipse instead of forcing the row wider.
const titleClamp: React.CSSProperties = { overflowWrap: "anywhere", wordBreak: "break-word", minWidth: 0 };

/**
 * Downloads — a STRUCTURE that lists the media pool's documents (Merkblätter,
 * Checklisten, Formulare) as downloadable items. Token-only.
 *
 * Three internal LAYOUTS, picked deterministically per firm via
 * `hash(documents[0]?.title) % 3` (same FNV-1a hash as Nav.tsx):
 *
 *   0 · rows  — compact download rows with hairline dividers + download arrow
 *               right (the original layout, preserved as variant 0).
 *   1 · cards — responsive card grid: file icon · title · kind + size.
 *   2 · split — two-column list, each item carries a file-type badge.
 */
export const Downloads: React.FC<{
  documents: DocAsset[]; eyebrow?: string; heading?: string;
}> = ({ documents, eyebrow = "Downloads", heading = "Merkblätter & Formulare." }) => {
  const items = (documents || []).filter((d) => d.src).slice(0, 12);
  if (!items.length) return null;
  const layout = hash(items[0]?.title || "x") % 3;
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container style={{ maxWidth: layout === 1 ? "var(--ds-container)" : "min(var(--ds-container), 860px)" }}>
        <SectionHead eyebrow={eyebrow} heading={heading} />
        {layout === 0 && <RowsLayout items={items} />}
        {layout === 1 && <CardsLayout items={items} />}
        {layout === 2 && <SplitLayout items={items} />}
      </Container>
    </section>
  );
};

// ── 0 · ROWS — the original layout: hairline-divided download rows, file-type
//    badge left, title, size, download arrow right. ──────────────────────────
const RowsLayout: React.FC<{ items: DocAsset[] }> = ({ items }) => (
  <div style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
    {items.map((d, i) => (
      <a key={i} {...linkProps(d.src)} style={{
        display: "flex", alignItems: "center", gap: "1rem", padding: "0.95rem 1.3rem", textDecoration: "none",
        borderTop: i ? "1px solid var(--ds-border)" : "none", background: "var(--ds-surface)",
      }}>
        <span style={{
          fontFamily: "var(--ds-font-mono)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em",
          color: "var(--ds-primary-ink, var(--ds-primary))", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)",
          padding: "0.3rem 0.5rem", minWidth: "2.6rem", textAlign: "center", flex: "0 0 auto",
        }}>{kindLabel(d.kind)}</span>
        <span style={{ flex: 1, fontFamily: "var(--ds-font-body)", fontSize: "0.95rem", color: "var(--ds-text)", ...titleClamp }}>{d.title}</span>
        <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", color: "var(--ds-text-muted)", flex: "0 0 auto" }}>{fmtSize(d.bytes)}</span>
        <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", flex: "0 0 auto" }}><Icon name="download" size={18} /></span>
      </a>
    ))}
  </div>
);

// ── 1 · CARDS — responsive card grid; each card stacks a file icon, the title
//    and a kind + size footer. ─────────────────────────────────────────────
const CardsLayout: React.FC<{ items: DocAsset[] }> = ({ items }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
    {items.map((d, i) => (
      <a key={i} {...linkProps(d.src)} style={{
        display: "flex", flexDirection: "column", gap: "0.85rem", padding: "1.3rem", textDecoration: "none",
        background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)",
        boxShadow: "var(--ds-shadow-card)", minWidth: 0,
      }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", flex: "0 0 auto" }}><Icon name="document" size={28} /></span>
          <span aria-hidden style={{ color: "var(--ds-text-muted)", display: "inline-flex", flex: "0 0 auto" }}><Icon name="download" size={18} /></span>
        </span>
        <span style={{ flex: 1, fontFamily: "var(--ds-font-heading)", fontSize: "1rem", fontWeight: 600, lineHeight: 1.35, color: "var(--ds-text)", ...titleClamp }}>{d.title}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "var(--ds-font-mono)", fontSize: "0.7rem", letterSpacing: "0.04em", color: "var(--ds-text-muted)" }}>
          <span style={{ fontWeight: 700, color: "var(--ds-primary-ink, var(--ds-primary))" }}>{kindLabel(d.kind)}</span>
          <span aria-hidden>·</span>
          <span>{fmtSize(d.bytes)}</span>
        </span>
      </a>
    ))}
  </div>
);

// ── 2 · SPLIT — two-column list (collapses to one column on phones); each item
//    leads with a file-type badge, then title, then size. ───────────────────
const SplitLayout: React.FC<{ items: DocAsset[] }> = ({ items }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.6rem 1.4rem" }}>
    {items.map((d, i) => (
      <a key={i} {...linkProps(d.src)} style={{
        display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.9rem 0.4rem", textDecoration: "none",
        borderBottom: "1px solid var(--ds-border)", minWidth: 0,
      }}>
        <span style={{
          fontFamily: "var(--ds-font-mono)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.06em",
          color: "var(--ds-primary-fg)", background: "var(--ds-primary)", borderRadius: "var(--ds-radius)",
          padding: "0.32rem 0.5rem", minWidth: "2.7rem", textAlign: "center", flex: "0 0 auto",
        }}>{kindLabel(d.kind)}</span>
        <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.15rem", minWidth: 0 }}>
          <span style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.92rem", color: "var(--ds-text)", ...titleClamp }}>{d.title}</span>
          <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.68rem", color: "var(--ds-text-muted)" }}>{fmtSize(d.bytes)}</span>
        </span>
        <span aria-hidden style={{ color: "var(--ds-primary-ink, var(--ds-primary))", display: "inline-flex", flex: "0 0 auto" }}><Icon name="download" size={18} /></span>
      </a>
    ))}
  </div>
);
