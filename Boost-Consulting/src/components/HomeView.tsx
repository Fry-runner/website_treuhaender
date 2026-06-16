/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageId } from '../types';
import { ArrowRight, Landmark, Settings, BarChart3, MapPin } from 'lucide-react';

interface HomeViewProps {
  onPageChange: (page: PageId) => void;
}

export default function HomeView({ onPageChange }: HomeViewProps) {
  return (
    <div className="space-y-0 animate-fade-in">
      
      {/* Sektion 1: HERO */}
      <section className="relative bg-white border-b border-brand-border py-24 md:py-36 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-start space-y-8">
          {/* Dachzeile */}
          <span className="font-mono text-xs uppercase tracking-widest text-[#94A3B8] font-medium flex items-center gap-2">
            Boost Consulting GmbH &mdash; Zürich
          </span>
          
          {/* Headline H1 with light weight and letters spacing matching guidelines */}
          <h1 className="font-serif font-light text-4xl md:text-6xl tracking-tight text-[#0F172A] leading-[1.15] max-w-4xl">
            Treuhand neu gedacht. <br className="hidden md:inline" />
            <span className="font-sans font-medium text-brand-accent-blue tracking-tight block mt-2 text-3xl md:text-5xl">Präzise. Digital. Zuverlässig.</span>
          </h1>

          {/* Subtext */}
          <p className="font-sans text-[#64748B] text-base md:text-lg max-w-2xl leading-relaxed">
            Boost Consulting verbindet Schweizer Treuhand-Tradition mit modernster digitaler Routine. Für Unternehmen, die Effizienz und absolute Sicherheit suchen.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={() => onPageChange('services')}
              className="bg-brand-navy text-white text-xs uppercase tracking-widest font-mono font-medium py-4 px-8 border border-brand-navy hover:bg-brand-accent-blue hover:border-brand-accent-blue transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>Dienstleistungen ansehen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            
            <button
              onClick={() => onPageChange('contact')}
              className="bg-transparent text-brand-navy text-xs uppercase tracking-widest font-mono font-medium py-4 px-8 border border-brand-navy hover:bg-brand-accent-blue-light hover:text-brand-accent-blue hover:border-brand-accent-blue transition-all flex items-center justify-center cursor-pointer"
            >
              Erstgespräch vereinbaren
            </button>
          </div>
        </div>

        {/* Minimal structural coordinate grid background purely styled with 1px borders */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex flex-col border-l border-brand-border pointer-events-none items-center justify-center">
          <div className="w-full h-1/2 border-b border-brand-border flex items-center justify-center text-brand-gray/10">
            {/* Elegant vector grid */}
            <svg width="200" height="200" viewBox="0 0 100 100" className="stroke-brand-border/40 stroke-[0.5]" fill="none">
              <circle cx="50" cy="50" r="40" />
              <line x1="50" y1="0" x2="50" y2="100" />
              <line x1="0" y1="50" x2="100" y2="50" />
            </svg>
          </div>
          <div className="w-full h-1/2 flex items-center justify-center text-brand-platinum/10 font-mono text-[9px] tracking-widest uppercase">
            CH &bull; 47.3769° N, 8.5417° E
          </div>
        </div>
      </section>

      {/* Sektion 2: DIE 3 SÄULEN */}
      <section className="bg-brand-gray border-b border-brand-border py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold">
              Struktur &amp; Ausfallsicherheit
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-serif font-light text-3xl md:text-4xl text-brand-navy tracking-tight">
                Digitale Exzellenz im Fokus.
              </h2>
              <div className="w-16 h-1 bg-brand-accent-blue rounded-full"></div>
            </div>
          </div>

          {/* 3 Columns structure separated by ultra-thin borders */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-brand-border bg-white divide-y md:divide-y-0 md:divide-x divide-brand-border">
            
            {/* Pillar 1: Accounting */}
            <div className="p-8 space-y-4 flex flex-col justify-between group hover:bg-brand-accent-blue-light/35 transition-colors">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-brand-border flex items-center justify-center text-brand-navy group-hover:border-brand-accent-blue group-hover:text-brand-accent-blue transition-colors">
                  <Landmark className="w-5 h-5 shrink-0" />
                </div>
                <h3 className="font-sans font-semibold text-base text-brand-navy uppercase tracking-wider">
                  Accounting
                </h3>
                <p className="text-xs text-[#52525B] font-sans leading-relaxed">
                  Digitale Buchführung, Abschlüsse nach Schweizer Obligenrecht (OR) und integrierte Lohnbuchhaltung auf modernsten Schweizer Plattformen.
                </p>
              </div>
              <button 
                onClick={() => onPageChange('accounting')} 
                className="pt-6 font-mono text-[10px] uppercase tracking-widest text-[#0F172A] flex items-center space-x-1.5 group-hover:translate-x-1 group-hover:text-brand-accent-blue transition-all self-start cursor-pointer"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Pillar 2: Unternehmensberatung */}
            <div className="p-8 space-y-4 flex flex-col justify-between group hover:bg-brand-accent-blue-light/35 transition-colors">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-brand-border flex items-center justify-center text-brand-navy group-hover:border-brand-accent-blue group-hover:text-brand-accent-blue transition-colors">
                  <BarChart3 className="w-5 h-5 shrink-0" />
                </div>
                <h3 className="font-sans font-semibold text-base text-brand-navy uppercase tracking-wider">
                  Unternehmensberatung
                </h3>
                <p className="text-xs text-[#52525B] font-sans leading-relaxed">
                  Strukturierte Firmengründungen, Umstrukturierungen, Business-Pläne, Liquiditätsplanung und CFO-on-Demand Unterstützung für wachsende B2B-Unternehmen.
                </p>
              </div>
              <button 
                onClick={() => onPageChange('services')} 
                className="pt-6 font-mono text-[10px] uppercase tracking-widest text-[#0F172A] flex items-center space-x-1.5 group-hover:translate-x-1 group-hover:text-brand-accent-blue transition-all self-start cursor-pointer"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Pillar 3: Prozessautomatisierung */}
            <div className="p-8 space-y-4 flex flex-col justify-between group hover:bg-brand-accent-blue-light/35 transition-colors">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-brand-border flex items-center justify-center text-brand-navy group-hover:border-brand-accent-blue group-hover:text-brand-accent-blue transition-colors">
                  <Settings className="w-5 h-5 shrink-0" />
                </div>
                <h3 className="font-sans font-semibold text-base text-brand-navy uppercase tracking-wider">
                  Prozessautomatisierung
                </h3>
                <p className="text-xs text-[#52525B] font-sans leading-relaxed">
                  Konsequenter Fokus liegt auf der fehlerfreien, papierlosen Abwicklung. Wir eliminieren Medienbrüche durch intelligente Schnittstellen zu Ihren CRM/ERP-Systemen.
                </p>
              </div>
              <button 
                onClick={() => onPageChange('services')} 
                className="pt-6 font-mono text-[10px] uppercase tracking-widest text-[#0F172A] flex items-center space-x-1.5 group-hover:translate-x-1 group-hover:text-brand-accent-blue transition-all self-start cursor-pointer"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Sektion 3: PHILOSOPHIE-TEASER */}
      <section className="bg-white py-24 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-brand-accent-blue font-mono text-xs uppercase tracking-widest">
              <MapPin className="w-4 h-4" />
              <span>Standort Zürich, Schweiz</span>
            </div>
            
            <h2 className="font-serif font-light text-3xl md:text-4xl text-brand-navy tracking-tight leading-snug">
              Hintergrund und Vision &mdash; <span className="font-sans font-normal text-brand-accent-blue text-2xl md:text-3xl block mt-1">Administration unsichtbar machen.</span>
            </h2>
            
            <div className="w-16 h-[2px] bg-brand-accent-blue rounded-full"></div>
          </div>

          <div className="space-y-4 text-xs font-sans text-[#64748B] leading-relaxed">
            <p>
              Unsere Philosophie ist so klar wie Ihre Zahlen sein sollten: Boost Consulting wurde in Zürich mit dem Versprechen gegründet, Administration durch kühle, strukturierte Prozesse komplett unsichtbar zu machen.
            </p>
            <p>
              Wir glauben, dass der wahre Erfolg eines modernen Treuhandpartners nicht in schwerfälligen dicken Ordnern liegt, sondern in fehlerfreien digitalen Routinen, die ohne Medienbrüche und vollständig papierlos ablaufen. Sie konzentrieren sich zu 100% auf Ihr Kerngeschäft &mdash; im Hintergrund managen wir Ihre gesamte Buchhaltung und Finanzen fehlerfrei, verlässlich und mit Schweizer Präzision.
            </p>
            
            <div className="pt-4">
              <button
                onClick={() => onPageChange('about')}
                className="font-mono text-xs uppercase tracking-widest text-brand-navy hover:text-brand-accent-blue border-b border-brand-navy hover:border-brand-accent-blue pb-1 transition-colors cursor-pointer"
              >
                Erfahren Sie mehr über Boost Consulting
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sektion 4: PARTNER-PREVIEW */}
      <section className="bg-brand-gray border-b border-brand-border py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full animate-pulse"></span>
              Starke Verbindungen
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-serif font-light text-2xl md:text-3xl text-brand-navy tracking-tight">
                Ein Auszug unseres exzellenten Partner-Netzwerks
              </h2>
              <div className="w-16 h-1 bg-brand-accent-blue rounded-full"></div>
            </div>
            <p className="font-sans text-xs text-[#64748B] max-w-2xl leading-relaxed">
              Für erstklassige, digitale Abläufe und behördliche Konformität kooperieren wir eng mit erstklassigen Treuhand-, Legal- und Software-Partnern der Schweiz.
            </p>
          </div>

          {/* Simple grid of partners preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-brand-border p-5 rounded-lg text-center hover:border-brand-accent-blue transition-all">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#2563EB] block mb-1 font-bold">Akkreditierung</span>
              <h4 className="font-sans font-bold text-xs text-brand-navy">Bexio Platin</h4>
            </div>
            <div className="bg-white border border-brand-border p-5 rounded-lg text-center hover:border-brand-accent-blue transition-all">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#64748B] block mb-1">Kooperation</span>
              <h4 className="font-sans font-bold text-xs text-brand-navy">Consulta</h4>
            </div>
            <div className="bg-white border border-brand-border p-5 rounded-lg text-center hover:border-brand-accent-blue transition-all">
              <span className="font-mono text-[9px] uppercase tracking-widest text-brand-navy/60 block mb-1">Steuerung & BI</span>
              <h4 className="font-sans font-bold text-xs text-brand-navy">Theta AG</h4>
            </div>
            <div className="bg-white border border-brand-border p-5 rounded-lg text-center hover:border-brand-accent-blue transition-all">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#2563EB] block mb-1 font-bold">RPA Automation</span>
              <h4 className="font-sans font-bold text-xs text-brand-navy">Aivo</h4>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onPageChange('cooperation')}
              className="inline-flex items-center space-x-1.5 bg-transparent border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-mono text-xs uppercase tracking-widest py-3 px-6 transition-all cursor-pointer rounded"
            >
              <span>Alle Partner & Auszeichnungen ansehen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Sektion 5: ABOUT-PREVIEW (Kennzahlen) */}
      <section className="bg-white py-20 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full"></span>
                Zahlen der Seriosität
              </span>
              <h2 className="font-serif font-light text-2xl md:text-3xl text-brand-navy tracking-tight">
                Warum anspruchsvolle B2B-Kunden uns wählen
              </h2>
            </div>
            <button
              onClick={() => onPageChange('about')}
              className="inline-flex items-center space-x-1.5 text-xs text-brand-navy font-mono uppercase tracking-widest border-b border-brand-navy hover:text-brand-accent-blue hover:border-brand-accent-blue pb-1 transition-colors self-start md:self-auto cursor-pointer"
            >
              <span>Mehr über unsere Werte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-brand-border bg-brand-gray divide-y md:divide-y-0 md:divide-x divide-brand-border text-center rounded-lg overflow-hidden">
            <div className="py-10 px-6 space-y-2">
              <div className="font-serif font-light text-4xl text-brand-navy tracking-tight">100% Digital</div>
              <h4 className="font-mono text-[10px] text-brand-accent-blue uppercase tracking-wider font-bold">Papierlos</h4>
              <p className="text-[11px] text-[#64748B] font-sans max-w-xs mx-auto leading-relaxed">
                Komplett papierlose Abwicklung aller Transaktionen und Freigaben ohne Medienbrüche.
              </p>
            </div>
            <div className="py-10 px-6 space-y-2">
              <div className="font-serif font-light text-4xl text-brand-navy tracking-tight">Zürich</div>
              <h4 className="font-mono text-[10px] text-brand-accent-blue uppercase tracking-wider font-bold">Regional Verankert</h4>
              <p className="text-[11px] text-[#64748B] font-sans max-w-xs mx-auto leading-relaxed">
                Lokale Verwurzelung am Puls der Zürcher Wirtschaftszone mit direktem, persönlichem Support.
              </p>
            </div>
            <div className="py-10 px-6 space-y-2">
              <div className="font-serif font-light text-4xl text-brand-navy tracking-tight">Routine</div>
              <h4 className="font-mono text-[10px] text-brand-accent-blue uppercase tracking-wider font-bold">Fehlersicherheit</h4>
              <p className="text-[11px] text-[#64748B] font-sans max-w-xs mx-auto leading-relaxed">
                Strukturierte Workflows und digitale Validierungsschleifen für fehlerfreie Buchführung.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
