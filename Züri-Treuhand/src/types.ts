/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  bullets: string[];
  category: 'treuhand_steuern' | 'beratung_administration' | 'zusatz';
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  serviceCategory: string;
  message: string;
}

export interface TrustMetric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  companyName: string;
}

export enum CompanyType {
  GMBH = 'GmbH',
  AG = 'AG',
  EINZELFIRMA = 'Einzelfirma',
}
