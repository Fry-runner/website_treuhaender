import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle, RefreshCw } from 'lucide-react';
import { ContactInquiry } from '../types';
import { SERVICES } from '../data';

interface ContactFormProps {
  preselectedServiceId?: string;
}

export default function ContactForm({ preselectedServiceId }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: preselectedServiceId || 'analyse-beratung',
    message: '',
  });

  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  // Sync state if preselected changes from outside (e.g. Home, Quiz)
  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceType: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  // Load existing inquiries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('uds_contact_inquiries');
    if (stored) {
      try {
        setInquiries(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const randomID = `UDS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry: ContactInquiry = {
      id: randomID,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      serviceType: SERVICES.find((s) => s.id === formData.serviceType)?.title || formData.serviceType,
      message: formData.message,
      date: new Date().toLocaleDateString('de-CH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Empfangen',
    };

    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    localStorage.setItem('uds_contact_inquiries', JSON.stringify(updated));
    setLastSubmittedId(randomID);
    setShowSuccess(true);

    // Reset form fields
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: preselectedServiceId || 'analyse-beratung',
      message: '',
    });

    // Reset success banner after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 6000);
  };

  // Simulate process feedback update
  const handleSimulateUpdate = (id: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        const nextStatus = 
          inq.status === 'Empfangen' ? 'In Prüfung' : 
          inq.status === 'In Prüfung' ? 'Bereit für Erstgespräch' : 'Bereit für Erstgespräch';
        return { ...inq, status: nextStatus as any };
      }
      return inq;
    });
    setInquiries(updated);
    localStorage.setItem('uds_contact_inquiries', JSON.stringify(updated));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact-panel-section">
      
      {/* Contact Form Details (7 Columns) */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase">
              KONTAKTFORMULAR
            </span>
            <span className="h-[1px] w-8 bg-brand-border" />
          </div>

          <h3 className="font-display font-medium text-3xl tracking-tight text-brand-text">
            Sprechen wir über Ihre Situation.
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed max-w-xl">
            Ein erstes Gespräch ist unverbindlich und vertraulich. Wir nehmen uns die Zeit, Ihre betrieblichen Fragen zu verstehen. Senden Sie uns eine Kurzinformation – wir antworten in der Regel innerhalb von 24 Stunden.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 pt-2" id="form-contact-uds">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name input */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-mono text-brand-text/70 uppercase">
                  Name / Unternehmen *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="z. B. Juan Widmer, Muster AG"
                  className="w-full bg-brand-bg border border-brand-border hover:border-brand-text focus:border-brand-blue focus:outline-none px-4 py-3 text-sm text-brand-text rounded-none transition-colors"
                />
              </div>

              {/* Email input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-mono text-brand-text/70 uppercase">
                  E-Mail-Adresse *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="z. B. name@firma.ch"
                  className="w-full bg-brand-bg border border-brand-border hover:border-brand-text focus:border-brand-blue focus:outline-none px-4 py-3 text-sm text-brand-text rounded-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone input */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-xs font-mono text-brand-text/70 uppercase">
                  Telefonnummer (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="z. B. +41 44 123 45 67"
                  className="w-full bg-brand-bg border border-brand-border hover:border-brand-text focus:border-brand-blue focus:outline-none px-4 py-3 text-sm text-brand-text rounded-none transition-colors"
                />
              </div>

              {/* Dropdown with the 5 service areas */}
              <div className="space-y-1.5">
                <label htmlFor="serviceType" className="block text-xs font-mono text-brand-text/70 uppercase">
                  Anliegen / Themenbereich
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full bg-brand-bg border border-brand-border hover:border-brand-text focus:border-brand-blue focus:outline-none px-4 py-[13px] text-sm text-brand-text rounded-none appearance-none cursor-pointer transition-colors"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id} className="text-brand-text bg-brand-bg">
                      {s.number} · {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message payload */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="message" className="block text-xs font-mono text-brand-text/70 uppercase">
                  Ihre Nachricht *
                </label>
                <span className="text-[10px] text-brand-muted font-mono">
                  Zahlenbereite Klarheit schätzen wir sehr
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Kurze Schilderung Ihrer betriebswirtschaftlichen Situation..."
                className="w-full bg-brand-bg border border-brand-border hover:border-brand-text focus:border-brand-blue focus:outline-none px-4 py-3 text-sm text-brand-text rounded-none resize-none transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-brand-muted flex items-center gap-1.5 font-mono">
                <ShieldCheck size={14} className="text-brand-blue" />
                100% DSGVO & Schweizer Datenschutz
              </span>

              {/* The CTA button */}
              <button
                type="submit"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-brand-text hover:bg-brand-rose text-brand-text text-sm font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer rounded-none"
                id="btn-submit-uds"
              >
                <span>Nachricht senden</span>
                <Send size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Success Banner */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border border-green-200 bg-green-50/50 p-4 rounded-none flex items-start gap-3 mt-4"
                id="contact-submission-success-banner"
              >
                <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
                <div className="text-xs">
                  <p className="font-semibold text-green-900 font-display">Anfrage erfolgreich übermittelt</p>
                  <p className="text-green-800 leading-relaxed mt-0.5">
                    Ihre Anfrage mit der Referenznummer <strong className="font-mono">{lastSubmittedId}</strong> wurde lokal in Ihrem Mandantenbrowser gesichert. Wir haben Ihr Ticket empfangen.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic inquiry tracker list - keeps submissions durable and interactive */}
        {inquiries.length > 0 && (
          <div className="mt-12 pt-8 border-t border-brand-border/60">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-wider text-brand-muted uppercase font-semibold">
                IHRE BROWSERSITZUNGS-ANFRAGEN ({inquiries.length})
              </span>
              <span className="text-[9px] font-mono text-brand-muted">
                Klicken Sie auf Aktualisieren, um den Bearbeitungs-Status zu prüfen
              </span>
            </div>
            
            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              {inquiries.map((inq) => (
                <div key={inq.id} className="border border-brand-border/60 bg-brand-bg/50 p-3 flex items-center justify-between text-xs transition-all hover:border-brand-blue/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-text">{inq.id}</span>
                      <span className="text-[10px] text-brand-muted">{inq.date}</span>
                    </div>
                    <p className="text-[11px] text-brand-muted font-medium">
                      Thema: {inq.serviceType}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status badge */}
                    <span className={`px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase font-semibold ${
                      inq.status === 'Empfangen' ? 'bg-orange-100 text-orange-800' :
                      inq.status === 'In Prüfung' ? 'bg-brand-blue/10 text-brand-blue' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {inq.status}
                    </span>

                    {/* Simulate update progression */}
                    {inq.status !== 'Bereit für Erstgespräch' && (
                      <button
                        onClick={() => handleSimulateUpdate(inq.id)}
                        className="p-1.5 border border-brand-border/60 hover:border-brand-blue hover:text-brand-blue transition-colors cursor-pointer"
                        title="Status-Wechsel simulieren"
                        id={`btn-update-status-${inq.id}`}
                      >
                        <RefreshCw size={11} className="hover:rotate-180 transition-transform duration-300" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Direct Contact details & Custom Map (5 Columns) */}
      <div className="lg:col-span-5 space-y-8 lg:pl-6" id="contact-details-box">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase">
              STRATEGIEBÜRO ZÜRICH
            </span>
            <span className="h-[1px] w-8 bg-brand-border" />
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-medium text-lg text-brand-text">
              unter dem strich AG
            </h4>
            
            <div className="space-y-4 text-sm text-brand-text/90 font-sans">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="text-brand-blue mt-0.5 shrink-0" />
                <span>
                  Limmatstrasse 291<br />
                  CH-8005 Zürich<br />
                  <span className="text-[11px] text-brand-muted">(Nähe Escher-Wyss-Platz)</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={17} className="text-brand-blue shrink-0" />
                <a href="tel:+41442910000" className="hover:text-brand-blue transition-colors">
                  +41 44 291 00 00
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={17} className="text-brand-blue shrink-0" />
                <a href="mailto:info@unterdemstrich.ch" className="hover:text-brand-blue transition-colors font-semibold">
                  info@unterdemstrich.ch
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={17} className="text-brand-blue shrink-0" />
                <span className="text-xs text-brand-muted">
                  Mo – Fr: 08:30 – 12:00, 13:30 – 17:30 Uhr
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Handcrafted Line-art Minimalist Zürich Map */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] text-brand-muted uppercase block mb-1">
            Lageplan & Strassennetz (Minimal-Ansicht)
          </span>

          <div className="h-60 w-full border border-brand-border bg-brand-bg/40 relative px-4 py-4 rounded-none overflow-hidden" id="custom-line-map">
            {/* Background design elements representing Zurich Lake and River Limmat outline */}
            <svg viewBox="0 0 400 240" className="w-full h-full text-brand-border overflow-visible">
              {/* River Limmat representation represented by soft clean blue stroke */}
              <path
                d="M -50,60 C 100,55 180,90 280,180 C 310,210 350,260 380,290"
                fill="none"
                stroke="#2C3E91"
                strokeWidth="16"
                strokeOpacity="0.08"
              />
              <path
                d="M -50,60 C 100,55 180,90 280,180 C 310,210 350,260 380,290"
                fill="none"
                stroke="#2C3E91"
                strokeWidth="2"
                strokeOpacity="0.25"
              />

              {/* Grid background lines */}
              <line x1="50" y1="0" x2="50" y2="240" stroke="#E7E4DD" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="150" y1="0" x2="150" y2="240" stroke="#E7E4DD" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="250" y1="0" x2="250" y2="240" stroke="#E7E4DD" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="350" y1="0" x2="350" y2="240" stroke="#E7E4DD" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#E7E4DD" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="0" y1="160" x2="400" y2="160" stroke="#E7E4DD" strokeWidth="1" strokeOpacity="0.3" />

              {/* Streets network (geometric, thin lines) */}
              {/* Limmatstrasse (diagonal key street) */}
              <line x1="-20" y1="120" x2="420" y2="100" stroke="#8A8782" strokeWidth="2.5" strokeOpacity="0.6" />
              <text x="30" y="132" fill="#8A8782" className="text-[8px] font-mono uppercase tracking-widest fill-current">
                Limmatstrasse
              </text>

              {/* Sihlquai */}
              <line x1="-20" y1="82" x2="420" y2="60" stroke="#8A8782" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="320" y="73" fill="#8A8782" className="text-[7px] font-mono uppercase fill-current">
                Sihlquai
              </text>

              {/* Heinrichstrasse */}
              <line x1="-20" y1="155" x2="420" y2="135" stroke="#8A8782" strokeWidth="1.2" strokeOpacity="0.3" />

              {/* Escher-Wyss-Platz (Cross road) */}
              <line x1="120" y1="-20" x2="160" y2="260" stroke="#8A8782" strokeWidth="2.5" strokeOpacity="0.5" />
              <text x="145" y="40" fill="#8A8782" className="text-[7px] font-mono tracking-wider rotate-85 fill-current">
                Escher-Wyss-Platz
              </text>

              {/* Viadukt-Bogen bridge lines */}
              <path
                d="M 280,-20 L 250,260"
                fill="none"
                stroke="#1C1C1A"
                strokeWidth="3.5"
                strokeDasharray="4,3"
                strokeOpacity="0.25"
              />
              <text x="260" y="210" fill="#8A8782" className="text-[7px] font-mono tracking-wider fill-current">
                Viadukt
              </text>

              {/* Office Location - Limmatstrasse 291 */}
              {/* Pulse highlight */}
              <circle cx="138" cy="113" r="14" fill="#2C3E91" fillOpacity="0.07" className="animate-pulse" />
              <circle cx="138" cy="113" r="7" fill="#E3A39B" fillOpacity="0.4" />
              <circle cx="138" cy="113" r="3.5" fill="#2C3E91" />

              {/* Highlight Label */}
              <rect x="148" y="93" width="138" height="28" fill="#FAF9F6" stroke="#2C3E91" strokeWidth="1" rx="1" />
              <text x="154" y="104" fill="#1C1C1A" className="text-[8px] font-display font-bold">
                unter dem strich AG
              </text>
              <text x="154" y="115" fill="#8A8782" className="text-[7px] font-mono">
                Limmatstrasse 291, 8005 ZH
              </text>
            </svg>

            {/* Micro navigation hint */}
            <div className="absolute bottom-2 right-2 bg-brand-bg border border-brand-border px-2 py-0.5 text-[8px] font-mono text-brand-muted">
              CH-8005 ZÜRICH
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
