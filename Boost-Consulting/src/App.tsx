/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import AccountingView from './components/AccountingView';
import AboutView from './components/AboutView';
import CooperationView from './components/CooperationView';
import PricingView from './components/PricingView';
import ContactView from './components/ContactView';
import LegalDialog from './components/LegalDialog';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [legalType, setLegalType] = useState<'impressum' | 'datenschutz' | null>(null);

  // Auto scroll to top when page changes for seamless dynamic page transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activePage]);

  const handlePageChange = (page: PageId) => {
    setActivePage(page);
  };

  const handleLegalOpen = (type: 'impressum' | 'datenschutz') => {
    setLegalType(type);
  };

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView onPageChange={handlePageChange} />;
      case 'services':
        return <ServicesView onPageChange={handlePageChange} />;
      case 'accounting':
        return <AccountingView onPageChange={handlePageChange} />;
      case 'about':
        return <AboutView onPageChange={handlePageChange} />;
      case 'cooperation':
        return <CooperationView onPageChange={handlePageChange} />;
      case 'pricing':
        return <PricingView onPageChange={handlePageChange} />;
      case 'contact':
        return <ContactView />;
      default:
        return <HomeView onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-navy selection:bg-brand-navy/10 selection:text-brand-navy selection:font-medium selection:border selection:border-indigo-200">
      
      {/* Primary Header/Navigation */}
      <Header activePage={activePage} onPageChange={handlePageChange} />

      {/* Page Workspace Container */}
      <main id="primary-app-workspace" className="flex-1">
        {renderActiveView()}
      </main>

      {/* Primary Footer with full links */}
      <Footer onPageChange={handlePageChange} onOpenLegal={handleLegalOpen} />

      {/* Legal Overlay Modal */}
      <LegalDialog type={legalType} onClose={() => setLegalType(null)} />
    </div>
  );
}
