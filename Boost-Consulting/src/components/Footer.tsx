/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageId } from '../types';
import { Linkedin, Globe, Shield, Scale } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: PageId) => void;
  onOpenLegal: (type: 'impressum' | 'datenschutz') => void;
}

export default function Footer({ onPageChange, onOpenLegal }: FooterProps) {
  const links = [
    { label: 'Startseite', id: 'home' as PageId },
    { label: 'Unsere Dienstleistungen', id: 'services' as PageId },
    { label: 'Accounting (Treuhand)', id: 'accounting' as PageId },
    { label: 'Über uns', id: 'about' as PageId },
    { label: 'Kooperationen', id: 'cooperation' as PageId },
    { label: 'Preise', id: 'pricing' as PageId },
    { label: 'Termin und Kontakt', id: 'contact' as PageId },
  ];

  return (
    <footer id="app-footer" className="bg-brand-gray border-t border-brand-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-sans font-extrabold text-base tracking-tighter text-brand-navy leading-none">B</span>
              <svg 
                className="h-4 w-7 mx-0.5 text-brand-navy shrink-0" 
                viewBox="0 0 48 36" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="7" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M 12,28 C 8,28 3,24 3,18 3,11 8,8 12,8 16,8 19,12 24,18 29,24 32,28 36,28 40,28 45,24 45,18 45,11 40,8 36,8 32,8 29,12 24,18 19,24 16,28 12,28 Z" />
              </svg>
              <span className="font-sans font-extrabold text-base tracking-tighter text-brand-navy leading-none">ST</span>
              <span className="font-sans font-light text-sm tracking-tight text-brand-accent-blue ml-1.5 leading-none">CONSULTING</span>
            </div>
            <p className="text-xs text-brand-platinum font-sans max-w-xs leading-relaxed">
              Professionelle Schweizer Treuhand-Tradition verbunden mit modernster digitaler Routine. Absolute Ausfallsicherheit für Ihr Unternehmen.
            </p>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-brand-navy font-mono font-medium mb-4">Sitemap</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onPageChange(link.id)}
                    className="text-xs text-brand-platinum hover:text-brand-navy font-sans transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Network Col */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-brand-navy font-mono font-medium">B2B Netzwerk</h4>
            <div className="flex flex-col space-y-2">
              <span className="text-xs text-brand-platinum font-sans">
                Boost Consulting GmbH
              </span>
              <span className="text-xs text-brand-platinum font-sans">
                Zürich, Schweiz
              </span>
            </div>
            
            <div className="pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white border border-brand-border py-2 px-4 text-xs font-sans text-brand-navy hover:bg-brand-navy hover:text-white transition-all duration-300"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>Verknüpfung auf LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-brand-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-brand-platinum font-mono">
            &copy; {new Date().getFullYear()} Boost Consulting GmbH. Alle Rechte vorbehalten.
          </p>
          
          <div className="flex space-x-6">
            <button
              onClick={() => onOpenLegal('impressum')}
              className="text-[10px] text-brand-platinum hover:text-brand-navy font-mono transition-colors flex items-center space-x-1"
            >
              <Scale className="w-3 h-3 text-brand-platinum" />
              <span>Impressum</span>
            </button>
            <button
              onClick={() => onOpenLegal('datenschutz')}
              className="text-[10px] text-brand-platinum hover:text-brand-navy font-mono transition-colors flex items-center space-x-1"
            >
              <Shield className="w-3 h-3 text-brand-platinum" />
              <span>Datenschutz</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
