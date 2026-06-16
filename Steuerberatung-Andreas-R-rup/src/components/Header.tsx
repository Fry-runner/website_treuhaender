import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Landmark, FileText, User, Globe, PhoneCall } from 'lucide-react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Landmark className="w-4 h-4" /> },
    { id: 'kanzlei', label: 'Die Kanzlei', icon: <Globe className="w-4 h-4" /> },
    { id: 'ruerup', label: 'Andreas Rürup', icon: <User className="w-4 h-4" /> },
    { id: 'steuerrecht', label: 'D – CH Steuerrecht', icon: <FileText className="w-4 h-4" /> },
    { id: 'international', label: 'International', icon: <Globe className="w-4 h-4" /> },
    { id: 'kontakt', label: 'Kontakt', icon: <PhoneCall className="w-4 h-4" /> }
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    // Scroll to top elegantly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-offwhite/90 backdrop-blur-md border-b border-brand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand/Logo Section */}
          <button 
            onClick={() => handleNavClick('home')}
            className="active:scale-95 transition-transform duration-200 cursor-pointer text-left group"
          >
            <div>
              <span className="font-display text-xl font-semibold tracking-tight text-brand-anthracite">
                Andreas Rürup
              </span>
              <span className="block font-sans text-[8px] uppercase tracking-[0.2em] text-brand-grey transition-colors font-semibold mt-0.5">
                Steuerberatung d · ch
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 font-display text-[11px] uppercase tracking-widest font-medium cursor-pointer transition-colors duration-300 hover:text-brand-anthracite ${
                    isActive ? 'text-brand-anthracite' : 'text-brand-grey'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-anthracite"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Special CTA - Waldgrün action */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Badges for trust */}
            <div className="hidden xl:flex flex-col items-end text-right border-r border-brand-beige pr-4">
              <span className="font-mono text-[9px] text-brand-red uppercase font-semibold tracking-wide">D-CH Zertifiziert</span>
              <span className="font-sans text-[10px] text-brand-grey font-light">Fachberater f. Int. Steuerrecht</span>
            </div>
            
            <button
              onClick={() => handleNavClick('kontakt')}
              className="px-5 py-2.5 bg-brand-anthracite text-white font-sans text-xs uppercase tracking-widest font-semibold border border-transparent rounded-sm hover:bg-black active:scale-95 cursor-pointer transition-all duration-300"
            >
              Kontakt
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-md text-brand-anthracite hover:bg-brand-beige/50 cursor-pointer transition-colors duration-200"
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden border-t border-brand-beige bg-brand-offwhite overflow-hidden shadow-lg absolute w-full left-0 right-0 z-40"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-sm text-left font-display font-medium text-[15px] transition-all duration-200 ${
                      isActive 
                        ? 'bg-brand-beige/25 text-brand-anthracite border-l-2 border-brand-grey pl-3' 
                        : 'text-brand-anthracite hover:bg-brand-beige/30'
                    }`}
                  >
                    <span className={`${isActive ? 'text-brand-anthracite' : 'text-brand-grey'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <div className="pt-4 border-t border-brand-beige">
                <button
                  onClick={() => handleNavClick('kontakt')}
                  className="w-full text-center px-5 py-3.5 bg-brand-anthracite text-white font-sans text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-black transition-colors cursor-pointer"
                >
                  Termin vereinbaren
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
