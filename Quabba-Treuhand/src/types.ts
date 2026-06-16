export type ActiveView = 
  | 'home' 
  | 'company' 
  | 'angebot' 
  | 'about' 
  | 'references' 
  | 'contact';

export type OfferCategory = 'treuhand' | 'beratung' | 'organisation';

export interface ServiceItem {
  id: string;
  category: OfferCategory;
  title: string;
  lead: string;
  details: {
    groupTitle: string;
    items: string[];
  }[];
}

export interface ClientReference {
  name: string;
  industry: string;
  location?: string;
  relationship?: string;
}

export interface ContactInquiry {
  name: string;
  email: string;
  phone: string;
  category: OfferCategory | 'allgemein';
  message: string;
  preferredDate?: string;
  preferredTime?: string;
}
