/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { Landmark, Users2, FileText, BarChart, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface ServicesViewProps {
  onPageChange: (page: PageId) => void;
}

export default function ServicesView({ onPageChange }: ServicesViewProps) {
  const [activeTile, setActiveTile] = useState<string | null>(null);

  const services = [
    {
      id: 'financial',
      title: 'Financial Accounting',
      subtitle: 'Digitale Buchführung',
      summary: 'Fehlerfreie Echtzeit-Erfassung Ihrer Finanzbelege.',
      bullets: [
        'Laufende finanzielle Buchführung auf Schweizer Cloud-Plattformen',
        'Quartalsweise oder monatliche Zwischenabschlüsse',
        'Rechtssichere Abschlüsse nach Schweizer Obligenrecht (OR)',
        'Schnittstellenintegration für Banken, CRM & E-Commerce',
      ],
      icon: <Landmark className="w-5 h-5" />,
      tag: 'Treuhand'
    },
    {
      id: 'payroll',
      title: 'Payroll & HR',
      subtitle: 'Lohn & Personal',
      summary: 'Strukturierte Lohnadministration und Sozialversicherungs-Abwicklung.',
      bullets: [
        'Erstellung von monatlichen Lohnabrechnungen',
        'An- und Abmeldung bei Ausgleichskassen & Pensionskassen',
        'Deklarationen bei Quellensteuer & Sozialversicherungsbehörden',
        'Lohnausweise am Jahresende & Beratung bei HR-Fragen',
      ],
      icon: <Users2 className="w-5 h-5" />,
      tag: 'Administration'
    },
    {
      id: 'tax',
      title: 'Tax Consulting',
      subtitle: 'Steuerberatung',
      summary: 'Optimierung von Firmensteuern, MWST und Gesellschafterabgaben.',
      bullets: [
        'Steuererklärungen für juristische Personen (GmbH/AG) & Gesellschafter',
        'MWST-Abrechnungen (Effektive Methode oder Saldosteuersatz)',
        'Steuerliche Optimierungsberatung vor Jahresende',
        'Vertretung gegenüber kantonalen und eidgenössischen Steuerämtern',
      ],
      icon: <FileText className="w-5 h-5" />,
      tag: 'Sicherheit'
    },
    {
      id: 'business',
      title: 'Business Consulting',
      subtitle: 'Unternehmensberatung',
      summary: 'CFO-on-Demand, Neugründungen und strukturierte Sparringphase.',
      bullets: [
        'Firmengründungen in der Schweiz (GmbH, AG, Einzelfirmen)',
        'Finanzplanung, Budgetierung und Liquiditätssteuerung',
        'Strategische Beratung bei Umstrukturierungen',
        'CFO-on-Demand für Investorengespräche & Skalierungen',
      ],
      icon: <BarChart className="w-5 h-5" />,
      tag: 'Skalierung'
    }
  ];

  return (
    <div className="space-y-0 animate-fade-in text-left">
      
      {/* SEKTION 1: INTRO */}
      <section className="bg-white border-b border-brand-border py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full animate-pulse"></span>
            01 / Unser Portfolio
          </span>
          <h1 className="font-serif font-light text-4xl md:text-5xl text-brand-navy tracking-tight">
            Struktur für Ihr <span className="font-sans font-medium text-brand-accent-blue">Wachstum.</span>
          </h1>
          <p className="font-sans text-[#64748B] text-base md:text-lg max-w-2xl leading-relaxed">
            Unsere Services sind darauf ausgerichtet, Ihnen die administrative Last abzunehmen, damit Sie sich vollumfänglich auf Ihr Kerngeschäft konzentrieren können.
          </p>
        </div>
      </section>

      {/* SEKTION 2: SERVICE-RASTER (4 minimalistische Kacheln, getrennt durch feine Linien) */}
      <section className="bg-brand-gray py-20 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 border border-brand-border bg-white divide-y md:divide-y-0 md:divide-x divide-brand-border">
            
            {services.map((service, idx) => (
              <div 
                key={service.id}
                className={`p-8 md:p-12 transition-all flex flex-col justify-between group ${
                  activeTile === service.id ? 'bg-brand-accent-blue-light/35' : 'bg-white hover:bg-brand-accent-blue-light/10'
                } ${idx >= 2 ? 'md:border-t md:border-brand-border' : ''}`}
              >
                <div className="space-y-6">
                  {/* Icon & Tag Line */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 border border-brand-border flex items-center justify-center text-brand-navy bg-white group-hover:border-brand-accent-blue group-hover:text-brand-accent-blue transition-colors">
                      {service.icon}
                    </div>
                    <span className="font-mono text-[9px] tracking-widest uppercase text-brand-accent-blue px-2.5 py-1 bg-brand-accent-blue-light border border-brand-accent-blue/20 rounded font-medium">
                      {service.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[11px] tracking-wider uppercase text-brand-accent-blue font-medium block">
                      {service.subtitle}
                    </span>
                    <h3 className="font-serif font-light text-2xl text-brand-navy tracking-tight">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed font-sans">
                    {service.summary}
                  </p>

                  {/* Bullet points list, visible or expanded */}
                  <div className="border-t border-brand-border/60 pt-4 space-y-2.5">
                    {service.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start space-x-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-brand-accent-blue shrink-0 mt-0.5" />
                        <span className="font-sans text-brand-navy leading-normal">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  {service.id === 'financial' ? (
                    <button
                      onClick={() => onPageChange('accounting')}
                      className="font-mono text-xs uppercase tracking-widest text-[#0F172A] hover:text-brand-accent-blue flex items-center space-x-1.5 border-b border-[#0F172A] hover:border-brand-accent-blue pb-1 transition-colors cursor-pointer"
                    >
                      <span>Treuhand-Ansatz vertiefen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onPageChange('contact')}
                      className="font-mono text-xs uppercase tracking-widest text-brand-navy hover:text-brand-accent-blue flex items-center space-x-1.5 border-b border-brand-navy hover:border-brand-accent-blue pb-1 transition-all cursor-pointer"
                    >
                      <span>Dienstleistung anfragen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Sektion 3: Call to Action */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold">
            Skalierbare Lösungen
          </span>
          <h2 className="font-serif font-light text-3xl md:text-4xl text-brand-navy tracking-tight max-w-2xl mx-auto leading-tight">
            Haben Sie spezifische Anforderungen für Ihr <span className="font-sans font-medium text-brand-accent-blue">Unternehmen?</span>
          </h2>
          <p className="text-xs text-[#64748B] max-w-lg mx-auto leading-relaxed">
            Egal, ob Sie ein rasant wachsendes Tech-Startup, eine renommierte Kanzlei oder ein etabliertes KMU sind – wir passen unsere operativen Routinen maßgeschneidert an Ihr bestehendes Toolset an.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onPageChange('contact')}
              className="bg-brand-navy text-white text-xs uppercase tracking-widest font-mono font-medium py-3.5 px-8 border border-brand-navy hover:bg-brand-accent-blue hover:border-brand-accent-blue transition-all cursor-pointer shadow-sm"
            >
              Erstgespräch buchen
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
