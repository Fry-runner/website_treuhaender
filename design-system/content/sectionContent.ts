/**
 * Content shapes for the additional generated sections (process, audience, about,
 * jobs, references, map). Kept in their own module so the structures AND
 * SiteContent (content/types.ts re-exports these) share one source of truth.
 *
 * These are "safe generic" sections (briefing): when the scrape doesn't expose
 * structured data for them, extract.ts scaffolds sensible German defaults — never
 * fabricated social proof, just neutral, true-for-any-Treuhänder copy.
 */

export interface StepItem { title: string; body: string }
export interface ProcessContent { eyebrow: string; heading: string; steps: StepItem[] }

export interface AudienceItem { title: string; body: string }
export interface AudienceContent { eyebrow: string; heading: string; items: AudienceItem[] }

export interface AboutContent {
  eyebrow: string;
  heading: string;
  lead: string;
  paragraphs: string[];
  highlights?: { value: string; label: string }[];
}

export interface JobItem { title: string; location?: string; workload?: string; summary: string }
export interface JobsContent { eyebrow: string; heading: string; items: JobItem[] }

export interface ReferenceItem { client: string; sector?: string; summary: string; result?: string }
export interface ReferencesContent { eyebrow: string; heading: string; items: ReferenceItem[] }

export interface LocationItem { name: string; address: string; note?: string }
export interface MapContent { eyebrow: string; heading: string; locations: LocationItem[] }

/** Image-forward "feature" band (Bild + Text). `image` is required — the section
 *  only renders when a real or stock image is available (needsImage gating). */
export interface FeatureContent {
  eyebrow: string;
  heading: string;
  body: string;
  bullets?: string[];
  image: string;
  cta?: { label: string; href?: string };
}
