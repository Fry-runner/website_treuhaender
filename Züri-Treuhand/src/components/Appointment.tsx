/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  PhoneCall, 
  MapPin, 
  User, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Briefcase,
  ExternalLink
} from 'lucide-react';

interface AppointmentProps {
  onNavigateHome: () => void;
}

type ConsultType = 'online' | 'phone' | 'onsite';

export default function Appointment({ onNavigateHome }: AppointmentProps) {
  const [step, setStep] = useState<'type' | 'datetime' | 'details' | 'success'>('type');
  const [consultType, setConsultType] = useState<ConsultType>('online');
  
  // Custom interactive date state
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    topic: 'allgemeines',
    notes: '',
    terms: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // List of available days (representing business days in June 2026 starting from June 16/17)
  const availableDates = [
    { dayNum: 17, weekDay: 'Mittwoch', dateStr: '17. Juni 2026' },
    { dayNum: 18, weekDay: 'Donnerstag', dateStr: '18. Juni 2026' },
    { dayNum: 19, weekDay: 'Freitag', dateStr: '19. Juni 2026' },
    { dayNum: 22, weekDay: 'Montag', dateStr: '22. Juni 2026' },
    { dayNum: 23, weekDay: 'Dienstag', dateStr: '23. Juni 2026' },
    { dayNum: 24, weekDay: 'Mittwoch', dateStr: '24. Juni 2026' },
    { dayNum: 25, weekDay: 'Donnerstag', dateStr: '25. Juni 2026' },
    { dayNum: 26, weekDay: 'Freitag', dateStr: '26. Juni 2026' },
  ];

  // Daily hours slots
  const timeSlots = ['08:30 - 09:15', '10:00 - 10:45', '11:15 - 12:00', '14:00 - 14:45', '15:30 - 16:15', '16:45 - 17:30'];

  const handleTypeSelect = (type: ConsultType) => {
    setConsultType(type);
    setSelectedDay(null);
    setSelectedTime(null);
    setStep('datetime');
  };

  const handleNextToDetails = () => {
    if (selectedDay !== null && selectedTime !== null) {
      setStep('details');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setForm(prev => ({
      ...prev,
      [name]: val
    }));

    if (formErrors[name]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Bitte tragen Sie Ihren Namen ein.';
    if (!form.email.trim()) {
      errors.email = 'Bitte tragen Sie Ihre E-Mail-Adresse ein.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
    }
    if (!form.phone.trim()) errors.phone = 'Telefonnummer ist für Rückfragen erforderlich.';
    if (!form.terms) errors.terms = 'Sie müssen der Datenschutzerklärung zustimmen.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('success');
    }
  };

  const getSelectedDateObj = () => {
    return availableDates.find(d => d.dayNum === selectedDay);
  };

  const getConsultTypeLabel = () => {
    switch (consultType) {
      case 'online': return 'Microsoft Teams / Zoom (Virtuell)';
      case 'phone': return 'Telefonanruf (Klassisch)';
      case 'onsite': return 'Persönlich vor Ort (Zürich, Hardstrasse 4)';
    }
  };

  return (
    <section id="appointment-booking-page" className="py-12 bg-neutral-50/40 relative min-h-screen">
      {/* Dynamic Background decor */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#0A2342]/5 to-transparent pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Breadcrumb */}
        <div className="mb-10 text-left">
          <div className="flex items-center space-x-2 text-xs font-sans text-neutral-500 mb-4">
            <button onClick={onNavigateHome} className="hover:text-brand-blue cursor-pointer">Startseite</button>
            <span>/</span>
            <span className="text-brand-blue font-semibold">Erstgespräch buchen</span>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-[1px]" />
            <span className="font-sans text-[11px] text-brand-blue tracking-widest uppercase font-bold">
              KOSTENLOSE BERATUNG
            </span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tighter text-brand-blue">
            Ihr unverbindliches Erstgespräch buchen
          </h1>
          <p className="font-sans text-sm text-neutral-600 font-light mt-2 max-w-2xl">
            Wählen Sie in Echtzeit Ihren Wunschtermin. Dieses 30-minütige Orientierungsgespräch ist komplett gratis und dient dem gegenseitigen Kennenlernen und der ersten Bedarfsanalyse.
          </p>
        </div>

        {/* Step Progression Indicators */}
        {step !== 'success' && (
          <div className="grid grid-cols-3 gap-2 mb-10 select-none">
            <div className={`p-3 border-t-2 text-left transition-colors ${
              step === 'type' 
                ? 'border-brand-blue text-brand-blue' 
                : 'border-neutral-300 text-neutral-500'
            }`}>
              <div className="text-[10px] font-mono tracking-wider uppercase font-bold">SCHRITT 1</div>
              <div className="text-xs font-sans font-semibold mt-0.5">Beratungskanal</div>
            </div>
            <div className={`p-3 border-t-2 text-left transition-colors ${
              step === 'datetime' 
                ? 'border-brand-blue text-brand-blue' 
                : 'border-neutral-300 text-neutral-500'
            }`}>
              <div className="text-[10px] font-mono tracking-wider uppercase font-bold">SCHRITT 2</div>
              <div className="text-xs font-sans font-semibold mt-0.5">Terminauswahl</div>
            </div>
            <div className={`p-3 border-t-2 text-left transition-colors ${
              step === 'details' 
                ? 'border-brand-blue text-brand-blue' 
                : 'border-neutral-300 text-neutral-500'
            }`}>
              <div className="text-[10px] font-mono tracking-wider uppercase font-bold">SCHRITT 3</div>
              <div className="text-xs font-sans font-semibold mt-0.5">Ihre Angaben</div>
            </div>
          </div>
        )}

        {/* Main interactive window card */}
        <div className="bg-white border border-border-gray shadow-sm rounded-[2px] overflow-hidden">
          
          {/* STEP 1: CONSULT TYPE SELECT */}
          {step === 'type' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 sm:p-10"
              id="booking-step-type"
            >
              <h2 className="font-sans text-[18px] font-bold text-brand-blue mb-8 uppercase tracking-wider">
                1. Wie möchten Sie sich mit uns austauschen?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Online option */}
                <button
                  id="consult-type-online"
                  onClick={() => handleTypeSelect('online')}
                  className="flex flex-col items-center justify-between p-8 border border-border-gray hover:border-brand-blue bg-white hover:bg-neutral-50/50 transition-all cursor-pointer rounded-[2px] text-center group min-h-[220px]"
                >
                  <div className="p-4 bg-soft-gray rounded-[2px] group-hover:bg-brand-blue/5 text-brand-blue transition-colors">
                    <Video className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-brand-blue text-base mt-4">
                      Virtuelles Treffen
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-light mt-2 max-w-[180px]">
                      Bequem per Microsoft Teams oder Zoom. Link folgt automatisch.
                    </p>
                  </div>
                  <div className="flex items-center text-[11px] uppercase font-sans tracking-wider text-brand-blue font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Wählen</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </button>

                {/* Phone option */}
                <button
                  id="consult-type-phone"
                  onClick={() => handleTypeSelect('phone')}
                  className="flex flex-col items-center justify-between p-8 border border-border-gray hover:border-brand-blue bg-white hover:bg-neutral-50/50 transition-all cursor-pointer rounded-[2px] text-center group min-h-[220px]"
                >
                  <div className="p-4 bg-soft-gray rounded-[2px] group-hover:bg-brand-blue/5 text-brand-blue transition-colors">
                    <PhoneCall className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-brand-blue text-base mt-4">
                      Telefonanruf
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-light mt-2 max-w-[180px]">
                      Ein Berater ruft Sie zu der von Ihnen bestimmten Uhrzeit an.
                    </p>
                  </div>
                  <div className="flex items-center text-[11px] uppercase font-sans tracking-wider text-brand-blue font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Wählen</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </button>

                {/* Onsite option */}
                <button
                  id="consult-type-onsite"
                  onClick={() => handleTypeSelect('onsite')}
                  className="flex flex-col items-center justify-between p-8 border border-border-gray hover:border-brand-blue bg-white hover:bg-neutral-50/50 transition-all cursor-pointer rounded-[2px] text-center group min-h-[220px]"
                >
                  <div className="p-4 bg-soft-gray rounded-[2px] group-hover:bg-brand-blue/5 text-brand-blue transition-colors">
                    <MapPin className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-brand-blue text-base mt-4">
                      Persönlich vor Ort
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 font-light mt-2 max-w-[180px]">
                      Bei uns in der Kanzlei (Zürich, Hardstrasse 4, 8004 ZH).
                    </p>
                  </div>
                  <div className="flex items-center text-[11px] uppercase font-sans tracking-wider text-brand-blue font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Wählen</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </button>

              </div>
              
              <div className="mt-12 text-center text-xs text-neutral-500 font-sans font-light">
                Bevorzugen Sie eine spontane Abklärung? Rufen Sie uns direkt an unter:{' '}
                <a href="tel:+41765388004" className="text-brand-blue font-bold hover:underline">
                  +41 76 538 80 04
                </a>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DATE & TIME SELECT */}
          {step === 'datetime' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 sm:p-10"
              id="booking-step-datetime"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-gray">
                <button 
                  onClick={() => setStep('type')}
                  className="flex items-center space-x-1.5 text-xs font-sans uppercase font-bold text-neutral-500 hover:text-brand-blue cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kanal ändern</span>
                </button>
                <div className="text-xs text-neutral-500 font-sans font-light">
                  Kanal: <span className="font-semibold text-brand-blue">{getConsultTypeLabel()}</span>
                </div>
              </div>

              <h2 className="font-sans text-[18px] font-bold text-brand-blue mb-6 uppercase tracking-wider">
                2. Wann passt es Ihnen am besten?
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. Day picker list (8 cols) */}
                <div className="lg:col-span-7">
                  <span className="block text-xs font-sans font-bold tracking-wider text-brand-blue uppercase mb-3">
                    Datum Auswählen (Juni 2026)
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    {availableDates.map((date) => (
                      <button
                        key={date.dayNum}
                        onClick={() => { setSelectedDay(date.dayNum); setSelectedTime(null); }}
                        className={`p-3 text-left border rounded-[2px] transition-colors cursor-pointer ${
                          selectedDay === date.dayNum
                            ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold scale-[0.99]'
                            : 'border-border-gray hover:bg-soft-gray text-neutral-700'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-sans tracking-wide opacity-75">{date.weekDay}</div>
                        <div className="text-sm font-sans font-semibold mt-0.5">{date.dateStr}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Clock slots list (5 cols) */}
                <div className="lg:col-span-5">
                  <span className="block text-xs font-sans font-bold tracking-wider text-brand-blue uppercase mb-3">
                    Uhrzeit Auswählen
                  </span>

                  {selectedDay === null ? (
                    <div className="bg-soft-gray border border-border-gray/70 p-4 rounded-[2px] text-center text-xs text-neutral-500 font-light min-h-[160px] flex items-center justify-center">
                      Bitte wählen Sie zuerst links ein Wunschdatum aus.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[220px] pr-1">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-2.5 text-center text-xs border rounded-[1px] font-sans transition-colors cursor-pointer ${
                            selectedTime === slot
                              ? 'border-brand-blue bg-brand-blue text-white font-bold'
                              : 'border-border-gray hover:bg-soft-gray text-neutral-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Navigation button */}
              <div className="pt-8 mt-8 border-t border-border-gray flex justify-end">
                <button
                  id="booking-goto-details-button"
                  disabled={selectedDay === null || selectedTime === null}
                  onClick={handleNextToDetails}
                  className="px-8 py-3.5 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-neutral-300 text-white font-sans text-xs font-semibold tracking-widest uppercase rounded-[2px] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <span>Angaben eintragen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}

          {/* STEP 3: USER DETAILS FORM */}
          {step === 'details' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 sm:p-10"
              id="booking-step-details"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-gray">
                <button 
                  onClick={() => setStep('datetime')}
                  className="flex items-center space-x-1.5 text-xs font-sans uppercase font-bold text-neutral-500 hover:text-brand-blue cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kanal / Zeit anpassen</span>
                </button>
                <div className="text-xs text-neutral-500 font-sans font-light text-right">
                  Kanal: <span className="font-semibold text-brand-blue">{getConsultTypeLabel()}</span>
                  <br />
                  Termin: <span className="font-semibold text-brand-blue">{getSelectedDateObj()?.dateStr} um {selectedTime}</span>
                </div>
              </div>

              <h2 className="font-sans text-[18px] font-bold text-brand-blue mb-6 uppercase tracking-wider">
                3. Kontaktdaten hinterlassen
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div>
                    <label htmlFor="appointment-name" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                      Ihr Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="appointment-name"
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="z.B. Beat Müller"
                        className={`w-full pl-10 pr-4 py-3 bg-white border ${
                          formErrors.name ? 'border-red-500' : 'border-border-gray/90'
                        } focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue`}
                      />
                    </div>
                    {formErrors.name && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.name}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="appointment-email" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                      Ihre E-Mail *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="appointment-email"
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleInputChange}
                        placeholder="beat.mueller@beispiel.ch"
                        className={`w-full pl-10 pr-4 py-3 bg-white border ${
                          formErrors.email ? 'border-red-500' : 'border-border-gray/90'
                        } focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue`}
                      />
                    </div>
                    {formErrors.email && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.email}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone field */}
                  <div>
                    <label htmlFor="appointment-phone" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                      Mobil- / Telefonnummer *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <input
                        id="appointment-phone"
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleInputChange}
                        placeholder="z.B. +41 79 123 45 67"
                        className={`w-full pl-10 pr-4 py-3 bg-white border ${
                          formErrors.phone ? 'border-red-500' : 'border-border-gray/90'
                        } focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue`}
                      />
                    </div>
                    {formErrors.phone && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.phone}</span>
                    )}
                  </div>

                  {/* Company optional field */}
                  <div>
                    <label htmlFor="appointment-company" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                      Firma / Gewünschte Rechtsform (optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        id="appointment-company"
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleInputChange}
                        placeholder="z.B. Müller Consulting AG"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-border-gray/90 focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="appointment-topic" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                    Gewünschter Fachbereich
                  </label>
                  <select
                    id="appointment-topic"
                    name="topic"
                    value={form.topic}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-border-gray/90 focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue cursor-pointer"
                  >
                    <option value="steuererklaerung">Steuererklärung erstellen (NP/JP)</option>
                    <option value="buchhaltung">Buchführung & Mehrwertsteuer (OR)</option>
                    <option value="firmengruendung">Firmengründung / Kanzlei-Abwicklung</option>
                    <option value="allgemeines">Allgemeine betriebswirtschaftliche Fragen</option>
                  </select>
                </div>

                {/* Additional Note */}
                <div>
                  <label htmlFor="appointment-notes" className="block text-[11px] font-sans tracking-widest text-[#333333]/85 uppercase font-bold mb-2">
                    Kurze Notiz zu Ihrem Fall (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 pointer-events-none text-neutral-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <textarea
                      id="appointment-notes"
                      name="notes"
                      rows={3}
                      value={form.notes}
                      onChange={handleInputChange}
                      placeholder="Welche konkreten Fragen haben Sie oder welche Unterlagen liegen vor?"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-border-gray/90 focus:border-brand-blue focus:outline-none rounded-[2px] transition-colors text-xs font-sans text-brand-blue resize-y"
                    />
                  </div>
                </div>

                {/* Terms agreement */}
                <div className="pt-2">
                  <label className="flex items-start space-x-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={form.terms}
                      onChange={handleInputChange}
                      className="mt-0.5 accent-brand-blue w-4 h-4 rounded-[1px]"
                    />
                    <span className="text-[11px] text-neutral-500 font-sans leading-normal font-light">
                      Ich stimme zu, dass meine eingegebenen Daten zur Terminorganisation und Beantwortung meiner Anfrage verarbeitet werden. Die Daten unterliegen der strengen Schweizer Schweigepflicht. *
                    </span>
                  </label>
                  {formErrors.terms && (
                    <span className="text-xs text-red-500 mt-1 block">{formErrors.terms}</span>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="pt-6 border-t border-border-gray flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] text-neutral-500 font-sans font-light">
                    * Benötigte Pflichtfelder
                  </span>
                  <button
                    id="appointment-submit-button"
                    type="submit"
                    className="px-8 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-sans text-xs font-semibold tracking-widest uppercase rounded-[2px] transition-all flex items-center justify-center space-x-2 w-full sm:w-auto cursor-pointer shadow-sm"
                  >
                    <span>Erstgespräch fest buchen</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* SUCCESS SCREEN */}
          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-12 text-center"
              id="booking-step-success"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-blue mb-3">
                Termin erfolgreich reserviert!
              </h2>
              <p className="font-sans text-sm text-neutral-600 font-light max-w-lg mx-auto mb-8">
                Vielen Dank! Ihr Schweizer Treuhand-Erstgespräch wurde fest in unseren Kalender eingetragen. Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details.
              </p>

              {/* Consultation Details Card */}
              <div className="max-w-md mx-auto bg-neutral-50 border border-border-gray p-6 text-left rounded-[2px] mb-8 space-y-4">
                <div className="text-[10px] font-mono tracking-widest uppercase text-[#0A2342] font-bold border-b border-border-gray pb-2">
                  Zusammenfassung Ihrer Buchung
                </div>
                
                <div className="text-xs space-y-2.5 font-sans">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Berater:</span>
                    <span className="font-semibold text-brand-blue">Marc Müller / Treuhand-Präsident</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Kanal / Beratungstyp:</span>
                    <span className="font-semibold text-brand-blue">{getConsultTypeLabel()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Datum:</span>
                    <span className="font-semibold text-brand-blue">{getSelectedDateObj()?.dateStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Uhrzeit (Schweiz):</span>
                    <span className="font-semibold text-brand-blue">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between border-t border-border-gray/50 pt-2.5 mt-2.5">
                    <span className="text-neutral-500">Name Kunde:</span>
                    <span className="font-semibold text-neutral-800">{form.name}</span>
                  </div>
                  {form.company && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Unternehmung:</span>
                      <span className="font-semibold text-neutral-800">{form.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* What to prepare accordion / instructions box */}
              <div className="max-w-md mx-auto p-5 border border-amber-200 bg-amber-50/40 text-left rounded-[2px] mb-8">
                <h4 className="font-sans text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                  💡 Zur Vorbereitung nützlich:
                </h4>
                <p className="font-sans text-[11px] text-amber-800 leading-relaxed font-light">
                  Falls Sie bereits vorliegende Steuerrechnungen der Vorjahre, einen Firmenauszug oder Statuten-Entwürfe zur Hand haben, legen Sie diese gerne bereit. Das spart im Erstgespräch wertvolle Minuten!
                </p>
              </div>

              {/* Calendars export buttons placeholder */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-10">
                <button 
                  onClick={() => { setDownloadSuccess(true); setTimeout(() => setDownloadSuccess(false), 4000); }}
                  className="px-4 py-2 border border-border-gray text-[#333333] hover:text-brand-blue hover:bg-white text-xs font-sans uppercase tracking-[0.05em] font-semibold rounded-[2px] transition-all flex items-center space-x-1.5 cursor-pointer bg-neutral-50"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{downloadSuccess ? 'Termin exportiert!' : 'In Outlook exportieren'}</span>
                </button>
                <a 
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-border-gray text-[#333333] hover:text-brand-blue hover:bg-white text-xs font-sans uppercase tracking-[0.05em] font-semibold rounded-[2px] transition-all flex items-center space-x-1.5 cursor-pointer bg-neutral-50"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Kalender hinzufügen</span>
                </a>
              </div>

              <div className="pt-6 border-t border-border-gray">
                <button
                  onClick={onNavigateHome}
                  className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-sans text-xs font-semibold tracking-wider uppercase rounded-[2px] transition-all cursor-pointer"
                >
                  Zurück zur Startseite
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
