import React, { useState, useEffect } from 'react';
import { ActiveView, Language, TranslationDictionary, ContactInquiry } from '../types';
import TurevaLines from './TurevaLines';
import { AlertCircle, CheckCircle2, Mail, Phone, MapPin, Globe, Loader2, ClipboardCheck, Trash2 } from 'lucide-react';

interface ContactViewProps {
  predefinedMessage: string;
  setPredefinedMessage: (msg: string) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  transferEstimate?: number;
  lang: Language;
  t: TranslationDictionary;
}

export default function ContactView({
  predefinedMessage,
  setPredefinedMessage,
  selectedService,
  setSelectedService,
  transferEstimate,
  lang,
  t,
}: ContactViewProps) {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(selectedService || t.services.accounting.title);
  const [message, setMessage] = useState(predefinedMessage || '');
  const [newsletter, setNewsletter] = useState(true);

  // Status handlers
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [localInquiries, setLocalInquiries] = useState<ContactInquiry[]>([]);

  // Sync service changes from parent pre-populated props
  useEffect(() => {
    if (selectedService) {
      setService(selectedService);
    }
  }, [selectedService]);

  // Sync message prefill changes
  useEffect(() => {
    if (predefinedMessage) {
      setMessage(predefinedMessage);
    }
  }, [predefinedMessage]);

  // Load saved inquiries
  useEffect(() => {
    const saved = localStorage.getItem('tureva_inquiries');
    if (saved) {
      try {
        setLocalInquiries(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleClearInquiries = () => {
    localStorage.removeItem('tureva_inquiries');
    setLocalInquiries([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Basic verification
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg(lang === 'de' ? 'Bitte füllen Sie alle Pflichtfelder aus (Name, E-Mail und Anliegen).' : 'Please fill in all required fields (Name, Email and message).');
      return;
    }

    setIsSubmitting(true);

    // Simulate fiduciary parsing connection latency
    setTimeout(() => {
      const newInquiry: ContactInquiry = {
        id: 'T-' + Math.floor(100000 + Math.random() * 900000),
        name,
        email,
        phone,
        service,
        message,
        timestamp: new Date().toLocaleDateString(lang === 'de' ? 'de-CH' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Received',
        estimateMonthly: transferEstimate || undefined,
      };

      const updated = [newInquiry, ...localInquiries];
      setLocalInquiries(updated);
      localStorage.setItem('tureva_inquiries', JSON.stringify(updated));

      // Reset fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setPredefinedMessage('');
      setSelectedService('');
      setSuccess(true);
      setIsSubmitting(false);

      // Fade-out success message after 6 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 8000);
    }, 1200);
  };

  return (
    <div className="space-y-16 py-12" id="contact-view-container">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 relative" id="contact-hero">
        <div className="space-y-4 max-w-3xl">
          <h1 className="font-display font-medium text-4xl sm:text-5xl text-brand-graphite tracking-tight">
            {t.contact.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-brand-mid-gray leading-relaxed font-light">
            {t.contact.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Main Grid: Form Left, Sidebar Right */}
      <section className="max-w-7xl mx-auto px-6" id="contact-form-section">
        <TurevaLines count={2} className="mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Inquiry Form container (Left 7 Columns) */}
          <div className="lg:col-span-7 bg-white border border-brand-light-gray p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
            
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm flex items-start space-x-3 rounded-xl animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold">{t.contact.formSuccessTitle}</h4>
                  <p className="font-light text-emerald-900 leading-relaxed">{t.contact.formSuccessText}</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-150 text-red-950 text-xs flex items-center space-x-2 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="form-input-name" className="text-xs font-mono font-bold uppercase text-brand-graphite block">
                    {t.contact.formName} <span className="text-red-500 font-sans font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    id="form-input-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z.B. Müller AG"
                    className="w-full bg-gray-50 border border-brand-light-gray h-11 px-4 text-sm rounded-xl focus:bg-white focus:border-brand-mid-gray focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="form-input-email" className="text-xs font-mono font-bold uppercase text-brand-graphite block">
                    {t.contact.formEmail} <span className="text-red-500 font-sans font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    id="form-input-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.ch"
                    className="w-full bg-gray-50 border border-brand-light-gray h-11 px-4 text-sm rounded-xl focus:bg-white focus:border-brand-mid-gray focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone & Service selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="form-input-phone" className="text-xs font-mono font-bold uppercase text-brand-graphite block">
                    {t.contact.formPhone}
                  </label>
                  <input
                    type="text"
                    id="form-input-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+41 44 000 00 00"
                    className="w-full bg-gray-50 border border-brand-light-gray h-11 px-4 text-sm rounded-xl focus:bg-white focus:border-brand-mid-gray focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="form-input-service" className="text-xs font-mono font-bold uppercase text-brand-graphite block">
                    {t.contact.formService}
                  </label>
                  <select
                    id="form-input-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-gray-50 border border-brand-light-gray h-11 px-4 text-sm rounded-xl focus:bg-white focus:border-brand-mid-gray focus:outline-none cursor-pointer transition-colors"
                  >
                    <option value={t.services.revision.title}>{t.services.revision.title}</option>
                    <option value={t.services.accounting.title}>{t.services.accounting.title}</option>
                    <option value={t.services.taxes.title}>{t.services.taxes.title}</option>
                    <option value={t.services.other.title}>{t.services.other.title}</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Message Textbox */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="form-input-msg" className="text-xs font-mono font-bold uppercase text-brand-graphite block">
                    {t.contact.formMessage} <span className="text-red-500 font-sans font-bold">*</span>
                  </label>
                  {transferEstimate && transferEstimate > 0 && (
                    <span className="text-[10px] bg-brand-graphite text-white px-2 py-0.5 font-sans rounded-full font-semibold">
                      BUDGET ESTIMATE: CHF {transferEstimate}
                    </span>
                  )}
                </div>
                <textarea
                  id="form-input-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contact.formPlaceholderMessage}
                  className="w-full bg-gray-50 border border-brand-light-gray h-36 p-4 text-sm rounded-xl focus:bg-white focus:border-brand-mid-gray focus:outline-none transition-colors resize-y leading-relaxed"
                  required
                />
              </div>

              {/* Row 4: Newsletter Consent */}
              <div className="flex items-start space-x-3 select-none py-1">
                <input
                  type="checkbox"
                  id="form-checkbox-newsletter"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-brand-graphite cursor-pointer rounded-sm"
                />
                <label htmlFor="form-checkbox-newsletter" className="text-xs text-brand-mid-gray leading-tight cursor-pointer">
                  {t.contact.formNewsletter}
                </label>
              </div>

              {/* Submit CTA - redesigned with soft green & rounded-full */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="cta-btn-interactive w-full bg-brand-green/10 hover:bg-brand-green text-brand-graphite/70 hover:text-brand-graphite border border-brand-green/20 hover:border-transparent h-12 text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 rounded-full flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-xs hover:shadow-md"
                id="form-submit-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-brand-graphite" />
                    <span>{lang === 'de' ? 'Übermittle Mandatsdaten...' : 'Submitting mandate...'}</span>
                  </>
                ) : (
                  <span>{t.contact.formSubmit}</span>
                )}
              </button>

            </form>
          </div>

          {/* Zurich Office Directory Details Sidebar (Right 5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-brand-light-gray p-6 sm:p-8 space-y-6 rounded-2xl bg-gray-50/50">
              <h3 className="font-display font-medium text-lg text-brand-graphite border-b border-brand-light-gray pb-3 uppercase tracking-tight">
                {t.contact.sidebarTitle}
              </h3>

              <div className="space-y-4 text-sm text-brand-graphite leading-relaxed">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-brand-mid-gray mt-0.5 shrink-0" />
                  <p className="whitespace-pre-line font-medium text-brand-graphite">
                    {t.contact.sidebarAddress}
                  </p>
                </div>

                <div className="flex items-start space-x-3.5 pt-2 border-t border-dashed border-brand-light-gray">
                  <Phone className="w-5 h-5 text-brand-mid-gray mt-0.5 shrink-0" />
                  <p className="whitespace-pre-line font-mono text-xs">
                    {t.contact.sidebarPhone}
                  </p>
                </div>

                <div className="flex items-start space-x-3.5 pt-2 border-t border-dashed border-brand-light-gray">
                  <Globe className="w-5 h-5 text-brand-mid-gray mt-0.5 shrink-0" />
                  <p className="text-xs text-[#76828C]">
                    {t.contact.sidebarLanguages}
                  </p>
                </div>
              </div>

              {/* Swiss regulatory info card */}
              <div className="bg-white p-4 border border-brand-light-gray text-xs text-brand-mid-gray space-y-1.5 rounded-xl">
                <p className="font-bold text-brand-graphite">CH Registry Identifiers</p>
                <div className="font-mono text-[10px] space-y-0.5 pt-1">
                  <p>UID: CHE-108.309.122 MWST</p>
                  <p>CHID: CH-020.3.910.123-4</p>
                </div>
                <p className="text-[10px] text-brand-mid-gray font-semibold pt-1 uppercase">
                  ✓ Member of Fiduciary Swiss (Treuhand|Suisse)
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
