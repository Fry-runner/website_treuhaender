import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

export default function FinanceSimulator() {
  const [chaos, setChaos] = useState<number>(70); // 0 - 100
  const [structure, setStructure] = useState<number>(30); // 0 - 100
  const [energy, setEnergy] = useState<number>(50); // 0 - 100

  // Calculate the current situation state and corresponding text based on positions
  const situation = useMemo(() => {
    if (chaos > 75 && structure < 30) {
      return {
        title: 'Kreative Unruhe & Akuter Stress',
        color: 'text-brand-rose',
        desc: 'Projekte laufen heiss, die Kommunikation fliegt weit umher. Ein Zustand, der Tatkraft vortäuscht, aber wertvolle Energie verbrennt. Zeit für strukturierende Systematik.',
        badge: 'Präsenz & Hektik'
      };
    }
    if (structure > 75 && chaos > 70) {
      return {
        title: 'Bürokratischer Overkill',
        color: 'text-brand-text',
        desc: 'Es existieren unzählige Formulare und Meetings, doch die klare Führung fehlt. Die Prozesse blockieren das Kerngeschäft und senken den spürbaren Ertrag.',
        badge: 'Trägheit / Reibung'
      };
    }
    if (structure > 75 && chaos < 25 && energy < 30) {
      return {
        title: 'Post-Corporate Stagnation',
        color: 'text-brand-muted',
        desc: 'Alles läuft geregelt und abgesichert, aber der kreative Funke fehlt gänzlich. Die Organisation droht in der Komfortzone einzuschlafen.',
        badge: 'Gefährliche Ruhe'
      };
    }
    if (chaos < 25 && structure < 25 && energy < 20) {
      return {
        title: 'Betrieblicher Tiefschlaf',
        color: 'text-brand-muted',
        desc: 'Ungenutzte Potenziale liegen brach. Es empfiehlt sich eine Schärfung von Zielen und Rollen in einem fokussierten Erstgespräch.',
        badge: 'Standby / Inaktiv'
      };
    }
    if (structure >= 70 && chaos <= 30) {
      return {
        title: 'Optimale Ausrichtung «Unter dem Strich»',
        color: 'text-brand-blue font-bold',
        desc: 'Hervorragend. Strukturierte Prozesse stützen Ihre Vision, Risiken bleiben minimal. Der Ertrag fliesst ungehindert dorthin, wo er hingehört: Direkt unter Ihren Strich.',
        badge: 'Exzellente Balance'
      };
    }
    
    // Default balanced / intermediate state
    return {
      title: 'Mittelmass mit Reibungsverlusten',
      color: 'text-brand-text/90',
      desc: 'Solider Alltagsbetrieb, jedoch verpuffen ca. 15–20% des Gewinns durch unfertige Absprachen, unklare Schnittstellen oder mangelndes Coaching.',
      badge: 'Potential Vorhanden'
    };
  }, [chaos, structure, energy]);

  // Is the bottom line perfectly straight/optimized?
  const isOptimal = chaos <= 30 && structure >= 70;

  // Compute a beautiful SVG wave representing the "Unternehmerische Linie"
  const wavePath = useMemo(() => {
    const points = [];
    const segments = 100;
    
    // The "Chaos" amplitude is dampened by "Structure"
    const baseAmplitude = (chaos / 100) * 45;
    const dampening = (structure / 100) * 0.95; 
    const amplitude = Math.max(0, baseAmplitude * (1 - dampening));
    
    // Energy controls the frequency and complexity of secondary harmonics
    const frequencyMultiplier = 1 + (energy / 100) * 2.0;

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 600;
      
      const anglePrimary = (i / segments) * Math.PI * 2 * frequencyMultiplier;
      const angleSecondary = (i / segments) * Math.PI * 4 * (1 + (energy / 200));

      // Calculate path height centering around Y=60
      const waveOffset = 
        Math.sin(anglePrimary) * (amplitude * 0.75) + 
        Math.cos(angleSecondary) * (amplitude * 0.25);

      points.push(`${x},${60 + waveOffset}`);
    }

    return `M ${points.join(' L ')}`;
  }, [chaos, structure, energy]);

  const resetControls = () => {
    setChaos(55);
    setStructure(45);
    setEnergy(50);
  };

  return (
    <div
      className="bg-brand-bg py-4 md:py-6 relative overflow-hidden transition-all duration-300"
      id="visual-gimmick-playground"
    >
      {/* Title block with signature Swiss line */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-border/65 pb-6 mb-10">
        <div>
          <span className="font-mono text-[10px] text-brand-blue tracking-[0.2em] font-semibold uppercase block mb-2">
            SIMULATION · DER INTERAKTIVE STRICH
          </span>
          <h3 className="font-display font-medium text-2xl tracking-tight text-brand-text">
            Die Balance des Ertrags
          </h3>
        </div>
        <p className="text-brand-muted text-xs max-w-sm leading-relaxed mt-2 md:mt-0">
          Verschieben Sie die Parameter, um die Dynamik zwischen Reibungsverlusten, Ordnung und Tatkraft live zu visualisieren.
        </p>
      </div>

      <div className="space-y-10">
        {/* Visual Line Area (Top, wide for maximum elegance) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-brand-muted uppercase">
            <span>Soll-Zustand (Gerade / Ruhend) vs. Ist-Kurve</span>
            <span className={isOptimal ? 'text-brand-blue font-bold font-mono' : 'text-brand-muted'}>
              Status: {situation.badge}
            </span>
          </div>

          {/* Minimalist SVG Frame without heavy distracting boxes */}
          <div 
            className="h-36 w-full bg-brand-bg border-b border-t border-brand-border/40 relative overflow-hidden flex items-center justify-center transition-all duration-300"
            id="gimmick-interactive-svg-box"
          >
            {/* Extremely subtle architecture grid backing */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#1c1c1a_1px,transparent_1px)] bg-[size:40px_1px]" />
            
            <svg viewBox="0 0 600 120" className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none">
              {/* Perfectly straight reference baseline (Der Strich) */}
              <line 
                x1="0" 
                y1="60" 
                x2="600" 
                y2="60" 
                stroke={isOptimal ? '#2C3E91' : '#E0DDD5'} 
                strokeWidth={isOptimal ? '2' : '1'} 
                className="transition-all duration-500"
              />

              {/* End caps */}
              <circle cx="0" cy="60" r="2.5" fill="#2C3E91" />
              <circle cx="600" cy="60" r="2.5" fill="#2C3E91" />

              {/* Dynamic wavy line */}
              <motion.path
                d={wavePath}
                fill="none"
                stroke={isOptimal ? '#2C3E91' : '#DB8A7E'}
                strokeWidth={isOptimal ? '2.5' : '1.5'}
                className="transition-colors duration-500"
              />
            </svg>

            {/* Micro optimal celebration text - integrated seamlessly with absolute minimalism */}
            <AnimatePresence>
              {isOptimal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-brand-bg/95 flex flex-col items-center justify-center text-center p-4 z-20 pointer-events-none"
                >
                  <p className="font-display font-medium text-xs text-brand-blue uppercase tracking-[0.2em] animate-pulse">
                    * Optimale Struktur erreicht *
                  </p>
                  <p className="text-[10px] text-brand-muted mt-1 max-w-xs">
                    Der Reibungsverlust ist minimal. Alle Prozesse laufen direkt in den Ertrag.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Minimalist Analysis Block (typographic design) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2" id="gimmick-diagnostic-feedback">
          <div className="md:col-span-4 border-r border-brand-border/40 pr-6">
            <span className="font-mono text-[9px] tracking-widest text-brand-muted block uppercase mb-1">
              Aktuelle Analyse
            </span>
            <h4 className={`font-display font-semibold text-lg leading-snug ${situation.color}`}>
              {situation.title}
            </h4>
          </div>
          <div className="md:col-span-8 flex items-center">
            <p className="text-xs text-brand-muted leading-relaxed font-sans max-w-xl">
              {situation.desc}
            </p>
          </div>
        </div>

        {/* Interactive tactile sliders block (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-brand-border/40">
          
          {/* Slider 1: Chaos */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-brand-text/70 uppercase tracking-wider text-[10px]">
                Relative Unruhe
              </span>
              <span className="text-brand-rose font-medium text-[11px]">{chaos}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={chaos}
              onChange={(e) => setChaos(parseInt(e.target.value))}
              className="w-full h-[2px] bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-rose focus:outline-none"
              id="toy-slider-chaos"
            />
            <div className="flex justify-between text-[9px] text-brand-muted/80 font-mono uppercase tracking-wide">
              <span>Keine Reibung</span>
              <span>Hohe Reibung</span>
            </div>
          </div>

          {/* Slider 2: Structure */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-brand-text/70 uppercase tracking-wider text-[10px]">
                Strukturierungsgrad
              </span>
              <span className="text-brand-blue font-medium text-[11px]">{structure}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={structure}
              onChange={(e) => setStructure(parseInt(e.target.value))}
              className="w-full h-[2px] bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-blue focus:outline-none"
              id="toy-slider-structure"
            />
            <div className="flex justify-between text-[9px] text-brand-muted/80 font-mono uppercase tracking-wide">
              <span>Gering</span>
              <span>Hervorragend</span>
            </div>
          </div>

          {/* Slider 3: Creative Energy */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#968E76] uppercase tracking-wider text-[10px]">
                Tatkraft & Elan
              </span>
              <span className="text-[#807963] font-medium text-[11px]">{energy}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full h-[2px] bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-text focus:outline-none"
              id="toy-slider-energy"
            />
            <div className="flex justify-between text-[9px] text-brand-muted/80 font-mono uppercase tracking-wide">
              <span>Ruhig</span>
              <span>Intensiv</span>
            </div>
          </div>
        </div>

        {/* Footer actions & details */}
        <div className="flex justify-start items-center pt-2 border-t border-brand-border/20">
          <button
            onClick={resetControls}
            className="inline-flex items-center gap-1.5 text-[9px] font-mono text-brand-muted hover:text-brand-text transition-colors cursor-pointer focus:outline-none uppercase tracking-wider"
            id="toy-btn-reset"
          >
            <RotateCcw size={10} /> Simulator Zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
}
