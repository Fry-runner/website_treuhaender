/**
 * Structure primitives — token-only. None of these contain a literal color,
 * font, radius or shadow; they read everything from `var(--ds-*)`, so they look
 * however the active look dictates.
 */
import React from "react";
import { useNavigate } from "../compose/nav-context";

type Div = React.PropsWithChildren<{ style?: React.CSSProperties; className?: string }>;

export const Container: React.FC<Div> = ({ children, style }) => (
  <div style={{ maxWidth: "var(--ds-container)", marginInline: "auto", paddingInline: "var(--ds-gutter)", ...style }}>
    {children}
  </div>
);

// Section kicker/overline. De-telled: no mono face, no uppercase, no tracking and
// no leading primary dash — those together were the generic "AI section label".
// Now a quiet small-caps-free label in the body face; the look still varies per
// firm because --ds-font-body does.
export const Eyebrow: React.FC<Div> = ({ children }) => (
  <div style={{
    fontFamily: "var(--ds-font-body)", fontSize: "0.85rem",
    fontWeight: 600, color: "var(--ds-text-muted)",
  }}>
    {children}
  </div>
);

export const Heading: React.FC<Div> = ({ children, style }) => (
  <h1 style={{
    fontFamily: "var(--ds-font-heading)",
    fontWeight: "var(--ds-headline-weight)" as unknown as number,
    fontSize: "var(--ds-display)",
    letterSpacing: "var(--ds-headline-tracking)",
    lineHeight: "var(--ds-headline-leading, 1.15)", color: "var(--ds-text)", margin: 0, ...style,
  }}>
    {children}
  </h1>
);

export const Accent: React.FC<Div> = ({ children }) => (
  <span style={{ color: "var(--ds-primary)" }}>{children}</span>
);

export const Lede: React.FC<Div> = ({ children, style }) => (
  <p style={{
    fontFamily: "var(--ds-font-body)", fontWeight: "var(--ds-body-weight)" as unknown as number,
    fontSize: "1.075rem", lineHeight: 1.6, color: "var(--ds-text-muted)",
    margin: 0, ...style,
  }}>
    {children}
  </p>
);

/** The primary-button look, chosen per firm and supplied via context so every
 *  Button across the page renders in the same style without prop-drilling. */
export type PrimaryStyle =
  | "solid" | "sharp" | "pill" | "bloom" | "mono"
  | "gradient" | "soft" | "ghost" | "bordered" | "link"
  | "outlineBold" | "pillOutline" | "offset" | "glass" | "elevated"
  | "inset" | "slab" | "notch" | "ring" | "chip"
  | "gradientBorder" | "gradientPill" | "dashed" | "bevel" | "surfaceCard"
  | "tintBorder" | "xl" | "wide" | "underlineThick" | "raisedPill";
const PrimaryStyleCtx = React.createContext<PrimaryStyle>("solid");
export const PrimaryStyleProvider = PrimaryStyleCtx.Provider;
export const usePrimaryStyle = () => React.useContext(PrimaryStyleCtx);

type BtnProps = React.PropsWithChildren<{ variant?: "primary" | "outline"; onClick?: () => void; to?: string; type?: "button" | "submit" }>;

// De-telled button base: body face, normal case, normal tracking (was the
// mono + UPPERCASE + wide-tracking "AI button"). Per-style overrides below may
// still add tracking as a deliberate signature — that's variety, not the tell.
const btnBase: React.CSSProperties = {
  fontFamily: "var(--ds-font-body)", fontSize: "0.92rem",
  fontWeight: 600, padding: "0.9rem 1.6rem",
  borderRadius: "var(--ds-radius)", cursor: "pointer",
  transition: "all var(--ds-duration) var(--ds-ease)", display: "inline-flex",
  alignItems: "center", gap: "0.5rem", lineHeight: 1,
};

/** Token-driven look for each primary-button style. */
function primaryStyleProps(s: PrimaryStyle): React.CSSProperties {
  const base: React.CSSProperties = {
    background: "var(--ds-primary)", color: "var(--ds-primary-fg)", border: "1px solid var(--ds-primary)",
  };
  const body = { textTransform: "none" as const, letterSpacing: "0.01em", fontFamily: "var(--ds-font-body)" };
  switch (s) {
    case "sharp":    return { ...base, borderRadius: 0, boxShadow: "none", letterSpacing: "0.1em" };
    case "pill":     return { ...base, borderRadius: "9999px", boxShadow: "var(--ds-shadow-card)", ...body };
    case "bloom":    return { ...base, borderRadius: "9999px", boxShadow: "0 12px 32px -8px var(--ds-primary)", ...body };
    case "mono":     return { ...base, borderRadius: "var(--ds-radius)", boxShadow: "none", letterSpacing: "0.16em" };
    case "gradient": return { ...base, borderRadius: "var(--ds-radius)", border: "none", backgroundImage: "linear-gradient(120deg, var(--ds-primary), var(--ds-secondary))", boxShadow: "var(--ds-shadow-card)", ...body };
    case "soft":     return { ...base, borderRadius: "0.85rem", boxShadow: "0 14px 34px -12px var(--ds-primary)", ...body };
    case "ghost":    return { ...base, background: "var(--ds-primary-soft)", color: "var(--ds-primary)", border: "1px solid transparent", borderRadius: "var(--ds-radius)", boxShadow: "none", ...body };
    case "bordered": return { ...base, background: "transparent", color: "var(--ds-primary)", border: "1px solid var(--ds-primary)", borderRadius: "var(--ds-radius)", boxShadow: "none" };
    case "link":     return { ...base, background: "transparent", color: "var(--ds-primary)", border: "none", borderRadius: 0, boxShadow: "none", padding: "0.4rem 0", borderBottom: "2px solid var(--ds-primary)", ...body };
    case "outlineBold": return { ...base, background: "transparent", color: "var(--ds-primary)", border: "2px solid var(--ds-primary)", borderRadius: "var(--ds-radius)", boxShadow: "none", letterSpacing: "0.1em" };
    case "pillOutline": return { ...base, background: "transparent", color: "var(--ds-primary)", border: "1.5px solid var(--ds-primary)", borderRadius: "9999px", boxShadow: "none", ...body };
    case "offset":   return { ...base, borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-text)", boxShadow: "4px 4px 0 var(--ds-secondary)" };
    case "glass":    return { ...base, background: "var(--ds-primary-soft)", color: "var(--ds-primary)", border: "1px solid var(--ds-border)", borderRadius: "0.75rem", boxShadow: "var(--ds-shadow-card)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", ...body };
    case "elevated": return { ...base, borderRadius: "0.85rem", boxShadow: "0 16px 30px -12px rgba(0,0,0,0.45)" };
    case "inset":    return { ...base, borderRadius: "var(--ds-radius)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.18)" };
    case "slab":     return { ...base, borderRadius: 0, borderBottom: "3px solid var(--ds-secondary)", boxShadow: "none", letterSpacing: "0.14em" };
    case "notch":    return { ...base, borderRadius: 0, boxShadow: "none", clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)" };
    case "ring":     return { ...base, background: "transparent", color: "var(--ds-primary)", border: "1px solid var(--ds-primary)", borderRadius: "var(--ds-radius)", boxShadow: "0 0 0 4px var(--ds-primary-soft)" };
    case "chip":     return { ...base, background: "var(--ds-primary-soft)", color: "var(--ds-primary)", border: "none", borderRadius: "9999px", boxShadow: "none", padding: "0.55rem 1.1rem", fontSize: "0.7rem", ...body };
    case "gradientBorder": return { ...base, color: "var(--ds-primary)", border: "2px solid transparent", borderRadius: "var(--ds-radius)", boxShadow: "none", background: "linear-gradient(var(--ds-bg), var(--ds-bg)) padding-box, linear-gradient(120deg, var(--ds-primary), var(--ds-secondary)) border-box", ...body };
    case "gradientPill": return { ...base, border: "none", borderRadius: "9999px", backgroundImage: "linear-gradient(120deg, var(--ds-primary), var(--ds-secondary))", boxShadow: "0 12px 32px -8px var(--ds-primary)", ...body };
    case "dashed":   return { ...base, background: "transparent", color: "var(--ds-primary)", border: "1.5px dashed var(--ds-primary)", borderRadius: "var(--ds-radius)", boxShadow: "none", ...body };
    case "bevel":    return { ...base, borderRadius: 0, boxShadow: "none", clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" };
    case "surfaceCard": return { ...base, background: "var(--ds-surface)", color: "var(--ds-text)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", ...body };
    case "tintBorder": return { ...base, background: "var(--ds-primary-soft)", color: "var(--ds-primary)", border: "1px solid var(--ds-primary)", borderRadius: "var(--ds-radius)", boxShadow: "none", ...body };
    case "xl":       return { ...base, borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.15rem 2.2rem", fontSize: "0.9rem" };
    case "wide":     return { ...base, borderRadius: "var(--ds-radius)", boxShadow: "none", letterSpacing: "0.24em" };
    case "underlineThick": return { ...base, background: "transparent", color: "var(--ds-primary)", border: "none", borderRadius: 0, boxShadow: "none", padding: "0.4rem 0", borderBottom: "3px solid var(--ds-primary)", ...body };
    case "raisedPill": return { ...base, borderRadius: "9999px", boxShadow: "0 16px 30px -12px rgba(0,0,0,0.45)" };
    case "solid":
    default:         return { ...base, borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)" };
  }
}

export const Button: React.FC<BtnProps> = ({ children, variant = "primary", onClick, to, type = "button" }) => {
  const ps = usePrimaryStyle();
  const navigate = useNavigate();
  // Default action: non-submit buttons route to the booking/contact path so every
  // CTA actually does something (override with `onClick` or `to`). Submit buttons
  // keep native form submission and never navigate.
  const handle = onClick ?? (type === "submit" ? undefined : () => navigate(to ?? "/kontakt"));
  if (variant === "primary") {
    return (
      <button type={type} onClick={handle} style={{ ...btnBase, ...primaryStyleProps(ps) }}>
        {children}
      </button>
    );
  }
  return (
    <button type={type} onClick={handle} style={{ ...btnBase, background: "transparent", color: "var(--ds-text)", border: "1px solid var(--ds-text)" }}>
      {children}
    </button>
  );
};
