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
import { PrimaryStyleProvider, MoreStyleProvider, type PrimaryStyle, type MoreStyle } from "../structures/primitives";
import { IconSetProvider, iconSetById } from "../icons/iconSets";
import { NavigationContext } from "./nav-context";
import { Reveal } from "../motion/Reveal";
import { useBrandFonts } from "../looks/useBrandFonts";
import { ResponsiveStyles } from "../structures/Responsive";
import { MotionStyles } from "../motion/MotionStyles";
import { motionStyleForKit, type MotionStyleId } from "../motion/motionStyle";
import { defaultProcess, defaultAudience, defaultAbout, featureBand, withGenericSlots } from "../content/sectionDefaults";
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
  /** Re-roll ONLY the imagery (hero/service/gallery/background) without touching the
   *  layout/variant plan: in pitch mode it shifts the licensed-stock picks, in real
   *  mode it rotates the firm's own photo pools. 0/undefined = the deterministic default. */
  imageSeed?: number;
  /** Force the subpage page-header variant (else the selector picks one). */
  pageHeaderId?: string;
  /** Force the icon set (else the selector picks one). */
  iconSetId?: string;
  /** Force the section→subpage "view all" link style (else the selector picks one). */
  moreStyle?: MoreStyle;
  /** Force the micro-interaction / motion family (else derived from the kit). */
  motionStyle?: MotionStyleId;
}

export const SiteRouter: React.FC<SiteRouterProps> = ({ content: rawContent, archetype, seed, lookId, heroId, primaryStyle, sectionOverrides, kitId, pitch, imageSeed, pageHeaderId, iconSetId, moreStyle, motionStyle }) => {
  // No photo may appear twice across the site — hero/service/gallery/background
  // disjoint (team photos exempt). Applied once before planning/rendering.
  const content = React.useMemo(() => {
    let c = dedupeImages(rawContent);
    const k = imageSeed ?? 0;
    if (!pitch) {
      // Real-image re-roll: rotate the firm's own photo pools so a different photo
      // lands in the hero / gallery / feature bands (k===0 → untouched default).
      if (k) {
        const rot = <T,>(a: T[]): T[] => { if (!a.length) return a; const n = ((k % a.length) + a.length) % a.length; return [...a.slice(n), ...a.slice(0, n)]; };
        const photos = rot(c.media?.photos ?? []);
        const bgs = rot([...(c.media?.sectionBackgrounds ?? [])].reverse());
        const pool = [c.hero?.image, ...bgs, ...photos].filter(Boolean) as string[];
        const heroImg = pool.length ? pool[k % pool.length] : c.hero?.image;
        c = {
          ...c,
          hero: { ...c.hero, image: heroImg },
          media: { ...c.media, photos: photos.filter((s) => s !== heroImg), sectionBackgrounds: bgs.filter((s) => s !== heroImg) },
        };
      }
      return c;
    }
    // Cold-acquisition: keep EVERY section, but swap the firm's real/scraped photos
    // for licensed stock (served at /stock). Logo → name wordmark; third-party
    // badges dropped (a badge has no stock equivalent); team → monogram (no portrait
    // stock — never fake a real person's face). Recognition stays via brand colour +
    // name + structure. Picks are deterministic per firm so they're stable.
    const dom = c.meta.domain || c.meta.firm || "x";
    const heroImg = stockPick(STOCK_TOPICS.hero, dom + "/hero", 1, k)[0];
    const svcImgs: Record<string, string> = {};
    (c.services?.items ?? []).forEach((s, i) => { const u = stockPick(STOCK_TOPICS.work, dom + "/svc/" + s.title, 1, i + k * 7)[0]; if (u) svcImgs[s.title] = u; });
    return {
      ...c,
      nav: { ...c.nav, logo: undefined, logoLight: undefined },
      footer: { ...c.footer, logo: undefined, logoLight: undefined },
      hero: { ...c.hero, image: heroImg },
      // Each service item carries its OWN real photo (it.image) — rendered by every
      // services variant (grid/accordion/bordered/extended), the service-detail body
      // AND its page-header. media.serviceImages alone does NOT cover these, so the
      // real photo would leak. Swap each for the matched licensed stock (svcImgs);
      // a missing pick leaves it undefined (no image) — never a real firm photo.
      services: { ...c.services, items: (c.services?.items ?? []).map((s) => ({ ...s, image: svcImgs[s.title] })) },
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
        photos: stockPick(STOCK_TOPICS.scene, dom + "/gallery", 8, k),
        sectionBackgrounds: stockPick(STOCK_TOPICS.wide, dom + "/bg", 3, k),
        serviceImages: svcImgs,
        // Cold-acquisition: the firm's real Merkblätter/Checklisten/forms are their own
        // material — never offer them on an unsolicited mock. Empty → the downloads slot
        // renders nothing (no link, no fetch).
        documents: [],
      },
    };
  }, [rawContent, pitch, imageSeed]);
  const arch = (archetype ?? (content.meta.archetype as ArchetypeId)) || "boutique";
  useBrandFonts(content.meta.fontsToLoad);
  const baseId = content.meta.basePresetId ?? content.meta.lookId;
  const planBase = planSite(content, { seed, lookId: lookId ?? baseId, kitId });
  // Per-element overrides from the studio / approved plan win over the auto pick.
  const plan = { ...planBase,
    pageHeaderId: pageHeaderId ?? planBase.pageHeaderId,
    iconSetId: iconSetId ?? planBase.iconSetId,
    moreStyle: moreStyle ?? planBase.moreStyle,
  };
  const activePlan = sectionOverrides ? { ...plan, sections: { ...plan.sections, ...sectionOverrides } } : plan;
  // The section variants actually rendered. Starts as the plan's picks; the
  // adjacency de-collision pass (after the page's section order is known) reassigns
  // this so no two neighbouring sections share a layout family.
  let renderPlan = activePlan;
  // A forced lookId wins ONLY if it resolves to a real preset; an unknown id (e.g. a
  // published-plan record frozen against a since-renamed preset) falls back to the
  // brand/auto look instead of crashing the whole render with `undefined`.
  const look = (lookId && presets[lookId]) ? presets[lookId] : (content.meta.look ?? presets[plan.lookId] ?? presets[content.meta.lookId]);
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
    // Pitch (cold-acquisition) fills this with licensed STOCK scenes — so never a heading
    // that claims the firm's own premises ("Bei uns vor Ort." / "Impressionen aus {city}");
    // a neutral, profession-generic label keeps the stock honest.
    heading: pitch ? "Moderne Treuhand-Arbeit." : heads.gallery.heading,
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
  const allPages = brief
    ? resolvePages(brief.pageRefs, brief.homepageSlots, content, { includeOptional: true })
    : composeSite(arch, content, { includeOptional: true });
  // The "Über uns" page renders the about prose AND the team + company history.
  // Keep it whenever ANY of those is real; only when ALL are empty do we drop it (and
  // its previews) so we never ship a hollow, scaffold-/blog-filled about page. Dropping
  // the owner page makes `sectionTeaser` render the home values/gallery in FULL (no
  // "Mehr über uns" link to an empty page) instead of as about-previews.
  const hasUeberUns = !!content.about || (content.team?.members?.length ?? 0) > 0 || !!content.history;
  const pages = hasUeberUns ? allPages : allPages.filter((p) => p.pageType !== "about");
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
  // Pages that pull a DISTINCT header image from the SCENE pool: every subpage with a
  // page-header EXCEPT service-detail (home/contact have none). Each gets a DENSE rank,
  // so consecutive pages take the next distinct image — the same picture never lands on
  // two subpage headers. Repeats only once the pool is physically exhausted.
  const sceneHeaderPages = pages.filter(
    (p) => !["home", "contact", "service-detail"].includes(p.pageType) && p.sections.includes("page-header"),
  );
  const headerRank = new Map(sceneHeaderPages.map((p, idx) => [p.slug, idx]));
  // ALL service-detail pages share ONE CONSTANT header image: the subpage hero is a
  // stable "Leistungen" identity that stays put while you switch between services —
  // only the ServiceBody below changes per service. It draws from the scene pool
  // (reserved slot just past the ranked headers, so it tends to differ from them),
  // which excludes every service photo — so it can never equal a service-detail's own
  // body image.
  const serviceHeaderImage = sceneAt(sceneHeaderPages.length);
  const headerImageFor = (p: ResolvedPage): string | undefined => {
    if (p.pageType === "service-detail") {
      const own = content.services.items.find((x) => x.title === p.item)?.image;
      // EXACTLY ONE image per service-detail page: when the ServiceBody below shows the
      // service's OWN photo, the header stays text-only (the photo header variants fall
      // back gracefully). Only services WITHOUT an own photo get the scene image in the
      // header — so the page never shows a header photo AND a body photo at once.
      if (own) return undefined;
      return serviceHeaderImage ?? content.hero?.image;
    }
    const r = headerRank.get(p.slug);
    return (r != null ? sceneAt(r) : undefined) ?? content.hero?.image;
  };
  // Home feature bands draw from the scene pool PAST the header range AND the reserved
  // service-detail slot, so a band never reuses a subpage header image (until it wraps).
  const featureImageAt = (ord: number): string | undefined => sceneAt(sceneHeaderPages.length + 1 + ord);
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

  // --- Content-quality guards: drop the systematic generator filler so subpages are
  //     not all identical. Only genuine, per-service/-person material reaches a page;
  //     copy the extractor cloned onto several items (or the known boilerplate) is
  //     dropped — a detail page then stands on its real, distinct summary alone.
  const svcItems = content.services?.items ?? [];
  const bodyFreq: Record<string, number> = {};
  const bulletFreq: Record<string, number> = {};
  svcItems.forEach((s) => { if (s.body?.trim()) bodyFreq[s.body.trim()] = (bodyFreq[s.body.trim()] ?? 0) + 1; const k = (s.bullets ?? []).join("|"); if (k) bulletFreq[k] = (bulletFreq[k] ?? 0) + 1; });
  const GENERIC_SVC_BODY = /^Diese Leistung übernehmen wir vollständig und termingerecht/;
  const realServiceBody = (s: { body?: string }): string | undefined =>
    s.body && bodyFreq[s.body.trim()] < 2 && !GENERIC_SVC_BODY.test(s.body) ? s.body : undefined;
  const realServiceBullets = (s: { bullets?: string[] }): string[] => {
    const k = (s.bullets ?? []).join("|");
    return s.bullets?.length && bulletFreq[k] < 2 ? s.bullets : [];
  };
  // Team bios the extractor cloned onto several people (generic role copy) → dropped, so
  // a card shows the real name + role, never the same sentence on five people.
  const bioFreq: Record<string, number> = {};
  (content.team?.members ?? []).forEach((m) => { if (m.bio?.trim()) bioFreq[normHead(m.bio)] = (bioFreq[normHead(m.bio)] ?? 0) + 1; });
  const dedupMembers = <T extends { bio?: string }>(members: T[]): T[] => members.map((m) => (m.bio && bioFreq[normHead(m.bio)] >= 2 ? { ...m, bio: "" } : m));
  // The footer tagline cloned the hero lede on most firms — replace that echo with a
  // concise, real service line (Buchhaltung · Steuern · …).
  const footerContent = (() => {
    const f = content.footer;
    if (f.tagline && normHead(f.tagline) === normHead(content.hero?.lede)) {
      return { ...f, tagline: svcItems.slice(0, 3).map((s) => s.title).filter(Boolean).join(" · ") };
    }
    return f;
  })();
  // The hero aside is a quote slot. Don't show a quote there that the page already shows
  // elsewhere: the Testimonials section is the canonical home for a real testimonial, and
  // the lede must not be echoed back as a "quote" — either case is two identical quotes.
  const heroContent = (() => {
    const h = content.hero;
    // (1) Headline quality: a title that is really just the firm name (± a legal suffix /
    // location) or an all-lowercase brand string is no headline — use the benefit scaffold.
    // Mirrors extract.ts; also repairs briefs frozen before that rule existed.
    const brand = content.nav?.brand || "";
    const full = [h.titleLead, h.titleAccent, h.titleTail].filter(Boolean).join(" ").trim();
    const nz = (x: string) => x.toLowerCase().replace(/[^a-zäöü0-9 ]/g, " ").replace(/\s+/g, " ").trim();
    const hn = nz(full), fn = nz(brand);
    const isName = !!fn && (hn === fn || (hn.includes(fn) && hn.replace(fn, " ").replace(/\b(ag|gmbh|kg|sa|sarl|gruppe|partner|treuhand|in|im|bei|zur|und|der|die|das|zh|be|lu|sg|tg|ar|sz|zg)\b/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length <= 1));
    const isLower = !!full && !/[A-ZÄÖÜ]/.test(full);
    let hero = (isName || isLower) ? { ...h, titleLead: "Ihre Finanzen,", titleAccent: "klar geführt.", titleTail: "" } : h;
    // (2) clip an over-long lede on a clean word boundary
    if (hero.lede && hero.lede.length > 200) {
      const w = hero.lede.slice(0, 180); const sp = w.lastIndexOf(" ");
      hero = { ...hero, lede: (sp > 100 ? w.slice(0, sp) : w).replace(/[\s,;:–-]+$/, "") + "…" };
    }
    // (3) aside-quote dedup (a real testimonial / the lede must not be echoed as a quote)
    const q = hero.asideQuote?.trim();
    if (!q) return hero;
    const dupesTestimonial = (content.testimonials?.items ?? []).some((t) => normHead(t.quote) === normHead(q));
    if (dupesTestimonial || normHead(q) === normHead(hero.lede)) return { ...hero, asideQuote: "", asideLabel: "", asideAttribution: "" };
    return hero;
  })();

  const renderSlot = (s: string, i: number): React.ReactNode => {
    switch (s) {
      case "nav": return <Nav key={i} content={navContent} current={page.slug} />;
      case "footer": return <Footer key={i} content={footerContent} />;
      case "hero": return <HeroComp key={i} content={heroContent} />;
      case "page-header": { const PH = pageHeaderById(plan.pageHeaderId).component; return <PH key={i} title={page.title} image={headerImageFor(page)} />; }
      case "services": { const C = sectionComponent("services", renderPlan) ?? Services; const { items, more } = sectionTeaser("services", content.services.items); return <C key={i} content={{ ...content.services, ...heads.services, heading: ddh(heads.services.heading), items }} more={more} onPick={servicePick} />; }
      case "service-body": {
        const it = content.services.items.find((x) => x.title === page.item);
        return it ? <ServiceBody key={i} title={it.title} summary={it.summary} bullets={realServiceBullets(it)} body={realServiceBody(it)} image={it.image} /> : null;
      }
      case "team": { const C = sectionComponent("team", renderPlan) ?? Team; const { items, more } = sectionTeaser("team", content.team.members); const members = dedupMembers(items).map((m) => ({ ...m, role: cleanRole(m.role) })); return <C key={i} content={{ ...content.team, ...heads.team, heading: ddh(heads.team.heading), members }} more={more} />; }
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
      case "values": { const C = sectionComponent("values", renderPlan) ?? Values; const { items, more } = sectionTeaser("values", content.values.items); return <C key={i} content={{ ...content.values, ...heads.values, heading: ddh(heads.values.heading), items, image: sceneForSlot("values", i) }} more={more} />; }
      case "stats": { const C = sectionComponent("stats", renderPlan) ?? Stats; return <C key={i} content={{ ...content.stats, items: statItems }} />; }
      case "process": { const C = sectionComponent("process", renderPlan); return C ? <C key={i} content={{ ...(content.process ?? defaultProcess(genericVariant)), image: sceneForSlot("process", i) }} /> : null; }
      case "audience": { const C = sectionComponent("audience", renderPlan); if (!C) return null; const a = content.audience ?? defaultAudience(genericVariant); return <C key={i} content={{ ...(isHome ? { ...a, items: a.items.slice(0, 3) } : a), image: sceneForSlot("audience", i) }} />; }
      case "about": { const C = sectionComponent("about", renderPlan); if (!C) return null; const a = content.about ?? defaultAbout(); const heading = echoesPageTitle(a.heading) ? aboutAlt : a.heading; return <C key={i} content={{ ...a, heading, image: sceneForSlot("about", i) }} />; }
      // Scrape-ONLY: rendered solely from real dated milestones, never scaffolded.
      case "history": { const C = sectionComponent("history", renderPlan); if (!C || !content.history) return null; return <C key={i} content={content.history} />; }
      case "feature": { const C = sectionComponent("feature", renderPlan); if (!C || !scenePool.length) return null; const ord = rhythmSections.slice(0, i).filter((x) => x === "feature").length; const img = isHome ? homeSceneAt(i) : featureImageAt(ord); if (!img) return null; return <C key={i} content={featureBand(img, ord, content.featureAngles)} />; }
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
  // render (nav, hero, cta, contact, about).
  const slotHasContent = (s: string): boolean => {
    switch (s) {
      case "services": return content.services.items.length > 0;
      case "values": return content.values.items.length > 0;
      case "team": return content.team.members.length > 0;
      case "pricing": return content.pricing.tiers.length > 0;
      case "testimonials": return content.testimonials.items.length > 0;
      case "stats": return statItems.length > 0;
      case "faq": return content.faq.items.length > 0;
      // process/audience: real-mode shows them ONLY when actually scraped (no generic
      // "So arbeiten wir"/"Für wen" filler on every site). Pitch mode keeps the generic
      // framing — it's true-for-any-Treuhänder, not a fabricated fact, and gives the
      // cold-acquisition mock body. (about stays: it's the cornerstone subpage.)
      case "process": return pitch || !!content.process;
      case "audience": return pitch || !!content.audience;
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
  // Image rhythm: a page should keep coming back to a picture — but we do NOT insert a
  // generic filler band for that. Instead we PROMOTE a section that is ALREADY on the
  // page to its image variant ("eine nötige Section bildtragend gestalten"): the generic
  // content sections (about/values/audience/process) gain a "…/photo-split" layout fed a
  // scene photo, or services → media-cards when every card has a photo. team/gallery
  // already count when present with photos.
  const hasScene = scenePool.length > 0;
  // A distinct scene photo per HOME section index — keyed by position so two promoted
  // sections (or feature bands) never show the same picture. Past the subpage-header +
  // service-header reservations so it stays disjoint from those too.
  const homeSceneAt = (i: number): string | undefined => sceneAt(sceneHeaderPages.length + 1 + i);
  const PHOTO_PROMO: Record<string, string> = {
    about: "about/photo-frame", values: "values/photo-split",
    audience: "audience/photo-split", process: "process/photo-split",
  };
  const isImageSection = (slot: string, secs: Record<string, string> = activePlan.sections): boolean => {
    switch (slot) {
      case "feature": case "gallery": return true;
      case "hero": return !!content.hero?.image && (imageHeroIds.includes(resolvedHeroId) || !homeImaged);
      case "page-header": return /image-/.test(plan.pageHeaderId) && !!headerImageFor(page);
      case "team": return content.team.members.some((m) => m.photo) && secs.team !== "team/plain";
      case "services": return secs.services === "services/media-cards";
      case "about": case "values": case "audience": case "process":
        return /\/(photo|image)/.test(secs[slot] ?? "") && hasScene;
      default: return false;
    }
  };
  // Which already-present slot can be UPGRADED to an image variant (and to which one).
  const servicesAllImaged = (content.services?.items ?? []).length > 0 && (content.services?.items ?? []).every((s) => !!s.image);
  const promoteTo = (slot: string, secs: Record<string, string>): string | null => {
    if (isImageSection(slot, secs)) return null;          // already a picture
    if (PHOTO_PROMO[slot] && hasScene) return PHOTO_PROMO[slot];
    if (slot === "services" && servicesAllImaged) return "services/media-cards";
    return null;
  };
  // Home only: walk the section order and, whenever MORE than 2 image-less content
  // sections would sit in a row, promote the nearest still-promotable section IN that
  // run to its image variant — never insert an extra band. Focused subpages render
  // their defined sections as-is. Promoted slots are locked so the de-collision /
  // diversity passes keep the image variant.
  const promoted = new Set<string>();
  const planSecs: Record<string, string> = { ...activePlan.sections };
  if (isHome) {
    const maxGap = 2;
    let gap = 0;
    for (let i = 0; i < budgetedSections.length; i++) {
      const slot = budgetedSections[i];
      if (slot === "nav" || slot === "footer") continue;
      if (isImageSection(slot, planSecs)) { gap = 0; continue; }
      if (gap >= maxGap) {
        let done = false;
        for (let j = i; j > i - 1 - gap && j >= 0; j--) {
          const cand = budgetedSections[j];
          if (cand === "nav" || cand === "footer" || promoted.has(cand)) continue;
          const v = promoteTo(cand, planSecs);
          if (v) { planSecs[cand] = v; promoted.add(cand); gap = i - j; done = true; break; }
        }
        if (!done) gap += 1;        // nothing promotable in this run — leave it text
        continue;
      }
      gap += 1;
    }
  }
  const rhythmSections = budgetedSections; // order unchanged — pictures come from promoted sections, not inserted bands
  // Now that the rendered order is known, keep two same-family sections from sitting
  // directly adjacent (studio-forced AND rhythm-promoted slots stay locked).
  const decollided = decollideSections(rhythmSections, { ...activePlan, sections: planSecs }, content, {
    seed, locked: new Set([...Object.keys(sectionOverrides ?? {}), ...promoted]),
  });
  // On the dedicated Team page, give each person more room: swap the compact
  // homepage team grid for a spacious team layout (a studio override wins).
  if (page.pageType === "team" && !sectionOverrides?.["team"]) {
    const roomy = spaciousTeamVariant(content, activePlan, seed);
    if (roomy) decollided.team = roomy;
  }
  renderPlan = { ...activePlan, sections: decollided };
  // The scene photo fed to a promoted content section (about/values/audience/process)
  // when its resolved variant is a "…/photo-*" layout — distinct per home position,
  // else undefined so the variant renders its text fallback.
  const sceneForSlot = (slot: string, i: number): string | undefined =>
    /\/(photo|image)/.test(renderPlan.sections[slot] ?? "") ? (isHome ? homeSceneAt(i) : serviceHeaderImage) : undefined;

  return (
    <div className="ds-motion" data-motion={motionStyle ?? motionStyleForKit(plan.kitId)} style={applyLook(look)}>
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
