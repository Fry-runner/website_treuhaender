/**
 * SiteComposer — the generation engine.
 * Renders a full homepage = composeHomepage(archetype) (the section order)
 * × applyLook(preset) (the visual language) × SiteContent (the client material).
 * Slots without a built structure are skipped gracefully.
 */
import React from "react";
import { applyLook } from "../looks/applyLook";
import { composeHomepage, type ArchetypeId } from "../blueprints";
import { presets } from "../tokens";
import type { SiteContent } from "../content/types";
import { defaultProcess, defaultAudience, featureBand, withGenericSlots, injectFeature } from "../content/sectionDefaults";
import { firmHeadings } from "../content/sectionHeads";
import { planSite, heroById, sectionComponent, decollideSections } from "../variants/select";
import { dedupeImages } from "../content/uniqueImages";
import { PrimaryStyleProvider } from "../structures/primitives";
import { IconSetProvider, iconSetById } from "../icons/iconSets";
import { Reveal } from "../motion/Reveal";
import { useBrandFonts } from "../looks/useBrandFonts";
import { ResponsiveStyles } from "../structures/Responsive";

import { Nav } from "../structures/Nav";
import { HeroSplit } from "../structures/HeroSplit";
import { TrustBar } from "../structures/TrustBar";
import { Services } from "../structures/Services";
import { Values } from "../structures/Values";
import { Testimonials } from "../structures/Testimonials";
import { Stats } from "../structures/Stats";
import { Faq } from "../structures/Faq";
import { CtaBand } from "../structures/CtaBand";
import { Contact } from "../structures/Contact";
import { Footer } from "../structures/Footer";
import { Team } from "../structures/Team";
import { Pricing } from "../structures/Pricing";

type Renderer = (c: SiteContent) => React.ReactNode;

/** slot -> structure. Slots not present here (intro, audience, process, team,
 * pricing, profile, quote, map, legal) are skipped until their structures exist. */
const renderers: Record<string, Renderer> = {
  nav: (c) => <Nav content={c.nav} />,
  hero: (c) => <HeroSplit content={c.hero} />,
  partners: (c) => <TrustBar label={c.trust.label} items={c.trust.items} badges={c.media?.badges} />,
  services: (c) => <Services content={c.services} />,
  values: (c) => <Values content={c.values} />,
  team: (c) => <Team content={c.team} />,
  pricing: (c) => <Pricing content={c.pricing} />,
  testimonials: (c) => <Testimonials content={c.testimonials} />,
  stats: (c) => <Stats content={c.stats} />,
  faq: (c) => <Faq content={c.faq} />,
  cta: (c) => <CtaBand content={c.cta} />,
  contact: (c) => <Contact content={c.contact} />,
  footer: (c) => <Footer content={c.footer} />,
};

export interface SiteComposerProps {
  content: SiteContent;
  archetype?: ArchetypeId;
  /** Force a palette; otherwise the selector picks one compatible with the archetype. */
  lookId?: string;
  /** Vary to regenerate a different (but coherent) variant set for the same firm. */
  seed?: number;
  /** Force a coherent style kit (else the selector picks one for the affinity). */
  kitId?: string;
}

export const SiteComposer: React.FC<SiteComposerProps> = ({ content: rawContent, archetype, lookId, seed, kitId }) => {
  // No photo may appear twice on a site — hero/service/gallery/background disjoint
  // (team photos exempt). Applied once before planning/rendering.
  const content = React.useMemo(() => dedupeImages(rawContent), [rawContent]);
  const arch = (archetype ?? (content.meta.archetype as ArchetypeId)) || "boutique";
  useBrandFonts(content.meta.fontsToLoad);
  // Variant set keys off the BASE preset's affinity; the brand-tinted look (or a
  // forced lookId) supplies the actual colours/fonts.
  const baseId = content.meta.basePresetId ?? content.meta.lookId;
  const plan = planSite(content, { seed, lookId: lookId ?? baseId, kitId });
  const look = lookId ? presets[lookId] : (content.meta.look ?? presets[plan.lookId] ?? presets[content.meta.lookId]);
  const Hero = heroById(plan.heroId).component;
  // Section variants actually rendered; reassigned below (once the order is known)
  // by the adjacency de-collision pass so no two neighbours share a layout family.
  let renderPlan = plan;
  // Real metrics only: drop stats whose number is zero ("0+" scaffold leftovers).
  const statItems = content.stats.items.filter((it) => {
    const d = String(it.value).replace(/[^0-9]/g, "");
    return d === "" || Number(d) !== 0;
  });
  // Per-firm section framing (deterministic by domain+seed) so headings vary
  // firm-to-firm instead of every generated site reading identically.
  const heads = firmHeadings(content, seed ?? 0);
  const slotRender: Record<string, Renderer> = {
    ...renderers,
    hero: (c) => <Hero content={c.hero} />,
    services: (c) => { const C = sectionComponent("services", renderPlan) ?? Services; return <C content={{ ...c.services, ...heads.services }} />; },
    cta: (c) => { const C = sectionComponent("cta", renderPlan); const cta = { ...c.cta, ...heads.cta }; return C ? <C content={cta} /> : <CtaBand content={cta} bgImage={c.media?.sectionBackgrounds?.[0]} />; },
    testimonials: (c) => { const C = sectionComponent("testimonials", renderPlan) ?? Testimonials; return <C content={{ ...c.testimonials, ...heads.testimonials }} />; },
    values: (c) => { const C = sectionComponent("values", renderPlan) ?? Values; return <C content={{ ...c.values, ...heads.values }} />; },
    stats: (c) => { const C = sectionComponent("stats", renderPlan) ?? Stats; return <C content={{ ...c.stats, items: statItems }} />; },
    team: (c) => { const C = sectionComponent("team", renderPlan) ?? Team; return <C content={{ ...c.team, ...heads.team }} />; },
    faq: (c) => { const C = sectionComponent("faq", renderPlan) ?? Faq; return <C content={{ ...c.faq, ...heads.faq }} />; },
    gallery: (c) => { const C = sectionComponent("gallery", renderPlan); return C ? <C content={{ ...heads.gallery, images: c.media?.photos ?? [], logo: c.media?.logo, badges: c.media?.badges ?? [] }} /> : null; },
    pricing: (c) => { const C = sectionComponent("pricing", renderPlan) ?? Pricing; return <C content={{ ...c.pricing, ...heads.pricing }} />; },
    partners: (c) => { const C = sectionComponent("partners", renderPlan); const tc = { label: c.trust.label, items: c.trust.items, badges: c.media?.badges }; return C ? <C content={tc} /> : <TrustBar label={tc.label} items={tc.items} badges={tc.badges} />; },
    contact: (c) => { const C = sectionComponent("contact", renderPlan) ?? Contact; return <C content={{ ...c.contact, ...heads.contact }} />; },
    process: (c) => { const C = sectionComponent("process", renderPlan); return C ? <C content={c.process ?? defaultProcess()} /> : null; },
    audience: (c) => { const C = sectionComponent("audience", renderPlan); return C ? <C content={c.audience ?? defaultAudience()} /> : null; },
    feature: (c) => { const C = sectionComponent("feature", renderPlan); const img = c.media?.photos?.[0] ?? c.media?.sectionBackgrounds?.[0]; return (C && img) ? <C content={featureBand(img, 0, c.featureAngles)} /> : null; },
  };
  // Content-driven section sequence from the brief; archetype backbone as fallback.
  let baseSeq = withGenericSlots(content.meta.brief?.homepageSlots ?? composeHomepage(arch).map((s) => s.slot));
  // Image-forward feature band, injected mid-page only when a usable image exists.
  const featImg = content.media?.photos?.[0] ?? content.media?.sectionBackgrounds?.[0];
  if (featImg) baseSeq = injectFeature(baseSeq);
  // Image-embedding axis: append a media gallery when the firm actually has photos.
  const fullSeq = (content.media?.photos?.length ?? 0) >= 2 && !baseSeq.includes("gallery")
    ? (() => { const at = baseSeq.indexOf("cta"); return at >= 0 ? [...baseSeq.slice(0, at), "gallery", ...baseSeq.slice(at)] : [...baseSeq, "gallery"]; })()
    : baseSeq;
  // Skip content sections the firm has no material for — an empty values/faq/stats/…
  // would otherwise render as a lone heading.
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
      case "gallery": return (content.media?.photos?.length ?? 0) > 0;
      default: return true;
    }
  };
  const sequence = fullSeq.filter(slotHasContent);
  // With the rendered order known, keep two same-family sections off each other.
  renderPlan = { ...plan, sections: decollideSections(sequence, plan, content, { seed }) };
  return (
    <div style={applyLook(look)}>
      <ResponsiveStyles />
      <IconSetProvider value={iconSetById(plan.iconSetId)}>
        <PrimaryStyleProvider value={plan.primaryStyle}>
          {sequence.map((slot, i) => {
            const r = slotRender[slot];
            if (!r) return null;
            const node = r(content);
            return slot === "nav" || slot === "footer"
              ? <React.Fragment key={i}>{node}</React.Fragment>
              : <Reveal key={i}>{node}</Reveal>;
          })}
        </PrimaryStyleProvider>
      </IconSetProvider>
    </div>
  );
};
