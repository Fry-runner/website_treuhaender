/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);

  useEffect(() => {
    // Load existing messages
    const stored = localStorage.getItem('boost_contact_messages');
    if (stored) {
      try {
        setSubmissions(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setStatus('error');
      return;
    }

    const newSub: ContactSubmission = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      company,
      email,
      phone,
      message,
      createdAt: new Date().toLocaleDateString('de-CH') + ' ' + new Date().toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newSub, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('boost_contact_messages', JSON.stringify(updated));

    setStatus('success');
    
    // Clear fields
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const deleteSubmission = (id: string) => {
    const updated = submissions.filter(s => s.id !== id);
    setSubmissions(updated);
    localStorage.setItem('boost_contact_messages', JSON.stringify(updated));
  };

  return (
    <div id="contact-form-container" className="bg-white border text-left border-brand-border p-6 md:p-8 rounded-xl shadow-sm">
      {status === 'success' && (
        <div className="mb-6 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg flex items-start space-x-3 text-xs animate-fade-in text-[#1E40AF]">
          <CheckCircle2 className="w-5 h-5 text-brand-accent-blue shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-sans font-semibold">Anfrage erfolgreich übermittelt!</p>
            <p className="font-sans">Vielen Dank für Ihr Vertrauen. Ein Partner der Boost Consulting wird sich binnen 24 Stunden per E-Mail oder Telefon bei Ihnen melden.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="text-xs text-[#475569] font-sans font-medium">Name *</label>
            <input
              id="contact-name"
              type="text"
              required
              placeholder="Vor- & Nachname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded font-sans"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-company" className="text-xs text-[#475569] font-sans font-medium">Unternehmen</label>
            <input
              id="contact-company"
              type="text"
              placeholder="Firma GmbH"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="text-xs text-[#475569] font-sans font-medium">E-Mail-Adresse *</label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="ihre@firma.ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded font-sans"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-phone" className="text-xs text-[#475569] font-sans font-medium">Telefonnummer</label>
            <input
              id="contact-phone"
              type="tel"
              placeholder="+41 44 ..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded font-sans"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="text-xs text-[#475569] font-sans font-medium">Nachricht / Anliegen</label>
          <textarea
            id="contact-message"
            rows={4}
            placeholder="Beschreiben Sie kurz Ihr Anliegen oder Ihre aktuelle administrative Herausforderung..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-accent-blue focus:ring-1 focus:ring-brand-accent-blue rounded font-sans"
          />
        </div>

        <div className="pt-2 text-right">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-brand-navy text-white px-6 py-3 text-xs uppercase tracking-widest font-mono font-medium hover:bg-brand-accent-blue transition-all cursor-pointer rounded shadow-sm"
          >
            <span>Anfrage senden</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>

      {/* Submitted Enquiries (Durable local testing flow) */}
      {submissions.length > 0 && (
        <div className="mt-12 pt-8 border-t border-brand-border">
          <h4 className="text-xs uppercase tracking-widest text-[#2563EB] font-mono font-semibold mb-4 flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Kürzliche Anfragen (Lokal gespeichert)</span>
          </h4>
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4 border border-brand-border bg-brand-gray text-xs space-y-2 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-navy font-sans">{sub.name}</span>
                    {sub.company && <span className="text-[#64748B] font-sans font-normal"> ({sub.company})</span>}
                  </div>
                  <span className="font-mono text-[#64748B] text-[10px]">{sub.createdAt}</span>
                </div>
                
                <div className="space-y-1 text-brand-navy font-sans">
                  <p className="font-mono text-[10.5px]">
                    <span className="text-[#64748B]">E-Mail:</span> {sub.email} {sub.phone && `| Tel: ${sub.phone}`}
                  </p>
                  {sub.message && (
                    <p className="font-sans text-[#475569] bg-white p-2.5 border border-brand-border mt-1 rounded">
                      &quot;{sub.message}&quot;
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <button
                    onClick={() => deleteSubmission(sub.id)}
                    className="text-red-500 font-mono text-[10px] hover:underline inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Löschen</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
