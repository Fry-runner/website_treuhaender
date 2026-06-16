/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenModal: (type: 'imprint' | 'privacy') => void;
}

export default function Footer({ onNavigate, onOpenModal }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-brand-blue text-white py-16 md:py-20 border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-12 border-b border-white/10">
          
          {/* Main branding description */}
          <div className="md:col-span-5 flex flex-col justify-start space-y-4">
            <span className="font-display text-xl font-bold tracking-tight">
              Züri Treuhand<span className="text-white ml-0.5"> AG.</span>
            </span>
            <p className="font-sans text-xs text-neutral-300 hover:text-white leading-relaxed max-w-sm font-light">
              Zahlen erzählen Geschichten – wir sorgen dafür, dass sie verstanden werden. Ihr vertrauensvoller Schweizer Partner für präzise Buchhaltung, Steuererklärungen (JP / NP) und ganzheitliche Beratung.
            </p>
            <div className="pt-2 text-xs font-sans text-neutral-400 font-light">
              © {currentYear} Züri Treuhand AG. Alle Rechte vorbehalten.
            </div>
          </div>

          {/* Quick-links */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="font-sans text-xs font-bold tracking-widest uppercase text-neutral-400">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-neutral-300/90">
              <li>
                <button
                  id="footer-link-home"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Startseite
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Über uns
                </button>
              </li>
              <li>
                <button
                  id="footer-link-services"
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dienstleistungen & Rechner
                </button>
              </li>
              <li>
                <button
                  id="footer-link-contact"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kontakt aufnehmen
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Compliance links */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="font-sans text-xs font-bold tracking-widest uppercase text-neutral-400">
              Kanzlei & Gesetzliches
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5 text-xs text-neutral-300/80">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Hardstrasse 4, 8004 Zürich</span>
              </div>
              
              <div className="space-y-2.5">
                <button
                  id="footer-trigger-imprint"
                  onClick={() => onOpenModal('imprint')}
                  className="block text-xs font-sans text-neutral-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Impressum (Rechtliche Angaben)
                </button>
                <button
                  id="footer-trigger-privacy"
                  onClick={() => onOpenModal('privacy')}
                  className="block text-xs font-sans text-neutral-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Datenschutzerklärung (DSG Konformität)
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom micro lines */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-400 font-sans font-light">
          <div>
            REG.-NR: CHE-234.567.890 MWST • ZÜRICH, CH
          </div>
          <div>
            Konzipiert nach Schweizer Beratungsstandards.
          </div>
        </div>
      </div>
    </footer>
  );
}
