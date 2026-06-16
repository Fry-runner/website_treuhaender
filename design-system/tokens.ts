/**
 * Design Token Schema
 * ===================
 * Extracted from the four built Treuhänder template sites
 * (Boost-Consulting, Steuerberatung-Andreas-Rürup, Tureva, Unter-Dem-Strich).
 *
 * This file defines ONE schema (the `DesignTokens` type) plus four concrete
 * instances ("presets") — one per built site. Every preset is an internally
 * coherent visual language. Components in the generator read tokens from the
 * ACTIVE preset only, which is what guarantees a cohesive look.
 *
 * `color`, `font`, `type`, `radius`, `shadow`, `spacing`, `motion`, `background`
 * are the SEMANTIC tokens a component should consume. `raw` preserves the exact
 * values pulled from each site's `@theme {}` block so nothing is lost or
 * misrepresented — anything in the semantic layer that wasn't literally present
 * in the source (e.g. a derived tint) is flagged in `meta.derived`.
 */

// ---------------------------------------------------------------------------
// SCHEMA
// ---------------------------------------------------------------------------

/** Attribute tags used by the composition engine to match components to a preset. */
export interface StyleTags {
  tone: "formal" | "neutral" | "friendly" | "bold";
  warmth: "cool" | "neutral" | "warm";
  corner: "sharp" | "medium" | "soft";
  density: "tight" | "normal" | "airy";
  contrast: "low" | "medium" | "high";
  era: "classic" | "timeless" | "modern";
  accentEnergy: "muted" | "medium" | "vibrant";
}

export interface ColorTokens {
  bg: string;          // page background
  surface: string;     // cards / alternating sections
  text: string;        // primary text
  textMuted: string;   // secondary / supporting text
  border: string;      // hairlines & dividers
  primary: string;     // main brand accent
  primaryFg: string;   // text/icon color ON primary
  primarySoft: string; // faint wash/tint of primary for highlight backgrounds
  secondary?: string;  // optional second accent
  secondaryFg?: string;
}

export interface FontTokens {
  body: string;        // --font-sans
  heading: string;     // --font-serif | --font-display (whatever headings use)
  mono?: string;
  /** What kind of type personality the heading face carries. */
  headingRole: "serif-editorial" | "display-grotesk" | "display-geometric";
}

export type FontWeight =
  | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";

export interface TypeTokens {
  /** Largest display size reached on hero headlines (Tailwind text-* step). */
  displayMax: "5xl" | "6xl" | "7xl";
  headlineWeight: FontWeight;
  bodyWeight: FontWeight;
  headlineTracking: "tighter" | "tight" | "normal";
  /** Small caps "eyebrow" labels above headlines — a strong shared signal here. */
  eyebrow: {
    uppercase: boolean;
    tracking: "wide" | "wider" | "widest";
    weight: FontWeight;
  };
}

export interface RadiusTokens {
  /** Default corner radius for cards/inputs/buttons (Tailwind rounded-* step). */
  base: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  pill: "full";
  scale: "sharp" | "medium" | "soft";
}

export interface ShadowTokens {
  elevation: "flat" | "subtle" | "soft";
  /** Tailwind shadow-* step used on raised cards. */
  card: "none" | "sm" | "md" | "lg";
}

export interface SpacingTokens {
  /** Dominant vertical section padding (Tailwind py-* step). */
  sectionY: "py-12" | "py-16" | "py-20" | "py-24" | "py-28";
  rhythm: "tight" | "normal" | "airy";
  containerMax: string; // e.g. "1200px" | "1280px"
  gutter: string;       // base horizontal padding, e.g. "1.5rem"
}

export interface MotionTokens {
  durationMs: number;   // base transition duration
  easing: string;       // CSS timing function
  intensity: "subtle" | "expressive";
}

export interface BackgroundTokens {
  treatment: "flat-white" | "warm-paper" | "tinted";
  /** Whether the design leans on backdrop-blur for glassy overlays/nav. */
  blur: boolean;
  /** Optional colored glow/bloom signature (e.g. on CTAs). */
  bloom?: string;
}

export interface DesignTokens {
  meta: {
    id: string;
    name: string;
    mood: string;           // one-line description of the visual language
    source: string;         // which built site it came from
    derived?: string[];     // semantic values inferred (not literal in source)
  };
  tags: StyleTags;
  color: ColorTokens;
  font: FontTokens;
  type: TypeTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  spacing: SpacingTokens;
  motion: MotionTokens;
  background: BackgroundTokens;
  /** Exact key→value pairs from the site's `@theme {}` block. Ground truth. */
  raw: Record<string, string>;
}

// ---------------------------------------------------------------------------
// PRESETS (extracted from the four built sites)
// ---------------------------------------------------------------------------

/** Boost-Consulting — minimalist editorial, serif-accented, navy + clean blue. */
export const boostConsulting: DesignTokens = {
  meta: {
    id: "boost-editorial",
    name: "Boost Editorial",
    mood: "High-fidelity minimalist; serif display over Inter, navy text, clean blue accent, airy whitespace.",
    source: "Boost-Consulting",
    derived: ["color.primaryFg (#FFFFFF)"],
  },
  tags: { tone: "formal", warmth: "cool", corner: "medium", density: "airy",
          contrast: "high", era: "timeless", accentEnergy: "medium" },
  color: {
    bg: "#FFFFFF", surface: "#F8FAFC", text: "#0F172A", textMuted: "#94A3B8",
    border: "#E2E8F0", primary: "#2563EB", primaryFg: "#FFFFFF",
    primarySoft: "#EFF6FF",
  },
  font: {
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
    heading: '"Playfair Display", Georgia, "Times New Roman", serif',
    mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
    headingRole: "serif-editorial",
  },
  type: {
    displayMax: "6xl", headlineWeight: "semibold", bodyWeight: "light",
    headlineTracking: "tight",
    eyebrow: { uppercase: true, tracking: "widest", weight: "medium" },
  },
  radius: { base: "lg", pill: "full", scale: "medium" },
  shadow: { elevation: "subtle", card: "sm" },
  spacing: { sectionY: "py-20", rhythm: "airy", containerMax: "1280px", gutter: "1.5rem" },
  motion: { durationMs: 300, easing: "cubic-bezier(0.4,0,0.2,1)", intensity: "subtle" },
  background: { treatment: "flat-white", blur: true },
  raw: {
    "--color-brand-navy": "#0F172A",
    "--color-brand-gray": "#F8FAFC",
    "--color-brand-platinum": "#94A3B8",
    "--color-brand-border": "#E2E8F0",
    "--color-brand-accent-blue": "#2563EB",
    "--color-brand-accent-blue-light": "#EFF6FF",
    "--font-sans": "Inter",
    "--font-serif": "Playfair Display",
    "--font-mono": "JetBrains Mono",
  },
};

/** Steuerberatung Andreas Rürup — sharp Swiss corporate, grotesk display, red + forest-green. */
export const ruerup: DesignTokens = {
  meta: {
    id: "ruerup-swiss",
    name: "Rürup Swiss Corporate",
    mood: "Precise, sharp-cornered, flat; Space Grotesk display, anthracite text, signal-red + forest-green accents.",
    source: "Steuerberatung-Andreas-Rürup",
    derived: ["color.primaryFg (#FFFFFF)", "color.primarySoft (tint of beige surface)"],
  },
  tags: { tone: "formal", warmth: "neutral", corner: "sharp", density: "normal",
          contrast: "high", era: "modern", accentEnergy: "vibrant" },
  color: {
    bg: "#FFFFFF", surface: "#E5E7EB", text: "#1C1C1A", textMuted: "#71717A",
    border: "#E5E7EB", primary: "#C8102E", primaryFg: "#FFFFFF",
    primarySoft: "#F3F4F6", secondary: "#1F4E3D", secondaryFg: "#FFFFFF",
  },
  font: {
    body: '"Inter", system-ui, -apple-system, sans-serif',
    heading: '"Space Grotesk", "Inter", system-ui, sans-serif',
    headingRole: "display-grotesk",
  },
  type: {
    displayMax: "7xl", headlineWeight: "medium", bodyWeight: "light",
    headlineTracking: "tight",
    eyebrow: { uppercase: true, tracking: "widest", weight: "medium" },
  },
  radius: { base: "sm", pill: "full", scale: "sharp" },
  shadow: { elevation: "flat", card: "none" },
  spacing: { sectionY: "py-12", rhythm: "normal", containerMax: "1200px", gutter: "1.5rem" },
  motion: { durationMs: 300, easing: "cubic-bezier(0.4,0,0.2,1)", intensity: "subtle" },
  background: { treatment: "flat-white", blur: true },
  raw: {
    "--color-brand-offwhite": "#FFFFFF",
    "--color-brand-anthracite": "#1C1C1A",
    "--color-brand-red": "#C8102E",
    "--color-brand-green": "#1F4E3D",
    "--color-brand-beige": "#E5E7EB",
    "--color-brand-grey": "#71717A",
    "--font-sans": "Inter",
    "--font-display": "Space Grotesk",
  },
};

/** Tureva — soft modern, geometric sans, vibrant lime-green bloom, rounded cards. */
export const tureva: DesignTokens = {
  meta: {
    id: "tureva-soft",
    name: "Tureva Soft Modern",
    mood: "Friendly premium; rounded cards, soft shadows, geometric Outfit/Jakarta type, vibrant lime-green CTA bloom.",
    source: "Tureva",
    derived: ["color.primarySoft (#ECFFE8 tint)", "color.border (= surface)"],
  },
  tags: { tone: "friendly", warmth: "neutral", corner: "soft", density: "airy",
          contrast: "medium", era: "modern", accentEnergy: "vibrant" },
  color: {
    bg: "#FFFFFF", surface: "#F0F2F4", text: "#2D3136", textMuted: "#828E99",
    border: "#F0F2F4", primary: "#34FF18", primaryFg: "#2D3136",
    primarySoft: "#ECFFE8",
  },
  font: {
    body: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    heading: '"Outfit", "Plus Jakarta Sans", sans-serif',
    headingRole: "display-geometric",
  },
  type: {
    displayMax: "7xl", headlineWeight: "bold", bodyWeight: "medium",
    headlineTracking: "tight",
    eyebrow: { uppercase: true, tracking: "wider", weight: "semibold" },
  },
  radius: { base: "2xl", pill: "full", scale: "soft" },
  shadow: { elevation: "soft", card: "md" },
  spacing: { sectionY: "py-20", rhythm: "airy", containerMax: "1280px", gutter: "1.5rem" },
  motion: { durationMs: 300, easing: "cubic-bezier(0.16,1,0.3,1)", intensity: "expressive" },
  background: { treatment: "flat-white", blur: true, bloom: "rgba(52,255,24,0.35)" },
  raw: {
    "--color-brand-green": "#34FF18",
    "--color-brand-graphite": "#2D3136",
    "--color-brand-light-gray": "#F0F2F4",
    "--color-brand-mid-gray": "#828E99",
    "--font-sans": "Plus Jakarta Sans",
    "--font-display": "Outfit",
  },
};

/** Unter dem Strich — warm editorial boutique, paper background, klein-blue + rose, hairlines. */
export const unterDemStrich: DesignTokens = {
  meta: {
    id: "uds-warm-editorial",
    name: "Unter dem Strich Warm Editorial",
    mood: "Boutique editorial on warm paper; sharp corners, hairline borders, ink-blue + rose accents, snappy underline link motion.",
    source: "Unter-Dem-Strich",
    derived: ["color.surface (#FFFFFF cards on paper)", "color.primaryFg (#FFFFFF)", "color.primarySoft (#EAECF6 tint)"],
  },
  tags: { tone: "formal", warmth: "warm", corner: "sharp", density: "airy",
          contrast: "high", era: "timeless", accentEnergy: "medium" },
  color: {
    bg: "#FAF9F6", surface: "#FFFFFF", text: "#1C1C1A", textMuted: "#8A8782",
    border: "#E7E4DD", primary: "#2C3E91", primaryFg: "#FFFFFF",
    primarySoft: "#EAECF6", secondary: "#E3A39B", secondaryFg: "#1C1C1A",
  },
  font: {
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
    heading: '"Plus Jakarta Sans", "Inter", sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    headingRole: "display-geometric",
  },
  type: {
    displayMax: "7xl", headlineWeight: "semibold", bodyWeight: "normal",
    headlineTracking: "tight",
    eyebrow: { uppercase: true, tracking: "widest", weight: "medium" },
  },
  radius: { base: "sm", pill: "full", scale: "sharp" },
  shadow: { elevation: "flat", card: "sm" },
  spacing: { sectionY: "py-24", rhythm: "airy", containerMax: "1200px", gutter: "1.5rem" },
  motion: { durationMs: 200, easing: "ease-out", intensity: "subtle" },
  background: { treatment: "warm-paper", blur: true },
  raw: {
    "--color-brand-bg": "#FAF9F6",
    "--color-brand-text": "#1C1C1A",
    "--color-brand-blue": "#2C3E91",
    "--color-brand-rose": "#E3A39B",
    "--color-brand-border": "#E7E4DD",
    "--color-brand-muted": "#8A8782",
    "--font-sans": "Inter",
    "--font-display": "Plus Jakarta Sans",
    "--font-mono": "JetBrains Mono",
  },
};

/** Swiss Clean — teal + navy on white; synthesized from bexio/Numarics/Selma. */
export const swissClean: DesignTokens = {
  meta: {
    id: "swiss-clean", name: "Swiss Clean", source: "synthesized (references)",
    mood: "Trustworthy CH SaaS: clean grotesk, teal accent + deep navy, light card shadows, tidy.",
  },
  tags: { tone: "formal", warmth: "cool", corner: "medium", density: "airy",
          contrast: "high", era: "modern", accentEnergy: "medium" },
  color: {
    bg: "#FFFFFF", surface: "#F2F7F8", text: "#0E2A33", textMuted: "#5B7682",
    border: "#DCE7EA", primary: "#0EA5A5", primaryFg: "#FFFFFF", primarySoft: "#E6F6F6",
    secondary: "#1E3A5F", secondaryFg: "#FFFFFF",
  },
  font: {
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
    heading: '"Space Grotesk", "Inter", system-ui, sans-serif',
    headingRole: "display-grotesk",
  },
  type: {
    displayMax: "6xl", headlineWeight: "semibold", bodyWeight: "normal",
    headlineTracking: "tight",
    eyebrow: { uppercase: true, tracking: "wider", weight: "semibold" },
  },
  radius: { base: "md", pill: "full", scale: "medium" },
  shadow: { elevation: "subtle", card: "sm" },
  spacing: { sectionY: "py-20", rhythm: "airy", containerMax: "1280px", gutter: "1.5rem" },
  motion: { durationMs: 260, easing: "cubic-bezier(0.4,0,0.2,1)", intensity: "moderate" },
  background: { treatment: "flat-white", blur: true },
  raw: { "--accent-teal": "#0EA5A5", "--ink-navy": "#1E3A5F", "--font-sans": "Inter", "--font-display": "Space Grotesk" },
};

/** Dark Premium — near-black canvas, lavender accent, hairline borders; Linear/Vercel. */
export const darkPremium: DesignTokens = {
  meta: {
    id: "dark-premium", name: "Dark Premium", source: "synthesized (references)",
    mood: "High-craft dark UI: near-black ground, single lavender accent, hairline borders, tight grotesk.",
  },
  tags: { tone: "bold", warmth: "cool", corner: "medium", density: "airy",
          contrast: "high", era: "modern", accentEnergy: "vibrant" },
  color: {
    bg: "#0B0C0E", surface: "#15171A", text: "#F3F5F7", textMuted: "#9BA3AE",
    border: "#262A30", primary: "#6E79F2", primaryFg: "#FFFFFF", primarySoft: "#1B1F3A",
    secondary: "#6E79F2",
  },
  font: {
    body: '"Inter", ui-sans-serif, system-ui, sans-serif',
    heading: '"Space Grotesk", "Inter", system-ui, sans-serif',
    headingRole: "display-grotesk",
  },
  type: {
    displayMax: "7xl", headlineWeight: "semibold", bodyWeight: "normal",
    headlineTracking: "tighter",
    eyebrow: { uppercase: true, tracking: "widest", weight: "medium" },
  },
  radius: { base: "md", pill: "full", scale: "medium" },
  shadow: { elevation: "flat", card: "none" },
  spacing: { sectionY: "py-24", rhythm: "airy", containerMax: "1200px", gutter: "1.5rem" },
  motion: { durationMs: 300, easing: "cubic-bezier(0.16,1,0.3,1)", intensity: "expressive" },
  background: { treatment: "tinted", blur: true },
  raw: { "--accent-lavender": "#6E79F2", "--font-sans": "Inter", "--font-display": "Space Grotesk" },
};

export const presets: Record<string, DesignTokens> = {
  [boostConsulting.meta.id]: boostConsulting,
  [ruerup.meta.id]: ruerup,
  [tureva.meta.id]: tureva,
  [unterDemStrich.meta.id]: unterDemStrich,
  [swissClean.meta.id]: swissClean,
  [darkPremium.meta.id]: darkPremium,
};

export const presetList: DesignTokens[] = [
  boostConsulting, ruerup, tureva, unterDemStrich, swissClean, darkPremium,
];
