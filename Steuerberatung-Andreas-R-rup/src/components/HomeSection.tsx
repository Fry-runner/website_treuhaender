import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, CheckCircle2, User, Globe, ShieldCheck, HelpCircle, 
  ChevronRight, Calendar, Bookmark, Briefcase, Star, MessageSquare 
} from 'lucide-react';
import { Page } from '../types';
import { PROMISES } from '../data';
import MinimalistMap from './MinimalistMap';

interface HomeSectionProps {
  setCurrentPage: (page: Page) => void;
}

export default function HomeSection({ setCurrentPage }: HomeSectionProps) {
  const fallbackPortrait = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=800";

  return (
    <div className="space-y-24 md:space-y-32">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-8">
            
            {/* Top Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <div className="text-brand-grey text-[11px] font-medium uppercase tracking-widest px-3 py-1 border border-brand-beige rounded-sm inline-flex items-center gap-2 bg-brand-offwhite/50">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                <span>Fachberater für Internationales Steuerrecht · D-CH</span>
              </div>
            </motion.div>

            {/* Core Header with Display Font */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-light tracking-tight text-brand-anthracite leading-[1.1]"
            >
              Zwei Steuersysteme.<br />
              <span className="font-semibold text-brand-anthracite">Eine Lösung.</span>
            </motion.h1>

            {/* Core Subline with Inter */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl font-sans text-brand-grey max-w-2xl font-light leading-relaxed"
            >
              Persönliche Beratung für Privatpersonen und Unternehmen mit Bezug zu Deutschland und der Schweiz – kompetent, verlässlich und aus einer Hand.
            </motion.p>

            {/* Interactive CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center gap-8 pt-4"
            >
              <button
                onClick={() => setCurrentPage('kontakt')}
                className="px-8 py-4 bg-brand-anthracite text-white font-sans text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-black active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Beratungsgespräch vereinbaren</span>
                <Calendar className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentPage('steuerrecht')}
                className="text-xs uppercase tracking-widest font-semibold border-b-2 border-brand-anthracite pb-1 hover:opacity-75 transition-all duration-300 flex items-center gap-2 cursor-pointer group"
              >
                <span>Leistungen ansehen</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-anthracite group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Welcome Note with Portrait (The Personal Touch) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text block (Ich Form) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-brand-grey font-medium">
              Persönliche Begrüssung
            </h2>
            <h3 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-brand-anthracite">
              Ich berate Sie persönlich – ohne Umwege.
            </h3>
            
            <div className="font-sans text-brand-grey text-base space-y-4 font-light leading-relaxed">
              <p>
                Herzlich willkommen. Mein Name ist <strong className="text-brand-anthracite font-normal">Andreas Rürup</strong>. Als Inhaber der Kanzlei begleite ich Sie persönlich bei allen Fragen rund um das deutsche und schweizerische Steuerrecht.
              </p>
              <p>
                Mit rund 20 Jahren Berufserfahrung und der Spezialisierung als Fachberater für Internationales Steuerrecht weiß ich, dass herkömmliche Kanzleistrukturen oft unpersönlich wirken. Bei mir gibt es keine wechselnden Sachbearbeiter oder intransparente Informationsflüsse. Ich stehe Ihnen in Düsseldorf wie in Zürich direkt zur Seite.
              </p>
              <p>
                Ob Steuererklärungen für im Ausland ansässige Grenzgänger, Unternehmensgründungen oder die Klärung komplexer Abkommensregelungen – ich erarbeite maßgeschneiderte Lösungen für Sie.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <div className="border-l-2 border-brand-red pl-4">
                <p className="font-display font-medium text-brand-anthracite italic text-base">
                  &quot;Steuerrecht ist hochkomplex. Meine Aufgabe ist es, Ihnen Klarheit und Sicherheit zu geben – pragmatisch, verlässlich und nahbar.&quot;
                </p>
                <span className="block text-xs font-mono text-brand-grey mt-2">Andreas Rürup · Inhaber &amp; Steuerberater</span>
              </div>
            </div>
          </div>

          {/* Picture (High end mockup placeholder visual) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[3/4] group">
              {/* Decorative accent frames */}
              <div className="absolute inset-4 -m-4 border border-brand-beige rounded-sm pointer-events-none transform translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300" />
              
              <div className="w-full h-full rounded-sm overflow-hidden border border-brand-beige bg-white relative">
                <img
                  src={fallbackPortrait}
                  alt="Andreas Rürup Portrait Placeholder"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-95 text-xs flex items-center justify-center text-center bg-brand-beige"
                />
                
                {/* Subtle neutral hover cover */}
                <div className="absolute inset-0 bg-brand-anthracite/5 group-hover:bg-brand-anthracite/0 transition-colors duration-300 mix-blend-multiply" />
                
                {/* Credentials Badge bottom overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-brand-anthracite/90 backdrop-blur-xs p-3.5 rounded-sm border border-white/10">
                  <h4 className="text-white text-xs font-display font-semibold">Andreas Rürup</h4>
                  <p className="text-brand-grey text-[10px] font-mono mt-0.5 tracking-wide">Steuerberater &amp; Inhaber</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Promises Block */}
      <section className="bg-white py-20 border-y border-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-grey font-medium">
              Kanzlei-Versprechen
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-brand-anthracite">
              Was Sie von meiner Beratung erwarten können.
            </h3>
            <p className="font-sans text-brand-grey text-sm font-light">
              Hier wird nicht um den heißen Brei geredet – sondern mit verlässlichen Leitprinzipien beraten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROMISES.map((promise, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-sm border border-brand-beige hover:border-brand-red/35 transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-brand-grey border border-brand-beige px-2 py-0.5 rounded-sm font-medium bg-white">
                      {promise.badge}
                    </span>
                    <span className="text-brand-red/30 font-display text-2xl font-light">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <h4 className="font-display text-lg font-medium tracking-tight text-brand-anthracite">
                    {promise.title}
                  </h4>
                  
                  <p className="font-sans text-sm text-brand-grey font-light leading-relaxed">
                    {promise.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Large cards summarizing disciplines (2 massive blocks) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-grey font-medium">Tätigkeitsschwerpunkte</span>
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-brand-anthracite">
            Zwei Säulen hochgradiger Spezialisierung.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Säule 1 */}
          <div className="bg-white border border-brand-beige rounded-sm p-8 md:p-10 flex flex-col justify-between hover:border-brand-red/35 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/[0.02] justify-center items-center flex rounded-bl-sm pointer-events-none group-hover:bg-brand-red/[0.08] transition-colors">
              <span className="text-brand-red font-display text-xs font-semibold translate-x-3 -translate-y-3">D-CH</span>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-mono text-xs text-brand-grey font-medium uppercase tracking-widest">
                Rechtsgebiet Eine
              </h3>
              <h4 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-brand-anthracite leading-tight">
                Steuerrecht Deutschland &amp; Schweiz
              </h4>
              <p className="font-sans text-brand-grey text-base font-light leading-relaxed">
                Ich übernehme die vollständige Koordination Ihrer Steuerangelegenheiten in beiden Ländern. Optimaler Schutz vor doppelter Steuerbelastung für Grenzgänger, Wochenaufenthalter und Zuwanderer.
              </p>
              
              <ul className="space-y-2 text-sm text-brand-grey font-sans font-light">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-red/70 shrink-0" /> Doppelbesteuerungsabkommen D-CH</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-red/70 shrink-0" /> Wegzugsbesteuerung &amp; Zuzug im Zielland</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-red/70 shrink-0" /> Grenzgänger &amp; Quellensteueranträge</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-red/70 shrink-0" /> Jahresabschlüsse beidseits der Grenze</li>
              </ul>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setCurrentPage('steuerrecht')}
                className="w-full py-3.5 px-4 border border-brand-anthracite text-brand-anthracite hover:bg-brand-anthracite hover:text-white transition-all duration-300 rounded-sm font-sans text-xs uppercase tracking-widest font-semibold cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Spezialberatung einsehen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Säule 2 */}
          <div className="bg-white border border-brand-beige rounded-sm p-8 md:p-10 flex flex-col justify-between hover:border-brand-red/35 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/[0.02] justify-center items-center flex rounded-bl-sm pointer-events-none group-hover:bg-brand-red/[0.08] transition-colors">
              <span className="text-brand-red font-display text-xs font-semibold translate-x-3 -translate-y-3">INT</span>
            </div>

            <div className="space-y-6">
              <h3 className="font-mono text-xs text-brand-grey font-medium uppercase tracking-widest">
                Rechtsgebiet Zwei
              </h3>
              <h4 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-brand-anthracite leading-tight">
                Internationales Steuerrecht
              </h4>
              <p className="font-sans text-brand-grey text-base font-light leading-relaxed">
                Gezielte, rechtssichere Beratung für Personen und KMU, die weltweit expandieren oder Immobilien im Ausland erwerben. Fundiertes Know-how zu OECD Richtlinien und EU-Vorgaben.
              </p>

              <ul className="space-y-2 text-sm text-brand-grey font-sans font-light">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-red/70 shrink-0" /> Betriebsstätten &amp; Entsendungen</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-red/70 shrink-0" /> Ausländische Immobilieneinkünfte</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-red/70 shrink-0" /> Hinzurechnungsbesteuerung nach AStG</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-red/70 shrink-0" /> Europäisches Steuersystemrecht</li>
              </ul>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setCurrentPage('international')}
                className="w-full py-3.5 px-4 border border-brand-anthracite text-brand-anthracite hover:bg-brand-anthracite hover:text-white transition-all duration-300 rounded-sm font-sans text-xs uppercase tracking-widest font-semibold cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Internationale Beratung einsehen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Embedded Minimal Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MinimalistMap />
      </section>

      {/* 6. Abschluss Contact Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white border border-brand-beige rounded-sm p-8 md:p-16 text-center space-y-6 relative overflow-hidden">
          {/* Abstract circles for UI style alignment */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full border border-brand-beige/20 pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full border border-brand-beige/20 pointer-events-none" />

          <h3 className="font-display text-3xl md:text-5xl font-light tracking-tight max-w-2xl mx-auto leading-tight text-brand-anthracite">
            Lassen Sie uns über Ihre <span className="font-semibold text-brand-anthracite">steuerliche Situation</span> sprechen.
          </h3>
          <p className="font-sans text-brand-grey text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Schildern Sie mir Ihr Anliegen in einem unverbindlichen Ersttelefonat. Ich zeige Ihnen pragmatische Lösungswege auf.
          </p>
          
          <div className="pt-4">
            <button
              onClick={() => setCurrentPage('kontakt')}
              className="px-8 py-4 bg-brand-anthracite text-white font-sans font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-black active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>Termin vereinbaren</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
