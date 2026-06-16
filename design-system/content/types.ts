/**
 * SiteContent — the per-client CONTENT contract.
 * The scraper/extractor fills this from a firm's material; structures consume
 * slices of it as props. Content is data, not baked into components — the same
 * structures render any client's SiteContent under any look.
 */
import type { HeroContent } from "../structures/HeroSplit";
import type { TestimonialsContent } from "../structures/Testimonials";
export type { HeroContent, TestimonialsContent };

export interface NavLink { label: string; href: string; }
export interface NavContent { brand: string; links: NavLink[]; cta: string; languages: string[]; }

export interface ServiceItem { title: string; summary: string; price?: string; }
export interface ServicesContent { eyebrow: string; heading: string; items: ServiceItem[]; }

export interface ValueItem { title: string; body: string; }
export interface ValuesContent { eyebrow: string; heading: string; items: ValueItem[]; }

export interface StatItem { value: string; label: string; }
export interface StatsContent { items: StatItem[]; }

export interface FaqItem { q: string; a: string; }
export interface FaqContent { eyebrow: string; heading: string; items: FaqItem[]; }

export interface TrustContent { label: string; items: string[]; }
export interface CtaContent { heading: string; sub: string; button: string; }

export interface ContactInfo { address?: string; phone?: string; email?: string; hours?: string; }
export interface ContactContent { eyebrow: string; heading: string; info: ContactInfo; formCta: string; }

export interface FooterColumn { title: string; links: string[]; }
export interface FooterContent { brand: string; tagline: string; columns: FooterColumn[]; legal: string[]; year: number; }

export interface SiteContent {
  meta: { firm: string; domain: string; archetype: string; lookId: string; sourceUrl?: string };
  nav: NavContent;
  hero: HeroContent;
  services: ServicesContent;
  values: ValuesContent;
  testimonials: TestimonialsContent;
  stats: StatsContent;
  trust: TrustContent;
  faq: FaqContent;
  cta: CtaContent;
  contact: ContactContent;
  footer: FooterContent;
}
