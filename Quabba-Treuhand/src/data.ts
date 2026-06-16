import { ServiceItem, ClientReference } from './types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'treuhand',
    category: 'treuhand',
    title: 'Treuhand',
    lead: 'Zuverlässige Führung Ihrer Geschäftsbücher – als Basis für fundierte Entscheidungen.',
    details: [
      {
        groupTitle: 'Rechnungswesen',
        items: [
          'Finanzbuchhaltung',
          'Debitoren- und Kreditorenbuchhaltung',
          'MWST-Abrechnungen',
          'Erstellung von transparenten Zwischen- und Jahresabschlüssen'
        ]
      },
      {
        groupTitle: 'Finanzplanung',
        items: [
          'Budgetierung auf Stunden-, Projekt- oder Abteilungsebene',
          'Liquiditätsplanung als vorausschauende Grundlage für unternehmerische Entscheidungen'
        ]
      },
      {
        groupTitle: 'Auswertungen & Analysen',
        items: [
          'Bilanz- und Erfolgsanalyse',
          'Produkte- und Kostenanalyse',
          'Auswertung von Trends zur Umwandlung von Daten in strategische Erkenntnisse'
        ]
      },
      {
        groupTitle: 'Personaladministration',
        items: [
          'Vollständige Lohnbuchhaltung',
          'Verarbeitung und Pflege von Personalunterlagen',
          'Deklarationen von Sozial- und Personalversicherungen',
          'Erstellung von offiziellen Lohnausweisen'
        ]
      },
      {
        groupTitle: 'Family-Office',
        items: [
          'Privater Finanzüberblick',
          'Übersichtliche Aufstellung von privaten Einnahmen und Ausgaben',
          'Private Budgetierung',
          'Sichere Organisation und Bearbeitung der privaten Post'
        ]
      },
      {
        groupTitle: 'Unternehmensgründung',
        items: [
          'Beratung bei der Wahl der optimalen Rechtsform',
          'Professionelle Begleitung der Firmengründung',
          'Anmeldung bei Ämtern, Registern und relevanten Versicherungen'
        ]
      }
    ]
  },
  {
    id: 'beratung',
    category: 'beratung',
    title: 'Beratung',
    lead: 'Wer alleine an der Spitze steht, profitiert von Beratung auf Augenhöhe.',
    details: [
      {
        groupTitle: 'Individuelle Beratung',
        items: [
          'Strategische und personelle Beratung für Geschäftsführer und Inhaber',
          'Etablierung als neutrale Sparringspartnerin in unternehmerischen Kernfragen',
          'Reflektion operativer Hürden und langfristiger Ziele'
        ]
      },
      {
        groupTitle: 'Nachfolgeregelung',
        items: [
          'Frühzeitige, strukturierte Nachfolgeplanung',
          'Objektive Unternehmensbewertung nach Schweizer Standards',
          'Individuelle, einfühlsame Beratung für einen geordneten und rechtssicheren Übergang'
        ]
      }
    ]
  },
  {
    id: 'organisation',
    category: 'organisation',
    title: 'Organisation',
    lead: 'Klare Abläufe steigern die Effizienz im gesamten Unternehmen.',
    details: [
      {
        groupTitle: 'Strukturen & Prozesse',
        items: [
          'Definition, sachliche Überprüfung und Optimierung struktureller Verhältnisse',
          'Zielgerichtete Vereinfachung täglicher oder wiederkehrender Prozesse',
          'Gezielte Ressourcen-Einsparung zur Maximierung Ihrer Kernaktivitäten'
        ]
      }
    ]
  }
];

export const CLIENT_REFERENCES: ClientReference[] = [
  { name: 'Ascolite AG', industry: 'Härtestoffe & Maschinentechnik' },
  { name: 'flo accessoires', industry: 'Design & Handel' },
  { name: '7Möbel AG', industry: 'Möbel & Produktion' },
  { name: 'Facing Ltd', industry: 'Markenstrategie & Corporate Identity' },
  { name: 'Issue Design Atelier', industry: 'Grafik & Raumgestaltung' },
  { name: 'Japan Airlines International', industry: 'Luftfahrt & Touristik (Zürich)' },
  { name: 'Content AG', industry: 'Verlagswesen & Medien' },
  { name: 'Personal Sigma Schweiz AG', industry: 'Personalvermittlung' },
  { name: 'paradis des innocents', industry: 'High-End Fashion & Modeatelier' },
  { name: 'TL Design GmbH', industry: 'Architektur & Planung' },
  { name: 'Beautyssima GmbH', industry: 'Dienstleistung & Kosmetik' },
  { name: 'Swiss Plant Trade GmbH', industry: 'Handel & Import' },
  { name: 'Evolute Brands Consulting AG', industry: 'Unternehmensberatung' }
];

export const ADVANTAGES_DATA = [
  {
    number: '30+',
    label: 'Jahre Expertise',
    text: 'Seit 1993 begleiten wir Unternehmen und Privatpersonen kompetent im Herzen von Zürich.'
  },
  {
    number: '1',
    label: 'Persönliche Inhaberin',
    text: 'Laura Quabba berät Sie direkt – keine Ansprechpartner-Wechsel oder anonymen Berater-Teams.'
  },
  {
    number: '100%',
    label: 'Präzision & Direktheit',
    text: 'Wir sprechen Klartext und schaffen schnelle, kurze Kommunikationswege, die Sie voranbringen.'
  }
];
