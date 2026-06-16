import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES_DATA } from '../data';
import { OfferCategory } from '../types';
import LineMotif from './LineMotif';
import { ArrowUpRight, Scale, Briefcase, Workflow, CheckCircle } from 'lucide-react';

interface OfferingsProps {
  initialCategory?: OfferCategory;
  onOpenConsultation: (category?: OfferCategory) => void;
}

export default function Offerings({ initialCategory = 'treuhand', onOpenConsultation }: OfferingsProps) {
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory>(initialCategory);

  const activeOffering = SERVICES_DATA.find((o) => o.category === selectedCategory)!;

  const getIcon = (cat: OfferCategory) => {
    switch (cat) {
      case 'treuhand':
        return <Scale className="w-5 h-5 text-brand-violet" />;
      case 'beratung':
        return <Briefcase className="w-5 h-5 text-brand-violet" />;
      case 'organisation':
        return <Workflow className="w-5 h-5 text-brand-violet" />;
    }
  };

  const ctaLabels: Record<OfferCategory, string> = {
    treuhand: 'Anliegen besprechen',
    beratung: 'Beratungsgespräch anfragen',
    organisation: 'Prozesse besprechen',
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="mb-14">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-violet font-black mb-2">
            UNSER HANDWERK
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-brand-graphite tracking-tight">
            Das Angebot
          </h2>
          <p className="font-sans text-brand-gray-medium text-lg mt-3 max-w-2xl leading-relaxed">
            Drei Säulen, ein klares Ziel: Absolute Klarheit über Ihre Zahlen, Ihre Entscheidungen und Ihre internen betrieblichen Abläufe.
          </p>
        </div>

        {/* 3 Pillars Selector with Asymmetric Offsets & Linear Signature (Design Guideline 1.4/1.6) */}
        <div className="flex flex-col lg:flex-row gap-4 border-b border-brand-gray-light pb-10 mb-16">
          {(['treuhand', 'beratung', 'organisation'] as OfferCategory[]).map((cat, idx) => {
            const data = SERVICES_DATA.find((s) => s.category === cat)!;
            const isSelected = selectedCategory === cat;
            
            // Asymmetric visual offsets purely in padding/height spacing
            const offsetStyle = idx === 0 
              ? 'pt-4 pb-6' 
              : idx === 1 
              ? 'pt-8 pb-4' 
              : 'pt-6 pb-6';

            return (
              <button
                key={cat}
                id={`pillar-tab-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 text-left p-6 md:p-8 border rounded-[3px] transition-all duration-300 relative cursor-pointer group ${offsetStyle} ${
                  isSelected
                    ? 'border-brand-violet bg-transparent'
                    : 'border-brand-gray-light bg-transparent hover:border-brand-violet/50'
                }`}
              >
                {/* Visual Line Motiv overlaying active pillar card */}
                {isSelected && (
                  <div className="absolute top-2 right-4">
                    <LineMotif type="signature" className="w-10 opacity-60 text-brand-violet" />
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-sm bg-brand-violet/5">
                    {getIcon(cat)}
                  </div>
                  <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-gray-medium font-bold">
                    Säule 0{idx + 1}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl md:text-2xl text-brand-graphite capitalize mb-2">
                  {data.title}
                </h3>
                <p className="font-sans text-xs text-brand-gray-medium leading-relaxed group-hover:text-brand-graphite transition-colors">
                  {data.lead}
                </p>

                <div className="mt-6 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-violet">
                  Details anzeigen
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Säule Details Layout with Fade / Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* Summary Left Column */}
            <div className="lg:col-span-4 flex flex-col justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-violet/5 text-brand-violet font-mono text-xs font-semibold uppercase tracking-wider mb-4">
                  Fokusbereich {activeOffering.title}
                </div>
                <h3 className="font-display font-bold text-3xl text-brand-graphite tracking-tight leading-tight mb-4">
                  {activeOffering.title}
                </h3>
                <p className="font-sans text-brand-gray-medium leading-relaxed text-sm md:text-base">
                  {activeOffering.lead}
                </p>
                
                <button
                  id="offering-cta-button"
                  onClick={() => onOpenConsultation(selectedCategory)}
                  className="mt-8 group w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-coral border-[1.5px] border-brand-coral text-white hover:opacity-90 px-6 py-4 rounded-[2px] font-bold text-xs uppercase tracking-widest cursor-pointer transition-all duration-200"
                >
                  {ctaLabels[selectedCategory]}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>

            {/* Individual Sub-Group Cards Block (Design Guideline 1.4: translate raw lists to structured cards) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
              {activeOffering.details.map((group, groupIdx) => (
                <div
                  key={group.groupTitle}
                  className="border border-brand-gray-light hover:border-brand-violet p-6 md:p-8 rounded-[3px] bg-white transition-all duration-300 flex flex-col justify-between group relative"
                >
                  <div>
                    <div className="w-8 h-px bg-brand-violet/40 group-hover:w-16 transition-all duration-300 mb-4" />
                    <h4 className="font-display font-semibold text-[17px] text-brand-graphite tracking-tight mb-4 group-hover:text-brand-violet transition-colors">
                      {group.groupTitle}
                    </h4>
                    
                    <ul className="space-y-3.5">
                      {group.items.map((item, id) => (
                        <li key={id} className="flex gap-2.5 items-start">
                          <CheckCircle className="w-4 h-4 text-brand-violet/30 group-hover:text-brand-violet mt-0.5 flex-shrink-0" />
                          <span className="font-sans text-xs leading-normal text-brand-gray-medium group-hover:text-brand-graphite transition-colors">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Corner ambient numbering graphic */}
                  <div className="absolute bottom-4 right-6 font-display font-bold text-4xl text-brand-gray-light/35 select-none pointer-events-none group-hover:text-brand-violet/5 transition-colors">
                    {groupIdx + 1}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
