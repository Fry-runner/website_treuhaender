/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import TrustFactors from './components/TrustFactors';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PrivacyImprint from './components/PrivacyImprint';
import Appointment from './components/Appointment';
import TrustBadges from './components/TrustBadges';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [activeModal, setActiveModal] = useState<'imprint' | 'privacy' | null>(null);
  const [swissTime, setSwissTime] = useState('');

  // Live clock displaying Zürich (Swiss) time
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Zurich',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      try {
        const formatter = new Intl.DateTimeFormat('de-CH', options);
        setSwissTime(formatter.format(new Date()));
      } catch (err) {
        // Fallback if browser timezone lacks Europe/Zurich support
        const now = new Date();
        setSwissTime(now.toLocaleTimeString('de-CH'));
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (pageId: string) => {
    setActiveSection(pageId);
    // Smoothly scroll to the top of the viewport when changing pages
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative bg-white antialiased text-[#333333]">
      {/* Sticky navigation */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Multi-Page Switcher with animations */}
      <main className="pt-[100px] min-h-[70vh]">
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero Section */}
              <Hero onNavigate={handleNavigate} />

              {/* Dynamic Schweizer Trust Signale / Gütesiegel Bar */}
              <TrustBadges />

              {/* Dynamic trust counter metrics */}
              <TrustFactors />

              {/* Summary Grid for Subpages */}
              <section className="py-14 bg-neutral-50/30 border-t border-border-gray relative">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-[1px]" />
                      <span className="font-sans text-[11px] text-brand-blue tracking-widest uppercase font-bold">
                        ZÜRCHER KANZLEI-QUALITÄT
                      </span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-[40px] font-bold tracking-tighter text-brand-blue leading-tight max-w-3xl">
                      Ihr vertrauensvoller Schweizer Kanzleipartner
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Services Feature Link */}
                    <div className="p-8 bg-white border border-border-gray rounded-[2px] transition-shadow duration-300 hover:shadow-xs group flex flex-col justify-between min-h-[260px]">
                      <div>
                        <div className="p-2.5 bg-soft-gray rounded-[2px] text-brand-blue w-fit mb-5">
                          <Compass className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-sans font-bold text-brand-blue text-lg mb-2 border-none">
                          Erstklassige Treuhandservices & Kalkulator
                        </h3>
                        <p className="font-sans text-xs text-neutral-500 leading-relaxed font-light mb-6">
                          Entdecken Sie unser breites Spektrum an Dienstleistungen von der Steuererklärung für Privatpersonen und KMUs bis hin zur Lohnbuchhaltung und Mehrwertsteuerabrechnung. Nutzen Sie direkt unseren Züri-Kalkulator.
                        </p>
                      </div>
                      <button
                        onClick={() => handleNavigate('services')}
                        className="flex items-center text-xs font-sans font-bold tracking-widest uppercase text-brand-blue group-hover:translate-x-1.5 transition-transform duration-300 text-left w-fit cursor-pointer"
                      >
                        <span>Dienstleistungen & Kalkulator ansehen</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-2" />
                      </button>
                    </div>

                    {/* About Us Feature Link */}
                    <div className="p-8 bg-white border border-border-gray rounded-[2px] transition-shadow duration-300 hover:shadow-xs group flex flex-col justify-between min-h-[260px]">
                      <div>
                        <div className="p-2.5 bg-soft-gray rounded-[2px] text-brand-blue w-fit mb-5">
                          <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-sans font-bold text-brand-blue text-lg mb-2 border-none">
                          Über Uns & Unsere Kanzleiphilosophie
                        </h3>
                        <p className="font-sans text-xs text-neutral-500 leading-relaxed font-light mb-6">
                          Erfahren Sie mehr über unsere Werte, unser Team und wie wir modernste Digital-Tools mit traditioneller, diskreter Schweizer Beratungskompetenz kombinieren, um Ihnen die Administration abzunehmen.
                        </p>
                      </div>
                      <button
                        onClick={() => handleNavigate('about')}
                        className="flex items-center text-xs font-sans font-bold tracking-widest uppercase text-brand-blue group-hover:translate-x-1.5 transition-transform duration-300 text-left w-fit cursor-pointer"
                      >
                        <span>Mehr über uns erfahren</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeSection === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <About />
            </motion.div>
          )}

          {activeSection === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Services />
            </motion.div>
          )}

          {activeSection === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Contact />
            </motion.div>
          )}

          {activeSection === 'appointment' && (
            <motion.div
              key="appointment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Appointment onNavigateHome={() => handleNavigate('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Repeating brand identifier, legal indicators */}
      <Footer onNavigate={handleNavigate} onOpenModal={(type) => setActiveModal(type)} />

      {/* Accessible legal dialog panels */}
      <PrivacyImprint type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
