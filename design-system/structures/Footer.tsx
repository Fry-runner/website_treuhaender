import React from "react";
import { Container } from "./primitives";
import { useNavigate } from "../compose/nav-context";
import type { FooterContent } from "../content/types";

/** Footer column links carry only a label; derive a best-effort route slug so they
 *  navigate instead of dead `#` anchors (umlaut-folded, kebab-cased). */
const toSlug = (s: string) => "/" + s.toLowerCase()
  .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d][\d\s()\/.-]{6,}$/;
/** Known navigable site-page labels (umlaut-folded, lowercased) → real internal slugs. */
const PAGE_LABELS = new Set([
  "leistungen", "ueber uns", "über uns", "offene stellen", "kontakt",
  "preise", "home", "impressum", "datenschutz",
]);

type LinkKind =
  | { kind: "mailto"; href: string }
  | { kind: "tel"; href: string }
  | { kind: "page"; href: string }
  | { kind: "plain" };

/** Classify a footer label so phone/e-mail become real external links, known
 *  page labels keep internal navigation, and bare values (e.g. a town) render
 *  as plain text instead of dead internal slug routes. */
const hrefFor = (label: string): LinkKind => {
  const trimmed = label.trim();
  if (EMAIL_RE.test(trimmed)) return { kind: "mailto", href: `mailto:${trimmed}` };
  if (PHONE_RE.test(trimmed)) return { kind: "tel", href: `tel:${trimmed.replace(/[^\d+]/g, "")}` };
  if (PAGE_LABELS.has(trimmed.toLowerCase())) return { kind: "page", href: toSlug(label) };
  return { kind: "plain" };
};

/** Deterministic per-firm layout pick (same as Nav). */
const hash = (s: string): number => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h | 0); };

const linkBase: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", color: "var(--ds-text)", textDecoration: "none" };
const colTitle: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.8rem", fontWeight: 600, color: "var(--ds-text-muted)" };

/**
 * Multi-column footer — FOUR per-firm layouts (chosen by hash(brand)) so the footer,
 * present on every page of every site, no longer reads identical everywhere:
 *   0 columns  — brand left + link columns (the classic)
 *   1 centered — brand + tagline centred, columns centred, legal centred
 *   2 split    — large brand block left, link columns clustered right
 *   3 band     — brand + columns row, legal in a tinted full-width sub-band
 */
export const Footer: React.FC<{ content: FooterContent }> = ({ content }) => {
  const navigate = useNavigate();
  const v = hash(content.brand || "x") % 4;

  const brand = (opts?: { big?: boolean; center?: boolean }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: opts?.center ? "center" : "flex-start", textAlign: opts?.center ? "center" : "left" }}>
      {content.logo
        ? <img src={content.logo} alt={content.brand} style={{ height: opts?.big ? "3rem" : "2.4rem", width: "auto", maxWidth: "14rem", objectFit: "contain", objectPosition: opts?.center ? "center" : "left center" }} />
        : <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: opts?.big ? "1.5rem" : "1.15rem", color: "var(--ds-text)" }}>{content.brand}</div>}
      <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0, maxWidth: "34ch" }}>{content.tagline}</p>
    </div>
  );

  const column = (c: FooterContent["columns"][number], center?: boolean) => (
    <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: center ? "center" : "flex-start" }}>
      <div style={colTitle}>{c.title}</div>
      {c.links.map((l) => {
        // Structured links (the dynamic sitemap column) carry an explicit, already-resolved
        // route — navigate straight to it instead of re-deriving a slug from the label.
        if (typeof l === "object") return <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); navigate(l.href); }} style={{ ...linkBase, cursor: "pointer" }}>{l.label}</a>;
        const t = hrefFor(l);
        if (t.kind === "mailto" || t.kind === "tel") return <a key={l} href={t.href} style={{ ...linkBase, cursor: "pointer" }}>{l}</a>;
        if (t.kind === "page") return <a key={l} href={t.href} onClick={(e) => { e.preventDefault(); navigate(t.href); }} style={{ ...linkBase, cursor: "pointer" }}>{l}</a>;
        return <span key={l} style={linkBase}>{l}</span>;
      })}
    </div>
  );

  const legalLinks = (
    <span style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {content.legal.map((l) => <a key={l} href={`/${l.toLowerCase()}`} onClick={(e) => { e.preventDefault(); navigate(`/${l.toLowerCase()}`); }} style={{ color: "var(--ds-text-muted)", textDecoration: "none", cursor: "pointer" }}>{l}</a>)}
    </span>
  );
  const copyright = <span>© {content.year} {content.brand}</span>;
  const credits = content.imageCredits && content.imageCredits.length > 0 ? (
    <div style={{ marginTop: "0.6rem", fontFamily: "var(--ds-font-body)", fontSize: "0.78rem", color: "var(--ds-text-muted)" }}>
      Bilder: {content.imageCredits.join(" · ")} — via Wikimedia Commons
    </div>
  ) : null;
  const legalRowStyle: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.82rem", color: "var(--ds-text-muted)" };

  // ── 1 · CENTERED ────────────────────────────────────────────────
  if (v === 1) {
    return (
      <footer style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)" }}>
        <Container>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
            {brand({ center: true })}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(130px, 1fr))`, gap: "2rem", width: "100%", maxWidth: "52rem", justifyItems: "center" }}>
              {content.columns.map((c) => column(c, true))}
            </div>
          </div>
          <div style={{ marginTop: "2.2rem", paddingTop: "1.2rem", borderTop: "1px solid var(--ds-border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", ...legalRowStyle }}>
            {legalLinks}{copyright}
          </div>
          {credits}
        </Container>
      </footer>
    );
  }

  // ── 2 · SPLIT (large brand left, columns clustered right) ────────
  if (v === 2) {
    return (
      <footer style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)" }}>
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 2.5fr)", gap: "2.5rem", alignItems: "start" }}>
            {brand({ big: true })}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.columns.length, 3)}, minmax(0, 1fr))`, gap: "2rem" }}>
              {content.columns.map((c) => column(c))}
            </div>
          </div>
          <div style={{ marginTop: "2.4rem", paddingTop: "1.2rem", borderTop: "1px solid var(--ds-border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.6rem", ...legalRowStyle }}>
            {copyright}{legalLinks}
          </div>
          {credits}
        </Container>
      </footer>
    );
  }

  // ── 3 · BAND (row, then a tinted full-width legal sub-band) ──────
  if (v === 3) {
    return (
      <footer style={{ background: "var(--ds-bg)" }}>
        <Container style={{ paddingBlock: "var(--ds-section-y)" }}>
          <div style={{ display: "grid", gridTemplateColumns: `2fr repeat(${content.columns.length}, 1fr)`, gap: "2rem" }}>
            {brand()}
            {content.columns.map((c) => column(c))}
          </div>
          {credits}
        </Container>
        <div style={{ background: "var(--ds-primary-soft)", borderTop: "1px solid var(--ds-border)" }}>
          <Container style={{ paddingBlock: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.6rem", ...legalRowStyle, color: "var(--ds-text)" }}>
              {copyright}{legalLinks}
            </div>
          </Container>
        </div>
      </footer>
    );
  }

  // ── 0 · COLUMNS (classic, default) ──────────────────────────────
  return (
    <footer style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: `2fr repeat(${content.columns.length}, 1fr)`, gap: "2rem" }}>
          {brand()}
          {content.columns.map((c) => column(c))}
        </div>
        <div style={{ marginTop: "2rem", paddingTop: "1.2rem", borderTop: "1px solid var(--ds-border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.6rem", ...legalRowStyle }}>
          {copyright}{legalLinks}
        </div>
        {credits}
      </Container>
    </footer>
  );
};
