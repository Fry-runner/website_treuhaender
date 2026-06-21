/**
 * Per-firm section HEADINGS.
 * Section eyebrows/headings (Services "Alles aus einer Hand.", Values "Ihr
 * Vorteil.", Contact "Sprechen wir." …) are framing copy, not scraped content —
 * but a single fixed string makes EVERY generated site read identically. The
 * section ITEMS are already scrape-driven; this varies the framing around them.
 *
 * firmHeadings() picks a heading per firm DETERMINISTICALLY (domain hash + seed)
 * from a curated pool and interpolates the firm's real city ({city}) where the
 * template calls for it — so the framing differs firm-to-firm and points at where
 * the firm actually is, without ever fabricating a claim. Computed in the composer
 * (not baked by extract.ts) so it applies to every firm without re-extraction.
 *
 * Only PURELY-GENERIC framing sections are routed through here. Sections whose
 * heading can be real (process/audience/about) keep their own scraped-or-default
 * heading and are intentionally absent from the pools below.
 */
import type { SiteContent } from "./types";

// Eyebrows are removed site-wide (the Eyebrow primitive renders null), so only the
// HEADING is framing copy worth varying per firm; the former per-section eyebrow
// pools were inert and have been dropped.
export interface Head { heading: string; }
type Pools = { heading: string[] };

const SECTION_POOLS: Record<string, Pools> = {
  services: {
    heading: ["Alles aus einer Hand.", "Ihre Treuhand-Leistungen.", "Damit Ihre Zahlen stimmen.", "Rundum betreut.", "Treuhand für {city}.", "Ihr Treuhänder in {city}."],
  },
  values: {
    heading: ["Ihr Vorteil.", "Warum Mandanten uns wählen.", "Das macht den Unterschied.", "Mehr als nur Zahlen."],
  },
  team: {
    heading: ["Menschen, die Ihre Zahlen kennen.", "Das Team hinter Ihren Zahlen.", "Persönlich für Sie da.", "Ihr Team in {city}."],
  },
  pricing: {
    heading: ["Transparente Pauschalen.", "Faire, klare Preise.", "Preise ohne Überraschungen."],
  },
  testimonials: {
    heading: ["Unternehmen vertrauen uns.", "Was unsere Mandanten sagen.", "Vertrauen, das zählt."],
  },
  faq: {
    heading: ["Häufige Fragen.", "Antworten auf Ihre Fragen.", "Das werden wir oft gefragt."],
  },
  gallery: {
    heading: ["Einblicke.", "Bei uns vor Ort.", "Impressionen aus {city}."],
  },
  contact: {
    heading: ["Sprechen wir.", "So erreichen Sie uns.", "Wir freuen uns auf Sie.", "So erreichen Sie uns in {city}."],
  },
};

/** CTA band: heading only — the sub/button keep their booking-derived copy. */
const CTA_HEADINGS = ["Bereit, Ihre Finanzen abzugeben?", "Bereit für Treuhand ohne Aufwand?", "Reden wir über Ihre Zahlen.", "Machen Sie den ersten Schritt."];

/** Recover the firm's city from the hero eyebrow ("Treuhand · <Stadt>"), the one
 *  place every firm (incl. pre-extraction JSONs) carries it. */
function cityOf(content: SiteContent): string | undefined {
  const eb = content.hero?.eyebrow || "";
  const c = eb.includes("·") ? eb.split("·").pop()!.trim() : "";
  return c && c.length >= 2 && c.length <= 30 && /[a-zäöü]/i.test(c) ? c : undefined;
}
function hash(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

export function firmHeadings(content: SiteContent, seed = 0): Record<string, Head> {
  const city = cityOf(content);
  const base = (hash(content.meta.domain || content.meta.firm || "x") + seed) >>> 0;
  const fill = (t: string) => t.replace(/\{city\}/g, city ?? "");
  const usable = (arr: string[]) => { const u = arr.filter((t) => city || !t.includes("{city}")); return u.length ? u : arr; };
  const pick = (arr: string[], salt: number) => { const p = usable(arr); return fill(p[(base + salt) % p.length]); };
  const out: Record<string, Head> = {};
  let salt = 1;
  for (const [k, p] of Object.entries(SECTION_POOLS)) {
    out[k] = { heading: pick(p.heading, salt * 13) };
    salt += 1;
  }
  out.cta = { heading: pick(CTA_HEADINGS, 101) };
  return out;
}
