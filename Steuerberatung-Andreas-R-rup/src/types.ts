export type Page = 'home' | 'kanzlei' | 'ruerup' | 'steuerrecht' | 'international' | 'kontakt';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: 'dch' | 'international' | 'other';
  message: string;
  createdAt: string;
}

export interface ClientReview {
  id: string;
  text: string;
  category: string;
}
