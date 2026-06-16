/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'services' | 'accounting' | 'about' | 'cooperation' | 'pricing' | 'contact';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string;
  iconName: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  priceText: string;
  features: string[];
  recommended?: boolean;
}

export interface CooperationPartnerType {
  id: string;
  title: string;
  description: string;
  benefits: string[];
}

export interface ContactFormInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  interest: string;
}

export interface CalendarTimeSlot {
  date: string;
  time: string;
  available: boolean;
}
