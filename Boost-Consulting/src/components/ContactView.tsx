/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import CalendlyWidget from './CalendlyWidget';
import ContactForm from './ContactForm';
import { Phone, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react';

export default function ContactView() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'form'>('calendar');

  return (
    <div className="space-y-0 animate-fade-in text-left">
      
      {/* SEKTION 1: EINSTIEG */}
      <section className="bg-white border-b border-brand-border py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[#2563EB] font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent-blue rounded-full animate-pulse"></span>
            07 / Kontaktaufnahme
          </span>
          <h1 className="font-serif font-light text-4xl md:text-5xl text-brand-navy tracking-tight leading-tight">
            Lassen Sie uns sprechen.
          </h1>
          <p className="font-sans text-[#64748B] text-base md:text-lg max-w-2xl leading-relaxed">
            Wählen Sie den direkten Weg zu uns. Digital via Videocall oder klassisch bei uns vor Ort in Zürich.
          </p>
        </div>
      </section>

      {/* SEKTION 2: DIE ZWEI-WEGE-SCHNITTSTELLE */}
      <section className="bg-brand-gray py-16 px-6 border-b border-brand-border">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Tab navigation for clean focus */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start border-b border-brand-border/80 gap-2 sm:gap-0">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`pb-4 px-6 font-sans text-xs uppercase tracking-widest font-mono transition-all border-b-2 flex items-center space-x-2 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'border-brand-accent-blue text-brand-accent-blue font-semibold scale-[1.02]'
                  : 'border-transparent text-[#64748B] hover:text-brand-navy'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Kanal A: Digitaler Direkttermin</span>
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`pb-4 px-6 font-sans text-xs uppercase tracking-widest font-mono transition-all border-b-2 flex items-center space-x-2 cursor-pointer ${
                activeTab === 'form'
                  ? 'border-brand-accent-blue text-brand-accent-blue font-semibold scale-[1.02]'
                  : 'border-transparent text-[#64748B] hover:text-brand-navy'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Kanal B: Strukturiertes Formular</span>
            </button>
          </div>

          {/* Active channel rendering with smooth transition */}
          <div className="animate-fade-in">
            {activeTab === 'calendar' ? (
              <div className="space-y-6">
                <div className="text-center md:text-left max-w-2xl">
                  <h3 className="font-serif font-light text-xl text-brand-navy tracking-tight mb-2">
                    Kanal A: 15-Minuten-Call direkt buchen
                  </h3>
                  <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                    Wählen Sie einen freien Slot im Terminkalender. Anschließend erhalten Sie sofort per E-Mail eine Bestätigung mit dem Einwahllink für Microsoft Teams.
                  </p>
                </div>
                <CalendlyWidget />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center md:text-left max-w-2xl">
                  <h3 className="font-serif font-light text-xl text-brand-navy tracking-tight mb-2">
                    Kanal B: Gezielte schriftliche Anfrage
                  </h3>
                  <p className="text-xs text-[#64748B] font-sans leading-relaxed">
                    Nennen Sie uns kurz die Eckdaten Ihres Unternehmens und Ihr konkretes Anliegen. Ein Partner der Boost Consulting prüft dies vorab und kontaktiert Sie.
                  </p>
                </div>
                <div className="max-w-4xl mx-auto">
                  <ContactForm />
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Corporate Info details listed on screen as per guidelines */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-brand-border/60 pt-16">
          
          <div className="space-y-3 group">
            <div className="flex items-center space-x-3 text-brand-navy">
              <MapPin className="w-4 h-4 text-brand-accent-blue shrink-0 group-hover:scale-110 transition-transform" />
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold">Unternehmenssitz</h4>
            </div>
            <p className="text-xs text-[#64748B] font-sans leading-relaxed pl-7">
              Boost Consulting GmbH<br />
              Bahnhofstrasse 100<br />
              8001 Zürich, Schweiz
            </p>
          </div>

          <div className="space-y-3 group">
            <div className="flex items-center space-x-3 text-brand-navy">
              <Mail className="w-4 h-4 text-brand-accent-blue shrink-0 group-hover:scale-110 transition-transform" />
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold">E-Mail Kontakt</h4>
            </div>
            <p className="text-xs text-[#64748B] font-sans pl-7 leading-relaxed">
              <a href="mailto:partner@boostconsulting.ch" className="hover:text-brand-accent-blue transition-colors font-medium">
                partner@boostconsulting.ch
              </a><br />
              <span className="text-[10px] text-brand-accent-blue font-mono mt-1 block">Rückmeldung binnen 24 Stunden</span>
            </p>
          </div>

          <div className="space-y-3 group">
            <div className="flex items-center space-x-3 text-brand-navy">
              <Phone className="w-4 h-4 text-brand-accent-blue shrink-0 group-hover:scale-110 transition-transform" />
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold">Telefon Desk</h4>
            </div>
            <p className="text-xs text-[#64748B] font-sans pl-7 leading-relaxed">
              <a href="tel:+41442000000" className="hover:text-brand-accent-blue transition-colors font-medium">
                +41 (0) 44 200 00 00
              </a><br />
              <span className="text-[10px] text-brand-accent-blue font-mono mt-1 block">Mo-Fr: 08:30 – 17:30 Uhr</span>
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
