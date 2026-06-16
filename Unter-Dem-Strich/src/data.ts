import { Service, TeamMember } from './types';

export const SERVICES: Service[] = [
  {
    id: 'analyse-beratung',
    number: '01',
    title: 'Analyse & Beratung',
    lead: 'Bevor Veränderung beginnt, braucht es ein klares Bild der Ausgangslage.',
    paragraphs: [
      'Organisationsanalyse: Wir analysieren bestehende Stärken und Schwächen und entwickeln gemeinsam mit Ihnen neue Organisationsformen, Arbeitsabläufe und Führungsstrukturen – inklusive Begleitung bei der Umsetzung und bei Bedarf in Zusammenarbeit mit Fachspezialisten.',
      'Coaching als Qualitätssicherung: Für Veränderungsprozesse bieten wir Coaching als kontinuierliche beratende Begleitung – sowohl in der Planung als auch in der Umsetzung unternehmerischer Entscheide. Als beratende "zweite Meinung" trägt dies zur Qualitätssicherung und Zukunftsorientierung Ihres Betriebs bei.'
    ],
    ctaText: 'Situation besprechen'
  },
  {
    id: 'projektmanagement',
    number: '02',
    title: 'Projektentwicklung & Projektmanagement',
    lead: 'Von der ersten Zieldefinition bis zur Umsetzung – mit klar definierten Verantwortlichkeiten.',
    paragraphs: [
      'Gemeinsam definieren wir Ziele, Kernkompetenzen und Ressourcen für Ihr Projekt. Daraus entsteht ein Pflichtenheft, das unsere Aufgaben klar festlegt – von der administrativen Unterstützung über die Projektleitung bis zur vollständigen Übernahme des Projektmanagements, gemäss Ihren Vorgaben.',
      'Projektcontrolling: Für Unternehmen, die den Überblick über laufende Projekte behalten möchten, bieten wir begleitendes Controlling – Transparenz über Fortschritt, Budget und Risiken.'
    ],
    ctaText: 'Projekt besprechen'
  },
  {
    id: 'coaching',
    number: '03',
    title: 'Coaching & Qualitätssicherung',
    lead: 'Eine zweite, unabhängige Perspektive auf Ihre Entscheidungen.',
    paragraphs: [
      'Unser Coaching-Angebot dient als kontinuierliche Begleitung bei Veränderungsprozessen, Planung und Umsetzung. Wir unterstützen Sie dabei, fundierte unternehmerische Entscheidungen abzusichern, blinde Flecken aufzudecken und die Zukunftsfähigkeit Ihres Betriebs langfristig zu stärken.',
      'Wir wirken als vertrauensvoller Sparringspartner für die Geschäftsführung und den Verwaltungsrat, um Strategien und Maßnahmen pragmatisch auf Herz und Nieren zu prüfen.'
    ],
    ctaText: 'Coaching anfragen'
  },
  {
    id: 'risikomanagement',
    number: '04',
    title: 'Risikomanagement',
    lead: 'Risiken erkennen, bevor sie zum Problem werden.',
    paragraphs: [
      'Wir unterstützen Sie bei der Einführung effektiver und nachvollziehbarer Risikomanagement-Prozesse. Dazu gehören die systematische Identifikation, Bewertung und Steuerung betrieblicher, finanzieller und personeller Risiken.',
      'Unser Ziel ist es, belastbare Entscheidungsgrundlagen zu schaffen, die Ihrem Unternehmen langfristige Stabilität sichern und die regulatorischen Anforderungen auf ein pragmatisches Minimum reduzieren.'
    ],
    ctaText: 'Risikoanalyse anfragen'
  },
  {
    id: 'start-ups',
    number: '05',
    title: 'Start-ups',
    lead: 'Betriebswirtschaftliches Fundament für junge Unternehmen.',
    paragraphs: [
      'Für junge Unternehmen bieten wir eine passgenaue betriebswirtschaftliche Begleitung an. Wir helfen beim Aufbau solider Grundlagen in den Bereichen Organisation, Finanzplanung, Projektstrukturen und Vertragsprüfung in der frühen Phase.',
      'Unsere Beratung ist pragmatisch, ehrlich und auf das Wesentliche reduziert – damit Sie Ihre Ressourcen dort einsetzen können, wo Ihr Wachstum entsteht.'
    ],
    ctaText: 'Start-up-Beratung anfragen'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 'juan-widmer',
    name: 'Juan Widmer',
    role: 'Betriebswirtschaftliche Beratung, Projektmanagement',
    bio: [
      'Juan Widmer ist der Gründer der unter dem strich AG. Er verfügt über ein tiefgreifendes Studium der Betriebswirtschaft mit den Schwerpunkten Auditing, E-Business sowie Mergers & Restructuring.',
      'Mit seiner langjährigen Erfahrung berät er KMUs und Start-ups pragmatisch bei anspruchsvollen Transformationsprozessen, Führungsfragen und Organisationsänderungen.',
      'Er ist zertifizierter ISAS-Auditor und absolvierte ein CAS in Community Communication an der ZHAW. Seine Freizeit widmet er gesellschaftlichen Engagements und der Förderung des Jungunternehmertums.'
    ],
    initials: 'JW'
  },
  {
    id: 'marc-keller',
    name: 'Marc Keller',
    role: 'Finanzplanung, Risikomanagement',
    bio: [
      'Marc Keller ist Spezialist für Finanzplanung, Sanierung und Liquiditätssteuerung. Bevor er zur unter dem strich AG stiess, war er als Leiter Finanzen in verschiedenen KMUs tätig.',
      'Seine Kernkompetenz liegt im Entwirren komplexer Zahlenwerke und im Aufbau praxistauglicher Reporting- und Risikomanagement-Systeme. Er denkt lösungsorientiert und proaktiv.',
      'Er ist diplomierter Betriebsökonom HWV, besitzt ein CAS in Risk Management und ist gefragter Sparringspartner für anspruchsvolle Restrukturierungsphasen.'
    ],
    initials: 'MK'
  }
];

export const PHILOSOPHY_PRINCIPLES = [
  {
    title: 'Unabhängig',
    description: 'Wir sind ausschliesslich den Interessen unserer Kunden verpflichtet. Frei von vertrieblichen Hintergedanken beraten wir objektiv und offen.'
  },
  {
    title: 'Pragmatisch',
    description: 'Theorie ist wichtig, aber unter dem strich zählt die Praxis. Wir liefern keine unlesbaren Foliensätze, sondern greifbare, direkt anwendbare Lösungen.'
  },
  {
    title: 'Ergebnisorientiert',
    description: 'Unsere Arbeit ist erst getan, wenn die vereinbarten Ziele erreicht sind. Wir messen uns am konkreten betriebswirtschaftlichen Nutzen für Sie.'
  }
];
