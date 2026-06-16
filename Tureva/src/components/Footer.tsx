import React from 'react';
import { ActiveView, Language, TranslationDictionary } from '../types';
import TurevaLines from './TurevaLines';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  lang: Language;
  t: TranslationDictionary;
}

export default function Footer({ setActiveView, lang, t }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-brand-light-gray mt-24 relative overflow-hidden" id="main-footer">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3 pb-1">
              <span className="font-display font-bold tracking-tight text-brand-graphite text-lg">TUREVA TREUHAND AG</span>
            </div>
            <p className="text-sm text-brand-mid-gray leading-relaxed max-w-sm">
              {lang === 'de' 
                ? 'Revision, Rechnungswesen und Steuerberatung. Seit 1982 führend in verlässlicher, international ausgerichteter Finanzbegleitung in Zürich.' 
                : 'Audit services, accounting, and tax consulting. Leading partner in reliable, internationally oriented financial stewardship in Zurich since 1982.'}
            </p>
            <div className="text-xs text-brand-mid-gray bg-gray-50 p-4 border border-brand-light-gray rounded-xl">
              <span className="font-semibold block text-brand-graphite mb-1">
                {lang === 'de' ? 'Sprachkompetenz:' : 'Language Capabilities:'}
              </span>
              {t.contact.sidebarLanguages}
            </div>
          </div>

          {/* Useful links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-brand-graphite uppercase">
              {lang === 'de' ? 'NAVIGIEREN' : 'NAVIGATION'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => handleLinkClick('home')} 
                  className="text-brand-mid-gray hover:text-brand-graphite transition-colors duration-150 cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('about')} 
                  className="text-brand-mid-gray hover:text-brand-graphite transition-colors duration-150 cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('services')} 
                  className="text-brand-mid-gray hover:text-brand-graphite transition-colors duration-150 cursor-pointer"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('contact')} 
                  className="text-brand-mid-gray hover:text-brand-graphite transition-colors duration-150 cursor-pointer"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Main Services shortcut links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-brand-graphite uppercase">
              {lang === 'de' ? 'KOMPETENZEN' : 'COMPETENCES'}
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-mid-gray">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-mid-gray rounded-full"></span>
                <span>{t.services.revision.title}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-mid-gray rounded-full"></span>
                <span>{t.services.accounting.title}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-mid-gray rounded-full"></span>
                <span>{t.services.taxes.title}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-mid-gray rounded-full"></span>
                <span>{t.services.other.title}</span>
              </li>
            </ul>
          </div>

          {/* Zurich Office Details */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-brand-graphite uppercase">
              CH-HEADQUARTERS
            </h4>
            <div className="text-sm text-brand-mid-gray space-y-2 leading-relaxed">
              <p className="whitespace-pre-line text-brand-graphite font-medium">
                {t.contact.sidebarAddress}
              </p>
              <p className="whitespace-pre-line text-xs font-mono pt-1">
                {t.contact.sidebarPhone}
              </p>
            </div>
            <div className="pt-2">
              <span className="text-[10px] bg-gray-50 border border-brand-light-gray text-brand-graphite px-2.5 py-1.5 font-mono uppercase tracking-wider rounded-lg font-semibold">
                RAB No: CH-100234
              </span>
            </div>
          </div>
        </div>

        {/* Tureva Lines Signature Footer Decor */}
        <TurevaLines variant="footer" count={3} />

        {/* Copyright, disclaimer, and credentials bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-brand-light-gray text-xs text-brand-mid-gray text-center md:text-left space-y-4 md:space-y-0">
          <div>
            &copy; {currentYear} Tureva Treuhand AG, Zürich. {lang === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
          </div>
          <div className="flex space-x-6">
            <a href="#privacy" onClick={(e) => {e.preventDefault(); alert(lang === 'de' ? 'Gemäss CH-Datenschutzgesetzen (DSG) sowie EU-DSGVO wird jeglicher Datentransfer auf dieser Premium-Vorschau streng lokal in Ihrem Browser gespeichert.' : 'According to Swiss Data Protection Act (FADP), all communication testing data is retained, sandbox-only, in your local storage.');}} className="hover:text-brand-graphite transition-colors duration-150">
              {lang === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
            </a>
            <span className="text-brand-light-gray">|</span>
            <a href="#terms" onClick={(e) => {e.preventDefault(); alert(lang === 'de' ? 'Tureva Treuhand AG ist im Handelsregister des Kantons Zürich eingetragen.' : 'Tureva Treuhand AG is registered in the Commercial Registry of the Canton of Zurich.');}} className="hover:text-brand-graphite transition-colors duration-150">
              {lang === 'de' ? 'Impressum' : 'Legal Terms'}
            </a>
            <span className="text-brand-light-gray">|</span>
            <span className="text-brand-graphite opacity-80 font-mono">
              since 1982
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
