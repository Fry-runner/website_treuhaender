import React from 'react';
import { ActiveView, Language, TranslationDictionary } from '../types';
import TurevaLines from './TurevaLines';
import { Landmark, Briefcase, Globe2 } from 'lucide-react';

interface AboutViewProps {
  setActiveView: (view: ActiveView) => void;
  lang: Language;
  t: TranslationDictionary;
}

export default function AboutView({ setActiveView, lang, t }: AboutViewProps) {
  const handleAction = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-20 md:space-y-28" id="about-view-container">
      {/* Hero Header */}
      <section className="relative py-12 md:py-20 overflow-hidden" id="about-hero">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-4 max-w-4xl">
            <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-brand-graphite leading-tight tracking-tight">
              {t.about.heroTitle}
            </h1>
            <div className="h-0.5 w-24 bg-brand-mid-gray/40 rounded-full mt-6" />
          </div>
        </div>
      </section>

      {/* History & Identity Grid */}
      <section className="max-w-7xl mx-auto px-6" id="history-grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center space-x-2 text-brand-mid-gray">
              <span className="text-xs font-mono tracking-wider font-bold">01 / ESTABLISHED LEGACY</span>
            </div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-brand-graphite tracking-tight">
              {t.about.introTitle}
            </h2>
            <p className="text-sm sm:text-base text-brand-mid-gray leading-relaxed font-light">
              {t.about.introText}
            </p>
            <div className="bg-gray-50 border border-brand-light-gray p-6 space-y-4 rounded-2xl">
              <span className="text-xs font-mono font-bold text-brand-graphite uppercase tracking-widest block">
                {lang === 'de' ? 'STRUKTURELLE KONTINUITÄT' : 'STRUCTURAL CONTINUITY'}
              </span>
              <p className="text-xs text-brand-mid-gray leading-relaxed font-light">
                {lang === 'de'
                  ? 'Als Aktiengesellschaft (AG) mit namhaftem Aktienkapital und unabhängiger Revisionsstelle bieten wir unseren Mandanten die Sicherheit und Kontinuität, die ein Einzelunternehmen strukturell nicht gewährleisten kann.'
                  : 'As a joint-stock company (Aktiengesellschaft) with solid paid-in share capital and independent external audits, we guarantee financial safety and long-term continuity that sole proprietorships cannot deliver.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center space-x-2 text-brand-mid-gray">
              <span className="text-xs font-mono tracking-wider font-bold">02 / INSTITUTIONAL CHARACTER</span>
            </div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-brand-graphite tracking-tight">
              {t.about.whoWeAreTitle}
            </h2>
            <p className="text-sm sm:text-base text-brand-mid-gray leading-relaxed font-light">
              {t.about.whoWeAreText}
            </p>
            <div className="grid grid-cols-3 gap-4 text-center pt-2">
              <div className="border border-brand-light-gray p-4 rounded-xl">
                <span className="font-display font-bold text-2xl text-brand-graphite block">CH</span>
                <span className="text-[10px] text-brand-mid-gray font-mono block uppercase">Compliance</span>
              </div>
              <div className="border border-brand-light-gray p-4 rounded-xl">
                <span className="font-display font-bold text-2xl text-brand-graphite block">IRS</span>
                <span className="text-[10px] text-brand-mid-gray font-mono block uppercase">US Registry</span>
              </div>
              <div className="border border-brand-light-gray p-4 rounded-xl">
                <span className="font-display font-bold text-2xl text-brand-graphite block">RAB</span>
                <span className="text-[10px] text-brand-mid-gray font-mono block uppercase">Audit Office</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Target Audiences section */}
      <section className="bg-gray-50 border-y border-brand-light-gray py-20 px-6" id="target-audiences">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center md:text-left">
            <h2 className="font-display font-medium text-3xl text-brand-graphite tracking-tight mt-1">
              {t.about.targetTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Swiss SMEs card */}
            <div className="bg-white border border-brand-light-gray p-6 rounded-2xl space-y-4 shadow-2xs">
              <div className="w-10 h-10 bg-gray-50 border border-brand-light-gray text-brand-graphite rounded-full flex items-center justify-center">
                <Landmark className="w-5 h-5 text-brand-mid-gray" />
              </div>
              <h3 className="font-display font-medium text-lg text-brand-graphite">
                {t.about.targetSwiss}
              </h3>
              <p className="text-xs text-brand-mid-gray leading-relaxed font-light">
                {lang === 'de'
                  ? 'Führung von Geschäftsbüchern, Mehrwertsteuerabrechnungen und Lohnbuchhaltung für Schweizer KMU ab Gründung bis Nachfolge.'
                  : 'Filing, bookkeeping, vat accounting, and payroll administration for registered Swiss SMEs, from incorporation to succession.'}
              </p>
            </div>

            {/* International holdings card */}
            <div className="bg-white border border-brand-light-gray p-6 rounded-2xl space-y-4 shadow-2xs">
              <div className="w-10 h-10 bg-gray-50 border border-brand-light-gray text-brand-graphite rounded-full flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-brand-mid-gray" />
              </div>
              <h3 className="font-display font-medium text-lg text-brand-graphite">
                {t.about.targetInt}
              </h3>
              <p className="text-xs text-brand-mid-gray leading-relaxed font-light">
                {lang === 'de'
                  ? 'Konsolidierung, Fiskalvertretung im Inland sowie Prüfung internationaler Transaktionen für Niederlassungen.'
                  : 'Consolidation audits, local VAT fiscal agency representation, and outbound structural planning for overseas hold-co units.'}
              </p>
            </div>

            {/* US Citizens card */}
            <div className="bg-white border border-brand-light-gray p-6 rounded-2xl space-y-4 shadow-2xs">
              <div className="w-10 h-10 bg-gray-50 border border-brand-light-gray text-brand-graphite rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-brand-mid-gray" />
              </div>
              <h3 className="font-display font-medium text-lg text-brand-graphite">
                {t.about.targetUs}
              </h3>
              <p className="text-xs text-brand-mid-gray leading-relaxed font-light">
                {lang === 'de'
                  ? 'Strukturierte Steuerdeklarationen für in der Schweiz lebende US-Expats (Streamlined Filing, FBAR-Konformität).'
                  : 'Specialized US expat tax preparation, Streamlined Foreign Offline disclosures, and complex dual-taxation planning.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Board of Directors (Zurückhaltend-sachlich) */}
      <section className="max-w-7xl mx-auto px-6" id="leadership-section">
        <TurevaLines count={3} className="mb-12" />
        <div className="space-y-12">
          <div className="text-center md:text-left">
            <span className="text-xs font-mono tracking-widest text-[#76828C] block uppercase font-bold">
              BOARD & LEADERSHIP
            </span>
            <h2 className="font-display font-medium text-3xl text-brand-graphite tracking-tight mt-1">
              {t.about.teamTitle}
            </h2>
            <p className="text-sm text-brand-mid-gray leading-relaxed font-light mt-2">
              {t.about.teamSubtitle}
            </p>
          </div>

          {/* Clean, freigestellte team cards - typography and flat aesthetic first */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Member 1: Beat Kaufmann */}
            <div className="border border-brand-light-gray bg-white rounded-2xl p-6 space-y-6 shadow-2xs" id="board-member-1">
              <div className="w-full h-48 bg-gray-50 flex flex-col items-center justify-center text-brand-graphite border border-brand-light-gray/50 relative rounded-xl select-none">
                <span className="font-display font-medium text-3xl tracking-widest">BK</span>
                <span className="text-[10px] font-mono text-brand-mid-gray tracking-widest uppercase mt-2">
                  ZÜRICH OFFICE
                </span>
                <span className="absolute bottom-2 right-2 flex items-center text-[10px] text-brand-graphite font-mono uppercase bg-gray-100 border border-brand-light-gray px-2.5 py-1 rounded-full font-bold">
                  PARTNER
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-medium text-xl text-brand-graphite">
                  Beat Kaufmann
                </h3>
                <p className="text-xs font-mono text-brand-mid-gray font-bold">
                  {t.about.member1Role}
                </p>
                <p className="text-xs text-brand-mid-gray leading-relaxed font-light font-sans">
                  {t.about.member1Bio}
                </p>
              </div>
            </div>

            {/* Member 2: Dr. Arthur Vance */}
            <div className="border border-brand-light-gray bg-white rounded-2xl p-6 space-y-6 shadow-2xs" id="board-member-2">
              <div className="w-full h-48 bg-gray-50 flex flex-col items-center justify-center text-brand-graphite border border-brand-light-gray/50 relative rounded-xl select-none">
                <span className="font-display font-medium text-3xl tracking-widest">AV</span>
                <span className="text-[10px] font-mono text-brand-mid-gray tracking-widest uppercase mt-2">
                  US COMPLIANCE
                </span>
                <span className="absolute bottom-2 right-2 flex items-center text-[10px] text-brand-graphite font-mono uppercase bg-gray-100 border border-brand-light-gray px-2.5 py-1 rounded-full font-bold">
                  IRS EA
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-medium text-xl text-brand-graphite">
                  Dr. Arthur Vance
                </h3>
                <p className="text-xs font-mono text-brand-mid-gray font-bold">
                  {t.about.member2Role}
                </p>
                <p className="text-xs text-brand-mid-gray leading-relaxed font-light font-sans">
                  {t.about.member2Bio}
                </p>
              </div>
            </div>

            {/* Member 3: Prof. Dr. ralph Schuler */}
            <div className="border border-brand-light-gray bg-white rounded-2xl p-6 space-y-6 shadow-2xs" id="board-member-3">
              <div className="w-full h-48 bg-gray-50 flex flex-col items-center justify-center text-brand-graphite border border-brand-light-gray/50 relative rounded-xl select-none">
                <span className="font-display font-medium text-3xl tracking-widest">RS</span>
                <span className="text-[10px] font-mono text-brand-mid-gray tracking-widest uppercase mt-2">
                  BOARD ADVISORY
                </span>
                <span className="absolute bottom-2 right-2 flex items-center text-[10px] text-brand-graphite font-mono uppercase bg-gray-100 border border-brand-light-gray px-2.5 py-1 rounded-full font-bold">
                  VR ADVISER
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-medium text-xl text-brand-graphite">
                  Prof. Dr. Ralph Schuler
                </h3>
                <p className="text-xs font-mono text-brand-mid-gray font-bold">
                  {t.about.member3Role}
                </p>
                <p className="text-xs text-brand-mid-gray leading-relaxed font-light font-sans">
                  {t.about.member3Bio}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom redirection */}
      <section className="max-w-7xl mx-auto px-6 text-center pt-8 pb-4" id="about-redirection">
        <div className="border-t border-brand-light-gray/60 pt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => handleAction('services')}
            className="border border-brand-light-gray hover:border-brand-graphite hover:bg-brand-graphite hover:text-white text-brand-mid-gray font-sans font-medium text-xs uppercase tracking-wider py-3.5 px-8 rounded-full transition-all duration-300 cursor-pointer shadow-2xs"
          >
            {lang === 'de' ? 'Unsere Leistungen' : 'Explore Services'}
          </button>
          <button
            onClick={() => handleAction('contact')}
            className="cta-btn-interactive bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent font-sans font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md"
          >
            {lang === 'de' ? 'Direktkontakt' : 'Contact Direct'}
          </button>
        </div>
      </section>
    </div>
  );
}
