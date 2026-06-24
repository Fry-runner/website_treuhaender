/**
 * Style Kits — the COHERENCE layer.
 * ==================================
 * The variant registry says which variants *exist* and which palette affinity
 * each fits. But "compatible with the palette" is not the same as "looks good
 * together". A kit is a curated, named design direction that hand-picks the set
 * of variants per axis (hero · button · each section slot) that read as one
 * coherent system. The selector (variants/select.ts) chooses ONE kit per firm
 * (compatible with the brand's affinity) and then only ever picks variants from
 * that kit — so every generated site is internally consistent by construction.
 *
 * To add a coherent combination: add a kit, or extend an existing kit's per-axis
 * id lists. Run `validateKits()` (or the studio) to catch id typos.
 *
 * Each list holds the EXACT registry ids: hero/button ids as in heroVariants /
 * primaryStyleVariants, section ids as in sectionVariants[slot] (slot-prefixed).
 * If a kit omits a slot, the selector falls back to affinity-compatible picking
 * for that slot, so kits never have to be exhaustive.
 */
import type { StyleAffinity } from "../component-inventory";
import { heroVariants, primaryStyleVariants, sectionVariants } from "./registry";

export interface StyleKit {
  id: string;
  name: string;
  description: string;
  /** Brand affinities this kit suits — used to auto-pick a kit for a palette. */
  looks: StyleAffinity[];
  hero: string[];                       // allowed hero variant ids
  button: string[];                     // allowed primary-button style ids
  sections: Record<string, string[]>;   // slot -> allowed section-variant ids
  /** Allowed icon-set ids (variants/../icons/iconSets). Optional: when omitted the
   *  selector falls back to affinity-compatible icon sets. */
  icons?: string[];
}

export const kits: StyleKit[] = [
  {
    id: "editorial-minimal",
    icons: ["hairline", "beveled"],
    name: "Editorial Minimal",
    description: "Ruhig, typografie-getrieben, Haarlinien statt Schatten, viel Weißraum. Serifige, redaktionelle Anmutung.",
    looks: ["editorial"],
    hero: ["hero/minimal", "hero/text-left", "hero/overline", "hero/quote-lead", "hero/split-reverse", "hero/two-line", "hero/chapter"],
    button: ["mono", "link", "bordered", "outlineBold", "dashed", "surfaceCard", "wide", "underlineThick"],
    sections: {
      services: ["services/minimal", "services/numbered-list", "services/split-list", "services/price-list", "services/list-arrow", "services/stepper", "services/watermark", "services/two-col-rows", "services/zebra"],
      cta: ["cta/left-rule", "cta/big", "cta/bordered", "cta/minimal-line", "cta/corner-frame", "cta/eyebrow-band", "cta/sidebar"],
      testimonials: ["testimonials/stacked", "testimonials/numbered", "testimonials/spotlight", "testimonials/big-quote", "testimonials/masonry", "testimonials/minimal-list"],
      values: ["values/numbered-rows", "values/inline-list", "values/minimal", "values/split-intro", "values/timeline", "values/bordered-grid", "values/quote", "values/stepper", "values/zebra"],
      stats: ["stats/big-numbers", "stats/rows", "stats/label-top", "stats/bordered-cards", "stats/underline", "stats/stacked-big", "stats/plain-divide", "stats/headline-pair"],
      team: ["team/list-right", "team/minimal-grid", "team/rows", "team/duo", "team/centered-bio", "team/numbered", "team/masonry"],
      faq: ["faq/numbered", "faq/minimal", "faq/inline-dl", "faq/big-questions", "faq/timeline", "faq/zebra", "faq/three-col", "faq/cards-bordered", "faq/quote-answers", "faq/compact"],
      gallery: ["gallery/strip", "gallery/split-media", "gallery/duo", "gallery/masonry", "gallery/triptych", "gallery/frame-single"],
      process: ["process/numbered-rows", "process/minimal", "process/split-intro", "process/dotted-vertical", "process/underline-numbers", "process/two-col", "process/stacked-big"],
      audience: ["audience/minimal", "audience/rows", "audience/split-intro", "audience/columns", "audience/inline-list", "audience/big-letter", "audience/top-accent"],
      partners: ["partners/minimal", "partners/divided", "partners/inline", "partners/left-label", "partners/tag-label", "partners/heading", "partners/columns"],
      pricing: ["pricing/minimal", "pricing/rows", "pricing/outline", "pricing/headline-price", "pricing/checklist-rows", "pricing/two-col-features", "pricing/compact"],
      contact: ["contact/minimal", "contact/top-rule", "contact/info-left", "contact/stacked", "contact/big-heading", "contact/two-col", "contact/inline-form"],
    },
  },
  {
    id: "swiss-grid",
    icons: ["geometric", "line", "heavy-square", "beveled"],
    name: "Swiss Grid",
    description: "Präzise, bordierte Raster und Haarlinien, Mono-Labels, eckige Kanten, klar strukturiert.",
    looks: ["swiss"],
    hero: ["hero/factband", "hero/columns", "hero/framed", "hero/text-left", "hero/split", "hero/banner", "hero/chapter", "hero/grid-bg", "hero/split-reverse"],
    button: ["sharp", "slab", "mono", "inset", "bordered", "bevel", "surfaceCard", "xl", "wide"],
    sections: {
      services: ["services/bordered", "services/accordion", "services/timeline", "services/checklist", "services/list-arrow", "services/grid-4", "services/stepper", "services/two-col-rows", "services/banner-list"],
      cta: ["cta/boxed", "cta/bordered", "cta/sideline", "cta/centered", "cta/dark-split", "cta/minimal-line", "cta/eyebrow-band", "cta/sidebar"],
      testimonials: ["testimonials/bordered", "testimonials/grid", "testimonials/split-rating", "testimonials/dark", "testimonials/minimal-list", "testimonials/rating-header", "testimonials/panel"],
      values: ["values/columns", "values/accordion", "values/checklist", "values/timeline", "values/bordered-grid", "values/banner", "values/stepper"],
      stats: ["stats/divided", "stats/label-top", "stats/telemetry", "stats/chips", "stats/bordered-cards", "stats/stacked-big", "stats/outline-numbers", "stats/plain-divide"],
      team: ["team/bordered", "team/rows", "team/list-right", "team/grid-photo", "team/strip", "team/numbered"],
      faq: ["faq/bordered", "faq/controlled", "faq/two-col-accordion", "faq/grid", "faq/timeline", "faq/three-col", "faq/cards-bordered", "faq/numbered-cards", "faq/compact"],
      gallery: ["gallery/grid", "gallery/strip", "gallery/logo-strip", "gallery/triptych", "gallery/band-overlay"],
      process: ["process/bordered", "process/numbered-rows", "process/timeline", "process/two-col", "process/dotted-vertical", "process/stepper-bar", "process/connected-cards"],
      audience: ["audience/bordered", "audience/columns", "audience/tiles", "audience/rows", "audience/checklist", "audience/two-col", "audience/accordion"],
      partners: ["partners/grid", "partners/bordered", "partners/divided", "partners/columns", "partners/two-rows", "partners/boxed", "partners/left-label"],
      pricing: ["pricing/bordered", "pricing/table", "pricing/two-col-features", "pricing/rows", "pricing/outline", "pricing/checklist-rows", "pricing/compact"],
      contact: ["contact/boxed", "contact/info-grid", "contact/two-col", "contact/top-rule", "contact/split", "contact/info-cards", "contact/location"],
    },
  },
  {
    id: "soft-rounded",
    icons: ["bold", "duotone", "fine-round", "glow"],
    name: "Soft Rounded",
    description: "Abgerundet, weiche Schattenkarten, freundlich, Pill-Buttons, getönte Panels.",
    looks: ["soft"],
    hero: ["hero/centered", "hero/image-centered", "hero/minimal", "hero/side-meta", "hero/centered-card", "hero/stacked-cta", "hero/two-line"],
    button: ["pill", "soft", "bloom", "elevated", "ring", "glass", "gradientBorder", "tintBorder", "raisedPill"],
    sections: {
      services: ["services/cards", "services/bento", "services/feature-split", "services/tabs", "services/icon-cards", "services/grid-4", "services/pill-tabs", "services/media-cards"],
      cta: ["cta/offset-card", "cta/big", "cta/boxed", "cta/centered", "cta/elevated-card", "cta/badge", "cta/stacked-center", "cta/two-tone"],
      testimonials: ["testimonials/two-col", "testimonials/carousel", "testimonials/quote-wall", "testimonials/rail", "testimonials/avatar-cards", "testimonials/masonry", "testimonials/zigzag-avatar", "testimonials/marquee", "testimonials/stars"],
      values: ["values/cards", "values/tiles", "values/rows-icon", "values/big-index", "values/icon-circle", "values/feature", "values/pill-headers", "values/top-accent"],
      stats: ["stats/panel", "stats/cards", "stats/leading", "stats/ring", "stats/progress", "stats/tint-cards", "stats/badge-pills"],
      team: ["team/cards", "team/circles", "team/two-col", "team/compact-4", "team/grid-photo", "team/polaroid", "team/badge-role", "team/masonry", "team/circle-row"],
      faq: ["faq/cards", "faq/controlled", "faq/bubble", "faq/icon-q", "faq/numbered-cards", "faq/highlight-first", "faq/centered"],
      gallery: ["gallery/mosaic", "gallery/feature", "gallery/carousel", "gallery/framed", "gallery/masonry", "gallery/collage", "gallery/circles", "gallery/polaroid", "gallery/rounded-grid"],
      process: ["process/cards", "process/connected-cards", "process/chips", "process/feature-first", "process/stepper-bar", "process/big-index"],
      audience: ["audience/cards", "audience/tiles", "audience/pill-headers", "audience/top-accent", "audience/dots", "audience/feature-first"],
      partners: ["partners/cards", "partners/pills", "partners/tinted", "partners/boxed", "partners/scroller", "partners/badges-large"],
      pricing: ["pricing/soft-cards", "pricing/center-featured", "pricing/panel", "pricing/tabs", "pricing/pills", "pricing/ribbon"],
      contact: ["contact/card-form", "contact/floating-card", "contact/info-cards", "contact/tinted", "contact/centered", "contact/quick-actions"],
    },
  },
  {
    id: "warm-editorial",
    icons: ["hairline", "line", "fine-round"],
    name: "Warm Editorial",
    description: "Papierwarm, redaktionell-gemischt, alternierende Reihen, Pull-Quotes, dezente Ghost-Buttons.",
    looks: ["warm"],
    hero: ["hero/split", "hero/side-meta", "hero/offset-aside", "hero/overline", "hero/quote-lead", "hero/split-reverse", "hero/portrait-frame", "hero/aside-stat"],
    button: ["ghost", "soft", "link", "pillOutline", "chip", "dashed", "tintBorder", "underlineThick"],
    sections: {
      services: ["services/alternating", "services/split-list", "services/feature-split", "services/checklist", "services/pill-tabs", "services/media-cards", "services/watermark", "services/zebra"],
      cta: ["cta/left-rule", "cta/asymmetric", "cta/offset-card", "cta/slim", "cta/corner-frame", "cta/badge", "cta/two-tone"],
      testimonials: ["testimonials/feature-side", "testimonials/alternating", "testimonials/spotlight", "testimonials/two-col", "testimonials/big-quote", "testimonials/rating-header", "testimonials/zigzag-avatar", "testimonials/panel"],
      values: ["values/rows-icon", "values/alternating", "values/split-intro", "values/cards", "values/quote", "values/feature", "values/zebra"],
      stats: ["stats/rows", "stats/leading", "stats/telemetry", "stats/cards", "stats/underline", "stats/tint-cards", "stats/badge-pills", "stats/headline-pair"],
      team: ["team/two-col", "team/spotlight", "team/quote-card", "team/alternating", "team/polaroid", "team/duo", "team/centered-bio", "team/split-lead"],
      faq: ["faq/split-intro", "faq/big-questions", "faq/cards", "faq/bubble", "faq/zebra", "faq/quote-answers", "faq/highlight-first", "faq/centered"],
      gallery: ["gallery/split-media", "gallery/framed", "gallery/feature", "gallery/mosaic", "gallery/circles", "gallery/polaroid", "gallery/showcase", "gallery/frame-single"],
      process: ["process/split-intro", "process/zigzag", "process/feature-first", "process/numbered-rows", "process/two-col", "process/tinted"],
      audience: ["audience/split-intro", "audience/alternating", "audience/rows", "audience/quote", "audience/feature-first", "audience/columns"],
      partners: ["partners/left-label", "partners/divided", "partners/inline", "partners/tinted", "partners/stacked", "partners/heading"],
      pricing: ["pricing/split-feature", "pricing/rows", "pricing/headline-price", "pricing/checklist-rows", "pricing/panel", "pricing/two-col-features"],
      contact: ["contact/split", "contact/info-left", "contact/tinted", "contact/two-col", "contact/big-heading", "contact/location"],
    },
  },
  {
    id: "bold-dark",
    icons: ["bold", "geometric", "heavy-square", "glow"],
    name: "Bold Dark",
    description: "Hoher Kontrast, dunkle invertierte Bänder, Gradient-Akzente, dramatisch und plakativ.",
    looks: ["swiss", "soft"],
    hero: ["hero/spotlight", "hero/gradient", "hero/image-full", "hero/ribbon", "hero/dark-split"],
    button: ["solid", "gradient", "bloom", "offset", "slab", "gradientPill", "bevel", "xl"],
    sections: {
      services: ["services/bento", "services/cards", "services/feature-split", "services/media-cards", "services/banner-list"],
      cta: ["cta/inverted", "cta/panel-dark", "cta/gradient", "cta/big", "cta/gradient-split", "cta/dark-split"],
      testimonials: ["testimonials/spotlight", "testimonials/two-col", "testimonials/split-rating", "testimonials/dark"],
      values: ["values/big-index", "values/tiles", "values/cards", "values/banner", "values/top-accent"],
      stats: ["stats/dark", "stats/gradient-band", "stats/big-numbers", "stats/leading", "stats/outline-numbers"],
      team: ["team/overlay", "team/spotlight", "team/two-col", "team/split-lead"],
      faq: ["faq/big-questions", "faq/controlled", "faq/cards"],
      gallery: ["gallery/full-bleed", "gallery/feature", "gallery/mosaic", "gallery/duo", "gallery/showcase", "gallery/band-overlay"],
      process: ["process/dark", "process/big-index", "process/stepper-bar", "process/arrow-flow", "process/connected-cards"],
      audience: ["audience/dark", "audience/big-letter", "audience/tiles", "audience/banner", "audience/top-accent"],
      partners: ["partners/dark", "partners/marquee", "partners/badges-large", "partners/scroller", "partners/two-rows"],
      pricing: ["pricing/dark", "pricing/gradient-featured", "pricing/center-featured", "pricing/ribbon", "pricing/panel"],
      contact: ["contact/split-dark", "contact/dark-form", "contact/centered", "contact/boxed"],
    },
  },
  {
    id: "premium-gradient",
    icons: ["duotone", "bold", "glow"],
    name: "Premium Gradient",
    description: "Stripe/Vercel-artig: Mesh-Gradients, Glas, animierte Akzente, runde Formen, modernes SaaS-Gefühl.",
    looks: ["soft", "swiss"],
    hero: ["hero/gradient", "hero/image-centered", "hero/ribbon", "hero/centered", "hero/centered-card", "hero/grid-bg", "hero/stacked-cta"],
    button: ["gradient", "glass", "bloom", "pill", "elevated", "gradientBorder", "gradientPill", "raisedPill"],
    sections: {
      services: ["services/bento", "services/cards", "services/tabs", "services/icon-cards"],
      cta: ["cta/gradient", "cta/panel-dark", "cta/offset-card", "cta/gradient-split", "cta/elevated-card", "cta/stacked-center"],
      testimonials: ["testimonials/carousel", "testimonials/rail", "testimonials/two-col", "testimonials/avatar-cards", "testimonials/marquee", "testimonials/stars"],
      values: ["values/tiles", "values/big-index", "values/cards", "values/icon-circle", "values/pill-headers", "values/top-accent"],
      stats: ["stats/gradient-band", "stats/panel", "stats/big-numbers", "stats/ring", "stats/progress"],
      team: ["team/overlay", "team/circles", "team/two-col", "team/strip", "team/badge-role", "team/circle-row"],
      faq: ["faq/cards", "faq/bubble", "faq/controlled", "faq/icon-q", "faq/centered"],
      gallery: ["gallery/mosaic", "gallery/full-bleed", "gallery/carousel", "gallery/feature", "gallery/collage", "gallery/rounded-grid"],
      process: ["process/connected-cards", "process/cards", "process/stepper-bar", "process/feature-first", "process/chips"],
      audience: ["audience/tiles", "audience/cards", "audience/pill-headers", "audience/top-accent", "audience/feature-first"],
      partners: ["partners/marquee", "partners/scroller", "partners/cards", "partners/pills", "partners/tinted"],
      pricing: ["pricing/gradient-featured", "pricing/center-featured", "pricing/soft-cards", "pricing/tabs", "pricing/panel"],
      contact: ["contact/card-form", "contact/floating-card", "contact/centered", "contact/dark-form", "contact/info-cards"],
    },
  },
  {
    id: "corporate-trust",
    icons: ["line", "geometric", "heavy-square", "beveled"],
    name: "Corporate Trust",
    description: "Konservativ, seriös, Glaubwürdigkeit zuerst: bordierte Boxen, solide Buttons, Zertifizierungs-Logos, klassische Karten. Zurückhaltend und vertrauensbildend.",
    looks: ["swiss", "editorial"],
    hero: ["hero/factband", "hero/columns", "hero/split", "hero/banner", "hero/text-left"],
    button: ["solid", "bordered", "mono", "surfaceCard", "outlineBold"],
    sections: {
      services: ["services/bordered", "services/checklist", "services/price-list", "services/accordion", "services/feature-split"],
      cta: ["cta/boxed", "cta/sideline", "cta/bordered", "cta/centered"],
      testimonials: ["testimonials/grid", "testimonials/split-rating", "testimonials/bordered", "testimonials/rating-header"],
      values: ["values/columns", "values/checklist", "values/bordered-grid", "values/numbered-rows"],
      stats: ["stats/divided", "stats/telemetry", "stats/bordered-cards", "stats/label-top"],
      team: ["team/cards", "team/bordered", "team/rows", "team/two-col"],
      faq: ["faq/grid", "faq/bordered", "faq/two-col-accordion", "faq/controlled"],
      gallery: ["gallery/logo-strip", "gallery/grid", "gallery/strip"],
      process: ["process/numbered-rows", "process/bordered", "process/two-col", "process/timeline", "process/connected-cards"],
      audience: ["audience/bordered", "audience/columns", "audience/rows", "audience/checklist", "audience/two-col"],
      partners: ["partners/grid", "partners/bordered", "partners/divided", "partners/columns", "partners/left-label", "partners/boxed"],
      pricing: ["pricing/bordered", "pricing/table", "pricing/rows", "pricing/two-col-features", "pricing/checklist-rows"],
      contact: ["contact/boxed", "contact/info-grid", "contact/two-col", "contact/info-cards", "contact/split"],
    },
  },
  {
    id: "boutique-luxe",
    icons: ["hairline", "fine-round"],
    name: "Boutique Luxe",
    description: "Premium und edel, viel Weißraum, gerahmte Porträts, Pull-Quotes, feine Link-/Ghost-Buttons. Hochwertige, kuratierte Boutique-Anmutung.",
    looks: ["editorial", "warm"],
    hero: ["hero/overline", "hero/quote-lead", "hero/offset-aside", "hero/side-meta", "hero/portrait-frame"],
    button: ["link", "underlineThick", "mono", "ghost", "outlineBold"],
    sections: {
      services: ["services/split-list", "services/feature-split", "services/numbered-list", "services/watermark"],
      cta: ["cta/left-rule", "cta/corner-frame", "cta/elevated-card", "cta/big"],
      testimonials: ["testimonials/big-quote", "testimonials/spotlight", "testimonials/feature-side", "testimonials/panel"],
      values: ["values/quote", "values/split-intro", "values/inline-list", "values/feature"],
      stats: ["stats/underline", "stats/headline-pair", "stats/big-numbers", "stats/stacked-big"],
      team: ["team/duo", "team/spotlight", "team/quote-card", "team/centered-bio"],
      faq: ["faq/big-questions", "faq/quote-answers", "faq/split-intro", "faq/centered"],
      gallery: ["gallery/framed", "gallery/frame-single", "gallery/split-media", "gallery/feature"],
      process: ["process/split-intro", "process/minimal", "process/numbered-rows", "process/dotted-vertical", "process/stacked-big"],
      audience: ["audience/split-intro", "audience/minimal", "audience/quote", "audience/columns", "audience/top-accent"],
      partners: ["partners/minimal", "partners/divided", "partners/left-label", "partners/inline", "partners/heading"],
      pricing: ["pricing/minimal", "pricing/headline-price", "pricing/outline", "pricing/split-feature", "pricing/two-col-features"],
      contact: ["contact/minimal", "contact/big-heading", "contact/info-left", "contact/split", "contact/location"],
    },
  },
  {
    id: "playful-soft",
    icons: ["bold", "duotone", "fine-round", "glow"],
    name: "Playful Soft",
    description: "Energiegeladen und freundlich: durchgehend runde Formen, Pill-/Bloom-Buttons, Bento, Kreis-Avatare, Chat-Bubbles, Sterne. Lebendig und nahbar.",
    looks: ["soft", "warm"],
    hero: ["hero/centered", "hero/stacked-cta", "hero/gradient", "hero/ribbon", "hero/centered-card"],
    button: ["pill", "bloom", "chip", "raisedPill", "gradientPill", "tintBorder"],
    sections: {
      services: ["services/bento", "services/icon-cards", "services/pill-tabs", "services/grid-4"],
      cta: ["cta/badge", "cta/offset-card", "cta/stacked-center", "cta/two-tone"],
      testimonials: ["testimonials/carousel", "testimonials/quote-wall", "testimonials/stars", "testimonials/avatar-cards", "testimonials/marquee"],
      values: ["values/tiles", "values/rows-icon", "values/icon-circle", "values/pill-headers"],
      stats: ["stats/panel", "stats/cards", "stats/tint-cards", "stats/ring", "stats/badge-pills"],
      team: ["team/circles", "team/cards", "team/badge-role", "team/circle-row", "team/compact-4"],
      faq: ["faq/bubble", "faq/cards", "faq/icon-q", "faq/highlight-first"],
      gallery: ["gallery/mosaic", "gallery/circles", "gallery/rounded-grid", "gallery/carousel", "gallery/polaroid"],
      process: ["process/cards", "process/chips", "process/connected-cards", "process/big-index", "process/feature-first"],
      audience: ["audience/tiles", "audience/pill-headers", "audience/dots", "audience/cards", "audience/top-accent"],
      partners: ["partners/pills", "partners/cards", "partners/scroller", "partners/marquee", "partners/tinted"],
      pricing: ["pricing/soft-cards", "pricing/pills", "pricing/center-featured", "pricing/tabs", "pricing/ribbon"],
      contact: ["contact/card-form", "contact/floating-card", "contact/quick-actions", "contact/centered", "contact/info-cards"],
    },
  },
  {
    id: "editorial-magazine",
    icons: ["hairline", "line", "beveled", "fine-round"],
    name: "Editorial Magazine",
    description: "Ausdrucksstarke Redaktions-Ästhetik: große Typo-Hierarchie, Kapitel-Opener, Riesen-Quotes, nummerierte/alternierende Reihen, Wasserzeichen-Zahlen, Masonry.",
    looks: ["editorial", "warm"],
    hero: ["hero/chapter", "hero/two-line", "hero/overline", "hero/quote-lead", "hero/minimal"],
    button: ["mono", "link", "wide", "underlineThick", "bordered"],
    sections: {
      services: ["services/numbered-list", "services/watermark", "services/alternating", "services/two-col-rows", "services/zebra"],
      cta: ["cta/minimal-line", "cta/corner-frame", "cta/eyebrow-band", "cta/asymmetric"],
      testimonials: ["testimonials/big-quote", "testimonials/numbered", "testimonials/stacked", "testimonials/masonry", "testimonials/alternating"],
      values: ["values/numbered-rows", "values/big-index", "values/quote", "values/zebra", "values/alternating"],
      stats: ["stats/big-numbers", "stats/outline-numbers", "stats/stacked-big", "stats/underline"],
      team: ["team/numbered", "team/masonry", "team/list-right", "team/alternating"],
      faq: ["faq/numbered", "faq/big-questions", "faq/quote-answers", "faq/three-col"],
      gallery: ["gallery/masonry", "gallery/triptych", "gallery/collage", "gallery/frame-single"],
      process: ["process/numbered-rows", "process/big-index", "process/zigzag", "process/stacked-big", "process/two-col"],
      audience: ["audience/big-letter", "audience/alternating", "audience/quote", "audience/columns", "audience/rows"],
      partners: ["partners/divided", "partners/left-label", "partners/heading", "partners/inline", "partners/tag-label"],
      pricing: ["pricing/numbered", "pricing/headline-price", "pricing/split-feature", "pricing/outline", "pricing/two-col-features"],
      contact: ["contact/big-heading", "contact/split", "contact/info-left", "contact/two-col", "contact/top-rule"],
    },
  },
  {
    id: "modern-tech",
    icons: ["geometric", "line", "heavy-square", "glow"],
    name: "Modern Tech",
    description: "Cleanes App-/Startup-Gefühl: Glas- und Ring-Buttons, Tabs/Stepper, Fortschrittsbalken, Grid-Hintergrund-Hero, abgerundete Raster. Modern, aber nicht gradientlastig.",
    looks: ["soft", "swiss"],
    hero: ["hero/grid-bg", "hero/minimal", "hero/side-meta", "hero/two-line", "hero/banner"],
    button: ["glass", "ring", "elevated", "solid", "gradientBorder", "bevel"],
    sections: {
      services: ["services/tabs", "services/stepper", "services/bento", "services/grid-4", "services/minimal"],
      cta: ["cta/elevated-card", "cta/sideline", "cta/stacked-center", "cta/slim"],
      testimonials: ["testimonials/rail", "testimonials/two-col", "testimonials/stars", "testimonials/avatar-cards"],
      values: ["values/tiles", "values/top-accent", "values/minimal", "values/icon-circle"],
      stats: ["stats/progress", "stats/ring", "stats/big-numbers", "stats/plain-divide", "stats/gradient-band"],
      team: ["team/minimal-grid", "team/grid-photo", "team/two-col", "team/circle-row"],
      faq: ["faq/controlled", "faq/two-col-accordion", "faq/cards", "faq/compact"],
      gallery: ["gallery/grid", "gallery/rounded-grid", "gallery/showcase", "gallery/collage"],
      process: ["process/stepper-bar", "process/connected-cards", "process/timeline", "process/chips", "process/arrow-flow"],
      audience: ["audience/tiles", "audience/top-accent", "audience/minimal", "audience/columns", "audience/feature-first"],
      partners: ["partners/grid", "partners/scroller", "partners/pills", "partners/minimal", "partners/columns"],
      pricing: ["pricing/tabs", "pricing/two-col-features", "pricing/table", "pricing/soft-cards", "pricing/panel"],
      contact: ["contact/info-grid", "contact/card-form", "contact/top-rule", "contact/two-col", "contact/location"],
    },
  },
  {
    id: "mono-quiet",
    icons: ["hairline", "line", "beveled"],
    name: "Mono Quiet",
    description: "Ultra-zurückhaltend und monochrom: Mono-Labels, Haarlinien, kein Schmuck, minimale Listen statt Karten. Maximal ruhig und sachlich.",
    looks: ["swiss", "editorial"],
    hero: ["hero/text-left", "hero/minimal", "hero/columns", "hero/banner"],
    button: ["mono", "link", "bordered", "wide", "underlineThick"],
    sections: {
      services: ["services/minimal", "services/list-arrow", "services/two-col-rows", "services/price-list", "services/numbered-list"],
      cta: ["cta/minimal-line", "cta/bordered", "cta/sideline", "cta/slim"],
      testimonials: ["testimonials/minimal-list", "testimonials/stacked", "testimonials/numbered"],
      values: ["values/inline-list", "values/minimal", "values/numbered-rows", "values/bordered-grid"],
      stats: ["stats/plain-divide", "stats/rows", "stats/label-top", "stats/headline-pair"],
      team: ["team/list-right", "team/minimal-grid", "team/rows", "team/numbered"],
      faq: ["faq/minimal", "faq/inline-dl", "faq/compact", "faq/numbered"],
      gallery: ["gallery/strip", "gallery/triptych", "gallery/grid"],
      process: ["process/minimal", "process/numbered-rows", "process/underline-numbers", "process/dotted-vertical", "process/two-col"],
      audience: ["audience/minimal", "audience/inline-list", "audience/rows", "audience/columns", "audience/big-letter"],
      partners: ["partners/minimal", "partners/inline", "partners/divided", "partners/left-label", "partners/tag-label"],
      pricing: ["pricing/minimal", "pricing/rows", "pricing/outline", "pricing/headline-price", "pricing/compact"],
      contact: ["contact/minimal", "contact/top-rule", "contact/info-left", "contact/stacked", "contact/compact"],
    },
  },
];

export const kitById = (id: string): StyleKit | undefined => kits.find((k) => k.id === id);

/** Kits whose affinity suits the given palette affinity (with graceful fallback). */
export function kitsForAffinity(aff: StyleAffinity): StyleKit[] {
  const f = kits.filter((k) => k.looks.includes(aff) || k.looks.includes("any"));
  return f.length ? f : kits;
}

/**
 * Dev guard: returns every kit id-reference that does NOT exist in the registry,
 * so typos surface instead of silently falling back. Empty array = all valid.
 */
export function validateKits(): string[] {
  const heroIds = new Set(heroVariants.map((v) => v.id));
  const btnIds = new Set(primaryStyleVariants.map((v) => v.id));
  const secIds: Record<string, Set<string>> = {};
  for (const [slot, list] of Object.entries(sectionVariants)) secIds[slot] = new Set(list.map((v) => v.id));
  const bad: string[] = [];
  for (const k of kits) {
    k.hero.forEach((id) => { if (!heroIds.has(id)) bad.push(`${k.id}.hero → ${id}`); });
    k.button.forEach((id) => { if (!btnIds.has(id)) bad.push(`${k.id}.button → ${id}`); });
    for (const [slot, ids] of Object.entries(k.sections)) {
      const set = secIds[slot];
      if (!set) { bad.push(`${k.id}.sections.${slot} → unknown slot`); continue; }
      ids.forEach((id) => { if (!set.has(id)) bad.push(`${k.id}.${slot} → ${id}`); });
    }
  }
  return bad;
}
