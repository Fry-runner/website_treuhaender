import React from "react";
import { Container, btnBase, solidCtaFill } from "./primitives";
import { Icon } from "../icons/iconSets";
import { useNavigate } from "../compose/nav-context";
import type { NavContent } from "../content/types";

/**
 * Site header. Two independent per-firm axes give every firm a distinct header while
 * staying consistent across its own pages (UX rule: navigation-consistency):
 *
 *  • LAYOUT (`HEADER_VARIANTS`) — the desktop arrangement / chrome.
 *  • LINK INDICATOR (`NAVLINK_STYLES`) — how the nav links show hover/current. The
 *    actual treatment lives in MotionStyles (keyed off `data-navlink`), since :hover
 *    and [aria-current] need CSS — so it's no longer one global underline everywhere.
 *
 * Over the HOME hero the header floats transparent and only turns solid once the user
 * scrolls past the hero's top (`overHero` + scroll listener) — a classic immersive
 * header. `heroTone` flips the header text to light when the hero behind it is dark.
 * Everywhere else it is the solid sticky bar. The CTA is ALWAYS a solid brand button.
 *
 * All layouts share the same building blocks (brand · mobile toggle · the
 * `.ds-nav-links` cluster of links + the solid CTA) and the SAME responsive contract
 * (ResponsiveStyles collapses `.ds-nav-links` into a dropdown under `.ds-nav-toggle`
 * on phones). Token-only.
 *
 *   classic  — brand left · links + CTA clustered right
 *   split    — brand left · links left · CTA pushed to the far right
 *   center   — brand left · links + CTA centered
 *   elevated — taller bar, larger logo, soft shadow (no hairline), roomier links
 */
const HEADER_VARIANTS = ["classic", "split", "center", "elevated"] as const;
type HeaderVariant = (typeof HEADER_VARIANTS)[number];
const NAVLINK_STYLES = ["underline", "topbar", "pill", "color", "dot"] as const;
function hash(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h | 0); }

/** Header bar height for a firm — matches the variant chosen below, so the home hero
 *  can pull itself up under the (transparent, overlaying) header by exactly this much
 *  via `--ds-nav-h`. */
export const navHeightRem = (brand: string): string =>
  (HEADER_VARIANTS[hash(brand || "x") % HEADER_VARIANTS.length] === "elevated" ? "5.5rem" : "4.5rem");

export const Nav: React.FC<{ content: NavContent; current?: string; variant?: HeaderVariant; overHero?: boolean; heroTone?: "light" | "dark" }> = ({ content, current, variant, overHero, heroTone }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    if (!overHero) { setScrolled(false); return; }
    // Stay transparent until the hero HEADING scrolls up to meet the bar, then snap solid —
    // the header only takes on its flat colour once the hero title would otherwise slide
    // behind a see-through bar (not after an arbitrary few px). Falls back to a small
    // threshold if the heading can't be found.
    const onScroll = () => {
      const heading = document.querySelector<HTMLElement>(".ds-home-hero h1, .ds-home-hero h2");
      const navH = document.querySelector<HTMLElement>("header")?.offsetHeight ?? 72;
      setScrolled(heading ? heading.getBoundingClientRect().top <= navH : window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [overHero]);

  const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); navigate(href); };
  const key = content.brand || "x";
  const v: HeaderVariant = variant ?? HEADER_VARIANTS[hash(key) % HEADER_VARIANTS.length];
  const navLink = NAVLINK_STYLES[hash(key + "·navlink") % NAVLINK_STYLES.length];
  const elevated = v === "elevated";

  const transparent = !!overHero && !scrolled;          // floating over the hero
  const darkTone = transparent && heroTone === "dark";  // light header text over a dark hero
  const txt = darkTone ? "#fff" : "var(--ds-text)";
  const txtMuted = darkTone ? "rgba(255,255,255,0.82)" : "var(--ds-text-muted)";
  const lineCol = darkTone ? "rgba(255,255,255,0.45)" : "var(--ds-border)";

  // ── shared building blocks (plain JSX factories, not nested components — so the
  //    nav never remounts on toggle, keeping the open/close transition intact) ──
  const brand = (
    <a href="/" onClick={go("/")} style={{ display: "flex", alignItems: "center", fontFamily: "var(--ds-font-heading)", fontWeight: 700, fontSize: elevated ? "1.25rem" : "1.1rem", color: txt, letterSpacing: "-0.01em", textDecoration: "none", cursor: "pointer", flex: "0 0 auto" }}>
      {content.logo
        ? <img src={content.logo} alt={content.brand} style={{ height: elevated ? "2.5rem" : "2.1rem", width: "auto", maxWidth: "13rem", objectFit: "contain", display: "block" }} />
        : content.brand}
    </a>
  );
  const toggle = (
    <button className="ds-nav-toggle" aria-label="Menü" aria-expanded={open} onClick={() => setOpen((o) => !o)}
      style={{ alignItems: "center", justifyContent: "center", width: "2.6rem", height: "2.6rem", background: "transparent", border: `1px solid ${lineCol}`, borderRadius: "var(--ds-radius)", color: txt, cursor: "pointer", padding: 0, flex: "0 0 auto" }}>
      <Icon name={open ? "close" : "menu"} size={18} />
    </button>
  );
  const cta = (pushRight?: boolean) => (
    // The unmistakable solid brand CTA — the SAME affordance (solidCtaFill) as a page's
    // final CTA band, deliberately a fixed shape independent of the firm's body button
    // style, so the header conversion button is instantly recognisable on any ground.
    <button className="ds-btn" onClick={() => { setOpen(false); navigate("/kontakt"); }}
      style={{ ...btnBase, ...solidCtaFill, fontWeight: 600, fontSize: "0.85rem", padding: "0.7rem 1.3rem", minHeight: "2.75rem", ...(pushRight ? { marginLeft: "auto" } : {}) }}>
      {content.cta}
    </button>
  );
  const links = (justify: React.CSSProperties["justifyContent"], ctaRight?: boolean) => (
    <nav className="ds-nav-links" data-open={open} data-navlink={navLink} data-floating={transparent ? "true" : undefined} style={{ display: "flex", gap: elevated ? "2rem" : "1.6rem", alignItems: "center", flex: 1, justifyContent: justify }}>
      {content.links.map((l) => (
        <a key={l.label} className="ds-nav-link" href={l.href} onClick={go(l.href)} aria-current={current === l.href ? "page" : undefined}
           style={{ display: "inline-flex", alignItems: "center", minHeight: "2.75rem", fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", color: txtMuted, textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
          {l.label}
        </a>
      ))}
      {cta(ctaRight)}
    </nav>
  );

  // ── per-variant desktop arrangement (mobile is identical: justify-between puts
  //    brand left + toggle right; the flex:1 link cluster is absolute/out-of-flow) ─
  const justify = v === "split" ? "flex-start" : v === "center" ? "center" : "flex-end";
  // When the logo sits on a solid near-white plate, the SOLID header wears that exact
  // colour so the logo blends in instead of showing a white box on a brand-tinted
  // off-white bar. (content.logoBg is set only for that case — see extract.ts
  // extractLogoBg.) The transparent-over-hero state keeps no background to seam against.
  const solidBg = content.logoBg ?? "var(--ds-bg)";
  return (
    <header data-nav-tone={darkTone ? "dark" : undefined} style={{
      position: "sticky", top: 0, zIndex: 50,
      // NB: do NOT transition background-color OR border-color — a transitioned colour
      // whose target is a var() resolved from `transparent` never commits (stays
      // see-through), so the header would never turn solid. Fade only the shadow; the
      // background + hairline snap (imperceptible against the 0.25s shadow fade).
      transition: "box-shadow 0.25s ease",
      // Floating over the hero: fully transparent — NO scrim. (A faded scrim gradient left
      // a faint horizontal edge at the header's lower end.) Legibility is carried by the
      // text tone (white over a dark hero, dark over a light one) plus the hero's own
      // background/scrim, so the bar reads cleanly without veiling the hero.
      background: transparent ? "transparent" : solidBg,
      borderBottom: transparent ? "1px solid transparent" : (elevated ? "none" : "1px solid var(--ds-border)"),
      boxShadow: transparent ? "none" : (elevated ? "var(--ds-shadow-card)" : "none"),
    }}>
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", height: elevated ? "5.5rem" : "4.5rem", position: "relative" }}>
        {brand}
        {toggle}
        {links(justify, v === "split")}
      </Container>
    </header>
  );
};
