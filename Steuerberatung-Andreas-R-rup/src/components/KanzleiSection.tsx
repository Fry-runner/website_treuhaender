import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, HelpCircle, CheckCircle2, Award, Scale, Users, Footprints, Landmark } from 'lucide-react';
import { Page } from '../types';
import { CLIENT_GROUPS } from '../data';

interface KanzleiSectionProps {
  setCurrentPage: (page: Page) => void;
}

export default function KanzleiSection({ setCurrentPage }: KanzleiSectionProps) {
  return (
    <div className="space-y-20 md:space-y-24 py-12">
      
      {/* 1. Header Hero Area */}
      <section className="max-w-4xl space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-grey font-medium">
          Das Kanzleikonzept
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-brand-anthracite leading-tight">
          Eine Kanzlei. Zwei Länder. <br />
          <span className="font-light text-brand-grey">Ein Ansprechpartner.</span>
        </h2>
        <p className="font-sans text-brand-grey text-base md:text-lg font-light leading-relaxed max-w-3xl">
          Gegründet im Jahr 2013 in Zürich und ergänzt durch eine Beratungsstelle in Düsseldorf, konzentriert sich die Kanzlei von Beginn an auf die Beratung im deutschen und schweizerischen Steuerrecht. Ich biete Ihnen Spezialberatung für nationale, binationale und internationale Fragestellungen an.
        </p>
      </section>

      {/* 2. Highlight: Steuerberatung aus einer Hand */}
      <section className="bg-white border text-brand-anthracite border-brand-beige border-l-4 border-l-brand-red/40 p-8 rounded-r-sm space-y-4">
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-brand-grey" />
          <h3 className="font-display text-lg font-semibold text-brand-anthracite">
            Zentraler Mehrwert: Grenzkontinuierliche Doppelberatung
          </h3>
        </div>
        <p className="font-sans text-brand-grey text-base font-light leading-relaxed max-w-4xl">
          Wer in Deutschland und der Schweiz steuerpflichtig ist, steht meist vor dem Problem, zwei unterschiedliche Steuerkanzleien in zwei Ländern koordinieren zu müssen. Das führt zu Informationsverlusten, doppelten Honoraren und hohem zeitlichen Aufwand. 
          <strong className="text-brand-anthracite font-normal block mt-2">
            Meine Kanzlei löst diesen Konflikt: Ich vertrete und berate Sie in beiden Steuerrechtsordnungen aus einer Hand.
          </strong>
        </p>
      </section>

      {/* 3. European & International context info snippet */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <div className="inline-flex p-2 rounded-sm bg-brand-red/[0.03] text-brand-red">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-medium text-brand-anthracite">
            Internationales &amp; europäisches Steuerrecht
          </h3>
          <p className="font-sans text-brand-grey text-sm font-light leading-relaxed">
            Grenzüberschreitende Sachverhalte betreffen heute längst nicht mehr nur multinationale Konzerne. Auch kleine Unternehmen und Privatpersonen geraten zunehmend in den Fokus internationaler Regelungen. Durch die Auswertung bilateraler Doppelbesteuerungsabkommen, EU-Richtlinien und OECD-Vorgaben sorge ich für Rechtssicherheit und beuge steuerlichen Doppelbelastungen vor.
          </p>
        </div>

        {/* Styled Graphics box of EU regulatory circles */}
        <div className="bg-white border border-brand-beige p-6 rounded-sm flex items-center justify-center min-h-[160px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-brand-beige m-3" />
          <div className="space-y-4 text-center">
            <div className="flex justify-center -space-x-3">
              <div className="w-12 h-12 rounded-full border border-brand-anthracite bg-white/30 backdrop-blur-xs flex items-center justify-center font-mono text-xs font-semibold">DE</div>
              <div className="w-12 h-12 rounded-full border border-brand-grey bg-brand-beige/10 backdrop-blur-xs flex items-center justify-center font-mono text-xs font-semibold text-brand-grey text-center">CH</div>
              <div className="w-12 h-12 rounded-full border border-dashed border-brand-grey bg-white/30 backdrop-blur-xs flex items-center justify-center font-mono text-xss text-brand-grey">EU</div>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-brand-grey">
              Harmonisierte D-CH &amp; OECD Richtlinienkompetenz
            </p>
          </div>
        </div>
      </section>

      {/* 4. Mandantengruppen kompact index list */}
      <section className="space-y-8">
        <div className="border-b border-brand-beige pb-4">
          <h3 className="font-display text-2xl font-medium text-brand-anthracite">
            Für wen ich arbeite
          </h3>
          <p className="font-sans text-brand-grey text-sm font-light mt-1">
            Meine hochspezialisierte Struktur ist optimal auf folgende Mandantengruppen zugeschnitten:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLIENT_GROUPS.map((group, index) => (
            <div 
              key={index}
              className="p-6 bg-white border border-brand-beige rounded-sm hover:border-brand-red/35 transition-all duration-300 space-y-2 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-brand-grey group-hover:text-brand-red transition-colors font-semibold">
                  MANDANTEN // {0 + (index + 1)}
                </span>
                <h4 className="font-display font-medium text-base text-brand-anthracite">
                  {group.title}
                </h4>
                <p className="font-sans text-xs text-brand-grey font-light leading-relaxed">
                  {group.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote about border countries */}
        <div className="p-4 bg-white rounded-sm border border-brand-beige flex gap-3 items-start">
          <Footprints className="w-4 h-4 text-brand-grey shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-brand-grey font-light leading-relaxed">
            <strong className="text-brand-anthracite font-normal">Erweiterte Ausrichtung:</strong> Auch bei steuerlichen Berührungspunkten mit Frankreich, Italien, Österreich, Grossbritannien, den Niederlanden, Belgien oder Luxemburg berate ich Sie gerne auf steuerrechtlicher Organisationsebene.
          </p>
        </div>
      </section>

      {/* 5. Target Navigation Links Footer of section */}
      <section className="pt-8 border-t border-brand-beige flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-sm border">
        <div className="space-y-1">
          <h4 className="font-display font-medium text-sm text-brand-anthracite">
            Möchten Sie mehr über meine fachlichen Stationen erfahren?
          </h4>
          <p className="font-sans text-xs text-brand-grey font-light">
            Sehen Sie sich meinen Werdegang und meine anerkannte Fachberaterqualifikation an.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCurrentPage('ruerup')}
            className="px-4 py-2 border border-brand-anthracite hover:bg-brand-anthracite hover:text-brand-offwhite transition-all text-xs font-sans font-medium rounded-sm cursor-pointer"
          >
            Über Andreas Rürup
          </button>
          
          <button
            onClick={() => setCurrentPage('kontakt')}
            className="px-5 py-2.5 bg-brand-anthracite text-white hover:bg-black transition-all text-xs font-sans font-semibold uppercase tracking-widest rounded-sm cursor-pointer flex items-center gap-1.5"
          >
            Sprechen wir über Ihren Fall
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

    </div>
  );
}
