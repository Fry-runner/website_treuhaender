import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LineMotif from './LineMotif';
import { ContactInquiry, OfferCategory } from '../types';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Navigation2, CalendarCheck2 } from 'lucide-react';

interface ContactProps {
  preselectedCategory?: OfferCategory;
  onSubmittedMessage?: () => void;
}

export default function Contact({ preselectedCategory = 'treuhand', onSubmittedMessage }: ContactProps) {
  const [formData, setFormData] = useState<ContactInquiry>({
    name: '',
    email: '',
    phone: '',
    category: preselectedCategory,
    message: '',
    preferredDate: '',
    preferredTime: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Swiss-formatted dates helper (current local date is June 2026, let's suggest close business days)
  const businessDays = [
    { label: 'Do, 18. Juni', val: '2026-06-18' },
    { label: 'Fr, 19. Juni', val: '2026-06-19' },
    { label: 'Mo, 22. Juni', val: '2026-06-22' },
    { label: 'Di, 23. Juni', val: '2026-06-23' },
    { label: 'Mi, 24. Juni', val: '2026-06-24' }
  ];

  const businessTimes = ['08:30', '10:00', '13:30', '15:00', '16:30'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate real server sync
    setTimeout(() => {
      setSubmitting(false);
      setBookingSuccess(true);
      if (onSubmittedMessage) {
        onSubmittedMessage();
      }
    }, 1200);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: 'treuhand',
      message: '',
      preferredDate: '',
      preferredTime: ''
    });
    setBookingSuccess(false);
  };

  return (
    <section className="bg-white py-16 md:py-24" id="kontakt-sektion">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Column: Contact Data and Swiss modern line map */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-violet font-black mb-3">
                PERSÖNLICHE BEGEGNUNG
              </p>
              <h2 className="font-display font-bold text-4xl text-brand-graphite tracking-tight mb-6">
                Sprechen wir über <br />
                Ihre Situation.
              </h2>
              <p className="font-sans text-brand-gray-medium text-lg leading-relaxed mb-8">
                Haben Sie Fragen zur Rechnungslegung, suchen Sie eine erfahrene Beratung für Ihre Unternehmensnachfolge oder möchten Sie Arbeitsabläufe nachhaltig restrukturieren? Nehmen Sie unverbindlich Kontakt auf.
              </p>

              {/* Direct Coordinate Details */}
              <div className="space-y-5 mb-10">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-brand-violet/[0.03] border border-brand-violet/15 text-brand-violet rounded-sm mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-xs text-brand-gray-medium uppercase tracking-wider">
                      Adresse
                    </h4>
                    <p className="font-sans text-sm text-brand-graphite font-medium mt-1">
                      Kanzlei Rotbuchstrasse 60
                    </p>
                    <p className="font-sans text-xs text-brand-gray-medium">
                      8037 Zürich-Wipkingen
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-brand-violet/[0.03] border border-brand-violet/15 text-brand-violet rounded-sm mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-xs text-brand-gray-medium uppercase tracking-wider">
                      Telefon
                    </h4>
                    <p className="font-sans text-sm text-brand-graphite font-medium mt-1">
                      <a href="tel:+41443653000" className="hover:text-brand-violet transition-colors">
                        +41 44 365 30 00
                      </a>
                    </p>
                    <p className="font-sans text-xs text-brand-gray-medium">
                      Mo–Fr: 08:00 – 12:00, 13:30 – 17:00 Uhr
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-brand-violet/[0.03] border border-brand-violet/15 text-brand-violet rounded-sm mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-xs text-brand-gray-medium uppercase tracking-wider">
                      E-Mail-Postfach
                    </h4>
                    <p className="font-sans text-sm text-brand-graphite font-medium mt-1">
                      <a href="mailto:office@quabba.ch" className="hover:text-brand-violet transition-colors">
                        office@quabba.ch
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Swiss Minimalist Line map of Zurich Rotbuchstrasse 60 (Section 2.6) */}
            <div className="border border-brand-gray-light p-6 rounded-[3px] bg-white relative">
              <p className="font-heading font-bold text-xs text-black mb-4">Lage Kanzlei</p>
              
              {/* SVG Vector map drawing */}
              <div className="w-full h-44 bg-brand-violet/[0.01] border border-dashed border-brand-gray-light rounded-sm relative overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full opacity-70">
                  {/* Street network bounds helper */}
                  {/* Rosengartenstrasse */}
                  <path d="M 40 0 C 40 40, 60 70, 70 150" stroke="#E9ECEC" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 40 0 C 40 40, 60 70, 70 150" stroke="#C5CDD2" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {/* Rotbuchstrasse */}
                  <path d="M 0 60 C 50 60, 150 75, 300 85" stroke="#E9ECEC" strokeWidth="14" strokeLinecap="round" />
                  <path d="M 0 60 C 50 60, 150 75, 300 85" stroke="var(--color-brand-violet)" strokeWidth="1.2" opacity="0.3" />
                  
                  {/* Nordstrasse */}
                  <path d="M 120 0 L 150 150" stroke="#E9ECEC" strokeWidth="8" />

                  {/* Schiffbaufreie Str & adjacent alignments */}
                  <path d="M 0 110 L 300 130" stroke="#E9ECEC" strokeWidth="6" />

                  {/* Bucheggplatz Marker Node */}
                  <circle cx="50" cy="50" r="16" fill="#FFFFFF" stroke="#E9ECEC" strokeWidth="1.5" />
                  <text x="36" y="53" fill="#7C868C" fontSize="6" fontFamily="sans-serif" fontWeight="bold">Buchegg</text>

                  {/* Limmat subtle flow curve on left edge */}
                  <path d="M 0 10 Q 30 15, 20 45 T 10 150" stroke="#E9ECEC" strokeWidth="5" />
                  
                  {/* Rotbuchstrasse 60 Target Pin Pulsing */}
                  <g className="cursor-pointer">
                    <circle cx="160" cy="76" r="6" fill="var(--color-brand-violet)" />
                    <circle cx="160" cy="76" r="2" fill="#FFFFFF" />
                  </g>

                  {/* Text Markers */}
                  <text x="145" y="62" fill="#22272B" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Rotbuchst. 60</text>
                  <text x="210" y="100" fill="#7C868C" fontSize="7" fontFamily="sans-serif">→ Wipkingerplatz</text>
                </svg>
                
                <span className="absolute bottom-3 left-3 font-mono text-[9px] text-[#7C868C]">
                  Zahnradbahn / Tram 11, Bus 33, 46
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form scheduler */}
          <div className="lg:col-span-7 bg-brand-violet/[0.01] border border-brand-gray-light p-6 md:p-10 rounded-[4px] relative">
            <AnimatePresence mode="wait">
              {!bookingSuccess ? (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-brand-gray-light pb-4 mb-6">
                    <h3 className="font-display font-medium text-lg text-brand-graphite">
                      Kontaktieren Sie uns direkt
                    </h3>
                    <p className="font-sans text-xs text-brand-gray-medium mt-1">
                      Wählen Sie optional einen Wunschtermin für ein kostenloses Erstgespräch.
                    </p>
                  </div>

                  {/* Two columns inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="form-name" className="block font-sans text-xs font-semibold text-brand-graphite uppercase tracking-wide mb-2">
                        Ihr Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="form-name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-brand-gray-light focus:border-brand-violet focus:ring-1 focus:ring-brand-violet px-3.5 py-2.5 text-xs text-brand-graphite font-sans rounded-none transition-all outline-none"
                        placeholder="z. B. Christian Müller"
                      />
                    </div>

                    <div>
                      <label htmlFor="form-category" className="block font-sans text-xs font-semibold text-brand-graphite uppercase tracking-wide mb-2">
                        Fachbereich *
                      </label>
                      <select
                        name="category"
                        id="form-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as OfferCategory })}
                        className="w-full bg-white border border-brand-gray-light focus:border-brand-violet focus:ring-1 focus:ring-brand-violet px-3 py-2.5 text-xs text-brand-graphite font-medium font-sans rounded-none transition-all outline-none"
                      >
                        <option value="treuhand">Säule 1: Treuhand</option>
                        <option value="beratung">Säule 2: Beratung & Nachfolge</option>
                        <option value="organisation">Säule 3: Organisation & Prozesse</option>
                        <option value="allgemein">Allgemeines Anliegen</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="form-email" className="block font-sans text-xs font-semibold text-brand-graphite uppercase tracking-wide mb-2">
                        E-Mail-Adresse *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="form-email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-brand-gray-light focus:border-brand-violet focus:ring-1 focus:ring-brand-violet px-3.5 py-2.5 text-xs text-brand-graphite font-sans rounded-none transition-all outline-none"
                        placeholder="ihrname@unternehmen.ch"
                      />
                    </div>

                    <div>
                      <label htmlFor="form-phone" className="block font-sans text-xs font-semibold text-brand-graphite uppercase tracking-wide mb-2">
                        Telefonnummer
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="form-phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-brand-gray-light focus:border-brand-violet focus:ring-1 focus:ring-brand-violet px-3.5 py-2.5 text-xs text-brand-graphite font-sans rounded-none transition-all outline-none"
                        placeholder="z. B. +41 44 123 45 67"
                      />
                    </div>
                  </div>

                  {/* Message container */}
                  <div>
                    <label htmlFor="form-message" className="block font-sans text-xs font-semibold text-brand-graphite uppercase tracking-wide mb-2">
                      Schildern Sie kurz Ihr Anliegen *
                    </label>
                    <textarea
                      name="message"
                      id="form-message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-brand-gray-light focus:border-brand-violet focus:ring-1 focus:ring-brand-violet px-3.5 py-2.5 text-xs text-brand-graphite font-sans rounded-none transition-all outline-none resize-none"
                      placeholder="Wie können wir Ihnen weiterhelfen?"
                    />
                  </div>

                  {/* Custom Appointment Scheduler Assistant */}
                  <div className="border border-brand-gray-light p-4 rounded-sm bg-white">
                    <div className="flex items-center gap-2 mb-3 text-brand-violet">
                      <Clock className="w-4 h-4" />
                      <span className="font-heading font-semibold text-xs uppercase tracking-widest">
                        Wunschdatum für Erstgespräch (Videocall / Kanzlei)
                      </span>
                    </div>

                    {/* Date select row */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                      {businessDays.map((day) => (
                        <button
                          key={day.val}
                          type="button"
                          id={`sched-day-${day.val}`}
                          onClick={() => setFormData({ ...formData, preferredDate: day.val })}
                          className={`py-2 text-center rounded-sm text-[10px] font-sans font-semibold border transition-all ${
                            formData.preferredDate === day.val
                              ? 'bg-brand-violet border-brand-violet text-white'
                              : 'bg-transparent border-brand-gray-light text-brand-graphite hover:border-brand-violet/50'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>

                    {/* Time select row */}
                    {formData.preferredDate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2 border-t border-brand-gray-light"
                      >
                        <p className="font-sans text-[10px] text-brand-gray-medium mb-2 font-medium">UHRZEIT AUSWÄHLEN:</p>
                        <div className="flex flex-wrap gap-2">
                          {businessTimes.map((time) => (
                            <button
                              key={time}
                              type="button"
                              id={`sched-time-${time}`}
                              onClick={() => setFormData({ ...formData, preferredTime: time })}
                              className={`px-3 py-1 text-center rounded-sm text-[10px] font-mono border transition-all ${
                                formData.preferredTime === time
                                  ? 'bg-brand-coral border-brand-coral text-white'
                                  : 'bg-transparent border-brand-gray-light text-brand-graphite hover:border-brand-coral/50'
                              }`}
                            >
                              {time} Uhr
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    id="contact-form-submit"
                    disabled={submitting}
                    className="w-full group flex items-center justify-center gap-2.5 bg-brand-coral border-[1.5px] border-brand-coral text-white py-4 rounded-[2px] text-sm font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer hover:opacity-90"
                  >
                    {submitting ? 'Anfrage wird übertragen...' : 'Anfrage absenden'}
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-16 px-4"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-violet/5 border border-brand-violet/25 flex items-center justify-center text-brand-violet mb-6">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  
                  <h3 className="font-display font-semibold text-2xl text-brand-graphite mb-2">
                    Vielen Dank für Ihr Vertrauen!
                  </h3>
                  <p className="font-sans text-brand-gray-medium text-sm leading-relaxed max-w-md mb-8">
                    Ihre Anfrage zur Säule <span className="text-brand-violet font-semibold capitalize">{formData.category}</span> wurde sicher übertragen. Laura Quabba wird sich in Kürze persönlich bei Ihnen melden.
                  </p>

                  {formData.preferredDate && formData.preferredTime && (
                    <div className="border border-brand-gray-light p-4 rounded-sm bg-white mb-8 text-left inline-flex items-center gap-3">
                      <CalendarCheck2 className="w-5 h-5 text-brand-coral flex-shrink-0" />
                      <div>
                        <p className="font-sans text-[11px] font-semibold text-brand-graphite uppercase leading-none">Reservierter Wunschtermin</p>
                        <p className="font-mono text-xs text-brand-gray-medium mt-1">
                          {formData.preferredDate} um {formData.preferredTime} Uhr (Zollrechtlich-geschützt)
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    id="contact-form-reset"
                    onClick={resetForm}
                    className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-violet border-b border-brand-violet pb-0.5 hover:text-brand-coral hover:border-brand-coral transition-colors"
                  >
                    Weitere Anfrage übermitteln
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>



      </div>
    </section>
  );
}
