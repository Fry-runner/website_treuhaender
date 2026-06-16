import React, { useState, useEffect } from 'react';
import { ActiveView, Language } from './types';
import { translations } from './data/translations';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import ServicesView from './components/ServicesView';
import ContactView from './components/ContactView';
import TurevaRibbons from './components/TurevaRibbons';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [lang, setLang] = useState<Language>('de');

  // Shared prefill state from service buttons to contact form
  const [predefinedMessage, setPredefinedMessage] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [transferEstimate, setTransferEstimate] = useState<number>(0);

  // High performance passive scroll observer to highlight closest visible CTA
  useEffect(() => {
    const handleScroll = () => {
      const buttons = document.querySelectorAll('.cta-btn-interactive');
      if (buttons.length === 0) return;

      let closestBtn: Element | null = null;
      let minDistance = Infinity;
      const centerY = window.innerHeight / 2;

      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        // Check if button is within or close to the visible viewport
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
          const btnCenterY = rect.top + rect.height / 2;
          const distance = Math.abs(btnCenterY - centerY);
          if (distance < minDistance) {
            minDistance = distance;
            closestBtn = btn;
          }
        }
      });

      buttons.forEach((btn) => {
        if (btn === closestBtn) {
          btn.classList.add('vibrant-active');
        } else {
          btn.classList.remove('vibrant-active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initial check and periodic polling to catch dynamic layout changes/expansions
    const timer = setTimeout(handleScroll, 100);
    const interval = setInterval(handleScroll, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [activeView]);

  // Retrieve translation node
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-white text-brand-graphite flex flex-col font-sans selection:bg-brand-green selection:text-brand-graphite relative">
      {/* Background flowing curves green ribbons */}
      <TurevaRibbons />

      {/* Premium Navigation Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
        t={t.nav}
      />

      {/* Main Interactive App Container */}
      <main className="flex-grow">
        {/* Render separate views based on state */}
        <div className="animate-fade-in py-6">
          {activeView === 'home' && (
            <HomeView 
              setActiveView={setActiveView} 
              lang={lang} 
              t={t} 
            />
          )}
          {activeView === 'about' && (
            <AboutView 
              setActiveView={setActiveView} 
              lang={lang} 
              t={t} 
            />
          )}
          {activeView === 'services' && (
            <ServicesView
              setActiveView={setActiveView}
              setSelectedService={setSelectedService}
              lang={lang}
              t={t}
            />
          )}
          {activeView === 'contact' && (
            <ContactView
              predefinedMessage={predefinedMessage}
              setPredefinedMessage={setPredefinedMessage}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              transferEstimate={transferEstimate}
              lang={lang}
              t={t}
            />
          )}
        </div>
      </main>

      {/* Corporate signature footer with Tureva design accents */}
      <Footer 
        setActiveView={setActiveView} 
        lang={lang} 
        t={t} 
      />
    </div>
  );
}
