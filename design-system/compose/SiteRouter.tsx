/**
 * SiteRouter — the MULTI-PAGE renderer.
 * Computes the firm's variant plan (palette × hero × button) and the resolved
 * sitemap (composeSite), then renders the current page's section sequence with a
 * working in-page nav. Same plan applies to every page, so the whole site is
 * coherent. Slots without a structure/content are skipped gracefully.
 */
import React, { useState } from "react";
import { applyLook } from "../looks/applyLook";
import { type ArchetypeId } from "../blueprints";
import { composeSite, slugify, pageTypes, type ResolvedPage } from "../pages";
import { presets } from "../tokens";
import { planSite, heroById, sectionComponent } from "../variants/select";
import { PrimaryStyleProvider } from "../structures/primitives";
import { NavigationContext } from "./nav-context";
import { Reveal } from "../motion/Reveal";
import type { SiteContent } from "../content/types";

import { Nav } from "../structures/Nav";
import { TrustBar } from "../structures/TrustBar";
import { Services } from "../structures/Services";
import { Values } from "../structures/Values";
import { Testimonials } from "../structures/Testimonials";
import { Stats } from "../structures/Stats";
import { Faq } from "../structures/Faq";
import { CtaBand } from "../structures/CtaBand";
import { Contact } from "../structures/Contact";
import { Footer } from "../structures/Footer";
import { PageHeader } from "../structures/PageHeader";
import { ServiceBody } from "../structures/ServiceBody";
import { Related } from "../structures/Related";
import { LegalBody } from "../structures/LegalBody";
import { BlogList } from "../structures/BlogList";
import { Team } from "../structures/Team";
import { Pricing } from "../structures/Pricing";

const SERVICE_BULLETS = [
  "Laufende, termingerechte Betreuung",
  "Digitale Belegerfassung & Echtzeit-Zahlen",
  "Ein persönlicher Ansprechpartner",
  "Transparente Pauschale ohne versteckte Kosten",
];

export interface SiteRouterProps {
  content: SiteContent;
  archetype?: ArchetypeId;
  seed?: number;
  lookId?: string;
  /** Force a specific hero variant id (else the selector picks one). */
  heroId?: string;
}

export const SiteRouter: React.FC<SiteRouterProps> = ({ content, archetype, seed, lookId, heroId }) => {
  const arch = (archetype ?? (content.meta.archetype as ArchetypeId)) || "boutique";
  const plan = planSite(content, { seed, lookId });
  const look = presets[plan.lookId] ?? presets[content.meta.lookId];
  const Hero = heroById(heroId ?? plan.heroId).component;

  const pages = composeSite(arch, content, { includeOptional: true });
  const [slug, setSlug] = useState("/");
  const navigate = (s: string) => { setSlug(s); if (typeof window !== "undefined") window.scrollTo(0, 0); };
  const page: ResolvedPage = pages.find((p) => p.slug === slug) ?? pages[0];

  // top-level nav links (exclude legal + repeatable detail pages)
  const navPages = pages.filter((p) => !["legal", "service-detail", "blog-post"].includes(p.pageType));
  const navContent = {
    ...content.nav,
    links: navPages.map((p) => ({ label: p.pageType === "home" ? "Home" : pageTypes[p.pageType]?.name ?? p.title, href: p.slug })),
  };

  const crumb = (p: ResolvedPage) => (p.pageType === "service-detail" ? "Home / Leistungen" : p.pageType === "legal" ? "Home" : "Home");

  // Teaser logic: on the HOME page, a section becomes a preview with a button to
  // its dedicated subpage — but only if that subpage exists in the sitemap.
  const isHome = page.pageType === "home";
  const moreFor = (type: string, label: string) => {
    if (!isHome) return undefined;
    const target = pages.find((p) => p.pageType === type);
    return target ? { label, href: target.slug } : undefined;
  };

  // Service cards deep-link only where the target exists: detail page > overview > inert.
  const hasServiceDetail = pages.some((p) => p.pageType === "service-detail");
  const hasServicesOverview = pages.some((p) => p.pageType === "services");
  const servicePick = hasServiceDetail
    ? (t: string) => navigate(`/leistungen/${slugify(t)}`)
    : hasServicesOverview
    ? () => navigate("/leistungen")
    : undefined;

  const renderSlot = (s: string, i: number): React.ReactNode => {
    switch (s) {
      case "nav": return <Nav key={i} content={navContent} />;
      case "footer": return <Footer key={i} content={content.footer} />;
      case "hero": return <Hero key={i} content={content.hero} />;
      case "page-header": return <PageHeader key={i} eyebrow={pageTypes[page.pageType]?.name ?? "Seite"} title={page.title} breadcrumb={crumb(page)} />;
      case "services": { const C = sectionComponent("services", plan) ?? Services; return <C key={i} content={content.services} more={moreFor("services", "Alle Leistungen")} onPick={servicePick} />; }
      case "blog": return <BlogList key={i} content={content.posts} more={moreFor("blog", "Alle Beiträge")} />;
      case "service-body": {
        const it = content.services.items.find((x) => x.title === page.item);
        return it ? <ServiceBody key={i} title={it.title} summary={it.summary} bullets={it.bullets ?? SERVICE_BULLETS} body={it.body} /> : null;
      }
      case "team": { const C = sectionComponent("team", plan) ?? Team; return <C key={i} content={content.team} more={moreFor("team", "Team kennenlernen")} />; }
      case "pricing": return <Pricing key={i} content={content.pricing} more={moreFor("pricing", "Alle Pakete")} />;
      case "related": return (
        <Related key={i} heading="Das könnte Sie auch interessieren"
          items={content.services.items.filter((x) => x.title !== page.item).slice(0, 3)}
          onPick={(t) => navigate(`/leistungen/${slugify(t)}`)} />
      );
      case "values": { const C = sectionComponent("values", plan) ?? Values; return <C key={i} content={content.values} />; }
      case "stats": { const C = sectionComponent("stats", plan) ?? Stats; return <C key={i} content={content.stats} />; }
      case "testimonials": { const C = sectionComponent("testimonials", plan) ?? Testimonials; return <C key={i} content={content.testimonials} />; }
      case "faq": { const C = sectionComponent("faq", plan) ?? Faq; return <C key={i} content={content.faq} />; }
      case "cta": { const C = sectionComponent("cta", plan) ?? CtaBand; return <C key={i} content={content.cta} />; }
      case "contact": return <Contact key={i} content={content.contact} />;
      case "partners": return <TrustBar key={i} label={content.trust.label} items={content.trust.items} />;
      case "blog-list": return <BlogList key={i} content={content.posts} />;
      case "legal-body": return <LegalBody key={i} doc={page.item ?? "Impressum"} firm={content.meta.firm} contact={content.contact} />;
      // intro, audience, process, team, pricing, profile, quote, map, article-body — no structure yet
      default: return null;
    }
  };

  return (
    <div style={applyLook(look)}>
      <PrimaryStyleProvider value={plan.primaryStyle}>
        <NavigationContext.Provider value={navigate}>
          {page.sections.map((s, i) => {
            const node = renderSlot(s, i);
            if (!node) return null;
            // nav is sticky — wrapping it in a transform would break sticky; render raw
            return s === "nav" || s === "footer" ? <React.Fragment key={i}>{node}</React.Fragment> : <Reveal key={i}>{node}</Reveal>;
          })}
        </NavigationContext.Provider>
      </PrimaryStyleProvider>
    </div>
  );
};
