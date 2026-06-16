/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface PrivacyImprintProps {
  type: 'imprint' | 'privacy' | null;
  onClose: () => void;
}

export default function PrivacyImprint({ type, onClose }: PrivacyImprintProps) {
  if (!type) return null;

  return (
    <div
      id="privacy-imprint-backdrop"
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-border-gray max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-[2px] p-8 sm:p-10 shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-500 hover:text-brand-blue p-1 rounded-[2px] hover:bg-soft-gray transition-colors cursor-pointer"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'imprint' ? (
          <div>
            <span className="font-sans text-[11px] tracking-widest text-brand-blue font-bold uppercase block mb-3">
              RECHTLICHE ANGABEN
            </span>
            <h2 className="font-display text-2xl font-bold text-brand-blue mb-8 tracking-tight">
              Impressum
            </h2>

            <div className="space-y-6 font-sans text-xs text-neutral-600 leading-relaxed font-light">
              <div>
                <h3 className="font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 font-sans">
                  Unternehmensbezeichnung
                </h3>
                <p className="font-semibold text-neutral-800 text-sm">Züri Treuhand AG</p>
                <p>Hardstrasse 4</p>
                <p>8004 Zürich</p>
                <p>Schweiz</p>
              </div>

              <div>
                <h3 className="font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 font-sans">
                  Vertretungsberechtigte Personen
                </h3>
                <p className="font-semibold text-neutral-800">Beat Müller</p>
                <p className="text-neutral-500 font-light">Präsident des Verwaltungsrates & Treuhandexperte</p>
              </div>

              <div>
                <h3 className="font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 font-sans">
                  Kontaktangaben
                </h3>
                <p>Telefon: +41 76 538 80 04</p>
                <p>E-Mail: info@zuritreuhand.ch</p>
                <p>Webseite: www.zuritreuhand.ch</p>
              </div>

              <div>
                <h3 className="font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 font-sans">
                  Handelsregistereintrag
                </h3>
                <p>Eingetragener Firmenname: Züri Treuhand AG</p>
                <p>Handelsregisteramt: Kanton Zürich</p>
                <p>UID-Nummer: CHE-234.567.890 MWST</p>
              </div>

              <div className="pt-4 border-t border-border-gray">
                <h3 className="font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 font-sans">
                  Haftungsausschluss (Disclaimer)
                </h3>
                <p className="text-neutral-500 font-light leading-relaxed">
                  Die Autoren übernehmen keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen die Autoren wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <span className="font-sans text-[11px] tracking-widest text-brand-blue font-bold uppercase block mb-3">
              DATENSCHUTZ UND KONFORMITÄT
            </span>
            <h2 className="font-display text-2xl font-bold text-brand-blue mb-8 tracking-tight">
              Datenschutzerklärung
            </h2>

            <div className="space-y-6 font-sans text-xs text-neutral-600 leading-relaxed font-light">
              <p>
                Gestützt auf Artikel 13 der schweizerischen Bundesverfassung und die datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) hat jede Person Anspruch auf Schutz ihrer Privatsphäre sowie auf Schutz vor Missbrauch ihrer persönlichen Daten. Wir halten diese Bestimmungen strengstens ein.
              </p>

              <div>
                <h3 className="font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 font-sans">
                  1. Erfassung persönlicher Daten
                </h3>
                <p className="text-neutral-500 font-light leading-relaxed">
                  In Zusammenarbeit mit unseren Hosting-Providern bemühen wir uns, die Datenbanken so gut wie möglich vor fremden Zugriffen, Verlusten, Missbrauch oder vor Fälschung zu schützen. Beim Zugriff auf unsere Webseiten werden folgende Daten in Logfiles gespeichert: IP-Adresse, Datum, Uhrzeit, Browser-Anfrage und allg. übertragene Infos zum Betriebssystem resp. Browser. Diese Nutzungsdaten bilden die Basis für statistische, anonyme Auswertungen.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 font-sans">
                  2. Kontaktformular und Datenspeicherung
                </h3>
                <p className="text-neutral-500 font-light leading-relaxed">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir niemals ohne Ihre Einwilligung an Dritte weiter.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 font-sans">
                  3. Verschlüsselung (SSL/TLS)
                </h3>
                <p className="text-neutral-500 font-light leading-relaxed">
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL-bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 font-sans">
                  4. Recht auf Auskunft, Löschung, Sperrung
                </h3>
                <p className="text-neutral-500 font-light leading-relaxed">
                  Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
