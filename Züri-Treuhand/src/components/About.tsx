/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldCheck, Eye, Award, History, Cpu, Heart, Target } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: ShieldCheck,
      title: 'Vertrauen',
      description: 'Diskrete, rechtskonforme Beratung und langfristige Partnerschaften stehen für uns an oberster Stelle.',
    },
    {
      icon: Eye,
      title: 'Transparenz',
      description: 'Keine versteckten Gebühren. Wir erklären komplexe steuerliche und finanzielle Zusammenhänge verständlich.',
    },
    {
      icon: Award,
      title: 'Kompetenz',
      description: 'Zertifizierte Expertise nach Schweizer Standard und stetige Weiterbildung sichern höchste Bearbeitungsqualität.',
    },
    {
      icon: History,
      title: 'Erfahrung',
      description: 'Langjährige Begleitung von Unternehmen und Privatpersonen durch alle Phasen der wirtschaftlichen Entwicklung.',
    },
    {
      icon: Cpu,
      title: 'Moderne Tools',
      description: 'Wir setzen auf effiziente, cloudbasierte Buchhaltungstools für nahtlosen Belegtransfer und Echtzeit-Auskunft.',
    },
    {
      icon: Heart,
      title: 'Persönliches Engagement',
      description: 'Wir sind keine anonyme Großkanzlei. Ihr persönlicher Ansprechpartner versteht Ihre individuellen Bedürfnisse.',
    },
  ];

  const targetGroups = [
    {
      title: 'Privatpersonen',
      desc: 'Sorgenfreie Steuererklärungen (NP), Nachlassplanungen und finanzielle Orientierungshilfen bei Schulden- oder Budgetfragen.',
    },
    {
      title: 'Start-ups (Gründer)',
      desc: 'Maßgeschneiderte Firmengründung als GmbH oder AG, Businessplanung und Einrichtung einer modernen Buchhaltungsinfrastruktur.',
    },
    {
      title: 'Etablierte KMU',
      desc: 'Umfassendes Outsourcing von Buchhaltung (OR), Steuern (JP), Lohnwesen (Personal) und administrativem Support zur Entlastung.',
    }
  ];

  const team = [
    {
      name: 'Beat Keller',
      initials: 'BK',
      role: 'Inhaber & Eidg. dipl. Treuhandexperte',
      quote: '«Treuhand ist Beziehungsarbeit. Mit über 15 Jahren Erfahrung in der KMU- und Steuerberatung begleite ich Sie zuverlässig bei jedem Schritt.»',
      focus: ['KMU-Finanzen', 'Steuerberatung', 'Nachfolgeplanung'],
      email: 'b.keller@zueri-treuhand.ch',
      languages: 'DE • EN • FR'
    },
    {
      name: 'Sarah Meier',
      initials: 'SM',
      role: 'Dipl. Treuhandexpertin & Teamleiterin',
      quote: '«Ich sorge für Struktur und digitale Effizienz. Für mich ist eine fehlerfreie Lohn- und Finanzbuchhaltung das Fundament jedes gesunden Unternehmens.»',
      focus: ['Finanzbuchhaltung', 'Lohn & Personal', 'MWST-Abrechnung'],
      email: 's.meier@zueri-treuhand.ch',
      languages: 'DE • EN'
    },
    {
      name: 'Christian Vogt',
      initials: 'CV',
      role: 'Steuerspezialist & Treuhandassistent',
      quote: '«Ihre privaten oder geschäftlichen Steuererklärungen optimiere ich fachgerecht und präzise. Ich entlaste Sie so rasch wie kompetent.»',
      focus: ['Steuererklärungen', 'Firmengründungen', 'Administration'],
      email: 'c.vogt@zueri-treuhand.ch',
      languages: 'DE • EN • IT'
    }
  ];

  return (
    <section id="about" className="py-12 md:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 md:mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-[1px]" />
            <span className="font-sans text-[11px] text-brand-blue tracking-widest uppercase font-bold">
              RECHTSKONFORM UND PERSÖNLICH
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tighter text-brand-blue mb-6">
            Unser Kurzprofil & Mission
          </h2>
          <p className="font-sans text-base sm:text-lg text-neutral-600 leading-relaxed font-light">
            Als Züri Treuhand haben wir ein klares Ziel vor Augen: Wir nehmen Ihnen den administrativen Aufwand vollständig ab, damit Sie sich voll auf Ihr Kerngeschäft oder Privatleben konzentrieren können. Dabei leiten uns feste Werte, die wir täglich leben.
          </p>
        </div>

        {/* Target Audience Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {targetGroups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 border border-border-gray bg-soft-gray hover:bg-white transition-all duration-300 rounded-[2px] relative group"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-4 h-4 text-brand-blue" strokeWidth={1.5} />
                <h3 className="font-sans text-xs font-bold text-brand-blue uppercase tracking-wider">
                  {group.title}
                </h3>
              </div>
              <p className="font-sans text-sm text-neutral-600 leading-relaxed font-light">
                {group.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Values Block */}
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-[1px]" />
            <span className="font-sans text-[11px] text-brand-blue tracking-widest uppercase font-bold">
              UNSERE GRUNDWERTE
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-brand-blue mb-12">
            Wie wir arbeiten und wer wir sind
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
            {values.map((val, index) => {
              const IconComp = val.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-start space-x-4"
                >
                  <div className="p-3 bg-soft-gray border border-border-gray/50 rounded-[2px] flex-shrink-0">
                    <IconComp className="w-5 h-5 text-brand-blue" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-brand-blue mb-2 uppercase tracking-wider">
                      {val.title}
                    </h4>
                    <p className="font-sans text-xs text-neutral-600 leading-relaxed font-light">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Unser Team Section */}
        <div className="mt-20 border-t border-border-gray pt-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-[1px]" />
            <span className="font-sans text-[11px] text-brand-blue tracking-widest uppercase font-bold">
              KOMPETENT & PERSÖNLICH
            </span>
          </div>
          
          <div className="max-w-3xl mb-12">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-brand-blue mb-4">
              Ihre persönlichen Ansprechpartner in Zürich
            </h3>
            <p className="font-sans text-sm text-neutral-600 leading-relaxed font-light">
              Treuhand ist Vertrauenssache. Hinter jedem Abschluss, jeder Steuererklärung und jeder Lohnbuchhaltung stehen bei uns qualifizierte Experten, die Sie partnerschaftlich und unkompliziert beraten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-border-gray p-6 rounded-[2px] hover:shadow-xs transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Avatar Monogram */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-brand-blue text-white flex items-center justify-center font-display font-bold text-lg border border-border-gray/10 relative flex-shrink-0">
                        {member.initials}
                        {/* Soft gold/blue dot representing Swiss quality certification */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center" title="Aktiv im Dienst">
                          <span className="w-1 h-1 bg-white rounded-full"></span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-brand-blue text-sm uppercase tracking-wide leading-tight">
                          {member.name}
                        </h4>
                        <p className="font-sans text-[10px] text-neutral-400 mt-1 font-semibold uppercase tracking-wider">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-neutral-600 leading-relaxed font-light mb-6 min-h-[60px] italic">
                      {member.quote}
                    </p>

                    {/* Spezialgebiete Tags */}
                    <div className="mb-6">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 block mb-2">SCHWERPUNKTE</span>
                      <div className="flex flex-wrap gap-1.5">
                        {member.focus.map((f, i) => (
                          <span key={i} className="text-[9px] font-sans px-2 py-0.5 bg-soft-gray border border-border-gray/50 text-brand-blue rounded-[1px]">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Kontakt info */}
                  <div className="pt-4 border-t border-border-gray/60 flex flex-col gap-1.5 font-sans">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400 font-light">E-Mail:</span>
                      <a href={`mailto:${member.email}`} className="text-brand-blue hover:underline font-semibold font-mono text-[10px] lowercase">
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400 font-light">Sprachen:</span>
                      <span className="text-brand-blue font-semibold">{member.languages}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
