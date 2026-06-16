/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { ChevronDown, AlignRight, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activePage: PageId;
  onPageChange: (page: PageId) => void;
}

export default function Header({ activePage, onPageChange }: HeaderProps) {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Über uns', pageId: 'about' as PageId },
    { label: 'Kooperationen', pageId: 'cooperation' as PageId },
    { label: 'Preise', pageId: 'pricing' as PageId },
  ];

  const handleServicesClick = (id: PageId) => {
    onPageChange(id);
    setIsServicesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo linksbündig */}
        <div 
          id="logo-container" 
          className="flex items-center cursor-pointer group"
          onClick={() => onPageChange('home')}
        >
          <div className="flex items-center">
            <span className="font-sans font-extrabold text-xl tracking-tighter text-brand-navy leading-none">B</span>
            <svg 
              className="h-5 w-9 mx-0.5 text-brand-navy shrink-0" 
              viewBox="0 0 48 36" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M 12,28 C 8,28 3,24 3,18 3,11 8,8 12,8 16,8 19,12 24,18 29,24 32,28 36,28 40,28 45,24 45,18 45,11 40,8 36,8 32,8 29,12 24,18 19,24 16,28 12,28 Z" />
            </svg>
            <span className="font-sans font-extrabold text-xl tracking-tighter text-brand-navy leading-none">ST</span>
            <span className="font-sans font-light text-lg tracking-tight text-brand-accent-blue ml-1.5 leading-none">CONSULTING</span>
          </div>
        </div>

        {/* Menüführung zentriert */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsServicesDropdownOpen(true)}
            onMouseLeave={() => setIsServicesDropdownOpen(false)}
          >
            <button
              id="services-dropdown-btn"
              onClick={() => onPageChange('services')}
              className={`flex items-center space-x-1 py-1 font-sans text-sm tracking-wide transition-all ${
                activePage === 'services' || activePage === 'accounting'
                  ? 'text-brand-navy font-semibold underline decoration-brand-accent-blue decoration-2 underline-offset-8'
                  : 'text-[#64748B] hover:text-brand-navy'
              }`}
            >
              <span>Unsere Dienstleistungen</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isServicesDropdownOpen && (
              <div 
                id="services-dropdown-menu" 
                className="absolute left-0 mt-0 w-64 bg-white border border-brand-border shadow-sm py-2 z-50 animate-fade-in"
              >
                <button
                  onClick={() => handleServicesClick('services')}
                  className="w-full text-left px-4 py-2 text-xs font-sans text-brand-navy hover:bg-brand-accent-blue-light transition-colors flex flex-col"
                >
                  <span className="font-medium">Portfolio Übersicht</span>
                  <span className="text-[10px] text-brand-platinum mt-0.5">Alle Services im Überblick</span>
                </button>
                <div className="border-t border-brand-border my-1"></div>
                <button
                  onClick={() => handleServicesClick('accounting')}
                  className="w-full text-left px-4 py-2 text-xs font-sans text-brand-navy hover:bg-brand-accent-blue-light transition-colors flex flex-col"
                >
                  <span className="font-medium">Accounting (Treuhand)</span>
                  <span className="text-[10px] text-brand-platinum mt-0.5">Digitales B2B-Accounting & Jahresabschluss</span>
                </button>
              </div>
            )}
          </div>

          {/* Other Links */}
          {navigationItems.map((item) => (
            <button
              key={item.pageId}
              onClick={() => onPageChange(item.pageId)}
              className={`font-sans text-sm tracking-wide py-1 transition-all ${
                activePage === item.pageId
                  ? 'text-brand-navy font-semibold underline decoration-brand-accent-blue decoration-2 underline-offset-8'
                  : 'text-[#64748B] hover:text-brand-navy'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Ganz rechts ein prominenter Konvertierungspunkt als Kontur-Button */}
        <div className="hidden md:flex items-center">
          <button
            id="header-cta-btn"
            onClick={() => onPageChange('contact')}
            className={`border px-5 py-2.5 font-sans text-xs uppercase tracking-widest font-medium transition-all duration-300 ${
              activePage === 'contact' 
                ? 'bg-brand-accent-blue text-white border-brand-accent-blue shadow-sm' 
                : 'text-brand-navy border-brand-navy bg-transparent hover:bg-brand-accent-blue hover:text-white hover:border-brand-accent-blue'
            }`}
          >
            Termin buchen
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-brand-navy focus:outline-none"
            aria-label="Menü öffnen"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <AlignRight className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-brand-border z-40 animate-fade-in px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-brand-platinum uppercase">Dienstleistungen</span>
            <button
              onClick={() => handleServicesClick('services')}
              className={`text-left pl-2 font-sans text-sm ${activePage === 'services' ? 'text-brand-navy font-medium' : 'text-brand-platinum'}`}
            >
              Dienstleistungen Übersicht
            </button>
            <button
              onClick={() => handleServicesClick('accounting')}
              className={`text-left pl-2 font-sans text-sm ${activePage === 'accounting' ? 'text-brand-navy font-medium' : 'text-brand-platinum'}`}
            >
              Accounting (Treuhand)
            </button>
          </div>

          <div className="border-t border-brand-border my-2"></div>

          <div className="flex flex-col space-y-3">
            {navigationItems.map((item) => (
              <button
                key={item.pageId}
                onClick={() => {
                  onPageChange(item.pageId);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left font-sans text-sm ${activePage === item.pageId ? 'text-brand-navy font-medium' : 'text-brand-platinum'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                onPageChange('contact');
                setIsMobileMenuOpen(false);
              }}
              className="w-full border border-brand-navy text-center py-3 text-xs uppercase tracking-widest font-mono text-brand-navy hover:bg-brand-navy hover:text-white transition-all"
            >
              Termin buchen
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
