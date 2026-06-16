/**
 * Structure primitives — token-only. None of these contain a literal color,
 * font, radius or shadow; they read everything from `var(--ds-*)`, so they look
 * however the active look dictates.
 */
import React from "react";

type Div = React.PropsWithChildren<{ style?: React.CSSProperties; className?: string }>;

export const Container: React.FC<Div> = ({ children, style }) => (
  <div style={{ maxWidth: "var(--ds-container)", marginInline: "auto", paddingInline: "var(--ds-gutter)", ...style }}>
    {children}
  </div>
);

export const Eyebrow: React.FC<Div> = ({ children }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "0.6rem",
    fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem",
    textTransform: "var(--ds-eyebrow-transform)" as React.CSSProperties["textTransform"],
    letterSpacing: "var(--ds-eyebrow-tracking)",
    fontWeight: "var(--ds-eyebrow-weight)" as unknown as number,
    color: "var(--ds-text-muted)",
  }}>
    <span style={{ width: "1.6rem", height: "2px", background: "var(--ds-primary)", borderRadius: "9999px" }} />
    {children}
  </div>
);

export const Heading: React.FC<Div> = ({ children, style }) => (
  <h1 style={{
    fontFamily: "var(--ds-font-heading)",
    fontWeight: "var(--ds-headline-weight)" as unknown as number,
    fontSize: "var(--ds-display)",
    letterSpacing: "var(--ds-headline-tracking)",
    lineHeight: 1.05, color: "var(--ds-text)", margin: 0, ...style,
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
    maxWidth: "42ch", margin: 0, ...style,
  }}>
    {children}
  </p>
);

/** The primary-button look, chosen per firm and supplied via context so every
 *  Button across the page renders in the same style without prop-drilling. */
export type PrimaryStyle =
  | "solid" | "sharp" | "pill" | "bloom" | "mono"
  | "gradient" | "soft" | "ghost" | "bordered" | "link";
const PrimaryStyleCtx = React.createContext<PrimaryStyle>("solid");
export const PrimaryStyleProvider = PrimaryStyleCtx.Provider;
export const usePrimaryStyle = () => React.useContext(PrimaryStyleCtx);

type BtnProps = React.PropsWithChildren<{ variant?: "primary" | "outline" }>;

const btnBase: React.CSSProperties = {
  fontFamily: "var(--ds-font-mono)", fontSize: "0.78rem", textTransform: "uppercase",
  letterSpacing: "0.08em", fontWeight: 600, padding: "0.9rem 1.6rem",
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
    case "solid":
    default:         return { ...base, borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)" };
  }
}

export const Button: React.FC<BtnProps> = ({ children, variant = "primary" }) => {
  const ps = usePrimaryStyle();
  if (variant === "primary") {
    return (
      <button style={{ ...btnBase, ...primaryStyleProps(ps) }}>
        {children} <span aria-hidden>→</span>
      </button>
    );
  }
  return (
    <button style={{ ...btnBase, background: "transparent", color: "var(--ds-text)", border: "1px solid var(--ds-text)" }}>
      {children}
    </button>
  );
};
