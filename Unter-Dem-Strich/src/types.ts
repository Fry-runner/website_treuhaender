export interface Service {
  id: string;
  number: string;
  title: string;
  lead: string;
  paragraphs: string[];
  ctaText: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string[];
  initials: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
  date: string;
  status: 'Empfangen' | 'In Prüfung' | 'Bereit für Erstgespräch';
}

export type ActiveTab = 'home' | 'ueber-uns' | 'leistungen' | 'team' | 'kontakt';
