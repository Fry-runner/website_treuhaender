import React, { useState } from 'react';
import { ActiveView, Language, TranslationDictionary } from '../types';
import TurevaLines from './TurevaLines';
import { Check, ClipboardCheck, Calculator, Landmark } from 'lucide-react';

interface ServicesViewProps {
  setActiveView: (view: ActiveView) => void;
  setSelectedService: (service: string) => void;
  lang: Language;
  t: TranslationDictionary;
}

export default function ServicesView({ setActiveView, setSelectedService, lang, t }: ServicesViewProps) {
  const [activeExpanded, setActiveExpanded] = useState<'revision' | 'accounting' | 'taxes' | null>(null);

  const handleInquire = (serviceKey: string, serviceLabel: string) => {
    setSelectedService(serviceLabel);
    setActiveView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleExpand = (section: 'revision' | 'accounting' | 'taxes') => {
    if (activeExpanded === section) {
      setActiveExpanded(null);
    } else {
      setActiveExpanded(section);
    }
  };

  return (
    <div id="services-view-container" className="bg-transparent">
      {/* 1. Services Hero */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden" id="services-hero">
        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-6 md:space-y-8">
          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-brand-graphite tracking-tight leading-tight max-w-4xl">
            {t.services.heroTitle}
          </h1>
          <p className="font-sans text-brand-mid-gray text-base sm:text-lg max-w-2xl leading-relaxed font-light">
            {t.services.heroSubtitle}
          </p>
        </div>
      </section>

      {/* 2. Three Main Pillars (Comprehensive Interactive Block) */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-10 md:space-y-12" id="primary-services-pillars">
        <TurevaLines count={3} className="mb-8 md:mb-12" />
        
        {/* Render interactive sections */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Pillar 01: Revision */}
          <div 
            className={`border rounded-2xl transition-all duration-300 ${
              activeExpanded === 'revision' 
                ? 'border-brand-graphite bg-gray-50/50 ring-2 ring-brand-graphite/10 shadow-xs' 
                : 'border-brand-light-gray hover:border-brand-graphite bg-white shadow-2xs'
            }`} 
            id="service-panel-revision"
          >
            <div 
              onClick={() => toggleExpand('revision')}
              className="p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer select-none"
            >
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold text-brand-mid-gray uppercase tracking-widest">
                  01 / PARTNER AUDITING
                </span>
                <h2 className="font-display font-medium text-2xl sm:text-3xl text-brand-graphite">
                  {t.services.revision.title}
                </h2>
                <p className="text-sm sm:text-base text-brand-mid-gray leading-relaxed font-light max-w-2xl">
                  {t.services.revision.lead}
                </p>
              </div>
              <div className="flex items-center space-x-4 self-end md:self-auto shrink-0 pt-2 md:pt-0">
                <button
                  className="text-xs font-mono font-medium text-brand-mid-gray hover:text-brand-graphite transition-colors"
                  onClick={(e) => { e.stopPropagation(); toggleExpand('revision'); }}
                >
                  {activeExpanded === 'revision' ? '[-] Minimize' : '[+] Expand Details'}
                </button>
                <div className="w-10 h-10 bg-gray-50 border border-brand-light-gray text-brand-graphite hover:bg-gray-100 flex items-center justify-center rounded-full transition-colors">
                  <ClipboardCheck className="w-5 h-5 text-brand-mid-gray" />
                </div>
              </div>
            </div>

            {/* Expanded items */}
            {activeExpanded === 'revision' && (
              <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 lg:pt-6 border-t border-brand-light-gray/60 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/70 rounded-b-2xl animate-fade-in">
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {t.services.revision.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3.5 border border-brand-light-gray rounded-xl bg-white">
                        <Check className="w-4 h-4 text-brand-mid-gray shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-brand-graphite leading-relaxed font-light">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4 bg-gray-50 p-6 border border-brand-light-gray flex flex-col justify-between rounded-xl space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-brand-mid-gray block tracking-wide uppercase font-bold">RAB ACCREDITATION</span>
                    <h4 className="text-sm font-semibold text-brand-graphite">{lang === 'de' ? 'Gesetzlich Zugelassene Revisionsexperten' : 'Federal RAB Board Registry Member'}</h4>
                    <p className="text-xs text-brand-mid-gray leading-relaxed font-light">
                      {lang === 'de'
                        ? 'Tureva ist befugt zur Durchführung ordentlicher und eingeschränkter Revisionen im Sinne des Bundesgesetzes über die Zulassung und Beaufsichtigung von Revisorinnen und Revisoren.'
                        : 'Accredited oversight ensures absolute alignment with local cantonal audit boards, statutory corporate registries and legal OR regulations.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInquire('revision', t.services.revision.title)}
                    className="cta-btn-interactive bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent text-xs font-sans font-bold uppercase tracking-wider py-3.5 w-full rounded-full transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-md"
                  >
                    {t.services.revision.ctaText} &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pillar 02: Accounting & Controlling */}
          <div 
            className={`border rounded-2xl transition-all duration-300 ${
              activeExpanded === 'accounting' 
                ? 'border-brand-graphite bg-gray-50/50 ring-2 ring-brand-graphite/10 shadow-xs' 
                : 'border-brand-light-gray hover:border-brand-graphite bg-white shadow-2xs'
            }`} 
            id="service-panel-accounting"
          >
            <div 
              onClick={() => toggleExpand('accounting')}
              className="p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer select-none"
            >
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold text-brand-mid-gray uppercase tracking-widest">
                  02 / FIDUCIARY BOOKKEEPING
                </span>
                <h2 className="font-display font-medium text-2xl sm:text-3xl text-brand-graphite">
                  {t.services.accounting.title}
                </h2>
                <p className="text-sm sm:text-base text-brand-mid-gray leading-relaxed font-light max-w-2xl">
                  {t.services.accounting.lead}
                </p>
              </div>
              <div className="flex items-center space-x-4 self-end md:self-auto shrink-0 pt-2 md:pt-0">
                <button
                  className="text-xs font-mono font-medium text-brand-mid-gray hover:text-brand-graphite transition-colors"
                  onClick={(e) => { e.stopPropagation(); toggleExpand('accounting'); }}
                >
                  {activeExpanded === 'accounting' ? '[-] Minimize' : '[+] Expand Details'}
                </button>
                <div className="w-10 h-10 bg-gray-50 border border-brand-light-gray text-brand-graphite hover:bg-gray-100 flex items-center justify-center rounded-full transition-colors">
                  <Calculator className="w-5 h-5 text-brand-mid-gray" />
                </div>
              </div>
            </div>

            {/* Expanded items */}
            {activeExpanded === 'accounting' && (
              <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 lg:pt-6 border-t border-brand-light-gray/60 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/70 rounded-b-2xl animate-fade-in">
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {t.services.accounting.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3.5 border border-brand-light-gray rounded-xl bg-white">
                        <Check className="w-4 h-4 text-brand-mid-gray shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-brand-graphite leading-relaxed font-light">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4 bg-gray-50 p-6 border border-brand-light-gray flex flex-col justify-between rounded-xl space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-brand-mid-gray block tracking-wide uppercase font-bold">DIGITAL INVOICING</span>
                    <h4 className="text-sm font-semibold text-brand-graphite">{lang === 'de' ? 'Vollautomatisches Online-Belegwesen' : 'Modern Paperless Accounting'}</h4>
                    <p className="text-xs text-brand-mid-gray leading-relaxed font-light">
                      {lang === 'de'
                        ? 'Wir arbeiten mit modernen Schnittstellen (wie Bexio, Klara, Abacus), um den Belegaustausch komplett papierlos abzuwickeln.'
                        : 'We bridge systems securely via APIs, supporting local ERP platforms to deliver clean monthly dashboards effortlessly.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInquire('accounting', t.services.accounting.title)}
                    className="cta-btn-interactive bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent text-xs font-sans font-bold uppercase tracking-wider py-3.5 w-full rounded-full transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-md"
                  >
                    {t.services.accounting.ctaText} &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pillar 03: Taxes (with US Tax declarations) */}
          <div 
            className={`border rounded-2xl transition-all duration-300 ${
              activeExpanded === 'taxes' 
                ? 'border-brand-graphite bg-gray-50/50 ring-2 ring-brand-graphite/10 shadow-xs' 
                : 'border-brand-light-gray hover:border-brand-graphite bg-white shadow-2xs'
            }`} 
            id="service-panel-taxes"
          >
            <div 
              onClick={() => toggleExpand('taxes')}
              className="p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer select-none"
            >
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold text-brand-mid-gray uppercase tracking-widest">
                  03 / TRANS-ATLANTIC STEUERBERATUNG
                </span>
                <h2 className="font-display font-medium text-2xl sm:text-3xl text-brand-graphite">
                  {t.services.taxes.title}
                </h2>
                <p className="text-sm sm:text-base text-brand-mid-gray leading-relaxed font-light max-w-2xl">
                  {t.services.taxes.lead}
                </p>
              </div>
              <div className="flex items-center space-x-4 self-end md:self-auto shrink-0 pt-2 md:pt-0">
                <button
                  className="text-xs font-mono font-medium text-brand-mid-gray hover:text-brand-graphite transition-colors"
                  onClick={(e) => { e.stopPropagation(); toggleExpand('taxes'); }}
                >
                  {activeExpanded === 'taxes' ? '[-] Minimize' : '[+] Expand Details'}
                </button>
                <div className="w-10 h-10 bg-gray-50 border border-brand-light-gray text-brand-graphite hover:bg-gray-100 flex items-center justify-center rounded-full transition-colors">
                  <Landmark className="w-5 h-5 text-brand-mid-gray" />
                </div>
              </div>
            </div>

            {/* Expanded items */}
            {activeExpanded === 'taxes' && (
              <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 lg:pt-6 border-t border-brand-light-gray/60 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/70 rounded-b-2xl animate-fade-in">
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {t.services.taxes.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3.5 border border-brand-light-gray rounded-xl bg-white">
                        <Check className="w-4 h-4 text-brand-mid-gray shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-brand-graphite leading-relaxed font-light">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4 bg-gray-50 p-6 border border-brand-light-gray flex flex-col justify-between rounded-xl space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-brand-mid-gray block tracking-wide uppercase font-bold">CROSS-BORDER IRS</span>
                    <h4 className="text-sm font-semibold text-brand-graphite">{lang === 'de' ? 'US-Steuerausgleich & Spezialwissen' : 'USA IRS Declarations Desk'}</h4>
                    <p className="text-xs text-brand-mid-gray leading-relaxed font-light">
                      {lang === 'de'
                        ? 'US-Bürger im Ausland unterliegen einer beispiellosen globalen Steuerpflicht. Wir führen Streamlined-Filing-Verfahren durch, um Straffreiheit bei vergessenen Formularen zu erreichen.'
                        : 'We assist with global FATCA compliance reporting, Swiss/US tax treaty exemptions, Streamlined procedures, and FBAR declaration filings.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInquire('taxes', t.services.taxes.title)}
                    className="cta-btn-interactive bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent text-xs font-sans font-bold uppercase tracking-wider py-3.5 w-full rounded-full transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-md"
                  >
                    {t.services.taxes.ctaText} &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. Weitere Dienstleistungen (Spezialgebiet, compact groups) */}
      <section className="bg-gray-50 border-y border-brand-light-gray py-20 md:py-28 px-6" id="secondary-services">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-brand-graphite tracking-tight">
                {t.services.other.title}
              </h2>
              <p className="text-sm sm:text-base text-brand-mid-gray font-light max-w-2xl leading-relaxed">
                {t.services.other.lead}
              </p>
            </div>
            
            <button
              onClick={() => handleInquire('other', t.services.other.title)}
              className="cta-btn-interactive bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent py-4 px-8 rounded-full transition-all duration-300 cursor-pointer font-sans font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md self-start md:self-auto"
            >
              {t.services.other.ctaText}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Item 1 */}
            <div className="bg-white border border-brand-light-gray p-6 md:p-8 rounded-2xl space-y-4 hover:border-brand-graphite/40 shadow-2xs hover:shadow-xs transition-all duration-300">
              <span className="text-xs font-mono text-[#76828C] font-semibold bg-gray-50 border border-brand-light-gray/60 px-2 py-0.5 rounded-md inline-block">04.1</span>
              <h4 className="font-display font-medium text-lg text-brand-graphite">
                {t.services.other.item1Title}
              </h4>
              <p className="text-xs sm:text-sm text-brand-mid-gray leading-relaxed font-light">
                {t.services.other.item1Text}
              </p>
            </div>

            {/* Item 2 */}
            <div className="bg-white border border-brand-light-gray p-6 md:p-8 rounded-2xl space-y-4 hover:border-brand-graphite/40 shadow-2xs hover:shadow-xs transition-all duration-300">
              <span className="text-xs font-mono text-[#76828C] font-semibold bg-gray-50 border border-brand-light-gray/60 px-2 py-0.5 rounded-md inline-block">04.2</span>
              <h4 className="font-display font-medium text-lg text-brand-graphite">
                {t.services.other.item2Title}
              </h4>
              <p className="text-xs sm:text-sm text-brand-mid-gray leading-relaxed font-light">
                {t.services.other.item2Text}
              </p>
            </div>

            {/* Item 3 */}
            <div className="bg-white border border-brand-light-gray p-6 md:p-8 rounded-2xl space-y-4 hover:border-brand-graphite/40 shadow-2xs hover:shadow-xs transition-all duration-300">
              <span className="text-xs font-mono text-[#76828C] font-semibold bg-gray-50 border border-brand-light-gray/60 px-2 py-0.5 rounded-md inline-block">04.3</span>
              <h4 className="font-display font-medium text-lg text-brand-graphite">
                {t.services.other.item3Title}
              </h4>
              <p className="text-xs sm:text-sm text-brand-mid-gray leading-relaxed font-light">
                {t.services.other.item3Text}
              </p>
            </div>

            {/* Item 4 */}
            <div className="bg-white border border-brand-light-gray p-6 md:p-8 rounded-2xl space-y-4 hover:border-brand-graphite/40 shadow-2xs hover:shadow-xs transition-all duration-300">
              <span className="text-xs font-mono text-[#76828C] font-semibold bg-gray-50 border border-brand-light-gray/60 px-2 py-0.5 rounded-md inline-block">04.4</span>
              <h4 className="font-display font-medium text-lg text-brand-graphite">
                {t.services.other.item4Title}
              </h4>
              <p className="text-xs sm:text-sm text-brand-mid-gray leading-relaxed font-light">
                {t.services.other.item4Text}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Bottom redirection banner */}
      <section className="max-w-7xl mx-auto px-6 text-center py-20 md:py-28" id="services-redirection">
        <TurevaLines count={2} className="mb-12 md:mb-16" />
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="font-display font-medium text-2xl sm:text-3xl text-brand-graphite">
            {lang === 'de' ? 'Haben Sie ein konkretes Anliegen?' : 'Do you have a specific requirement?'}
          </h3>
          <p className="text-sm sm:text-base text-brand-mid-gray leading-relaxed font-light max-w-lg mx-auto">
            {lang === 'de'
              ? 'Treten Sie direkt mit uns in Kontakt. Wir erstellen Ihnen ein massgeschneidertes, unverbindliches Mandatsangebot.'
              : 'Connect with our partners today. We will prepare a bespoke, non-binding statutory mandate overview for your business.'}
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => handleInquire('direct', 'All-Inclusive Consulting')}
              className="cta-btn-interactive bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent font-sans font-bold text-xs uppercase tracking-wider py-4 px-10 rounded-full transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md"
            >
              {lang === 'de' ? 'Unterredung vereinbaren' : 'Request Consultation'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
