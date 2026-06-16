import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowRightLeft, BookOpen, ShieldCheck, Home, Landmark, Plus, Minus, ArrowRight } from 'lucide-react';
import { Page } from '../types';
import { STEUERRECHT_GROUPS } from '../data';

interface SteuerrechtSectionProps {
  setCurrentPage: (page: Page) => void;
}

export default function SteuerrechtSection({ setCurrentPage }: SteuerrechtSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Match icon helper base on groups
  const getIcon = (index: number) => {
    switch (index) {
      case 0: return <FileText className="w-5 h-5" />;
      case 1: return <ArrowRightLeft className="w-5 h-5" />;
      case 2: return <BookOpen className="w-5 h-5" />;
      case 3: return <ShieldCheck className="w-5 h-5" />;
      case 4: return <Home className="w-5 h-5" />;
      default: return <Landmark className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 md:space-y-20 py-12">
      
      {/* 1. Introductory Title Block */}
      <section className="max-w-4xl space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-grey font-medium">
          Fokus D-CH
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-brand-anthracite leading-tight">
          Steuerrecht Deutschland &ndash; Schweiz
        </h2>
        <p className="font-sans text-brand-grey text-base md:text-lg font-light leading-relaxed max-w-3xl">
          Für Privatpersonen und Unternehmen mit steuerlichen Pflichten in beiden Ländern &ndash; aus einer Hand betreut. Ich koordiniere beide Systeme verzahnungsfrei für Sie.
        </p>
      </section>

      {/* 2. Styled Interactive Accordions for details */}
      <section className="max-w-4xl space-y-4">
        <div className="border-b border-brand-beige pb-2">
          <p className="font-mono text-[10px] text-brand-grey uppercase tracking-widest font-semibold">Tätigkeitsfelder im Detail</p>
        </div>

        <div className="space-y-3">
          {STEUERRECHT_GROUPS.map((group, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div 
                key={index}
                className={`border rounded-sm transition-all duration-300 ${
                  isExpanded 
                    ? 'border-brand-grey bg-white' 
                    : 'border-brand-beige bg-brand-offwhite hover:border-brand-grey/50'
                }`}
              >
                {/* Header click bar */}
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <span className={`p-2.5 rounded-sm transition-colors ${
                      isExpanded ? 'bg-brand-beige/50 text-brand-anthracite' : 'bg-brand-beige/50 text-brand-anthracite group-hover:text-brand-grey'
                    }`}>
                      {getIcon(index)}
                    </span>
                    <h3 className="font-display font-medium text-base md:text-lg text-brand-anthracite">
                      {group.title}
                    </h3>
                  </div>

                  <span className={`p-1 rounded-sm ${
                    isExpanded ? 'bg-brand-beige/40 text-brand-grey' : 'hover:bg-brand-beige text-brand-grey'
                  }`}>
                    {isExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </button>

                {/* Body Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 pl-16 border-t border-brand-beige/40">
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <p className="font-sans text-sm text-brand-grey font-light leading-relaxed">
                        {group.desc}
                      </p>
                      
                      {/* Standard structural prompt details specific items representation */}
                      <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-brand-grey">
                        <span className="border border-brand-beige rounded-sm px-2 py-0.5 bg-brand-offwhite">Rechtssicher</span>
                        <span className="border border-brand-beige rounded-sm px-2 py-0.5 bg-brand-offwhite">Schnittstellenfrei</span>
                        <span className="border border-brand-beige rounded-sm px-2 py-0.5 bg-brand-offwhite">Persönlich geplant</span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Highlight section regarding double tax protection */}
      <section className="bg-white border border-brand-beige border-l-4 border-l-brand-red/40 p-8 rounded-r-sm max-w-4xl space-y-3">
        <h3 className="font-display text-lg font-semibold text-brand-anthracite">
          Doppelbesteuerungsabkommen (DBA) optimal ausnutzen
        </h3>
        <p className="font-sans text-xs text-brand-grey font-light leading-relaxed">
          Das Abkommen zur Vermeidung der Doppelbesteuerung auf dem Gebiet der Steuern vom Einkommen und Vermögen zwischen Deutschland und der Schweiz ist durch zahlreiche Zusatzprotokolle, Verständigungsvereinbarungen und Rechtsprechungen ständigen Änderungen unterworfen. Als Fachberater analysiere ich Ihre Einkunftsquellen genau und beantrage alle zustehenden Anrechnungen, Freistellungen oder Erstattungen lückenlos.
        </p>
      </section>

      {/* 4. Contact redirection card */}
      <section className="bg-white border border-brand-beige p-8 rounded-sm max-w-4xl flex flex-col md:flex-row gap-6 justify-between items-center hover:border-brand-red/25 transition-all duration-300">
        <div className="space-y-1">
          <h4 className="font-display font-medium text-base text-brand-anthracite">
            Haben Sie Fragen zu Ihrer grenzüberschreitenden Veranlagung?
          </h4>
          <p className="font-sans text-xs text-brand-grey font-light">
            Schildern Sie mir Ihr Anliegen völlig unverbindlich, ich melde mich zeitnah bei Ihnen zurück.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('kontakt')}
          className="px-5 py-3 bg-brand-anthracite text-white hover:bg-black text-xs font-sans font-semibold uppercase tracking-widest rounded-sm cursor-pointer shrink-0 flex items-center gap-2 group transition-all"
        >
          <span>Anliegen schildern</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

    </div>
  );
}
