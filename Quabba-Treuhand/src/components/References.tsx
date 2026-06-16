import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CLIENT_REFERENCES } from '../data';
import LineMotif from './LineMotif';
import { Award, Layers, Sparkles, Filter } from 'lucide-react';

interface ReferencesProps {
  onOpenConsultation: () => void;
}

export default function References({ onOpenConsultation }: ReferencesProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // De-duplicate sectors for interactive sorting
  const sectors = [
    { value: 'all', label: 'Alle Branchen' },
    { value: 'design', label: 'Design & Kreation' },
    { value: 'trade', label: 'Handel & Import' },
    { value: 'consulting', label: 'Beratung & Dienstwerke' }
  ];

  const filteredReferences = CLIENT_REFERENCES.filter((ref) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'design') {
      return ref.industry.toLowerCase().includes('design') || ref.industry.toLowerCase().includes('fashion') || ref.industry.toLowerCase().includes('möbel');
    }
    if (selectedFilter === 'trade') {
      return ref.industry.toLowerCase().includes('handel') || ref.industry.toLowerCase().includes('import');
    }
    if (selectedFilter === 'consulting') {
      return ref.industry.toLowerCase().includes('beratung') || ref.industry.toLowerCase().includes('dienst') || ref.industry.toLowerCase().includes('personal') || ref.industry.toLowerCase().includes('luftfahrt');
    }
    return true;
  });

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          <div className="lg:col-span-8">
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-violet font-black mb-3">
              LANGJÄHRIGE MANDATE
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-brand-graphite tracking-tight leading-tight">
              Unterschiedliche Branchen, <br />
              gemeinsames Vertrauen.
            </h2>
            <p className="font-sans text-brand-gray-medium text-lg mt-4 max-w-xl leading-relaxed">
              Seit über drei Jahrzehnten dürfen wir unterschiedlichste Betriebe in Zürich und der ganzen Schweiz verlässlich begleiten – von Boutiquen und Design-Ateliers bis hin zu internationalen Konzernen.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="border border-brand-gray-light p-6 rounded-[3px] bg-brand-violet/[0.01] max-w-sm">
              <div className="flex gap-2.5 items-center text-brand-violet mb-2">
                <Sparkles className="w-4 h-4 text-brand-violet animate-pulse" />
                <span className="font-heading font-black text-[11px] uppercase tracking-widest text-brand-violet">
                  Kontinuität
                </span>
              </div>
              <p className="font-sans text-xs text-brand-gray-medium leading-normal">
                Viele unserer Klienten vertrauen uns nun bereits seit über 15 bis 20 Jahren dauerhaft. Diese Nachhaltigkeit ist unser wertvollster Ausweis.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Filter Row (Premium UX) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-brand-gray-light pb-6 mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-gray-medium mr-4">
            <Filter className="w-3.5 h-3.5" />
            FILTERN:
          </div>
          {sectors.map((sec) => (
            <button
              key={sec.value}
              id={`ref-filter-${sec.value}`}
              onClick={() => setSelectedFilter(sec.value)}
              className={`font-sans text-xs font-semibold px-4 py-2 border rounded-full transition-all duration-200 cursor-pointer ${
                selectedFilter === sec.value
                  ? 'border-brand-violet bg-brand-violet text-white'
                  : 'border-brand-gray-light bg-transparent text-brand-graphite hover:border-brand-violet/50'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Pure Typographic References List - Ordered & Clean (Design Guideline 2.5) */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredReferences.map((ref, idx) => (
                <div
                  key={ref.name}
                  className="border border-brand-gray-light p-6 rounded-[3px] bg-white hover:border-brand-violet hover:shadow-[0_10px_24px_rgb(0,0,0,0.015)] transition-all duration-350 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-brand-gray-medium group-hover:text-brand-violet transition-colors">
                      <span className="font-mono text-[10px] tracking-widest">
                        MANDANT 0{idx + 1}
                      </span>
                      <Award className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-display font-medium text-lg text-brand-graphite mb-1 group-hover:text-brand-violet transition-colors">
                      {ref.name}
                    </h3>
                  </div>
                  
                  <div className="border-t border-brand-gray-light mt-4 pt-3 flex items-center justify-between">
                    <span className="font-sans text-xs text-brand-gray-medium">
                      {ref.industry}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-wide text-brand-violet opacity-0 group-hover:opacity-80 transition-opacity">
                      Aktiv
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredReferences.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-sm text-brand-gray-medium">Keine Referenzen für diese Auswahl gefunden.</p>
            </div>
          )}
        </div>

        {/* Footer-Teaser CTA */}
        <div className="border border-brand-violet/10 p-8 md:p-12 rounded-[4px] mt-16 md:mt-24 bg-brand-violet/[0.01] text-center max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute top-[-10px] right-2 transform rotate-45 select-none pointer-events-none text-brand-violet/5 font-display font-bold text-8xl">
            1993
          </div>
          
          <h3 className="font-display font-bold text-xl md:text-2xl text-brand-graphite mb-3">
            Auch Ihr Unternehmen von präziser Führung profitieren lassen?
          </h3>
          <p className="font-sans text-brand-gray-medium text-sm leading-relaxed max-w-lg mx-auto mb-8">
            Gerne analysieren wir Ihre aktuelle Buchhaltungs- oder Organisationsstruktur und zeigen Ihnen Einsparpotenziale auf.
          </p>
          
          <button
            id="references-cta"
            onClick={onOpenConsultation}
            className="group flex items-center justify-center gap-2.5 bg-brand-coral border-[1.5px] border-brand-coral text-white hover:opacity-90 px-6 py-3.5 text-xs font-bold uppercase tracking-wider mx-auto transition-all duration-200 rounded-[2px] cursor-pointer"
          >
            Vorgespräch vereinbaren
          </button>
        </div>



      </div>
    </section>
  );
}
