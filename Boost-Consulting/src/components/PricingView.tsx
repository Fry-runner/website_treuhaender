/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';

interface PricingViewProps {
  onPageChange: (page: PageId) => void;
}

export default function PricingView({ onPageChange }: PricingViewProps) {
  const [transactionVolume, setTransactionVolume] = useState<number>(50);

  const packages = [
    {
      id: 'essential',
      name: 'Package: Essential',
      description: 'Ausgerichtet auf Start-ups & kleine Schweizer KMUs.',
      price: 'CHF 290',
      period: 'Monat',
      features: [
        'Digitale Buchführung bis zu 50 Belegen / Monat',
        'Laufender Bankenabgleich (1 Bankkonto)',
        'MWST-Abrechnung (Saldobesteuerung)',
        'Gesetzlicher Schweizer Jahresabschluss (OR)',
        'Zutritt zum digitalen Belegportal (24/7)'
      ],
      cta: 'Modell wählen',
      limits: 'Bis ca. 50 Belege/Monat'
    },
    {
      id: 'advanced',
      name: 'Package: Advanced',
      description: 'Für wachsende Unternehmen mit fester Personalstruktur.',
      price: 'CHF 650',
      period: 'Monat',
      features: [
        'Digitale Buchführung bis zu 150 Belegen / Monat',
        'Automatisierter Bankenabgleich (mehrere Konten)',
        'MWST-Abrechnungen (Effektive Methode)',
        'Strukturierte Lohnadministration (bis zu 5 Mitarbeitende)',
        'Vierteljährliche operative Performance-Reportings',
        'Priorisierte Treuhänder-Hotline'
      ],
      cta: 'Modell buchen',
      limits: 'Bis ca. 150 Belege & 5 Mitarbeiter'
    },
    {
      id: 'custom',
      name: 'Package: Custom',
      description: 'Für komplexe Konzernstrukturen, Konsolidierung & CFO-on-Demand.',
      price: 'Auf Anfrage',
      period: 'Kalkulation',
      features: [
        'Unlimitiertes Belegvolumen',
        'Lohnadministration für >5 Mitarbeitende',
        'Mehrere Schweizer Gesellschaften (Konzernkonsolidierung)',
        'CFO-on-Demand bei Budgetierung & Finanzierungsrunden',
        'Direkter Ansprechpartner (Senior Partner)',
        'Automatisierte ERP-Schnittstellen (Custom API)'
      ],
      cta: 'Anfrage stellen',
      limits: 'Individuell abgestimmt'
    }
  ];

  // Dynamic system recommendation based on sliding transaction volume range
  const getRecommendedPackage = () => {
    if (transactionVolume <= 50) return 'essential';
    if (transactionVolume <= 180) return 'advanced';
    return 'custom';
  };

  const recPack = getRecommendedPackage();

  return (
    <div className="space-y-0 animate-fade-in text-left">
      
      {/* SEKTION 1: POSITIONIERUNG */}
      <section className="bg-white border-b border-brand-border py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full animate-pulse"></span>
            06 / Preistransparenz
          </span>
          <h1 className="font-serif font-light text-4xl md:text-5xl text-brand-navy tracking-tight max-w-3xl leading-tight">
            Transparente Konditionen. <br />
            <span className="font-sans font-medium text-brand-accent-blue">Keine Überraschungen.</span>
          </h1>
          <p className="font-sans text-[#64748B] text-base md:text-lg max-w-3xl leading-relaxed">
            Fixpreise oder massgeschneiderte Packages. Wir kalkulieren so präzise, wie wir arbeiten. Verzicht auf künstliche Verkaufs-Badges für maximale Seriosität.
          </p>
        </div>
      </section>

      {/* INTERACTIVE PRICE CALCULATOR FOR UNIQUE HIGH-FIDELITY UX */}
      <section className="bg-brand-gray py-12 px-6 border-b border-brand-border">
        <div className="max-w-4xl mx-auto bg-white border border-brand-border p-6 md:p-8 space-y-6 rounded-xl shadow-sm">
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent-blue font-semibold block">
              Volumen-Kalkulator
            </span>
            <h3 className="font-sans font-semibold text-sm text-brand-navy">
              Ermitteln Sie Ihren Bedarf basierend auf Beleg-Volumen
            </h3>
            <p className="text-[11px] text-[#64748B] font-sans">
              Bewegen Sie den Schieberegler, um Ihr monatliches Belegvolumen (Rechnungen, Quittungen) einzuschätzen.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-brand-navy font-bold">Ungefähres Volumen:</span>
              <span className="text-brand-accent-blue font-bold bg-brand-accent-blue-light border border-brand-accent-blue/20 px-3 py-1 text-sm rounded">
                {transactionVolume} Belege / Monat
              </span>
            </div>
            
            <input
              type="range"
              min="10"
              max="300"
              step="5"
              value={transactionVolume}
              onChange={(e) => setTransactionVolume(parseInt(e.target.value))}
              className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-accent-blue"
            />
            
            <div className="flex justify-between text-[10px] font-mono text-[#64748B]">
              <span>Min: 10 Belege</span>
              <span>150 Belege</span>
              <span>Max: 300+ Belege</span>
            </div>
          </div>

          <div className="border border-brand-border/60 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-accent-blue-light/35 p-4 border rounded-lg">
            <div>
              <p className="text-[10px] font-mono text-brand-accent-blue uppercase tracking-wider font-semibold">Unsere Empfehlung</p>
              <p className="text-sm font-sans font-semibold text-brand-navy mt-1">
                {recPack === 'essential' && 'Package: Essential — Ideal für Kleinstfirmen'}
                {recPack === 'advanced' && 'Package: Advanced — Ideal für KMUs mit Personal'}
                {recPack === 'custom' && 'Package: Custom — Für komplexe Strukturen & CFO-Support'}
              </p>
            </div>
            
            <button
              onClick={() => onPageChange('contact')}
              className="bg-brand-navy text-white text-[10px] uppercase tracking-widest font-mono py-2.5 px-5 hover:bg-brand-accent-blue transition-all cursor-pointer rounded shadow-sm"
            >
              Angebot anfordern
            </button>
          </div>
        </div>
      </section>

      {/* SEKTION 2: PAKET-STRUKTUR */}
      <section className="bg-white py-20 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 border border-brand-border bg-white divide-y lg:divide-y-0 lg:divide-x divide-brand-border rounded-xl overflow-hidden shadow-sm">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`p-8 md:p-10 flex flex-col justify-between transition-colors ${
                  recPack === pkg.id ? 'bg-brand-accent-blue-light/25 ring-1 ring-brand-accent-blue/30' : 'bg-white'
                }`}
              >
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-serif font-light text-xl text-brand-navy tracking-tight uppercase">
                      {pkg.name}
                    </h3>
                    <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="py-4 border-y border-brand-border/60">
                    <div className="flex items-baseline space-x-1">
                      <span className="font-serif font-light text-3xl md:text-4xl text-brand-navy">
                        {pkg.price}
                      </span>
                      <span className="text-xs font-mono text-brand-accent-blue font-semibold">
                        / {pkg.period}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B] block mt-1">
                      {pkg.limits}
                    </span>
                  </div>

                  <ul className="space-y-3.5">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2.5 text-xs">
                        <Check className="w-3.5 h-3.5 text-brand-accent-blue shrink-0 mt-0.5" />
                        <span className="font-sans text-brand-navy leading-normal">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6">
                  <button
                    onClick={() => onPageChange('contact')}
                    className={`w-full py-3 text-xs uppercase tracking-widest font-mono transition-all text-center border cursor-pointer rounded ${
                      recPack === pkg.id
                        ? 'bg-brand-navy text-white border-brand-navy hover:bg-brand-accent-blue hover:border-brand-accent-blue shadow-sm'
                        : 'bg-transparent text-brand-navy border-brand-navy hover:bg-brand-accent-blue hover:text-white hover:border-brand-accent-blue'
                    }`}
                  >
                    {pkg.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* SEKTION 2B: EINZELLEISTUNGEN & STUNDENSÄTZE */}
      <section className="bg-brand-gray py-20 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full animate-pulse"></span>
              06B / Stundensätze & Einzelleistungen
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-serif font-light text-2xl md:text-3xl text-brand-navy tracking-tight">
                Unsere Stundensätze & Tarife
              </h2>
              <div className="w-16 h-1 bg-brand-accent-blue rounded-full"></div>
            </div>
            <p className="font-sans text-sm text-[#475569] max-w-3xl leading-relaxed">
              Gerne erstellen wir Ihnen eine unverbindliche Offerte, nachdem Sie <strong className="text-brand-navy font-semibold">eine Stunde kostenlose Beratung</strong> in Anspruch genommen haben.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1: Kern-Dienstleistungen */}
            <div className="bg-white border border-brand-border p-6 md:p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="font-sans font-semibold text-xs uppercase tracking-wider text-brand-navy pb-3 border-b border-brand-border flex items-center justify-between">
                <span>Kern-Dienstleistungen</span>
                <span className="text-[10px] font-mono text-[#64748B] normal-case font-normal">Ansatz / h</span>
              </h3>
              
              <div className="space-y-5">
                {/* Item 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-sans text-xs font-semibold text-brand-navy">Buchführung</h4>
                    <span className="font-mono text-xs font-bold text-[#2563EB] shrink-0">CHF 180.00</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                    Review der Buchhaltung durch den betreuenden Mandatsleiter / Coaching.
                  </p>
                  <div className="bg-[#EFF6FF] text-[#1E40AF] px-2.5 py-1.5 rounded text-[10px] font-mono flex justify-between items-center">
                    <span>Sonderstundensatz Start-up (Gründung liegt max. 1 Jahr zurück):</span>
                    <span className="font-semibold">CHF 160.00</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="space-y-1.5 pt-4 border-t border-brand-border/60">
                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-sans text-xs font-semibold text-brand-navy">Jahresabschlussarbeiten Treuhand</h4>
                    <span className="font-mono text-xs font-bold text-[#2563EB] shrink-0">CHF 180.00</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                    Inklusive laufender MWST-Arbeiten (Mandatsleiter-Review).
                  </p>
                  <div className="bg-[#EFF6FF] text-[#1E40AF] px-2.5 py-1.5 rounded text-[10px] font-mono flex justify-between items-center">
                    <span>Sonderstundensatz Start-up (Gründung liegt max. 1 Jahr zurück):</span>
                    <span className="font-semibold">CHF 160.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Fachberatung & Spezialthemen */}
            <div className="bg-white border border-brand-border p-6 md:p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="font-sans font-semibold text-xs uppercase tracking-wider text-brand-navy pb-3 border-b border-brand-border flex items-center justify-between">
                <span>Beratung & Spezialtarife</span>
                <span className="text-[10px] font-mono text-[#64748B] normal-case font-normal">Ansatz</span>
              </h3>

              <div className="space-y-5">
                {/* Item 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-sans text-xs font-semibold text-brand-navy">MWST-Fachberatung (LL.M)</h4>
                    <span className="font-mono text-xs font-bold text-[#2563EB] shrink-0">CHF 230.00 / h</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                    Qualifizierte Fachberatungen durch ausgewiesene Fachexperten.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="space-y-1 pt-4 border-t border-brand-border/60">
                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-sans text-xs font-semibold text-brand-navy">Steuerberatungen</h4>
                    <span className="font-mono text-xs font-bold text-[#2563EB] shrink-0">CHF 180.00 / h</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                    Nationale Steuererklärungen, Optimierungen und Abklärungen.
                  </p>
                </div>

                {/* Item 5 */}
                <div className="space-y-1 pt-4 border-t border-brand-border/60">
                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-sans text-xs font-semibold text-brand-navy">Consulting & Spezialarbeiten</h4>
                    <span className="font-mono text-xs font-bold text-[#2563EB] shrink-0">CHF 230.00 / h</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                    Pragmatische Unternehmensberatung sowie Spezialaufgaben (Anmeldungen Kinderzulagen, ALV-Auszahlungen etc.).
                  </p>
                </div>

                {/* Item 6 */}
                <div className="space-y-1 pt-4 border-t border-brand-border/60">
                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-sans text-xs font-semibold text-brand-navy">Workshops / Digitalisierung</h4>
                    <span className="font-mono text-xs font-bold text-[#2563EB] shrink-0">CHF 1'500.00 / Tag</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                    Consulting, Digitalization & Workshops pro Tag und Consultant (zzgl. 5% Auslagenersatz).
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div className="bg-[#F8FAFC] border border-brand-border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[11px] text-[#64748B] font-mono">
              * Alle Preise verstehen sich exklusive der gesetzlichen Schweizer Mehrwertsteuer (zzgl. MWST).
            </span>
            <button
              onClick={() => onPageChange('contact')}
              className="inline-flex items-center space-x-1.5 bg-brand-navy text-white text-[11px] uppercase tracking-widest font-mono py-2.5 px-6 hover:bg-brand-accent-blue transition-all cursor-pointer rounded shadow-sm shrink-0"
            >
              <span>Kostenlose 1h Beratung buchen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* EXTRA FAQ MINI SECTION FOR EXTRA QUALITY */}
      <section className="bg-brand-gray py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-accent-blue font-semibold">FAQ</span>
            <h2 className="font-serif font-light text-2xl text-brand-navy tracking-tight">Häufig gestellte Rechnungsfragen</h2>
          </div>

          <div className="space-y-5">
            <div className="p-5 bg-white border border-brand-border space-y-2 rounded-lg shadow-sm">
              <h4 className="font-sans font-semibold text-xs text-brand-navy">Gibt es Nebenkosten oder Einrichtungsgebühren?</h4>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Nein. Wir verzichten auf unklare administrative Einrichtungsgebühren. Das Onboarding Ihrer digitalen Belege ist vollständig kostenfrei und im Paketpreis inkludiert.
              </p>
            </div>
            
            <div className="p-5 bg-white border border-brand-border space-y-2 rounded-lg shadow-sm">
              <h4 className="font-sans font-semibold text-xs text-brand-navy">Kann ich mein Paket flexibel anpassen oder kündigen?</h4>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Ja, Anpassungen des Volumens sind monatlich möglich. Wenn Ihr Geschäft schrumpft oder wächst, wechselt das System automatisch in das passendere Preiskonzept, um Fairness zu garantieren.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
