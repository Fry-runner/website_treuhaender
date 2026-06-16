import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, FileText, CheckCircle2, ShieldCheck, Mail, Phone, Landmark } from 'lucide-react';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import KanzleiSection from './components/KanzleiSection';
import RuerupSection from './components/RuerupSection';
import SteuerrechtSection from './components/SteuerrechtSection';
import InternationalSection from './components/InternationalSection';
import KontaktSection from './components/KontaktSection';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeModal, setActiveModal] = useState<'impressum' | 'datenschutz' | null>(null);

  // Set page title dynamically
  useEffect(() => {
    let title = 'Andreas Rürup — Steuerberatung Deutschland-Schweiz';
    switch (currentPage) {
      case 'kanzlei':
        title = 'Die Kanzlei | Andreas Rürup';
        break;
      case 'ruerup':
        title = 'Andreas Rürup | Inhaber & Steuerberater';
        break;
      case 'steuerrecht':
        title = 'Steuerrecht Deutschland-Schweiz | Andreas Rürup';
        break;
      case 'international':
        title = 'Internationales Steuerrecht | Andreas Rürup';
        break;
      case 'kontakt':
        title = 'Kontakt & Standorte | Andreas Rürup';
        break;
    }
    document.title = title;
  }, [currentPage]);

  const renderActiveSection = () => {
    switch (currentPage) {
      case 'kanzlei':
        return <KanzleiSection setCurrentPage={setCurrentPage} />;
      case 'ruerup':
        return <RuerupSection setCurrentPage={setCurrentPage} />;
      case 'steuerrecht':
        return <SteuerrechtSection setCurrentPage={setCurrentPage} />;
      case 'international':
        return <InternationalSection setCurrentPage={setCurrentPage} />;
      case 'kontakt':
        return <KontaktSection />;
      default:
        return <HomeSection setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-anthracite font-sans selection:bg-brand-grey/10 selection:text-brand-anthracite flex flex-col justify-between">
      
      {/* 1. Sticky Navigation Header */}
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* 2. Fluid Content Area with Staggered Fade Transitions */}
      <main className="flex-grow py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer Section (Updating view or triggering modals) */}
      <Footer setCurrentPage={setCurrentPage} openModal={setActiveModal} />

      {/* 4. Elegant Overlay Modals for Legal Compliance (Impressum / Privacy) */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-anthracite/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-brand-offwhite border border-brand-beige w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl p-8 shadow-2xl relative"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-beige/50 text-brand-grey hover:text-brand-anthracite cursor-pointer transition-colors"
                aria-label="Modal schliessen"
              >
                <X className="w-5 h-5" />
              </button>

              {activeModal === 'impressum' ? (
                // Germany & Swiss Compliant Imprint (Impressum)
                <div className="space-y-6 text-sm text-brand-grey font-light">
                  <div className="flex items-center gap-3 border-b border-brand-beige pb-4">
                    <Landmark className="w-5 h-5 text-brand-grey" />
                    <h3 className="font-display font-semibold text-xl text-brand-anthracite">
                      Impressum
                    </h3>
                  </div>

                  <div className="space-y-4 leading-relaxed font-sans">
                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">Diensteanbieter / Kanzlei</h4>
                      <p className="text-brand-anthracite">Andreas Rürup · Steuerberatungskanzlei</p>
                      <p>CH-Sitz: Poststrasse 14, CH-8001 Zürich</p>
                      <p>DE-Niederlassung: Königsallee 60 F, D-40212 Düsseldorf</p>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">Kontakt &amp; Vertretung</h4>
                      <p>Schweiz Telefon: +41 (0) 44 211 88 00</p>
                      <p>Deutschland Telefon: +49 (0) 211 890 33 00</p>
                      <p>E-Mail: <span className="text-brand-grey font-normal hover:text-brand-anthracite transition-colors">kanzlei@ruerup.tax</span></p>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">Zuständige Berufskammern</h4>
                      <p><strong>Zürich:</strong> Aufsichtsbehörde über die Anwälte im Kanton Zürich / Eidgenössische Steuerverwaltung (ESTV).</p>
                      <p><strong>Düsseldorf:</strong> Steuerberaterkammer Düsseldorf, Graf-Adolf-Straße 20a, D-40212 Düsseldorf.</p>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">Gesetzliche Berufsbezeichnung</h4>
                      <p><strong>Steuerberater</strong> (verliehen in der Bundesrepublik Deutschland, Bundesland Nordrhein-Westfalen).</p>
                      <p><strong>Fachberater für Internationales Steuerrecht</strong> (verliehen durch die Steuerberaterkammer Düsseldorf).</p>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">Berufshaftpflichtversicherung</h4>
                      <p>Gothaer Allgemeine Versicherung AG, Gothaer Allee 1, D-50969 Köln.</p>
                      <p className="text-[11px] text-gray-500">Räumlicher Geltungsbereich: Gesamtes Gebiet der EU sowie der Schweiz. Entspricht den Anforderungen gem. § 67 StBerG.</p>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">Schlichtungsstellen</h4>
                      <p>Bei Streitigkeiten zwischen Steuerberater und Mandant vermittelt die Steuerberaterkammer Düsseldorf gem. § 76 Abs. 2 Nr. 3 StBerG.</p>
                    </div>
                  </div>
                </div>
              ) : (
                // GDPR & Swiss FADP Compliant Privacy Declaration (Datenschutzerklärung)
                <div className="space-y-6 text-sm text-brand-grey font-light">
                  <div className="flex items-center gap-3 border-b border-brand-beige pb-4">
                    <ShieldCheck className="w-5 h-5 text-brand-grey" />
                    <h3 className="font-display font-semibold text-xl text-brand-anthracite">
                      Datenschutzerklärung
                    </h3>
                  </div>

                  <div className="space-y-4 leading-relaxed font-sans">
                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">1. Geltungsbereich und Verantwortlicher</h4>
                      <p>Diese Datenschutzerklärung gilt für das Online-Angebot der Kanzlei Andreas Rürup in Deutschland und der Schweiz. Verantwortlicher im Sinne der EU-Datenschutz-Grundverordnung (DSGVO) sowie des Schweizer Bundesgesetzes über den Datenschutz (DSG) ist:</p>
                      <p className="text-brand-anthracite font-normal mt-1">Andreas Rürup · Poststrasse 14, CH-8001 Zürich · info@ruerup.tax</p>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">2. Datenerfassung via Kontaktformular</h4>
                      <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten (Name, E-Mail, optional Telefon) zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
                      <p className="mt-1">Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (vertragliche bzw. vorvertragliche Maßnahme) sowie dem Schweizer DSG.</p>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">3. Lokaler Speicher (Browser / Client Storage)</h4>
                      <p>Diese Applikation speichert Ihre Formulareinsendungen primär lokal in Ihrem Webbrowser (LocalStorage), um Ihnen in der interaktiven Demonstration die Überprüfung des Anfrageeingangs hürdenfrei zu ermöglichen. Diese Daten verbleiben auf Ihrem Endgerät und werden nicht an unbefugte Dritte weitergegeben.</p>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">4. Ihre Rechte</h4>
                      <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Wenden Sie sich hierzu an die oben genannte Mailadresse.</p>
                    </div>

                    <div>
                      <h4 className="font-display font-medium text-brand-anthracite text-xs uppercase tracking-wider mb-1">5. SSL- bzw. TLS-Verschlüsselung</h4>
                      <p>Diese Seite nutzt zum Schutz vertraulicher Inhalte eine TLS-Verschlüsselungsstärke. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-brand-beige flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 bg-brand-anthracite text-white hover:bg-black text-xs font-semibold rounded cursor-pointer transition-colors"
                >
                  Schliessen
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
