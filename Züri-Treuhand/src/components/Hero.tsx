/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Award, Landmark } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section
      id="hero-section"
      className="relative bg-white pt-6 pb-12 md:pt-10 md:pb-16 overflow-hidden"
    >
      {/* Precision grid pattern layout - Swiss Architectural aesthetic */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(#0A2342 1px, transparent 1px), radial-gradient(#0A2342 1px, #ffffff 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }} />
        <div className="absolute inset-y-0 left-1/4 w-[1px] bg-brand-blue" />
        <div className="absolute inset-y-0 left-2/4 w-[1px] bg-brand-blue" />
        <div className="absolute inset-y-0 left-3/4 w-[1px] bg-brand-blue" />
        <div className="absolute inset-x-0 top-1/3 h-[1px] bg-brand-blue" />
        <div className="absolute inset-x-0 top-2/3 h-[1px] bg-brand-blue" />
      </div>

      {/* Decorative gradient blur in top corner */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-soft-gray blur-3xl opacity-50 z-0 -mr-48 -mt-48" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full z-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Hero Copy Container */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            
            {/* Slogan - Exact wording requested & styled with editorial elegance */}
            <h1 id="hero-title" className="font-display text-4xl sm:text-6xl lg:text-[72px] font-bold tracking-tighter text-brand-blue leading-[0.95] mb-8">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block text-[#0A2342]"
              >
                Zahlen erzählen
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block"
              >
                Geschichten.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block font-light italic text-[#333333]/90 text-3xl sm:text-4xl lg:text-[48px] tracking-normal mt-4 leading-snug"
              >
                wir sorgen dafür, dass sie verstanden werden.
              </motion.span>
            </h1>

            {/* Introductory paragraph - Hero sub */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-sans text-base sm:text-lg text-neutral-600 max-w-lg leading-relaxed mb-10 font-light"
            >
              Den administrativen Aufwand nehmen wir Ihnen komplett ab, damit Sie sich voll und ganz auf Ihr Kerngeschäft fokussieren können. Vertrauen, Transparenz und Kompetenz aus der Schweiz.
            </motion.p>

            {/* CTA action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10"
            >
              <button
                id="hero-cta-primary"
                onClick={() => onNavigate('appointment')}
                className="px-8 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-sans text-sm font-semibold tracking-wider uppercase rounded-[2px] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <span>Kostenloses Erstgespräch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-cta-secondary"
                onClick={() => onNavigate('services')}
                className="px-8 py-4 border border-border-gray bg-white hover:bg-soft-gray text-brand-blue font-sans text-sm font-semibold tracking-wider uppercase rounded-[2px] transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                Dienstleistungen ansehen
              </button>
            </motion.div>

            {/* Editorial Stats - perfectly styled as in Design HTML */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex gap-16 border-t border-border-gray pt-8"
            >
              <div className="flex flex-col">
                <span className="text-[32px] font-bold text-brand-blue tracking-tight">350+</span>
                <span className="text-[12px] text-neutral-500 font-semibold uppercase tracking-widest mt-1">Zufriedene Kunden</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[32px] font-bold text-brand-blue tracking-tight">120+</span>
                <span className="text-[12px] text-neutral-500 font-semibold uppercase tracking-widest mt-1">Betreute Firmen</span>
              </div>
            </motion.div>

          </div>

          {/* Editorial Visual Card (Swiss Modernism Style) */}
          <div className="lg:col-span-4 self-start relative mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative p-8 border border-border-gray bg-white max-w-sm mx-auto rounded-[2px]"
            >
              <div className="absolute top-0 right-0 py-1.5 px-3 bg-brand-blue text-[9px] font-mono tracking-widest text-white uppercase font-bold">
                FOKUS
              </div>

              <h3 className="font-sans text-[18px] font-bold text-brand-blue mb-6 uppercase tracking-wider">
                Exzellenz & Werte
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-3.5 pb-5 border-b border-border-gray">
                  <div className="p-2 bg-soft-gray rounded">
                    <ShieldCheck className="w-5 h-5 text-brand-blue" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-brand-blue uppercase tracking-wide">
                      100% Konformität
                    </h4>
                    <p className="font-sans text-xs text-neutral-600 mt-1.5 leading-relaxed">
                      Absolut fehlerfreie Buchführung nach Schweizer Obligationenrecht (OR).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 pb-5 border-b border-border-gray">
                  <div className="p-2 bg-soft-gray rounded">
                    <Landmark className="w-5 h-5 text-brand-blue" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-brand-blue uppercase tracking-wide">
                      Zürcher Expertise
                    </h4>
                    <p className="font-sans text-xs text-neutral-600 mt-1.5 leading-relaxed">
                      Tief verwurzelt mit fundiertem Fachwissen im kantonalen Steuerrecht.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2 bg-soft-gray rounded">
                    <Award className="w-5 h-5 text-brand-blue" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-brand-blue uppercase tracking-wide">
                      Moderne Tools
                    </h4>
                    <p className="font-sans text-xs text-neutral-600 mt-1.5 leading-relaxed">
                      Digitalisierte, zeitsparende Workflows für KMU, Start-ups und Private.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
