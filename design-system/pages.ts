/**
 * Subpage catalog + multi-page IA composition (the "whole-website structure" layer).
 *
 * - pageTypes:     the catalog of subpage TYPES, each with ATTRIBUTES (purpose,
 *                  seoWeight, contentNeeds) and an optional `repeat` (a page type
 *                  that expands into many pages, e.g. one detail page per service).
 * - siteBlueprints: per-archetype PAGE SETS — which page types a site of that
 *                  business model includes, with a presence attribute.
 * - composeSite():  resolves the full sitemap for a firm (expanding repeatables).
 *
 * The HOME page's section order still comes from blueprints.ts (composeHomepage);
 * every other page type carries its own section sequence here.
 */
import { composeHomepage, archetypes, canonicalHomepage, type ArchetypeId, type LayoutSlot, type Presence } from "./blueprints.ts";
import type { SiteContent } from "./content/types.ts";

/** Section slots usable on a page — homepage slots plus a few page-only ones. */
export type PageSlot =
  | LayoutSlot
  | "page-header"   // inner-page hero-lite (eyebrow + H1)
  | "history"       // company timeline (scrape-only; omitted when <3 dated milestones)
  | "service-body"  // a single service's deep content
  | "related"       // related items strip
  | "gallery"       // media-pool photo grid (office / impressions)
  | "downloads"     // media-pool documents (Merkblätter / Formulare)
  | "legal-body";   // Impressum / Datenschutz text

export type Repeat = "perService" | "perTeamMember" | "perLegalDoc";

export interface PageType {
  id: string;
  name: string;
  slugBase: string;
  sections: PageSlot[];
  repeat?: Repeat;
  attributes: {
    purpose: string;
    seoWeight: "high" | "medium" | "low";
    contentNeeds: string[];
  };
}

export const pageTypes: Record<string, PageType> = {
  home: {
    id: "home", name: "Home", slugBase: "/", sections: [],
    attributes: { purpose: "Convert + orient", seoWeight: "high", contentNeeds: ["all homepage content"] },
  },
  services: {
    id: "services", name: "Leistungen", slugBase: "/leistungen",
    // Main content = the services grid (full). `values` rides along but renders as
    // a capped preview linking to /ueber-uns (its owner page) — see SiteRouter's
    // sectionTeaser. Testimonials are pure social proof and belong on the home, not
    // re-stated full on every overview, so they are intentionally NOT listed here.
    sections: ["nav", "page-header", "services", "values", "faq", "cta", "footer"],
    attributes: { purpose: "Overview of all services", seoWeight: "high", contentNeeds: ["services"] },
  },
  "service-detail": {
    id: "service-detail", name: "Leistung (Detail)", slugBase: "/leistungen",
    // No full contact section here: the page's job is the one service + related +
    // a single conversion band. A full contact FORM directly under the "Bereit?"
    // CTA would repeat the same ask (and violate the CTA→no-form rule) on every one
    // of the ~6 detail pages; the nav CTA + footer already carry the contact path.
    sections: ["nav", "page-header", "service-body", "related", "cta", "footer"],
    repeat: "perService",
    attributes: { purpose: "Deep dive + SEO per service", seoWeight: "high", contentNeeds: ["service item"] },
  },
  about: {
    id: "about", name: "Über uns", slugBase: "/ueber-uns",
    // `history` (company timeline) sits right after the story prose; it only renders
    // when the scrape yielded ≥3 dated milestones (gated in SiteRouter), else dropped.
    // `partners` (accreditation/credential band) is included so a firm WITHOUT real "Über
    // uns" prose still has a substantive, honest /ueber-uns leaning on credentials —
    // instead of a near-empty title+CTA shell. Each slot is content-gated, so it only
    // shows when present (and is suppressed in pitch mode, where credentials are dropped).
    sections: ["nav", "page-header", "about", "history", "values", "partners", "stats", "team", "gallery", "cta", "footer"],
    attributes: { purpose: "Trust + story", seoWeight: "medium", contentNeeds: ["about", "values", "team"] },
  },
  team: {
    id: "team", name: "Team", slugBase: "/team",
    sections: ["nav", "page-header", "team", "cta", "footer"],
    attributes: { purpose: "Real faces = trust", seoWeight: "low", contentNeeds: ["team"] },
  },
  pricing: {
    id: "pricing", name: "Preise", slugBase: "/preise",
    sections: ["nav", "page-header", "pricing", "faq", "cta", "footer"],
    attributes: { purpose: "Transparency + conversion", seoWeight: "medium", contentNeeds: ["pricing"] },
  },
  contact: {
    id: "contact", name: "Kontakt", slugBase: "/kontakt",
    // No page-header: the Contact section carries its own heading, so the page opens
    // straight into the form/contact info (home + contact are the two header-less pages).
    sections: ["nav", "contact", "downloads", "map", "footer"],
    attributes: { purpose: "Booking + contact", seoWeight: "medium", contentNeeds: ["contact"] },
  },
  legal: {
    id: "legal", name: "Rechtliches", slugBase: "/",
    sections: ["nav", "page-header", "legal-body", "footer"],
    repeat: "perLegalDoc",
    attributes: { purpose: "Compliance (nDSG/DSGVO)", seoWeight: "low", contentNeeds: ["legal text"] },
  },
};

export interface SitePageRef { pageType: string; presence: Presence; note?: string; }

/** Which pages each business-model archetype's site includes. */
export const siteBlueprints: Record<ArchetypeId, SitePageRef[]> = {
  "swiss-digital": [
    { pageType: "home", presence: "always" },
    { pageType: "services", presence: "always" },
    { pageType: "service-detail", presence: "often", note: "per-service SEO tree" },
    { pageType: "pricing", presence: "often" },
    { pageType: "about", presence: "always" },
    { pageType: "team", presence: "often" },
    { pageType: "contact", presence: "always" },
    { pageType: "legal", presence: "always" },
  ],
  "boutique": [
    { pageType: "home", presence: "always", note: "near one-pager" },
    { pageType: "about", presence: "often" },
    { pageType: "team", presence: "optional" },
    { pageType: "contact", presence: "always" },
    { pageType: "legal", presence: "always" },
  ],
  "intl-conversion": [
    { pageType: "home", presence: "always" },
    { pageType: "services", presence: "always" },
    { pageType: "pricing", presence: "often" },
    { pageType: "contact", presence: "always" },
    { pageType: "legal", presence: "always" },
  ],
};

export interface ResolvedPage {
  pageType: string;
  slug: string;
  title: string;
  sections: string[];
  presence: Presence;
  item?: string; // source item for repeatables (service title, legal doc, …)
}

export function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "x";
}

const LEGAL_DOCS = ["Impressum", "Datenschutz"];

/**
 * A SEPARATE Team page is only worth its own subpage once the team is large
 * enough to fill it; with a handful of people a dedicated page reads thin. Below
 * this count the members ride along on the "Über uns" page instead (see the
 * About-page team de-dup in resolvePages). "More than 4" → 5+.
 */
export const TEAM_PAGE_MIN_MEMBERS = 5;

/**
 * A non-repeatable page only exists when it has REAL content to justify it —
 * otherwise it would render as an empty shell (page-header + CTA only). The Team
 * page is gated twice over: real members must exist AND there must be enough of
 * them (>4) to warrant a standalone page; otherwise the firm introduces itself
 * via the generic "Über uns" (with the small team folded into it).
 * With no content context (archetype-only previews) every page is kept.
 */
function pageHasRealContent(pageType: string, content?: SiteContent): boolean {
  if (!content) return true;
  switch (pageType) {
    case "team": return content.team.members.length >= TEAM_PAGE_MIN_MEMBERS;
    // No price page without real tiers — and prices are stripped site-wide (SiteRouter),
    // so /preise is dropped for every firm (no empty "Preise" page, no nav link).
    case "pricing": return content.pricing.tiers.length > 0;
    default: return true;
  }
}

/** Canonical homepage slot order (single source of truth in blueprints.ts). Used to
 *  normalise the rendered home sequence so a section-order rule change takes effect
 *  even on briefs whose slot order was frozen at an earlier extraction. */
const HOME_ORDER: string[] = canonicalHomepage.map((s) => s.slot);
const homeRank = (slot: string): number => { const i = HOME_ORDER.indexOf(slot); return i === -1 ? HOME_ORDER.length : i; };

/**
 * Resolve a page-ref list into a full sitemap, expanding repeatable page types.
 * `homeSlots` is the homepage section sequence (from the content-driven brief,
 * or composeHomepage for the archetype fallback).
 */
export function resolvePages(
  refs: SitePageRef[],
  homeSlots: string[],
  content?: SiteContent,
  opts: { includeOptional?: boolean } = {},
): ResolvedPage[] {
  // Whether a dedicated Team page will exist — so the About page doesn't also
  // render the full team (avoids two near-identical "people" pages).
  const hasTeamPage = refs.some((r) =>
    r.pageType === "team"
    && (r.presence !== "optional" || opts.includeOptional)
    && pageHasRealContent("team", content));

  const out: ResolvedPage[] = [];
  for (const ref of refs) {
    if (ref.presence === "optional" && !opts.includeOptional) continue;
    const pt = pageTypes[ref.pageType];
    if (!pt) continue;
    // Drop pages with no real content to back them (e.g. a Team page when the
    // scrape found no members) — never create an empty subpage shell.
    if (!pt.repeat && pt.id !== "home" && !pageHasRealContent(pt.id, content)) continue;

    if (pt.id === "home") {
      // Normalise to the canonical Trust & Authority order (blueprints.ts) regardless
      // of the order frozen into an older brief — so a section-order rule change applies
      // to every site without re-extraction. Stable sort; any unknown slot sinks last.
      const sections = [...homeSlots].sort((a, b) => homeRank(a) - homeRank(b));
      out.push({
        pageType: "home", slug: "/", title: content?.meta.firm ?? "Home",
        sections, presence: ref.presence,
      });
    } else if (pt.repeat === "perService") {
      const items = content?.services.items ?? [];
      const list = items.length ? items.map((i) => i.title) : ["<service>"];
      for (const title of list) {
        out.push({ pageType: pt.id, slug: `${pt.slugBase}/${slugify(title)}`, title,
          sections: pt.sections, presence: ref.presence, item: title });
      }
    } else if (pt.repeat === "perLegalDoc") {
      for (const d of LEGAL_DOCS) {
        out.push({ pageType: pt.id, slug: `/${slugify(d)}`, title: d,
          sections: pt.sections, presence: ref.presence, item: d });
      }
    } else {
      // The About page tells the company story; if a dedicated Team page exists,
      // drop its team section so the two pages don't duplicate the same people.
      const sections = (pt.id === "about" && hasTeamPage)
        ? pt.sections.filter((s) => s !== "team")
        : pt.sections;
      out.push({ pageType: pt.id, slug: pt.slugBase, title: pt.name,
        sections, presence: ref.presence });
    }
  }
  return out;
}

/** Archetype-blueprint sitemap (fallback path when no content-driven brief exists). */
export function composeSite(
  archetype: ArchetypeId,
  content?: SiteContent,
  opts: { includeOptional?: boolean } = {},
): ResolvedPage[] {
  const refs = siteBlueprints[archetype] ?? siteBlueprints["boutique"];
  return resolvePages(refs, composeHomepage(archetype).map((s) => s.slot) as string[], content, opts);
}

/** Top-level pages only (no repeatable expansion) — for nav menus / sitemap views. */
export function sitemap(archetype: ArchetypeId, opts: { includeOptional?: boolean } = {}) {
  return (siteBlueprints[archetype] ?? []).filter((r) => r.presence !== "optional" || opts.includeOptional)
    .map((r) => {
      const pt = pageTypes[r.pageType];
      return { pageType: r.pageType, name: pt.name, slug: pt.id === "home" ? "/" : pt.slugBase, presence: r.presence };
    });
}

export const archetypeIds = Object.keys(archetypes) as ArchetypeId[];
