/**
 * Font inventory — the expanded "parts bin" of typefaces the generator chooses
 * from, plus a deterministic per-firm picker.
 *
 * Why this exists: the 8 token presets only ship a handful of faces (Inter /
 * Space Grotesk / Plus Jakarta Sans / Playfair / JetBrains Mono), so every
 * generated firm collapsed onto the same two or three fonts — a strong "all made
 * by the same generator" tell. This module is a larger, curated set of
 * profession-appropriate Google-font PAIRINGS (heading · body · mono), grouped by
 * the three heading roles the system already understands. deriveLook picks one
 * deterministically per firm so two firms rarely share the same type.
 *
 * Curation rules: every face is a real Google Font (loadable via the css2
 * endpoint / index.html), legible at text sizes, and tonally appropriate for a
 * Swiss Treuhänder (serious, precise, trustworthy — never novelty/display-only).
 * Pairings keep heading and body contrast sensible (grotesk display + neutral
 * sans, or serif display + clean sans). Several finance/legal-trust pairings
 * (Corporate Trust = Lexend·Source Sans 3, Financial Trust = IBM Plex Sans,
 * Legal Professional = EB Garamond·Lato) are sourced from the UI/UX Pro Max
 * typography database (finance/legal/professional moods).
 *
 * IMPORTANT: when you add a family here, also add it to the static <link> in
 * index.html (or it won't load in the playground/preview).
 */
import type { FontTokens } from "../tokens.ts";

export interface FontPairing {
  /** Heading family name (Google Fonts, exact). */
  heading: string;
  /** Body family name. */
  body: string;
  /** Mono / eyebrow-label family name. */
  mono: string;
  /** Which heading personality this pairing expresses. */
  role: FontTokens["headingRole"];
  /** Heading is a serif (editorial) face → uses a serif fallback stack. */
  serif?: boolean;
}

/**
 * The inventory. Grouped by role so a firm framed in a grotesk preset gets a
 * grotesk pairing, a geometric preset a geometric one, an editorial/serif preset
 * a serif one — coherence is preserved while the actual faces vary widely.
 */
export const FONT_PAIRINGS: FontPairing[] = [
  // — display-grotesk: modern grotesque headlines (swiss / structured) —
  { heading: "Space Grotesk",      body: "Inter",         mono: "JetBrains Mono", role: "display-grotesk" },
  { heading: "Hanken Grotesk",     body: "Karla",         mono: "Space Mono",     role: "display-grotesk" },
  { heading: "Schibsted Grotesk",  body: "Public Sans",   mono: "JetBrains Mono", role: "display-grotesk" },
  { heading: "Familjen Grotesk",   body: "Mulish",        mono: "Space Mono",     role: "display-grotesk" },
  { heading: "Bricolage Grotesque",body: "Work Sans",     mono: "IBM Plex Mono",  role: "display-grotesk" },
  { heading: "Sora",               body: "IBM Plex Sans", mono: "IBM Plex Mono",  role: "display-grotesk" },

  // — display-geometric: geometric / humanist sans headlines (soft / modern) —
  { heading: "Outfit",             body: "Figtree",       mono: "JetBrains Mono", role: "display-geometric" },
  { heading: "Plus Jakarta Sans",  body: "Karla",         mono: "IBM Plex Mono",  role: "display-geometric" },
  { heading: "Manrope",            body: "Inter",         mono: "Space Mono",     role: "display-geometric" },
  { heading: "Epilogue",           body: "Public Sans",   mono: "JetBrains Mono", role: "display-geometric" },
  { heading: "Be Vietnam Pro",     body: "Mulish",        mono: "DM Mono",        role: "display-geometric" },
  { heading: "Lexend",             body: "Work Sans",     mono: "IBM Plex Mono",  role: "display-geometric" },
  { heading: "Lexend",             body: "Source Sans 3", mono: "JetBrains Mono", role: "display-geometric" }, // UI/UX Pro Max "Corporate Trust" — finance/accessible
  { heading: "IBM Plex Sans",      body: "IBM Plex Sans", mono: "IBM Plex Mono",  role: "display-geometric" }, // UI/UX Pro Max "Financial Trust" — banking/data

  // — serif-editorial: serif display headlines + a clean sans body (boutique) —
  { heading: "Fraunces",           body: "Inter",         mono: "JetBrains Mono", role: "serif-editorial", serif: true },
  { heading: "Source Serif 4",     body: "IBM Plex Sans", mono: "IBM Plex Mono",  role: "serif-editorial", serif: true },
  { heading: "Newsreader",         body: "Public Sans",   mono: "Space Mono",     role: "serif-editorial", serif: true },
  { heading: "Spectral",           body: "Figtree",       mono: "JetBrains Mono", role: "serif-editorial", serif: true },
  { heading: "Lora",               body: "Karla",         mono: "IBM Plex Mono",  role: "serif-editorial", serif: true },
  { heading: "Playfair Display",   body: "Work Sans",     mono: "JetBrains Mono", role: "serif-editorial", serif: true },
  { heading: "EB Garamond",        body: "Lato",          mono: "IBM Plex Mono",  role: "serif-editorial", serif: true }, // UI/UX Pro Max "Legal Professional" — authoritative/formal
];

/** Every distinct family referenced above — handy for static font loading / QA. */
export const INVENTORY_FAMILIES: string[] = [
  ...new Set(FONT_PAIRINGS.flatMap((p) => [p.heading, p.body, p.mono])),
];

/** FNV-1a — same hash family deriveLook uses, salted so the font pick does not
 *  trivially correlate with the preset / colour pick for the same firm. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h | 0);
}

/**
 * Pick a pairing for a firm. Stays within the requested heading role (so it fits
 * the preset's personality); falls back to the whole inventory if a role has no
 * entries. Deterministic per firm key (+seed) so a firm always gets the same
 * type, but a different `seed` regenerates an alternative.
 */
export function pickPairing(role: FontTokens["headingRole"], firmKey: string, seed = 0): FontPairing {
  const pool = FONT_PAIRINGS.filter((p) => p.role === role);
  const list = pool.length ? pool : FONT_PAIRINGS;
  return list[(hash((firmKey || "x") + "·font") + (seed | 0)) % list.length];
}
