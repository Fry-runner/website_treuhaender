import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LineMotif from './LineMotif';
import { ActiveView } from '../types';
import { Landmark, Scale, HelpCircle, X, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [activeLegalModal, setActiveLegalModal] = useState<'impressum' | 'datenschutz' | null>(null);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-10 pb-16 border-t border-brand-gray-light relative">
      <div className="w-full mb-12">
        <LineMotif type="footer" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Brand sign-off */}
        <div className="md:col-span-4 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 border border-brand-graphite rounded-sm flex items-center justify-center font-display font-medium text-xs">
              Q
            </div>
            <span className="font-display font-semibold text-sm tracking-tight text-brand-graphite">
              Quabba Treuhand
            </span>
          </div>
          <p className="font-sans text-xs text-brand-gray-medium leading-relaxed max-w-xs">
            Seit 1993 begleiten wir Schweizer Unternehmen und Privatpersonen mit Sachverstand, Diskretion und ausgeprägtem Ordnungssinn.
          </p>
        </div>

        {/* Sitemap structure */}
        <div className="md:col-span-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-heading font-semibold text-xs text-brand-graphite uppercase tracking-wider mb-4">
              Bereiche
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="font-sans text-xs text-brand-gray-medium hover:text-brand-violet transition-colors cursor-pointer"
                >
                  Startseite
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('company')}
                  className="font-sans text-xs text-brand-gray-medium hover:text-brand-violet transition-colors cursor-pointer"
                >
                  Unternehmen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('angebot')}
                  className="font-sans text-xs text-brand-gray-medium hover:text-brand-violet transition-colors cursor-pointer"
                >
                  Leistungsangebot
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-xs text-brand-graphite uppercase tracking-wider mb-4">
              Ueber uns
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="font-sans text-xs text-brand-gray-medium hover:text-brand-violet transition-colors cursor-pointer"
                >
                  Über uns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('references')}
                  className="font-sans text-xs text-brand-gray-medium hover:text-brand-violet transition-colors cursor-pointer"
                >
                  Referenzen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="font-sans text-xs text-brand-gray-medium hover:text-brand-violet transition-colors cursor-pointer"
                >
                  Kontakt & Lage
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory disclaimer info */}
        <div className="md:col-span-4">
          <h4 className="font-heading font-semibold text-xs text-brand-graphite uppercase tracking-wider mb-4">
            Kanzlei Zürich
          </h4>
          <p className="font-sans text-xs text-brand-gray-medium leading-relaxed mb-1">
            Laura Quabba Treuhand
          </p>
          <p className="font-sans text-xs text-brand-gray-medium leading-relaxed mb-4">
            Rotbuchstrasse 60 · 8037 Zürich
          </p>
          <p className="font-sans text-[10px] text-brand-gray-medium italic">
            Mitglied Schweizerischer Treuhänderverband / Fachliche Zulassungen vorhanden.
          </p>
        </div>
      </div>

      {/* Underbar Copyright / Disclosures */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-brand-gray-light flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-brand-gray-medium uppercase tracking-wider">
          © {currentYear} Laura Quabba Treuhand. Alle Rechte vorbehalten.
        </p>
        
        <div className="flex gap-6">
          <button
            id="footer-modal-impressum"
            onClick={() => setActiveLegalModal('impressum')}
            className="font-sans text-[10px] uppercase tracking-wider text-brand-gray-medium hover:text-brand-violet transition-colors cursor-pointer"
          >
            Impressum
          </button>
          <button
            id="footer-modal-datenschutz"
            onClick={() => setActiveLegalModal('datenschutz')}
            className="font-sans text-[10px] uppercase tracking-wider text-brand-gray-medium hover:text-brand-violet transition-colors cursor-pointer"
          >
            Datenschutz
          </button>
        </div>
      </div>

      {/* Legal Modal Popup overlays for ultimate full compliance (Swiss CO law) */}
      <AnimatePresence>
        {activeLegalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-graphite/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-brand-gray-light rounded-[4px] p-6 md:p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Close pin */}
              <button
                onClick={() => setActiveLegalModal(null)}
                className="absolute top-5 right-5 text-brand-gray-medium hover:text-brand-violet"
                id="legal-modal-close"
              >
                <X className="w-5 h-5" />
              </button>

              {activeLegalModal === 'impressum' ? (
                <div>
                  <div className="flex gap-2.5 items-center text-brand-violet mb-4">
                    <Scale className="w-5 h-5" />
                    <h3 className="font-display font-semibold text-lg text-brand-graphite">Impressum</h3>
                  </div>
                  <div className="space-y-4 font-sans text-xs text-brand-gray-medium leading-relaxed">
                    <p className="font-semibold text-brand-graphite">Herausgeberin & Diensteanbieterin:</p>
                    <p>
                      Laura Quabba Treuhand<br />
                      Rotbuchstrasse 60<br />
                      8037 Zürich<br />
                      Schweiz
                    </p>
                    <p className="font-semibold text-brand-graphite">Kontakt:</p>
                    <p>
                      Telefon: +41 44 365 30 00<br />
                      E-Mail: office@quabba.ch<br />
                      Webseite: www.quabba.ch
                    </p>
                    <p className="font-semibold text-brand-graphite">Unternehmens-Identifikationsnummer (UID):</p>
                    <p>CHE-104.281.456 MWST</p>
                    <p className="font-semibold text-brand-graphite">Aufsichtsrechtliche Bemerkung:</p>
                    <p>
                      Laura Quabba ist zugelassene Mandatsträgerin und Mitglied der eidgenössisch geprüften Instanzen in Zürich. Registriert gemäss den kantonalen Treuhandvorschriften.
                    </p>
                    <p className="font-semibold text-brand-graphite">Haftungsausschluss:</p>
                    <p>
                      Die auf dieser Webseite bereitgestellten Informationen dienen ausschliesslich allgemeinen Informationszwecken. Sie stellen keine professionelle Rechts- oder Treuhandberatung dar. Wir übernehmen keine Haftung für Schäden, die aus dem Vertrauen auf diese Inhalte entstehen.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2.5 items-center text-brand-violet mb-4">
                    <ShieldAlert className="w-5 h-5" />
                    <h3 className="font-display font-semibold text-lg text-brand-graphite">Datenschutzerklärung (DSG)</h3>
                  </div>
                  <div className="space-y-4 font-sans text-xs text-brand-gray-medium leading-relaxed">
                    <p>
                      Der Schutz Ihrer Privatsphäre ist uns ein zentrales Anliegen. Wir bearbeiten Ihre Daten streng vertraulich und in Übereinstimmung mit dem neuen Schweizer Bundesgesetz über den Datenschutz (DSG).
                    </p>
                    <p className="font-semibold text-brand-graphite">1. Verantwortliche Stelle</p>
                    <p>
                      Verantwortlich für die Datenverarbeitungen über diese Webseite ist Laura Quabba Treuhand, Rotbuchstrasse 60, 8037 Zürich.
                    </p>
                    <p className="font-semibold text-brand-graphite">2. Datenerfassung auf dieser Webseite</p>
                    <p>
                      Wir erfassen personenbezogene Daten, wenn Sie uns diese über unser Kontakt- oder Buchungsformular freiwillig mitteilen (z. B. Name, E-Mail-Adresse, Telefonnummer, Anliegen). Diese Daten werden ausschliesslich zur Bearbeitung Ihrer individuellen Anfrage verwendet und nicht an unbefugte Dritte weitergegeben.
                    </p>
                    <p className="font-semibold text-brand-graphite">3. Datensicherheit & Protokollierung</p>
                    <p>
                      Unsere Website nutzt eine moderne SSL/TLS-Verschlüsselung, um die Übertragung vertraulicher Inhalte vor dem Zugriff Unbefugter zu schützen. Beim Aufruf der Seite werden aus technischen Gründen Server-Logfiles (z. B. IP-Adresse, Datum, Uhrzeit) temporär protokolliert, um die Systemstabilität zu gewährleisten. Eine Zusammenführung dieser Daten mit anderen Datenquellen findet nicht statt.
                    </p>
                    <p className="font-semibold text-brand-graphite">4. Ihre Rechte</p>
                    <p>
                      Sie haben jederzeit das Recht, unentgeltlich Auskunft über die Herkunft, den Empfänger und den Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Zudem haben Sie das Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Wenden Sie sich hierzu an office@quabba.ch.
                    </p>
                  </div>
                </div>
              )}

              <button
                id="legal-modal-close-btn"
                onClick={() => setActiveLegalModal(null)}
                className="mt-8 w-full bg-brand-graphite text-white py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-brand-violet transition-colors rounded-sm cursor-pointer"
              >
                Schliessen
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
