/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { Network, Handshake, Users, HelpCircle, Check, Send, CheckCircle2, Award, ExternalLink } from 'lucide-react';

interface CooperationViewProps {
  onPageChange: (page: PageId) => void;
}

export default function CooperationView({ onPageChange }: CooperationViewProps) {
  const [partnerType, setPartnerType] = useState('Software- & Tech-Anbieter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [pMessage, setPMessage] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'success'>('idle');

  const synergies = [
    {
      title: 'Software- & Tech-Anbieter',
      desc: 'Sie liefern die technologische Infrastruktur – wir die treuhänderische und strategische Expertise für die gemeinsame Kundschaft.',
      bullets: ['Automatisierte API-Schnittstellen', 'Co-Marketing & System-Zertifizierungen', 'Gemeinsame Kunden-Onboardings'],
      icon: <Network className="w-5 h-5 text-brand-navy" />
    },
    {
      title: 'Agenturen & Berater',
      desc: 'Ergänzen Sie Ihr Portfolio. Während Sie das Wachstum Ihrer Kunden vorantreiben, halten wir im Hintergrund die finanzielle Struktur stabil.',
      bullets: ['White-Labeled Treuhand-Dienste', 'Priorisierter Partner-Support', 'CFO-Sparring für Ihre Top-Klienten'],
      icon: <Users className="w-5 h-5 text-brand-navy" />
    },
    {
      title: 'Kanzleien & Fachexperten',
      desc: 'Nutzen Sie unser digitales Ökosystem für komplexe Auslagerungen, Cross-Referrals und gemeinsame Großprojekte.',
      bullets: ['Spezialisierte Steuerexpertisen', 'Sichere Cross-Referral Abkommen', 'Digitale Revisions-Vorbereitungen'],
      icon: <Handshake className="w-5 h-5 text-brand-navy" />
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Erstkontakt & Abgleich',
      desc: 'Unverbindliches Gespräch zur Prüfung der Schnittstellen und des gemeinsamen Wertversprechens.'
    },
    {
      num: '02',
      title: 'Modell-Definition',
      desc: 'Strukturierte Festlegung der Win-Win-Situation, der finanziellen Beteiligung oder des Co-Sellings.'
    },
    {
      num: '03',
      title: 'Integration & Start',
      desc: 'Aufnahme in das digitale Partnernetzwerk der Boost Consulting und Start des ersten gemeinsamen Projekts.'
    }
  ];

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const storedSubmissions = localStorage.getItem('boost_cooperation_submissions');
    const existing = storedSubmissions ? JSON.parse(storedSubmissions) : [];
    
    const newSub = {
      id: Math.random().toString(36).substring(2, 9),
      partnerType,
      name,
      email,
      company,
      message: pMessage,
      createdAt: new Date().toLocaleDateString('de-CH')
    };

    localStorage.setItem('boost_cooperation_submissions', JSON.stringify([newSub, ...existing]));
    setSubStatus('success');

    // Reset
    setName('');
    setEmail('');
    setCompany('');
    setPMessage('');
  };

  return (
    <div className="space-y-0 animate-fade-in text-left">
      
      {/* SEKTION 1: NUTZENVERSPRECHEN */}
      <section className="bg-white border-b border-brand-border py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full animate-pulse"></span>
            05 / B2B Kooperationen
          </span>
          <h1 className="font-serif font-light text-4xl md:text-5xl text-brand-navy tracking-tight max-w-4xl leading-tight">
            Gemeinsam Werte schaffen. <br className="hidden md:inline" />
            <span className="font-sans font-medium text-[#2563EB]">Digitale Routine trifft strategische Kooperation.</span>
          </h1>
          <p className="font-sans text-[#64748B] text-base md:text-lg max-w-3xl leading-relaxed">
            Boost Consulting verbindet erstklassiges Treuhand-Wissen mit digitaler Exzellenz. Wir erweitern unser B2B-Netzwerk im Raum Zürich gezielt mit Partnern, die denselben Anspruch an Präzision und Innovation teilen.
          </p>
        </div>
      </section>

      {/* SEKTION 1B: ALLIANZEN, PARTNER & ZERTIFIZIERUNGEN */}
      <section className="bg-white border-b border-brand-border py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-accent-blue" />
              05B / Auszeichnungen & Partner-Netzwerk
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-serif font-light text-2xl md:text-3xl text-brand-navy tracking-tight">
                Zertifizierte Exzellenz & strategische Allianzen
              </h2>
              <div className="w-16 h-1 bg-brand-accent-blue rounded-full"></div>
            </div>
            <p className="font-sans text-xs text-[#64748B] max-w-2xl leading-relaxed">
              Mittelständische Ansprüche erfordern präzise Schnittstellen und behördliche Konformität. Wir kooperieren eng mit führenden Partnern, Systemhäusern und Treuhand-Instanzen, um erstklassige digitale Abläufe zu garantieren.
            </p>
          </div>

          {/* Elegant 4-column balanced grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Bexio Platin-Partner */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#2563EB] font-bold">Akkreditierung</span>
                  <Award className="w-4 h-4 text-[#2563EB] animate-pulse" />
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  Bexio Platin
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Höchste Zertifizierungsstufe der führenden Schweizer KMU-Plattform für vollautomatisierte Belegbuchung.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Status</span>
                <span className="bg-[#EFF6FF] text-[#1E40AF] px-1.5 py-0.5 rounded text-[9px] font-bold">Platin Elite</span>
              </div>
            </div>

            {/* 2. Consulta */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-navy/60 font-bold">Kooperation</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  Consulta
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Exklusiver Fachaustausch für ganzheitliche M&A-Szenarien, Generationswechsel und Nachfolgelösungen.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Fokus</span>
                <span>Unternehmensberatung</span>
              </div>
            </div>

            {/* 3. The CFO Company */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#2563EB] font-bold">Finance Strategy</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  The CFO Company
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Interdisziplinäre Synergien im Bereich fraktionales Interims-Management und anspruchsvolle Finanzierungsrunden.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Allianz</span>
                <span>CFO-on-Demand</span>
              </div>
            </div>

            {/* 4. FS Partners */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-navy/60 font-bold">Senior Finance</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  FS Partners
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Gemeinsame Strukturen bei der Begleitung von Treasury, Corporate Governance und komplexen Reportings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Kompetenz</span>
                <span>CFO Services</span>
              </div>
            </div>

            {/* 5. Gryps */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-navy/60 font-bold">Akkreditierung</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  Gryps
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Zertifizierter, qualitätsgeprüfter Vertrauenspartner des führenden Schweizer KMU-Offertenportals.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Zertifikat</span>
                <span className="bg-[#EFF6FF] text-[#1E40AF] px-1.5 py-0.5 rounded text-[9px] font-bold">Geprüfter Experte</span>
              </div>
            </div>

            {/* 6. FirmIt */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-navy/60 font-bold">Incorporation</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  FirmIt
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Optimierte Workflows bei Firmengründungen (GmbH / AG) und sofortiger Anbindung an das Buchhaltungssystem.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Schnittstelle</span>
                <span>Gründung</span>
              </div>
            </div>

            {/* 7. Audit Suisse */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-navy/60 font-bold">Wirtschaftsprüfung</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  Audit Suisse
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Schnittstellennahe Kooperation für gesetzeskonforme und fehlerfreie ordentliche sowie eingeschränkte Revisionen.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Standard</span>
                <span>RAB konform</span>
              </div>
            </div>

            {/* 8. CCFT.ch */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-navy/60 font-bold">Handelskammer</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  CCFT.ch
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Mitgliedschaft und Kooperation mit der schweizerisch-französischen Industrie- & Handelskammer für grenzüberschreitende Setups.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Netzwerk</span>
                <span>Mitglied</span>
              </div>
            </div>

            {/* 9. Lexr */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-navy/60 font-bold">Recht & Legal</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  Lexr
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Direkter Draht zu hochgradig digitalisierten Anwälten für AGB-Prüfung, Arbeitsverträge und Beteiligungspläne (ESOP).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Schnittstelle</span>
                <span>Legal Tech</span>
              </div>
            </div>

            {/* 10. Theta AG */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#2563EB] font-bold">BI & Data</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  Theta AG
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Modellierung und Beratung für skalierbare ERP-Abgleiche und BI-Dashboards zur Liquiditätssteuerung.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Schnittstelle</span>
                <span>ERP Connector</span>
              </div>
            </div>

            {/* 11. Aivo */}
            <div className="bg-brand-gray border border-brand-border p-6 rounded-lg hover:border-brand-accent-blue-light hover:bg-[#F8FAFC] transition-all group flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#2563EB] font-bold">RPA Automation</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-brand-navy group-hover:text-brand-accent-blue transition-colors">
                  Aivo
                </h3>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Robotergestützte Prozessautomatisierung zur unkomplizierten Bewältigung von Massendaten-Belegen.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>Schnittstelle</span>
                <span>Automation / AI</span>
              </div>
            </div>

            {/* 12. Dynamic Call to Action: Ihr Unternehmen */}
            <div 
              onClick={() => {
                const element = document.getElementById('coop-form-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#2563EB] border border-[#2563EB] hover:bg-[#1D4ED8] hover:border-[#1D4ED8] transition-all group flex flex-col justify-between h-full p-6 rounded-lg cursor-pointer shadow-lg text-white"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#EFF6FF] font-bold">Kooperation</span>
                  <ExternalLink className="w-4 h-4 text-[#EFF6FF]" />
                </div>
                <h3 className="font-sans font-semibold text-sm text-[#EFF6FF]">
                  Ihr Unternehmen?
                </h3>
                <p className="text-[11px] text-[#94A3B8] font-sans leading-relaxed">
                  Werden Sie Teil unseres vertrauenswürdigen Netzwerks im Raum Zürich und treiben wir gemeinsam digitale Innovationen voran.
                </p>
              </div>
              <div className="mt-4 pt-2 flex items-center justify-between text-[10px] font-mono text-[#EFF6FF] font-bold">
                <span>Jetzt Partner werden</span>
                <span>&rarr;</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEKTION 2: ZIELGRUPPEN-SYNERGIEN */}
      <section className="bg-brand-gray py-20 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold">
              Synergie-Profile
            </span>
            <h2 className="font-serif font-light text-2xl md:text-3xl text-brand-navy tracking-tight">
              Wie wir mit Ihnen zusammenarbeiten können
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-brand-border bg-white divide-y md:divide-y-0 md:divide-x divide-brand-border rounded-lg overflow-hidden shadow-sm">
            {synergies.map((synergy, index) => (
              <div key={index} className="p-8 space-y-6 hover:bg-brand-accent-blue-light/10 transition-colors flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-10 h-10 border border-brand-border flex items-center justify-center bg-brand-gray group-hover:border-brand-accent-blue group-hover:text-brand-accent-blue transition-colors">
                    {synergy.icon}
                  </div>
                  
                  <h3 className="font-sans font-semibold text-base text-brand-navy uppercase tracking-wider">
                    {synergy.title}
                  </h3>
                  
                  <p className="text-xs text-[#64748B] leading-relaxed font-sans">
                    {synergy.desc}
                  </p>
                </div>

                <div className="border-t border-brand-border/60 pt-4 space-y-2">
                  {synergy.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center space-x-2 text-[11px] text-brand-navy">
                      <Check className="w-3 h-3 text-brand-accent-blue shrink-0" />
                      <span className="font-sans text-[#475569]">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKTION 3: DER 3-SCHRITT-PROZESS */}
      <section className="bg-white py-20 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 text-center md:text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold">Der Ablauf</span>
            <h2 className="font-serif font-light text-2xl md:text-3xl text-brand-navy tracking-tight">
              Der 3-Schritt-Prozess zur Partnerschaft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative p-6 bg-brand-gray border border-brand-border space-y-4 rounded-lg">
                <div className="font-mono text-xs text-brand-accent-blue font-bold uppercase tracking-wider">
                  Schritt {step.num}
                </div>
                
                <h3 className="font-sans font-semibold text-sm text-brand-navy">
                  {step.title}
                </h3>
                
                <p className="text-xs text-[#64748B] leading-relaxed font-sans">
                  {step.desc}
                </p>
                
                {idx < 2 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden lg:block text-brand-accent-blue font-bold">
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERSHIP REQUEST INLINE FORM (CTA-Button: [ Kooperationsanfrage senden ]) */}
      <section id="coop-form-section" className="bg-brand-gray py-20 px-6">
        <div className="max-w-4xl mx-auto border border-brand-border bg-white p-6 md:p-10 space-y-8 rounded-xl shadow-sm">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold">
              Direktkontakt
            </span>
            <h3 className="font-serif font-light text-2xl text-brand-navy tracking-tight">
              Senden Sie uns eine Kooperationsanfrage
            </h3>
            <p className="text-xs text-[#64748B] font-sans max-w-xl leading-relaxed">
              Lassen Sie uns gemeinsam Synergien analysieren und Schnittstellen prüfen. Wir kontaktieren Sie in Kürze für ein unverbindliches Erstgespräch.
            </p>
          </div>

          {subStatus === 'success' ? (
            <div className="p-6 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg flex items-start space-x-3 text-xs animate-fade-in text-[#1E40AF]">
              <CheckCircle2 className="w-5 h-5 text-brand-accent-blue shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-sans font-semibold">Partnerschaftsanfrage übermittelt!</p>
                <p className="font-sans">Vielen Dank für Ihr strategisches Interesse. Unser Kooperationsbeauftragter wird sich zeitnah mit Ihnen in Verbindung setzen.</p>
                <button 
                  onClick={() => setSubStatus('idle')}
                  className="text-brand-accent-blue underline mt-2 block font-medium cursor-pointer"
                >
                  Noch eine Anfrage senden
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="coop-partner" className="text-xs text-[#475569] font-sans font-medium">Partner-Profil</label>
                  <select
                    id="coop-partner"
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                    className="w-full border border-brand-border bg-white p-2.5 text-xs text-brand-navy font-sans focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded"
                  >
                    <option value="Software- & Tech-Anbieter">Software- & Tech-Anbieter</option>
                    <option value="Agentur & Berater">Agentur & Berater</option>
                    <option value="Kanzlei & Fachexperte">Kanzlei & Fachexperte</option>
                    <option value="Anderes Partner-Profil">Anderes Partner-Profil</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="coop-company" className="text-xs text-[#475569] font-sans font-medium">Unternehmen / Organisation *</label>
                  <input
                    id="coop-company"
                    type="text"
                    required
                    placeholder="Ihrem Firmennamen GmbH"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="coop-name" className="text-xs text-[#475569] font-sans font-medium">Ansprechpartner *</label>
                  <input
                    id="coop-name"
                    type="text"
                    required
                    placeholder="Ihr Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="coop-email" className="text-xs text-[#475569] font-sans font-medium">Geschäftliche E-Mail-Adresse *</label>
                  <input
                    id="coop-email"
                    type="email"
                    required
                    placeholder="email@firma.ch"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="coop-msg" className="text-xs text-[#475569] font-sans font-medium">Vorstellung der gemeinsamen Synergien</label>
                <textarea
                  id="coop-msg"
                  rows={4}
                  placeholder="Beschreiben Sie kurz das mögliche Modell einer Win-Win-Situation..."
                  value={pMessage}
                  onChange={(e) => setPMessage(e.target.value)}
                  className="w-full border border-brand-border bg-white p-3 text-sm text-brand-navy focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded"
                />
              </div>

              <div className="text-right pt-2">
                <button
                  type="submit"
                  className="bg-brand-navy text-white hover:bg-brand-accent-blue hover:border-brand-accent-blue py-3.5 px-8 text-xs font-mono font-medium uppercase tracking-widest transition-all flex items-center justify-center space-x-2 inline-flex cursor-pointer shadow-sm rounded"
                >
                  <span>Kooperationsanfrage senden</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
