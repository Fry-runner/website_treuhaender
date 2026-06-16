/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Users2, Building, BarChart3, Coins } from 'lucide-react';

interface CountUpProps {
  end: number;
  duration?: number;
}

function CountUp({ end, duration = 2 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const endVal = end;
    const totalMiliseconds = duration * 1000;
    const stepTime = Math.max(Math.floor(totalMiliseconds / endVal), 30);
    
    const timer = setInterval(() => {
      start += Math.ceil(endVal / (totalMiliseconds / stepTime));
      if (start >= endVal) {
        setCount(endVal);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString('de-CH')}</span>;
}

export default function TrustFactors() {
  const metrics = [
    {
      id: 'kunden',
      icon: Users2,
      label: 'Zufriedene Kunden',
      value: 350,
      suffix: '+',
      description: 'Privatpersonen und Selbstständige vertrauen unserer jährlichen Steuerplanung.'
    },
    {
      id: 'firmen',
      icon: Building,
      label: 'Betreute Firmen & KMU',
      value: 120,
      suffix: '+',
      description: 'Langfristige Begleitung von etablierten Betrieben und Newcomern im Handelsregister.'
    },
    {
      id: 'abschluesse',
      icon: BarChart3,
      label: 'Erstellte Jahresabschlüsse',
      value: 1400,
      suffix: '+',
      description: 'OR-konforme Abschlüsse und Revisionen präzise und pünktlich deklariert.'
    },
    {
      id: 'savings',
      icon: Coins,
      label: 'Erzielte Steueroptimierung',
      value: 1.8,
      suffix: ' Mio. CHF',
      isFloat: true,
      description: 'Effektive Einsparungen durch vorausschauende Steuerberatung und Abzugsvolumen.'
    }
  ];

  return (
    <section id="trust-factors" className="py-14 bg-white border-y border-border-gray relative">
      <div className="absolute inset-0 z-0 bg-neutral-50/10" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-[1px]" />
            <span className="font-sans text-[11px] text-brand-blue tracking-widest uppercase font-bold">
              FACTS & FIGURES
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-brand-blue mb-4 tracking-tight">
            Zahlen, die für uns sprechen
          </h2>
          <p className="font-sans text-sm text-neutral-600 font-light leading-relaxed">
            Unsere treuen Partnerschaften in der Region Zürich und der gesamten Schweiz basieren auf messbaren Erfolgen und absoluter Zuverlässigkeit.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div
                id={`metric-card-${metric.id}`}
                key={metric.id}
                className="flex flex-col items-center text-center p-6 bg-white border border-border-gray/60 rounded-[2px] hover:shadow-sm transition-shadow duration-300"
              >
                <div className="p-3 bg-soft-gray rounded-[2px] text-brand-blue mb-5">
                  <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                </div>
                
                <h3 className="font-sans text-3xl md:text-4xl font-bold text-brand-blue mb-2 tracking-tight">
                  {metric.isFloat ? (
                    <span>
                      1.8
                    </span>
                  ) : (
                    <CountUp end={metric.value} />
                  )}
                  <span className="text-brand-blue font-light">{metric.suffix}</span>
                </h3>
                
                <h4 className="font-sans text-[11px] uppercase tracking-wider font-bold text-neutral-700 mb-3">
                  {metric.label}
                </h4>
                
                <p className="font-sans text-xs text-neutral-500 font-light leading-relaxed max-w-[220px]">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
