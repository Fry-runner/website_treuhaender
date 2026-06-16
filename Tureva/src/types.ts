export type Language = 'de' | 'en';

export type ActiveView = 'home' | 'about' | 'services' | 'contact';

export interface ServiceDetail {
  title: string;
  lead: string;
  bullets: string[];
  ctaText: string;
}

export interface TranslationDictionary {
  nav: {
    home: string;
    about: string;
    services: string;
    contact: string;
    clientHub: string;
    subtitle: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    section1Title: string;
    section1Text: string;
    section2Title: string;
    competence1Title: string;
    competence1Text: string;
    competence2Title: string;
    competence2Text: string;
    competence3Title: string;
    competence3Text: string;
    badge1: string;
    badge2: string;
    badge3: string;
    section3Title: string;
    section3Text: string;
    section4Title: string;
    section4Text: string;
    section4Cta: string;
    section5Title: string;
    section5Subtitle: string;
    section5Cta: string;
  };
  about: {
    heroTitle: string;
    introTitle: string;
    introText: string;
    whoWeAreTitle: string;
    whoWeAreText: string;
    targetTitle: string;
    targetSwiss: string;
    targetInt: string;
    targetUs: string;
    teamTitle: string;
    teamSubtitle: string;
    member1Role: string;
    member1Bio: string;
    member2Role: string;
    member2Bio: string;
    member3Role: string;
    member3Bio: string;
  };
  services: {
    heroTitle: string;
    heroSubtitle: string;
    viewDetails: string;
    revision: ServiceDetail;
    accounting: ServiceDetail;
    taxes: ServiceDetail;
    other: {
      title: string;
      lead: string;
      item1Title: string;
      item1Text: string;
      item2Title: string;
      item2Text: string;
      item3Title: string;
      item3Text: string;
      item4Title: string;
      item4Text: string;
      ctaText: string;
    };
  };
  contact: {
    heroTitle: string;
    heroSubtitle: string;
    formName: string;
    formEmail: string;
    formPhone: string;
    formService: string;
    formMessage: string;
    formPlaceholderMessage: string;
    formNewsletter: string;
    formSubmit: string;
    formSuccessTitle: string;
    formSuccessText: string;
    sidebarTitle: string;
    sidebarAddress: string;
    sidebarPhone: string;
    sidebarLanguages: string;
    inquiryListTitle: string;
    noInquiries: string;
  };
  hub: {
    title: string;
    subtitle: string;
    calcTitle: string;
    calcIntro: string;
    revenueLabel: string;
    transactionsLabel: string;
    employeesLabel: string;
    needUSLabel: string;
    needAuditLabel: string;
    estimateButton: string;
    resultTitle: string;
    resultIntro: string;
    bundleSelection: string;
    accountingAndControlling: string;
    swissTaxCompliance: string;
    usTaxFiling: string;
    limitedAudit: string;
    estimatedCost: string;
    monthly: string;
    yearly: string;
    disclaimer: string;
    applyCta: string;
    appliedNotice: string;
  };
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  status: 'Received' | 'In Review' | 'Scheduled_Call' | 'Active';
  estimateMonthly?: number;
}
