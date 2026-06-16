/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  FileText, 
  Users, 
  Building2, 
  Layers, 
  Coins, 
  ShieldAlert, 
  Calendar, 
  Megaphone,
  Check,
  ArrowRight
} from 'lucide-react';
import { CompanyType } from '../types';

interface AccordionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'treuhand' | 'beratung' | 'zusatz'>('all');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
  // Interactive tool states
  const [selectedTool, setSelectedTool] = useState<'company' | 'taxes'>('company');
  
  // States for Company Foundation Calculator
  const [companyType, setCompanyType] = useState<CompanyType>(CompanyType.GMBH);
  const [expressNotary, setExpressNotary] = useState(false);
  const [vatRegistration, setVatRegistration] = useState(false);
  
  // States for Tax Declaration Fee Estimator
  const [taxEntity, setTaxEntity] = useState<'NP' | 'JP'>('NP');
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married'>('single');
  const [hasRealEstate, setHasRealEstate] = useState(false);
  const [hasForeignAccounts, setHasForeignAccounts] = useState(false);

  const toggleService = (id: string) => {
    if (expandedService === id) {
      setExpandedService(null);
    } else {
      setExpandedService(id);
    }
  };

  const treuhandServices: AccordionItem[] = [
    {
      id: 'buchfuehrung',
      title: 'Buchführung nach OR',
      subtitle: 'Rechtssichere und transparente Finanzbuchhaltung.',
      description: 'Wir führen Ihre Bücher präzise nach den gesetzlichen Bestimmungen des Schweizer Obligationenrechts (OR). Für maximale Transparenz erhalten Sie regelmäßige betriebswirtschaftliche Auswertungen.',
      bullets: [
        'Einrichten des maßgeschneiderten Kontenplans',
        'Kreditoren- und Debitoren-Buchhaltung',
        'Mehrwertsteuer-Abrechnungen (MWST, effektiv oder Saldo/Paushalsteuer)',
        'Erstellung von Zwischen- und Jahresabschlüssen',
        'Vorbereitungen für Revisionen'
      ],
      icon: BookOpen
    },
    {
      id: 'steuern',
      title: 'Steuererklärungen (für JP / NP)',
      subtitle: 'Optimierte Steuerplanung für Firmen und Private.',
      description: 'Wir minimieren Ihre Steuerlast im Rahmen der gesetzlichen Möglichkeiten. Wir erstellen Steuererklärungen für natürliche Personen (NP) im Kanton Zürich und schweizweit sowie für juristische Personen (JP).',
      bullets: [
        'Steuererklärungen für Privatpersonen (Angestellte, Familien, Rentner)',
        'Steuererklärungen für Firmen (GmbH, AG, Kollektivgesellschaften)',
        'Steueroptimierungsberatung und Abzugsprüfung',
        'Prüfung von Veranlagungsverfügungen und Einspracheverfahren',
        'Interkantonale/Internationale Steuerausscheidungen'
      ],
      icon: FileText
    },
    {
      id: 'personal',
      title: 'Personalwesen',
      subtitle: 'Entlastung in der Lohnadministration.',
      description: 'HR- und Lohnabrechnungen unterliegen strengen arbeits- und sozialversicherungsrechtlichen Standards. Wir sichern Ihre rechtskonforme Abwicklung ab.',
      bullets: [
        'Erstellung monatlicher Lohnabrechnungen',
        'Deklarationen bei AHV, IV, ALV, BVG, KTG, UVG',
        'Erstellung von Lohnausweisen am Jahresende',
        'Unterstützung bei Quellensteuer-Abrechnungen',
        'Beratung bei Arbeitsverträgen und Kündigungen'
      ],
      icon: Users
    }
  ];

  const beratungServices: AccordionItem[] = [
    {
      id: 'firmengruendung',
      title: 'Firmengründungen',
      subtitle: 'Der sichere Start in die Selbstständigkeit.',
      description: 'Wir begleiten Sie Schritt für Schritt von der Idee bis zur Eintragung im Handelsregister. Profitieren Sie von unserer Erfahrung im Schweizer Gesellschaftsrecht.',
      bullets: [
        'Wahl der passenden Rechtsform (GmbH, AG, Einzelfirma)',
        'Erstellung der Statuten und Gründungsformulare',
        'Vorbereitung der Notariatsunterlagen und Kapitaleinzahlungskonto',
        'Anmeldung beim Handelsregisteramt und der Sozialversicherung',
        'MWST-Anmeldung und Erstbeschaffung von Versicherungen'
      ],
      icon: Building2
    },
    {
      id: 'administration',
      title: 'Administration',
      subtitle: 'Effizientes Backoffice für Ihr Kerngeschäft.',
      description: 'Sparen Sie Zeit für gewinnbringendere Aufgaben. Wir übernehmen den Posteingang, Fakturierung und das Mahnwesen professionell im Hintergrund.',
      bullets: [
        'Erstellung und Versand von Offerten und Kundenrechnungen',
        'Sorgfältiges Mahnwesen und Zahlungsverfolgung',
        'Allgemeine administrative Korrespondenz',
        'Unterstützung bei Behördengängen und Formularwesen',
        'Archivierung und digitales Dokumentenmanagement'
      ],
      icon: Layers
    },
    {
      id: 'schuldenberatung',
      title: 'Schuldenberatung',
      subtitle: 'Wege aus der finanziellen Belastungsphase.',
      description: 'Wir analysieren Ihre finanzielle Situation vertraulich und respektvoll, erstellen fundierte Sanierungspläne und verhandeln mit Ihren Gläubigern.',
      bullets: [
        'Detaillierte Einnahmen- und Ausgabenanalyse',
        'Erstellung eines realistischen Überlebens- und Budgetplans',
        'Verhandlungen für Ratenzahlungen und Stundungen mit Gläubigern',
        'Abwendung von Betreibungen und Lohnpfändungen',
        'Langfristige Budgetbegleitung zur nachhaltigen Stabilisierung'
      ],
      icon: Coins
    },
    {
      id: 'konkursbegleitung',
      title: 'Konkursbegleitung',
      subtitle: 'Professioneller Beistand in schwierigen Zeiten.',
      description: 'Wenn ein Konkurs unvermeidbar wird, begleiten wir Sie fachmännisch durch das komplexe gesetzliche Verfahren, um persönliche Haftungen zu minimieren.',
      bullets: [
        'Anspruchsprüfung und Beratung vor Einreichung des Konkursbegehrens',
        'Erstellung der Bilanzdeponierungs-Unterlagen',
        'Begleitung beim Termin auf dem zuständigen Konkursamt',
        'Verhandlung mit Sachwaltern und dem amtlichen Liquidator',
        'Schuldenschnitt und administrative Nachbearbeitung'
      ],
      icon: ShieldAlert
    }
  ];

  const zusatzServices: AccordionItem[] = [
    {
      id: 'eventmanagement',
      title: 'Eventmanagement',
      subtitle: 'Massgeschneiderte Anlässe perfekt organisiert.',
      description: 'Vom exklusiven Kunden-Event bis zur Generalversammlung (GV): Wir planen, organisieren und führen Veranstaltungen stilsicher für Sie durch.',
      bullets: [
        'Konzeption, Budgetierung und Location-Scouting',
        'Gästemanagement und Einladungsadministration',
        'Koordinierung von Dienstleistern (Catering, Technik, Dekoration)',
        'Durchführung vor Ort und Protokollführung bei Generalversammlungen',
        'Sorgfältige Nachbearbeitung und Budgetabschluss'
      ],
      icon: Calendar
    },
    {
      id: 'marketing',
      title: 'Marketing & Homepage Erstellung',
      subtitle: 'Moderne Aussendarstellung für KMU.',
      description: 'Eine professionelle Präsenz ist entscheidend. Wir gestalten Ihre moderne, suchmaschinenoptimierte Homepage und unterstützen Sie beim Corporate Branding.',
      bullets: [
        'Design und Programmierung von modernen, responsiven Websites',
        'Erstellung von Logos, Briefschaften und Visitenkarten',
        'Vorbereitung für Google My Business und lokale Suchmaschinenoptimierung (SEO)',
        'Aufbau von einfachen Social-Media-Kanälen',
        'Texterstellung und grafische Begleitung'
      ],
      icon: Megaphone
    }
  ];

  const getAllFiltered = () => {
    switch (activeCategory) {
      case 'treuhand':
        return treuhandServices;
      case 'beratung':
        return beratungServices;
      case 'zusatz':
        return zusatzServices;
      case 'all':
      default:
        return [...treuhandServices, ...beratungServices, ...zusatzServices];
    }
  };

  // Gründungs-Kalkulator Logik
  const calculateCompanyCost = () => {
    let baseFee = 0;
    let notaryFee = 0;
    let registerFee = 0; // Canton Handelsregisteramt

    if (companyType === CompanyType.GMBH) {
      baseFee = 850; // Züri Treuhand consulting, Statuten, Formulare
      notaryFee = 500; // Notariat Beglaubigung
      registerFee = 600; // Canton fee for registration
    } else if (companyType === CompanyType.AG) {
      baseFee = 1200;
      notaryFee = 700;
      registerFee = 600;
    } else {
      // Einzelfirma
      baseFee = 450;
      notaryFee = 0; // No notary required for Einzelfirma
      registerFee = 240;
    }

    if (expressNotary) {
      baseFee += 250; // Express surcharge
    }

    if (vatRegistration) {
      baseFee += 180; // Extra work VAT declaration setup
    }

    return {
      consulting: baseFee,
      notary: notaryFee,
      office: registerFee,
      total: baseFee + notaryFee + registerFee
    };
  };

  // Steuer-Schätzer Logik
  const calculateTaxFeeEstimate = () => {
    let base = 0;
    if (taxEntity === 'NP') {
      base = maritalStatus === 'married' ? 180 : 130;
      if (hasRealEstate) base += 80;
      if (hasForeignAccounts) base += 50;
    } else {
      base = 450; // Starting fee JP, based on standard small company ledger
      if (hasRealEstate) base += 150;
      if (hasForeignAccounts) base += 100;
    }
    return base;
  };

  const currentCompanyCost = calculateCompanyCost();

  return (
    <section id="services" className="py-12 md:py-16 bg-soft-gray relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 md:mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-[1px]" />
            <span className="font-sans text-[11px] text-brand-blue tracking-widest uppercase font-bold">
              DIENSTLEISTUNGEN & MODERNE TOOLS
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tighter text-brand-blue mb-6">
            Unser Beratungsspektrum
          </h2>
          <p className="font-sans text-base text-neutral-600 leading-relaxed font-light">
            Stöbern Sie durch unsere sauber strukturierten Services. Nutzen Sie die Ausklapp-Menüs für detaillierte Informationen oder berechnen Sie mit unserem innovativen transparenten Züri-Kalkulator weiter unten direkt eine erste Richtofferte.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-12 border-b border-border-gray/70 pb-6">
          {[
            { id: 'all', label: 'Alle Dienstleistungen' },
            { id: 'treuhand', label: 'Treuhand & Steuern' },
            { id: 'beratung', label: 'Unternehmensberatung' },
            { id: 'zusatz', label: 'Zusatzdienstleistungen' }
          ].map((cat) => (
            <button
              id={`tab-filter-${cat.id}`}
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setExpandedService(null);
              }}
              className={`px-5 py-2.5 text-xs uppercase font-sans font-semibold tracking-widest rounded-[2px] transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-white hover:bg-neutral-100 border border-border-gray text-brand-blue'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List - Perfectly clean visually */}
        <div className="space-y-4 max-w-4xl mb-14">
          <AnimatePresence mode="popLayout">
            {getAllFiltered().map((service) => {
              const isOpen = expandedService === service.id;
              const ServiceIcon = service.icon;
              return (
                <motion.div
                  id={`service-card-${service.id}`}
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-border-gray/80 rounded-[2px] overflow-hidden transition-all duration-300 hover:shadow-sm"
                >
                  <button
                    onClick={() => toggleService(service.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between group cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-soft-gray rounded-[2px] group-hover:bg-brand-blue/5 transition-colors">
                        <ServiceIcon className="w-5 h-5 text-brand-blue" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-brand-blue text-base">
                          {service.title}
                        </h3>
                        <p className="font-sans text-xs text-neutral-500 mt-0.5 font-light">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>
                    <div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-neutral-500" strokeWidth={1.5} />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-500 group-hover:text-brand-blue transition-colors" strokeWidth={1.5} />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-border-gray/50"
                      >
                        <div className="p-6 bg-soft-gray/50 sm:pl-16">
                          <p className="font-sans text-sm text-neutral-600 leading-relaxed mb-6 font-light">
                            {service.description}
                          </p>
                          <div className="space-y-2.5">
                            <span className="font-sans text-[11px] tracking-wider text-brand-blue uppercase font-bold block mb-3">
                              Unser Leistungsumfang:
                            </span>
                            {service.bullets.map((bullet, idx) => (
                              <div key={idx} className="flex items-start space-x-2.5">
                                <Check className="w-3.5 h-3.5 text-brand-blue mt-0.5 flex-shrink-0" strokeWidth={3} />
                                <span className="font-sans text-xs text-neutral-600 leading-relaxed font-light">
                                  {bullet}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ----------------- INTERACTIVER ZÜRI-KALKULATOR ----------------- */}
        <div className="mt-14 p-8 md:p-10 bg-white border border-border-gray shadow-sm rounded-[2px]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6 border-b border-border-gray">
            <div>
              <div className="flex items-center space-x-2 mb-2 text-brand-blue">
                <Calculator className="w-5 h-5 text-brand-blue" strokeWidth={1.5} />
                <span className="font-sans text-[11px] tracking-wider uppercase font-bold">
                  MODERNE DIGITAL-TOOLS
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-brand-blue">
                Züri Treuhand Kalkulator
              </h3>
              <p className="font-sans text-xs text-neutral-500 mt-1 font-light">
                Berechnen Sie in Echtzeit völlig unverbindlich Richtgebühren für Ihren Bedarf.
              </p>
            </div>

            {/* Selector between Tools */}
            <div className="flex bg-soft-gray p-1 rounded-[2px] border border-border-gray/80 select-none">
              <button
                id="tool-select-company"
                onClick={() => setSelectedTool('company')}
                className={`px-4 py-2 text-xs font-sans tracking-wide uppercase transition-all rounded-[1px] cursor-pointer ${
                  selectedTool === 'company'
                    ? 'bg-brand-blue text-white shadow-sm font-semibold'
                    : 'text-neutral-600 hover:text-brand-blue'
                }`}
              >
                Gründungskosten
              </button>
              <button
                id="tool-select-taxes"
                onClick={() => setSelectedTool('taxes')}
                className={`px-4 py-2 text-xs font-sans tracking-wide uppercase transition-all rounded-[1px] cursor-pointer ${
                  selectedTool === 'taxes'
                    ? 'bg-brand-blue text-white shadow-sm font-semibold'
                    : 'text-neutral-600 hover:text-brand-blue'
                }`}
              >
                Steuererklärung Schätzung
              </button>
            </div>
          </div>

          <div id="calculator-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* CALCULATOR CONTROLS */}
            <div className="lg:col-span-7 space-y-6">
              
              {selectedTool === 'company' ? (
                <>
                  <div>
                    <label className="block text-xs font-sans font-bold tracking-wider text-brand-blue uppercase mb-3">
                      Rechtsform der Unternehmung
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: CompanyType.GMBH, label: 'GmbH', sub: 'Min. CHF 20k' },
                        { id: CompanyType.AG, label: 'AG', sub: 'Min. CHF 100k' },
                        { id: CompanyType.EINZELFIRMA, label: 'Einzelfirma', sub: 'Kein Stammkapital' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setCompanyType(type.id as CompanyType)}
                          className={`p-3 text-center border rounded-[2px] transition-all text-sm flex flex-col items-center justify-center cursor-pointer ${
                            companyType === type.id
                              ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold outline-none'
                              : 'border-border-gray hover:bg-soft-gray text-neutral-700'
                          }`}
                        >
                          <span className="font-sans font-semibold">{type.label}</span>
                          <span className="text-[10px] text-neutral-500 font-light mt-1">{type.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-sans font-bold tracking-wider text-brand-blue uppercase mb-4">
                      Optionen & Dringlichkeit
                    </label>
                    <div className="space-y-3">
                      {companyType !== CompanyType.EINZELFIRMA && (
                        <label className="flex items-start space-x-3 p-3 border border-border-gray hover:bg-soft-gray transition-colors rounded-[2px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={expressNotary}
                            onChange={(e) => setExpressNotary(e.target.checked)}
                            className="mt-0.5 accent-brand-blue w-4 h-4 rounded-[1px]"
                          />
                          <div>
                            <span className="text-xs font-sans font-bold text-brand-blue block">Express Notariat - Gründer-Sprint</span>
                            <span className="text-[11px] text-neutral-600 font-light">Beglaubigung & Abwicklung innert 5 statt 15 Werktagen (+ CHF 250.-)</span>
                          </div>
                        </label>
                      )}

                      <label className="flex items-start space-x-3 p-3 border border-border-gray hover:bg-soft-gray transition-colors rounded-[2px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={vatRegistration}
                          onChange={(e) => setVatRegistration(e.target.checked)}
                          className="mt-0.5 accent-brand-blue w-4 h-4 rounded-[1px]"
                        />
                        <div>
                          <span className="text-xs font-sans font-bold text-brand-blue block">MWST-Anmeldung (ESTV)</span>
                          <span className="text-[11px] text-neutral-600 font-light">Rechtssichere Registrierung bei der eidg. Steuerverwaltung (+ CHF 180.-)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* TAX declaration controls */}
                  <div>
                    <label className="block text-xs font-sans font-bold tracking-wider text-brand-blue uppercase mb-3">
                      Steuersubjekt
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { setTaxEntity('NP'); setExpandedService(null); }}
                        className={`p-3 text-center border rounded-[2px] transition-all text-sm flex flex-col items-center justify-center cursor-pointer ${
                          taxEntity === 'NP'
                            ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                            : 'border-border-gray hover:bg-soft-gray text-neutral-700'
                        }`}
                      >
                        <span className="font-sans font-semibold">Natürliche Person</span>
                        <span className="text-[10px] text-neutral-500 font-light mt-1">Privatperson / Angestellt</span>
                      </button>
                      <button
                        onClick={() => { setTaxEntity('JP'); setExpandedService(null); }}
                        className={`p-3 text-center border rounded-[2px] transition-all text-sm flex flex-col items-center justify-center cursor-pointer ${
                          taxEntity === 'JP'
                            ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                            : 'border-border-gray hover:bg-soft-gray text-neutral-700'
                        }`}
                      >
                        <span className="font-sans font-semibold">Juristische Person</span>
                        <span className="text-[10px] text-neutral-500 font-light mt-1">GmbH, AG, Vereine</span>
                      </button>
                    </div>
                  </div>

                  {taxEntity === 'NP' && (
                    <div>
                      <label className="block text-xs font-sans font-bold tracking-wider text-brand-blue uppercase mb-3">
                        Zivilstand
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setMaritalStatus('single')}
                          className={`p-2.5 text-center border rounded-[2px] transition-all text-xs cursor-pointer ${
                            maritalStatus === 'single'
                              ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                              : 'border-border-gray hover:bg-soft-gray text-neutral-700'
                          }`}
                        >
                          Ledig • Alleinestehend
                        </button>
                        <button
                          onClick={() => setMaritalStatus('married')}
                          className={`p-2.5 text-center border rounded-[2px] transition-all text-xs cursor-pointer ${
                            maritalStatus === 'married'
                              ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                              : 'border-border-gray hover:bg-soft-gray text-neutral-700'
                          }`}
                        >
                          Verheiratet • Partnerschaft
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <label className="block text-xs font-sans font-bold tracking-wider text-brand-blue uppercase mb-4">
                      Zusätzliche Komplexitätsfaktoren
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 p-3 border border-border-gray hover:bg-soft-gray transition-colors rounded-[2px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasRealEstate}
                          onChange={(e) => setHasRealEstate(e.target.checked)}
                          className="mt-0.5 accent-brand-blue w-4 h-4 rounded-[1px]"
                        />
                        <div>
                          <span className="text-xs font-sans font-bold text-brand-blue block">Immobilienbesitz (Eigenheim / NPV)</span>
                          <span className="text-[11px] text-neutral-600 font-light">Liegenschaftssteuer, Schuldzinsen-Abzüge (+ {taxEntity === 'NP' ? 'CHF 80.-' : 'CHF 150.-'})</span>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3 p-3 border border-border-gray hover:bg-soft-gray transition-colors rounded-[2px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasForeignAccounts}
                          onChange={(e) => setHasForeignAccounts(e.target.checked)}
                          className="mt-0.5 accent-brand-blue w-4 h-4 rounded-[1px]"
                        />
                        <div>
                          <span className="text-xs font-sans font-bold text-brand-blue block">Auslandkonten oder Kryptowährungen</span>
                          <span className="text-[11px] text-neutral-600 font-light">Wertschriften- und Guthabennachweis im Ausland (+ {taxEntity === 'NP' ? 'CHF 50.-' : 'CHF 100.-'})</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ESTIMATION BOX PRESENTATION */}
            <div className="lg:col-span-5 bg-soft-gray border border-border-gray p-6 sm:p-8 rounded-[2px]">
              <span className="font-sans text-[11px] tracking-widest text-[#0A2342] uppercase font-bold block mb-4">
                Ihr Richtpreis & Details
              </span>

              {selectedTool === 'company' ? (
                <>
                  <div className="text-brand-blue font-sans text-4xl sm:text-5xl font-bold mb-6 flex items-baseline tracking-tight">
                    <span className="text-sm font-sans font-normal text-neutral-500 mr-1.5">CHF</span>
                    {currentCompanyCost.total}
                    <span className="text-xs font-sans font-normal text-neutral-500 ml-2">exkl. MWST</span>
                  </div>

                  <div className="space-y-4 text-xs font-sans border-b border-border-gray/80 pb-6 mb-6">
                    <div className="flex justify-between text-neutral-700">
                      <span>Züri Treuhand Beratungspauschale:</span>
                      <span className="font-semibold">CHF {currentCompanyCost.consulting}</span>
                    </div>
                    <div className="flex justify-between text-neutral-700">
                      <span>Notariatsgebühren (Notar):</span>
                      <span className="font-semibold">CHF {currentCompanyCost.notary}</span>
                    </div>
                    <div className="flex justify-between text-neutral-700">
                      <span>Kantonale Handelsregister-Gebühren:</span>
                      <span className="font-semibold">CHF {currentCompanyCost.office}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-[11px] text-neutral-600 mb-8 leading-relaxed font-light">
                    <p className="flex items-start">
                      <Check className="w-3.5 h-3.5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Rechtssichere Statuten & Gründungsakt.</span>
                    </p>
                    <p className="flex items-start">
                      <Check className="w-3.5 h-3.5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Komplette Einreichung im Wunschkanton.</span>
                    </p>
                    <p className="flex items-start">
                      <Check className="w-3.5 h-3.5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Inklusive 1 Std. kostenfreie Post-Gründungsberatung.</span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-brand-blue font-sans text-4xl sm:text-5xl font-bold mb-6 flex items-baseline tracking-tight">
                    <span className="text-sm font-sans font-normal text-neutral-500 mr-1.5">ca. CHF</span>
                    {calculateTaxFeeEstimate()}
                    <span className="text-xs font-sans font-normal text-neutral-500 ml-2">Fixpreis</span>
                  </div>

                  <div className="space-y-4 text-xs font-sans border-b border-border-gray/80 pb-6 mb-6">
                    <div className="flex justify-between text-neutral-700">
                      <span>Deklarationseinheiten:</span>
                      <span className="font-semibold">{taxEntity === 'NP' ? 'Selbständig / Angestellt' : 'Firmeneinnahmen'}</span>
                    </div>
                    <div className="flex justify-between text-neutral-700">
                      <span>Belegprüfung & Optimierung:</span>
                      <span className="font-semibold">Inklusive</span>
                    </div>
                    <div className="flex justify-between text-neutral-700">
                      <span>Fristverlängerung (falls nötig):</span>
                      <span className="font-semibold">Kostenlos</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-[11px] text-neutral-600 mb-8 leading-relaxed font-light">
                    <p className="flex items-start">
                      <Check className="w-3.5 h-3.5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Sorgfältige Abzügeprüfungen (Pendeln, Essen, Säule 3a).</span>
                    </p>
                    <p className="flex items-start">
                      <Check className="w-3.5 h-3.5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Verfassen von Begleitschreiben bei Sondereffekten.</span>
                    </p>
                    <p className="flex items-start">
                      <Check className="w-3.5 h-3.5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Rechtliche Vertretung vor dem Steueramt bei Rückfragen.</span>
                    </p>
                  </div>
                </>
              )}

              <a
                href="#contact"
                className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white text-center font-sans tracking-widest uppercase text-xs rounded-[2px] transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Dieses Angebot sichern</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
