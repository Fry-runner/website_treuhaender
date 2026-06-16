/**
 * Enrichment layer
 * ================
 * Structural (placement) + visual (look) detail for every inventory element,
 * plus a per-language manifestation map, extracted from a 30-site analysis of
 * outstanding Treuhänder / accounting / Steuerberater websites
 * (see treuhaender-30-sites-analysis.md).
 *
 * The generator (generate_scaffold.ts) merges these fields into each element's
 * meta.json. Keep the inventory (component-inventory.ts) as the structural
 * source of truth; this file only ADDS look/placement/state/real-world detail.
 *
 *   visual         — how the element looks (shape, radius, border, shadow, fill,
 *                    type, icon, colour usage).
 *   placement      — where it sits on the page AND within its own section.
 *   states         — hover / active / focus / scroll behaviour.
 *   animation      — motion choreography (entrance/reveal + interaction motion +
 *                    timing/easing + per-look intensity). Data lives in the
 *                    `animationEnrichment` map at the bottom of this file, keyed
 *                    the same way (slot name or element id); the generator merges
 *                    it in as meta.animation. Honour prefers-reduced-motion.
 *                    Motion character per preset (tokens.ts):
 *                      editorial/swiss ~300ms cubic-bezier(0.4,0,0.2,1), subtle
 *                      warm            ~200ms ease-out, snappy
 *                      soft            ~300ms cubic-bezier(0.16,1,0.3,1), expressive (spring/bloom)
 *   realWorld      — concrete sightings among the 30 analysed sites (evidence).
 *   designLanguage — how the element should manifest in each fitting look
 *                    (the four presets in tokens.ts):
 *                      editorial = boost-editorial (serif, navy, airy)
 *                      swiss     = ruerup-swiss     (grotesk, sharp, signal red/green)
 *                      soft      = tureva-soft       (geometric, rounded, vibrant)
 *                      warm      = uds-warm-editorial (paper, sharp, ink-blue/rose)
 *                      any       = visually neutral primitive
 */
import type { StyleAffinity } from "./component-inventory";

export interface Enrichment {
  visual?: string;
  placement?: string;
  states?: string;
  animation?: string;
  realWorld?: string[];
  designLanguage?: Partial<Record<StyleAffinity, string>>;
}

// ===========================================================================
// SECTION SLOTS  (keyed by Slot)
// ===========================================================================
export const slotEnrichment: Record<string, Enrichment> = {
  hero: {
    visual:
      "Full-bleed top section (≈70–100vh on SaaS, ≈55–70vh on boutique). Oversized display H1 (text-5xl→7xl) with one accent-coloured span; muted lede beneath; eyebrow above (uppercase-tracked OR numbered '01'). SaaS variants anchor the copy with a product mockup / illustration / device frame; boutique variants are type-only on white or warm paper.",
    placement:
      "First block under the sticky nav. Copy left-aligned or centered; supporting visual on the right in 12-col splits (7/5, 8/4). The dual-CTA row sits immediately under the lede; an in-hero trust nibble (rating badge, client count, or partner/award logos) sits just below or beside the CTAs.",
    states:
      "On-load fade / slide-up reveal; product mockups may parallax subtly; CTAs animate per their own button spec.",
    realWorld: [
      "Nexova: left copy + 3 claim chips + 5.0★/93 badge",
      "Magic Heidi: centered + Swiss QR-bill invoice mockup + '5,000+ freelancers'",
      "Pilot: copy left + .avif product illustration right + '3,000+ startups' logo strip",
      "Warringsholz: split copy + founder portrait, 'Kompetent. Persönlich. Digital.'",
      "STG Zürich: type-only heritage hero 'Uns vertrauen Generationen. Seit 1906'",
    ],
    designLanguage: {
      editorial: "Serif H1, wide whitespace, numbered or tracked eyebrow, text-link / all-caps CTA, optional pull-quote aside.",
      swiss: "Grotesk H1 on faint masked-grid bg, pulse-dot availability badge, two sharp solid CTAs, left-aligned.",
      soft: "Geometric H1, centered stack, rounded pill CTAs, product mockup or illustration, Google-rating badge below.",
      warm: "Warm-paper bg, sharp corners, ink-blue accent span, 8/4 text + rose pull-quote aside, snappy underline CTA.",
    },
  },
  intro: {
    visual:
      "Quiet positioning band: eyebrow + a single large statement (text-3xl→4xl, often part-muted) in a narrow column (max-w-3xl), optionally a row of small icon feature-chips beneath.",
    placement:
      "Directly after the hero, before services. Centered single column, or a 5/7 split with chips on the wider side. Generous top/bottom padding to act as a breather.",
    states: "Subtle on-scroll reveal; chips may stagger in.",
    realWorld: [
      "Controva: 'The figures have to add up.' reduced statement",
      "Boost: max-w-3xl serif positioning line",
      "Tureva: 5/7 split statement + feature chips",
    ],
    designLanguage: {
      editorial: "Serif statement, hairline above/below, lots of air.",
      soft: "Geometric statement + rounded icon feature-chips row.",
      warm: "Ink statement on paper, thin rule, restrained.",
    },
  },
  services: {
    visual:
      "The workhorse grid. Cards carry icon + title + 1-line summary + arrow link; CH digital firms add an inline price ('ab CHF 150/Monat'). Soft looks use rounded cards with hover-lift; swiss/editorial use sharp bordered cells; boutiques drop cards for a divided text list.",
    placement:
      "High on the page (slot 4), right after intro. Section header row (eyebrow + H2, optional hint/CTA right) over a 2/3/4-col grid; icons top-center (LPS, Magic Heidi, PMPG) or top-left (bexio, Karbon, Osome). Whole card is usually the click target.",
    states:
      "Hover: border adopts accent OR card lifts with a shadow; arrow link translates right; icon may tint.",
    realWorld: [
      "bexio: 4-col, icon top-left, flat with hover-shadow lift, clickable",
      "Magic Heidi: 3-col, icon top, flat, clickable",
      "Gruber Renger: 3-col photo cards, whole-card clickable 'Zum Rechnungswesen'",
      "Controva: no cards — divided text list of 7 services",
      "Nexova: 6 service cards each with 'ab CHF X' price",
    ],
    designLanguage: {
      editorial: "Bordered divided tiles (divide-x/divide-y hairlines), icon-in-box, uppercase title, arrow link.",
      swiss: "Sharp flat cards or 2 large feature pillars with CheckCircle checklist + outline CTA.",
      soft: "Rounded-2xl cards, soft shadow, hover-lift, vibrant icon chips, clickable to detail.",
      warm: "Sharp hairline cards on paper, or a sidebar selector + animated detail pane with accent bar.",
    },
  },
  stats: {
    visual:
      "Big display numbers (text-4xl→6xl) with a mono/uppercase label and short caption. Either a bordered divided row or a tinted panel with a 2×2 metric grid.",
    placement:
      "Mid-page, often paired with about/testimonials as a credibility beat, or as a thin band between two larger sections. 3 or 4 cells across.",
    states: "Optional count-up on scroll-into-view.",
    realWorld: [
      "bexio: '100,000+ KMU', '4.0 / 1930 reviews'",
      "Bench: '35,000+ owners', '$200M+ saved'",
      "Divisia (CH baseline): 20+ years · 500+ mandates · 1 language · ZH",
    ],
    designLanguage: {
      editorial: "Bordered, divided, centered numbers; restrained.",
      soft: "Tinted panel, rounded, accent numbers.",
      warm: "Label→value telemetry card with accent bar.",
    },
  },
  values: {
    visual:
      "4–6 working-principle pillars: a bullet dot or small icon, a short H4, and one line of body. Read as a calm, scannable band.",
    placement:
      "After services (slot 5). 3-col with vertical hairline dividers, or a 2×2/3×2 grid; top/bottom bordered band, centered eyebrow.",
    states: "Light stagger reveal.",
    realWorld: [
      "Recurring CH four: 100% digital · transparente Preise · persönliche Betreuung · vollständig compliant (Nexova, Divisia)",
      "LPS Treuhand: numbered 01/02/03 value system with SVG icons",
    ],
    designLanguage: {
      editorial: "3-col divide-x hairlines, dot + H4 + muted body.",
      swiss: "Sharp cells, signal-colour bullet, tight.",
      soft: "Rounded icon circles, airy, vibrant accent.",
      warm: "Hairline-divided on paper, ink-blue dots.",
    },
  },
  about: {
    visual:
      "Narrative prose on one side; a supporting portrait, a stats/telemetry card, or a small history timeline on the other. Human and credibility-building.",
    placement:
      "Mid-page. 12-col split (6/6, 8/4, 7/5). For owner-led firms the portrait dominates; for digital firms a stats card replaces the photo.",
    states: "On-scroll reveal; image may have an offset frame.",
    realWorld: [
      "Seal+Co: full-bleed alternating image+text editorial blocks",
      "STG Zürich: heritage narrative replaces imagery",
      "Rürup: narrative + portrait split",
    ],
    designLanguage: {
      editorial: "Prose + offset-framed portrait, serif lead-in.",
      swiss: "Prose + credential portrait frame, sharp.",
      soft: "History 6/6 + mini-stats, rounded.",
      warm: "Narrative + 8/4 stats card on paper.",
    },
  },
  profile: {
    visual:
      "Owner / lead-person spotlight: large portrait split, bio, a numbered qualifications grid, and a personal pull-quote. Signals 'a real expert stands behind this'.",
    placement:
      "Used by boutique/owner-led sites in place of (or before) a team grid. 5/7 portrait split, then qualification cards, then quote.",
    states: "Portrait offset-frame; quote watermark fades in.",
    realWorld: [
      "Controva: named partner Damiana Campagna + 'I look forward to meeting you personally'",
      "Rürup: hero + bio split + qualifications grid + pull-quote",
    ],
    designLanguage: {
      swiss: "Sharp portrait frame, signal-red credential badges, grotesk name.",
      editorial: "Serif name, airy bio, numbered qualifications.",
      warm: "Paper bg, rose accent on quote, ink-blue credentials.",
    },
  },
  audience: {
    visual:
      "Who-we-serve cards: an icon or mono index label, a segment title, one line. Either deep industry pages or 3 persona cards.",
    placement:
      "Mid-page (slot 6). Centered header + 3-col card grid; or a rotating persona carousel.",
    states: "Hover tint/lift; carousel auto-rotates.",
    realWorld: [
      "Nexova: 12 industry verticals (Startups, IT, Medical, NGOs, …)",
      "Osome: 3-persona rotating 'Who we help' carousel",
      "Pilot: cycling persona/CFO scenarios",
    ],
    designLanguage: {
      swiss: "Mono-indexed client-group cells, sharp.",
      soft: "Rounded icon cards, 3-col, vibrant.",
      warm: "A/B/C cards with hairlines on paper.",
      editorial: "Numbered cards, restrained.",
    },
  },
  team: {
    visual:
      "People grid: monogram or photo avatar, name, role badge, short bio, optional tag chips. Real faces = trust currency.",
    placement:
      "Lower-mid page, or a compact teaser panel linking to a full team page. 3-col cards (digital) or 4/8 profile rows with bio (boutique).",
    states: "Hover reveals contact / social; avatar may desaturate→colour.",
    realWorld: [
      "Tureva: 3-col cards, monogram avatar + role badge",
      "UdS: 4/8 profile rows + bio + tag chips",
      "PMPG: '330+ colleagues' framing",
    ],
    designLanguage: {
      soft: "Rounded cards, coloured monogram, role pill.",
      warm: "Hairline profile rows, ink-blue role tag.",
      editorial: "Serif names, generous photo whitespace.",
    },
  },
  process: {
    visual:
      "3 numbered steps (01–03): step number, title, one line; optional connector arrows or an active-step highlight ring.",
    placement:
      "Mid-page, after services/values. md:grid-cols-3; sometimes clickable to highlight the active step.",
    states: "Active step gets an accent ring; connectors animate.",
    realWorld: [
      "Boost: clickable numbered cards with active ring 01–03",
      "Onboarding framing common: 'Onboarding → wir übernehmen → Echtzeit-Zahlen'",
    ],
    designLanguage: {
      editorial: "Numbered cards + arrow connectors, hairlines.",
      soft: "Rounded step cards, active accent ring.",
      any: "Static 3-col numbered steps.",
    },
  },
  pricing: {
    visual:
      "Tier cards (name, description, price+period over a hairline, feature ul, CTA) with one 'recommended' card ringed/tinted; or a calculator that drives the highlight.",
    placement:
      "Lower-mid page (slot 11). lg:grid-cols-3 cards, recommended one centered/elevated; rate tables use 2-col line-item cards.",
    states: "Recommended card elevated; calculator slider re-highlights live; CTA hover per button spec.",
    realWorld: [
      "Osome: 'ACCOUNTING from £71/m' with yellow cdx-marker highlight",
      "Nexova: per-service 'ab CHF X' inline pricing",
      "Boost: 3-col cards, calculator-driven recommended ring",
    ],
    designLanguage: {
      editorial: "Bordered cards, serif price, restrained recommended tint.",
      soft: "Rounded cards, vibrant recommended ring, pill CTA.",
      swiss: "Sharp cards, signal-colour 'empfohlen' badge.",
    },
  },
  partners: {
    visual:
      "Certification / software / award logo strip — usually greyscale, equal-height. Small partner cards (category eyebrow + name + status pill) or a 12-cell award grid.",
    placement:
      "Under the hero as a trust bar, or lower as a dedicated band before the footer.",
    states: "Greyscale → colour on hover; optional marquee scroll.",
    realWorld: [
      "Run my Accounts: badge wall (Best of Swiss Web, Kununu, Top 100)",
      "Karbon: clustered G2/Capterra/GetApp + '18 Consecutive Quarters'",
      "CH certs: TREUHAND SUISSE, EXPERTsuisse, RAB; software bexio/Abacus/Sage/DATEV",
    ],
    designLanguage: {
      any: "Greyscale equal-height logo row.",
      editorial: "Hairline-framed small partner cards with key/value footer.",
      swiss: "Sharp award grid + inverted CTA cell.",
    },
  },
  faq: {
    visual:
      "Objection-handling Q&A — either static stacked cards or a single-open accordion (Plus/Minus). 5–8 entries.",
    placement:
      "Late page (slot 13), before the final CTA. Centered stack max-w-3xl, or 2-col on wide layouts.",
    states: "Accordion expands one panel at a time with height motion; chevron/plus rotates.",
    realWorld: [
      "Canonical CH set: Was macht ein Treuhänder? · Kosten? · Vertrag? · wirklich digital? · Regionen? · Datenschutz?",
      "Statzinger: FAQ + comparison framing",
    ],
    designLanguage: {
      any: "Stacked Q/A cards or single-open accordion.",
      soft: "Rounded accordion, vibrant active state.",
      swiss: "Sharp numbered accordion panels.",
    },
  },
  quote: {
    visual:
      "Large italic display blockquote with attribution; often a giant faint quote-glyph watermark or a thin line motif behind/around it.",
    placement:
      "Used as a philosophy beat between sections; top/bottom bordered band, centered.",
    states: "Watermark fades/parallaxes; text reveals on scroll.",
    realWorld: [
      "Rürup: giant faint Quote watermark + italic philosophy line",
      "Controva: named-partner personal quote",
    ],
    designLanguage: {
      editorial: "Serif italic, faint watermark, airy.",
      swiss: "Grotesk quote, signal-colour rule.",
      warm: "Centered blockquote + 'Strich' line motif on paper.",
    },
  },
  testimonials: {
    visual:
      "Social proof: 2–4 named quote cards (quote, person, company, city — never anonymous) plus an aggregate metric/rating badge. Optional client photo and a linked case study.",
    placement:
      "Slot 7 (briefing backbone) — right after values, as the credibility pivot; or as a carousel lower down. 2–3 col cards, or a rotating slider with arrows.",
    states: "Carousel auto-rotates with arrows/dots; cards lift on hover; star rating renders inline.",
    realWorld: [
      "Avalon: named quotes w/ company + city + case-study links",
      "Statzinger: testimonial carousel + Google 4.9/50 badge",
      "Bench: Trustpilot tiles with faces",
      "Osome: '92% recommend' + photo+quote cards",
    ],
    designLanguage: {
      any: "Named quote cards + aggregate rating badge.",
      soft: "Rounded cards w/ avatar, soft shadow, carousel.",
      warm: "Hairline quote cards on paper, rose accent mark.",
      editorial: "Serif pull-quotes, restrained attribution.",
    },
  },
  cta: {
    visual:
      "Conversion band: short headline + sub + one primary button; optional decorative corners, bloom/glow, or an inverted dark card for contrast.",
    placement:
      "Repeated — at least once mid-page and again before the contact/footer. Centered band, or text-left + button-right teaser.",
    states: "Button hover per spec; soft/dark variants may bloom or have a moving gradient.",
    realWorld: [
      "Universal: 'Bereit? Termin buchen.' band before footer",
      "Gruber Renger: lime CTA repeated 5+ times at section ends",
      "Tureva: scroll-driven bloom on the nearest CTA",
    ],
    designLanguage: {
      editorial: "Inverted navy card, serif headline, blue button.",
      swiss: "Sharp decorated band, signal-red solid button.",
      soft: "Rounded band with lime bloom CTA.",
      warm: "Paper band, ink-blue button, underline-anim link.",
    },
  },
  contact: {
    visual:
      "Form on one side (name/email/phone/service-select/message, mono uppercase labels, required *), office info cards (address, phone, hours) + map on the other. Booking is offered as the primary path, form as fallback.",
    placement:
      "Late page (slot 16), before footer. 12-col split (7/5 form+info, or 5/7 info+form); tabbed calendar/form variant for booking-led firms.",
    states: "Inline validation; success/error banners; field focus adopts accent border.",
    realWorld: [
      "Tureva/UdS: 7/5 form + office directory",
      "Boost: tabbed calendar/booking + form",
      "Run my Accounts: dual path 'Grobofferte' + 'Gespräch'",
    ],
    designLanguage: {
      any: "Form + address/phone/hours cards + map.",
      soft: "Rounded inputs, pill submit, soft card.",
      warm: "Hairline inputs on paper, ink submit.",
      swiss: "Sharp inputs, signal submit, office cards + stylized map.",
    },
  },
  map: {
    visual:
      "Decorative line-map (abstract CH/DE-CH SVG or a custom city street map) with animated location nodes/labels — coverage made tangible.",
    placement:
      "Inside the contact block or as a standalone coverage section for multi-location firms.",
    states: "Nodes pulse / tooltip on hover.",
    realWorld: [
      "Nexova: interactive CH map, 8 cities (Bern, Basel, Zürich, …)",
      "Rürup: abstract DE-CH SVG with animated nodes",
      "UdS: custom Zürich line-map",
    ],
    designLanguage: {
      swiss: "Abstract DE-CH SVG, signal nodes, sharp.",
      warm: "Hand-built Zürich street lines on paper.",
      any: "Text address fallback when single-location.",
    },
  },
};

// ===========================================================================
// ELEMENTS  (keyed by inventory id, e.g. "btn.primary-solid")
//   Plus the scraped-additions, keyed by their full id ("sections/trust-bar").
// ===========================================================================
export const elementEnrichment: Record<string, Enrichment> = {
  // ---- BUTTONS ----------------------------------------------------------
  "btn.primary-solid": {
    visual:
      "Solid accent fill, white (or ink-on-lime) label. Shape follows the look: pill on soft/SaaS, rounded-md on swiss/corporate, sharp on editorial/warm. Label often uppercase-tracked (mono) on editorial/swiss, title-case on soft; frequently carries a trailing arrow or send icon.",
    placement:
      "The page's single most important action. Top-right of the nav ('Termin buchen' / 'Get started' / 'Book a demo') — near-universal across all 30 sites; first of the hero dual-CTA pair; repeated at section ends and in the final CTA band + footer.",
    states: "Hover: brightness/elevation shift or arrow translate; active: slight press; focus: accent ring.",
    realWorld: [
      "Magic Heidi: teal pill 'Start Free' top-right + hero",
      "Gruber Renger: lime rounded 'Erstgespräch buchen' repeated 5+×",
      "Collective: dark rectangular 'Get started'",
      "Run my Accounts: navy pill 'Offerte' in nav",
    ],
    designLanguage: {
      editorial: "Navy fill, sharp/rounded-md, uppercase mono label + arrow.",
      swiss: "Signal-red/anthracite fill, rounded-sm, tracked uppercase label.",
      soft: "Lime/teal pill, title-case, soft shadow, optional bloom.",
      warm: "Ink-blue fill, sharp, mono label, snappy hover.",
    },
  },
  "btn.outline": {
    visual: "Transparent with a 1px accent/neutral border; inverts to a filled accent on hover. Same radius lane as the primary.",
    placement: "The hero's SECOND CTA (secondary to the solid primary), and inside cards/pricing where a softer action is needed.",
    states: "Hover fills with brand colour, label flips to contrast; focus ring.",
    realWorld: [
      "Magic Heidi: outlined 'Watch Demo →' beside solid primary",
      "Karbon: outlined 'Take a Tour' beside 'Book a Demo'",
      "Pilot: outline/ghost secondary",
    ],
    designLanguage: {
      swiss: "Sharp border → signal fill invert.",
      soft: "Pill border → vibrant fill.",
      editorial: "Hairline border → navy fill, mono label.",
      warm: "Sharp ink border → fill on paper.",
    },
  },
  "btn.link-arrow": {
    visual: "Text link, often mono uppercase, with a trailing ArrowRight and a thin bottom border; the arrow nudges right on hover.",
    placement: "Card footers ('Mehr erfahren →', 'Read More'), service tiles, and inline 'learn more' affordances throughout sections.",
    states: "Group-hover translates the arrow and may grow the underline.",
    realWorld: [
      "LPS Treuhand: underlined 'Learn more' text links instead of buttons",
      "Pilot: arrow text-links repeated under features",
      "London Accountants: 'Read More' on every service card",
    ],
    designLanguage: { any: "Mono uppercase + arrow translate.", editorial: "Serif-adjacent, hairline underline.", warm: "Underline scales from left on hover." },
  },
  "btn.underline-anim": {
    visual: "Plain text link whose underline scales in from the left (::after scaleX) on hover — quiet, editorial.",
    placement: "Nav links and inline prose links on boutique/editorial sites; secondary actions where a box would be too loud.",
    states: "Underline grows left→right on hover, retracts on leave.",
    realWorld: ["UdS: .hover-underline-anim nav + links", "Controva: minimal inline links", "STG Zürich: blue text links"],
    designLanguage: { warm: "Ink-blue, scaleX underline.", editorial: "Navy, subtle.", swiss: "Anthracite, snappy." },
  },
  "btn.bloom-cta": {
    visual: "Rounded-full button that starts slightly faded and blooms to full colour with a coloured box-shadow glow when it becomes the active/nearest CTA.",
    placement: "Primary CTAs on soft/vibrant sites where a scroll observer highlights whichever CTA is nearest viewport-center.",
    states: "Scroll-driven: fades→full + glow when active; hover deepens the bloom.",
    realWorld: ["Tureva: .cta-btn-interactive lime bloom tied to scroll observer"],
    designLanguage: { soft: "Lime rounded-full, rgba bloom shadow." },
  },
  "btn.pill": {
    visual: "Fully rounded (rounded-full) solid or outline button — the default CTA shape of the SaaS/fintech tier.",
    placement: "Nav CTA and hero CTAs on soft-language sites; also used for filter/segment toggles and small badges.",
    states: "Hover elevation/brightness; active press.",
    realWorld: ["bexio, Accounto, Osome, Pilot, Karbon, Magic Heidi: pill CTAs throughout"],
    designLanguage: { soft: "Vibrant fill pill, title-case.", any: "Neutral rounded-full." },
  },
  "btn.tab": {
    visual: "Underline-tab toggle (border-b-2 on the active tab); flat, text-only.",
    placement: "Inside widgets — contact 'Calendar | Form' switcher, pricing monthly/yearly, service category filters.",
    states: "Active tab shows accent underline; inactive muted.",
    realWorld: ["Boost: calendar/form tabs in contact"],
    designLanguage: { any: "Accent border-b active.", swiss: "Sharp, signal underline." },
  },
  "btn.icon": {
    visual: "Square or round icon-only button (lucide icon): close X, refresh, restart, slot-select, carousel arrows.",
    placement: "Modal corners, carousel edges, form resets, mobile nav toggles.",
    states: "Hover bg/tint; focus ring; rotates for toggles.",
    realWorld: ["All built sites: carousel arrows, modal close, mobile hamburger", "Pilot/Bench/Statzinger: testimonial carousel arrows"],
    designLanguage: { any: "Icon in subtle bordered/round container." },
  },
  "btn.destructive": {
    visual: "Red mono text link with a Trash2/X icon — low-emphasis, never a filled box.",
    placement: "Inside trackers/admin-ish widgets (delete a saved inquiry, cancel a booking).",
    states: "Hover deepens red.",
    realWorld: ["Boost: delete/cancel in inquiry tracker"],
    designLanguage: { any: "Red text + icon, no fill." },
  },
  "btn.card-as-button": {
    visual: "A whole card (service/audience/team) is the click target — no inner button; an arrow or hover-border signals interactivity.",
    placement: "Service and industry grids where each tile routes to a detail view.",
    states: "Hover: border adopts accent / card lifts; arrow translates.",
    realWorld: [
      "Gruber Renger: 'Zum Rechnungswesen' whole-card click",
      "bexio, Karbon, Osome, Warringsholz: clickable service tiles",
    ],
    designLanguage: { any: "Full card link, hover border/lift.", soft: "Rounded card lifts on hover.", editorial: "Sharp tile, hairline → accent border." },
  },

  // ---- CARDS ------------------------------------------------------------
  "card.service-tile": {
    visual:
      "Bordered or shadowed cell: icon (top-center or top-left) + title + 1-line summary + optional check-list + arrow link; CH digital variants add an inline 'ab CHF X' price line.",
    placement:
      "Within the services grid — 2/3/4 across. Icon anchors the top; the arrow link/price sits at the bottom edge; the whole tile is commonly clickable.",
    states: "Hover: border→accent (sharp looks) OR lift+shadow (soft looks); arrow nudges; icon tints.",
    realWorld: [
      "Magic Heidi: 3-col, icon top, flat, clickable",
      "bexio: 4-col, icon top-left, hover-shadow lift",
      "Nexova: price line on each tile",
    ],
    designLanguage: {
      editorial: "Sharp hairline cell, icon-in-box, uppercase title.",
      swiss: "Flat bordered, signal hover border.",
      soft: "Rounded-2xl, soft shadow, hover-lift, vibrant icon.",
      warm: "Sharp hairline tile on paper, ink arrow.",
    },
  },
  "card.feature-pillar": {
    visual: "Large card with a corner badge, a CheckCircle benefit checklist, and an outline CTA at the bottom — heavier than a service tile.",
    placement: "2-col 'big pillar' service layouts; each pillar is a self-contained offer with its own CTA.",
    states: "Hover lifts subtly; CTA inverts.",
    realWorld: ["Rürup: 2 feature pillars w/ checklist + outline CTA", "Magic Heidi/bexio: feature blocks with checklists"],
    designLanguage: { swiss: "Sharp, corner badge, signal checks.", editorial: "Bordered, navy checks, serif title." },
  },
  "card.stat": {
    visual: "Big display number + mono/uppercase label + caption; bordered cell or borderless.",
    placement: "Inside the stats band, 3–4 across, or embedded in an about-split as a 2×2 metric card.",
    states: "Optional count-up on view.",
    realWorld: ["Bench '$200M+'", "bexio '100,000+ KMU'", "Divisia '500+ Mandate'"],
    designLanguage: { any: "Number + label + caption.", soft: "Accent number, rounded panel.", warm: "Telemetry label→value." },
  },
  "card.telemetry": {
    visual: "Label→value rows (STANDORT / FOKUS / GRÜNDUNG) with a thin accent bar — a 'data plate' look.",
    placement: "Beside about/profile prose, or as a registry/credentials card.",
    states: "Static; accent bar may animate width on reveal.",
    realWorld: ["UdS: STANDORT/FOKUS/GRÜNDUNG plate", "Tureva: registry card"],
    designLanguage: { warm: "Hairline rows on paper, ink accent bar.", soft: "Rounded, mid-gray labels." },
  },
  "card.pricing": {
    visual: "Tier card: name, description, price block over a hairline, feature ul with checks, CTA; the recommended tier gets a ring/tint or elevation.",
    placement: "Pricing grid (lg:grid-cols-3); recommended card centered/raised.",
    states: "Recommended elevated; hover lift; calculator can re-highlight live.",
    realWorld: ["Boost: calculator-driven recommended ring", "Osome: highlighted plan", "Pilot/Bench: tiered plans"],
    designLanguage: { soft: "Rounded, vibrant recommended ring, pill CTA.", editorial: "Bordered, serif price.", swiss: "Sharp, 'empfohlen' signal badge." },
  },
  "card.partner": {
    visual: "Small bordered card: category eyebrow, partner/cert name, short desc, status pill; or a plain greyscale logo cell.",
    placement: "Partners/trust grid; logo strips under hero or above footer.",
    states: "Greyscale→colour on hover.",
    realWorld: ["Run my Accounts: award/cert badges", "CH: TREUHAND SUISSE / EXPERTsuisse / RAB + bexio/Abacus"],
    designLanguage: { editorial: "Hairline card + key/value footer.", any: "Greyscale logo cell." },
  },
  "card.audience": {
    visual: "Icon circle (or mono index label) + segment title + one line; compact persona/industry card.",
    placement: "Audience grid, 3-col; or carousel slides.",
    states: "Hover tint/lift; carousel rotates.",
    realWorld: ["Osome: 3-persona carousel", "Nexova: 12 industry cards"],
    designLanguage: { swiss: "Mono index label, sharp.", soft: "Rounded icon circle, vibrant.", warm: "Hairline card, ink index." },
  },
  "card.team": {
    visual: "Monogram or photo avatar + name + role badge + short bio; or a 4/8 profile row with bio + tag chips.",
    placement: "Team grid (3-col cards) or stacked profile rows; teaser panel links to full page.",
    states: "Hover reveals contact/socials; avatar desaturate→colour.",
    realWorld: ["Tureva: monogram + role pill", "UdS: profile rows + tags"],
    designLanguage: { soft: "Rounded card, coloured monogram.", warm: "Hairline row, ink role tag.", editorial: "Serif name, photo whitespace." },
  },
  "card.office": {
    visual: "Bordered card with an icon header and tel / mail / clock / address rows as links.",
    placement: "Contact section beside the form; one card per location.",
    states: "Row hover underlines; click-to-call/mail.",
    realWorld: ["Rürup/Tureva/UdS: office cards with contact rows", "Nexova: 8 city cards"],
    designLanguage: { any: "Bordered contact rows.", warm: "Hairline on paper.", soft: "Rounded, soft shadow." },
  },
  "card.callout": {
    visual: "Accent-bordered panel (left-border or top-accent, or a rose/blue tint): icon + heading + body — used to emphasise one message.",
    placement: "Inline within services/about to flag a key note, or as a highlight strip.",
    states: "Static; subtle reveal.",
    realWorld: ["Rürup: red left-border callout", "Boost/UdS: top-accent tinted callouts"],
    designLanguage: { swiss: "Signal-red left border.", warm: "Rose/blue tint, sharp.", editorial: "Navy top-accent." },
  },
  "card.tag-chip": {
    visual: "Small bordered uppercase mono chip — certifications, registry numbers, language badges.",
    placement: "Under team names, in footers/trust rows, beside hero claims.",
    states: "Static; optional hover tint.",
    realWorld: ["Tureva/UdS/Rürup: cert + registry chips", "Magic Heidi: 'Swiss-Made Software' eyebrow chip"],
    designLanguage: { any: "Mono uppercase bordered chip.", soft: "Rounded pill chip." },
  },
  "card.tracker-row": {
    visual: "Bordered list row: id + date + status badge + action — a lightweight record line.",
    placement: "Inside engagement widgets (saved inquiries/bookings) persisted to localStorage.",
    states: "Status badge colour-codes; row hover; delete action.",
    realWorld: ["Boost/Tureva/UdS: inquiry tracker rows"],
    designLanguage: { any: "Bordered row + status badge." },
  },
  "card.result": {
    visual: "Tinted recommendation card with a Sparkles icon, a verdict line, and CTAs — the payoff of a quiz/calculator.",
    placement: "End of an interactive widget flow.",
    states: "Scale-in on reveal; CTA hover.",
    realWorld: ["UdS: quiz result card with verdict + CTAs"],
    designLanguage: { any: "Tinted card, icon + verdict.", soft: "Rounded, vibrant tint." },
  },
  "card.banner": {
    visual: "Inline status banner (emerald success / red error) with an icon; auto-dismiss.",
    placement: "Above/below forms after submit.",
    states: "Slide/fade in, auto-dismiss after timeout.",
    realWorld: ["All built sites: form success/error banners"],
    designLanguage: { any: "Emerald/red inline banner with icon." },
  },

  // ---- NAVIGATION -------------------------------------------------------
  "nav.sticky-translucent": {
    visual:
      "Sticky top bar, h-20, bg/90 + backdrop-blur, bottom hairline, max-w-7xl. Logo (custom SVG or wordmark+subtitle) left · nav links center · CTA right.",
    placement:
      "Pinned at top across all sites. Logo always left; primary CTA always top-right; links centered (soft/editorial) or right-clustered (corporate).",
    states: "Shrinks/solidifies on scroll; blur intensifies; active link underline slides.",
    realWorld: [
      "Magic Heidi/bexio/Pilot/Osome/Karbon: sticky blurred bars",
      "STG / Controva / Accounto / Fineac: NON-sticky, opaque (classic tier)",
    ],
    designLanguage: {
      editorial: "Wordmark + subtitle, thin hairline, serif-adjacent links.",
      swiss: "Wordmark, sharp, pulse-dot status, grotesk links.",
      soft: "Custom SVG logo, pill CTA, blur.",
      warm: "Wordmark + hover-grow accent line, 1.5px signature bar above.",
    },
  },
  "nav.active-underline": {
    visual: "Active nav item carries a sliding/animated underline bar (layoutId spring) or a static accent underline.",
    placement: "Desktop link row; indicator tracks the current section/page.",
    states: "Spring-slides between items on route/scroll change.",
    realWorld: ["Rürup/UdS/Tureva: animated underline", "Boost: static accent underline"],
    designLanguage: { any: "Sliding underline.", swiss: "Signal-colour bar.", soft: "Vibrant spring underline." },
  },
  "nav.dropdown": {
    visual: "Hover dropdown / mega-menu: a panel of title+subtext entries (and sometimes columns) with a rotating ChevronDown.",
    placement: "On service-heavy nav items ('Leistungen', 'Accounting', 'Platform').",
    states: "Reveals on hover/focus; chevron rotates; panel fades/slides.",
    realWorld: [
      "bexio: two-tier audience nav (Unternehmer / Treuhänder) + dropdowns",
      "Pilot/Osome/London/Karbon: multi-column mega-menus",
    ],
    designLanguage: { any: "Title+subtext dropdown panel.", soft: "Rounded panel, soft shadow.", swiss: "Sharp panel, hairlines." },
  },
  "nav.lang-switch": {
    visual: "Segmented pill DE/EN(/FR/IT) toggle or a Globe menu; active = filled chip. CH region/locale where relevant.",
    placement: "Top-right of nav (CH multilingual) or in the footer (intl region switch).",
    states: "Active chip filled; switching swaps content locale.",
    realWorld: [
      "Findea: DE/FR/IT/EN switch top-right",
      "Accounto/PMPG/Controva: DE/EN toggle",
      "Osome/Karbon: region switch in footer (UK/SG/…)",
    ],
    designLanguage: { any: "Segmented pill toggle.", soft: "Rounded chips.", swiss: "Sharp DE/EN segments." },
  },
  "nav.mobile-drawer": {
    visual: "Hamburger → AnimatePresence height drawer: stacked links with an active left-border accent and a full-width CTA at the bottom.",
    placement: "Mobile/tablet; toggled from the top-right hamburger.",
    states: "Slides/expands; active link left-border; body scroll locks.",
    realWorld: ["All built sites + most SaaS: animated drawer with full-width CTA"],
    designLanguage: { any: "Height drawer, full-width CTA.", soft: "Rounded items.", warm: "Hairline items, ink accent border." },
  },
  "nav.signature-bar": {
    visual: "A thin (≈1.5px) full-width coloured bar fixed above the header — a quiet brand signature.",
    placement: "Very top of the page, above the nav.",
    states: "Static.",
    realWorld: ["UdS: ink-blue 1.5px signature bar"],
    designLanguage: { warm: "Ink-blue hairline bar.", editorial: "Navy hairline bar." },
  },

  // ---- FOOTER -----------------------------------------------------------
  "footer.multicol": {
    visual:
      "3–4 column grid: brand + tagline · sitemap · offices/address · network/trust badges; a bottom bar with the dynamic © year and legal triggers (Impressum/Datenschutz).",
    placement: "Page foot. Brand block left; link columns center; trust/social right; legal bar spans the bottom.",
    states: "Link hover underline; year auto-updates.",
    realWorld: [
      "Findea: 'Made with ❤️ in Winterthur'",
      "Karbon/Osome: region switch lives here",
      "All built sites: offices + sitemap + legal + © year",
    ],
    designLanguage: {
      editorial: "3-col brand/sitemap/network, hairlines.",
      swiss: "12-col offices + sitemap + RAB badge, sharp.",
      soft: "4-block with language box, rounded.",
      warm: "Brand + live clock + compliance, paper.",
    },
  },
  "footer.extras": {
    visual: "Optional widgets embedded in footer columns: live local clock, language-capabilities box, social pills, SSL/UID/D&O trust badges.",
    placement: "Within footer columns, secondary to the sitemap.",
    states: "Clock ticks (setInterval); badges static.",
    realWorld: ["UdS: live Zürich clock", "Tureva: language-capabilities box", "Boost: LinkedIn pill"],
    designLanguage: { any: "Inline footer widgets.", warm: "Ticking Zürich clock." },
  },

  // ---- FORMS ------------------------------------------------------------
  "form.contact": {
    visual: "2-col paired rows (name/email, phone/service-select) + full-width textarea; mono uppercase labels; required *; primary submit with send icon.",
    placement: "Contact section, one side of a 7/5 or 5/7 split opposite the office info.",
    states: "Inline validation, focus accent border, success/error banner on submit.",
    realWorld: ["All built sites", "Run my Accounts: 'Grobofferte' form", "Statzinger: 'Erstgespräch' form"],
    designLanguage: { any: "Mono labels, accent focus, send icon.", soft: "Rounded fields, pill submit.", warm: "Hairline fields on paper." },
  },
  "form.input": {
    visual: "Consistent field styling driven by tokens: border, focus-accent ring, radius per preset (sharp on swiss/warm, rounded on soft).",
    placement: "All forms and search/calculator inputs.",
    states: "Focus adopts accent border/ring; invalid → red border.",
    realWorld: ["All built sites: token-driven inputs"],
    designLanguage: { soft: "rounded-xl, soft focus ring.", swiss: "rounded-sm, signal focus.", warm: "sharp, ink focus." },
  },
  "form.validation": {
    visual: "Required-field guard → inline error text + error/success banners with icons.",
    placement: "On submit, adjacent to fields and at the form head.",
    states: "Blocks submit on empty required; banner auto-dismisses.",
    realWorld: ["All built sites: empty-check + banners"],
    designLanguage: { any: "Red error / emerald success banner." },
  },
  "form.persistence": {
    visual: "Submitted entries saved to localStorage and listed as tracker rows with status badges + delete.",
    placement: "Below the form or in a dedicated 'your inquiries' panel.",
    states: "Records persist across reloads; status can progress.",
    realWorld: ["Boost/Tureva/UdS: inquiry persistence"],
    designLanguage: { any: "Tracker rows + status badges." },
  },
  "form.extras": {
    visual: "Supplementary fields/notes: newsletter checkbox, consent/DSGVO note, partner-select, booking fields.",
    placement: "Beneath the main fields; consent note near the submit.",
    states: "Checkbox toggles; consent required for submit.",
    realWorld: ["All built sites: DSGVO/nDSG consent note", "Findea/Osome: newsletter signup"],
    designLanguage: { any: "Checkbox + small-print consent." },
  },

  // ---- WIDGETS ----------------------------------------------------------
  "widget.modal": {
    visual: "Fixed overlay with backdrop-blur, a scrollable scale-in dialog, and corner close buttons — used for Impressum/Datenschutz.",
    placement: "Triggered from footer legal links; centered overlay.",
    states: "Scale/fade-in; backdrop click + X close; body scroll lock.",
    realWorld: ["Boost/Rürup: legal modals"],
    designLanguage: { any: "Blur backdrop, scale-in dialog." },
  },
  "widget.accordion": {
    visual: "Single-open expandable list (Plus/Minus toggle) with height-animated body.",
    placement: "FAQ and accordion-style services.",
    states: "One panel open at a time; icon morphs; height springs.",
    realWorld: ["Rürup/Tureva: accordions", "Findea: expandable service cards"],
    designLanguage: { any: "Plus/Minus, height motion.", soft: "Rounded panels.", swiss: "Sharp numbered panels." },
  },
  "widget.tabs": {
    visual: "Toggle between panels — calendar/form tabs, or a sidebar selector + detail pane.",
    placement: "Contact (booking vs form), services (selector + detail).",
    states: "Active tab underline; panel cross-fades.",
    realWorld: ["Boost: calendar/form tabs", "UdS: sidebar service selector"],
    designLanguage: { any: "Tab/selector + panel.", warm: "Sidebar list + animated detail w/ accent bar." },
  },
  "widget.booking": {
    visual: "3-step wizard (date → form → success) with a slot grid; a mock Calendly flow.",
    placement: "Contact section as the primary 'Termin buchen' path.",
    states: "Stepper progress; slot select; success state persisted.",
    realWorld: ["Boost: booking wizard", "Nexova/Findea: 'Termin buchen' primary path"],
    designLanguage: { any: "Stepper + slot grid.", soft: "Rounded slots, pill next." },
  },
  "widget.calculator": {
    visual: "Range slider(s) → a highlighted recommended pricing card / live estimate.",
    placement: "Pricing section or a standalone 'Preisrechner' — doubles as a lead-gen hook.",
    states: "Slider drives a live re-highlight of the matching tier.",
    realWorld: ["Boost: price calculator", "Nexova: 'Preisrechner' CTA", "Findea: cost framing"],
    designLanguage: { any: "Slider → highlighted card.", soft: "Vibrant track + bloom result." },
  },
  "widget.quiz": {
    visual: "Multi-step stepper with a progress bar → a heuristic recommendation result card.",
    placement: "Engagement/lead-gen block, often mid-page.",
    states: "Step progress; computes a verdict; result scales in.",
    realWorld: ["UdS: 3-step service quiz", "Statzinger/Osome: persona-routing logic"],
    designLanguage: { any: "Stepper + progress + result card." },
  },
  "widget.simulator": {
    visual: "Sliders compute an SVG sine-wave path + a status verdict with a celebration state — a signature 'wow' interaction.",
    placement: "A hero-adjacent or mid-page showpiece; brand-specific.",
    states: "Live SVG path recompute; verdict colour shifts; celebration on 'good' state.",
    realWorld: ["UdS: FinanceSimulator", "Magic Heidi: live QR-bill mockup as showpiece"],
    designLanguage: { any: "Sliders → live SVG verdict.", soft: "Vibrant wave, playful." },
  },
  "widget.scroll-cta": {
    visual: "A passive scroll observer that glows whichever CTA is nearest viewport-center.",
    placement: "Page-wide behaviour layered onto CTA buttons.",
    states: "Toggles an 'active/bloom' class as the user scrolls.",
    realWorld: ["Tureva: nearest-CTA bloom highlighter"],
    designLanguage: { soft: "Lime bloom on active CTA." },
  },
  "widget.clock": {
    visual: "A ticking local-time display (setInterval).",
    placement: "Footer, as a locality cue.",
    states: "Updates every second.",
    realWorld: ["UdS: live Zürich time"],
    designLanguage: { warm: "Mono Zürich clock.", any: "Mono local time." },
  },
  "widget.map-interactive": {
    visual: "SVG map with hoverable/clickable location nodes and tooltips.",
    placement: "Contact or coverage section for multi-location firms.",
    states: "Nodes pulse; tooltip on hover; click scrolls to office.",
    realWorld: ["Nexova: 8-city CH map", "Rürup: animated DE-CH nodes"],
    designLanguage: { swiss: "Abstract CH SVG, signal nodes.", warm: "Zürich street lines." },
  },

  // ---- DECORATION -------------------------------------------------------
  "decor.logo-mark": {
    visual: "Inline SVG brand mark (infinity ∞, double-T monogram, custom glyph) in header + footer.",
    placement: "Top-left of nav and in the footer brand block.",
    states: "May animate on hover (stroke draw / subtle morph).",
    realWorld: ["Boost: ∞", "Tureva: double-T", "STG: SVG wordmark"],
    designLanguage: { any: "Inline SVG mark.", soft: "Rounded geometric glyph.", editorial: "Refined serif-adjacent mark." },
  },
  "decor.divider": {
    visual: "Branded section divider: hairline + label/dot motif, or a custom line graphic ('Strich', flowing lines).",
    placement: "Between sections to pace the page.",
    states: "May animate width/draw on reveal.",
    realWorld: ["UdS: 'Strich' line motif", "Tureva: TurevaLines", "Accounto: SVG section-divider patterns"],
    designLanguage: { warm: "'Strich' hairline + label.", soft: "Flowing line graphic.", any: "Hairline + dot." },
  },
  "decor.bg-animated": {
    visual: "Fixed/absolute decorative layer behind content: flowing ribbons, masked grid, or faint gridlines.",
    placement: "Behind hero/sections, low opacity.",
    states: "Slow drift/parallax; respects reduced-motion.",
    realWorld: ["Tureva: ribbons", "Rürup/Boost: masked grid", "UdS: faint gridlines"],
    designLanguage: { soft: "Flowing ribbons.", swiss: "Masked technical grid.", warm: "Faint paper gridlines." },
  },
  "decor.accent-bar": {
    visual: "Short coloured bar (w-16 h-1 / w-8 h-[2px]) under eyebrows/headings.",
    placement: "Directly beneath eyebrow labels and section headings.",
    states: "May grow width on reveal.",
    realWorld: ["Boost/Tureva/UdS: accent bars under eyebrows"],
    designLanguage: { any: "Accent underline bar.", swiss: "Signal-colour bar.", soft: "Lime bar." },
  },
  "decor.pulse-dot": {
    visual: "Animated rounded-full dot (ping) — availability/status indicator beside an eyebrow.",
    placement: "In hero eyebrows ('Jetzt verfügbar'), nav status.",
    states: "Pings/pulses continuously.",
    realWorld: ["Rürup: pulse-dot hero badge", "Boost/UdS: status dots"],
    designLanguage: { any: "Pinging dot.", swiss: "Green availability ping.", soft: "Vibrant pulse." },
  },
  "decor.icon-box": {
    visual: "A lucide icon inside a ~40×40 bordered square box.",
    placement: "Atop service tiles and value items (editorial/swiss looks).",
    states: "Hover tints box/icon.",
    realWorld: ["Boost/Rürup: bordered icon boxes on service tiles"],
    designLanguage: { editorial: "Hairline box, navy icon.", swiss: "Sharp box, signal icon." },
  },
  "decor.monogram": {
    visual: "Initials on a solid colour block as a placeholder avatar, with a role badge.",
    placement: "Team cards/rows when photos aren't available.",
    states: "Hover may reveal contact.",
    realWorld: ["Tureva/UdS: monogram avatars"],
    designLanguage: { soft: "Rounded coloured monogram.", warm: "Square ink monogram." },
  },
  "decor.portrait-frame": {
    visual: "Image card with an offset border frame and a credential caption overlay.",
    placement: "About/profile splits for owner-led firms.",
    states: "Subtle reveal; offset frame static.",
    realWorld: ["Rürup: offset portrait frame + credential overlay", "Warringsholz: founder portrait"],
    designLanguage: { swiss: "Sharp offset frame, signal caption.", editorial: "Navy frame, serif caption." },
  },
  "decor.watermark": {
    visual: "Oversized faint background glyph (e.g. a Quote mark) behind text.",
    placement: "Behind pull-quotes/philosophy blocks.",
    states: "Parallax/fade on scroll.",
    realWorld: ["Rürup: giant faint Quote glyph"],
    designLanguage: { editorial: "Faint serif glyph.", swiss: "Faint grotesk glyph." },
  },
  "decor.map-art": {
    visual: "Hand-built decorative SVG map (abstract DE-CH or Zürich streets).",
    placement: "Coverage/contact area.",
    states: "Nodes animate (see widget.map-interactive).",
    realWorld: ["Rürup: DE-CH abstract", "UdS: Zürich streets"],
    designLanguage: { swiss: "Abstract CH lines.", warm: "Zürich street map." },
  },
  "decor.icon-set": {
    visual: "A single consistent icon library (lucide-react) across nav/service/contact.",
    placement: "Everywhere icons appear — kept to one family for cohesion.",
    states: "n/a.",
    realWorld: ["All built sites: lucide-react"],
    designLanguage: { any: "One lucide icon family." },
  },

  // ---- LAYOUT -----------------------------------------------------------
  "layout.container": {
    visual: "Centered wrapper (max-w-7xl / 1200–1280px) with responsive gutter; inner max-w-4xl/3xl/2xl for text.",
    placement: "Wraps every section's content.",
    states: "n/a.",
    realWorld: ["All built sites + references: 1200–1280px container"],
    designLanguage: { any: "Centered max-w container.", editorial: "Narrower text measure for prose." },
  },
  "layout.section-rhythm": {
    visual: "Consistent vertical spacing scale (py-12/16/20/24/28; space-y-16..36 between sections).",
    placement: "Top/bottom padding of every section.",
    states: "n/a.",
    realWorld: ["Airy py-20/24 on premium looks; tighter py-12 on swiss"],
    designLanguage: { editorial: "py-20 airy.", soft: "py-20 airy.", swiss: "py-12 tighter.", warm: "py-24 airy." },
  },
  "layout.grid-split": {
    visual: "lg:grid-cols-12 asymmetric splits (8/4, 7/5, 5/7, 6/6, 4/8) for hero/about/contact.",
    placement: "Two-part sections where copy and a visual/info block sit side by side.",
    states: "Stacks on mobile.",
    realWorld: ["Hero/about/contact across all sites use 12-col splits"],
    designLanguage: { any: "12-col asymmetric split." },
  },
  "layout.card-grid": {
    visual: "Responsive 2/3/4/5-col grid for cards.",
    placement: "Services, audience, team, partners, pricing.",
    states: "Reflows by breakpoint.",
    realWorld: ["3-col services dominant; 4-col features; 2-col big pillars"],
    designLanguage: { any: "Responsive card grid.", soft: "Gap-rich rounded grid.", swiss: "Tight bordered grid." },
  },
  "layout.hairline-grid": {
    visual: "A single bordered box subdivided by divide-x/divide-y hairlines (zero-gap cells).",
    placement: "Editorial services/values/stats where a 'ledger' look is wanted.",
    states: "Hover tints a cell.",
    realWorld: ["Boost: divided service/stat grids"],
    designLanguage: { editorial: "Hairline-divided ledger box.", warm: "Hairlines on paper." },
  },
  "layout.alt-bg": {
    visual: "Alternating section backgrounds (white ↔ gray/paper bands), each band bottom-bordered, for rhythm.",
    placement: "Across the whole page to separate beats.",
    states: "n/a.",
    realWorld: ["All built sites: white↔tinted alternation"],
    designLanguage: { any: "White↔surface alternation.", warm: "Paper↔white bands." },
  },
  "layout.page-transition": {
    visual: "View-switch + on-mount reveal animations (AnimatePresence, animate-fade-in).",
    placement: "Between routed views and on section reveal.",
    states: "Fade/slide on mount; cross-fade on view change.",
    realWorld: ["All built sites: motion/react transitions"],
    designLanguage: { any: "Fade/slide reveals.", soft: "Expressive spring.", warm: "Snappy ease-out." },
  },

  // ---- SCRAPED ADDITIONS (full ids) -------------------------------------
  "sections/blog-teaser": {
    visual: "3-card 'latest insights' row: image, date, title, excerpt, read-more; or a news/Merkblätter list.",
    placement: "Late page, before the final CTA/footer.",
    states: "Card hover lift; read-more arrow translate.",
    realWorld: ["64% of scraped CH sites have a blog/news area", "Findea/Osome/Pilot/Bench: resource/blog hubs"],
    designLanguage: { soft: "Rounded image-top cards.", editorial: "Hairline cards, serif titles.", any: "3-col article cards." },
  },
  "sections/trust-bar": {
    visual: "Horizontal strip of greyscale certification/software/award logos, equal height.",
    placement: "Directly under the hero, or as a band above the footer.",
    states: "Greyscale→colour on hover; optional marquee.",
    realWorld: ["~70% cite eidg. Diplom, ~68% RAB", "TREUHAND SUISSE / EXPERTsuisse / RAB + bexio/Abacus/Sage/DATEV", "Karbon: G2/Capterra cluster"],
    designLanguage: { any: "Greyscale logo strip.", swiss: "Sharp award grid.", editorial: "Hairline-framed logos." },
  },
  "sections/jobs-teaser": {
    visual: "Open-roles list or a 'we're hiring' recruiting CTA band.",
    placement: "Late page or linked from nav ('Offene Stellen').",
    states: "Role rows hover; CTA per button spec.",
    realWorld: ["34% of scraped CH sites", "aawi/PMPG: jobs/careers"],
    designLanguage: { any: "Roles list or hiring band." },
  },
  "widgets/client-portal-login": {
    visual: "A prominent Login link/button (often outlined) routing to a client portal (e.g. AbaWeb).",
    placement: "Top-right of nav, separated from the marketing CTA.",
    states: "Hover per button spec; routes off to portal.",
    realWorld: ["16% of scraped CH sites", "bexio/Pilot/Bench/Collective: 'Log in' separate from 'Get started'"],
    designLanguage: { any: "Outlined Login in nav.", swiss: "Sharp ghost login.", soft: "Pill ghost login." },
  },
  "widgets/cookie-consent": {
    visual: "Bottom consent banner or a preferences modal with accept/settings — legally required (nDSG/DSGVO).",
    placement: "Fixed bottom on first visit.",
    states: "Dismiss persists choice; settings opens preferences.",
    realWorld: ["Required for all CH/EU sites; explicit tooling on ~6% of scraped"],
    designLanguage: { any: "Bottom banner, accept/settings." },
  },
  "forms/newsletter-signup": {
    visual: "Single email input + subscribe button (inline or footer).",
    placement: "Footer, or after the blog/insights section.",
    states: "Inline validation; success banner.",
    realWorld: ["Findea/Osome/Avalon: footer newsletter", "common alongside blog/news"],
    designLanguage: { any: "Email field + subscribe.", soft: "Rounded field, pill subscribe." },
  },
};

// ===========================================================================
// ANIMATION  (one line per inventory item; keyed by slot name OR element id,
//   incl. scraped-addition full ids). Merged by the generator as meta.animation.
//   Convention: <entrance/reveal> · <interaction motion> · <per-look intensity>.
//   Always gated by prefers-reduced-motion.
// ===========================================================================
export const animationEnrichment: Record<string, string> = {
  // ---- SECTIONS ----
  hero: "Staggered on-load reveal: eyebrow → H1 → lede → CTA row slide-up + fade in sequence (~80ms stagger, 500–700ms ease-out); supporting mockup/illustration parallaxes subtly on scroll. soft: spring entrance + mockup float; swiss/editorial/warm: understated, no parallax.",
  intro: "Statement fades + slides up on scroll-into-view; feature-chips stagger in (~60ms each). soft springs; editorial/warm stay subtle.",
  services: "Grid cards stagger-reveal (translateY 16px + fade, ~60–80ms/card) on first view. Hover: soft = lift + shadow bloom, swiss/editorial = snappy border-colour shift, warm = quick ease-out; arrow link nudges, icon tints.",
  stats: "Numbers count-up from 0 on scroll-into-view (~1–1.2s ease-out); cells fade-up staggered.",
  values: "Pillars stagger-reveal; accent bars grow width (scaleX 0→1) on entrance.",
  about: "Prose fades up; portrait / stats-card slides in from the side; offset frame settles into place.",
  profile: "Portrait scale + fade in; qualification cards stagger; quote watermark fades and parallax-drifts.",
  audience: "Cards stagger-reveal; persona carousel auto-advances with cross-fade/slide (~5s) and arrow control.",
  team: "Avatars fade-up staggered; hover reveals contact/socials; monogram→photo cross-fade where available.",
  process: "Steps reveal left→right; connector lines draw (stroke-dashoffset); active step ring pulses on select.",
  pricing: "Tier cards rise + fade staggered; recommended card holds a subtle scale/glow; calculator re-highlights the matching tier with a 200ms transition.",
  partners: "Logos fade-in or marquee auto-scroll loop; greyscale→colour on hover (~200ms).",
  faq: "Accordion body springs open with height + opacity (one panel at a time); chevron/plus rotates 200–300ms. soft: bouncier spring; swiss: linear snap.",
  quote: "Quote fades/slides up; giant watermark glyph parallax-drifts on scroll.",
  testimonials: "Carousel auto-rotates (cross-fade or slide, ~5–6s) with arrows/dots; cards lift on hover; star rating can animate its fill.",
  cta: "Band fades up on reveal. soft: nearest-CTA bloom/glow; dark/inverted variant: slow moving gradient; warm/editorial: static, snappy button hover only.",
  contact: "Form fields fade-up staggered; focus transitions border/ring 150ms; submit → spinner → success; banner slides + fades, auto-dismiss; map nodes pulse.",
  map: "Location nodes pulse/ping continuously; routes draw on reveal; tooltip fades on node hover.",

  // ---- BUTTONS ----
  "btn.primary-solid": "Hover: 150–250ms brightness/elevation lift OR arrow translate-x ~4px; active: press scale 0.98; focus: ring fades in. soft adds spring + shadow bloom; warm is a snappy 200ms ease-out.",
  "btn.outline": "Hover: ~200ms background-fill sweep + label colour flip to contrast; focus ring fades in.",
  "btn.link-arrow": "Group-hover translates the arrow ~4px (200ms) and may grow the bottom border.",
  "btn.underline-anim": "::after underline scaleX 0→1 from the left on hover (~200–250ms ease-out), retracts on leave. Quiet/editorial.",
  "btn.bloom-cta": "Scroll-driven fade→full + coloured box-shadow bloom when it becomes the active/nearest CTA; hover deepens the glow (spring, soft only).",
  "btn.pill": "Hover elevation/brightness 200ms; active press; soft variant may bloom.",
  "btn.tab": "Active underline slides between tabs (layout spring ~300ms); panel cross-fades.",
  "btn.icon": "Hover bg/tint fade; toggle icons rotate (chevron 180°, hamburger→X morph) 200–300ms.",
  "btn.destructive": "Hover deepens red (~150ms); optional shake on a destructive confirm.",
  "btn.card-as-button": "Whole-card hover lift + shadow (soft) or border→accent (swiss/editorial), 200–300ms; inner arrow translates.",

  // ---- CARDS ----
  "card.service-tile": "Staggered grid reveal; hover = lift+shadow (soft) or border→accent (swiss/editorial/warm) 200–300ms; icon tint + arrow nudge.",
  "card.feature-pillar": "Fade-up reveal; hover subtle lift; CheckCircle items can stagger-check in; CTA inverts on hover.",
  "card.stat": "Number count-up on scroll-into-view; cell fade-up.",
  "card.telemetry": "Rows fade-in staggered; accent bar grows width on reveal.",
  "card.pricing": "Card rise + fade; recommended tier holds a persistent glow/scale; CTA hover per button spec.",
  "card.partner": "Fade-in or marquee; greyscale→colour on hover ~200ms.",
  "card.audience": "Stagger reveal; hover tint/lift; carousel cross-fade between persona slides.",
  "card.team": "Fade-up; hover reveals socials/contact; monogram↔photo cross-fade.",
  "card.office": "Rows fade-in; row hover underline; subtle ripple on click-to-call/mail.",
  "card.callout": "Slide/fade in; accent border may draw; urgency variant can pulse gently.",
  "card.tag-chip": "Fade-in staggered with its parent; optional hover tint.",
  "card.tracker-row": "New row slides in; status badge colour-transitions on change; delete collapses row height.",
  "card.result": "Spring scale-in on reveal with a Sparkles pop; CTAs fade up after.",
  "card.banner": "Slide-down + fade in; auto-dismiss fade-out after ~4–5s.",

  // ---- NAVIGATION ----
  "nav.sticky-translucent": "On scroll past threshold: height shrinks + background solidifies + blur intensifies + shadow fades in (200–300ms).",
  "nav.active-underline": "Underline bar spring-slides between items (layoutId, ~300ms) on route/section change.",
  "nav.dropdown": "Panel fade + slide-down (150–200ms) on hover/focus; chevron rotates 180°.",
  "nav.lang-switch": "Active chip slides/cross-fades; content locale swaps with a quick fade.",
  "nav.mobile-drawer": "Hamburger morphs to X; drawer height + opacity springs open (AnimatePresence); links stagger-in; body scroll locks.",
  "nav.signature-bar": "Static — or a one-time slide-in on first load.",

  // ---- FOOTER ----
  "footer.multicol": "Columns fade-up on reveal; link hover underline ~150ms; © year is dynamic (no motion).",
  "footer.extras": "Live clock ticks every second (optional digit cross-fade); social pills hover-lift; badges static.",

  // ---- FORMS ----
  "form.contact": "Fields fade-up staggered; focus ring/border transition 150ms; submit → spinner → success swap; banner slide-fade.",
  "form.input": "Focus border/ring transition ~150ms; floating label rises 200ms (if used); optional shake on invalid.",
  "form.validation": "Inline error text fades in; banner slides down; success banner auto fade-out.",
  "form.persistence": "New tracker row slides in; delete collapses height.",
  "form.extras": "Checkbox check-mark draws on toggle; consent note fades in.",

  // ---- WIDGETS ----
  "widget.modal": "Backdrop fade + dialog scale-in (0.96→1, 200–250ms); close reverses; body scroll lock.",
  "widget.accordion": "Body height + opacity spring open, one at a time; icon morphs 200–300ms.",
  "widget.tabs": "Active tab underline slides; panel cross-fade or horizontal slide.",
  "widget.booking": "Stepper progress animates; slot-select highlight; success state scale-in.",
  "widget.calculator": "Slider drag updates the value live; matching tier re-highlights with a 200ms transition + subtle scale.",
  "widget.quiz": "Steps transition horizontally (slide); progress bar fills; result card scale-in (spring).",
  "widget.simulator": "SVG sine-wave path morphs live as sliders move (rAF); verdict colour-shifts; celebration burst on the 'good' state.",
  "widget.scroll-cta": "Passive observer toggles a bloom/active class as the nearest CTA enters viewport-centre (~300ms).",
  "widget.clock": "Digits update every second (optional flip/cross-fade).",
  "widget.map-interactive": "Nodes pulse/ping in a loop; hover scales the node + fades a tooltip; click smooth-scrolls to the office.",

  // ---- DECORATION ----
  "decor.logo-mark": "Optional one-time stroke-draw/morph on load; subtle hover wiggle/morph; otherwise static.",
  "decor.divider": "Line draws / grows width on reveal (stroke-dashoffset or scaleX).",
  "decor.bg-animated": "Continuous slow drift/parallax (ribbons flow, grid pans); pauses under prefers-reduced-motion.",
  "decor.accent-bar": "Grows width (scaleX 0→1) on reveal (~300ms ease-out).",
  "decor.pulse-dot": "Continuous ping/pulse loop (scale + opacity, ~1.5–2s).",
  "decor.icon-box": "Hover tints box/icon (~200ms) and may scale slightly.",
  "decor.monogram": "Fade-in with its card; hover reveals an overlay.",
  "decor.portrait-frame": "Offset frame slides into place on reveal; credential overlay fades in.",
  "decor.watermark": "Parallax-drift on scroll; fades in behind the text.",
  "decor.map-art": "Lines draw on reveal; nodes animate (see widget.map-interactive).",
  "decor.icon-set": "No intrinsic motion — inherits its host element's animation.",

  // ---- LAYOUT ----
  "layout.container": "No intrinsic motion (wrapper only).",
  "layout.section-rhythm": "No intrinsic motion — governs spacing, not motion.",
  "layout.grid-split": "Halves can reveal from opposite sides (slide-in left/right) on scroll-into-view.",
  "layout.card-grid": "Children stagger-reveal (fade-up, ~60–80ms per item).",
  "layout.hairline-grid": "Cells fade-in on reveal; hover tints an individual cell ~200ms.",
  "layout.alt-bg": "Static bands; the content within each band reveals on enter.",
  "layout.page-transition": "Route/view change cross-fades or slides (AnimatePresence); on-mount animate-fade-in. soft = spring; warm = 200ms ease-out; editorial/swiss = 300ms standard.",

  // ---- SCRAPED ADDITIONS ----
  "sections/blog-teaser": "Cards stagger fade-up; image zooms gently on hover; read-more arrow translates.",
  "sections/trust-bar": "Logos fade-in or marquee auto-scroll loop; greyscale→colour on hover.",
  "sections/jobs-teaser": "Role rows fade-up; hover highlight; CTA per button spec.",
  "widgets/client-portal-login": "Hover per ghost-button (fill/tint); routes away to the portal (no in-page animation).",
  "widgets/cookie-consent": "Slides up from the bottom on first visit; dismiss slides out; settings opens a scale-in modal.",
  "forms/newsletter-signup": "Field focus transition; submit → success swap; confirmation banner fades in.",
};

// ===========================================================================
// BENCHMARKS  (best-in-class sightings among 20 OUTSTANDING ADJACENT sites —
//   bookkeeping/accounting SaaS, SME fintech, trust/compliance, wealth, UI-craft.
//   Distinct from `realWorld` (CH Treuhänder sightings): this is "how the best
//   sites in the world do it." Keyed by slot / element id / addition id. See
//   references/sites.ts for the full per-site analysis. Merged as meta.benchmarks.
// ===========================================================================
export const benchmarkEnrichment: Record<string, string[]> = {
  // ---- SECTIONS (by slot) ----
  hero: ["Wise — live calculator in hero", "Vanta — 'Trust is everything' + 16k logos", "bexio — 4.0/1930 reviews + 100k KMU in hero", "Mercury — inline email + screenshots behind"],
  intro: ["Stripe — restrained positioning", "Mercury — 'Radically different banking'", "Linear — single feel-statement"],
  services: ["Numarics — service grid = payroll/VAT/tax deliverables", "Vanta — 6-card feature grid", "Qonto — icon-left feature cards"],
  stats: ["Mercury — 300K+/1-in-3/$20B+/4.9 metrics band", "Linear — '33,000 teams'", "Wealthfront — $95B+/1.4M+"],
  values: ["bexio — Zeit sparen / Swiss-Made / Support pillars", "Pilot — problem/solution pillars", "Qonto — benefit triad"],
  audience: ["Numarics — life-stage entry cards", "bexio — Für Unternehmer / Für Treuhänder", "Gusto/Pennylane — audience self-segmentation"],
  team: ["Gusto — people photography", "Mercury — founder quote", "boutique CH norm — owner profile"],
  process: ["Puzzle — time-based speed cards", "Selma — 5-step how-it-works w/ illustrations", "Pilot — onboarding steps"],
  pricing: ["Wise — competitor price comparison", "Selma — vs Bank vs Robo table", "Ramp — pricing + implementation checklist"],
  partners: ["Selma — Swiss press logos (HZ/FuW/SRF)", "Wealthfront — Forbes/Bankrate award logos", "bexio — partner logo strip"],
  faq: ["Betterment — FAQ accordion close", "Puzzle — FAQ accordion", "Selma — FAQ before footer"],
  testimonials: ["Pennylane — video-testimonial carousel + dual badges", "Mercury — portrait + blockquote cards", "Betterment — rating 4.8 (78.1K) in hero"],
  cta: ["Mercury — dual final CTA", "Vanta — 'Meet the new standard for trust'", "All — pre-footer CTA band standard"],
  contact: ["bexio/Selma — booking-first", "Mercury — minimal inline capture", "CH norm — office card + map"],

  // ---- SCRAPED ADDITIONS (by full id) ----
  "sections/trust-bar": ["Vanta — SOC2/ISO badges as permanent furniture", "Selma — FINMA/OSFIN badges", "Stripe/Notion — marquee logo wall under hero"],
  "sections/blog-teaser": ["bexio — 4 blog cards", "Pilot — resources section", "Pennylane — resource hub"],
  "widgets/client-portal-login": ["bexio — Login + dashboard", "Numarics — cockpit/DocuBox portal"],
  "widgets/cookie-consent": ["EU/CH norm — Cookiebot/Usercentrics-style"],

  // ---- NAVIGATION ----
  "nav.sticky-translucent": ["All 20 — sticky shell", "Vercel — event callout bar", "Linear — Docs/Login/Sign up cluster"],
  "nav.dropdown": ["bexio — Für Unternehmer/Treuhänder mega-menu", "Wise — dropdowns with imagery", "Stripe — product mega-menu"],
  "nav.lang-switch": ["bexio/Selma — language toggle", "Wise/Qonto — region + language selector"],

  // ---- BUTTONS ----
  "btn.primary-solid": ["Vanta — solid navy 'Get a demo' ×5", "Pilot — purple monospace pills", "Linear — dark primary"],
  "btn.outline": ["Qonto — outline 'Find the right plan'", "bexio — secondary video CTA", "Betterment — outline secondary"],
  "btn.link-arrow": ["Stripe — underlined text + →", "Linear — → link secondary", "Notion — text + → secondary"],
  "btn.pill": ["Pilot — full pills", "Qonto — rounded CTAs", "Selma — rounded primary"],
  "btn.bloom-cta": ["Digits — saturated green premium", "Ramp — lime savings accent", "Tureva (repo) — green bloom"],

  // ---- CARDS ----
  "card.service-tile": ["Vanta — 6-col feature cards", "Numarics — service grid", "Qonto — icon-left cards"],
  "card.feature-pillar": ["bexio — feature cards w/ screenshots", "Linear — sequential feature anchors"],
  "card.stat": ["Mercury — metrics band", "Wealthfront — $95B+/1.4M+", "Vercel — perf metrics"],
  "card.team": ["Mercury — portrait testimonial cards", "Gusto — people photography", "Pennylane — headshot + title + logo"],
  "card.partner": ["Vanta — compliance badges", "Selma — press logos", "bexio — partner logos"],
  "card.pricing": ["Ramp — pricing cards", "Selma — tier comparison", "Wise — fee transparency"],
  "card.callout": ["Ramp — benefit callouts", "Vanta — recognition callout"],

  // ---- FORMS ----
  "form.contact": ["Mercury — inline capture", "Betterment — short form + reassurance", "CH norm — form + office card"],
  "form.input": ["Stripe — refined inputs", "bexio — clean fields"],

  // ---- WIDGETS ----
  "widget.calculator": ["Wise — hero FX calculator", "Ramp — savings calculator", "repo — price/finance widgets"],
  "widget.accordion": ["Puzzle/Betterment/Selma — FAQ accordion"],

  // ---- DECORATION ----
  "decor.logo-mark": ["Linear/Vercel — minimal marks", "Digits — green D mark", "Stripe — wordmark"],
  "decor.bg-animated": ["Stripe — minigl gradient wave", "Vercel — single mesh gradient", "Digits — animated video hero"],
  "decor.divider": ["Pennylane — gradient dividers", "Linear — hairline structure", "repo — TurevaLines"],
  "decor.icon-box": ["Vanta/Qonto — icon-led cards", "Numarics — custom SVG icons"],
  "decor.accent-bar": ["repo presets — eyebrow bars", "Stripe — gradient underline accents"],

  // ---- LAYOUT ----
  "layout.grid-split": ["Pilot — split hero", "Betterment/Selma — split hero", "Carta — split"],
  "layout.hairline-grid": ["Linear — hairline borders", "Vercel — hairline structure"],
  "layout.section-rhythm": ["Mercury — generous whitespace", "Stripe — 8px grid restraint", "Pilot — bg spectrum"],
  "layout.card-grid": ["Vanta — 6-col", "Stripe — product card grid", "bexio — 4-col"],
};

/** Fallback benchmarks per category, for elements without a specific entry. */
export const benchmarkCategoryDefaults: Record<string, string[]> = {
  section: ["Pilot — warm↔cool bg spectrum", "Linear/Vercel — one screenshot per section", "Stripe — restrained section rhythm"],
  navigation: ["bexio — sticky + Kostenlos testen", "Stripe/Qonto — logo·menu·dual-CTA", "Linear — Docs/Login/Sign up cluster"],
  footer: ["Vanta — SOC2/ISO/GDPR badges in footer", "Selma — FINMA/OSFIN badges in footer", "bexio — Unternehmer/Treuhänder columns"],
  button: ["Pilot — monospace uppercase pills", "Stripe/Qonto — solid primary + text secondary", "Linear — dark primary + → link"],
  card: ["Vanta — 6-col icon-top feature cards", "Linear/Vercel — hairline-border cards", "bexio/Numarics — soft-shadow rounded cards"],
  form: ["Mercury — inline email in hero", "Wise — calculator before signup", "Betterment — short form + reassurance copy"],
  widget: ["Wise — hero FX calculator", "Digits — interactive product console hero", "Betterment/Selma — FAQ accordion close"],
  decoration: ["Stripe/Digits — signature gradient", "Gusto/Carta — illustration system", "Pilot — ledger-grid texture @8–20%"],
  layout: ["Stripe — 8px grid + restraint", "Pilot — pin-lines over boxes", "Mercury — generous whitespace"],
};
