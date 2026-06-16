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
import { planSite, heroById, sectionComponent } from "../variants/select";
import { PrimaryStyleProvider } from "../structures/primitives";
import { Reveal } from "../motion/Reveal";

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
  partners: (c) => <TrustBar label={c.trust.label} items={c.trust.items} />,
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
}

export const SiteComposer: React.FC<SiteComposerProps> = ({ content, archetype, lookId, seed }) => {
  const arch = (archetype ?? (content.meta.archetype as ArchetypeId)) || "boutique";
  // pick a coherent variant set: palette + hero structure + button style.
  // lookId prop forces the palette; otherwise the selector chooses one.
  const plan = planSite(content, { seed, lookId });
  const look = presets[plan.lookId] ?? presets[content.meta.lookId];
  const Hero = heroById(plan.heroId).component;
  const slotRender: Record<string, Renderer> = {
    ...renderers,
    hero: (c) => <Hero content={c.hero} />,
    services: (c) => { const C = sectionComponent("services", plan) ?? Services; return <C content={c.services} />; },
    cta: (c) => { const C = sectionComponent("cta", plan) ?? CtaBand; return <C content={c.cta} />; },
    testimonials: (c) => { const C = sectionComponent("testimonials", plan) ?? Testimonials; return <C content={c.testimonials} />; },
    values: (c) => { const C = sectionComponent("values", plan) ?? Values; return <C content={c.values} />; },
    stats: (c) => { const C = sectionComponent("stats", plan) ?? Stats; return <C content={c.stats} />; },
    team: (c) => { const C = sectionComponent("team", plan) ?? Team; return <C content={c.team} />; },
    faq: (c) => { const C = sectionComponent("faq", plan) ?? Faq; return <C content={c.faq} />; },
  };
  const sequence = composeHomepage(arch);
  return (
    <div style={applyLook(look)}>
      <PrimaryStyleProvider value={plan.primaryStyle}>
        {sequence.map((s, i) => {
          const r = slotRender[s.slot];
          if (!r) return null;
          const node = r(content);
          return s.slot === "nav" || s.slot === "footer"
            ? <React.Fragment key={i}>{node}</React.Fragment>
            : <Reveal key={i}>{node}</Reveal>;
        })}
      </PrimaryStyleProvider>
    </div>
  );
};
