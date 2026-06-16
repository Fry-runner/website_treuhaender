import React from 'react';
import { Globe, Server, Scale, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { Page } from '../types';
import { INTERNATIONAL_TAX_GROUPS } from '../data';

interface InternationalSectionProps {
  setCurrentPage: (page: Page) => void;
}

export default function InternationalSection({ setCurrentPage }: InternationalSectionProps) {
  
  // Icon selector
  const getIcon = (index: number) => {
    switch (index) {
      case 0: return <Globe className="w-5 h-5 text-brand-red/80" />;
      case 1: return <Server className="w-5 h-5 text-brand-red/80" />;
      case 2: return <Scale className="w-5 h-5 text-brand-red/80" />;
      default: return <Shield className="w-5 h-5 text-brand-red/80" />;
    }
  };

  return (
    <div className="space-y-16 md:space-y-20 py-12">
      
      {/* 1. Header Hero Area */}
      <section className="max-w-4xl space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-grey font-medium">
          Fokus Global
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-brand-anthracite leading-tight">
          Internationales Steuerrecht
        </h2>
        <p className="font-sans text-brand-grey text-base md:text-lg font-light leading-relaxed max-w-3xl">
          Für Mandanten mit steuerlich relevanten Sachverhalten außerhalb Deutschlands und der Schweiz &ndash; sowie für Personen und Gesellschaften, die in Deutschland oder der Schweiz wirtschaftlich aktiv werden möchten.
        </p>
      </section>

      {/* 2. Structured Bento-style card Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        {INTERNATIONAL_TAX_GROUPS.map((group, index) => (
          <div 
            key={index}
            className="p-8 bg-white border border-brand-beige rounded-sm hover:border-brand-red/35 transition-all duration-300 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-sm bg-brand-red/[0.03]">
                  {getIcon(index)}
                </span>
                <span className="font-mono text-xs text-brand-grey font-medium">FOKUS // 0{index + 1}</span>
              </div>
              
              <h3 className="font-display font-medium text-lg text-brand-anthracite">
                {group.title}
              </h3>
              
              <p className="font-sans text-xs text-brand-grey font-light leading-relaxed">
                {group.desc}
              </p>
            </div>
            
            {/* Minimal separator line */}
            <div className="border-t border-brand-beige/50 pt-2 flex justify-between items-center text-[10px] font-mono text-brand-grey">
              <span>Fortbildungsüberwacht</span>
              <span className="text-brand-grey">&amp; Rechtssicher</span>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Detailed border country alert box (Wichtiger Hinweis Block) */}
      <section className="bg-white border border-brand-beige rounded-sm p-6 md:p-8 max-w-5xl">
        <div className="flex gap-4 items-start">
          <AlertCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-display font-medium text-sm text-brand-anthracite uppercase tracking-wide">
              Möglichkeiten bei weiteren europäischen Nachfolgestaaten
            </h4>
            <p className="font-sans text-xs text-brand-grey font-light leading-relaxed">
              Auch bei steuerlichen Berührungspunkten mit anderen angrenzenden europäischen Staaten wie <strong className="text-brand-anthracite font-normal">Frankreich, Italien, Österreich, Grossbritannien, den Niederlanden, Belgien und Luxemburg</strong> stehen grundlegende fachliche Hilfestellungen bereit. Die Kanzlei verfügt über ein enges, qualifiziertes Korrespondentennetzwerk vor Ort, um Spezialfragen bei Bedarf lokal abzusichern.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Action Redirect card */}
      <section className="bg-white border border-brand-beige border-t-2 border-t-brand-red/50 p-8 rounded-b-sm max-w-5xl flex flex-col sm:flex-row gap-6 justify-between items-center hover:border-brand-red/25 transition-all duration-300">
        <div className="space-y-1">
          <h4 className="font-display font-semibold text-sm text-brand-anthracite">
            Planen Sie eine Unternehmensentsendung oder Auslandsinvestition?
          </h4>
          <p className="font-sans text-xs text-brand-grey font-light">
            Vermeiden Sie kostspielige Doppelbesteuerungsfehler durch rechtzeitige steuerliche Modellierung.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('kontakt')}
          className="px-5 py-3 bg-brand-anthracite text-white hover:bg-black text-xs font-sans font-semibold uppercase tracking-widest rounded-sm cursor-pointer shrink-0 inline-flex items-center gap-2 group transition-all"
        >
          <span>Sachverhalt schildern</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

    </div>
  );
}
