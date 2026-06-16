import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRightLeft, Shield, Clock } from 'lucide-react';
import { OFFICES } from '../data';

export default function MinimalistMap() {
  const [activeNode, setActiveNode] = useState<'zuerich' | 'duesseldorf' | null>(null);

  return (
    <div className="relative bg-brand-offwhite border border-brand-beige rounded-sm p-6 md:p-8 overflow-hidden transition-all duration-500 hover:border-brand-grey/40 group">
      {/* Light grid overlay to look like a high-end financial dashboard but extremely minimal */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Map Column */}
        <div className="lg:col-span-7 flex justify-center relative select-none">
          {/* Subtle background card for map container */}
          <div className="w-full max-w-[420px] aspect-[4/5] relative">
            <svg
              viewBox="0 0 400 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-brand-anthracite"
            >
              {/* Very minimal borders of Germany & Switzerland represented as modern geo-paths or clean abstract outlines */}
              {/* Outline of Germany (Styled, clean polygon) */}
              <motion.path
                d="M 120,40 L 220,30 L 280,60 L 320,100 L 310,180 L 340,240 L 300,320 L 250,330 L 200,340 L 150,330 L 90,320 L 60,260 L 80,180 L 70,120 Z"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="1.5"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.8, pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              {/* Outline of Switzerland (Styled, connected directly) */}
              <motion.path
                d="M 90,322 L 150,332 L 200,342 L 250,332 L 240,380 L 180,410 L 120,400 L 80,380 Z"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="1.5"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.8, pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
              />

              {/* Connecting curve line representation "Zwei Länder, eine Lösung" */}
              <motion.path
                d="M 130,220 Q 220,300 160,360"
                fill="none"
                stroke="#8A8782"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
              />

              {/* Glowing animated path overlay */}
              <path
                d="M 130,220 Q 220,300 160,360"
                fill="none"
                stroke="#8A8782"
                strokeWidth="4"
                strokeLinecap="round"
                className="opacity-20 blur-sm"
              />

              {/* Düsseldorf Node */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setActiveNode('duesseldorf')}
                onMouseLeave={() => setActiveNode(null)}
                onClick={() => setActiveNode('duesseldorf')}
              >
                {/* Glowing ring */}
                <motion.circle
                  cx="130"
                  cy="220"
                  r={activeNode === 'duesseldorf' ? '18' : '10'}
                  fill="none"
                  stroke="#1C1C1A"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <circle cx="130" cy="220" r="6" fill="#1C1C1A" />
                <circle cx="130" cy="220" r="3" fill="#C8102E" />
                <text
                  x="146"
                  y="224"
                  fill="#1C1C1A"
                  className="font-display font-medium text-xs tracking-wide"
                >
                  Düsseldorf
                </text>
                <text
                  x="146"
                  y="238"
                  fill="#8A8782"
                  className="font-mono text-[9px] uppercase tracking-wider"
                >
                  DE-Standort
                </text>
              </g>

              {/* Zurich Node */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setActiveNode('zuerich')}
                onMouseLeave={() => setActiveNode(null)}
                onClick={() => setActiveNode('zuerich')}
              >
                {/* Glowing ring */}
                <motion.circle
                  cx="160"
                  cy="360"
                  r={activeNode === 'zuerich' ? '18' : '10'}
                  fill="none"
                  stroke="#1C1C1A"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <circle cx="160" cy="360" r="6" fill="#1C1C1A" />
                <circle cx="160" cy="360" r="3" fill="#C8102E" />
                <text
                  x="176"
                  y="364"
                  fill="#1C1C1A"
                  className="font-display font-medium text-xs tracking-wide"
                >
                  Zürich
                </text>
                <text
                  x="176"
                  y="378"
                  fill="#8A8782"
                  className="font-mono text-[9px] uppercase tracking-wider"
                >
                  CH-Hauptsitz
                </text>
              </g>

              {/* Graphic Title Overlay */}
              <text
                x="20"
                y="50"
                fill="#1C1C1A"
                className="font-display font-semibold text-sm tracking-tight"
              >
                REDUZIERTE LINIENKARTE
              </text>
              <text
                x="20"
                y="68"
                fill="#8A8782"
                className="font-mono text-[9px] uppercase tracking-widest"
              >
                D-CH VERBINDUNGSLINIE
              </text>
            </svg>

            {/* Hover tooltip widget absolute positioned */}
            <AnimatePresence>
              {activeNode && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-4 left-4 right-4 bg-white text-brand-anthracite p-4 rounded-sm shadow-md border border-brand-beige"
                >
                  <p className="text-brand-grey font-mono text-[9px] uppercase tracking-wider font-semibold mb-1">
                    Aktiver Standort
                  </p>
                  <h4 className="font-display font-medium text-base text-brand-anthracite mb-0.5">
                    {OFFICES[activeNode].city}
                  </h4>
                  <p className="text-brand-grey text-xs font-sans mb-1.5 font-light">
                    {OFFICES[activeNode].address}
                  </p>
                  <div className="flex justify-between items-center text-[11px] font-mono text-brand-grey pt-1.5 border-t border-brand-beige">
                    <span>{OFFICES[activeNode].phone}</span>
                    <span className="text-brand-grey">ruerup.tax</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-beige bg-brand-offwhite text-brand-grey font-mono text-xs">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Grenzüberschreitende Achse</span>
          </div>

          <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-brand-anthracite">
            Eine nahtlose Verbindung der Rechtssysteme.
          </h3>

          <p className="font-sans text-brand-grey text-base leading-relaxed">
            Als Fachberater für Internationales Steuerrecht gestalte ich die Brücke zwischen Deutschland und der Schweiz. Die Doppelkompetenz in beiden Ländern spart Ihnen lange Abstimmungswege und schützt Sie vor Doppelbesteuerungen.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-brand-beige/50 flex items-center justify-center text-brand-anthracite">
                <Shield className="w-5 h-5 text-brand-grey" />
              </div>
              <div>
                <h4 className="font-display font-medium text-sm text-brand-anthracite">Rechtssicherheit in beiden Staaten</h4>
                <p className="font-sans text-xs text-brand-grey mt-0.5">Minimiert Compliance-Risiken bei Wohnsitzwechseln und Unternehmensaktivitäten.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-brand-beige/50 flex items-center justify-center text-brand-anthracite">
                <Clock className="w-5 h-5 text-brand-grey" />
              </div>
              <div>
                <h4 className="font-display font-medium text-sm text-brand-anthracite">Ein Ansprechpartner – Halbe Zeit</h4>
                <p className="font-sans text-xs text-brand-grey mt-0.5">Keine zeitraubende Koordination verschiedener Steuerkanzleien in Düsseldorf und Zürich.</p>
              </div>
            </div>
          </div>

          {/* Quick interactive trigger */}
          <div className="pt-2">
            <p className="text-xs text-brand-grey font-sans italic">
              ↳ Bewegen Sie den Cursor über die Karte, um Kanzleidaten einzugrenzen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
