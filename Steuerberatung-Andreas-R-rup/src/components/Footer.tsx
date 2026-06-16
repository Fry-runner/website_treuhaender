import React from 'react';
import { Mail, Phone, Clock, Landmark, Globe, ShieldCheck } from 'lucide-react';
import { OFFICES } from '../data';
import { Page } from '../types';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
  openModal: (type: 'impressum' | 'datenschutz') => void;
}

export default function Footer({ setCurrentPage, openModal }: FooterProps) {
  const handleSitemapClick = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-brand-anthracite pt-16 pb-12 border-t border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Connection Signature - Düsseldorf to Zürich */}
        <div className="border-b border-brand-beige pb-12 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-display text-2xl font-semibold tracking-tight text-brand-anthracite">
                Andreas Rürup
              </span>
              <p className="font-mono text-[10px] uppercase tracking-widest text-brand-grey mt-1">
                Zwei Länder. Eine Lösung. Seit 2013.
              </p>
            </div>
          </div>
        </div>

        {/* Core Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12 text-sm text-brand-grey">
          
          {/* Düsseldorf Coordinates */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-beige pb-2">
              <Landmark className="w-4 h-4 text-brand-grey" />
              <h4 className="font-display font-medium text-brand-anthracite tracking-wide uppercase text-xs">
                {OFFICES.duesseldorf.name}
              </h4>
            </div>
            <p className="font-sans leading-relaxed font-light text-brand-anthracite">
              {OFFICES.duesseldorf.address}
            </p>
            <div className="space-y-2 font-mono text-xs text-brand-grey">
              <a href={`tel:${OFFICES.duesseldorf.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2.5 hover:text-brand-anthracite transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand-grey" />
                <span>{OFFICES.duesseldorf.phone}</span>
              </a>
              <a href={`mailto:${OFFICES.duesseldorf.email}`} className="flex items-center gap-2.5 hover:text-brand-anthracite transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand-grey" />
                <span>{OFFICES.duesseldorf.email}</span>
              </a>
              <div className="flex items-center gap-2.5">
                <Clock className="w-3.5 h-3.5 text-brand-grey" />
                <span>{OFFICES.duesseldorf.hours}</span>
              </div>
            </div>
          </div>

          {/* Zürich Coordinates */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-beige pb-2">
              <Globe className="w-4 h-4 text-brand-grey" />
              <h4 className="font-display font-medium text-brand-anthracite tracking-wide uppercase text-xs">
                {OFFICES.zuerich.name}
              </h4>
            </div>
            <p className="font-sans leading-relaxed font-light text-brand-anthracite">
              {OFFICES.zuerich.address}
            </p>
            <div className="space-y-2 font-mono text-xs text-brand-grey">
              <a href={`tel:${OFFICES.zuerich.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2.5 hover:text-brand-anthracite transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand-grey" />
                <span>{OFFICES.zuerich.phone}</span>
              </a>
              <a href={`mailto:${OFFICES.zuerich.email}`} className="flex items-center gap-2.5 hover:text-brand-anthracite transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand-grey" />
                <span>{OFFICES.zuerich.email}</span>
              </a>
              <div className="flex items-center gap-2.5">
                <Clock className="w-3.5 h-3.5 text-brand-grey" />
                <span>{OFFICES.zuerich.hours}</span>
              </div>
            </div>
          </div>

          {/* Quick Sitemap */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display font-medium text-brand-anthracite tracking-wide uppercase text-xs border-b border-brand-beige pb-2">
              Sitemap
            </h4>
            <ul className="space-y-2.5 font-sans text-xs">
              <li>
                <button onClick={() => handleSitemapClick('home')} className="hover:text-brand-anthracite cursor-pointer transition-colors block text-left">
                  Startseite
                </button>
              </li>
              <li>
                <button onClick={() => handleSitemapClick('kanzlei')} className="hover:text-brand-anthracite cursor-pointer transition-colors block text-left">
                  Die Kanzlei
                </button>
              </li>
              <li>
                <button onClick={() => handleSitemapClick('ruerup')} className="hover:text-brand-anthracite cursor-pointer transition-colors block text-left">
                  Andreas Rürup
                </button>
              </li>
              <li>
                <button onClick={() => handleSitemapClick('steuerrecht')} className="hover:text-brand-anthracite cursor-pointer transition-colors block text-left">
                  Steuerrecht D-CH
                </button>
              </li>
              <li>
                <button onClick={() => handleSitemapClick('international')} className="hover:text-brand-anthracite cursor-pointer transition-colors block text-left">
                  Aussensteuerrecht
                </button>
              </li>
              <li>
                <button onClick={() => handleSitemapClick('kontakt')} className="hover:text-brand-anthracite cursor-pointer transition-colors block text-left">
                  Kontakt
                </button>
              </li>
            </ul>
          </div>

          {/* Trust / Regulatory */}
          <div className="lg:col-span-2 space-y-4 text-xs font-sans">
            <h4 className="font-display font-medium text-brand-anthracite tracking-wide uppercase text-xs border-b border-brand-beige pb-2">
              Akkreditierung
            </h4>
            <p className="text-[11px] text-brand-grey font-light leading-relaxed">
              Zugelassener Steuerberater bei der Steuerberaterkammer Düsseldorf. Mitglied des Treuhand-Verbands der Schweiz.
            </p>
            <div className="pt-2">
              <span className="inline-block px-2 py-1 rounded-sm bg-brand-beige/25 border border-brand-beige text-brand-grey font-mono text-[9px] uppercase tracking-tight">
                Fachberater f. Int. Steuerrecht
              </span>
            </div>
          </div>

        </div>

        {/* Imprint & privacy links */}
        <div className="pt-8 border-t border-brand-beige flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-grey font-light font-sans">
          <div>
            &copy; {new Date().getFullYear()} Steuerberatungskanzlei Andreas Rürup. Alle Rechte vorbehalten.
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => openModal('impressum')}
              className="hover:text-brand-anthracite cursor-pointer transition-colors text-left font-medium"
            >
              Impressum
            </button>
            <button
              onClick={() => openModal('datenschutz')}
              className="hover:text-brand-anthracite cursor-pointer transition-colors text-left font-medium"
            >
              Datenschutzerklärung
            </button>
            <span className="flex items-center gap-1 text-[11px] text-brand-grey">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-grey" />
              <span>D&amp;O Versichert</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
