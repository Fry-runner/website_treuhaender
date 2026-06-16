import { ActiveView } from '../types';
import { motion } from 'motion/react';
import LineMotif from './LineMotif';
import { Menu, X, Landmark, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenConsultation: () => void;
}

export default function Navigation({ activeView, setActiveView, onOpenConsultation }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { label: string; view: ActiveView }[] = [
    { label: 'Startseite', view: 'home' },
    { label: 'Unternehmen', view: 'company' },
    { label: 'Angebot', view: 'angebot' },
    { label: 'Über uns', view: 'about' },
    { label: 'Referenzen', view: 'references' },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-gray-light">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Typographic Logo signature */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNavClick('home')}
          className="flex flex-col text-left cursor-pointer focus:outline-none group"
        >
          <span className="font-display font-black text-2xl tracking-tighter text-brand-graphite group-hover:text-brand-violet transition-colors">
            QUABBA
          </span>
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-brand-gray-medium font-bold -mt-1 leading-none">
            Treuhand Zürich
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav aria-label="Desktop-Navigation" className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                id={`nav-${item.view}`}
                onClick={() => handleNavClick(item.view)}
                className={`relative font-sans text-[13px] font-bold tracking-wider uppercase py-2 cursor-pointer transition-colors duration-200 ${
                  isActive ? 'text-brand-violet' : 'text-brand-graphite hover:text-brand-violet/80'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-violet"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center">
          <button
            id="nav-cta-consultation"
            onClick={onOpenConsultation}
            className="group flex items-center gap-1.5 border-[1.5px] border-brand-graphite bg-transparent px-5 py-2 text-[12px] font-bold tracking-wider uppercase text-brand-graphite hover:bg-brand-coral hover:border-brand-coral hover:text-white transition-all duration-300 rounded-[2px] cursor-pointer"
          >
            Kontakt
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          id="nav-mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-brand-graphite hover:text-brand-violet focus:outline-none cursor-pointer"
          aria-label="Navigation umschalten"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <motion.div
          id="nav-mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-20 left-0 w-full bg-white border-b border-brand-gray-light shadow-lg md:hidden"
        >
          <div className="px-6 py-8 flex flex-col gap-5">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  id={`nav-mob-${item.view}`}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full text-left py-1 text-base font-sans font-medium tracking-tight ${
                    isActive ? 'text-brand-violet pl-2 border-l-2 border-brand-violet' : 'text-brand-graphite border-l-2 border-transparent pl-2'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            <button
              id="nav-mob-cta"
              onClick={() => {
                setIsOpen(false);
                onOpenConsultation();
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-violet text-white py-3 rounded-[2px] text-sm font-medium tracking-tight hover:bg-brand-coral transition-colors cursor-pointer"
            >
              Termin vereinbaren
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
