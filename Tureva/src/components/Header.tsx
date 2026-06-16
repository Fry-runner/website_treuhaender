import React, { useState } from 'react';
import { ActiveView, Language, TranslationDictionary } from '../types';
import { Menu, X, Globe } from 'lucide-react';
import TurevaLogo from './TurevaLogo';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary['nav'];
}

export default function Header({ activeView, setActiveView, lang, setLang, t }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exclude 'client-hub'
  const navItems: { id: ActiveView; label: string }[] = [
    { id: 'home', label: t.home },
    { id: 'about', label: t.about },
    { id: 'services', label: t.services },
    { id: 'contact', label: t.contact },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-brand-light-gray z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo - with premium neon green brand logo and clean text */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center space-x-3.5 cursor-pointer group"
          id="brand-logo-container"
        >
          <TurevaLogo size={32} color="#34FF18" className="transition-transform duration-300 group-hover:scale-105 shrink-0" />
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-display font-bold text-xl tracking-tight text-brand-graphite group-hover:text-brand-graphite transition-colors">TUREVA</span>
              <span className="font-sans font-light text-[11px] tracking-widest text-brand-mid-gray">TREUHAND AG</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" id="desktop-navigation">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-2 font-sans font-medium text-[14px] transition-colors duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-brand-graphite font-bold' 
                    : 'text-brand-mid-gray hover:text-brand-graphite'
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-graphite rounded-full transform transition-all duration-300" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Language Switcher and CTA (Desktop) */}
        <div className="hidden md:flex items-center space-x-6" id="language-and-cta">
          {/* Language selection toggles - soft rounded pill style */}
          <div className="flex items-center bg-gray-100 border border-brand-light-gray/60 rounded-full p-0.5">
            <button
              onClick={() => setLang('de')}
              className={`px-3 py-1 text-xs font-sans font-medium rounded-full transition-all duration-200 cursor-pointer ${
                lang === 'de'
                  ? 'bg-white text-brand-graphite shadow-xs font-bold'
                  : 'text-brand-mid-gray hover:text-brand-graphite'
              }`}
              id="lang-de-btn"
            >
              DE
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-xs font-sans font-medium rounded-full transition-all duration-200 cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-brand-graphite shadow-xs font-bold'
                  : 'text-brand-mid-gray hover:text-brand-graphite'
              }`}
              id="lang-en-btn"
            >
              EN
            </button>
          </div>

          <button 
            onClick={() => handleNavClick('contact')}
            className="bg-brand-green hover:bg-brand-green/85 text-brand-graphite border border-brand-green/10 font-sans font-semibold text-xs uppercase tracking-wider py-2.5 px-5 rounded-full transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer"
            id="header-cta-btn"
          >
            {lang === 'de' ? 'Anfrage' : 'Inquire'}
          </button>
        </div>

        {/* Mobile menu trigger button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
            className="flex items-center space-x-1 px-3 py-1.5 border border-brand-light-gray rounded-full text-xs font-mono text-brand-mid-gray cursor-pointer bg-gray-50 hover:bg-white"
            title="Toggle Language"
            id="mobile-lang-toggle"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang.toUpperCase()}</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-brand-graphite hover:text-brand-graphite p-1 cursor-pointer"
            aria-label="Toggle Menu"
            id="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-brand-light-gray w-full px-6 py-6 space-y-4 shadow-xl absolute top-20 left-0 transition-all duration-300 rounded-b-2xl" id="mobile-nav-panel">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left py-3 px-4 rounded-xl font-sans text-base font-semibold ${
                  activeView === item.id 
                    ? 'bg-brand-graphite text-white' 
                    : 'text-brand-mid-gray hover:bg-gray-50'
                }`}
                id={`mobile-nav-item-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-brand-light-gray flex items-center justify-between">
            <span className="text-xs text-brand-mid-gray font-mono">Tureva Treuhand AG</span>
            <button
              onClick={() => handleNavClick('contact')}
              className="bg-brand-green text-brand-graphite hover:bg-brand-green/90 text-xs font-sans font-bold uppercase tracking-wider py-2.5 px-6 rounded-full shadow-2xs transition-all duration-300 cursor-pointer"
              id="mobile-action-cta"
            >
              {lang === 'de' ? 'Beratung anfragen' : 'Request Consultation'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
