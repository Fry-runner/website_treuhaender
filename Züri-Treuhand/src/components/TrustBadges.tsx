/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: Award,
      title: 'Treuhand | Suisse',
      subtitle: 'Premium Mitgliedschaft'
    },
    {
      icon: ShieldCheck,
      title: 'Eidg. dipl. Experten',
      subtitle: 'Höchster Schweizer Standard'
    },
    {
      icon: CheckCircle2,
      title: 'Zürcher Steuerregister',
      subtitle: 'Akkreditierte Beratung'
    },
    {
      icon: Lock,
      title: '100% CH-Datensicherheit',
      subtitle: 'Schweizer Server-Hosting'
    }
  ];

  return (
    <div className="bg-neutral-50/50 border-b border-border-gray py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-center space-x-3.5 justify-center md:justify-start"
              >
                <div className="p-2 bg-white rounded-[1px] border border-border-gray/80 text-brand-blue/80 flex-shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-sans text-[11px] font-bold text-brand-blue uppercase tracking-wider leading-none">
                    {badge.title}
                  </h4>
                  <p className="font-sans text-[10px] text-neutral-400 mt-0.5 font-light">
                    {badge.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
