/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle2, ChevronRight, X, Briefcase } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  company: string;
  topic: string;
  createdAt: string;
}

export default function CalendlyWidget() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [topic, setTopic] = useState('Erstgespräch & Kennenlernen');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Generate the next 5 business dates dynamically starting from June 15, 2026
  const getNextBusinessDays = () => {
    const days = [];
    let startLocalDate = new Date(2026, 5, 15); // June 15, 2026 (Monday)
    
    while (days.length < 5) {
      const dayOfWeek = startLocalDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
        const dayString = startLocalDate.toLocaleDateString('de-CH', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
        });
        const fullDateString = startLocalDate.toLocaleDateString('de-CH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        days.push({
          display: dayString,
          value: fullDateString,
          raw: new Date(startLocalDate)
        });
      }
      startLocalDate.setDate(startLocalDate.getDate() + 1);
    }
    return days;
  };

  const businessDays = getNextBusinessDays();

  const timeSlots = [
    '09:00 - 09:15',
    '10:15 - 10:30',
    '11:00 - 11:15',
    '14:00 - 14:15',
    '15:30 - 15:45',
    '16:15 - 16:30'
  ];

  useEffect(() => {
    // Load booked appointments from LocalStorage
    const stored = localStorage.getItem('boost_appointments');
    if (stored) {
      try {
        setAppointments(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    
    // Set default selected date
    if (businessDays.length > 0) {
      setSelectedDate(businessDays[0].value);
    }
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substring(2, 9),
      date: selectedDate,
      time: selectedTime || timeSlots[0],
      name,
      email,
      company,
      topic,
      createdAt: new Date().toLocaleDateString('de-CH')
    };

    const updated = [newAppointment, ...appointments];
    setAppointments(updated);
    localStorage.setItem('boost_appointments', JSON.stringify(updated));

    setStep(3);
    setShowSuccessToast(true);
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter(app => app.id !== id);
    setAppointments(updated);
    localStorage.setItem('boost_appointments', JSON.stringify(updated));
  };

  const resetBookingForm = () => {
    setStep(1);
    setSelectedTime('');
    setName('');
    setEmail('');
    setCompany('');
    setTopic('Erstgespräch & Kennenlernen');
  };

  return (
    <div id="calendly-container" className="bg-white border border-brand-border p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left side: Assistant Info */}
        <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-brand-border pb-6 md:pb-0 md:pr-8 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-brand-platinum uppercase">
              15 Min. Kennenlernen
            </span>
            <h3 className="font-sans font-light text-2xl tracking-tight text-brand-navy">
              Kennenlerngespräch
            </h3>
            <p className="text-xs text-brand-platinum leading-relaxed font-sans">
              Ein unverbindliches Erstgespräch (15 Min.) via Microsoft Teams oder Telefon, um Ihre Anforderungen und Schnittstellen zu analysieren.
            </p>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-2 text-xs text-brand-navy">
                <Clock className="w-4 h-4 text-brand-platinum" />
                <span className="font-sans font-medium">15 Minuten</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-brand-navy">
                <Calendar className="w-4 h-4 text-brand-platinum" />
                <span className="font-sans font-medium">Online per Microsoft Teams</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-border">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-brand-navy text-white flex items-center justify-center font-bold text-xs uppercase rounded-full">
                ZH
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-navy leading-none">Zürich Partner Desk</p>
                <p className="text-[10px] text-brand-platinum mt-0.5">Boost Consulting Team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Interactive Scheduler Wizard */}
        <div className="md:w-2/3 flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h4 className="text-sm font-semibold tracking-wide text-brand-navy uppercase font-mono">
                Schritt 1: Datum & Uhrzeit wählen
              </h4>
              
              {/* Date slots */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-brand-platinum">Datum wählen</label>
                <div className="grid grid-cols-5 gap-2">
                  {businessDays.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => setSelectedDate(day.value)}
                      className={`py-3 px-1 border text-center transition-all flex flex-col items-center justify-center ${
                        selectedDate === day.value
                          ? 'border-brand-navy bg-brand-navy text-white'
                          : 'border-brand-border bg-white text-brand-navy hover:border-brand-navy'
                      }`}
                    >
                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-75">{day.display.split(',')[0]}</span>
                      <span className="text-sm font-sans font-bold mt-1">{day.display.split(',')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-brand-platinum">Verfügbare Uhrzeit am {selectedDate}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setSelectedTime(time);
                        setStep(2);
                      }}
                      className={`py-2.5 px-3 border text-center text-xs font-mono transition-all hover:bg-brand-gray ${
                        selectedTime === time
                          ? 'border-brand-navy bg-brand-navy text-white hover:bg-brand-navy'
                          : 'border-brand-border bg-white text-brand-navy hover:border-brand-navy'
                      }`}
                    >
                      {time.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-right pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedTime) {
                      setSelectedTime(timeSlots[0]);
                    }
                    setStep(2);
                  }}
                  className="inline-flex items-center space-x-2 border border-brand-navy text-brand-navy py-2 px-4 text-xs tracking-wider uppercase hover:bg-brand-navy hover:text-white transition-colors"
                >
                  <span>Mitarbeiter-Angaben eintragen</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleBookingSubmit} className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-semibold tracking-wide text-brand-navy uppercase font-mono">
                Schritt 2: Ihre Kontaktdaten
              </h4>

              <div className="p-3 bg-brand-gray border border-brand-border flex items-center justify-between text-xs font-mono">
                <span>Auswahl: {selectedDate} um {selectedTime || '09:00 - 09:15'}</span>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-brand-platinum hover:text-brand-navy underline"
                >
                  Ändern
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="calendar-name" className="text-xs text-brand-platinum font-sans font-medium">Name *</label>
                  <input
                    id="calendar-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ihr Vor- und Nachname"
                    className="w-full border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:border-brand-navy font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="calendar-email" className="text-xs text-brand-platinum font-sans font-medium">E-Mail-Adresse *</label>
                  <input
                    id="calendar-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@firma.ch"
                    className="w-full border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:border-brand-navy font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="calendar-company" className="text-xs text-brand-platinum font-sans font-medium">Kompagnie / Firma</label>
                  <input
                    id="calendar-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="z.B. Software AG"
                    className="w-full border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:border-brand-navy font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="calendar-topic" className="text-xs text-brand-platinum font-sans font-medium">Fokus / Thema</label>
                  <select
                    id="calendar-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full border border-brand-border bg-white p-2.5 text-xs text-brand-navy focus:outline-none focus:border-brand-navy font-sans"
                  >
                    <option value="Erstgespräch & Kennenlernen">Erstgespräch & Kennenlernen</option>
                    <option value="Accounting (Treuhand) auslagern">Accounting (Treuhand) auslagern</option>
                    <option value="HR & Payroll optimieren">HR & Payroll optimieren</option>
                    <option value="MWST- & Steuerberatung">MWST- & Steuerberatung</option>
                    <option value="B2B-Kooperationsanfrage">B2B-Kooperationsanfrage</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-mono text-xs uppercase tracking-wider text-brand-platinum hover:text-brand-navy py-2"
                >
                  Zurück
                </button>
                
                <button
                  type="submit"
                  className="bg-brand-navy text-white px-6 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-brand-navy/90 transition-all font-sans"
                >
                  Termin fest buchen
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-brand-navy text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-sans font-light text-2xl text-brand-navy tracking-tight">
                  Termin erfolgreich reserviert!
                </h3>
                <p className="text-xs text-brand-platinum max-w-md mx-auto leading-relaxed">
                  Ihr 15-minütiger Kennenlern-Call ist fest gebucht. Wir haben eine automatische Kalender-Einladung an <strong className="text-brand-navy font-medium">{email}</strong> versandt.
                </p>
              </div>

              <div className="p-4 bg-brand-gray border border-brand-border inline-block text-left text-xs font-mono space-y-1.5">
                <p><span className="text-brand-platinum">Datum:</span> {selectedDate}</p>
                <p><span className="text-brand-platinum">Zeit:</span> {selectedTime || '09:00 - 09:15'} (15 Min.)</p>
                <p><span className="text-brand-platinum">Teilnehmer:</span> {name} {company ? `(${company})` : ''}</p>
                <p><span className="text-brand-platinum">Thema:</span> {topic}</p>
              </div>

              <div>
                <button
                  onClick={resetBookingForm}
                  className="border border-brand-navy text-brand-navy px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-brand-navy hover:text-white transition-all font-sans"
                >
                  Anderen Termin buchen
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Booked Appointments section (Durable UX) */}
      {appointments.length > 0 && (
        <div className="mt-12 pt-8 border-t border-brand-border">
          <h4 className="text-xs uppercase tracking-widest text-brand-navy font-mono font-medium mb-4 flex items-center space-x-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Ihre gebuchten Besprechungen (In diesem Browser)</span>
          </h4>
          
          <div className="space-y-2.5">
            {appointments.map((app) => (
              <div 
                key={app.id} 
                className="p-4 border border-brand-border bg-brand-gray flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-brand-navy font-sans">{app.date}</span>
                    <span className="font-mono text-brand-platinum">|</span>
                    <span className="font-mono text-brand-navy font-medium">{app.time}</span>
                  </div>
                  <p className="text-brand-platinum font-sans">
                    {app.name} &bull; <span className="font-mono text-[11px]">{app.topic}</span>
                  </p>
                </div>
                
                <button
                  onClick={() => deleteAppointment(app.id)}
                  className="text-[10px] font-mono text-red-600 hover:underline flex items-center space-x-1"
                >
                  <X className="w-3 h-3" />
                  <span>Stornieren</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
