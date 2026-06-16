/**
 * Patterns library — the "content" that fills the inventory.
 * For each element (keyed by its components/<category>/<slug> path) it records:
 *   - patterns:        concrete structural + visual patterns seen across the 20 ref sites
 *   - references:      which sites exemplify them
 *   - designLanguages: the design languages (design-languages.ts) the element fits
 * enrich-inventory.ts merges these into each meta.json. categoryDefaults cover
 * any element without a specific entry.
 */
export interface Enrichment {
  patterns: string[];
  references: string[];
  designLanguages: string[];
}

const ALL = ["swiss-clean", "fintech-clean", "editorial-trust", "soft-friendly", "data-precise", "dark-premium"];

export const categoryDefaults: Record<string, Enrichment> = {
  sections: {
    patterns: [
      "Alternate light↔tinted section backgrounds for rhythm; each band full-bleed, content in a max-w container",
      "Lead every section with an uppercase eyebrow label + one display H2",
      "Anchor feature sections with ONE real product/credential visual rather than decorative stock",
    ],
    references: ["Pilot — warm↔cool bg spectrum", "Linear/Vercel — one screenshot per section", "Stripe — restrained section rhythm"],
    designLanguages: ALL,
  },
  navigation: {
    patterns: ["Sticky, translucent + backdrop-blur, hairline bottom border", "logo-left · links-center · dual-CTA-right (text 'Login' + solid primary)", "Persistent single primary CTA repeated in hero + final band"],
    references: ["bexio — sticky + Kostenlos testen", "Stripe/Qonto — logo·menu·dual-CTA", "Linear — Docs/Login/Sign up cluster"],
    designLanguages: ALL,
  },
  footer: {
    patterns: ["4–6 columns segmented by audience/product/company/legal + social row + dynamic © year", "Bake credential / regulatory badges into the footer as permanent furniture"],
    references: ["Vanta — SOC2/ISO/GDPR badges in footer", "Selma — FINMA/OSFIN badges in footer", "bexio — Unternehmer/Treuhänder columns"],
    designLanguages: ALL,
  },
  buttons: {
    patterns: ["Two-tier hierarchy everywhere: solid brand-accent primary + quieter secondary (outline OR underlined text+arrow)", "One accent does ALL CTA work; primary repeated 4–5× verbatim", "Hover = subtle lift (translateY -2/-4px) + color darken"],
    references: ["Pilot — monospace uppercase pills", "Stripe/Qonto — solid primary + text secondary", "Linear — dark primary + → link"],
    designLanguages: ALL,
  },
  cards: {
    patterns: ["icon/image-top OR icon-left → bold headline → supporting text, in 3–4 col grids", "Premium lever: HAIRLINE borders (dark/precise) vs SOFT diffuse shadows (friendly/swiss)", "Low radius for precise/dark, rounded 12–16px for soft/friendly"],
    references: ["Vanta — 6-col icon-top feature cards", "Linear/Vercel — hairline-border cards", "bexio/Numarics — soft-shadow rounded cards"],
    designLanguages: ALL,
  },
  forms: {
    patterns: ["Minimal fields; mono uppercase labels; one solid primary submit", "Reduce friction — inline email field in hero, or a calculator that captures intent before the form"],
    references: ["Mercury — inline email in hero", "Wise — calculator before signup", "Betterment — short form + reassurance copy"],
    designLanguages: ["swiss-clean", "fintech-clean", "soft-friendly", "data-precise"],
  },
  widgets: {
    patterns: ["Interactive proof beats static copy: calculator / quiz / live demo near the top converts + adds the 'wow'", "FAQ accordion + testimonial carousel as the standard objection-handling close"],
    references: ["Wise — hero FX calculator", "Digits — interactive product console hero", "Betterment/Selma — FAQ accordion close"],
    designLanguages: ALL,
  },
  decoration: {
    patterns: ["One signature graphic moment max (gradient OR illustration OR texture) on an otherwise restrained canvas", "Texture/grid overlays at very low opacity (8–20%) add depth without noise"],
    references: ["Stripe/Digits — signature gradient", "Gusto/Carta — illustration system", "Pilot — ledger-grid texture @8–20%"],
    designLanguages: ALL,
  },
  layout: {
    patterns: ["12-col asymmetric splits for hero/about/contact; 3–4 col card grids elsewhere", "Generous whitespace (airy section padding) reads as confidence/premium", "8px spacing grid; hairline rules instead of boxes where possible"],
    references: ["Stripe — 8px grid + restraint", "Pilot — pin-lines over boxes", "Mercury — generous whitespace"],
    designLanguages: ALL,
  },
};

export const enrichments: Record<string, Enrichment> = {
  // ---- SECTIONS ----
  "sections/hero": {
    patterns: [
      "Benefit/outcome headline (sometimes a trust statement), NOT a feature list",
      "Two layouts dominate: centered benefit (Stripe/Vanta/bexio/Linear/Vercel) OR split text-left / product-right (Pilot/Betterment/Selma/Mercury)",
      "1 solid primary CTA + 1 quiet secondary (demo / video / explore); same primary repeats in nav + final band",
      "In-hero trust is near-universal: logo wall + a HARD metric (3,000+/16,000+/CHF X) and/or a rating badge",
      "Show the product/credential immediately (split UI, demo, or screenshot) — not decorative stock",
    ],
    references: ["Wise — live calculator in hero", "Vanta — 'Trust is everything' + 16k logos", "bexio — 4.0/1930 reviews + 100k KMU in hero", "Mercury — inline email + screenshots behind"],
    designLanguages: ALL,
  },
  "sections/services": {
    patterns: [
      "3–4 col card grid: icon (top or left) → bold title → 1-line summary → arrow link",
      "CH differentiator: inline 'ab CHF X/Monat' price chip on the card (digital archetype)",
      "Service catalogue grid can map 1:1 to fiduciary deliverables (Buchhaltung/Steuern/Lohn/MWST)",
      "Each service links to a deep section/page anchored by one product or outcome visual",
    ],
    references: ["Numarics — service grid = payroll/VAT/tax deliverables", "Vanta — 6-card feature grid", "Qonto — icon-left feature cards"],
    designLanguages: ["swiss-clean", "fintech-clean", "soft-friendly", "data-precise"],
  },
  "sections/testimonials": {
    patterns: [
      "Named quote cards: portrait/headshot + quote + name + company + city/logo (anonymous = weak)",
      "Pair quotes with an aggregate metric/rating badge (4.8 / 92% recommend / 1000+ KMU)",
      "Often a carousel; video testimonials raise credibility further",
    ],
    references: ["Pennylane — video-testimonial carousel + dual badges", "Mercury — portrait + blockquote cards", "Betterment — rating 4.8 (78.1K) in hero"],
    designLanguages: ALL,
  },
  "sections/trust-bar": {
    patterns: [
      "Greyscale credential/partner logo strip directly below hero (borrowed credibility before the pitch)",
      "CH trust currency: TREUHAND|SUISSE, EXPERTsuisse, Swiss GAAP FER, RAB; software badges bexio/Abacus",
      "Regulatory/compliance badges also belong permanently in the footer",
    ],
    references: ["Vanta — SOC2/ISO badges as permanent furniture", "Selma — FINMA/OSFIN badges", "Stripe/Notion — marquee logo wall under hero"],
    designLanguages: ["swiss-clean", "fintech-clean", "editorial-trust"],
  },
  "sections/partners": {
    patterns: ["Logo strip/grid, greyscale, equal sizing; or software-partner badges", "Press/award logos (NZZ/HZ/Forbes analog) build third-party credibility"],
    references: ["Selma — Swiss press logos (HZ/FuW/SRF)", "Wealthfront — Forbes/Bankrate award logos", "bexio — partner logo strip"],
    designLanguages: ["swiss-clean", "editorial-trust", "fintech-clean"],
  },
  "sections/values": {
    patterns: ["4–6 'why-us' pillars in a divided band: dot/icon + short title + one line", "The recurring four: digital · transparent · personal · compliant; add Swiss-Made as a pillar"],
    references: ["bexio — Zeit sparen / Swiss-Made / Support pillars", "Pilot — problem/solution pillars", "Qonto — benefit triad"],
    designLanguages: ALL,
  },
  "sections/stats": {
    patterns: ["Big display number + mono label + caption, in a divided/centered band", "CH metrics: clients served, years, cantons, languages; numbers carry trust"],
    references: ["Mercury — 300K+/1-in-3/$20B+/4.9 metrics band", "Linear — '33,000 teams'", "Wealthfront — $95B+/1.4M+"],
    designLanguages: ALL,
  },
  "sections/cta": {
    patterns: ["Repeated closing CTA band before the footer is standard", "Centered headline + sub + one primary; sometimes a dual split (business/personal)", "Tinted (primary-soft) background to lift it off the page"],
    references: ["Mercury — dual final CTA", "Vanta — 'Meet the new standard for trust'", "Most sites — pre-footer CTA band"],
    designLanguages: ALL,
  },
  "sections/contact": {
    patterns: ["Form-left / office-info-right split; booking offered as the PRIMARY path, form as fallback", "Office card: address, +41 phone (tel:), email (mailto:), hours; optional map"],
    references: ["bexio/Selma — booking-first", "Mercury — minimal inline capture", "CH norm — office card + map"],
    designLanguages: ALL,
  },
  "sections/faq": {
    patterns: ["5–8 objection-handling Q&A as a native accordion near the bottom", "Pre-empts: what does it cost, do I need a contract, is it really digital, data protection"],
    references: ["Betterment — FAQ accordion close", "Puzzle — FAQ accordion", "Selma — FAQ before footer"],
    designLanguages: ALL,
  },
  "sections/audience": {
    patterns: [
      "Audience/persona segmentation cards OR a nav split — the single most transferable pattern for fiduciaries",
      "Life-stage cards (Founding→Freelancer→Start-up→Enterprise) or SMB-vs-accountant split",
    ],
    references: ["Numarics — life-stage entry cards", "bexio — Für Unternehmer / Für Treuhänder", "Gusto/Pennylane — audience self-segmentation"],
    designLanguages: ["swiss-clean", "fintech-clean", "soft-friendly"],
  },
  "sections/pricing": {
    patterns: ["Transparent tiers with one recommended highlighted; or a calculator that doubles as lead capture", "Comparison table positioning (us vs alternatives) builds confidence"],
    references: ["Wise — competitor price comparison", "Selma — vs Bank vs Robo table", "Ramp — pricing + implementation checklist"],
    designLanguages: ["data-precise", "fintech-clean", "swiss-clean"],
  },
  "sections/process": {
    patterns: ["3–5 numbered 'how it works' steps; reduces switching anxiety", "Time-based framing dramatizes speed (now → 5 min → month-end)"],
    references: ["Puzzle — time-based speed cards", "Selma — 5-step how-it-works w/ illustrations", "Pilot — onboarding steps"],
    designLanguages: ALL,
  },
  "sections/team": {
    patterns: ["Real faces + name + role + short bio + credentials; central for boutique/owner-led", "Monogram avatar fallback where no photo"],
    references: ["Gusto — people photography", "Mercury — founder quote", "boutique CH norm — owner profile"],
    designLanguages: ["editorial-trust", "soft-friendly", "swiss-clean"],
  },
  "sections/blog-teaser": {
    patterns: ["3–4 latest-article cards (image + tag + headline + date) signal authority + SEO", "Resources / Merkblätter / downloads list as an alternative"],
    references: ["bexio — 4 blog cards", "Pilot — resources section", "Pennylane — resource hub"],
    designLanguages: ["swiss-clean", "fintech-clean", "soft-friendly"],
  },
  "sections/intro": {
    patterns: ["Single max-w column: eyebrow + one large positioning statement + muted supporting line", "Sets 'who we are / why we exist' before the offering"],
    references: ["Stripe — restrained positioning", "Mercury — 'Radically different banking'", "Linear — single feel-statement"],
    designLanguages: ALL,
  },

  // ---- NAVIGATION ----
  "navigation/lang-switch": {
    patterns: ["Header pill/dropdown DE/EN(+FR/IT); table-stakes for CH", "Pairs with a region/country selector on internationally-facing sites"],
    references: ["bexio/Selma — language toggle", "Wise/Qonto — region + language selector"],
    designLanguages: ALL,
  },
  "navigation/dropdown": {
    patterns: ["Mega-menu with grouped links + thumbnails; can carry audience-split entry (SME vs fiduciary)"],
    references: ["bexio — Für Unternehmer/Treuhänder mega-menu", "Wise — dropdowns with imagery", "Stripe — product mega-menu"],
    designLanguages: ["swiss-clean", "fintech-clean", "editorial-trust"],
  },
  "navigation/sticky-translucent": {
    patterns: ["Sticky, translucent + backdrop-blur, hairline border; logo·menu·dual-CTA", "Optional thin top signature/announcement bar above it"],
    references: ["All 20 — sticky shell", "Vercel — event callout bar", "Linear — Docs/Login/Sign up cluster"],
    designLanguages: ALL,
  },

  // ---- BUTTONS ----
  "buttons/primary-solid": {
    patterns: ["Single saturated brand accent, solid fill, repeated 4–5×", "Shape ranges sharp→pill by language; label often mono uppercase for craft"],
    references: ["Vanta — solid navy 'Get a demo' ×5", "Pilot — purple monospace pills", "Linear — dark primary"],
    designLanguages: ALL,
  },
  "buttons/outline": {
    patterns: ["Quiet secondary; transparent + 1px border, inverts on hover", "Used for demo/explore alongside the solid primary"],
    references: ["Qonto — outline 'Find the right plan'", "bexio — secondary video CTA", "Betterment — outline secondary"],
    designLanguages: ALL,
  },
  "buttons/link-arrow": {
    patterns: ["Text link + → that translates on hover; lowest-emphasis tertiary action", "Common 'Read story' / 'Learn more' on cards"],
    references: ["Stripe — underlined text + →", "Linear — → link secondary", "Notion — text + → secondary"],
    designLanguages: ALL,
  },
  "buttons/pill": {
    patterns: ["Fully rounded (999px); reads friendly/modern; often monospace uppercase", "Best for soft-friendly / fintech-clean; avoid for sharp data-precise"],
    references: ["Pilot — full pills", "Qonto — rounded CTAs", "Selma — rounded primary"],
    designLanguages: ["soft-friendly", "fintech-clean"],
  },
  "buttons/bloom-cta": {
    patterns: ["Colored glow/box-shadow bloom on the primary; one signature flourish only", "Pairs with restrained everything-else to avoid gimmick"],
    references: ["Digits — saturated green premium", "Ramp — lime savings accent", "Tureva (repo) — green bloom"],
    designLanguages: ["soft-friendly", "dark-premium", "fintech-clean"],
  },

  // ---- CARDS ----
  "cards/service-tile": {
    patterns: ["icon (top/left) + title + 1-line summary + arrow; 3–4 col grid", "Optional inline price chip; hairline border or soft shadow per language"],
    references: ["Vanta — 6-col feature cards", "Numarics — service grid", "Qonto — icon-left cards"],
    designLanguages: ALL,
  },
  "cards/feature-pillar": {
    patterns: ["Larger card: corner badge + checklist + CTA; for 2-pillar contrasts", "Real screenshot anchors the pillar"],
    references: ["bexio — feature cards w/ screenshots", "Linear — sequential feature anchors"],
    designLanguages: ["swiss-clean", "fintech-clean", "editorial-trust"],
  },
  "cards/stat": {
    patterns: ["Big number + mono label; minimal chrome; grouped in a divided band"],
    references: ["Mercury — metrics band", "Wealthfront — $95B+/1.4M+", "Vercel — perf metrics"],
    designLanguages: ALL,
  },
  "cards/team": {
    patterns: ["Headshot/monogram + name + role + bio; testimonial variant adds quote + company logo"],
    references: ["Mercury — portrait testimonial cards", "Gusto — people photography", "Pennylane — headshot + title + logo"],
    designLanguages: ["editorial-trust", "soft-friendly", "swiss-clean"],
  },
  "cards/partner": {
    patterns: ["Small greyscale logo/credential card; equal sizing in a strip/grid"],
    references: ["Vanta — compliance badges", "Selma — press logos", "bexio — partner logos"],
    designLanguages: ["swiss-clean", "fintech-clean", "editorial-trust"],
  },
  "cards/pricing": {
    patterns: ["Tier card; recommended highlighted with ring/tint; transparent monthly price prominent"],
    references: ["Ramp — pricing cards", "Selma — tier comparison", "Wise — fee transparency"],
    designLanguages: ["data-precise", "fintech-clean", "swiss-clean"],
  },
  "cards/callout": {
    patterns: ["Accent-bordered panel (left/top) for highlights/alerts; icon + heading + body"],
    references: ["Ramp — benefit callouts", "Vanta — recognition callout"],
    designLanguages: ["swiss-clean", "data-precise", "editorial-trust"],
  },

  // ---- FORMS ----
  "forms/contact": {
    patterns: ["Short field set, mono uppercase labels, one solid submit; consent/DSGVO note", "Offer booking as the primary path; form as fallback"],
    references: ["Mercury — inline capture", "Betterment — short form + reassurance", "CH norm — form + office card"],
    designLanguages: ALL,
  },
  "forms/input": {
    patterns: ["Bordered field, token radius, accent focus ring; generous touch targets"],
    references: ["Stripe — refined inputs", "bexio — clean fields"],
    designLanguages: ALL,
  },

  // ---- WIDGETS ----
  "widgets/calculator": {
    patterns: ["Interactive estimator near the top captures intent + adds 'wow'; outputs a recommended package/price", "Doubles as a soft lead-capture before the contact form"],
    references: ["Wise — hero FX calculator", "Ramp — savings calculator", "repo — price/finance widgets"],
    designLanguages: ["data-precise", "fintech-clean", "soft-friendly"],
  },
  "widgets/accordion": {
    patterns: ["Single-open FAQ/services accordion; chevron/plus toggle; objection-handling close"],
    references: ["Puzzle/Betterment/Selma — FAQ accordion"],
    designLanguages: ALL,
  },
  "widgets/client-portal-login": {
    patterns: ["Prominent 'Login' in nav routing to a client portal (AbaWeb/cockpit)", "Signals digital maturity"],
    references: ["bexio — Login + dashboard", "Numarics — cockpit/DocuBox portal"],
    designLanguages: ["swiss-clean", "fintech-clean"],
  },
  "widgets/cookie-consent": {
    patterns: ["nDSG/DSGVO consent banner; accept + settings; quiet, bottom-anchored"],
    references: ["EU/CH norm — Cookiebot/Usercentrics-style"],
    designLanguages: ALL,
  },

  // ---- DECORATION ----
  "decoration/logo-mark": {
    patterns: ["Custom SVG mark + wordmark; single accent color; scales to favicon", "One restrained mark beats elaborate emblems for trust"],
    references: ["Linear/Vercel — minimal marks", "Digits — green D mark", "Stripe — wordmark"],
    designLanguages: ALL,
  },
  "decoration/bg-animated": {
    patterns: ["One signature gradient/video moment at hero scale only; respects reduced-motion", "Mesh gradient (Stripe/Vercel) or animated video (Digits)"],
    references: ["Stripe — minigl gradient wave", "Vercel — single mesh gradient", "Digits — animated video hero"],
    designLanguages: ["fintech-clean", "dark-premium", "editorial-trust"],
  },
  "decoration/divider": {
    patterns: ["Hairline rule + label/dot motif between sections; or branded line graphic"],
    references: ["Pennylane — gradient dividers", "Linear — hairline structure", "repo — TurevaLines"],
    designLanguages: ALL,
  },
  "decoration/icon-box": {
    patterns: ["lucide-style icon in a bordered/tinted square; consistent icon system across the site"],
    references: ["Vanta/Qonto — icon-led cards", "Numarics — custom SVG icons"],
    designLanguages: ALL,
  },
  "decoration/accent-bar": {
    patterns: ["Short colored bar/underline under eyebrows or key words; single accent"],
    references: ["repo presets — eyebrow bars", "Stripe — gradient underline accents"],
    designLanguages: ALL,
  },

  // ---- LAYOUT ----
  "layout/grid-split": {
    patterns: ["12-col asymmetric splits (8/4, 7/5) for hero/about/contact"],
    references: ["Pilot — split hero", "Betterment/Selma — split hero", "Carta — split"],
    designLanguages: ALL,
  },
  "layout/hairline-grid": {
    patterns: ["Zero-gap bordered cells divided by hairlines; premium/editorial feel"],
    references: ["Linear — hairline borders", "Vercel — hairline structure"],
    designLanguages: ["dark-premium", "data-precise", "editorial-trust", "swiss-clean"],
  },
  "layout/section-rhythm": {
    patterns: ["Airy py-20/24 section padding; alternate light↔tinted bands", "Whitespace reads as confidence"],
    references: ["Mercury — generous whitespace", "Stripe — 8px grid restraint", "Pilot — bg spectrum"],
    designLanguages: ALL,
  },
  "layout/card-grid": {
    patterns: ["Responsive 3–4 col grids for features/services; 2-col for stats"],
    references: ["Vanta — 6-col", "Stripe — product card grid", "bexio — 4-col"],
    designLanguages: ALL,
  },
};
