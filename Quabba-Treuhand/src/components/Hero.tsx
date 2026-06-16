import { motion } from 'motion/react';
import LineMotif from './LineMotif';
import { ArrowRight, Calendar, BookmarkCheck } from 'lucide-react';
import { ActiveView } from '../types';

interface HeroProps {
  onNavigate: (view: ActiveView) => void;
  onOpenConsultation: () => void;
}

export default function Hero({ onNavigate, onOpenConsultation }: HeroProps) {
  return (
    <section className="relative bg-white pt-16 md:pt-28 pb-12 overflow-hidden">
      {/* Background Subtle Line Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-brand-graphite" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-brand-graphite" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-brand-graphite" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-brand-graphite" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-brand-graphite" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Typographic Hero Text columns */}
          <div className="lg:col-span-8 flex flex-col items-start">
            {/* Giant display title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-bold text-5xl sm:text-7xl md:text-[84px] tracking-tight text-brand-graphite leading-[0.9] mt-2 mb-8"
            >
              Ordnung schafft <br className="hidden sm:inline" />
              <span className="text-brand-violet relative">
                Freiraum.
                <motion.span 
                  className="absolute bottom-1 sm:bottom-2 left-0 w-full h-[6px] bg-brand-violet/10 -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.h2>

            {/* Clean, high-legibility descriptive caption */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-xl text-brand-gray-medium leading-relaxed max-w-xl mb-10"
            >
              Treuhand, Beratung und Organisation aus einer Hand – persönlich betreut, seit über 30 Jahren in Zürich.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full sm:w-auto"
            >
              {/* Primary Koralle CTA Button */}
              <button
                id="hero-cta-primary"
                onClick={onOpenConsultation}
                className="group flex items-center justify-center gap-2.5 bg-brand-coral border-[1.5px] border-brand-coral text-white hover:opacity-90 px-8 py-4 text-sm font-bold tracking-wider uppercase transition-all duration-200 rounded-[2px] cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Termin vereinbaren
              </button>

              {/* Secondary link with custom under-draw line */}
              <button
                id="hero-cta-secondary"
                onClick={() => onNavigate('angebot')}
                className="group flex items-center justify-center gap-1.5 py-4 text-sm font-bold tracking-wider uppercase text-brand-violet ml-0 sm:ml-4 cursor-pointer focus:outline-none"
              >
                <span className="relative">
                  Angebot ansehen
                  <span className="absolute bottom-0.5 left-0 w-full h-[2px] bg-brand-violet" />
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-brand-violet" />
              </button>
            </motion.div>
          </div>

          {/* Minimalist Visual Line Side Display */}
          <div className="lg:col-span-4 hidden lg:flex flex-col justify-center items-stretch relative h-full">
            {/* A beautiful, ultra-minimalist vertical ledger list representing structure/audit */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-full relative border-l border-brand-gray-light pl-8 py-4 animate-fade-in"
            >
              <div className="absolute top-1 right-0 text-[10px] font-mono tracking-widest text-brand-gray-medium uppercase">
                Est. 1993
              </div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#7C868C] font-semibold mb-6">
                STRUKTUR & PLANUNG
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-3 items-start">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-brand-violet" />
                  <div>
                    <h4 className="font-heading font-semibold text-[13px] text-brand-graphite leading-none">Treuhand</h4>
                    <p className="font-sans text-xs text-brand-gray-medium mt-1">Stabile Rechnungslegung</p>
                  </div>
                </div>
                <div className="w-full h-px bg-brand-gray-light/60" />
                <div className="flex gap-3 items-start">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-brand-coral" />
                  <div>
                    <h4 className="font-heading font-semibold text-[13px] text-brand-graphite leading-none">Beratung</h4>
                    <p className="font-sans text-xs text-brand-gray-medium mt-1">Vorausschauender Sparringspartner</p>
                  </div>
                </div>
                <div className="w-full h-px bg-brand-gray-light/60" />
                <div className="flex gap-3 items-start">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-[#4F565C]" />
                  <div>
                    <h4 className="font-heading font-semibold text-[13px] text-brand-graphite leading-none">Organisation</h4>
                    <p className="font-sans text-xs text-brand-gray-medium mt-1">Einfache, messbare Prozesse</p>
                  </div>
                </div>
              </div>

              {/* Minimal vertical tracking graphic in high-end Swiss design */}
              <div className="absolute -bottom-10 left-8 opacity-40">
                <LineMotif type="signature" className="w-16 text-brand-violet" />
              </div>
            </motion.div>
          </div>

        </div>

        {/* The beautiful hero transition animated loop line */}
        <div className="mt-8 md:mt-16 -mx-6 md:-mx-12">
          <LineMotif type="hero" />
        </div>
      </div>
    </section>
  );
}
