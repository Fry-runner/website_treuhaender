/**
 * Component Inventory
 * ===================
 * Exhaustive structural catalog of every element/section type found across the
 * four built Treuhänder sites. This is the blueprint for the reusable component
 * collection: each entry is something the generator may need to assemble a page.
 *
 * `sources`        — which built sites actually contain the pattern (evidence).
 * `styleAffinity`  — which style language(s) the pattern reads best in, mapped to
 *                    the four preset moods (see design-system/tokens.ts):
 *                      "editorial" = boost-editorial   (serif, navy/blue, airy)
 *                      "swiss"     = ruerup-swiss       (grotesk, sharp, red/green)
 *                      "soft"      = tureva-soft        (geometric, rounded, lime)
 *                      "warm"      = uds-warm-editorial (paper, sharp, blue/rose)
 *                    "any" = visually neutral, works in every preset.
 * `priority`       — core = nearly every site needs it; common = frequent;
 *                    optional = nice-to-have / situational.
 */

export type SiteId = "boost" | "ruerup" | "tureva" | "uds";

export type ComponentCategory =
  | "section" | "navigation" | "footer" | "button" | "card"
  | "form" | "widget" | "decoration" | "layout";

/** Page slots a section can fill (used later by the composition engine). */
export type Slot =
  | "hero" | "intro" | "services" | "stats" | "values" | "about" | "profile"
  | "team" | "audience" | "process" | "pricing" | "partners" | "faq"
  | "testimonials" | "quote" | "cta" | "contact" | "map" | "legal";

export type StyleAffinity = "any" | "editorial" | "swiss" | "soft" | "warm";

export interface InventoryEntry {
  id: string;
  category: ComponentCategory;
  name: string;
  slot?: Slot;
  variants: string[];
  structure: string;
  sources: SiteId[];
  styleAffinity: StyleAffinity[];
  priority: "core" | "common" | "optional";
  notes?: string;
}

// ===========================================================================
// 1. SECTIONS (page-level building blocks)
// ===========================================================================
export const sections: InventoryEntry[] = [
  {
    id: "hero.split-graphic", category: "section", slot: "hero",
    name: "Hero — split with graphic/quote",
    variants: ["serif H1 + decorative SVG panel right (boost)", "8/4 text + pull-quote right (uds)"],
    structure: "12-col asymmetric split; left eyebrow+display H1 (accent span)+lede+dual CTA; right decorative/quote block",
    sources: ["boost", "uds"], styleAffinity: ["editorial", "warm"], priority: "core",
  },
  {
    id: "hero.centered", category: "section", slot: "hero",
    name: "Hero — centered",
    variants: ["max-w-4xl centered stack + 2 buttons (tureva)", "numbered mono eyebrow inner-page (boost)"],
    structure: "single centered column: eyebrow + large display H1 + subtitle + CTA row",
    sources: ["boost", "tureva"], styleAffinity: ["soft", "editorial", "any"], priority: "core",
    notes: "BRIEFING §3 — headline = client BENEFIT not service list; include an in-hero trust nibble (rating/review count or '1000+ KMU') and two CTAs (primary book, secondary explore). Default ON.",
  },
  {
    id: "hero.text-left", category: "section", slot: "hero",
    name: "Hero — left-aligned text only",
    variants: ["pulse-dot badge + 2-line headline (ruerup)", "H1 + underline accent bar (tureva about)"],
    structure: "max-w-4xl left stack on subtle masked-grid bg; eyebrow + display headline + lead + optional CTAs",
    sources: ["ruerup", "tureva", "uds"], styleAffinity: ["swiss", "warm", "any"], priority: "core",
  },
  {
    id: "hero.with-factband", category: "section", slot: "hero",
    name: "Hero + attached fact/label band",
    variants: ["hero + 4/8 label+prose split above hairline (boost)"],
    structure: "hero followed by md:grid-cols-12 split (icon label / prose) separated by hairline",
    sources: ["boost"], styleAffinity: ["editorial"], priority: "optional",
  },
  {
    id: "intro.statement", category: "section", slot: "intro",
    name: "Intro / positioning statement",
    variants: ["single max-w-3xl column (uds, boost)", "5/7 split + feature chips (tureva)"],
    structure: "eyebrow + large display statement + muted body; optional icon feature-chips row",
    sources: ["boost", "tureva", "uds"], styleAffinity: ["any"], priority: "common",
  },
  {
    id: "services.bordered-tiles", category: "section", slot: "services",
    name: "Services grid — bordered divided tiles",
    variants: ["2×2 tiles divide-x/y (boost)", "3-pillar single bordered box (boost home)"],
    structure: "single bordered box, divide-x/divide-y hairlines, each cell = icon + uppercase title + text + arrow link",
    sources: ["boost"], styleAffinity: ["editorial", "warm"], priority: "core",
  },
  {
    id: "services.card-grid", category: "section", slot: "services",
    name: "Services grid — card grid",
    variants: ["3-col clickable h-80 (tureva)", "5-tile lg:grid-cols-5 (uds)", "2-col bento (ruerup intl)"],
    structure: "header row (eyebrow+H2 [+ hint/CTA]) over N-col card grid; cards clickable to detail",
    sources: ["tureva", "uds", "ruerup"], styleAffinity: ["soft", "warm", "swiss"], priority: "core",
    notes: "BRIEFING §3 — CH differentiator: put transparent price 'ab CHF X/Monat' on the card where the business model allows (digital firms). Boutique firms may omit. Make inline-pricing a default-on toggle.",
  },
  {
    id: "services.feature-pillars", category: "section", slot: "services",
    name: "Services — large feature pillars w/ checklist",
    variants: ["2-pillar cards corner-badge + checklist + full-width CTA (ruerup)"],
    structure: "centered intro + 2-col large cards; each: corner badge, CheckCircle list, outline CTA",
    sources: ["ruerup"], styleAffinity: ["swiss", "editorial"], priority: "common",
  },
  {
    id: "services.accordion", category: "section", slot: "services",
    name: "Services — accordion pillars",
    variants: ["single-open Plus/Minus (ruerup)", "expand body 8/4 checklist + info card (tureva)"],
    structure: "stacked expandable panels (numbered); collapsed header row; expanded body grid w/ checklist + CTA",
    sources: ["ruerup", "tureva"], styleAffinity: ["swiss", "soft", "any"], priority: "common",
    notes: "Same widget is reusable for FAQ.",
  },
  {
    id: "services.selector-detail", category: "section", slot: "services",
    name: "Services — sidebar selector + detail pane",
    variants: ["4/8 list + animated detail pane w/ accent bar (uds)"],
    structure: "12-col: left selectable list (active highlight), right animated detail panel (badge, title, lead, CTA)",
    sources: ["uds"], styleAffinity: ["warm", "editorial"], priority: "optional",
  },
  {
    id: "services.secondary-grid", category: "section", slot: "services",
    name: "Secondary services grid (numbered)",
    variants: ["4-col numbered 04.x cards (tureva)"],
    structure: "tinted band, header row + 4-col card grid with numbered pill badges",
    sources: ["tureva"], styleAffinity: ["soft"], priority: "optional",
  },
  {
    id: "stats.band", category: "section", slot: "stats",
    name: "Stats / metrics band",
    variants: ["bordered divided 3-col centered (boost)", "6/6 panel + 2×2 metric grid (tureva)", "telemetry label/value card (uds, tureva)"],
    structure: "row/grid of metric cells: big display number + mono label + caption",
    sources: ["boost", "tureva", "uds"], styleAffinity: ["any"], priority: "common",
  },
  {
    id: "values.divided-columns", category: "section", slot: "values",
    name: "Values / working principles band",
    variants: ["3-col vertical hairline dividers, dot+title+text (uds, boost)"],
    structure: "top/bottom bordered band, centered eyebrow, md:grid-cols-3 with divide-x; each = bullet dot + H4 + body",
    sources: ["boost", "uds"], styleAffinity: ["editorial", "warm"], priority: "common",
  },
  {
    id: "about.split-narrative", category: "section", slot: "about",
    name: "About / story split",
    variants: ["narrative + portrait (ruerup)", "narrative + stats card 8/4 (uds)", "history 6/6 + mini-stats (tureva)"],
    structure: "12-col split: prose one side, supporting portrait OR stats/telemetry card other side",
    sources: ["ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "common",
  },
  {
    id: "about.profile-person", category: "section", slot: "profile",
    name: "Owner / person profile",
    variants: ["hero + bio split + qualifications grid + pull-quote (ruerup)"],
    structure: "portrait split (5/7) + numbered qualification cards + large quote; for owner-led firms",
    sources: ["ruerup"], styleAffinity: ["swiss", "editorial", "warm"], priority: "common",
  },
  {
    id: "audience.cards", category: "section", slot: "audience",
    name: "Target audience / client groups",
    variants: ["3-col icon cards (tureva)", "A/B/C cards (uds)", "mono-indexed client-group grid (ruerup)"],
    structure: "centered header + md:grid-cols-3 cards (icon/label + title + text)",
    sources: ["ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "common",
  },
  {
    id: "team.cards", category: "section", slot: "team",
    name: "Team / leadership",
    variants: ["3-col cards monogram avatar + role badge (tureva)", "profile rows 4/8 + bio + tags (uds)", "team teaser panel + button (uds)"],
    structure: "section header + team cards/rows; monogram avatar placeholder, name, role, bio, optional tag chips",
    sources: ["tureva", "uds"], styleAffinity: ["soft", "warm", "any"], priority: "common",
  },
  {
    id: "process.steps", category: "section", slot: "process",
    name: "Process / steps",
    variants: ["clickable numbered cards w/ active ring 01-03 (boost)", "static cards + arrow connectors (boost)"],
    structure: "md:grid-cols-3 numbered step cards; optional connector arrows or active-step highlight",
    sources: ["boost"], styleAffinity: ["editorial", "any"], priority: "common",
  },
  {
    id: "pricing.cards", category: "section", slot: "pricing",
    name: "Pricing cards",
    variants: ["3-col bordered cards, recommended ring/tint (boost)"],
    structure: "lg:grid-cols-3 cards: name, desc, price+period (border-y), feature ul, CTA; calculator-driven highlight",
    sources: ["boost"], styleAffinity: ["editorial", "any"], priority: "optional",
  },
  {
    id: "pricing.rate-table", category: "section", slot: "pricing",
    name: "Rate / tariff table",
    variants: ["2-col cards w/ line items + startup-rate notes (boost)"],
    structure: "md:grid-cols-2 cards, name/price line items w/ hairline dividers, inset highlight notes, footnote CTA bar",
    sources: ["boost"], styleAffinity: ["editorial"], priority: "optional",
  },
  {
    id: "partners.strip-grid", category: "section", slot: "partners",
    name: "Partner / certification / logo strip",
    variants: ["small partner cards 2/4-col (boost)", "12-cell award grid + inverted CTA cell (boost)",
               "certification logo strip (Treuhand Suisse, Expert Suisse, Swiss GAAP FER)",
               "software partner badges (bexio / Abacus / KLARA / Xero)"],
    structure: "horizontal strip / grid of greyscale logos (or text chips), often above footer or under hero",
    sources: ["boost"], styleAffinity: ["any"], priority: "common",
    notes: "BRIEFING §5 + §8.4 — CH trust currency. Seed certifications from design-system/content/ch.ts (chCertifications, softwarePartners).",
  },
  {
    id: "faq.list", category: "section", slot: "faq",
    name: "FAQ",
    variants: ["static stacked Q/A cards (boost)", "accordion (reuse services.accordion)"],
    structure: "centered stack of Q/A cards OR single-open accordion",
    sources: ["boost"], styleAffinity: ["any"], priority: "common",
  },
  {
    id: "quote.blockquote", category: "section", slot: "quote",
    name: "Pull-quote / philosophy block",
    variants: ["giant faint watermark + italic quote (ruerup)", "bordered centered blockquote + line motif (uds)"],
    structure: "top/bottom bordered band, large italic display quote, attribution, optional decorative watermark",
    sources: ["ruerup", "uds"], styleAffinity: ["editorial", "warm", "swiss"], priority: "common",
  },
  {
    id: "testimonials.social-proof", category: "section", slot: "testimonials",
    name: "Social proof / testimonials",
    variants: ["2-4 named quote cards (person·company·city)", "aggregate rating / review badge",
               "metric + quotes combo", "logo + quote"],
    structure: "section header + named testimonial cards + an aggregate metric/review badge; link to case study where possible",
    sources: [], styleAffinity: ["any"], priority: "core",
    notes: "BRIEFING §8.1 — first-class slot. Universal in reference sites; was previously split across quote/partners/stats. Named quotes (person+company+city) beat anonymous; pair with a metric (e.g. '92% recommend', '1000+ KMU').",
  },
  {
    id: "cta.band", category: "section", slot: "cta",
    name: "CTA band",
    variants: ["centered eyebrow+H2+button (all)", "teaser text-left + button-right (tureva, uds)", "inverted dark/decorated card (boost, ruerup)"],
    structure: "centered or split band; headline + sub + primary button; optional decorative corners/bloom",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core",
  },
  {
    id: "contact.form-sidebar", category: "section", slot: "contact",
    name: "Contact — form + info sidebar",
    variants: ["7/5 form + office directory (tureva, uds)", "5/7 office cards + form (ruerup)", "tabbed calendar/form (boost)"],
    structure: "12-col split: contact form one side, address/phone/hours cards (+ map) other side",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core",
  },
  {
    id: "map.stylized", category: "section", slot: "map",
    name: "Stylized map graphic",
    variants: ["abstract DE-CH SVG w/ animated nodes (ruerup)", "custom Zürich line-map (uds)", "text address only (tureva)"],
    structure: "decorative SVG map with markers/labels; embedded in contact or coverage section",
    sources: ["ruerup", "uds"], styleAffinity: ["swiss", "warm"], priority: "optional",
  },
];

// ===========================================================================
// 2. NAVIGATION / HEADER
// ===========================================================================
export const navigation: InventoryEntry[] = [
  {
    id: "nav.sticky-translucent", category: "navigation",
    name: "Sticky translucent header",
    variants: ["custom SVG logo (boost ∞, tureva double-T)", "wordmark + subtitle (ruerup, uds)", "hover-grow accent line (uds)"],
    structure: "sticky top-0 z-50, bg/90 backdrop-blur, bottom hairline, h-20, max-w-7xl; logo | center nav | right CTA",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core",
  },
  {
    id: "nav.active-underline", category: "navigation",
    name: "Active-link underline indicator",
    variants: ["animated layoutId spring (ruerup, uds, tureva)", "static accent underline (boost)"],
    structure: "desktop text links; active item gets sliding/animated underline bar",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core",
  },
  {
    id: "nav.dropdown", category: "navigation",
    name: "Hover dropdown / mega menu",
    variants: ["services dropdown w/ ChevronDown rotate (boost)"],
    structure: "nav item reveals panel with title+subtext entries on hover",
    sources: ["boost"], styleAffinity: ["any"], priority: "optional",
  },
  {
    id: "nav.lang-switch", category: "navigation",
    name: "Language switcher",
    variants: ["pill DE/EN toggle (tureva)", "Globe toggle mobile (tureva)", "DE/FR/IT/EN dropdown"],
    structure: "rounded-full segmented toggle or dropdown, active = filled chip",
    sources: ["tureva"], styleAffinity: ["any"], priority: "core",
    notes: "BRIEFING §7 + §8.2 — PROMOTED TO CORE. Bilingual (DE/EN min, often +FR/IT) is table-stakes for CH; only 1 of 4 built sites has it.",
  },
  {
    id: "nav.mobile-drawer", category: "navigation",
    name: "Mobile menu drawer",
    variants: ["AnimatePresence height drawer + active left-border + full-width CTA (all)"],
    structure: "hamburger toggle → absolute animated panel with stacked links and CTA",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core",
  },
  {
    id: "nav.signature-bar", category: "navigation",
    name: "Top signature accent bar",
    variants: ["1.5px blue bar above header (uds)"],
    structure: "thin full-width colored bar fixed above nav",
    sources: ["uds"], styleAffinity: ["warm", "editorial"], priority: "optional",
  },
];

// ===========================================================================
// 3. FOOTER
// ===========================================================================
export const footer: InventoryEntry[] = [
  {
    id: "footer.multicol", category: "footer",
    name: "Multi-column footer",
    variants: ["3-col brand/sitemap/network (boost)", "12-col offices+sitemap+badge (ruerup)", "4-block w/ lang box (tureva)", "brand+clock+compliance (uds)"],
    structure: "grid of 3–4 blocks: brand+tagline, sitemap links, offices/address, network/trust badges; bottom bar w/ dynamic year + legal triggers",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core",
  },
  {
    id: "footer.extras", category: "footer",
    name: "Footer accessories",
    variants: ["live Zürich clock (uds)", "language-capabilities box (tureva)", "LinkedIn pill (boost)", "SSL/UID/D&O trust badges (all)"],
    structure: "optional widgets embedded in footer columns",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "optional",
  },
];

// ===========================================================================
// 4. BUTTONS / CTAs
// ===========================================================================
export const buttons: InventoryEntry[] = [
  { id: "btn.primary-solid", category: "button", name: "Primary solid",
    variants: ["navy/anthracite/rose/green fills"], structure: "solid bg, uppercase tracked mono label, hover shift, often w/ arrow/send icon",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "btn.outline", category: "button", name: "Outline / ghost (invert on hover)",
    variants: ["border → fill invert"], structure: "transparent + border, hover fills with brand color",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "btn.link-arrow", category: "button", name: "Link with arrow",
    variants: ["ArrowRight translate + border-b underline"], structure: "text link, mono uppercase, arrow translates on group hover",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "btn.underline-anim", category: "button", name: "Animated underline link",
    variants: ["scaleX underline grow (uds .hover-underline-anim)"], structure: "::after underline scales from left on hover",
    sources: ["uds"], styleAffinity: ["warm", "editorial"], priority: "common" },
  { id: "btn.pill", category: "button", name: "Pill button",
    variants: ["rounded-full solid/outline"], structure: "fully rounded button (nav CTA, badges)",
    sources: ["tureva", "boost", "ruerup"], styleAffinity: ["soft", "any"], priority: "common" },
  { id: "btn.bloom-cta", category: "button", name: "Bloom / glow interactive CTA",
    variants: ["green scroll-driven bloom (tureva .cta-btn-interactive)"], structure: "rounded-full, faded→full on activation, colored box-shadow bloom",
    sources: ["tureva"], styleAffinity: ["soft"], priority: "optional",
    notes: "Tied to a scroll observer that highlights nearest CTA." },
  { id: "btn.tab", category: "button", name: "Tab button",
    variants: ["border-b-2 active (boost contact)"], structure: "underline-tab toggle",
    sources: ["boost"], styleAffinity: ["any"], priority: "common" },
  { id: "btn.icon", category: "button", name: "Icon button",
    variants: ["close X, refresh, restart, slot-select"], structure: "square/round icon-only button",
    sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "btn.destructive", category: "button", name: "Destructive link",
    variants: ["red trash/cancel (boost)"], structure: "red mono text link w/ Trash2/X",
    sources: ["boost"], styleAffinity: ["any"], priority: "optional" },
  { id: "btn.card-as-button", category: "button", name: "Service nav card-as-button",
    variants: ["large clickable tile (uds, tureva)"], structure: "full card acts as button to a detail view",
    sources: ["uds", "tureva", "boost"], styleAffinity: ["any"], priority: "common" },
];

// ===========================================================================
// 5. CARDS
// ===========================================================================
export const cards: InventoryEntry[] = [
  { id: "card.service-tile", category: "card", name: "Service tile", variants: ["icon+tag, title, summary, check-list, link"], structure: "bordered cell, hover border accent", sources: ["boost", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "card.feature-pillar", category: "card", name: "Large feature pillar w/ checklist", variants: ["corner badge + CheckCircle list + CTA"], structure: "large bordered card", sources: ["ruerup", "boost"], styleAffinity: ["swiss", "editorial"], priority: "common" },
  { id: "card.stat", category: "card", name: "Stat / metric cell", variants: ["big number + label + caption"], structure: "bordered or borderless metric cell", sources: ["boost", "tureva", "uds"], styleAffinity: ["any"], priority: "common" },
  { id: "card.telemetry", category: "card", name: "Telemetry / label-value card", variants: ["STANDORT/FOKUS/GRÜNDUNG list (uds)", "registry card (tureva)"], structure: "bordered label→value rows + accent bar", sources: ["uds", "tureva"], styleAffinity: ["warm", "soft"], priority: "optional" },
  { id: "card.pricing", category: "card", name: "Pricing card", variants: ["recommended ring/tint"], structure: "name, desc, price block, feature ul, CTA", sources: ["boost"], styleAffinity: ["any"], priority: "optional" },
  { id: "card.partner", category: "card", name: "Partner / award card", variants: ["eyebrow, name, desc, status pill"], structure: "small bordered card w/ footer key/value", sources: ["boost"], styleAffinity: ["editorial"], priority: "optional" },
  { id: "card.audience", category: "card", name: "Audience / client-group card", variants: ["icon circle + title + text", "mono index label"], structure: "bordered card", sources: ["ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "common" },
  { id: "card.team", category: "card", name: "Team card / profile row", variants: ["monogram avatar + role badge (tureva)", "4/8 row + bio + tags (uds)"], structure: "avatar placeholder block + name/role/bio", sources: ["tureva", "uds"], styleAffinity: ["any"], priority: "common" },
  { id: "card.office", category: "card", name: "Office / address card", variants: ["icon header + tel/mail/clock rows"], structure: "bordered card with contact rows (links)", sources: ["ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "common" },
  { id: "card.callout", category: "card", name: "Highlight callout", variants: ["red left-border (ruerup)", "top-accent border", "rose/blue tint"], structure: "accent-bordered panel: icon + heading + body", sources: ["ruerup", "boost", "uds"], styleAffinity: ["swiss", "warm"], priority: "common" },
  { id: "card.tag-chip", category: "card", name: "Mono tag / pill chip", variants: ["certifications, registry, badges"], structure: "small bordered uppercase mono chip", sources: ["tureva", "uds", "ruerup"], styleAffinity: ["any"], priority: "common" },
  { id: "card.tracker-row", category: "card", name: "Inquiry / submission tracker row", variants: ["id+date+status badge+action"], structure: "bordered row in a list (localStorage records)", sources: ["boost", "tureva", "uds"], styleAffinity: ["any"], priority: "optional" },
  { id: "card.result", category: "card", name: "Quiz / recommendation result card", variants: ["Sparkles icon + verdict (uds)"], structure: "tinted card with recommendation + CTAs", sources: ["uds"], styleAffinity: ["any"], priority: "optional" },
  { id: "card.banner", category: "card", name: "Success / error banner", variants: ["emerald success, red error"], structure: "inline status banner w/ icon, auto-dismiss", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
];

// ===========================================================================
// 6. FORMS / INPUTS
// ===========================================================================
export const forms: InventoryEntry[] = [
  { id: "form.contact", category: "form", name: "Contact form", variants: ["name/email/phone/service-select/message"], structure: "2-col paired rows + full-width textarea; mono uppercase labels; required *", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "form.input", category: "form", name: "Input / textarea / select styles", variants: ["bordered, focus-accent, rounded per preset"], structure: "consistent field styling driven by tokens (radius/border/focus)", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "form.validation", category: "form", name: "Client-side validation + feedback", variants: ["empty-check guard, error banner, success banner"], structure: "required-field guard → error/success banners", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "form.persistence", category: "form", name: "localStorage persistence + tracker", variants: ["inquiry records, status progression, delete"], structure: "submitted entries saved + listed with status badges", sources: ["boost", "tureva", "uds"], styleAffinity: ["any"], priority: "optional" },
  { id: "form.extras", category: "form", name: "Form extras", variants: ["newsletter checkbox", "consent/DSGVO note", "partner-select", "booking form"], structure: "supplementary fields/notes", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "common" },
];

// ===========================================================================
// 7. INTERACTIVE WIDGETS
// ===========================================================================
export const widgets: InventoryEntry[] = [
  { id: "widget.modal", category: "widget", name: "Modal / dialog (legal)", variants: ["backdrop-blur scale-in, Impressum/Datenschutz (boost, ruerup)"], structure: "fixed overlay, scrollable dialog, close buttons", sources: ["boost", "ruerup"], styleAffinity: ["any"], priority: "core" },
  { id: "widget.accordion", category: "widget", name: "Accordion (single-open)", variants: ["Plus/Minus toggle, motion body (ruerup, tureva)"], structure: "expandable list, one open at a time", sources: ["ruerup", "tureva"], styleAffinity: ["any"], priority: "common" },
  { id: "widget.tabs", category: "widget", name: "Tabs / view-switcher / selector", variants: ["calendar/form tabs (boost)", "sidebar selector (uds)"], structure: "toggle between panels", sources: ["boost", "uds"], styleAffinity: ["any"], priority: "common" },
  { id: "widget.booking", category: "widget", name: "Booking wizard", variants: ["3-step date→form→success mock Calendly (boost)"], structure: "multi-step appointment flow w/ slot grid + localStorage", sources: ["boost"], styleAffinity: ["any"], priority: "optional" },
  { id: "widget.calculator", category: "widget", name: "Price calculator (slider)", variants: ["range slider → recommended package (boost)"], structure: "input range drives highlighted pricing card", sources: ["boost"], styleAffinity: ["any"], priority: "optional" },
  { id: "widget.quiz", category: "widget", name: "Service quiz wizard", variants: ["3-step + heuristic recommendation (uds)"], structure: "stepper w/ progress bar → result card", sources: ["uds"], styleAffinity: ["any"], priority: "optional", notes: "Lead-gen / engagement widget." },
  { id: "widget.simulator", category: "widget", name: "Animated simulator", variants: ["3 sliders → SVG sine-wave verdict (uds FinanceSimulator)"], structure: "sliders compute SVG path + status verdict + celebration state", sources: ["uds"], styleAffinity: ["any"], priority: "optional", notes: "Signature 'wow' interactive; brand-specific." },
  { id: "widget.scroll-cta", category: "widget", name: "Scroll-driven CTA highlighter", variants: ["nearest-to-center CTA glows (tureva)"], structure: "passive scroll observer toggles active class on CTAs", sources: ["tureva"], styleAffinity: ["soft"], priority: "optional" },
  { id: "widget.map-interactive", category: "widget", name: "Interactive SVG map", variants: ["hover/click nodes + tooltip (ruerup)"], structure: "SVG with animated nodes and tooltips", sources: ["ruerup"], styleAffinity: ["swiss"], priority: "optional" },
  { id: "widget.clock", category: "widget", name: "Live local clock", variants: ["Zürich time setInterval (uds)"], structure: "ticking time display in footer", sources: ["uds"], styleAffinity: ["any"], priority: "optional" },
];

// ===========================================================================
// 8. DECORATION / GRAPHICS
// ===========================================================================
export const decoration: InventoryEntry[] = [
  { id: "decor.logo-mark", category: "decoration", name: "Custom SVG logo mark", variants: ["infinity ∞ (boost)", "double-T monogram (tureva)"], structure: "inline SVG brand mark in header/footer", sources: ["boost", "tureva"], styleAffinity: ["any"], priority: "core" },
  { id: "decor.divider", category: "decoration", name: "Branded section divider", variants: ["TurevaLines (horizontal/footer/inline)", "'Strich' line motif (uds)", "signature bar"], structure: "hairline + label/dot motif between sections", sources: ["tureva", "uds"], styleAffinity: ["soft", "warm"], priority: "common" },
  { id: "decor.bg-animated", category: "decoration", name: "Animated background", variants: ["flowing ribbons (tureva)", "masked grid (ruerup, boost)", "faint gridlines (uds)"], structure: "fixed/absolute decorative SVG/CSS layer behind content", sources: ["tureva", "ruerup", "boost", "uds"], styleAffinity: ["soft", "swiss"], priority: "common" },
  { id: "decor.accent-bar", category: "decoration", name: "Accent bar / hairline underline", variants: ["w-16 h-1 / w-8 h-[2px]"], structure: "short colored bar under eyebrows/headings", sources: ["boost", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "decor.pulse-dot", category: "decoration", name: "Pulse / ping status dot", variants: ["eyebrow dot, availability ping"], structure: "animated rounded-full dot", sources: ["boost", "ruerup", "uds"], styleAffinity: ["any"], priority: "common" },
  { id: "decor.icon-box", category: "decoration", name: "Icon-in-bordered-box", variants: ["40×40 bordered icon container"], structure: "lucide icon inside square bordered box", sources: ["boost", "ruerup"], styleAffinity: ["editorial", "swiss"], priority: "common" },
  { id: "decor.monogram", category: "decoration", name: "Monogram avatar block", variants: ["initials on solid color (tureva, uds)"], structure: "placeholder avatar w/ initials + role badge", sources: ["tureva", "uds"], styleAffinity: ["any"], priority: "common" },
  { id: "decor.portrait-frame", category: "decoration", name: "Decorative portrait frame", variants: ["offset frame + credential overlay (ruerup)"], structure: "image card with offset border + caption overlay", sources: ["ruerup"], styleAffinity: ["swiss", "editorial"], priority: "optional" },
  { id: "decor.watermark", category: "decoration", name: "Giant quote watermark", variants: ["faint Quote glyph behind text (ruerup)"], structure: "oversized faint background glyph", sources: ["ruerup"], styleAffinity: ["editorial", "swiss"], priority: "optional" },
  { id: "decor.map-art", category: "decoration", name: "Stylized line-map graphic", variants: ["DE-CH abstract (ruerup)", "Zürich streets (uds)"], structure: "hand-built decorative SVG map", sources: ["ruerup", "uds"], styleAffinity: ["swiss", "warm"], priority: "optional" },
  { id: "decor.icon-set", category: "decoration", name: "lucide-react icon system", variants: ["nav/service/contact icon sets"], structure: "consistent icon library across all sites", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
];

// ===========================================================================
// 9. LAYOUT PRIMITIVES
// ===========================================================================
export const layout: InventoryEntry[] = [
  { id: "layout.container", category: "layout", name: "Container", variants: ["max-w-7xl / brand-container 1200px", "inner max-w-4xl/3xl/2xl"], structure: "centered wrapper w/ responsive gutter", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "layout.section-rhythm", category: "layout", name: "Section vertical rhythm", variants: ["py-12/16/20/24/28", "space-y-16..36 between sections"], structure: "consistent vertical spacing scale (from spacing tokens)", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "layout.grid-split", category: "layout", name: "12-col asymmetric splits", variants: ["8/4, 7/5, 5/7, 6/6, 4/8"], structure: "lg:grid-cols-12 split layouts for hero/about/contact", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "layout.card-grid", category: "layout", name: "Card grids", variants: ["2/3/4/5-col"], structure: "responsive grid for cards", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "layout.hairline-grid", category: "layout", name: "Zero-gap bordered+divided grid", variants: ["divide-x/divide-y hairline cells (boost)"], structure: "single bordered box subdivided by hairlines", sources: ["boost"], styleAffinity: ["editorial", "warm"], priority: "common" },
  { id: "layout.alt-bg", category: "layout", name: "Alternating section backgrounds", variants: ["white ↔ gray/paper bands"], structure: "section bg alternation for rhythm; each band bottom-bordered", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "core" },
  { id: "layout.page-transition", category: "layout", name: "Page / reveal transitions", variants: ["motion/react AnimatePresence, animate-fade-in"], structure: "view-switch + on-mount reveal animations", sources: ["boost", "ruerup", "tureva", "uds"], styleAffinity: ["any"], priority: "common" },
];

export const inventory = {
  sections, navigation, footer, buttons, cards, forms, widgets, decoration, layout,
};

export const allEntries: InventoryEntry[] = [
  ...sections, ...navigation, ...footer, ...buttons, ...cards,
  ...forms, ...widgets, ...decoration, ...layout,
];
