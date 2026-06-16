import { motion } from 'motion/react';
import { ActiveView } from '../types';
import LineMotif from './LineMotif';
import { ADVANTAGES_DATA } from '../data';
import { ArrowUpRight, HelpCircle, ShieldCheck, Users, Milestone } from 'lucide-react';

interface CompanyProps {
  onNavigate: (view: ActiveView) => void;
}

export default function Company({ onNavigate }: CompanyProps) {
  const targetAudiences = [
    {
      title: 'KMU & Kleinbetriebe',
      desc: 'Sicherstellung sauberer Jahresrechnungen, Lohnläufe und optimierter Mehrwertsteuer-Abrechnungen.',
      icon: ShieldCheck
    },
    {
      title: 'Einzelunternehmer & Gründer',
      desc: 'Von der optimalen Rechtsformwahl über die Eintragung bis zur täglichen betriebswirtschaftlichen Entlastung.',
      icon: Milestone
    },
    {
      title: 'Inhaber in Nachfolgefragen',
      desc: 'Diskrete Unternehmensprüfung, verlässliche Firmenbewertungen und vorausschauende Übergabebegleitung.',
      icon: Users
    },
    {
      title: 'Privatpersonen',
      desc: 'Ganzheitliche Family-Office-Abwicklung, privates Budgetmanagement und diskrete Postorganisation.',
      icon: HelpCircle
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Block with huge margin */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="lg:col-span-8">
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-violet font-black mb-3">
              KONTINUITÄT & KLARHEIT
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-brand-graphite tracking-tight leading-tight">
              Seit 1993 in Zürich. <br />
              Klar strukturiert, persönlich geführt.
            </h2>
          </div>
          <div className="lg:col-span-4 flex items-end">
            <p className="font-sans text-brand-gray-medium text-lg leading-relaxed">
              Gegründet im Jahr 1993, wird Quabba Treuhand seither mit Begeisterung von Laura Quabba an der Rotbuchstrasse in Zürich geführt. Unser Fokus liegt auf verlässlicher Kontinuität und echter persönlicher Qualität statt schierer Grösse.
            </p>
          </div>
        </div>

        {/* Freestanding Numbers Panel (Section 1.5) instead of photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-12 px-6 md:px-0 border-y border-brand-gray-light bg-brand-violet/[0.01]">
          {ADVANTAGES_DATA.map((adv, index) => (
            <motion.div
              key={adv.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="flex flex-col items-start"
            >
              <span className="font-display font-black text-6xl md:text-7xl text-brand-violet leading-none mb-3">
                {adv.number}
              </span>
              <h3 className="font-heading font-black text-base text-brand-graphite mb-2">
                {adv.label}
              </h3>
              <p className="font-sans text-sm text-brand-gray-medium leading-relaxed">
                {adv.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Central philosophy node: "Drei Bereiche, eine Anlaufstelle" */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center mt-20 md:mt-28">
          <div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-brand-graphite mb-6">
              Drei Bereiche, eine Anlaufstelle.
            </h3>
            <p className="font-sans text-brand-gray-medium leading-relaxed mb-6 text-base">
              Warum wir Treuhand, Beratung und Organisation als untrennbare Einheit begreifen? Weil ein gut geführtes Rechnungswesen wertlose Daten liefert, wenn die strategische Beratung am runden Tisch fehlt. Und weil die beste Strategie verpufft, wenn interne Prozesse und Abläufe unübersichtlich oder zeitraubend sind.
            </p>
            <p className="font-sans text-brand-gray-medium leading-relaxed mb-8 text-base">
              Unsere Mandanten geniessen den unschätzbaren Vorteil, alle drei Hebel aus einer Hand betreut zu wissen. Kurze Entscheidungswege sorgen für mehr Agilität im gesamten Unternehmensalltag.
            </p>
            <button
              onClick={() => onNavigate('angebot')}
              className="inline-flex items-center gap-2 group border-[1.5px] border-brand-graphite px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-brand-graphite hover:bg-brand-coral hover:border-brand-coral hover:text-white transition-colors duration-200 rounded-[2px] cursor-pointer"
            >
              Leistungsspektrum öffnen
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative border border-brand-gray-light p-8 md:p-12 rounded-[4px] bg-white bg-[radial-gradient(#E9ECEC_1px,transparent_1px)] [background-size:16px_16px]">
            <h4 className="font-display font-medium text-xl text-brand-graphite mb-6">
              Für wen wir arbeiten
            </h4>
            <div className="space-y-6">
              {targetAudiences.map((audience) => (
                <div key={audience.title} className="flex gap-4 items-start">
                  <div className="p-2 bg-brand-violet/5 rounded-sm text-brand-violet mt-0.5">
                    <audience.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-heading font-semibold text-sm text-brand-graphite">
                      {audience.title}
                    </h5>
                    <p className="font-sans text-xs text-brand-gray-medium mt-1 leading-relaxed">
                      {audience.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



      </div>
    </section>
  );
}
