/**
 * Variant registry — the "parts bin" the generator chooses from.
 * Each variant declares the looks (styleAffinity) it fits, so the selector only
 * ever picks variants compatible with the active palette. Add a new variant here
 * and the generator can immediately choose it.
 */
import type React from "react";
import type { StyleAffinity } from "../component-inventory";
import type { HeroContent } from "../content/types";
import type { PrimaryStyle } from "../structures/primitives";
import { HeroSplit } from "../structures/HeroSplit";
import { HeroCentered } from "../structures/HeroCentered";
import { HeroTextLeft } from "../structures/HeroTextLeft";
import { HeroGradient } from "../structures/HeroGradient";
import { Services } from "../structures/Services";
import { ServicesBordered } from "../structures/ServicesBordered";
import { CtaBand } from "../structures/CtaBand";
import { CtaSplit } from "../structures/CtaSplit";
import { CtaGradient } from "../structures/CtaGradient";
import { Testimonials } from "../structures/Testimonials";
import { TestimonialsCarousel } from "../structures/TestimonialsCarousel";

export interface VariantDef<P> {
  id: string;
  component: React.FC<{ content: P }>;
  looks: StyleAffinity[]; // "any" = fits every look
  note?: string;
}

/** Hero section structures. */
export const heroVariants: VariantDef<HeroContent>[] = [
  { id: "hero/split",     component: HeroSplit,    looks: ["editorial", "warm"],          note: "split text + aside quote/credential" },
  { id: "hero/centered",  component: HeroCentered, looks: ["soft", "swiss"],              note: "centered benefit + in-hero rating badge" },
  { id: "hero/text-left", component: HeroTextLeft, looks: ["swiss", "warm", "editorial"], note: "type-only, left-aligned on tinted band" },
  { id: "hero/gradient",  component: HeroGradient, looks: ["soft", "swiss"],              note: "premium animated mesh-gradient (Stripe/Vercel pattern)" },
];

/** Primary-button looks (rendered via PrimaryStyle context). */
export interface StyleVariant { id: PrimaryStyle; looks: StyleAffinity[]; }
export const primaryStyleVariants: StyleVariant[] = [
  { id: "solid", looks: ["any"] },
  { id: "sharp", looks: ["swiss", "warm"] },
  { id: "pill",  looks: ["soft"] },
  { id: "bloom", looks: ["soft"] },
  { id: "mono",  looks: ["editorial", "swiss", "warm"] },
];

/** Section-level variants — multiple structures per slot, picked by affinity.
 *  All variants for a slot accept the same content slice. */
export interface SectionVariant { id: string; component: React.FC<{ content: any }>; looks: StyleAffinity[]; }
export const sectionVariants: Record<string, SectionVariant[]> = {
  services: [
    { id: "services/cards", component: Services, looks: ["soft"] },                 // rounded shadowed cards
    { id: "services/bordered", component: ServicesBordered, looks: ["editorial", "swiss", "warm"] }, // hairline grid
  ],
  cta: [
    { id: "cta/centered", component: CtaBand, looks: ["any"] },
    { id: "cta/split", component: CtaSplit, looks: ["swiss", "warm", "editorial"] },
    { id: "cta/gradient", component: CtaGradient, looks: ["soft", "swiss"] }, // premium gradient band
  ],
  testimonials: [
    { id: "testimonials/grid", component: Testimonials, looks: ["editorial", "swiss", "warm"] },
    { id: "testimonials/carousel", component: TestimonialsCarousel, looks: ["soft"] }, // slider
  ],
};

/** Which look-affinity each palette (preset) expresses — used to filter variants. */
export const presetAffinity: Record<string, StyleAffinity> = {
  "boost-editorial": "editorial",
  "ruerup-swiss": "swiss",
  "tureva-soft": "soft",
  "uds-warm-editorial": "warm",
  "swiss-clean": "swiss",
  "dark-premium": "swiss",
};
