import { useState } from 'react';
import { ActiveView, OfferCategory } from './types';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Company from './components/Company';
import Offerings from './components/Offerings';
import About from './components/About';
import References from './components/References';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LineMotif from './components/LineMotif';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Clock, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useInView } from './hooks/useInView';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [preselectedCategory, setPreselectedCategory] = useState<OfferCategory>('treuhand');

  // Modular intersection observers for the homepage sections
  const [sect1Ref, sect1InView] = useInView();
  const [sect2Ref, sect2InView] = useInView();
  const [sect3Ref, sect3InView] = useInView();
  const [sect4Ref, sect4InView] = useInView();
  const [sect5Ref, sect5InView] = useInView();
  const [sect6Ref, sect6InView] = useInView();

  // Multi-entry consultation trigger
  const triggerConsultation = (category: OfferCategory = 'treuhand') => {
    setPreselectedCategory(category);
    setActiveView('contact');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-brand-graphite selection:bg-brand-violet/10 selection:text-brand-violet">
      
      {/* Premium Sticky Navigation Header */}
      <Navigation
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenConsultation={() => triggerConsultation('treuhand')}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero
                onNavigate={setActiveView}
                onOpenConsultation={() => triggerConsultation('treuhand')}
              />

               {/* Integrated Home Abschnitt 1 – Einleitung/Positionierung */}
              <section ref={sect1Ref} className="bg-white py-16 md:py-24 border-t border-brand-gray-light">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-4">
                    <p className={`font-sans text-[11px] uppercase tracking-[0.2em] font-black mb-2 transition-colors duration-700 ${sect1InView ? 'text-brand-violet text-glow' : 'text-brand-gray-medium'}`}>
                      ÜBER UNSER METIER
                    </p>
                    <h3 className="font-display font-bold text-3xl md:text-4xl text-brand-graphite tracking-tight leading-tight">
                      Mit klarem Kopf, gesundem Sinn und echtem Handwerk.
                    </h3>
                  </div>
                  
                  <div className="lg:col-span-8 space-y-6">
                    <p className="font-sans text-brand-gray-medium text-lg leading-relaxed">
                      Quabba Treuhand begleiten kleine und mittlere Schweizer Unternehmen sowie anspruchsvolle Privatpersonen engagiert bei der Buchhaltung, strategischer Beratung und allen organisatorischen Herausforderungen des geschäftlichen Alltags. Unser Anspruch ist so einfach wie wirkungsvoll: Aus komplexen Zahlen und unübersichtlichen Abläufen schaffen wir echte, greifbare Klarheit.
                    </p>
                    <p className="font-sans text-brand-gray-medium text-lg leading-relaxed">
                      Sie profitieren von der direkten, persönlichen Betreuung durch die Inhaberin Laura Quabba. Das bedeutet konkret: Kurze Entscheidungswege, ehrliche und direkte Kommunikation ohne bürokratische Umwege, und die Sicherheit einer über 30-jährigen Kanzleihistorie im Herzen von Wipkingen.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION: Trust & Standards Anchors (Point 3 & 4: Swiss Precision Editorial Quality Anchors) */}
              <section ref={sect2Ref} className="bg-white py-12 border-t border-brand-gray-light">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                    <div className={`border-l-[1.5px] pl-5 py-2 transition-colors duration-700 ${sect2InView ? 'border-brand-violet' : 'border-brand-gray-light'}`}>
                      <span className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-700 block ${sect2InView ? 'text-brand-violet' : 'text-[#7C868C]'}`}>RECHTSSICHERHEIT</span>
                      <p className="font-heading font-bold text-xs text-brand-graphite mt-1.5 mb-1 uppercase tracking-medium">Schweizer OR Konformität</p>
                      <p className="font-sans text-[11px] text-[#7C868C] leading-relaxed">Höchste Qualität gemäss Schweizer Obligationenrecht & MWST-Richtlinien der ESTV.</p>
                    </div>
                    <div className={`border-l-[1.5px] pl-5 py-2 transition-colors duration-700 ${sect2InView ? 'border-brand-violet' : 'border-brand-gray-light'}`}>
                      <span className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-700 block ${sect2InView ? 'text-brand-violet' : 'text-[#7C868C]'}`}>SOUVERÄNITÄT</span>
                      <p className="font-heading font-bold text-xs text-brand-graphite mt-1.5 mb-1 uppercase tracking-medium">Datenspeicherung in der Schweiz</p>
                      <p className="font-sans text-[11px] text-[#7C868C] leading-relaxed">Sämtliche Mandatsdaten liegen verschlüsselt auf Schweizer Servern gemäss neuem nDSG.</p>
                    </div>
                    <div className={`border-l-[1.5px] pl-5 py-2 transition-colors duration-700 ${sect2InView ? 'border-brand-violet' : 'border-brand-gray-light'}`}>
                      <span className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-700 block ${sect2InView ? 'text-brand-violet' : 'text-[#7C868C]'}`}>ALLIANZ</span>
                      <p className="font-heading font-bold text-xs text-brand-graphite mt-1.5 mb-1 uppercase tracking-medium">Zürcher Expertennetzwerk</p>
                      <p className="font-sans text-[11px] text-[#7C868C] leading-relaxed">Etablierte Kooperationen mit Notaren, Anwälten und zugelassenen Wirtschaftsprüfern.</p>
                    </div>
                    <div className={`border-l-[1.5px] pl-5 py-2 transition-colors duration-700 ${sect2InView ? 'border-brand-violet' : 'border-brand-gray-light'}`}>
                      <span className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-700 block ${sect2InView ? 'text-brand-violet' : 'text-[#7C868C]'}`}>BESTÄNDIGKEIT</span>
                      <p className="font-heading font-bold text-xs text-brand-graphite mt-1.5 mb-1 uppercase tracking-medium font-semibold">Inhabergeführt seit 1993</p>
                      <p className="font-sans text-[11px] text-[#7C868C] leading-relaxed">Über 30 Jahre kontinuierliche, lückenlose Mandatsbetreuung im Herzen von Zürich.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: The Three Pillars Teaser (Segment 2 - Content script home) */}
              <section ref={sect3Ref} className="bg-white py-16 md:py-24 border-y border-brand-gray-light relative">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                    <div>
                      <span className={`font-sans text-[11px] uppercase tracking-[0.2em] font-black block mb-2 transition-colors duration-700 ${sect3InView ? 'text-brand-violet text-glow' : 'text-brand-gray-medium'}`}>
                        STRUKTURELLE GLIEDERUNG
                      </span>
                      <h3 className="font-display font-bold text-3xl md:text-5xl text-brand-graphite tracking-tight leading-none">
                        Drei Säulen, <br/>sichtbar gemacht.
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveView('angebot')}
                      className={`font-sans text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all duration-700 cursor-pointer ${sect3InView ? 'text-brand-violet border-brand-violet hover:text-brand-coral hover:border-brand-coral' : 'text-brand-gray-medium border-transparent hover:text-brand-graphite'}`}
                    >
                      Gesamtes Leistungsangebot →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {/* Säule 1 */}
                    <div className={`pillar-card border p-10 bg-white transition-all duration-700 relative flex flex-col justify-between ${sect3InView ? 'border-brand-gray-light/80 hover:border-brand-violet' : 'border-brand-gray-light/40'}`}>
                      <div>
                        <div className={`text-[11px] uppercase tracking-widest font-bold mb-4 transition-colors duration-700 ${sect3InView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>01. Säule</div>
                        <h4 className="font-display font-bold text-2xl text-brand-graphite mb-4">Treuhand</h4>
                        <p className="font-sans text-sm text-[#7C868C] leading-relaxed mb-6">
                          Finanzbuchhaltung, Lohnadministration, Zwischen- und Jahresabschlüsse, MWST-Deklaration und strategischer Support bei Ihrer Unternehmensgründung.
                        </p>
                      </div>
                      <div>
                        <div className={`h-[1.5px] w-12 mb-6 transition-colors duration-700 ${sect3InView ? 'bg-brand-violet' : 'bg-brand-gray-light'}`}></div>
                        <button
                          onClick={() => {
                            setPreselectedCategory('treuhand');
                            setActiveView('angebot');
                          }}
                          className={`font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors duration-700 ${sect3InView ? 'text-brand-violet hover:text-brand-coral' : 'text-brand-gray-medium hover:text-brand-graphite'}`}
                        >
                          Details sichten <span className="text-xs">→</span>
                        </button>
                      </div>
                    </div>

                    {/* Säule 2 */}
                    <div className={`pillar-card border p-10 bg-white transition-all duration-700 relative flex flex-col justify-between ${sect3InView ? 'border-brand-gray-light/80 hover:border-brand-violet' : 'border-brand-gray-light/40'}`}>
                      <div>
                        <div className={`text-[11px] uppercase tracking-widest font-bold mb-4 transition-colors duration-700 ${sect3InView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>02. Säule</div>
                        <h4 className="font-display font-bold text-2xl text-brand-graphite mb-4">Beratung</h4>
                        <p className="font-sans text-sm text-[#7C868C] leading-relaxed mb-6">
                          Strategische & personelle Beratung auf absoluter Augenhöhe. Professionelle Unternehmensbewertung und individuelle Nachfolgeplanung vor dem Übergang.
                        </p>
                      </div>
                      <div>
                        <div className={`h-[1.5px] w-12 mb-6 transition-colors duration-700 ${sect3InView ? 'bg-brand-violet' : 'bg-brand-gray-light'}`}></div>
                        <button
                          onClick={() => {
                            setPreselectedCategory('beratung');
                            setActiveView('angebot');
                          }}
                          className={`font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors duration-700 ${sect3InView ? 'text-brand-violet hover:text-brand-coral' : 'text-brand-gray-medium hover:text-brand-graphite'}`}
                        >
                          Details sichten <span className="text-xs">→</span>
                        </button>
                      </div>
                    </div>

                    {/* Säule 3 */}
                    <div className={`pillar-card border p-10 bg-white transition-all duration-700 relative flex flex-col justify-between ${sect3InView ? 'border-brand-gray-light/80 hover:border-brand-violet' : 'border-brand-gray-light/40'}`}>
                      <div>
                        <div className={`text-[11px] uppercase tracking-widest font-bold mb-4 transition-colors duration-700 ${sect3InView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>03. Säule</div>
                        <h4 className="font-display font-bold text-2xl text-brand-graphite mb-4">Organisation</h4>
                        <p className="font-sans text-sm text-[#7C868C] leading-relaxed mb-6">
                          Definition und Überprüfung operativer Verhältnisse. Direkte Überarbeitung und Vereinfachung Ihrer alltäglichen Betriebsprozesse für spürbare Freiräume.
                        </p>
                      </div>
                      <div>
                        <div className={`h-[1.5px] w-12 mb-6 transition-colors duration-700 ${sect3InView ? 'bg-brand-violet' : 'bg-brand-gray-light'}`}></div>
                        <button
                          onClick={() => {
                            setPreselectedCategory('organisation');
                            setActiveView('angebot');
                          }}
                          className={`font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors duration-700 ${sect3InView ? 'text-brand-violet hover:text-brand-coral' : 'text-brand-gray-medium hover:text-brand-graphite'}`}
                        >
                          Details sichten <span className="text-xs">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-10 w-full" />
              </section>

              {/* SECTION: Statement & Philosophie (Abschnitt 3: Haltung/Zitat) */}
              <section ref={sect4Ref} className="bg-white py-20 md:py-28 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-700 mb-6 ${sect4InView ? 'border-brand-violet/20 bg-brand-violet/[0.02] text-brand-violet' : 'border-brand-gray-light bg-transparent text-brand-gray-medium'}`}>
                    <span className="font-display font-bold text-2xl animate-pulse">“</span>
                  </div>
                  
                  <p className="font-display font-bold text-2xl sm:text-3xl lg:text-[38px] text-brand-graphite tracking-tight leading-snug max-w-3xl mx-auto">
                    „Direktheit ist eine unserer Eigenschaften. Sie hilft, meist schneller ans Ziel zu kommen.“
                  </p>
                  
                  <div className={`h-px mx-auto mt-8 mb-4 transition-all duration-700 ${sect4InView ? 'bg-brand-violet/30 w-16' : 'bg-brand-gray-light/40 w-10'}`} />
                  <p className={`font-sans text-[11px] uppercase tracking-widest font-bold transition-colors duration-700 ${sect4InView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>
                    Laura Quabba · Inhaberin seit 1993
                  </p>
                </div>

                {/* Ambient Linear Signature Background */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-25">
                  <LineMotif type="signature" className="w-24 text-brand-violet" />
                </div>
              </section>

              {/* SECTION: References Teaser List (Abschnitt 4 - Content script home) */}
              <section ref={sect5Ref} className="bg-white py-16 md:py-20 border-t border-brand-gray-light">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-3">
                    <div>
                      <span className={`font-sans text-xs font-semibold uppercase tracking-widest block transition-colors duration-700 ${sect5InView ? 'text-brand-violet text-glow' : 'text-brand-gray-medium'}`}>
                        PARTNERVERZEICHNIS
                      </span>
                      <h4 className="font-display font-semibold text-xl text-brand-graphite mt-1">
                        Langjährige Beziehungen zu Zürcher Betrieben
                      </h4>
                    </div>
                    
                    <button
                      onClick={() => setActiveView('references')}
                      className={`font-sans text-xs font-bold uppercase tracking-wider transition-all duration-700 cursor-pointer ${sect5InView ? 'text-brand-violet border-b border-brand-violet' : 'text-brand-gray-medium border-b border-transparent hover:text-brand-graphite'}`}
                    >
                      Sämtliche Referenzen einsehen
                    </button>
                  </div>

                  {/* Clean text list row representing Zürich clients */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`border bg-white p-5 rounded-sm transition-all duration-700 ${sect5InView ? 'border-brand-gray-light/80 hover:border-brand-violet' : 'border-brand-gray-light/40'}`}>
                      <p className="font-heading font-semibold text-sm text-brand-graphite">paradis des innocents</p>
                      <p className="font-sans text-[11px] text-brand-gray-medium mt-1">High-End Fashion & Atelier</p>
                    </div>
                    <div className={`border bg-white p-5 rounded-sm transition-all duration-700 ${sect5InView ? 'border-brand-gray-light/80 hover:border-brand-violet' : 'border-brand-gray-light/40'}`}>
                      <p className="font-heading font-semibold text-sm text-brand-graphite">flo accessoires</p>
                      <p className="font-sans text-[11px] text-brand-gray-medium mt-1">Design & Handel</p>
                    </div>
                    <div className={`border bg-white p-5 rounded-sm transition-all duration-700 ${sect5InView ? 'border-brand-gray-light/80 hover:border-brand-violet' : 'border-brand-gray-light/40'}`}>
                      <p className="font-heading font-semibold text-sm text-brand-graphite">Facing Ltd</p>
                      <p className="font-sans text-[11px] text-brand-gray-medium mt-1">Brand Strategy & Identity</p>
                    </div>
                    <div className={`border bg-white p-5 rounded-sm transition-all duration-700 ${sect5InView ? 'border-brand-gray-light/80 hover:border-brand-violet' : 'border-brand-gray-light/40'}`}>
                      <p className="font-heading font-semibold text-sm text-brand-graphite">Ascolite AG</p>
                      <p className="font-sans text-[11px] text-brand-gray-medium mt-1">Härtestoffe / Technik</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: Contact CTA Banner (Abschnitt 5 - Content script home) */}
              <section ref={sect6Ref} className="bg-white py-16 md:py-24 border-t border-brand-gray-light text-center">
                <div className="max-w-3xl mx-auto px-6">
                  <span className={`font-sans text-xs font-bold uppercase tracking-widest block mb-2 transition-colors duration-700 ${sect6InView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>
                    NÄCHSTER SCHRITT
                  </span>
                  
                  <h3 className="font-display font-semibold text-3xl md:text-4xl text-brand-graphite tracking-tight mb-4">
                    Lassen Sie uns über Ihre Situation sprechen.
                  </h3>
                  
                  <p className="font-sans text-brand-gray-medium text-sm leading-relaxed max-w-md mx-auto mb-8">
                    Ob wiederkehrende Buchhaltung oder strategische Unternehmensnachfolge – wir schaffen Ihnen Freiräume für Ihr Kerngeschäft.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => triggerConsultation('treuhand')}
                      className={`group flex items-center justify-center gap-2 border-[1.5px] px-8 py-4 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-500 rounded-[2px] ${sect6InView ? 'bg-brand-violet border-brand-violet text-white hover:bg-brand-coral hover:border-brand-coral' : 'bg-transparent border-brand-graphite text-brand-graphite hover:border-brand-gray-medium hover:text-brand-gray-medium'}`}
                    >
                      Termin vereinbaren
                    </button>
                    
                    <button
                      onClick={() => setActiveView('contact')}
                      className={`font-sans text-[#D91A21] hover:text-[#E39699] text-xs font-bold uppercase tracking-wider transition-colors duration-700 py-2 cursor-pointer ${sect6InView ? 'text-brand-violet hover:text-brand-coral' : 'text-brand-gray-medium hover:text-brand-graphite'}`}
                    >
                      Unsere Kanzleiräume sichten
                    </button>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {activeView === 'company' && (
            <motion.div
              key="company"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Company onNavigate={setActiveView} />
            </motion.div>
          )}

          {activeView === 'angebot' && (
            <motion.div
              key="angebot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Offerings
                initialCategory={preselectedCategory}
                onOpenConsultation={triggerConsultation}
              />
            </motion.div>
          )}

          {activeView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <About 
                onNavigate={setActiveView} 
                onOpenConsultation={() => triggerConsultation('treuhand')} 
              />
            </motion.div>
          )}

          {activeView === 'references' && (
            <motion.div
              key="references"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <References onOpenConsultation={() => triggerConsultation('treuhand')} />
            </motion.div>
          )}

          {activeView === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Contact preselectedCategory={preselectedCategory} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent global layout footer */}
      <Footer onNavigate={setActiveView} />

    </div>
  );
}
