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
import { composeSite, resolvePages, slugify, pageTypes, type ResolvedPage } from "../pages";
import { presets } from "../tokens";
import { planSite, heroById, sectionComponent, decollideSections } from "../variants/select";
import { dedupeImages } from "../content/uniqueImages";
import { PrimaryStyleProvider, type PrimaryStyle } from "../structures/primitives";
import { IconSetProvider, iconSetById } from "../icons/iconSets";
import { NavigationContext } from "./nav-context";
import { Reveal } from "../motion/Reveal";
import { useBrandFonts } from "../looks/useBrandFonts";
import { ResponsiveStyles } from "../structures/Responsive";
import { defaultProcess, defaultAudience, defaultAbout, defaultFeature, withGenericSlots, injectFeature } from "../content/sectionDefaults";
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
import { Team } from "../structures/Team";
import { Pricing } from "../structures/Pricing";
import { Downloads } from "../structures/Downloads";
import { HeroImageFull } from "../structures/HeroImage";
import type { MoreLink } from "../structures/SectionHead";

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
  /** Force a specific primary-button style (else the selector picks one). */
  primaryStyle?: PrimaryStyle;
  /** Force specific section-variant ids per slot (else the selector picks them). */
  sectionOverrides?: Record<string, string>;
  /** Force a coherent style kit (else the selector picks one for the affinity). */
  kitId?: string;
}

export const SiteRouter: React.FC<SiteRouterProps> = ({ content: rawContent, archetype, seed, lookId, heroId, primaryStyle, sectionOverrides, kitId }) => {
  // No photo may appear twice across the site — hero/service/gallery/background
  // disjoint (team photos exempt). Applied once before planning/rendering.
  const content = React.useMemo(() => dedupeImages(rawContent), [rawContent]);
  const arch = (archetype ?? (content.meta.archetype as ArchetypeId)) || "boutique";
  useBrandFonts(content.meta.fontsToLoad);
  const baseId = content.meta.basePresetId ?? content.meta.lookId;
  const plan = planSite(content, { seed, lookId: lookId ?? baseId, kitId });
  const activePlan = sectionOverrides ? { ...plan, sections: { ...plan.sections, ...sectionOverrides } } : plan;
  // The section variants actually rendered. Starts as the plan's picks; the
  // adjacency de-collision pass (after the page's section order is known) reassigns
  // this so no two neighbouring sections share a layout family.
  let renderPlan = activePlan;
  const look = lookId ? presets[lookId] : (content.meta.look ?? presets[plan.lookId] ?? presets[content.meta.lookId]);
  const Hero = heroById(heroId ?? plan.heroId).component;
  const buttonStyle = primaryStyle ?? plan.primaryStyle;
  const galleryContent = {
    eyebrow: "Galerie", heading: "Einblicke",
    images: content.media?.photos ?? [],
    logo: content.media?.logo,
    badges: content.media?.badges ?? [],
  };
  // Real metrics only: drop any stat whose number is zero (scaffold leftovers like
  // "0+ KMU") — fabricated/empty figures are an explicit anti-reference. Non-numeric
  // values (CHF, 24/7) are kept.
  const statItems = content.stats.items.filter((it) => {
    const d = String(it.value).replace(/[^0-9]/g, "");
    return d === "" || Number(d) !== 0;
  });

  const brief = content.meta.brief;
  const pages = brief
    ? resolvePages(brief.pageRefs, brief.homepageSlots, content, { includeOptional: true })
    : composeSite(arch, content, { includeOptional: true });
  const [slug, setSlug] = useState("/");
  const navigate = (s: string) => { setSlug(s); if (typeof window !== "undefined") window.scrollTo(0, 0); };
  const page: ResolvedPage = pages.find((p) => p.slug === slug) ?? pages[0];

  // --- IMAGE GUARANTEE: no page or subpage may render without imagery. --------
  // Every subpage's page-header gets a real photo (rotated so pages differ); the
  // home page falls back to a photo hero if it would otherwise be image-less.
  // Sub-page headers draw from the (already de-duplicated) pool, and never the
  // home hero photo — so the hero image is not repeated on a sub-page header.
  const headerPhotos = [...new Set([
    ...(content.media?.sectionBackgrounds ?? []),
    ...(content.media?.photos ?? []),
  ].filter(Boolean) as string[])].filter((p) => p !== content.hero?.image);
  const headerImageFor = (p: ResolvedPage): string | undefined => {
    if (p.pageType === "service-detail") {
      const it = content.services.items.find((x) => x.title === p.item);
      if (it?.image) return it.image; // the service's own photo as the header
    }
    if (!headerPhotos.length) return content.hero?.image;
    return headerPhotos[Math.max(0, pages.indexOf(p)) % headerPhotos.length];
  };
  const imageHeroIds = ["hero/image-centered", "hero/image-split", "hero/image-full"];
  const resolvedHeroId = heroId ?? plan.heroId;
  const homeImaged =
    (imageHeroIds.includes(resolvedHeroId) && !!content.hero.image)
    || content.services.items.some((x) => x.image)
    || content.team.members.some((m) => m.photo)
    || (content.media?.badges?.length ?? 0) > 0
    || (content.media?.photos?.length ?? 0) >= 2;
  const HeroComp = (page.pageType === "home" && !homeImaged) ? HeroImageFull : Hero;

  // top-level nav links (exclude legal + repeatable detail pages). "contact" is
  // dropped too: the nav CTA button already routes to /kontakt, so a separate
  // "Kontakt" tab would just duplicate it.
  const navPages = pages.filter((p) => !["legal", "service-detail", "contact"].includes(p.pageType));
  const navContent = {
    ...content.nav,
    links: navPages.map((p) => ({ label: p.pageType === "home" ? "Home" : pageTypes[p.pageType]?.name ?? p.title, href: p.slug })),
  };

  const crumb = (p: ResolvedPage) => (p.pageType === "service-detail" ? "Home / Leistungen" : p.pageType === "legal" ? "Home" : "Home");

  const isHome = page.pageType === "home";

  // Service cards deep-link only where the target exists: detail page > overview > inert.
  const hasServiceDetail = pages.some((p) => p.pageType === "service-detail");
  const hasServicesOverview = pages.some((p) => p.pageType === "services");
  const servicePick = hasServiceDetail
    ? (t: string) => navigate(`/leistungen/${slugify(t)}`)
    : hasServicesOverview
    ? () => navigate("/leistungen")
    : undefined;

  // --- Homepage teaser: on the HOME page a section that has a dedicated subpage
  //     shows a capped preview of its items AND carries an integrated "view all"
  //     link inside its OWN header/footer — never a separate band. Off the home
  //     page, or when the subpage doesn't exist, the full section renders as-is.
  const HOME_PREVIEW: Record<string, { type: string; label: string; cap: number }> = {
    services: { type: "services", label: "Alle Leistungen",   cap: 3 },
    team:     { type: "team",     label: "Team kennenlernen", cap: 3 },
    values:   { type: "about",    label: "Mehr über uns",     cap: 3 },
    gallery:  { type: "about",    label: "Mehr Einblicke",    cap: 6 },
    pricing:  { type: "pricing",  label: "Alle Pakete",       cap: 3 },
  };
  function homeTeaser<T>(slot: string, items: T[]): { items: T[]; more: MoreLink | undefined } {
    const def = HOME_PREVIEW[slot];
    if (!isHome || !def) return { items, more: undefined };
    const target = pages.find((p) => p.pageType === def.type);
    if (!target) return { items, more: undefined };
    const capped = items.length > def.cap ? items.slice(0, def.cap) : items;
    return { items: capped, more: { label: def.label, href: target.slug } };
  }

  const renderSlot = (s: string, i: number): React.ReactNode => {
    switch (s) {
      case "nav": return <Nav key={i} content={navContent} current={page.slug} />;
      case "footer": return <Footer key={i} content={content.footer} />;
      case "hero": return <HeroComp key={i} content={content.hero} />;
      case "page-header": return <PageHeader key={i} eyebrow={pageTypes[page.pageType]?.name ?? "Seite"} title={page.title} breadcrumb={crumb(page)} image={headerImageFor(page)} />;
      case "services": { const C = sectionComponent("services", renderPlan) ?? Services; const { items, more } = homeTeaser("services", content.services.items); return <C key={i} content={{ ...content.services, items }} more={more} onPick={servicePick} />; }
      case "service-body": {
        const it = content.services.items.find((x) => x.title === page.item);
        return it ? <ServiceBody key={i} title={it.title} summary={it.summary} bullets={it.bullets ?? SERVICE_BULLETS} body={it.body} image={it.image} /> : null;
      }
      case "team": { const C = sectionComponent("team", renderPlan) ?? Team; const { items, more } = homeTeaser("team", content.team.members); return <C key={i} content={{ ...content.team, members: items }} more={more} />; }
      case "pricing": { const C = sectionComponent("pricing", renderPlan) ?? Pricing; const { items, more } = homeTeaser("pricing", content.pricing.tiers); return <C key={i} content={{ ...content.pricing, tiers: items }} more={more} />; }
      case "related": return (
        <Related key={i} heading="Das könnte Sie auch interessieren"
          items={content.services.items.filter((x) => x.title !== page.item).slice(0, 3)}
          onPick={(t) => navigate(`/leistungen/${slugify(t)}`)} />
      );
      case "values": { const C = sectionComponent("values", renderPlan) ?? Values; const { items, more } = homeTeaser("values", content.values.items); return <C key={i} content={{ ...content.values, items }} more={more} />; }
      case "stats": { const C = sectionComponent("stats", renderPlan) ?? Stats; return <C key={i} content={{ ...content.stats, items: statItems }} />; }
      case "process": { const C = sectionComponent("process", renderPlan); return C ? <C key={i} content={defaultProcess()} /> : null; }
      case "audience": { const C = sectionComponent("audience", renderPlan); return C ? <C key={i} content={defaultAudience()} /> : null; }
      case "about": { const C = sectionComponent("about", renderPlan); return C ? <C key={i} content={defaultAbout()} /> : null; }
      case "feature": { const C = sectionComponent("feature", renderPlan); const img = content.media?.photos?.[0] ?? content.media?.sectionBackgrounds?.[0]; return (C && img) ? <C key={i} content={defaultFeature(img)} /> : null; }
      case "testimonials": { const C = sectionComponent("testimonials", renderPlan) ?? Testimonials; return <C key={i} content={content.testimonials} />; }
      case "faq": { const C = sectionComponent("faq", renderPlan) ?? Faq; return <C key={i} content={content.faq} />; }
      case "gallery": { const C = sectionComponent("gallery", renderPlan); if (!C) return null; const { items, more } = homeTeaser("gallery", galleryContent.images); return <C key={i} content={{ ...galleryContent, images: items }} more={more} />; }
      case "cta": { const C = sectionComponent("cta", renderPlan); return C ? <C key={i} content={content.cta} /> : <CtaBand key={i} content={content.cta} bgImage={content.media?.sectionBackgrounds?.[0]} />; }
      case "contact": { const C = sectionComponent("contact", renderPlan) ?? Contact; return <C key={i} content={content.contact} />; }
      case "partners": { const C = sectionComponent("partners", renderPlan); const tc = { label: content.trust.label, items: content.trust.items, badges: content.media?.badges }; return C ? <C key={i} content={tc} /> : <TrustBar key={i} label={tc.label} items={tc.items} badges={tc.badges} />; }
      case "downloads": return content.media?.documents?.length ? <Downloads key={i} documents={content.media.documents} /> : null;
      case "legal-body": return <LegalBody key={i} doc={page.item ?? "Impressum"} firm={content.meta.firm} contact={content.contact} />;
      // intro, audience, process, team, pricing, profile, quote, map, article-body — no structure yet
      default: return null;
    }
  };

  // Image-embedding axis: surface a media gallery on the home page when the firm
  // actually has photos (or when the studio forces a gallery variant).
  const wantGallery = (content.media?.photos?.length ?? 0) >= 2 || !!sectionOverrides?.["gallery"];
  const featImg = content.media?.photos?.[0] ?? content.media?.sectionBackgrounds?.[0];
  const homeSections = isHome ? (featImg ? injectFeature(withGenericSlots(page.sections)) : withGenericSlots(page.sections)) : page.sections;
  const displaySections = isHome && wantGallery && !homeSections.includes("gallery")
    ? (() => { const at = homeSections.indexOf("cta"); return at >= 0 ? [...homeSections.slice(0, at), "gallery", ...homeSections.slice(at)] : [...homeSections, "gallery"]; })()
    : homeSections;

  // Never render a content section the firm has no material for — an empty
  // values/faq/stats/… would show as a lone heading. Slots not listed here always
  // render (nav, hero, cta, contact, and the safe-generic process/audience/about).
  const slotHasContent = (s: string): boolean => {
    switch (s) {
      case "services": return content.services.items.length > 0;
      case "values": return content.values.items.length > 0;
      case "team": return content.team.members.length > 0;
      case "pricing": return content.pricing.tiers.length > 0;
      case "testimonials": return content.testimonials.items.length > 0;
      case "stats": return statItems.length > 0;
      case "faq": return content.faq.items.length > 0;
      case "partners": return content.trust.items.length > 0 || (content.media?.badges?.length ?? 0) > 0;
      case "gallery": return galleryContent.images.length > 0;
      default: return true;
    }
  };
  const visibleSections = displaySections.filter(slotHasContent);
  // Now that the rendered order is known, keep two same-family sections from sitting
  // directly adjacent (studio-forced slots stay locked).
  renderPlan = {
    ...activePlan,
    sections: decollideSections(visibleSections, activePlan, content, {
      seed, locked: new Set(Object.keys(sectionOverrides ?? {})),
    }),
  };

  return (
    <div style={applyLook(look)}>
      <ResponsiveStyles />
      <IconSetProvider value={iconSetById(plan.iconSetId)}>
      <PrimaryStyleProvider value={buttonStyle}>
        <NavigationContext.Provider value={navigate}>
          {visibleSections.map((s, i) => {
            const node = renderSlot(s, i);
            if (!node) return null;
            // nav is sticky — wrapping it in a transform would break sticky; render raw
            if (s === "nav" || s === "footer") return <React.Fragment key={i}>{node}</React.Fragment>;
            return <Reveal key={i}>{node}</Reveal>;
          })}
        </NavigationContext.Provider>
      </PrimaryStyleProvider>
      </IconSetProvider>
    </div>
  );
};
