/**
 * Design languages — the visual "dialects" distilled from 20 outstanding
 * adjacent sites (see references/sites.ts). Each element in the inventory is
 * tagged with the languages it fits (references/patterns.ts). Each language
 * maps to one or more of the four token presets in tokens.ts.
 */
export interface DesignLanguage {
  id: string;
  name: string;
  traits: string[];
  palette: string;
  type: string;
  corners: string;
  elevation: string;
  motion: string;
  imagery: string;
  exemplars: string[];
  presets: string[]; // tokens.ts preset ids this language maps to
  bestFor: string;   // when to choose it for a Treuhänder
}

export const designLanguages: Record<string, DesignLanguage> = {
  "fintech-clean": {
    id: "fintech-clean", name: "Fintech Clean",
    traits: ["bright", "utilitarian", "proof-forward"],
    palette: "white/light ground + ONE saturated accent (violet/teal); avoids generic fintech navy as the accent",
    type: "variable sans, medium weight; tight tracking on headlines",
    corners: "low radius 4–8px", elevation: "flat to light single-color shadow / thin borders",
    motion: "restrained: hover lifts, autoplay carousels", imagery: "real product UI (bento) + gradient halos",
    exemplars: ["Stripe", "Qonto", "Puzzle", "Pilot", "bexio", "Wealthfront", "Vanta"],
    presets: ["tureva-soft", "ruerup-swiss"],
    bestFor: "Digital-scale fiduciary that wants modern, clear, conversion-led",
  },
  "dark-premium": {
    id: "dark-premium", name: "Dark Premium",
    traits: ["precise", "luxurious", "technical"],
    palette: "near-black/charcoal canvas + single restrained accent (lavender/lime)",
    type: "geometric grotesk, 500–700, aggressive negative tracking",
    corners: "subtle 4–8px", elevation: "HAIRLINE BORDERS over shadows; multi-layer shadow only on floating UI",
    motion: "high craft: ambient gradients, mouse-tracking, precise micro-interactions",
    imagery: "real product UI in dark panels only; no stock photography",
    exemplars: ["Linear", "Vercel", "Digits", "Ramp", "Mercury"],
    presets: ["ruerup-swiss"],
    bestFor: "Premium boutique advisory wanting an exclusive, high-craft signal (use sparingly for trust-sensitive CH market)",
  },
  "soft-friendly": {
    id: "soft-friendly", name: "Soft Friendly",
    traits: ["approachable", "warm", "reassuring"],
    palette: "warm/light ground + friendly accent (green/red/teal); generous whitespace",
    type: "rounded/humanist sans; occasionally a personality serif",
    corners: "rounded 12–16px", elevation: "soft diffuse shadows",
    motion: "light, friendly", imagery: "hand-drawn illustration + real photography of people",
    exemplars: ["Gusto", "Pennylane", "Notion", "Betterment", "Selma"],
    presets: ["tureva-soft", "uds-warm-editorial"],
    bestFor: "Startup-focused / relationship-led firm that wants to feel human and unintimidating",
  },
  "editorial-trust": {
    id: "editorial-trust", name: "Editorial Trust",
    traits: ["mature", "cinematic", "institutional"],
    palette: "cream/warm neutral ground + one restrained accent",
    type: "SERIF or editorial display headlines (broadsheet feel) + sans body",
    corners: "moderate radius", elevation: "light borders + subtle shadow",
    motion: "subtle, premium", imagery: "art-directed, color-graded photography or isometric illustration",
    exemplars: ["Mercury", "Carta", "Gusto", "Stripe (restraint)"],
    presets: ["boost-editorial", "uds-warm-editorial", "quabba-editorial"],
    bestFor: "Established advisory / wealth-leaning firm projecting gravitas and longevity",
  },
  "data-precise": {
    id: "data-precise", name: "Data Precise",
    traits: ["transparent", "metric-led", "engineered"],
    palette: "flat white + functional accent; number/flag color pops",
    type: "sans with strong weight contrast; mono for labels/figures",
    corners: "minimal rounding", elevation: "near-shadowless, typography-driven, hairline rules",
    motion: "light, interactive (calculators, comparison tables)", imagery: "charts, comparison tables, real figures",
    exemplars: ["Wise", "Vercel", "Ramp"],
    presets: ["ruerup-swiss", "zueri-swiss"],
    bestFor: "Pricing-transparent / calculator-driven fiduciary emphasizing clarity and numbers",
  },
  "swiss-clean": {
    id: "swiss-clean", name: "Swiss Clean",
    traits: ["trustworthy", "tidy", "regulated-credible"],
    palette: "white/navy base + teal/turquoise accent used sparingly",
    type: "clean grotesk sans; sparing all-caps labels",
    corners: "moderate rounding", elevation: "light card shadows",
    motion: "moderate (carousels, hover)", imagery: "real product UI + customer photography + credential badges",
    exemplars: ["bexio", "Numarics", "Selma"],
    presets: ["ruerup-swiss", "boost-editorial", "zueri-swiss"],
    bestFor: "Default for most CH KMU fiduciaries — directly mirrors the best Swiss SME platforms",
  },
};

/** preset id -> design languages it best expresses. */
export const presetToLanguages: Record<string, string[]> = {
  "boost-editorial": ["editorial-trust", "swiss-clean"],
  "ruerup-swiss": ["swiss-clean", "data-precise", "dark-premium"],
  "tureva-soft": ["soft-friendly", "fintech-clean"],
  "uds-warm-editorial": ["editorial-trust", "soft-friendly"],
  "quabba-editorial": ["editorial-trust", "swiss-clean"],
  "zueri-swiss": ["swiss-clean", "data-precise", "editorial-trust"],
};
