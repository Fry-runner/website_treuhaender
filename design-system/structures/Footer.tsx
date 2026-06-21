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

/** Multi-column footer (briefing §3 footer). */
export const Footer: React.FC<{ content: FooterContent }> = ({ content }) => {
  const navigate = useNavigate();
  return (
  <footer style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)" }}>
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: `2fr repeat(${content.columns.length}, 1fr)`, gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {content.logo
            ? <img src={content.logo} alt={content.brand} style={{ height: "2.4rem", width: "auto", maxWidth: "14rem", objectFit: "contain", objectPosition: "left center" }} />
            : <div style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: "1.15rem", color: "var(--ds-text)" }}>{content.brand}</div>}
          <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0, maxWidth: "34ch" }}>{content.tagline}</p>
        </div>
        {content.columns.map((c) => (
          <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.8rem", fontWeight: 600, color: "var(--ds-text-muted)" }}>{c.title}</div>
            {c.links.map((l) => {
              const linkStyle = { fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", color: "var(--ds-text)", textDecoration: "none" } as const;
              const t = hrefFor(l);
              if (t.kind === "mailto" || t.kind === "tel")
                return <a key={l} href={t.href} style={{ ...linkStyle, cursor: "pointer" }}>{l}</a>;
              if (t.kind === "page")
                return <a key={l} href={t.href} onClick={(e) => { e.preventDefault(); navigate(t.href); }} style={{ ...linkStyle, cursor: "pointer" }}>{l}</a>;
              return <span key={l} style={linkStyle}>{l}</span>;
            })}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "2rem", paddingTop: "1.2rem", borderTop: "1px solid var(--ds-border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.6rem", fontFamily: "var(--ds-font-body)", fontSize: "0.82rem", color: "var(--ds-text-muted)" }}>
        <span>© {content.year} {content.brand}</span>
        <span style={{ display: "flex", gap: "1rem" }}>{content.legal.map((l) => <a key={l} href={`/${l.toLowerCase()}`} onClick={(e) => { e.preventDefault(); navigate(`/${l.toLowerCase()}`); }} style={{ color: "var(--ds-text-muted)", textDecoration: "none", cursor: "pointer" }}>{l}</a>)}</span>
      </div>
      {content.imageCredits && content.imageCredits.length > 0 && (
        <div style={{ marginTop: "0.6rem", fontFamily: "var(--ds-font-body)", fontSize: "0.78rem", color: "var(--ds-text-muted)" }}>
          Bilder: {content.imageCredits.join(" · ")} — via Wikimedia Commons
        </div>
      )}
    </Container>
  </footer>
  );
};
