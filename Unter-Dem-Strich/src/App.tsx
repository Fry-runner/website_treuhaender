import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Users, 
  ArrowRight,
  ExternalLink,
  Clock
} from 'lucide-react';

import { SERVICES, TEAM, PHILOSOPHY_PRINCIPLES } from './data';
import { ActiveTab, Service } from './types';
import Navigation from './components/Navigation';
import FinanceSimulator from './components/FinanceSimulator';
import ServiceQuiz from './components/ServiceQuiz';
import ContactForm from './components/ContactForm';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('analyse-beratung');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update dynamic clock in footer matching premium corporate office telemetry
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('de-CH', {
          timeZone: 'Europe/Zurich',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' (Zürich, CH)'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper routine to deep-link to a service detail view
  const handleNavigateToServiceDetail = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveTab('leistungen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper routine to guide user from Quiz or Hero straight to Contact with correct service preselected
  const handleNavigateToContactWithService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveTab('kontakt');
    // Scroll smoothly to form
    setTimeout(() => {
      const formEl = document.getElementById('form-contact-uds');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col selection:bg-brand-rose selection:text-brand-text relative">
      
      {/* Signature Line (Top) - Matches Swiss Strategic Theme signature */}
      <div className="w-full h-1.5 bg-brand-blue sticky top-0 z-50"></div>
      
      {/* Sticky Top Navigation Bar */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNavigateToService={handleNavigateToServiceDetail} 
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* ========================================================================= */}
            {/* 1. HOME VIEW */}
            {/* ========================================================================= */}
            {activeTab === 'home' && (
              <div id="home-view" className="space-y-16 md:space-y-28 xl:space-y-36 pb-20">
                
                {/* Hero Section */}
                <section className="brand-container pt-16 md:pt-28 pb-10" id="hero-sec">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* Hero Header Line (Left Block) */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase">
                          UNTER DEM STRICH AG
                        </span>
                        <div className="h-[2px] w-12 bg-brand-blue" />
                      </div>

                      <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-brand-text">
                        Was am Ende <br />
                        <span className="relative inline-block pb-[7px]">
                          zählt.
                          {/* The signature under-line accentating the key word */}
                          <motion.span 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                            className="absolute bottom-1 md:bottom-2 left-0 h-[3px] bg-brand-rose pl-0"
                          />
                        </span>
                      </h1>

                      <p className="font-sans text-lg md:text-xl text-brand-text/80 leading-relaxed max-w-2xl font-light">
                        Betriebswirtschaftliche Beratung für Unternehmen, die Klarheit über ihre Zahlen, ihre Organisation und ihre nächsten strategischen Schritte wollen.
                      </p>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                        <button
                          onClick={() => handleNavigateToContactWithService('analyse-beratung')}
                          className="px-6 py-4 bg-brand-rose/95 hover:bg-brand-rose text-brand-text font-semibold text-xs tracking-wider uppercase font-mono transition-colors duration-200 cursor-pointer text-center"
                          id="hero-cta-primary"
                        >
                          Beratung anfragen
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('leistungen');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="hover-underline-anim text-sm font-semibold tracking-wide text-brand-blue py-3 px-1 inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                          id="hero-cta-secondary"
                        >
                          Leistungen ansehen <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Minimal decorative accent explaining the name (Right Block) */}
                    <div className="lg:col-span-4 lg:mt-20 border-l border-brand-border/80 pl-6 space-y-4">
                      <span className="font-mono text-[10px] text-brand-muted tracking-widest uppercase block">
                        UNSERE PERSPEKTIVE
                      </span>
                      <p className="text-xs text-brand-muted leading-relaxed italic">
                        "In einer Welt voller Folien und geschliffener Beratersprache konzentrieren wir uns auf die reine Essenz. Jedes Projekt, jedes Coaching, jedes Risiko-Framework steht im Dienst der Frage: Was bleibt unter dem Strich?"
                      </p>
                      <div className="h-[1px] w-12 bg-brand-blue" />
                    </div>
                  </div>
                </section>

                {/* Section 1 - Einleitung / Positionierung */}
                <section className="brand-container py-6" id="intro-positioning">
                  <div className="max-w-3xl space-y-6">
                    <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase block">
                      PERSÖNLICHER ANSPRUCH
                    </span>
                    <p className="font-display font-medium text-2xl md:text-3xl text-brand-text tracking-tight leading-snug">
                      unter dem strich AG begleitet Schweizer Unternehmen bei Strategie, Organisation, anspruchsvollen Projekten und Risikofragen – mit dem klaren Anspruch, am Ende nicht nur theoretische Konzepte, sondern messbare Ergebnisse zu liefern.
                    </p>
                    <p className="text-brand-muted text-sm leading-relaxed">
                      Unsere Herangehensweise ist pragmatisch und direkt. Wir verzichten bewusst auf unlesbare Foliensätze und schematische Schablonen. Stattdessen analysieren wir schonungslos die Ist-Situation, hören genau zu und entwickeln massgeschneiderte Massnahmen, die wir gemeinsam mit Ihnen auf die Strasse bringen.
                    </p>
                  </div>
                </section>

                {/* Section 2 - Leistungsübersicht (5 Kacheln) */}
                <section className="brand-container py-6" id="summary-services">
                  <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div className="space-y-2">
                        <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase block">
                          DIENSTLEISTUNGEN
                        </span>
                        <h2 className="font-display font-medium text-3xl md:text-4xl tracking-tight text-brand-text">
                          Unsere fünf Kernbereiche
                        </h2>
                      </div>
                      <p className="text-brand-muted text-sm max-w-sm">
                        Klicken Sie auf ein Fachgebiet, um zu den detaillierten Vorgehensweisen und Praxis-Arrangements zu gelangen.
                      </p>
                    </div>

                    {/* The 5 modular service cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6" id="services-grid-home">
                      {SERVICES.map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => handleNavigateToServiceDetail(srv.id)}
                          className="text-left w-full border border-brand-border hover:border-brand-blue bg-brand-bg transition-all duration-300 p-6 flex flex-col justify-between min-h-[260px] group cursor-pointer focus:outline-none"
                          id={`card-home-[${srv.id}]`}
                        >
                          <div>
                            {/* Number element in beautiful solid Royalblue */}
                            <span className="font-mono font-bold text-3xl text-brand-blue/35 group-hover:text-brand-blue transition-colors block mb-6">
                              {srv.number}
                            </span>
                            <h3 className="font-display font-semibold text-base tracking-tight text-brand-text group-hover:text-brand-blue transition-colors mb-2">
                              {srv.title}
                            </h3>
                            <p className="text-brand-muted text-xs leading-relaxed line-clamp-4">
                              {srv.lead}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-brand-text/50 group-hover:text-brand-blue pt-4 transition-colors">
                            <span>Details ansehen</span>
                            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 3 - Working Values & Principles */}
                <section className="brand-container py-6" id="working-principles">
                  <div className="border-t border-b border-brand-border/75 py-12 md:py-16">
                    <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase block mb-10 text-center">
                      UNSERE GRUNDSÄTZE · WIE WIR ARBEITEN
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12" id="principles-cards">
                      {PHILOSOPHY_PRINCIPLES.map((pri, idx) => (
                        <div key={idx} className="space-y-4 relative">
                          {/* Beautiful vertical line separator on desktop */}
                          {idx > 0 && (
                            <div className="hidden md:block absolute -left-6 top-0 bottom-0 w-[1px] bg-brand-border/60" />
                          )}

                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-brand-blue" />
                            <h4 className="font-display font-semibold text-lg text-brand-text">
                              {pri.title}
                            </h4>
                          </div>
                          <p className="text-brand-muted text-sm leading-relaxed">
                            {pri.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Interactive Feature: EBIT / Bottom Line Consulting Simulator */}
                <section className="brand-container py-6" id="live-simulator">
                  <div className="space-y-6">
                    <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase block text-center">
                      INTERAKTIVE ERTRAGSOPTIMIERUNG
                    </span>
                    <FinanceSimulator />
                  </div>
                </section>

                {/* Interactive Feature 2: Pre-Consulting Bedarfs-Quiz Check */}
                <section className="brand-container py-6" id="live-quiz-portal">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase">
                          ENTSCHEIDUNGSHILFE
                        </span>
                        <div className="h-[1px] w-6 bg-brand-border" />
                      </div>
                      <h2 className="font-display font-medium text-3xl tracking-tight leading-tight text-brand-text">
                        Welche Lösung passt zu Ihnen?
                      </h2>
                      <p className="text-brand-muted text-sm leading-relaxed">
                        Nutzen Sie unseren dreistufigen, anonymen Bedarfs-Check. Das System evaluiert Ihre operativen Prioritäten und schlägt Ihnen direkt die effizienteste Beratungssequenz vor.
                      </p>
                      
                      <div className="p-4 border border-brand-border bg-brand-bg/50 rounded-sm">
                        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-brand-blue mb-1">
                          <Clock size={13} strokeWidth={2} /> Zeitbedarf: 1 Minute
                        </div>
                        <p className="text-xs text-brand-muted leading-relaxed">
                          Keine Angabe von persönlichen Daten erforderlich. Ergebnis sofort sichtbar.
                        </p>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-8">
                      <ServiceQuiz 
                        onSelectService={handleNavigateToServiceDetail} 
                        onNavigateToContact={handleNavigateToContactWithService} 
                      />
                    </div>
                  </div>
                </section>

                {/* Section 4 - Team-Teaser */}
                <section className="brand-container py-6" id="home-team-teaser">
                  <div className="bg-brand-blue/5 border border-brand-blue/20 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 rounded-sm">
                    <div className="space-y-3">
                      <span className="font-mono text-[10px] tracking-widest text-brand-blue font-bold uppercase block">
                        BERATER-TEAM
                      </span>
                      <h3 className="font-display font-medium text-2xl tracking-tight text-brand-text">
                        Erfahrung aus hunderten Mandaten.
                      </h3>
                      <p className="text-brand-muted text-sm max-w-xl">
                        Wir sind keine Berufstheoretiker, sondern praxiserprobte Partner mit fundiertem akademischem Fundament und echten Gründungsbiografien in Zürich.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('team');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-3.5 border-2 border-brand-text hover:bg-brand-text hover:text-brand-bg text-brand-text text-xs tracking-wider uppercase font-mono transition-colors duration-200 cursor-pointer shrink-0 rounded-none"
                      id="home-btn-to-team"
                    >
                      Team kennenlernen
                    </button>
                  </div>
                </section>

                {/* Section 5 - Final Footer-CTA */}
                <section className="brand-container py-10" id="final-contact-teaser-home">
                  <div className="text-center max-w-2xl mx-auto space-y-6">
                    <h3 className="font-display font-medium text-3xl md:text-4xl tracking-tight text-brand-text">
                      Lassen Sie uns über Ihre Situation sprechen.
                    </h3>
                    <p className="text-brand-muted text-sm leading-relaxed">
                      Gerne evaluieren wir in einem unverbindlichen 30-minütigen Erstgespräch Ihre Fragestellung und zeigen Hebelpunkte auf.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => handleNavigateToContactWithService('analyse-beratung')}
                        className="px-8 py-4.5 bg-brand-rose/95 hover:bg-brand-rose text-brand-text font-bold text-xs tracking-wider uppercase font-mono transition-all duration-200 cursor-pointer rounded-none"
                        id="final-contact-cta-btn"
                      >
                        Kontakt aufnehmen
                      </button>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. UEBER UNS VIEW */}
            {/* ========================================================================= */}
            {activeTab === 'ueber-uns' && (
              <div id="ueber-uns-view" className="brand-container py-16 md:py-24 space-y-16 md:space-y-28">
                
                {/* Intro Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" id="about-intro">
                  <div className="lg:col-span-8 space-y-6">
                    <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase block">
                      ÜBER UNS
                    </span>
                    <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-tight text-brand-text">
                      Beratung, die zu Ende <br />gedacht ist.
                    </h1>
                    <p className="text-brand-text/90 text-lg font-light leading-relaxed">
                      Gegründet in Zürich-West, ist die unter dem strich AG eine spezialisierte betriebswirtschaftliche Boutique-Beratung für kleine und mittlere Schweizer Unternehmen (KMU) sowie technologieorientierte Start-ups.
                    </p>
                    <p className="text-brand-muted text-sm leading-relaxed">
                      Wir glauben, dass hervorragende Beratung sich nicht an der Anzahl der generierten Folien misst, sondern am tatsächlichen betriebswirtschaftlichen Nutzen, der nach Projektabschluss übrigbleibt. Unser Name ist unsere Philosophie: Am Ende muss das Ergebnis stimmen.
                    </p>
                  </div>
                  
                  {/* Quick telemetry stats block to add visual interest while staying strictly minimal */}
                  <div className="lg:col-span-4 border border-brand-border p-6 rounded-sm space-y-6 bg-brand-bg">
                    <span className="font-mono text-[10px] text-brand-blue font-bold tracking-widest uppercase block">
                      ORGANISATION AG
                    </span>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-brand-muted block font-mono">STANDORT</span>
                        <span className="text-sm font-semibold text-brand-text">Limmatstrasse, Zürich</span>
                      </div>
                      <div>
                        <span className="text-xs text-brand-muted block font-mono">FOKUSSEKTOR</span>
                        <span className="text-sm font-semibold text-brand-text">KMU, Start-ups & NPOs</span>
                      </div>
                      <div>
                        <span className="text-xs text-brand-muted block font-mono">GRÜNDUNGSJAHR</span>
                        <span className="text-sm font-semibold text-brand-text">2019</span>
                      </div>
                    </div>
                    <div className="h-[2px] bg-brand-blue/30 w-full" />
                  </div>
                </div>

                {/* Philosophy Section featuring a freestanding Quote */}
                <div className="py-8 border-t border-b border-brand-border/60" id="philosophy-quote-box">
                  <span className="font-mono text-xs text-brand-muted uppercase block mb-6 text-center">
                    PHILOSOPHIE & EXPERTENHALTUNG
                  </span>
                  
                  <div className="max-w-4xl mx-auto text-center space-y-6">
                    {/* Brand line motif */}
                    <div className="w-16 h-[2.5px] bg-brand-blue mx-auto" />
                    
                    <p className="font-display font-light text-2xl md:text-4xl italic text-brand-text leading-snug tracking-tight">
                      «Wir messen den Beratungserfolg nicht am Applaus während der Konzepterstellung, sondern am reinen Ertragswachstum, der Prozessstabilität und der Risikoentlastung am Ende des Folgejahres.»
                    </p>
                    <p className="font-mono text-xs text-brand-blue font-semibold uppercase tracking-wider">
                      — Juan Widmer, Gründer & Partner
                    </p>
                  </div>
                </div>

                {/* target clients section */}
                <div className="space-y-10" id="about-target-audience">
                  <div className="text-center space-y-3">
                    <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase block">
                      MANDANTSCHAFT
                    </span>
                    <h2 className="font-display font-semibold text-2xl tracking-tight text-brand-text">
                      Für wen wir wirkungsvolle Lösungen entwickeln
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="border border-brand-border p-6 rounded-sm">
                      <span className="font-mono text-xs text-brand-blue font-bold block mb-4">
                        A · SCHWEIZER KMU
                      </span>
                      <h3 className="font-display font-medium text-lg text-brand-text mb-2">
                        Prozessreife & Stabilisierung
                      </h3>
                      <p className="text-brand-muted text-xs leading-relaxed">
                        Wir unterstützen mittelständische Familien- und Inhaberbetriebe dabei, gewachsene Strukturen zu professionalisieren, Controlling-Prozesse aufzubauen und Nachfolgeregelungen strukturiert zu begleiten.
                      </p>
                    </div>

                    <div className="border border-brand-border p-6 rounded-sm">
                      <span className="font-mono text-xs text-brand-blue font-bold block mb-4">
                        B · JUNGE START-UPS
                      </span>
                      <h3 className="font-display font-medium text-lg text-brand-text mb-2">
                        Kaufmännisches Skelett
                      </h3>
                      <p className="text-brand-muted text-xs leading-relaxed">
                        Technologiefokussierten Gründern helfen wir, in der Frühphase ein tragfähiges kaufmännisches Gerüst zu errichten. Von Finanzplanung bis zu Vertriebsprozessen und Verträgen – einfach organisiert.
                      </p>
                    </div>

                    <div className="border border-brand-border p-6 rounded-sm">
                      <span className="font-mono text-xs text-brand-blue font-bold block mb-4">
                        C · NPOS & STIFTUNGEN
                      </span>
                      <h3 className="font-display font-medium text-lg text-brand-text mb-2">
                        Effizienz & Governance
                      </h3>
                      <p className="text-brand-muted text-xs leading-relaxed">
                        Gemeinnützige Inhaber, Stiftungen und NGOs schätzen unsere unabhängige Zweitmeinung und die Transparenzsteigerung bei Budgeteinsätzen und Governance-Auditierungen.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom navigation helper */}
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center pt-8 border-t border-brand-border/40">
                  <button
                    onClick={() => {
                      setActiveTab('leistungen');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto text-center px-6 py-3.5 border border-brand-text hover:bg-brand-text hover:text-brand-bg text-brand-text text-xs tracking-wider uppercase font-mono transition-colors duration-200 cursor-pointer"
                    id="btn-about-to-services"
                  >
                    Dienstleistungen sichten
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('team');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto text-center px-6 py-3.5 bg-brand-rose hover:bg-brand-rose/90 text-brand-text font-semibold text-xs tracking-wider uppercase font-mono transition-colors duration-200 cursor-pointer"
                    id="btn-about-to-team"
                  >
                    Berater kennenlernen
                  </button>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. LEISTUNGEN (SERVICES) VIEW */}
            {/* ========================================================================= */}
            {activeTab === 'leistungen' && (
              <div id="leistungen-view" className="brand-container py-16 md:py-24 space-y-12">
                
                {/* Intro Headers */}
                <div className="space-y-4 max-w-2xl" id="services-intro">
                  <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase block">
                    LEISTUNGSSPEKTRUM
                  </span>
                  <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-brand-text">
                    Leistungen
                  </h1>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    Jedes Mandat ist anders. Diese fünf definierten Fachbereiche bilden den Rahmen, in dem wir typischerweise hochspezialisierte Beiträge leisten.
                  </p>
                </div>

                {/* Layout comprising an interactive left sidebar selector and detailed right narrative pane */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4" id="services-interactive-panels">
                  
                  {/* Sidebar (4 columns) */}
                  <div className="lg:col-span-4 space-y-3">
                    <span className="font-mono text-[9px] text-brand-muted tracking-wider uppercase block mb-2 font-bold">
                      BEREICH AUSWÄHLEN (01 – 05)
                    </span>
                    {SERVICES.map((srv) => (
                      <button
                        key={srv.id}
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`w-full text-left p-4 border flex items-center justify-between transition-all duration-200 cursor-pointer focus:outline-none ${
                          selectedServiceId === srv.id
                            ? 'border-brand-blue bg-brand-bg pl-6 border-l-4'
                            : 'border-brand-border/80 hover:border-brand-text/50'
                        }`}
                        id={`btn-service-select-${srv.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-xs font-bold ${
                            selectedServiceId === srv.id ? 'text-brand-blue' : 'text-brand-muted'
                          }`}>
                            {srv.number}
                          </span>
                          <span className={`text-sm font-medium ${
                            selectedServiceId === srv.id ? 'text-brand-text font-semibold' : 'text-brand-text/80'
                          }`}>
                            {srv.title}
                          </span>
                        </div>
                        <ChevronRight size={14} className={selectedServiceId === srv.id ? 'text-brand-blue' : 'text-brand-muted'} />
                      </button>
                    ))}
                  </div>

                  {/* Detailed Pane (8 columns) */}
                  <div className="lg:col-span-8">
                    {SERVICES.map((srv) => {
                      if (srv.id !== selectedServiceId) return null;
                      return (
                        <motion.div
                          key={srv.id}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border border-brand-border p-6 md:p-10 rounded-sm space-y-6 relative bg-brand-bg/60 shadow-sm"
                          id={`detail-panel-${srv.id}`}
                        >
                          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-blue" />
                          
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold tracking-widest text-brand-blue bg-brand-blue/5 px-2.5 py-1 rounded-sm">
                              BEREICH {srv.number}
                            </span>
                            <span className="font-mono text-[10px] text-brand-muted">
                              MANDATSTYP: EXKLUSIV
                            </span>
                          </div>

                          <h3 className="font-display font-medium text-2xl md:text-3xl tracking-tight text-brand-text">
                            {srv.title}
                          </h3>

                          {/* Lead statement */}
                          <p className="text-base font-medium text-brand-text/90 italic border-l-2 border-brand-rose pl-4 leading-relaxed">
                            {srv.lead}
                          </p>

                          <div className="space-y-6 text-sm text-brand-text/80 leading-relaxed pt-2">
                            {srv.paragraphs.map((par, pIdx) => (
                              <p key={pIdx}>
                                {par}
                              </p>
                            ))}
                          </div>

                          <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-brand-muted block uppercase">
                                VERFÜGBARKEIT
                              </span>
                              <span className="text-xs text-brand-text font-bold flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-500 inline-block animate-ping" /> Kapazitäten verfügbar (Kanton Zürich & Region Mittelland)
                              </span>
                            </div>

                            <button
                              onClick={() => handleNavigateToContactWithService(srv.id)}
                              className="px-6 py-3 bg-brand-rose/95 hover:bg-brand-rose text-brand-text font-semibold text-xs tracking-wider uppercase font-mono transition-colors duration-200 cursor-pointer text-center rounded-none"
                              id={`btn-service-action-${srv.id}`}
                            >
                              {srv.ctaText}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. TEAM VIEW */}
            {/* ========================================================================= */}
            {activeTab === 'team' && (
              <div id="team-view" className="brand-container py-16 md:py-24 space-y-16">
                
                {/* Header info */}
                <div className="space-y-4 max-w-2xl" id="team-header">
                  <span className="font-mono text-xs text-brand-blue tracking-widest font-semibold uppercase block">
                    DAS TEAM
                  </span>
                  <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-brand-text">
                    Die Menschen hinter <br />unter dem strich.
                  </h1>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    Wir vereinen fundiertes betriebswirtschaftliches Handwerkszeug mit langjähriger kaufmännischer Praxis. Wir sprechen Ihre Sprache – direkt, sachorientiert und partnerschaftlich.
                  </p>
                </div>

                {/* Team Members List */}
                <div className="space-y-12 md:space-y-20 pt-4" id="team-profiles-list">
                  {TEAM.map((member, idx) => (
                    <div
                      key={member.id}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start border-t border-brand-border/60 pt-10"
                      id={`team-member-row-${member.id}`}
                    >
                      {/* Left: Monogram and Role */}
                      <div className="lg:col-span-4 flex flex-row sm:flex-col items-center sm:items-start gap-4">
                        {/* Minimalist Monogram Block */}
                        <div className="h-24 w-24 bg-brand-blue flex items-center justify-center shrink-0 rounded-none relative overflow-hidden">
                          {/* Fine vector accent */}
                          <div className="absolute top-1 left-1 font-mono text-[9px] text-[#FAF9F6]/40 uppercase">
                            UDS
                          </div>
                          <span className="font-display font-medium text-3xl text-brand-bg tracking-wide uppercase">
                            {member.initials}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-display font-bold text-xl text-brand-text sm:mt-4">
                            {member.name}
                          </h3>
                          <p className="font-mono text-[10px] text-brand-blue tracking-wider font-semibold uppercase mt-0.5">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {/* Right: Biography Narrative */}
                      <div className="lg:col-span-8 space-y-4">
                        {member.bio.map((para, pIdx) => (
                          <p key={pIdx} className="text-brand-text/95 text-sm leading-relaxed font-light">
                            {para}
                          </p>
                        ))}

                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="px-2.5 py-1 bg-brand-border/40 text-brand-text/70 font-mono text-[9px] uppercase tracking-wider rounded-none">
                            Zürich-Spezialist
                          </span>
                          <span className="px-2.5 py-1 bg-brand-border/40 text-brand-text/70 font-mono text-[9px] uppercase tracking-wider rounded-none">
                            Pragmatischer Ansatz
                          </span>
                          <span className="px-2.5 py-1 bg-brand-border/40 text-brand-text/70 font-mono text-[9px] uppercase tracking-wider rounded-none">
                            EBIT-Fokus
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Team Footer statement */}
                <div className="border border-brand-blue/30 bg-brand-blue/[0.01] p-6 text-center max-w-xl mx-auto rounded-none">
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Je nach Komplexität und Fachspezifik Ihres Projekts greifen wir auf ein erprobtes Netzwerk aus Treuhändern, Steuerexperten und Fachanwälten im Raum Zürich zurück. Sie erhalten alles aus einer Hand.
                  </p>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 5. KONTAKT VIEW */}
            {/* ========================================================================= */}
            {activeTab === 'kontakt' && (
              <div id="kontakt-view" className="brand-container py-16 md:py-24">
                <ContactForm preselectedServiceId={selectedServiceId} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* GLOBAL FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-brand-bg border-t border-brand-border/80 pt-16 pb-12 transition-colors duration-300">
        
        {/* Core footer Grid */}
        <div className="brand-container grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12">
          
          {/* Column 1: Brand & Zurich Clock */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-display font-extrabold text-base tracking-widest text-brand-text uppercase block">
              unter dem strich AG
            </span>
            <p className="text-brand-muted text-xs leading-relaxed max-w-sm">
              Ruhige, präzise und kaufmännische Beratung direkt am Escher-Wyss-Platz. Was zählt, ist das Resultat am Ende des Beratungsprozesses.
            </p>

            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-mono text-brand-muted block uppercase">
                ZÜRICH LOKALZEIT (GMT+1)
              </span>
              <span className="font-mono text-xs text-brand-blue font-semibold block">
                {currentTime || '08:30:00 (Europe/Zurich)'}
              </span>
            </div>
          </div>

          {/* Column 2: Sitemap Navigation links */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-mono text-[10px] text-brand-blue font-bold tracking-widest uppercase block">
              SITEMAP
            </span>
            <ul className="space-y-2 text-xs text-brand-muted font-medium">
              <li>
                <button 
                  onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-blue transition-colors cursor-pointer text-left"
                >
                  Startseite
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('ueber-uns'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-blue transition-colors cursor-pointer text-left"
                >
                  Über uns (Philosophie)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('leistungen'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-blue transition-colors cursor-pointer text-left"
                >
                  Leistungsspektrum
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('team'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-blue transition-colors cursor-pointer text-left"
                >
                  Berater-Team
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('kontakt'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-blue transition-colors cursor-pointer text-left"
                >
                  Direkter Kontakt
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Professional Regulatory compliance info */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-[10px] text-brand-blue font-bold tracking-widest uppercase block">
              REGULIERUNG & AGENTUR-INFOS
            </span>
            <p className="text-[11px] text-brand-muted leading-relaxed">
              Eingetragen im Handelsregister des Kantons Zürich.<br />
              Firmen-Nr. (UID): CHE-291.004.991 HR<br />
              Sitz: Zürich, Schweiz.<br />
              Prüfungsorgan: Gesetzliches Revisionsorgan vorhanden.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-mono text-brand-muted block">
                ZUGANGSVERSCHLÜSSELUNG
              </span>
              <span className="text-[9px] font-mono text-green-700 bg-green-50 px-1.5 py-0.5 rounded-sm inline-block mt-0.5 border border-green-200">
                SSL SECURED CONNECT
              </span>
            </div>
          </div>

        </div>

        {/* The Signature - A thin royalblue line covering full width */}
        <div className="w-full h-[1.5px] bg-brand-blue opacity-85 my-6" />

        {/* Copyright and Legal boilerplate */}
        <div className="brand-container flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-brand-muted font-mono">
          <span>
            © {new Date().getFullYear()} unter dem strich AG. Alle kaufmännischen Rechte vorbehalten.
          </span>
          
          <div className="flex gap-6">
            <span className="hover:text-brand-text transition-colors cursor-not-allowed">
              Impressum
            </span>
            <span className="hover:text-brand-text transition-colors cursor-not-allowed">
              Datenschutzrichtlinie
            </span>
            <span className="hover:text-brand-text transition-colors cursor-not-allowed flex items-center gap-0.5">
              CH-DE <ExternalLink size={10} />
            </span>
          </div>
        </div>

      </footer>
    </div>
  );
}
