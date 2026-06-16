import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Clock, Landmark, ShieldCheck, Check, Send } from 'lucide-react';
import { OFFICES } from '../data';

export default function KontaktSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'dch' as 'dch' | 'international' | 'other',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setIsSubmitted(true);

    // Clear form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'dch',
      message: ''
    });
  };

  return (
    <div className="space-y-16 py-12">
      
      {/* 1. Header Hero Panel */}
      <section className="max-w-4xl space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-grey font-medium">
          Direktkontakt
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-brand-anthracite leading-tight">
          Lassen Sie uns sprechen.
        </h2>
        <p className="font-sans text-brand-grey text-base md:text-lg font-light leading-relaxed max-w-3xl">
          Schildern Sie mir Ihr steuerliches Anliegen, ich melde mich persönlich bei Ihnen zurück. Ich freue mich auf die Zusammenarbeit.
        </p>
      </section>

      {/* 2. Locations Info Grid beside Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Adress block column */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Zürich Main Station */}
          <div className="p-6 bg-white border border-brand-beige rounded-sm space-y-4 hover:border-brand-red/30 transition-all duration-300">
            <div className="flex items-center gap-2 border-b border-brand-beige pb-3">
              <Landmark className="w-5 h-5 text-brand-grey" />
              <h3 className="font-display font-semibold text-brand-anthracite uppercase tracking-wide text-xs">
                {OFFICES.zuerich.name} (Zentralsitz)
              </h3>
            </div>
            <p className="font-sans text-sm text-brand-grey leading-relaxed font-light">
              {OFFICES.zuerich.address}
            </p>
            <div className="space-y-1.5 font-mono text-xs text-brand-grey">
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-grey shrink-0" />
                <a href={`tel:${OFFICES.zuerich.phone.replace(/[^+\d]/g, '')}`} className="hover:text-brand-anthracite transition-colors">
                  {OFFICES.zuerich.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-grey shrink-0" />
                <a href={`mailto:${OFFICES.zuerich.email}`} className="hover:text-brand-anthracite transition-colors">
                  {OFFICES.zuerich.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-grey shrink-0" />
                <span>{OFFICES.zuerich.hours}</span>
              </p>
            </div>
          </div>

          {/* Düsseldorf branch */}
          <div className="p-6 bg-white border border-brand-beige rounded-sm space-y-4 hover:border-brand-red/30 transition-all duration-300">
            <div className="flex items-center gap-2 border-b border-brand-beige pb-3">
              <Landmark className="w-5 h-5 text-brand-grey" />
              <h3 className="font-display font-semibold text-brand-anthracite uppercase tracking-wide text-xs">
                {OFFICES.duesseldorf.name}
              </h3>
            </div>
            <p className="font-sans text-sm text-brand-grey leading-relaxed font-light">
              {OFFICES.duesseldorf.address}
            </p>
            <div className="space-y-1.5 font-mono text-xs text-brand-grey">
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-grey shrink-0" />
                <a href={`tel:${OFFICES.duesseldorf.phone.replace(/[^+\d]/g, '')}`} className="hover:text-brand-anthracite transition-colors">
                  {OFFICES.duesseldorf.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-grey shrink-0" />
                <a href={`mailto:${OFFICES.duesseldorf.email}`} className="hover:text-brand-anthracite transition-colors">
                  {OFFICES.duesseldorf.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-grey shrink-0" />
                <span>{OFFICES.duesseldorf.hours}</span>
              </p>
            </div>
          </div>

          {/* Honorar notice */}
          <div className="p-5 border border-brand-beige rounded-sm bg-white hover:border-brand-red/20 transition-all duration-300 space-y-2">
            <div className="flex items-center gap-2.5 text-brand-grey">
              <ShieldCheck className="w-4.5 h-4.5" />
              <h4 className="font-display font-medium text-xs uppercase tracking-wider text-brand-anthracite">
                Verlässliche Honorarklarheit
              </h4>
            </div>
            <p className="font-sans text-xs text-brand-grey font-light leading-relaxed">
              Die Honorarberechnung erfolgt transparent nach der deutschen Steuerberatervergütungsverordnung (StBVV) bzw. auf Basis schriftlich vereinbarter, stundenspezifischer Honorare für Schweizer Beratungen. So behalten Sie von vornherein die Kostenkontrolle.
            </p>
          </div>

        </div>

        {/* Dynamic Contact Form column */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-brand-beige rounded-sm p-6 md:p-8">
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="border-b border-brand-beige pb-4 mb-4">
                    <h3 className="font-display font-medium text-lg text-brand-anthracite">
                      Beratungsanfrage senden
                    </h3>
                    <p className="font-sans text-xs text-brand-grey mt-0.5 font-light">
                      Bitte füllen Sie das Formular aus. Ich werde mich unverzüglich persönlich bei Ihnen melden.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-1">
                      <label className="block text-xs font-mono font-medium text-brand-anthracite uppercase tracking-wide">
                        Ihr Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="z.B. Sabine Müller"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-brand-beige rounded-sm bg-brand-offwhite text-sm font-sans focus:outline-none focus:border-brand-grey"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="block text-xs font-mono font-medium text-brand-anthracite uppercase tracking-wide">
                        E-Mail-Adresse *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ihre.mail@beispiel.de"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-brand-beige rounded-sm bg-brand-offwhite text-sm font-sans focus:outline-none focus:border-brand-grey"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-1">
                      <label className="block text-xs font-mono font-medium text-brand-anthracite uppercase tracking-wide">
                        Telefonnummer (optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="z.B. +49 170 1234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-brand-beige rounded-sm bg-brand-offwhite text-sm font-sans focus:outline-none focus:border-brand-grey"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="block text-xs font-mono font-medium text-brand-anthracite uppercase tracking-wide">
                        Thematisches Anliegen *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value as any })}
                        className="w-full px-4 py-3 border border-brand-beige rounded-sm bg-brand-offwhite text-sm font-sans focus:outline-none focus:border-brand-grey cursor-pointer"
                      >
                        <option value="dch">Steuerrecht Deutschland &ndash; Schweiz</option>
                        <option value="international">Internationales Steuerrecht</option>
                        <option value="other">Sonstige allgemeine Beratung</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-medium text-brand-anthracite uppercase tracking-wide">
                      Ihre Nachricht *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Bitte beschreiben Sie kurz Ihren Sachverhalt oder Ihr Anliegen..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-beige rounded-sm bg-brand-offwhite text-sm font-sans focus:outline-none focus:border-brand-grey resize-y"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-brand-anthracite text-white hover:bg-black active:scale-99 transition-all text-xs font-semibold uppercase tracking-widest rounded-sm cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <Send className="w-3.5 h-3.5 text-white shrink-0 group-hover:translate-x-1" />
                      <span>Beratungsanfrage senden</span>
                    </button>
                  </div>
                  
                  <p className="text-[11px] text-brand-grey text-center font-light leading-relaxed">
                    Mit dem Absenden erklären Sie sich einverstanden, dass Ihre Angaben zur Beantwortung dieser Anfrage gespeichert werden (siehe Datenschutzerklärung).
                  </p>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-sm bg-brand-red/5 border border-brand-red/20 flex items-center justify-center mx-auto text-brand-red">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display font-semibold text-2xl text-brand-anthracite">
                      Vielen Dank für Ihre Anfrage!
                    </h3>
                    <p className="font-sans text-sm text-brand-grey max-w-md mx-auto font-light leading-relaxed">
                      Ihre Nachricht wurde erfolgreich übermittelt. 
                      Als Kanzleiinhaber melde ich mich innerhalb von 24-48 Stunden persönlich bei Ihnen zurück.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-5 py-2.5 border border-brand-anthracite rounded-sm text-xs font-sans font-semibold uppercase tracking-widest hover:bg-brand-offwhite cursor-pointer transition-all"
                    >
                      Neue Anfrage stellen
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </section>
    </div>
  );
}
