import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { SERVICES } from '../data';
import { Service } from '../types';

interface ServiceQuizProps {
  onSelectService: (serviceId: string) => void;
  onNavigateToContact: (serviceId: string) => void;
}

export default function ServiceQuiz({ onSelectService, onNavigateToContact }: ServiceQuizProps) {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<{
    challenge: string | null;
    size: string | null;
    goal: string | null;
  }>({
    challenge: null,
    size: null,
    goal: null,
  });

  const questionOne = {
    title: 'Was bremst Ihr Unternehmen aktuell am stärksten?',
    options: [
      { id: 'processes', label: 'Unklare Prozesse & veraltete Organisationsstrukturen', val: 'analyse-beratung' },
      { id: 'projects', label: 'Verzögerungen, Ressourcenmängel oder Reibungsverluste bei Schlüsselprojekten', val: 'projektmanagement' },
      { id: 'uncertainty', label: 'Fehlendes Sparring & Unsicherheit bei strategischen Richtungsentscheidungen', val: 'coaching' },
      { id: 'safety', label: 'Ungeklärte Risiken, Compliance-Sorgen oder drohende finanzielle Engpässe', val: 'risikomanagement' },
      { id: 'startup', label: 'Fehlendes betriebswirtschaftliches Fundament als junges, wachsendes Unternehmen', val: 'start-ups' },
    ],
  };

  const questionTwo = {
    title: 'In welcher Entwicklungsphase befindet sich Ihre Organisation?',
    options: [
      { id: 'small', label: 'Kleines Team / Start-up (bis 10 Mitarbeitende)', val: 'start-ups' },
      { id: 'medium', label: 'Etabliester Mittelstand (10 bis 100 Mitarbeitende)', val: 'analyse-beratung' },
      { id: 'large', label: 'Grössere Organisation / Öffentliche Hand (über 100 Mitarbeitende)', val: 'projektmanagement' },
    ],
  };

  const questionThree = {
    title: 'Wo soll die Beratung am schnellsten Hebelwirkung entfalten?',
    options: [
      { id: 'status', label: 'Schonungslose Analyse & Struktur-Update', val: 'analyse-beratung' },
      { id: 'execution', label: 'In_time Begleitung & Umsetzung vor Ort', val: 'projektmanagement' },
      { id: 'sparring', label: 'Fortlaufende strategische Absicherung (Zweite Meinung)', val: 'coaching' },
    ],
  };

  const handleSelectOption = (value: string) => {
    if (step === 1) {
      setAnswers({ ...answers, challenge: value });
      setStep(2);
    } else if (step === 2) {
      setAnswers({ ...answers, size: value });
      setStep(3);
    } else if (step === 3) {
      setAnswers({ ...answers, goal: value });
      setStep(4);
    }
  };

  const recommendedService: Service = useMemo(() => {
    // Basic heuristic recommendation based on answers
    if (answers.challenge === 'start-ups' || answers.size === 'start-ups') {
      return SERVICES.find((s) => s.id === 'start-ups') || SERVICES[0];
    }
    if (answers.challenge) {
      return SERVICES.find((s) => s.id === answers.challenge) || SERVICES[0];
    }
    if (answers.goal) {
      return SERVICES.find((s) => s.id === answers.goal) || SERVICES[0];
    }
    return SERVICES[0];
  }, [answers]);

  const resetQuiz = () => {
    setAnswers({ challenge: null, size: null, goal: null });
    setStep(1);
  };

  return (
    <div
      className="bg-brand-bg border border-brand-border p-6 md:p-10 rounded-sm relative overflow-hidden"
      id="service-quiz-widget"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-border" />
      
      {/* Quiz Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-brand-border/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-brand-blue tracking-wider font-semibold uppercase">
              02 · PRE-CONSULTING ANALYSE
            </span>
            <span className="h-[1.5px] w-4 bg-brand-blue" />
          </div>
          <h3 className="font-display font-medium text-xl tracking-tight text-brand-text">
            Individueller Bedarfs-Check
          </h3>
        </div>
        {step < 4 ? (
          <span className="font-mono text-xs text-brand-muted">
            Schritt {step} von 3
          </span>
        ) : (
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 text-xs font-mono text-brand-blue hover:text-brand-text transition-colors cursor-pointer focus:outline-none"
            id="quiz-btn-restart"
          >
            <RefreshCw size={13} /> Analyse wiederholen
          </button>
        )}
      </div>

      {/* Progress horizontal line (Strich-Motiv) */}
      {step < 4 && (
        <div className="w-full h-[2px] bg-brand-border mb-8 overflow-hidden relative">
          <motion.div
            className="h-full bg-brand-blue"
            initial={{ width: '0%' }}
            animate={{ width: `${((step - 1) / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Steps Rendering */}
      <div className="min-h-[220px] flex flex-col justify-between">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5 animate-none"
            id="quiz-step-1"
          >
            <p className="font-display font-medium text-lg text-brand-text mb-2">
              {questionOne.title}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {questionOne.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.val)}
                  className="text-left w-full border border-brand-border hover:border-brand-blue p-4 rounded-sm hover:bg-brand-blue/[0.01] transition-all duration-200 cursor-pointer group flex items-start gap-3"
                  id={`quiz-opt-one-${opt.id}`}
                >
                  <span className="h-5 w-5 rounded-full border border-brand-border/80 group-hover:border-brand-blue flex items-center justify-center text-[10px] font-mono mt-0.5 shrink-0 transition-colors">
                    →
                  </span>
                  <span className="text-sm font-medium text-brand-text/80 group-hover:text-brand-text transition-colors">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
            id="quiz-step-2"
          >
            <p className="font-display font-medium text-lg text-brand-text mb-2">
              {questionTwo.title}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {questionTwo.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.val)}
                  className="text-left w-full border border-brand-border hover:border-brand-blue p-4 rounded-sm hover:bg-brand-blue/[0.01] transition-all duration-200 cursor-pointer group flex items-start gap-4"
                  id={`quiz-opt-two-${opt.id}`}
                >
                  <span className="h-5 w-5 rounded-full border border-brand-border/80 group-hover:border-brand-blue flex items-center justify-center text-[10px] font-mono mt-0.5 shrink-0 transition-colors">
                    →
                  </span>
                  <span className="text-sm font-medium text-brand-text/80 group-hover:text-brand-text transition-colors">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
            id="quiz-step-3"
          >
            <p className="font-display font-medium text-lg text-brand-text mb-2">
              {questionThree.title}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {questionThree.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.val)}
                  className="text-left w-full border border-brand-border hover:border-brand-blue p-4 rounded-sm hover:bg-brand-blue/[0.01] transition-all duration-200 cursor-pointer group flex items-start gap-4"
                  id={`quiz-opt-three-${opt.id}`}
                >
                  <span className="h-5 w-5 rounded-full border border-brand-border/80 group-hover:border-brand-blue flex items-center justify-center text-[10px] font-mono mt-0.5 shrink-0 transition-colors">
                    →
                  </span>
                  <span className="text-sm font-medium text-brand-text/80 group-hover:text-brand-text transition-colors">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-2"
            id="quiz-result-view"
          >
            <div className="bg-brand-blue/[0.01] border border-brand-blue/30 p-6 rounded-sm relative">
              <div className="absolute top-4 right-4 text-brand-blue">
                <Sparkles size={20} className="stroke-[1.5]" />
              </div>

              <span className="font-mono text-[10px] text-brand-blue font-bold tracking-wider block uppercase mb-1">
                Unsere Empfehlung für Ihre Ausgangslage:
              </span>
              <h4 className="font-display font-semibold text-lg text-brand-text mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-brand-blue shrink-0" />
                {recommendedService.number} · {recommendedService.title}
              </h4>
              <p className="text-sm text-brand-text/80 italic font-medium mb-3">
                "{recommendedService.lead}"
              </p>
              <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                {recommendedService.paragraphs[0]}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
              <button
                onClick={() => onSelectService(recommendedService.id)}
                className="w-full sm:w-auto text-center px-4 py-3 border border-brand-text hover:bg-brand-text hover:text-brand-bg text-brand-text text-xs tracking-wider uppercase font-mono transition-colors duration-200 cursor-pointer rounded-sm"
                id="quiz-btn-details"
              >
                Mehr zu dieser Leistung
              </button>
              <button
                onClick={() => onNavigateToContact(recommendedService.id)}
                className="w-full sm:w-auto text-center px-5 py-3 bg-brand-rose/95 hover:bg-brand-rose text-brand-text font-semibold text-xs tracking-wider uppercase font-mono transition-colors duration-200 cursor-pointer rounded-sm"
                id="quiz-btn-contact"
              >
                Erstgespräch vereinbaren
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
