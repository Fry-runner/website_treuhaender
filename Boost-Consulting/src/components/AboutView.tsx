/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageId } from '../types';
import { Award, Compass, Heart, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onPageChange: (page: PageId) => void;
}

export default function AboutView({ onPageChange }: AboutViewProps) {
  return (
    <div className="space-y-0 animate-fade-in text-left">
      
      {/* SEKTION 1: HERO & LEITBILD */}
      <section className="bg-white border-b border-brand-border py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full animate-pulse"></span>
            04 / Institutioneller Background
          </span>
          
          <h1 className="font-serif font-light text-4xl md:text-5xl text-brand-navy tracking-tight max-w-3xl leading-tight">
            Ihr digitaler Sparringspartner aus <span className="font-sans font-medium text-brand-accent-blue">Zürich.</span>
          </h1>

          <p className="font-sans text-[#64748B] text-base md:text-lg max-w-2xl leading-relaxed">
            Wer wir sind, was uns antreibt und warum wir Treuhand als strategisches Werkzeug verstehen.
          </p>

          <div className="border-t border-brand-border/60 pt-8 mt-4 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 font-mono text-[11px] tracking-widest uppercase text-brand-navy font-bold flex items-center space-x-2">
              <Compass className="w-4 h-4 text-brand-accent-blue" />
              <span>Das Gründer-Commitment</span>
            </div>
            
            <div className="md:col-span-8 font-sans text-xs text-[#64748B] leading-relaxed space-y-4">
              <p>
                Boost Consulting wurde gegründet, um die Lücke zwischen traditioneller Schweizer Treuhand-Präzision und den unendlichen Möglichkeiten der modernen Digitalisierung zu schliessen.
              </p>
              <p>
                Wir arbeiten nicht nur für Sie, sondern schaffen digitale Ökosysteme, die Ihr Unternehmen messbar effizienter machen. Für uns ist Treuhand kein administratives Übel, sondern ein präzise gestimmter Hebel zu Ihrem Wachstum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEKTION 2: INSTITUTIONELLE FAKTEN */}
      <section className="bg-brand-gray border-b border-brand-border py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full animate-pulse"></span>
            Kennzahlen der Seriosität
          </span>
          
          {/* Drei markante Kennzahlen, dargestellt in grosser, schlanker Typografie */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-brand-border bg-white divide-y md:divide-y-0 md:divide-x divide-brand-border text-center rounded-lg overflow-hidden shadow-sm">
            
            {/* Fact 1 */}
            <div className="py-12 px-6 space-y-3 group hover:bg-brand-accent-blue-light/10 transition-colors">
              <div className="font-serif font-light text-5xl md:text-6xl text-brand-navy tracking-tighter group-hover:text-brand-accent-blue transition-colors">
                100% Digital
              </div>
              <h4 className="font-mono text-xs font-semibold text-brand-accent-blue uppercase tracking-wider">
                Papierlos
              </h4>
              <p className="text-[11px] text-[#64748B] font-sans max-w-xs mx-auto leading-relaxed">
                Komplett papierlose Abwicklung aller Transaktionen und Genehmigungsschleifen ohne Medienbrüche.
              </p>
            </div>

            {/* Fact 2 */}
            <div className="py-12 px-6 space-y-3 group hover:bg-brand-accent-blue-light/10 transition-colors">
              <div className="font-serif font-light text-5xl md:text-6xl text-brand-navy tracking-tighter group-hover:text-brand-accent-blue transition-colors">
                Zürich
              </div>
              <h4 className="font-mono text-xs font-semibold text-brand-accent-blue uppercase tracking-wider">
                Regional Verankert
              </h4>
              <p className="text-[11px] text-[#64748B] font-sans max-w-xs mx-auto leading-relaxed">
                Fest verwurzelt im Schweizer Wirtschaftsraum mit lokalem Support am Puls der Zürcher Wirtschaftszone.
              </p>
            </div>

            {/* Fact 3 */}
            <div className="py-12 px-6 space-y-3 group hover:bg-brand-accent-blue-light/10 transition-colors">
              <div className="font-serif font-light text-5xl md:text-6xl text-brand-navy tracking-tighter group-hover:text-brand-accent-blue transition-colors">
                Routine
              </div>
              <h4 className="font-mono text-xs font-semibold text-brand-accent-blue uppercase tracking-wider">
                Fehlersicherheit
              </h4>
              <p className="text-[11px] text-[#64748B] font-sans max-w-xs mx-auto leading-relaxed">
                Strukturierte Prozesse und digitale Validierungen für maximale Fehlerminimierung im operativen Betrieb.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* VALUES SECTION FOR EXTRA POLISH */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold">Drei Grundpfeiler</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-serif font-light text-3xl text-brand-navy tracking-tight">Unsere operativen Grundwerte</h2>
              <div className="w-16 h-1 bg-brand-accent-blue rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-8 h-[2px] bg-brand-accent-blue rounded-full"></div>
              <h4 className="font-sans font-semibold text-sm text-brand-navy">01 / Absolute Vertrauenssache</h4>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                Sicherheit und Vertraulichkeit stehen bei uns an oberster Stelle. Alle Ihre sensiblen Finanzdaten lagern auf hochgradig geschützten, mehrfach gespiegelten Schweizer Servern.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-8 h-[2px] bg-brand-accent-blue rounded-full"></div>
              <h4 className="font-sans font-semibold text-sm text-brand-navy">02 / Proaktiver Austausch</h4>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                Wir warten nicht, bis Sie sich melden. Bei auffälligen Steuerschwankungen, steuerlichen Sparmöglichkeiten oder administrativen Engpässen gehen wir aktiv auf Sie zu.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-[2px] bg-brand-accent-blue rounded-full"></div>
              <h4 className="font-sans font-semibold text-sm text-brand-navy">03 / Pragmatischer Pragmatismus</h4>
              <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                Kein unnötiger Papierkram, kein schwerfälliges Beraterdeutsch. Wir liefern klare Antworten, strukturierte Auswertungen und halten Ihnen den Rücken frei.
              </p>
            </div>
          </div>

          <div className="pt-8 text-center">
            <button
              onClick={() => onPageChange('contact')}
              className="inline-flex items-center space-x-2 border border-brand-navy hover:bg-brand-accent-blue hover:text-white hover:border-brand-accent-blue py-3.5 px-8 text-xs tracking-widest font-mono text-brand-navy uppercase transition-all cursor-pointer shadow-sm"
            >
              <span>Gespräch mit Partner vereinbaren</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
