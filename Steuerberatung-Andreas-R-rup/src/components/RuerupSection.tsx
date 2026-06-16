import React from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Quote, ShieldAlert, GraduationCap, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';
import { Page } from '../types';
import { QUALIFICATIONS } from '../data';

interface RuerupSectionProps {
  setCurrentPage: (page: Page) => void;
}

export default function RuerupSection({ setCurrentPage }: RuerupSectionProps) {
  const fallbackPortrait = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=800";

  return (
    <div className="space-y-20 md:space-y-24 py-12">
      
      {/* 1. Introductory Title Block */}
      <section className="max-w-4xl space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-grey font-medium">
          Kanzleiinhaber
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-brand-anthracite leading-tight">
          Andreas Rürup
        </h2>
        <p className="font-mono text-xs uppercase tracking-widest text-brand-grey font-normal">
          Inhaber der Kanzlei – Ihr persönlicher Ansprechpartner
        </p>
      </section>

      {/* 2. Interactive Column Biography Details */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left portrait with decorative outline */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[340px] aspect-[3/4] group">
            {/* Outline accent lines */}
            <div className="absolute inset-4 -m-4 border border-brand-beige rounded-sm pointer-events-none transform translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300" />
            
            <div className="w-full h-full rounded-sm overflow-hidden border border-brand-beige bg-white relative">
              <img
                src={fallbackPortrait}
                alt="Andreas Rürup Portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-95"
              />
              <div className="absolute inset-0 bg-brand-anthracite/5 mix-blend-multiply" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-brand-anthracite/95 backdrop-blur-xs p-3.5 rounded-sm border border-white/10">
                <p className="text-white text-xs font-display font-medium">Andreas Rürup</p>
                <span className="text-brand-grey text-[10px] font-mono block">Düsseldorf / Zürich</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right bio description - "Ich" Form */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-display text-2xl font-medium text-brand-anthracite">
            Fundierte Dual-Kompetenz seit über zwei Jahrzehnten.
          </h3>

          <div className="font-sans text-brand-grey text-base space-y-4 font-light leading-relaxed">
            <p>
              Mein wissenschaftlicher Werdegang verbindet vertiefte wirtschafts- und rechtswissenschaftliche Studien, die ich an der Ruhr-Universität Bochum und im Rahmen betriebswirtschaftlicher Qualifikationen an der University of California, Los Angeles (UCLA) abgeschlossen habe.
            </p>
            <p>
              Bevor ich mich im Jahr 2013 mit Kanzleisitzen in Zürich und einer Beratungsstelle in Düsseldorf selbständig machte, war ich über viele Jahre hinweg in namhaften, international tätigen Steuerberatungs-, Wirtschaftsprüfungs- und Anwaltskanzleien in Düsseldorf und Zürich aktiv. 
            </p>
            <p>
              Dort habe ich gelernt, worauf es Mandanten wirklich ankommt: Transparenz, absolute Zuverlässigkeit und eine Beratung auf Augenhöhe. Als Alleininhaber stehe ich für genau diese Werte ein und garantiere Ihnen eine fehlerfreie, vorausschauende Betreuung.
            </p>
          </div>
        </div>

      </section>

      {/* 3. Qualifications list as modern trust badges */}
      <section className="space-y-8">
        <div className="border-b border-brand-beige pb-4 flex items-center gap-3">
          <GraduationCap className="w-5 h-5 text-brand-grey" />
          <h3 className="font-display text-2xl font-medium text-brand-anthracite">
            Zertifizierungen &amp; Qualifikations-Gütesiegel
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUALIFICATIONS.map((qual, index) => (
            <div 
              key={index}
              className="p-6 bg-white border border-brand-beige rounded-sm hover:border-brand-red/35 transition-all duration-300 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="w-6 h-6 rounded-sm bg-brand-red/[0.04] text-brand-red flex items-center justify-center font-mono text-[10px] font-semibold">
                  {index + 1}
                </span>
                
                <h4 className="font-display font-semibold text-base text-brand-anthracite leading-snug">
                  {qual.title}
                </h4>
                
                <p className="font-sans text-xs text-brand-grey font-light">
                  Ausgestellt durch: {qual.issuer}
                </p>
              </div>

              {/* Muted neutral dot design item */}
              <div className="w-1 h-1 bg-brand-red/40 rounded-full self-end mt-4" />
            </div>
          ))}
        </div>

        <div className="p-4 bg-white rounded-sm border border-brand-beige flex gap-3 text-brand-grey text-xs">
          <BookOpen className="w-4 h-4 text-brand-grey shrink-0 mt-0.5" />
          <p className="font-sans leading-relaxed font-light">
            <strong className="text-brand-anthracite font-normal">Fortbildungspflicht:</strong> Als eingetragener Fachberater für Internationales Steuerrecht (§ 43f BRAO u. § 4 Fachberaterordnung) bin ich zur jährlichen Absolvierung und Einreichung von mindestens 15 Stunden spezialisierter Fachfortbildungen verpflichtet. Das gibt Ihnen die Sicherheit, dass Ihre Beratung auf dem allerneuesten Rechtsstand stattfindet.
          </p>
        </div>
      </section>

      {/* 4. Elegant Personal Quote Block */}
      <section className="bg-white text-brand-anthracite rounded-sm p-8 md:p-12 relative overflow-hidden border border-brand-beige border-l-4 border-l-brand-red/30">
        <div className="absolute top-0 right-0 p-8 text-brand-grey/10 pointer-events-none">
          <Quote className="w-32 h-32 transform translate-x-12 -translate-y-8" />
        </div>
        
        <div className="relative z-10 space-y-6 max-w-4xl">
          <span className="text-brand-grey font-mono text-[9px] uppercase tracking-widest font-medium block">Philosophie &amp; Arbeitsweise</span>
          
          <p className="font-display text-xl md:text-2xl font-light italic leading-relaxed text-brand-anthracite">
            &quot;Sorgfältige Beratung lässt sich nicht automatisieren. Ein qualifizierter Steuerberater ist kein bloßer Formularausfüller. Er ist ein Zuhörer, ein Übersetzer von Gesetzestexten und ein vertrauensvoller Architekt Ihrer Vermögensstruktur. Zeit und Gewissenhaftigkeit sind das einzige Fundament, auf dem echte, schadenfreie Steuerersparnis entsteht.&quot;
          </p>
          
          <div className="pt-2">
            <span className="font-mono text-xs uppercase text-brand-grey block tracking-wide">&#8212; Andreas Rürup</span>
            <span className="font-sans text-xs text-brand-grey block mt-0.5">Inhaber der Kanzlei</span>
          </div>
        </div>
      </section>

      {/* 5. Quick CTA footer of section */}
      <section className="text-center pt-8 border-t border-brand-beige">
        <div className="max-w-xl mx-auto space-y-4">
          <h4 className="font-display text-xl font-medium text-brand-anthracite">
            Möchten Sie Ihr Anliegen direkt persönlich mit mir besprechen?
          </h4>
          <p className="font-sans text-brand-grey text-sm font-light">
            Buchen Sie ein Erstgespräch – ich freue mich auf den direkten Austausch mit Ihnen.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentPage('kontakt')}
              className="px-6 py-4 bg-brand-anthracite text-white hover:bg-black text-xs uppercase tracking-widest font-semibold font-sans rounded-sm transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Termin mit mir vereinbaren</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
