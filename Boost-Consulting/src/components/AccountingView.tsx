/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { Check, ArrowRight, Shield, RefreshCw, Upload, FileText, MonitorCheck } from 'lucide-react';

interface AccountingViewProps {
  onPageChange: (page: PageId) => void;
}

export default function AccountingView({ onPageChange }: AccountingViewProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  const scope = [
    'Führung der Haupt- und Nebenbuchhaltungen über moderne Vorsysteme.',
    'Erstellung von rechtssicheren Zwischen- und Jahresabschlüssen.',
    'Mehrwertsteuer-Abrechnungen (effektive Methode oder Saldosteuersatz).',
    'Integriertes Debitoren- und Kreditorenmanagement.'
  ];

  const digitalWorkflow = [
    {
      step: '01',
      title: 'Belege digital erfassen',
      desc: 'Keine Ordner. Sie laden Rechnungen, Kassenbelege oder Kreditkartenabrechnungen bequem per App, Webbrowser oder E-Mail-Schnittstelle hoch.',
      icon: <Upload className="w-5 h-5 text-brand-navy" />
    },
    {
      step: '02',
      title: 'Strukturierte Routine',
      desc: 'Unsere Spezialisten verbuchen Belege laufend. Intelligente OCR-Systeme gleichen Transaktionen automatisch ab und minimieren menschliche Fehler.',
      icon: <RefreshCw className="w-5 h-5 text-brand-navy" />
    },
    {
      step: '03',
      title: 'Echtzeit-Reportings',
      desc: 'Sie erhalten jederzeit glasklaren Aufschluss über Ihre Finanzkennzahlen, Liquidität und Steuerrückstellungen über interaktive Online-Dashboards.',
      icon: <FileText className="w-5 h-5 text-brand-navy" />
    }
  ];

  return (
    <div className="space-y-0 animate-fade-in text-left">
      
      {/* SEKTION 1: HERO & ANSATZ */}
      <section className="bg-white border-b border-brand-border py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full animate-pulse"></span>
            Spezialisierung &mdash; Treuhand
          </span>
          
          <h1 className="font-serif font-light text-4xl md:text-5xl text-brand-navy tracking-tight max-w-3xl leading-tight">
            Digitales Accounting ohne <span className="font-sans font-medium text-brand-accent-blue">Medienbrüche.</span>
          </h1>
          
          <p className="font-sans text-[#64748B] text-base md:text-lg max-w-2xl leading-relaxed">
            Papierlose Buchhaltung, automatisierte Prozesse und Echtzeit-Einblick in Ihre Zahlen. Routine, die Ihnen Sicherheit gibt.
          </p>

          <div className="border-t border-brand-border/60 pt-8 mt-4 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 font-mono text-[11px] tracking-widest uppercase text-brand-navy font-bold flex items-center space-x-2">
              <Shield className="w-4 h-4 text-brand-accent-blue" />
              <span>Die Papierlose Philosophie</span>
            </div>
            
            <div className="md:col-span-8 font-sans text-xs text-[#64748B] leading-relaxed space-y-4">
              <p>
                Wir glauben nicht an Ordner voller Belege. Bei Boost Consulting laden Sie Ihre Dokumente einfach digital hoch. Den Rest erledigt unsere strukturierte Routine.
              </p>
              <p>
                Sie erhalten fehlerfreie Abschlüsse und transparente, verständliche Reportings zur optimalen Steuerung Ihres Unternehmens &mdash; wahlweise monatlich, quartalsweise oder jährlich.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW PIPELINE INTERACTION */}
      <section className="bg-brand-gray py-20 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold">Der Ablauf</span>
            <h2 className="font-serif font-light text-3xl text-brand-navy tracking-tight">
              Ihre Schnittstelle zu Boost Consulting
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {digitalWorkflow.map((item, idx) => (
              <div 
                key={item.step} 
                onClick={() => setActiveStep(idx + 1)}
                className={`p-6 bg-white border transition-all cursor-pointer rounded-lg ${
                  activeStep === idx + 1 
                    ? 'border-brand-accent-blue ring-1 ring-brand-accent-blue bg-brand-accent-blue-light/35' 
                    : 'border-brand-border hover:border-brand-accent-blue/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 border flex items-center justify-center transition-colors ${
                    activeStep === idx + 1 ? 'border-brand-accent-blue text-brand-accent-blue bg-white' : 'border-brand-border bg-brand-gray text-brand-navy'
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`font-mono text-xs font-semibold ${
                    activeStep === idx + 1 ? 'text-brand-accent-blue' : 'text-[#94A3B8]'
                  }`}>{item.step}</span>
                </div>
                
                <h3 className="font-sans font-semibold text-sm text-brand-navy mb-2">{item.title}</h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKTION 2: LEISTUNGSUMFANG */}
      <section className="bg-white py-20 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          <div className="md:col-span-5 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold">02 / Abdeckung</span>
            <h2 className="font-serif font-light text-2xl md:text-3xl text-brand-navy tracking-tight">
              Modularer Leistungsumfang für Schweizer B2B.
            </h2>
            <p className="text-xs text-[#64748B] leading-relaxed font-sans">
              Unsere Treuhänder sind mit dem Schweizer Steuer- und Buchungsrecht bis ins Detail vertraut und garantieren fehlerfreie Exzellenz im Routinebetrieb.
            </p>
          </div>

          <div className="md:col-span-7 bg-brand-gray border border-brand-border p-8 md:p-10 space-y-8 rounded-lg">
            <h3 className="font-mono text-xs tracking-widest uppercase font-bold text-brand-navy">
              Inbegriffene Kernkompetenzen (Standard)
            </h3>
            
            <div className="space-y-4">
              {scope.map((item, index) => (
                <div key={index} className="flex items-start space-x-3.5 border-b border-brand-border/60 pb-3 last:border-b-0 last:pb-0">
                  <div className="w-5 h-5 rounded-full border border-brand-accent-blue flex items-center justify-center shrink-0 text-brand-accent-blue bg-white">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="font-sans text-xs text-brand-navy leading-normal">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA-Button: [ Buchhaltung auslagern – Angebot anfordern ] */}
            <div className="pt-4">
              <button
                onClick={() => onPageChange('contact')}
                className="w-full bg-brand-navy text-white hover:bg-brand-accent-blue hover:border-brand-accent-blue py-3.5 text-xs text-center uppercase tracking-widest font-mono font-medium border border-brand-navy transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <span>Buchhaltung auslagern – Angebot anfordern</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
