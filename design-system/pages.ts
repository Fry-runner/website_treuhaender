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
import { composeHomepage, archetypes, type ArchetypeId, type LayoutSlot, type Presence } from "./blueprints";
import type { SiteContent } from "./content/types";

/** Section slots usable on a page — homepage slots plus a few page-only ones. */
export type PageSlot =
  | LayoutSlot
  | "page-header"   // inner-page hero-lite (eyebrow + H1 + breadcrumb)
  | "service-body"  // a single service's deep content
  | "related"       // related items strip
  | "article-body"  // blog post body
  | "blog-list"     // list of articles
  | "legal-body";   // Impressum / Datenschutz text

export type Repeat = "perService" | "perTeamMember" | "perPost" | "perLegalDoc";

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
    sections: ["nav", "page-header", "services", "values", "testimonials", "faq", "cta", "footer"],
    attributes: { purpose: "Overview of all services", seoWeight: "high", contentNeeds: ["services"] },
  },
  "service-detail": {
    id: "service-detail", name: "Leistung (Detail)", slugBase: "/leistungen",
    sections: ["nav", "page-header", "service-body", "related", "cta", "contact", "footer"],
    repeat: "perService",
    attributes: { purpose: "Deep dive + SEO per service", seoWeight: "high", contentNeeds: ["service item"] },
  },
  about: {
    id: "about", name: "Über uns", slugBase: "/ueber-uns",
    sections: ["nav", "page-header", "about", "values", "stats", "team", "cta", "footer"],
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
  blog: {
    id: "blog", name: "Blog", slugBase: "/blog",
    sections: ["nav", "page-header", "blog-list", "cta", "footer"],
    attributes: { purpose: "Authority + SEO", seoWeight: "high", contentNeeds: ["posts"] },
  },
  "blog-post": {
    id: "blog-post", name: "Beitrag", slugBase: "/blog",
    sections: ["nav", "page-header", "article-body", "related", "cta", "footer"],
    repeat: "perPost",
    attributes: { purpose: "Article / Merkblatt", seoWeight: "high", contentNeeds: ["post"] },
  },
  contact: {
    id: "contact", name: "Kontakt", slugBase: "/kontakt",
    sections: ["nav", "page-header", "contact", "map", "footer"],
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
    { pageType: "blog", presence: "often" },
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
    { pageType: "blog", presence: "often", note: "resources/guides" },
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

/** Resolve the full sitemap for a firm, expanding repeatable page types. */
export function composeSite(
  archetype: ArchetypeId,
  content?: SiteContent,
  opts: { includeOptional?: boolean } = {},
): ResolvedPage[] {
  const refs = siteBlueprints[archetype] ?? siteBlueprints["boutique"];
  const out: ResolvedPage[] = [];
  for (const ref of refs) {
    if (ref.presence === "optional" && !opts.includeOptional) continue;
    const pt = pageTypes[ref.pageType];
    if (!pt) continue;

    if (pt.id === "home") {
      const homeSlots = composeHomepage(archetype).map((s) => s.slot) as string[];
      // inject a blog teaser before the final CTA, only if the site has a blog page
      const hasBlog = refs.some((r) => r.pageType === "blog" && (r.presence !== "optional" || opts.includeOptional));
      if (hasBlog && !homeSlots.includes("blog")) {
        const at = homeSlots.indexOf("cta");
        homeSlots.splice(at >= 0 ? at : homeSlots.length, 0, "blog");
      }
      out.push({
        pageType: "home", slug: "/", title: content?.meta.firm ?? "Home",
        sections: homeSlots, presence: ref.presence,
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
    } else if (pt.repeat === "perPost") {
      out.push({ pageType: pt.id, slug: `${pt.slugBase}/<post>`, title: "<post>",
        sections: pt.sections, presence: ref.presence });
    } else {
      out.push({ pageType: pt.id, slug: pt.slugBase, title: pt.name,
        sections: pt.sections, presence: ref.presence });
    }
  }
  return out;
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
