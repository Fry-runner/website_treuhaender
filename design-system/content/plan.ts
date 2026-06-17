/**
 * plan.ts — the "decide what's needed" step of the website creator.
 *
 * Given what the scrape actually shows (analysis.has + page_types) and which
 * sections we could fill with REAL data, this produces a transparent SiteBrief:
 * the homepage section sequence, the page tree, and which functions to wire.
 *
 * Honesty rules (see memory: generation-philosophy):
 *  - social proof (testimonials / stats / pricing) appears ONLY with real data;
 *  - safe generic sections (values / faq) always stay;
 *  - a function (online booking, jobs, language switch) is only built when the
 *    scrape proves the firm had it.
 *
 * Pure data in/out → the brief is JSON-serialised into content.meta and consumed
 * by the composer/router. No node:* imports (browser-safe).
 */
import { canonicalHomepage } from "../blueprints.ts";
import type { ArchetypeId } from "../blueprints.ts";
import type { SitePageRef } from "../pages.ts";

export interface SiteFunctions {
  onlineBooking: boolean;
  newsletter: boolean;
  jobs: boolean;
  cookieConsent: boolean;
}
export interface SiteBrief {
  /** Ordered homepage section slots to render. */
  homepageSlots: string[];
  /** Page tree (refs; the router expands repeatables + resolves slugs). */
  pageRefs: SitePageRef[];
  functions: SiteFunctions;
  /** slot/page/function → why it was kept or dropped (transparency). */
  reasons: Record<string, string>;
}

export interface DecisionInputs {
  archetype: ArchetypeId;
  /** scraped_analysis.has — what the firm's real site exposes. */
  has: Record<string, boolean>;
  pageTypes: Record<string, number>;
  servicesCount: number;
  /** Whether each section could be filled with REAL (non-fabricated) data. */
  real: {
    services: boolean;
    team: boolean;
    trust: boolean;
    testimonials: boolean;
    stats: boolean;
    pricing: boolean;
    values: boolean;
    faq: boolean;
  };
}

/** Homepage slots that have a real renderer in the composer/router. */
const RENDERABLE = new Set([
  "nav", "hero", "audience", "process", "partners", "services", "values", "team",
  "pricing", "testimonials", "stats", "faq", "cta", "contact", "footer",
]);
/** Structural slots that always belong on a Treuhänder homepage. */
const ALWAYS = new Set(["nav", "hero", "services", "audience", "process", "cta", "contact", "footer"]);

export function decideStructure(input: DecisionInputs): SiteBrief {
  const { has, real } = input;
  const reasons: Record<string, string> = {};

  // --- homepage section sequence (canonical order, content-gated) -----------
  const homepageSlots: string[] = [];
  for (const { slot } of canonicalHomepage) {
    if (!RENDERABLE.has(slot)) { reasons[`home:${slot}`] = "kein Homepage-Renderer"; continue; }
    let keep = false, why = "";
    if (ALWAYS.has(slot)) { keep = true; why = "Kernsektion"; }
    else if (slot === "partners") { keep = real.trust; why = real.trust ? "echte Zertifikate/Partner gefunden" : "keine echten Trust-Logos"; }
    else if (slot === "team") { keep = real.team; why = real.team ? "echte Teammitglieder gescraped" : "kein echtes Team gefunden"; }
    else if (slot === "testimonials") { keep = real.testimonials; why = real.testimonials ? "echte Kundenstimmen gefunden" : "Social Proof ohne echte Daten → weggelassen"; }
    else if (slot === "stats") { keep = real.stats; why = real.stats ? "echte Kennzahlen gefunden" : "Social Proof ohne echte Daten → weggelassen"; }
    else if (slot === "pricing") { keep = real.pricing; why = real.pricing ? "echte Preise/Pakete gefunden" : "keine echten Preise → weggelassen"; }
    else if (slot === "values") { keep = real.values; why = real.values ? "echte Werte/Vorteile aus den eigenen Seiten" : "keine echten Werte-Texte → weggelassen"; }
    else if (slot === "faq") { keep = real.faq; why = real.faq ? "echte FAQ gefunden" : "keine echte FAQ → weggelassen"; }
    reasons[`home:${slot}`] = why;
    if (keep) homepageSlots.push(slot);
  }

  // --- page tree (content-gated) -------------------------------------------
  const pageRefs: SitePageRef[] = [{ pageType: "home", presence: "always" }];
  const addPage = (pageType: string, cond: boolean, presence: SitePageRef["presence"], why: string, note?: string) => {
    reasons[`page:${pageType}`] = `${cond ? "✓" : "✗"} ${why}`;
    if (cond) pageRefs.push({ pageType, presence, note });
  };
  addPage("services", real.services, "always", "Leistungen vorhanden");
  addPage("service-detail", real.services && input.servicesCount >= 3, "often", "≥3 Leistungen → SEO-Detailseiten", "per-service SEO tree");
  addPage("about", !!has.about, "often", "Über-uns-Seite im Scrape");
  addPage("team", !!has.team && real.team, "often", "Team-Seite + echte Mitglieder");
  addPage("pricing", !!has.pricing && real.pricing, "often", "Preisseite + echte Preise");
  pageRefs.push({ pageType: "contact", presence: "always" });
  pageRefs.push({ pageType: "legal", presence: "always" });

  // --- functions (only when the scrape proves them) ------------------------
  const functions: SiteFunctions = {
    onlineBooking: !!has.online_booking,
    newsletter: !!has.blog_news,
    jobs: !!has.jobs,
    cookieConsent: true, // legally required in CH/EU regardless of the source site
  };
  reasons["fn:onlineBooking"] = functions.onlineBooking ? "✓ Online-Terminbuchung im Scrape" : "✗ keine Online-Buchung → CTA führt zum Kontakt";
  reasons["fn:jobs"] = functions.jobs ? "✓ Stellen/Jobs im Scrape" : "✗ keine Jobs im Scrape";

  return { homepageSlots, pageRefs, functions, reasons };
}
