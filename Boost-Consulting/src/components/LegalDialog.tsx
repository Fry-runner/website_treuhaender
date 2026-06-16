/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Scale, ShieldAlert } from 'lucide-react';

interface LegalDialogProps {
  type: 'impressum' | 'datenschutz' | null;
  onClose: () => void;
}

export default function LegalDialog({ type, onClose }: LegalDialogProps) {
  if (!type) return null;

  return (
    <div id="legal-dialog-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        id="legal-dialog-content" 
        className="bg-white border text-left border-brand-border w-full max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-brand-border flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center space-x-2 text-brand-navy">
            {type === 'impressum' ? <Scale className="w-5 h-5 text-brand-platinum" /> : <ShieldAlert className="w-5 h-5 text-brand-platinum" />}
            <span className="font-sans font-medium text-sm uppercase tracking-widest">
              {type === 'impressum' ? 'Impressum' : 'Datenschutzerklärung'}
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="text-brand-navy hover:text-brand-platinum p-1 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 text-xs text-brand-navy leading-relaxed font-sans">
          {type === 'impressum' ? (
            <>
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm tracking-wide">Boost Consulting GmbH</h4>
                <p>Bahnhofstrasse 100, 8001 Zürich, Schweiz</p>
                <p>E-Mail: partner@boostconsulting.ch</p>
                <p>Telefon: +41 (0) 44 200 00 00</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-sm tracking-wide">Vertretungsberechtigte Personen</h4>
                <p>Oliver Glaeser, Geschäftsführender Gesellschafter</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-sm tracking-wide">Handelsregistereintrag</h4>
                <p>Eingetragener Firmenname: Boost Consulting GmbH</p>
                <p>Handelsregister-Nummer: CHE-123.456.789 MWST</p>
                <p>Handelsregisteramt: Kanton Zürich</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-sm tracking-wide">Mehrwertsteuernummer</h4>
                <p>CHE-123.456.789 MWST</p>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-brand-border">
                <h4 className="font-bold text-sm tracking-wide">Haftungsausschluss</h4>
                <p>
                  Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Allfällige Angebote sind unverbindlich.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm tracking-wide">1. Datenschutz auf einen Blick</h4>
                <p>
                  Verantwortliche Stelle im Sinne der Datenschutzgesetze, insbesondere der Schweizerischen Datenschutzgesetzgebung (DSG) sowie der EU-Datenschutzgrundverordnung (DSGVO), ist Boost Consulting GmbH. Wir legen grössten Wert darauf, dass Ihre Daten geschützt und absolut vertraulich behandelt werden.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-sm tracking-wide">2. Erfassung von Daten</h4>
                <p>
                  Wenn Sie auf unsere Webseite zugreifen, eine Kooperationsanfrage senden oder einen Besprechungstermin buchen, werden automatisch Informationen allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles) beinhalten etwa die Art des Webbrowsers, das verwendete Betriebssystem und Ähnliches. Diese Daten sind technisch notwendig, um die von Ihnen angeforderten Inhalte von Webseiten korrekt auszuliefern und fallen bei Nutzung des Internets zwingend an.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-sm tracking-wide">3. SSL/TLS-Verschlüsselung</h4>
                <p>
                  Um die Sicherheit Ihrer Daten bei der Übertragung zu schützen, verwenden wir dem aktuellen Stand der Technik entsprechende Verschlüsselungsverfahren (z. B. SSL/TLS) über HTTPS.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-sm tracking-wide">4. Kontaktformular und Terminbuchungen</h4>
                <p>
                  Treten Sie per E-Mail, Kontaktformular oder über unser digitales Kalender-Widget mit uns in Verbindung, erteilen Sie uns zum Zwecke der Kontaktaufnahme Ihre freiwillige Einwilligung. Die von Ihnen gemachten Angaben werden zum Zwecke der Bearbeitung der Anfrage sowie für mögliche Anschlussfragen gespeichert.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-sm tracking-wide">5. Ihre Betroffenenrechte</h4>
                <p>
                  Sie können jederzeit unter den angegebenen Kontaktdaten folgende Rechte ausüben: Auskunft über Ihre bei uns gespeicherten Daten und deren Verarbeitung, Berichtigung unrichtiger personenbezogener Daten, Löschung Ihrer bei uns gespeicherten Daten sowie Einschränkung der Datenverarbeitung, sofern wir Ihre Daten aufgrund gesetzlicher Pflichten noch nicht löschen dürfen.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-border bg-brand-gray text-right sticky bottom-[-2px]">
          <button
            onClick={onClose}
            className="bg-brand-navy text-white text-[11px] font-mono tracking-widest uppercase py-2 px-6 hover:bg-brand-navy/90 transition-all"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
