/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { ContactFormData } from '../types';

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    serviceCategory: 'steuererklaerung',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Bitte füllen Sie alle erforderlichen Felder aus (*).');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending progress
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        serviceCategory: 'steuererklaerung',
        message: '',
      });
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-12 md:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 md:mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-[1px]" />
            <span className="font-sans text-[11px] text-brand-blue tracking-widest uppercase font-bold">
              PERSÖNLICHES ERSTGESPRÄCH
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tighter text-brand-blue mb-6">
            Lassen Sie uns ins Gespräch kommen
          </h2>
          <p className="font-sans text-base text-neutral-600 leading-relaxed font-light">
            Haben Sie Fragen zu unseren Treuhanddienstleistungen oder wünschen Sie eine unverbindliche Beratung? Rufen Sie uns direkt an oder senden Sie uns eine Nachricht über das aufgeräumte Formular unten.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* CONTACT INFO COLUMN & VECTOR MAP */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* Quick Contact Info cards */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-soft-gray border border-border-gray text-brand-blue rounded-[2px] mt-0.5">
                  <MapPin className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-neutral-700 mb-1">
                    BESUCHSADRESSE
                  </h4>
                  <p className="font-sans text-sm text-brand-blue font-semibold">
                    Hardstrasse 4
                  </p>
                  <p className="font-sans text-sm text-neutral-600 font-light">
                    8004 Zürich • Schweiz
                  </p>
                  <p className="font-sans text-[11px] text-neutral-500 mt-1">
                    Kreis 4 / Nahe Bezirksgebäude
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-soft-gray border border-border-gray text-brand-blue rounded-[2px] mt-0.5">
                  <Phone className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-neutral-700 mb-1">
                    TELEFONISCHER DIREKTKONTAKT
                  </h4>
                  <p className="font-sans text-sm text-brand-blue font-semibold">
                    <a href="tel:+41765388004" className="hover:underline">
                      +41 76 538 80 04
                    </a>
                  </p>
                  <p className="font-sans text-xs text-neutral-500 font-light">
                    Montag bis Freitag, 08:30 – 17:30 Uhr
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-soft-gray border border-border-gray text-brand-blue rounded-[2px] mt-0.5">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-neutral-700 mb-1">
                    E-MAIL KORRESPONDENZ
                  </h4>
                  <p className="font-sans text-sm text-brand-blue font-semibold">
                    <a href="mailto:info@zuritreuhand.ch" className="hover:underline">
                      info@zuritreuhand.ch
                    </a>
                  </p>
                  <p className="font-sans text-xs text-neutral-500 font-light">
                    Sichere und verschlüsselte E-Mail-Übertragung.
                  </p>
                </div>
              </div>
            </div>

            {/* ARTISTIC ARCHITECTURAL VECTOR MAP (GRAYSCALE) */}
            <div className="border border-border-gray rounded-[2px] overflow-hidden bg-soft-gray relative p-1 shadow-sm">
              <div className="bg-white/80 absolute top-4 left-4 z-20 px-3 py-1.5 border border-border-gray rounded-[1px] text-[10px] font-sans tracking-wider uppercase text-neutral-700 flex items-center space-x-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                <span>Kartenausschnitt Zürich</span>
              </div>
              
              <div className="h-[280px] w-full relative overflow-hidden bg-[#F2F2F2]">
                {/* SVG styled map streets and labels */}
                <svg className="absolute inset-0 w-full h-full text-neutral-300 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid overlay */}
                  <defs>
                    <pattern id="mapPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E6E6E6" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapPattern)" />

                  {/* Badenerstrasse street */}
                  <path d="M -50,60 L 500,240" fill="none" stroke="#EBEBEB" strokeWidth="32" strokeLinecap="round" />
                  <path d="M -50,60 L 500,240" fill="none" stroke="#E1E1E1" strokeWidth="24" strokeLinecap="round" />
                  
                  {/* Hardstrasse street (where our office is) */}
                  <path d="M 180,-50 L 180,350" fill="none" stroke="#EBEBEB" strokeWidth="36" strokeLinecap="round" />
                  <path d="M 180,-50 L 180,350" fill="none" stroke="#E1E1E1" strokeWidth="28" strokeLinecap="round" />
                  
                  {/* Müllerstrasse street */}
                  <path d="M 330,-50 L 330,350" fill="none" stroke="#E5E5E5" strokeWidth="22" strokeLinecap="round" />

                  {/* Sihlquai/Langstrasse connection direction */}
                  <path d="M 50,150 L 400,60" fill="none" stroke="#E5E5E5" strokeWidth="18" strokeLinecap="round" />

                  {/* Tram and Train Tracks */}
                  <path d="M -50,60 L 500,240" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeDasharray="4,4" />

                  {/* Text markings for orientation */}
                  <text x="70" y="105" fill="#999999" fontSize="9" fontFamily="monospace" transform="rotate(22, 70, 105)" letterSpacing="1.5">BADENERSTRASSE</text>
                  <text x="195" y="40" fill="#999999" fontSize="9" fontFamily="monospace" transform="rotate(90, 195, 40)" letterSpacing="1.5">HARDSTRASSE</text>
                  <text x="215" y="270" fill="#AAAAAA" fontSize="8" fontFamily="sans-serif">Bezirksgebäude</text>
                  <text x="20" y="250" fill="#AAAAAA" fontSize="8" fontFamily="sans-serif">Bullingerplatz</text>
                </svg>

                {/* Pulsating marker for Hardstrasse 4 */}
                <div className="absolute top-[130px] left-[180px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <span className="absolute inline-flex h-9 w-9 rounded-full bg-brand-blue/10 animate-ping" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-blue border-2 border-white shadow-md" />
                  <div className="mt-2 bg-brand-blue text-white text-[9px] font-sans tracking-widest font-semibold uppercase px-2.5 py-1 shadow-sm rounded-[1px] whitespace-nowrap">
                    HARDSTRASSE 4
                  </div>
                </div>

                {/* Map scaling controls placeholder in corner */}
                <div className="absolute bottom-3 right-3 bg-white/90 border border-border-gray text-neutral-700 p-2 rounded-[1px] text-[10px] font-mono shadow-sm">
                  8004 ZÜRICH CH
                </div>
              </div>
            </div>

          </div>

          {/* CLEAN INTERACTIVE CONTACT FORM */}
          <div className="lg:col-span-7 bg-soft-gray border border-border-gray/70 p-8 sm:p-10 rounded-[2px]">
            <h3 className="font-sans text-[18px] font-bold text-brand-blue mb-6 uppercase tracking-wider">
              Anfrage senden
            </h3>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-l-4 border-emerald-500 p-6 rounded-[2px] text-left my-8"
              >
                <div className="flex items-center space-x-3 mb-3 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                  <h4 className="font-sans text-sm font-bold uppercase tracking-wider">
                    Anfrage erfolgreich übermittelt!
                  </h4>
                </div>
                <p className="font-sans text-xs text-neutral-700 leading-relaxed font-light">
                  Vielen Dank für Ihre Kontaktaufnahme. Wir haben Ihre Daten erfasst und prüfen Ihr Anliegen sorgfältig. Ein qualifizierter Treuhänder aus unserer Kanzlei meldet sich innerhalb von <strong>24 Stunden</strong> telefonisch oder per E-Mail bei Ihnen für das kostenfreie Erstgespräch.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 px-4 py-2 border border-border-gray text-[#333333]/80 hover:text-brand-blue hover:bg-soft-gray rounded-[2px] text-xs font-sans uppercase tracking-[0.1em] font-semibold transition-all"
                >
                  Weitere Nachricht senden
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {errorMsg && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div>
                    <label htmlFor="contact-name" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                      Ihr Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="z.B. Beat Müller"
                      className="w-full px-4 py-3 bg-white border border-border-gray/90 focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="contact-email" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                      Ihre E-Mail *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="beat.mueller@beispiel.ch"
                      className="w-full px-4 py-3 bg-white border border-border-gray/90 focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone field */}
                  <div>
                    <label htmlFor="contact-phone" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                      Telefonnummer (optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="z.B. +41 44 123 45 67"
                      className="w-full px-4 py-3 bg-white border border-border-gray/90 focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue"
                    />
                  </div>

                  {/* Company Name field */}
                  <div>
                    <label htmlFor="contact-company" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                      Firmenname (optional)
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Müller Consulting GmbH"
                      className="w-full px-4 py-3 bg-white border border-border-gray/90 focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue"
                    />
                  </div>
                </div>

                {/* Service Dropdown category selection */}
                <div>
                  <label htmlFor="contact-service" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                    Gewünschter Fachbereich
                  </label>
                  <select
                    id="contact-service"
                    name="serviceCategory"
                    value={formData.serviceCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-border-gray/90 focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue cursor-pointer"
                  >
                    <option value="steuererklaerung">Steuererklärung erstellen (NP/JP)</option>
                    <option value="buchhaltung">Buchführung & Mehrwertsteuer (OR)</option>
                    <option value="lohn_personal">Personalwesen & Lohnadministration</option>
                    <option value="firmengruendung">Firmengündung / Rechtsberatung</option>
                    <option value="schulden_konkurs">Schuldenberatung / Konkursbegleitung</option>
                    <option value="marketing_event">Zusatz: Marketing / Eventmanagement</option>
                    <option value="allgemeines">Allgemeine Treuhandfragen</option>
                  </select>
                </div>

                {/* Case / Message description */}
                <div>
                  <label htmlFor="contact-message" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                    Ihr Anliegen / Ihre Nachricht *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Beschreiben Sie kurz Ihre Situation (z.B. Firmengründung als GmbH, Steuererklärung für das aktuelle Jahr, o.ä.)..."
                    className="w-full px-4 py-3 bg-white border border-border-gray/90 focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue resize-y"
                  />
                </div>

                {/* Bottom consent and submit */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
                  <span className="text-[10px] text-neutral-500 max-w-sm font-sans leading-relaxed font-light">
                    Mit dem Absenden erklären Sie sich einverstanden, dass wir Ihre Daten zur Beantwortung des Anliegens verarbeiten. Vertraulichkeit garantiert.
                  </span>
                  
                  <button
                    id="contact-submit-button"
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-neutral-400 text-white font-sans text-xs font-semibold tracking-widest uppercase rounded-[2px] transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        <span>Senden...</span>
                      </>
                    ) : (
                      <>
                        <span>Nachricht senden</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
