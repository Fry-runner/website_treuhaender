import React from 'react';
import { ActiveView, Language, TranslationDictionary } from '../types';
import TurevaLines from './TurevaLines';
import { ArrowUpRight, ShieldCheck, Users } from 'lucide-react';

interface HomeViewProps {
  setActiveView: (view: ActiveView) => void;
  lang: Language;
  t: TranslationDictionary;
}

export default function HomeView({ setActiveView, lang, t }: HomeViewProps) {
  const handleAction = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 md:space-y-32" id="home-view-container">
      {/* 1. HERO SECTION (Symmetric, centered, premium minimalist) */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24" id="hero-section">

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          
          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-graphite leading-[1.15] tracking-tight max-w-3xl mx-auto">
            {t.home.heroTitle}
          </h1>
          
          <p className="font-sans text-brand-mid-gray text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4">
            <button
               onClick={() => handleAction('contact')}
              className="cta-btn-interactive w-full sm:w-auto bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent font-sans font-bold text-sm uppercase tracking-wider py-4 px-10 rounded-full transition-all duration-300 shadow-xs cursor-pointer hover:shadow-md"
              id="hero-cta-primary"
            >
              {t.home.ctaPrimary}
            </button>
            
            <button
              onClick={() => handleAction('services')}
              className="w-full sm:w-auto group flex items-center justify-center space-x-2 border border-brand-light-gray hover:border-brand-graphite bg-white hover:bg-gray-50 text-brand-graphite font-sans font-semibold text-sm uppercase tracking-wider py-4 px-10 rounded-full transition-all duration-200 cursor-pointer shadow-2xs"
              id="hero-cta-secondary"
            >
              <span>{t.home.ctaSecondary}</span>
              <ArrowUpRight className="w-4 h-4 text-brand-mid-gray group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. SECTION 1: Einleitung / Positionierung */}
      <section className="max-w-7xl mx-auto px-6" id="positioning-section">
        <TurevaLines count={3} className="mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-6">
          <div className="lg:col-span-5">
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-brand-graphite tracking-tight max-w-sm">
              {t.home.section1Title}
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <p className="font-sans text-brand-graphite text-base sm:text-lg leading-relaxed font-light">
              {t.home.section1Text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm text-brand-graphite">
              <div className="flex items-center space-x-3 p-3.5 border border-brand-light-gray rounded-xl bg-gray-50">
                <ShieldCheck className="w-5 h-5 text-brand-mid-gray shrink-0" />
                <span className="font-medium">{lang === 'de' ? 'Zugelassene Revisionsexperten' : 'RAB Accredited Audit Partners'}</span>
              </div>
              <div className="flex items-center space-x-3 p-3.5 border border-brand-light-gray rounded-xl bg-gray-50">
                <Users className="w-5 h-5 text-brand-mid-gray shrink-0" />
                <span className="font-medium">{lang === 'de' ? 'Mehrsprachige Partnerbetreuung' : 'Direct Access to Partners'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: Die drei Kompetenzfelder (01 - 03) */}
      <section className="max-w-7xl mx-auto px-6" id="competences-section">
        <TurevaLines count={2} className="mb-12" />
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-display font-medium text-3xl text-brand-graphite tracking-tight">
                {t.home.section2Title}
              </h2>
            </div>
            
            <button
              onClick={() => handleAction('contact')}
              className="text-xs font-mono font-bold tracking-wider text-brand-graphite hover:text-brand-graphite/80 transition-colors underline decoration-brand-graphite decoration-2 underline-offset-4 cursor-pointer"
            >
              {lang === 'de' ? 'BERATUNG ANFRAGEN' : 'REQUEST CONSULTATION'} &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Revision */}
            <div
              onClick={() => handleAction('services')}
              className="group bg-white border border-brand-light-gray hover:border-brand-graphite p-8 flex flex-col justify-between h-80 transition-all duration-300 cursor-pointer rounded-2xl"
              id="competence-card-1"
            >
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-brand-mid-gray block tracking-wider">
                  {t.home.badge1}
                </span>
                <h3 className="font-display font-medium text-xl text-brand-graphite group-hover:text-brand-graphite transition-colors">
                  {t.home.competence1Title}
                </h3>
                <p className="text-sm text-brand-mid-gray leading-relaxed font-light">
                  {t.home.competence1Text}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-brand-graphite mt-6 group-hover:underline flex items-center space-x-1">
                <span>{lang === 'de' ? 'Mehr erfahren' : 'Read more'}</span>
                <span>&rarr;</span>
              </span>
            </div>

            {/* Card 2 - Accounting */}
            <div
              onClick={() => handleAction('services')}
              className="group bg-white border border-brand-light-gray hover:border-brand-graphite p-8 flex flex-col justify-between h-80 transition-all duration-300 cursor-pointer rounded-2xl"
              id="competence-card-2"
            >
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-brand-mid-gray block tracking-wider">
                  {t.home.badge2}
                </span>
                <h3 className="font-display font-medium text-xl text-brand-graphite group-hover:text-brand-graphite transition-colors">
                  {t.home.competence2Title}
                </h3>
                <p className="text-sm text-brand-mid-gray leading-relaxed font-light">
                  {t.home.competence2Text}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-brand-graphite mt-6 group-hover:underline flex items-center space-x-1">
                <span>{lang === 'de' ? 'Mehr erfahren' : 'Read more'}</span>
                <span>&rarr;</span>
              </span>
            </div>

            {/* Card 3 - Steuern */}
            <div
              onClick={() => handleAction('services')}
              className="group bg-white border border-brand-light-gray hover:border-brand-graphite p-8 flex flex-col justify-between h-80 transition-all duration-300 cursor-pointer rounded-2xl"
              id="competence-card-3"
            >
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-brand-mid-gray block tracking-wider">
                  {t.home.badge3}
                </span>
                <h3 className="font-display font-medium text-xl text-brand-graphite group-hover:text-brand-graphite transition-colors">
                  {t.home.competence3Title}
                </h3>
                <p className="text-sm text-brand-mid-gray leading-relaxed font-light">
                  {t.home.competence3Text}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-brand-graphite mt-6 group-hover:underline flex items-center space-x-1">
                <span>{lang === 'de' ? 'Mehr erfahren' : 'Read more'}</span>
                <span>&rarr;</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: International & Mehrsprachig - REDESIGNED TO CLEAN WHITE */}
      <section className="bg-white text-brand-graphite border border-brand-light-gray/70 py-20 px-8 md:px-12 overflow-hidden rounded-2xl relative shadow-[0_8px_30px_rgba(0,0,0,0.015)]" id="internationality-section">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-brand-graphite tracking-tight">
                {t.home.section3Title}
              </h2>
              <p className="text-sm sm:text-base text-brand-mid-gray leading-relaxed font-light">
                {t.home.section3Text}
              </p>
              <div className="pt-4 flex flex-wrap gap-3">
                <span className="bg-gray-50 text-brand-graphite font-mono text-xs px-3.5 py-2 border border-brand-light-gray rounded-lg">
                  CH-FIDUCIARY (OR)
                </span>
                <span className="bg-gray-50 text-brand-graphite font-mono text-xs px-3.5 py-2 border border-brand-light-gray rounded-lg">
                  IRS RECOGNIZED (US TAX)
                </span>
                <span className="bg-gray-50 text-brand-graphite font-mono text-xs px-3.5 py-2 border border-brand-light-gray rounded-lg font-medium">
                  40+ YEARS AUDITED SUBSTANCE
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 border border-brand-light-gray/70 bg-gray-50/70 space-y-2 rounded-xl">
                  <span className="text-xs font-mono text-brand-mid-gray font-bold block">FOUNDING YEAR</span>
                  <span className="text-4xl font-display font-medium text-brand-graphite block">1982</span>
                  <span className="text-xs text-brand-mid-gray block">{lang === 'de' ? 'In Zürich etabliert' : 'Established in Zurich'}</span>
                </div>
                <div className="p-6 border border-brand-light-gray/70 bg-gray-50/70 space-y-2 rounded-xl">
                  <span className="text-xs font-mono text-brand-mid-gray font-bold block">LANGUAGES</span>
                  <span className="text-4xl font-display font-medium text-brand-graphite block">4+</span>
                  <span className="text-xs text-brand-mid-gray block">{lang === 'de' ? 'Verhandlungssicher' : 'Fluent expert level'}</span>
                </div>
                <div className="p-6 border border-brand-light-gray/70 bg-gray-50/70 space-y-2 rounded-xl">
                  <span className="text-xs font-mono text-brand-mid-gray font-bold block">EXPERIENCE</span>
                  <span className="text-4xl font-display font-medium text-brand-graphite block">44 Yrs</span>
                  <span className="text-xs text-brand-mid-gray block">{lang === 'de' ? 'Institutionelle Substanz' : 'Continuous legacy'}</span>
                </div>
                <div className="p-6 border border-brand-light-gray/70 bg-gray-50/70 space-y-2 rounded-xl">
                  <span className="text-xs font-mono text-brand-mid-gray font-bold block">CLIENTS</span>
                  <span className="text-4xl font-display font-medium text-brand-graphite block">CH & US</span>
                  <span className="text-xs text-brand-mid-gray block">{lang === 'de' ? 'Regulatorische Brücke' : 'Trans-atlantic bridge'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SECTION 4: Weitere Dienstleistungen (Teaser) */}
      <section className="max-w-7xl mx-auto px-6" id="special-teaser-section">
        <div className="border border-brand-light-gray p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-gray-50/70 rounded-2xl relative overflow-hidden">

          <div className="space-y-3 relative z-10 max-w-xl">
            <h3 className="font-display font-medium text-2xl text-brand-graphite tracking-tight">
              {t.home.section4Title}
            </h3>
            <p className="text-sm text-brand-mid-gray leading-relaxed font-light">
              {t.home.section4Text}
            </p>
          </div>          <button
            onClick={() => handleAction('services')}
            className="cta-btn-interactive bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent font-sans font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full cursor-pointer transition-all duration-300 self-stretch lg:self-auto text-center shadow-xs hover:shadow-md"
            id="teaser-view-special-cta"
          >
            {t.home.section4Cta}
          </button>
        </div>
      </section>
 
      {/* 6. SECTION 5: Kontakt-CTA */}
      <section className="max-w-7xl mx-auto px-6 text-center py-12" id="bottom-contact-cta">
        <TurevaLines count={3} className="mb-16" />
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-brand-graphite tracking-tight">
            {t.home.section5Title}
          </h2>
          <p className="text-sm sm:text-base text-brand-mid-gray leading-relaxed font-light">
            {t.home.section5Subtitle}
          </p>
          <div className="pt-6">
            <button
              onClick={() => handleAction('contact')}
              className="cta-btn-interactive bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent font-sans font-bold text-sm uppercase tracking-wider py-4 px-10 rounded-full transition-all duration-300 transform inline-block cursor-pointer shadow-xs hover:shadow-md hover:scale-102"
              id="bottom-cta-btn"
            >
              {t.home.section5Cta}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
