import React from "react";
import { Eyebrow, useMoreStyle, useSectionAlign } from "./primitives";
import { useNavigate } from "../compose/nav-context";
import { Icon } from "../icons/iconSets";

export interface MoreLink { label: string; href: string; }

/** The shared section→subpage "view all" link. Its treatment is ONE of several
 *  minimalist looks, chosen once per firm via <MoreStyleProvider> and read from
 *  context — so every forward link across the site is the same sort, but it's no
 *  longer the single hardcoded "text + arrow" everywhere, and it differs firm to
 *  firm. `tone="onImage"` gives the light-on-dark version for use over photography. */
export const SectionMore: React.FC<{ link?: MoreLink; tone?: "default" | "onImage" }> = ({ link, tone = "default" }) => {
  const navigate = useNavigate();
  const variant = useMoreStyle();
  if (!link) return null;
  const onImg = tone === "onImage";
  const ink = onImg ? "#fff" : "var(--ds-primary-ink, var(--ds-primary))";
  const text = onImg ? "#fff" : "var(--ds-text)";
  const border = onImg ? "rgba(255,255,255,0.55)" : "var(--ds-border)";
  const soft = onImg ? "rgba(255,255,255,0.16)" : "var(--ds-primary-soft)";
  const strong = onImg ? "#fff" : "var(--ds-text)";
  const base: React.CSSProperties = {
    fontFamily: "var(--ds-font-body)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
    cursor: "pointer", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "0.45rem", lineHeight: 1,
  };
  let style: React.CSSProperties;
  let nudge = false;
  let trailing: React.ReactNode = null;
  let leading: React.ReactNode = null;
  switch (variant) {
    case "arrow":
      style = { ...base, color: ink, paddingBottom: "0.2rem" }; nudge = true;
      trailing = <Icon name="arrowRight" size={14} style={{ verticalAlign: "-0.1em" }} />;
      break;
    case "chip":
      style = { ...base, color: text, border: `1px solid ${border}`, borderRadius: "var(--ds-radius-pill, 9999px)", padding: "0.5rem 1.05rem" };
      break;
    case "ghost":
      style = { ...base, color: ink, background: soft, borderRadius: "var(--ds-radius)", padding: "0.55rem 1.05rem" };
      break;
    case "boxed":
      style = { ...base, color: strong, border: `1px solid ${strong}`, borderRadius: 0, padding: "0.55rem 1.05rem" };
      break;
    case "chevron":
      style = { ...base, color: ink }; nudge = true;
      trailing = (
        <span className="ds-arrow" aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "1.5rem", height: "1.5rem", borderRadius: "9999px", border: `1px solid ${onImg ? "rgba(255,255,255,0.6)" : "currentColor"}` }}>
          <Icon name="chevronRight" size={12} />
        </span>
      );
      break;
    case "arrow-up":
      // diagonal "go to" arrow (distinct from the horizontal `arrow`)
      style = { ...base, color: ink, paddingBottom: "0.2rem" }; nudge = true;
      trailing = <Icon name="arrowUpRight" size={14} style={{ verticalAlign: "-0.1em" }} />;
      break;
    case "dot":
      // a small primary dot leads the label — a quiet marker, no underline
      style = { ...base, color: text };
      leading = <span aria-hidden style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", background: ink, flex: "0 0 auto" }} />;
      break;
    case "arrow-box":
      // the arrow sits in a small framed box that slides on hover (via .ds-arrow)
      style = { ...base, color: text }; nudge = true;
      trailing = (
        <span className="ds-arrow" aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "1.6rem", height: "1.6rem", borderRadius: "var(--ds-radius)", border: `1px solid ${onImg ? "rgba(255,255,255,0.6)" : "var(--ds-border)"}`, color: ink }}>
          <Icon name="arrowRight" size={12} />
        </span>
      );
      break;
    case "bracket":
      // a leading vertical accent rule (rule-led link), no underline
      style = { ...base, color: strong, borderLeft: `2px solid ${ink}`, paddingLeft: "0.7rem" };
      break;
    case "pill-arrow":
      // soft-tinted pill WITH a trailing arrow that nudges on hover
      style = { ...base, color: ink, background: soft, borderRadius: "var(--ds-radius-pill, 9999px)", padding: "0.5rem 1.05rem" }; nudge = true;
      trailing = <Icon name="arrowRight" size={13} style={{ verticalAlign: "-0.1em" }} />;
      break;
    case "underline":
    default:
      style = { ...base, color: ink, borderBottom: `1.5px solid ${ink}`, paddingBottom: "0.28rem" };
      break;
  }
  return (
    <a className={nudge ? "ds-nudge" : undefined} href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); }} style={style}>
      {leading}{link.label}{trailing}
    </a>
  );
};

/** Shared section header: eyebrow + H2, with an optional "view all" link that
 *  routes to the matching subpage (teaser pattern). Token-only. */
export const SectionHead: React.FC<{ eyebrow: string; heading: string; center?: boolean; more?: MoreLink }> = ({ eyebrow, heading, more }) => {
  // A blanked heading (deduped against the page-header title) drops the whole head, so
  // a subpage never opens "Über uns" (H1) / "Über uns" (H2) — the section starts on its
  // body. With only a "more" link left, just that renders.
  const h = (heading ?? "").trim();
  if (!h && !more) return null;
  // Alignment is a per-firm decision (SectionAlignProvider), NOT per-variant — so a site's
  // section headings share one alignment instead of mixing left & centre. (The legacy
  // `center` prop is intentionally ignored in favour of this site-wide policy.)
  const center = useSectionAlign() === "center";
  const headingBlock = h ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: center ? "center" : "flex-start", textAlign: center ? "center" : "left" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 style={{
        fontFamily: "var(--ds-font-heading)", fontWeight: "var(--ds-headline-weight)" as unknown as number,
        fontSize: "var(--ds-display-h2, 2rem)", letterSpacing: "var(--ds-headline-tracking)", lineHeight: 1.15, color: "var(--ds-text)", margin: 0,
      }}>
        {h}
      </h2>
    </div>
  ) : null;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: h ? "space-between" : "flex-end", gap: "1rem", flexWrap: "wrap", marginBottom: h ? "var(--ds-space-block, 2.2rem)" : "1.2rem" }}>
      {headingBlock}
      {more && <SectionMore link={more} />}
    </div>
  );
};
