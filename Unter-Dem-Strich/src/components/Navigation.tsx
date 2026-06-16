import React from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNavigateToService: (serviceId: string) => void;
}

export default function Navigation({ activeTab, setActiveTab, onNavigateToService }: NavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems: { label: string; tab: ActiveTab }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'Über uns', tab: 'ueber-uns' },
    { label: 'Leistungen', tab: 'leistungen' },
    { label: 'Team', tab: 'team' },
    { label: 'Kontakt', tab: 'kontakt' },
  ];

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border/60 transition-colors duration-300">
      <div className="brand-container py-5 flex items-center justify-between">
        {/* Logo containing the recurring line motif */}
        <button
          onClick={() => handleNav('home')}
          className="group flex flex-col items-start focus:outline-none cursor-pointer text-left"
          id="nav-logo"
        >
          <span className="font-display font-bold text-lg tracking-wider text-brand-text uppercase">
            unter dem strich
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="font-mono text-[10px] tracking-widest text-brand-muted uppercase">
              AG · ZÜRICH
            </span>
            {/* The signature thin brand line */}
            <motion.div
              className="h-[2px] bg-brand-blue"
              initial={{ width: 24 }}
              whileHover={{ width: 64 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ width: 36 }}
            />
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10" id="desktop-nav-menu">
          {menuItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleNav(item.tab)}
              className="relative py-2 text-sm font-medium tracking-wide text-brand-text/80 hover:text-brand-text focus:outline-none transition-colors cursor-pointer"
              id={`nav-item-${item.tab}`}
            >
              {item.label}
              {activeTab === item.tab && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-blue"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Mobile Nav Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-brand-text focus:outline-none cursor-pointer"
          aria-label="Menü umschalten"
          id="mobile-nav-toggle"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute top-full left-0 right-0 bg-brand-bg border-b border-brand-border py-6 px-6 flex flex-col gap-5 shadow-sm"
          id="mobile-nav-panel"
        >
          {menuItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleNav(item.tab)}
              className={`text-left py-2 font-display text-lg tracking-wide border-b border-brand-border/30 pb-2 ${
                activeTab === item.tab
                  ? 'text-brand-blue font-semibold pl-2 border-l-2 border-l-brand-blue'
                  : 'text-brand-text/70'
              }`}
              id={`mobile-nav-item-${item.tab}`}
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </header>
  );
}
