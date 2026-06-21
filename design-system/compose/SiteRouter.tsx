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
import { HOME_MAX_CONTENT, HOME_DROP_ORDER, PREVIEW, PREVIEW_PREF } from "../ia-rules";
import { presets } from "../tokens";
import { planSite, heroById, pageHeaderById, sectionComponent, decollideSections, spaciousTeamVariant } from "../variants/select";
import { dedupeImages } from "../content/uniqueImages";
import { PrimaryStyleProvider, MoreStyleProvider, type PrimaryStyle } from "../structures/primitives";
import { IconSetProvider, iconSetById } from "../icons/iconSets";
import { NavigationContext } from "./nav-context";
import { Reveal } from "../motion/Reveal";
import { useBrandFonts } from "../looks/useBrandFonts";
import { ResponsiveStyles } from "../structures/Responsive";
import { MotionStyles } from "../motion/MotionStyles";
import { motionStyleForKit } from "../motion/motionStyle";
import { defaultProcess, defaultAudience, defaultAbout, featureBand, withGenericSlots, enforceImageRhythm } from "../content/sectionDefaults";
import { firmHeadings } from "../content/sectionHeads";
import { stockPick, STOCK_TOPICS } from "./pitchStock";
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

/** Small deterministic string hash (FNV-ish) for per-firm rotation of generic copy. */
const genericHash = (s: string): number => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

/** Drop a redundant bilingual role echo ("Geschäftsführer | CEO" → "Geschäftsführer").
 *  Splits on " | " only — legitimate slash roles ("RAB/zugel. Revisor") stay intact. */
const cleanRole = (r?: string): string => { const v = (r ?? "").trim(); return v.split(" | ")[0].trim() || v; };

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
  /** COLD-ACQUISITION / PITCH mode: strip everything legally risky to host publicly
   *  for an unsolicited redesign mockup — the firm's logo (→ name wordmark), partner
   *  badges/third-party logos, team portraits (→ monogram/text) and the firm's real
   *  scraped photos (gallery hidden; only licensed stock may show). Recognition is
   *  carried by the brand colour + name + structure, which stay. */
  pitch?: boolean;
}

export const SiteRouter: React.FC<SiteRouterProps> = ({ content: rawContent, archetype, seed, lookId, heroId, primaryStyle, sectionOverrides, kitId, pitch }) => {
  // No photo may appear twice across the site — hero/service/gallery/background
  // disjoint (team photos exempt). Applied once before planning/rendering.
  const content = React.useMemo(() => {
    const c = dedupeImages(rawContent);
    if (!pitch) return c;
    // Cold-acquisition: keep EVERY section, but swap the firm's real/scraped photos
    // for licensed stock (served at /stock). Logo → name wordmark; third-party
    // badges dropped (a badge has no stock equivalent); team → monogram (no portrait
    // stock — never fake a real person's face). Recognition stays via brand colour +
    // name + structure. Picks are deterministic per firm so they're stable.
    const dom = c.meta.domain || c.meta.firm || "x";
    const heroImg = stockPick(STOCK_TOPICS.hero, dom + "/hero", 1)[0];
    const svcImgs: Record<string, string> = {};
    (c.services?.items ?? []).forEach((s, i) => { const u = stockPick(STOCK_TOPICS.work, dom + "/svc/" + s.title, 1, i)[0]; if (u) svcImgs[s.title] = u; });
    return {
      ...c,
      nav: { ...c.nav, logo: undefined, logoLight: undefined },
      footer: { ...c.footer, logo: undefined, logoLight: undefined },
      hero: { ...c.hero, image: heroImg },
      team: { ...c.team, members: (c.team?.members ?? []).map((m) => ({ ...m, photo: undefined })) },
      // Cold-acquisition: also drop the TEXT trust items (association memberships,
      // RAB/revisor admissions, third-party software brands) — on an unsolicited
      // mock these assert unverified credentials in the firm's name. The image
      // badges are cleared below too, so the partners slot then drops entirely.
      trust: { ...c.trust, items: [], label: "" },
      media: {
        ...c.media,
        logo: undefined, logoLight: undefined, hero: heroImg,
        badges: [],
        photos: stockPick(STOCK_TOPICS.scene, dom + "/gallery", 8),
        sectionBackgrounds: stockPick(STOCK_TOPICS.wide, dom + "/bg", 3),
        serviceImages: svcImgs,
      },
    };
  }, [rawContent, pitch]);
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
  // Per-firm section framing (deterministic by domain+seed) so headings vary
  // firm-to-firm instead of every site reading "Alles aus einer Hand." etc.
  const heads = firmHeadings(content, seed ?? 0);
  // Per-firm rotation for the generic (non-fabricated) process/audience copy, so the
  // thin firms that fall back to defaults don't all read identically (the rich firms
  // drop these first via the budget). Deterministic by domain+seed.
  const genericVariant = genericHash(content.meta.domain || content.meta.firm || "x") + (seed ?? 0);
  const galleryContent = {
    ...heads.gallery,
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
  const stockSrcs = new Set((content.media?.assets ?? []).filter((a) => a.stock).map((a) => a.src));
  const bgs = content.media?.sectionBackgrounds ?? [];
  const stockLand = (content.media?.assets ?? []).filter((a) => a.stock && a.orientation === "landscape").map((a) => a.src);
  const serviceImgs = new Set(Object.values(content.media?.serviceImages ?? {}));
  // One ordered SCENE pool (real wide shots → real photos → stock) for every subpage
  // header AND home feature band. Excludes the home hero and per-service header photos
  // so those are never repeated as a generic scene elsewhere.
  const scenePool = [...new Set([
    ...bgs.filter((s) => !stockSrcs.has(s)),
    ...(content.media?.photos ?? []),
    ...bgs.filter((s) => stockSrcs.has(s)),
    ...stockLand,
  ].filter(Boolean) as string[])].filter((s) => s !== content.hero?.image && !serviceImgs.has(s));
  const sceneAt = (i: number): string | undefined =>
    scenePool.length ? scenePool[((i % scenePool.length) + scenePool.length) % scenePool.length] : undefined;
  // Pages that pull a header image from the SCENE pool: every subpage with a
  // page-header EXCEPT service-detail pages that already front their own matched
  // service photo (home/contact have no header). Each gets a DENSE rank, so
  // consecutive pages take the next DISTINCT image — the same picture never lands on
  // two subpage headers (incl. image-less service-detail pages, which used to ALL
  // fall back to the single hero photo). Repeats only once the pool is physically
  // exhausted (#scene-header pages > #scene images).
  const sceneHeaderPages = pages.filter((p) => {
    if (["home", "contact"].includes(p.pageType) || !p.sections.includes("page-header")) return false;
    if (p.pageType === "service-detail") {
      const it = content.services.items.find((x) => x.title === p.item);
      return !it?.image; // a service-detail WITH a photo uses it; WITHOUT one it pulls a scene
    }
    return true;
  });
  const headerRank = new Map(sceneHeaderPages.map((p, idx) => [p.slug, idx]));
  const headerImageFor = (p: ResolvedPage): string | undefined => {
    if (p.pageType === "service-detail") {
      const it = content.services.items.find((x) => x.title === p.item);
      if (it?.image) return it.image; // the service's own photo as the header
    }
    const r = headerRank.get(p.slug);
    return (r != null ? sceneAt(r) : undefined) ?? content.hero?.image;
  };
  // Home feature bands draw from the scene pool PAST the header range, so a band never
  // reuses a subpage header image (until the pool wraps).
  const featureImageAt = (ord: number): string | undefined => sceneAt(sceneHeaderPages.length + ord);
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

  const isHome = page.pageType === "home";

  // Service cards deep-link only where the target exists: detail page > overview > inert.
  const hasServiceDetail = pages.some((p) => p.pageType === "service-detail");
  const hasServicesOverview = pages.some((p) => p.pageType === "services");
  const servicePick = hasServiceDetail
    ? (t: string) => navigate(`/leistungen/${slugify(t)}`)
    : hasServicesOverview
    ? () => navigate("/leistungen")
    : undefined;

  // --- Cross-page preview (owner-page principle): a section that has a dedicated
  //     OWNER page renders FULL only on that owner page. Everywhere else — the home
  //     AND any other subpage — it shows a capped preview with an integrated
  //     "view all" link inside its own header, never a full duplicate and never a
  //     separate band. The PREVIEW map lives in ../ia-rules (shared with the guard).
  function sectionTeaser<T>(slot: string, items: T[]): { items: T[]; more: MoreLink | undefined } {
    const def = PREVIEW[slot];
    if (!def) return { items, more: undefined };
    const target = pages.find((p) => p.pageType === def.type);
    // No owner page, or this IS the owner page → render the section in full.
    if (!target || target.slug === page.slug) return { items, more: undefined };
    const capped = items.length > def.cap ? items.slice(0, def.cap) : items;
    return { items: capped, more: { label: def.label, href: target.slug } };
  }

  // R1 — a subpage's page-header already shows the page TITLE as its H1, so a content
  // section serving that page must NEVER repeat it as its own heading ("Über uns" under
  // an "Über uns" header). `ddh` blanks such an echo (SectionHead then renders headless);
  // the About section, whose variants can render the heading directly, gets a DISTINCT
  // sub-headline instead so it never shows an empty head.
  const normHead = (s?: string) => (s || "").toLowerCase().replace(/[^a-z0-9äöüé]/gi, "");
  const echoesPageTitle = (h?: string) => !isHome && !!h && normHead(h) === normHead(page.title);
  const ddh = (h?: string): string => echoesPageTitle(h) ? "" : (h ?? "");
  const ABOUT_ALT = ["Wer wir sind.", "Das sind wir.", "Lernen Sie uns kennen.", "Hinter Ihren Zahlen."];
  const aboutAlt = ABOUT_ALT[genericHash(content.meta.domain || content.meta.firm || "x") % ABOUT_ALT.length];

  const renderSlot = (s: string, i: number): React.ReactNode => {
    switch (s) {
      case "nav": return <Nav key={i} content={navContent} current={page.slug} />;
      case "footer": return <Footer key={i} content={content.footer} />;
      case "hero": return <HeroComp key={i} content={content.hero} />;
      case "page-header": { const PH = pageHeaderById(plan.pageHeaderId).component; return <PH key={i} title={page.title} image={headerImageFor(page)} />; }
      case "services": { const C = sectionComponent("services", renderPlan) ?? Services; const { items, more } = sectionTeaser("services", content.services.items); return <C key={i} content={{ ...content.services, ...heads.services, heading: ddh(heads.services.heading), items }} more={more} onPick={servicePick} />; }
      case "service-body": {
        const it = content.services.items.find((x) => x.title === page.item);
        return it ? <ServiceBody key={i} title={it.title} summary={it.summary} bullets={it.bullets ?? SERVICE_BULLETS} body={it.body} image={it.image} /> : null;
      }
      case "team": { const C = sectionComponent("team", renderPlan) ?? Team; const { items, more } = sectionTeaser("team", content.team.members); const members = items.map((m) => ({ ...m, role: cleanRole(m.role) })); return <C key={i} content={{ ...content.team, ...heads.team, heading: ddh(heads.team.heading), members }} more={more} />; }
      case "pricing": { const C = sectionComponent("pricing", renderPlan) ?? Pricing; const { items, more } = sectionTeaser("pricing", content.pricing.tiers); return <C key={i} content={{ ...content.pricing, ...heads.pricing, heading: ddh(heads.pricing.heading), tiers: items }} more={more} />; }
      case "related": {
        // Two further services + a "back to all services" button (third grid cell) —
        // never three more cards with no way back to the overview.
        const overview = pages.find((p) => p.pageType === "services");
        return (
          <Related key={i} heading="Das könnte Sie auch interessieren"
            items={content.services.items.filter((x) => x.title !== page.item).slice(0, 2)}
            onPick={(t) => navigate(`/leistungen/${slugify(t)}`)}
            onAll={overview ? () => navigate(overview.slug) : undefined} />
        );
      }
      case "values": { const C = sectionComponent("values", renderPlan) ?? Values; const { items, more } = sectionTeaser("values", content.values.items); return <C key={i} content={{ ...content.values, ...heads.values, heading: ddh(heads.values.heading), items }} more={more} />; }
      case "stats": { const C = sectionComponent("stats", renderPlan) ?? Stats; return <C key={i} content={{ ...content.stats, items: statItems }} />; }
      case "process": { const C = sectionComponent("process", renderPlan); return C ? <C key={i} content={content.process ?? defaultProcess(genericVariant)} /> : null; }
      case "audience": { const C = sectionComponent("audience", renderPlan); if (!C) return null; const a = content.audience ?? defaultAudience(genericVariant); return <C key={i} content={isHome ? { ...a, items: a.items.slice(0, 3) } : a} />; }
      case "about": { const C = sectionComponent("about", renderPlan); if (!C) return null; const a = content.about ?? defaultAbout(); const heading = echoesPageTitle(a.heading) ? aboutAlt : a.heading; return <C key={i} content={{ ...a, heading }} />; }
      // Scrape-ONLY: rendered solely from real dated milestones, never scaffolded.
      case "history": { const C = sectionComponent("history", renderPlan); if (!C || !content.history) return null; return <C key={i} content={content.history} />; }
      case "feature": { const C = sectionComponent("feature", renderPlan); if (!C || !scenePool.length) return null; const ord = rhythmSections.slice(0, i).filter((x) => x === "feature").length; return <C key={i} content={featureBand(featureImageAt(ord), ord, content.featureAngles)} />; }
      case "testimonials": { const C = sectionComponent("testimonials", renderPlan) ?? Testimonials; return <C key={i} content={{ ...content.testimonials, ...heads.testimonials }} />; }
      case "faq": { const C = sectionComponent("faq", renderPlan) ?? Faq; const fq = { ...content.faq, ...heads.faq }; return <C key={i} content={isHome ? { ...fq, items: fq.items.slice(0, 5) } : fq} />; }
      case "gallery": { const C = sectionComponent("gallery", renderPlan); if (!C) return null; const { items, more } = sectionTeaser("gallery", galleryContent.images); return <C key={i} content={{ ...galleryContent, images: items }} more={more} />; }
      case "cta": { const C = sectionComponent("cta", renderPlan); const cta = { ...content.cta, ...heads.cta }; return C ? <C key={i} content={cta} /> : <CtaBand key={i} content={cta} bgImage={content.media?.sectionBackgrounds?.[0]} />; }
      // Contact renders only on pages WITHOUT a CTA band (i.e. /kontakt) — pages that
      // carry a CTA drop the contact slot earlier (one contact affordance per page).
      case "contact": { const C = sectionComponent("contact", renderPlan) ?? Contact; return <C key={i} content={{ ...content.contact, ...heads.contact }} />; }
      case "partners": { const C = sectionComponent("partners", renderPlan); const tc = { label: content.trust.label, items: content.trust.items, badges: content.media?.badges }; return C ? <C key={i} content={tc} /> : <TrustBar key={i} label={tc.label} items={tc.items} badges={tc.badges} />; }
      case "downloads": return content.media?.documents?.length ? <Downloads key={i} documents={content.media.documents} /> : null;
      case "legal-body": return <LegalBody key={i} doc={page.item ?? "Impressum"} firm={content.meta.firm} contact={content.contact} />;
      // No renderer yet (planned slots, intentionally absent from the homepage backbone):
      // intro, profile, quote, map, article-body. audience/process/about ARE rendered above.
      default: return null;
    }
  };

  // Image-embedding axis: surface a media gallery on the home page only when the firm
  // has >=3 REAL gallery-suitable photos (media.photos is scrape-only — no stock, no
  // portraits); fewer than that ⇒ no gallery. The studio can still force one.
  const wantGallery = (content.media?.photos?.length ?? 0) >= 3 || !!sectionOverrides?.["gallery"];
  const homeSections = isHome ? withGenericSlots(page.sections) : page.sections;
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
      case "gallery": return galleryContent.images.length >= 3 || !!sectionOverrides?.["gallery"];
      // Company timeline: ONLY when ≥3 real dated milestones were scraped, else the
      // slot is dropped from the page entirely (never an empty or scaffolded section).
      case "history": return (content.history?.entries.length ?? 0) >= 3;
      // Phantom slots that render nothing must NOT survive into the section list:
      // otherwise the image-rhythm pass counts them as image-less content and pads a
      // generic feature band between them (e.g. a "let's talk" band under the contact
      // form, because the contact page's `downloads`/`map` slots are empty). `map` has
      // no renderer yet; `downloads` only renders when the firm has documents.
      case "map": return false;
      case "downloads": return (content.media?.documents?.length ?? 0) > 0;
      default: return true;
    }
  };
  // One contact affordance per page: if the page already carries a CTA band (which
  // always renders a "Kontakt aufnehmen / Termin buchen" button), drop the standalone
  // contact section — a separate "Sprechen wir" preview next to a CTA is redundant.
  // The dedicated /kontakt page has no CTA band, so its form is kept.
  const pageHasCtaBand = displaySections.includes("cta");
  // One preview per subpage on the HOME: each subpage that exists is teased by
  // exactly ONE home section. Several home sections can map to the same subpage
  // (e.g. `values` AND `gallery` both → /ueber-uns) — keep ONE, drop the rest, so the
  // home never carries two previews of one page. The kept one follows a stable
  // PREFERENCE (not brief order): /ueber-uns prefers `values`, else `gallery`. Off
  // the home this is inert (sections render full on their own pages). PREVIEW_PREF is
  // shared with the guard via ../ia-rules.
  const previewTargetOf = (s: string): string | null => {
    const def = PREVIEW[s];
    if (!def) return null;
    const target = pages.find((p) => p.pageType === def.type);
    return target && target.slug !== page.slug ? def.type : null;
  };
  const keptPreviewSlot = new Map<string, string>(); // subpage pageType -> chosen home slot
  if (isHome) {
    for (const s of displaySections) {
      const t = previewTargetOf(s);
      if (!t || !slotHasContent(s)) continue;
      const cur = keptPreviewSlot.get(t);
      if (!cur || PREVIEW_PREF.indexOf(s) < PREVIEW_PREF.indexOf(cur)) keptPreviewSlot.set(t, s);
    }
  }
  const onePreviewPerSubpage = (s: string): boolean => {
    const t = isHome ? previewTargetOf(s) : null;
    return !t || keptPreviewSlot.get(t) === s;
  };
  const visibleSections = displaySections
    .filter(slotHasContent)
    .filter((s) => !(s === "contact" && pageHasCtaBand))
    .filter(onePreviewPerSubpage);
  // R5 — Homepage budget: a focused Treuhänder home shows ~HOME_MAX_CONTENT content
  // sections, not 12 (rule lives in ../ia-rules). When the brief stacks more, drop the
  // lowest-priority SUPPORTING sections — never hero/services/cta/contact, never
  // values/team (they aren't in HOME_DROP_ORDER). On top of that priority baseline we
  // tie-break by CONTENT STRENGTH: a section the firm has the LEAST real material for is
  // dropped before a richer one, so the budget is scrape-driven instead of a blind
  // fixed order (generic process/audience = strength 0 → go first; a firm's 8 real
  // testimonials outrank its thin stats). The final COUNT is identical either way.
  const slotStrength = (s: string): number => {
    switch (s) {
      case "services": return content.services.items.length;
      case "values": return content.values.items.length;
      case "team": return content.team.members.length;
      case "pricing": return content.pricing.tiers.length;
      case "testimonials": return content.testimonials.items.length;
      case "stats": return statItems.length;
      case "faq": return content.faq.items.length;
      case "partners": return content.trust.items.length + (content.media?.badges?.length ?? 0);
      case "gallery": return galleryContent.images.length;
      default: return 0; // process/audience = generic boilerplate → weakest, drop first
    }
  };
  const budgetedSections = (() => {
    if (!isHome) return visibleSections;
    const countContent = (ss: string[]) => ss.filter((s) => s !== "nav" && s !== "footer").length;
    const candidates = HOME_DROP_ORDER
      .filter((s) => visibleSections.includes(s))
      .sort((a, b) => (slotStrength(a) - slotStrength(b)) || (HOME_DROP_ORDER.indexOf(a) - HOME_DROP_ORDER.indexOf(b)));
    const drop = new Set<string>();
    for (const s of candidates) {
      if (countContent(visibleSections.filter((x) => !drop.has(x))) <= HOME_MAX_CONTENT) break;
      drop.add(s);
    }
    return visibleSections.filter((s) => !drop.has(s));
  })();
  // Image rhythm: never more than 2 image-less content sections in a row — insert an
  // image-forward feature band (real photo, else stock) to break a longer run, so the
  // page keeps coming back to a picture.
  const isImageSection = (slot: string): boolean => {
    switch (slot) {
      case "feature": case "gallery": return true;
      case "hero": return !!content.hero?.image && (imageHeroIds.includes(resolvedHeroId) || !homeImaged);
      case "page-header": return /image-/.test(plan.pageHeaderId) && !!headerImageFor(page);
      case "team": return content.team.members.some((m) => m.photo) && activePlan.sections.team !== "team/plain";
      case "services": return activePlan.sections.services === "services/media-cards";
      default: return false;
    }
  };
  // Generic image-rhythm feature bands are a HOME-page device only. On focused
  // subpages (service-detail, contact, …) an inserted band re-advertises another
  // service ("…noch mal der Steuerberatungsbaustein") with no reason — so subpages
  // render their defined sections as-is.
  const rhythmSections = isHome ? enforceImageRhythm(budgetedSections, isImageSection, scenePool.length > 0) : budgetedSections;
  // Now that the rendered order is known, keep two same-family sections from sitting
  // directly adjacent (studio-forced slots stay locked).
  const decollided = decollideSections(rhythmSections, activePlan, content, {
    seed, locked: new Set(Object.keys(sectionOverrides ?? {})),
  });
  // On the dedicated Team page, give each person more room: swap the compact
  // homepage team grid for a spacious team layout (a studio override wins).
  if (page.pageType === "team" && !sectionOverrides?.["team"]) {
    const roomy = spaciousTeamVariant(content, activePlan, seed);
    if (roomy) decollided.team = roomy;
  }
  renderPlan = { ...activePlan, sections: decollided };

  return (
    <div className="ds-motion" data-motion={motionStyleForKit(plan.kitId)} style={applyLook(look)}>
      <ResponsiveStyles />
      <MotionStyles />
      <IconSetProvider value={iconSetById(plan.iconSetId)}>
      <PrimaryStyleProvider value={buttonStyle}>
      <MoreStyleProvider value={plan.moreStyle}>
        <NavigationContext.Provider value={navigate}>
          {rhythmSections.map((s, i) => {
            const node = renderSlot(s, i);
            if (!node) return null;
            // nav is sticky — wrapping it in a transform would break sticky; render raw
            if (s === "nav" || s === "footer") return <React.Fragment key={i}>{node}</React.Fragment>;
            return <Reveal key={i}>{node}</Reveal>;
          })}
        </NavigationContext.Provider>
      </MoreStyleProvider>
      </PrimaryStyleProvider>
      </IconSetProvider>
    </div>
  );
};
