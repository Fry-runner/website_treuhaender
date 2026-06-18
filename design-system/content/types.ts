/**
 * SiteContent — the per-client CONTENT contract.
 * The scraper/extractor fills this from a firm's material; structures consume
 * slices of it as props. Content is data, not baked into components — the same
 * structures render any client's SiteContent under any look.
 */
import type { HeroContent } from "../structures/HeroSplit";
import type { TestimonialsContent } from "../structures/Testimonials";
import type { DesignTokens } from "../tokens";
import type { BrandSignals } from "./brand";
import type { SiteBrief } from "./plan";
export type { HeroContent, TestimonialsContent };

export interface NavLink { label: string; href: string; }
export interface NavContent { brand: string; links: NavLink[]; cta: string; logo?: string; logoLight?: string; }

export interface ServiceItem { title: string; summary: string; price?: string; body?: string; bullets?: string[]; image?: string; }
export interface ServicesContent { eyebrow: string; heading: string; items: ServiceItem[]; }

export interface TeamMember { name: string; role: string; initials: string; bio: string; photo?: string; }
export interface TeamContent { eyebrow: string; heading: string; members: TeamMember[]; }

export interface PricingTier { name: string; price: string; period: string; features: string[]; recommended?: boolean; }
export interface PricingContent { eyebrow: string; heading: string; tiers: PricingTier[]; }

export interface ValueItem { title: string; body: string; }
export interface ValuesContent { eyebrow: string; heading: string; items: ValueItem[]; }

export interface StatItem { value: string; label: string; }
export interface StatsContent { items: StatItem[]; }

export interface FaqItem { q: string; a: string; }
export interface FaqContent { eyebrow: string; heading: string; items: FaqItem[]; }

export interface TrustContent { label: string; items: string[]; badges?: string[]; }
export interface CtaContent { heading: string; sub: string; button: string; }

export interface ContactInfo { address?: string; phone?: string; email?: string; hours?: string; }
export interface ContactContent { eyebrow: string; heading: string; info: ContactInfo; formCta: string; }

export interface FooterColumn { title: string; links: string[]; }
export interface FooterContent { brand: string; tagline: string; columns: FooterColumn[]; legal: string[]; year: number; logo?: string; logoLight?: string; imageCredits?: string[]; }

/**
 * MediaLibrary — the classified pool of every usable image scraped from the firm.
 * extract.ts copies each asset into public/images/<slug>/pool/ and tags it with a
 * `kind`. The convenience fields (logo, badges, photos) are the curated picks the
 * structures consume directly; `assets` is the full catalog the creator chooses
 * from when wiring images onto selected elements.
 */
export type MediaKind = "logo" | "logo-light" | "badge" | "hero" | "photo";
export type Orientation = "landscape" | "portrait" | "square";
/** Recognised photo motif, so the creator places the right kind of image —
 *  e.g. never a person portrait in a hero. */
export type ImageSubject = "portrait" | "city" | "office" | "generic";
/** Page SLOTS a photo is suited for, so the creator wires a fitting image per
 *  element — a wide cinematic shot to the hero/background, a work scene to a
 *  service card, any decent photo to the gallery. Derived from size + orientation
 *  + subject (see extract.ts imageRoles); one asset can suit several slots. */
export type ImageRole = "hero" | "gallery" | "background" | "service" | "feature";
export interface MediaAsset {
  src: string; kind: MediaKind; alt: string; bytes: number;
  width?: number; height?: number; orientation?: Orientation; // intrinsic size for layout
  subject?: ImageSubject; // classified motif: person portrait · Zürich/city · office · generic
  roles?: ImageRole[];    // slots this asset suits: hero · gallery · background · service · feature
  phash?: string;         // perceptual dHash (hex) — same picture under different bytes/names shares a near-identical value
  quality?: number;       // 0..1 technical-quality score (sharpness/detail/exposure/compression) — ranks the pool + gates hero/feature
  faces?: number;         // detected face count (Tier-2 ONNX pass) — firms up portrait classification, keeps faces out of the hero
  stock?: boolean; credit?: string; source?: string; // set for CC stock fallback images
}

/** A downloadable document (Merkblatt / Checkliste / form), copied to public/files/<slug>/. */
export type DocKind = "pdf" | "doc" | "xls" | "other";
export interface DocAsset { src: string; title: string; kind: DocKind; bytes: number; }

export interface MediaLibrary {
  logo?: string;        // firm logo for light backgrounds (transparent/dark mark)
  logoLight?: string;   // light/white logo for dark backgrounds
  hero?: string;        // chosen hero photo (same file as hero.image)
  badges: string[];     // certification / partner / membership logos
  photos: string[];     // general content photos (office, gallery, service shots)
  serviceImages?: Record<string, string>; // canonical service title -> matched photo
  documents: DocAsset[]; // downloadable PDFs / docs (Merkblätter, Checklisten …)
  sectionBackgrounds?: string[]; // decorative bg images (real or CC stock fallback)
  credits?: string[];   // attribution lines for any CC stock images used
  stock?: boolean;      // true if stock fallback images were injected
  assets: MediaAsset[]; // the full classified pool
}

export interface SiteContent {
  meta: {
    firm: string; domain: string; archetype: string; lookId: string; sourceUrl?: string;
    /** Curated preset whose design language frames the brand (for variant affinity). */
    basePresetId?: string;
    /** Per-firm brand-tinted look — overrides the preset when present. */
    look?: DesignTokens;
    /** Recovered visual core (colours/fonts) — diagnostic. */
    brand?: BrandSignals;
    /** Google-font families the page must load for the applied look. */
    fontsToLoad?: string[];
    /** The content-driven structure decision (sections/pages/functions). */
    brief?: SiteBrief;
    /** Honest provenance: which fields are scaffolded vs real. */
    placeholders?: string[];
    real?: string[];
  };
  media: MediaLibrary;
  nav: NavContent;
  hero: HeroContent;
  services: ServicesContent;
  values: ValuesContent;
  team: TeamContent;
  pricing: PricingContent;
  testimonials: TestimonialsContent;
  stats: StatsContent;
  trust: TrustContent;
  faq: FaqContent;
  cta: CtaContent;
  contact: ContactContent;
  footer: FooterContent;
}
