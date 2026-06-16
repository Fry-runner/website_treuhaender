/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Header({ onNavigate, activeSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Startseite' },
    { id: 'about', label: 'Über uns' },
    { id: 'services', label: 'Dienstleistungen' },
    { id: 'contact', label: 'Kontakt' },
  ];

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    onNavigate(id);
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[100px] flex items-center ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md border-b border-border-gray'
          : 'bg-white border-b border-border-gray/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex items-center justify-between">
        {/* Logo / Branding */}
        <button
          id="logo-brand-button"
          onClick={() => handleLinkClick('home')}
          className="flex items-center text-left group cursor-pointer space-x-3.5"
        >
          {/* Highly authentic SVG reproduction of the Züri Treuhand AG shield logo */}
          <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
            <svg className="w-full h-full text-brand-blue" viewBox="0 0 200 200" fill="none">
              {/* Solid Outer Shield filled with Brand Blue */}
              <path d="M 20,16 L 180,16 C 180,16 181,114 100,184 C 19,114 20,16 20,16 Z" fill="#084687" stroke="#084687" strokeWidth="2" strokeLinejoin="round" />
              
              {/* Inner White Frame Border (follows the shield edge perfectly) */}
              <path d="M 27,22 L 173,22 C 173,22 173,110 100,174 C 27,110 27,22 27,22 Z" fill="none" stroke="white" strokeWidth="4" />

              {/* White book/crest piece container in the upper half */}
              <path d="M 36,62 
                       C 36,62 48,73 100,73 
                       C 152,73 164,62 164,62 
                       C 168,82 158,112 148,119 
                       C 126,134 100,119 100,119 
                       C 100,119 74,134 52,119 
                       C 42,112 32,82 36,62 Z" 
                    fill="white" />
              
              {/* Left and Right Book page outer decorative curls/wings */}
              <path d="M 36,62 C 32,82 45,110 52,119 Z" fill="white" />
              <path d="M 164,62 C 168,82 155,110 148,119 Z" fill="white" />

              {/* Symmetrical page dividing details or bookmarks inside the white book */}
              <path d="M 46,65 C 50,78 52,85 54,115" fill="none" stroke="#084687" strokeWidth="2" opacity="0.8" />
              <path d="M 154,65 C 150,78 148,85 146,115" fill="none" stroke="#084687" strokeWidth="2" opacity="0.8" />

              {/* The peaks/columns (bar charts representing stability/growth) sitting on the booklet */}
              <rect x="80" y="65" width="17" height="15" fill="#084687" />
              <rect x="101" y="53" width="17" height="27" fill="#084687" />

              {/* "ZÜRI" Main Horizontal Banner (Solid Blue block across the white booklet) */}
              <rect x="58" y="80" width="84" height="34" fill="#084687" />
              <text x="100" y="106" fill="white" fontFamily="'Space Grotesk', system-ui, sans-serif" fontSize="21" fontWeight="900" textAnchor="middle" letterSpacing="0.5">ZÜRI</text>

              {/* TREUHAND AG text in the lower blue shield section, matching the font hierarchy */}
              <text x="100" y="145" fill="white" fontFamily="'Inter', system-ui, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" letterSpacing="0.8">TREUHAND</text>
              <text x="100" y="160" fill="white" fontFamily="'Inter', system-ui, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" letterSpacing="1">AG</text>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[18px] font-bold tracking-tight text-brand-blue uppercase leading-tight group-hover:text-accent-blue transition-colors duration-200">
              Züri Treuhand AG
            </span>
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#333333]/60 font-semibold leading-none mt-0.5">
              Treuhand & Beratung Zürich
            </span>
          </div>
        </button>

        {/* Desktop Nav Actions */}
        <nav id="desktop-nav-menu" className="hidden lg:flex items-center space-x-10 text-[13px] font-semibold uppercase tracking-wide">
          {navItems.map((item) => (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`font-sans transition-all duration-300 relative py-1 cursor-pointer tracking-wider ${
                activeSection === item.id
                  ? 'text-brand-blue font-bold border-b border-brand-blue'
                  : 'text-[#333333]/70 hover:text-brand-blue'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side phone and CTA */}
        <div className="hidden lg:flex items-center space-x-6">
          <a
            id="header-phone-link"
            href="tel:+41765388004"
            className="flex items-center space-x-2 text-xs font-mono text-[#333333]/85 hover:text-brand-blue transition-colors duration-200"
          >
            <Phone className="w-3.5 h-3.5 text-brand-blue" strokeWidth={1.5} />
            <span>+41 76 538 80 04</span>
          </a>
          <button
            id="header-cta-button"
            onClick={() => handleLinkClick('appointment')}
            className={`px-6 py-3 text-xs font-sans font-semibold tracking-wider uppercase rounded-[2px] transition-all duration-300 cursor-pointer ${
              activeSection === 'appointment'
                ? 'bg-brand-blue/10 border border-brand-blue text-brand-blue font-bold shadow-xs'
                : 'bg-brand-blue hover:bg-brand-blue/90 text-white'
            }`}
          >
            Erstgespräch
          </button>
        </div>

        {/* Mobile menu toggle button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-brand-blue p-1.5 rounded hover:bg-soft-gray transition-colors duration-200 cursor-pointer"
          aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          {isOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Side Drawer Menu */}
      {isOpen && (
        <div
          id="mobile-nav-panel"
          className="lg:hidden fixed inset-0 top-[68px] z-40 bg-white border-t border-border-gray flex flex-col justify-between py-12 px-8 animation-fade-in"
        >
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <button
                id={`mobile-nav-item-${item.id}`}
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`text-left font-display text-2xl font-medium tracking-wide py-2 ${
                  activeSection === item.id ? 'text-brand-blue pl-2 border-l-2 border-brand-blue' : 'text-neutral-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col space-y-6 pt-8 border-t border-border-gray">
            <div className="flex flex-col space-y-3">
              <a
                id="mobile-phone-link"
                href="tel:+41765388004"
                className="flex items-center space-x-3 text-sm text-neutral-700 hover:text-brand-blue"
              >
                <Phone className="w-4 h-4 text-brand-blue" strokeWidth={1.5} />
                <span>+41 76 538 80 04</span>
              </a>
              <a
                id="mobile-email-link"
                href="mailto:info@zuritreuhand.ch"
                className="flex items-center space-x-3 text-sm text-neutral-700 hover:text-brand-blue"
              >
                <Mail className="w-4 h-4 text-brand-blue" strokeWidth={1.5} />
                <span>info@zuritreuhand.ch</span>
              </a>
            </div>
            <button
              id="mobile-cta-button"
              onClick={() => handleLinkClick('appointment')}
              className={`w-full py-4 text-center font-sans tracking-widest uppercase text-xs rounded-sm transition-all duration-300 ${
                activeSection === 'appointment'
                  ? 'bg-brand-blue/10 border border-brand-blue text-brand-blue font-bold'
                  : 'bg-brand-blue hover:bg-brand-blue/90 text-white'
              }`}
            >
              Erstgespräch buchen
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
