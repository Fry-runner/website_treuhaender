import { motion } from 'motion/react';

interface LineMotifProps {
  type: 'hero' | 'divider' | 'card' | 'footer' | 'signature';
  className?: string;
  animate?: boolean;
}

export default function LineMotif({ type, className = '', animate = true }: LineMotifProps) {
  if (type === 'hero') {
    return (
      <div className={`relative w-full h-80 pointer-events-none select-none ${className}`}>
        <svg
          viewBox="0 0 1000 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-35"
        >
          {/* A premium, multi-joint structured path depicting order from curves */}
          <motion.path
            d="M 50 150 C 250 150, 200 50, 450 100 C 600 130, 650 250, 800 200 C 900 170, 920 120, 950 120"
            stroke="var(--color-brand-violet)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.35 }}
            animate={{ pathLength: 1, opacity: 0.35 }}
            transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
          />
          {/* Grid vertical reference alignments symbolizing auditing and order */}
          <line x1="450" y1="0" x2="450" y2="300" stroke="#E9ECEC" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="800" y1="0" x2="800" y2="300" stroke="#E9ECEC" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
    );
  }

  if (type === 'divider') {
    return (
      <div className={`w-full max-w-7xl mx-auto px-6 md:px-12 pointer-events-none select-none ${className}`}>
        <svg viewBox="0 0 1200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <motion.path
            d="M 0 20 L 580 20 C 590 20, 595 10, 600 10 C 605 10, 610 30, 615 30 C 620 30, 625 20, 635 20 L 1200 20"
            stroke="#E9ECEC"
            strokeWidth="1"
            initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <svg viewBox="0 0 100 20" fill="none" className={`w-24 h-5 text-brand-violet opacity-60 ${className}`}>
        <motion.path
          d="M 5 15 L 45 15 C 50 15, 52 5, 55 5 C 58 5, 60 15, 65 15 L 95 15"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
      </svg>
    );
  }

  if (type === 'footer') {
    return (
      <div className={`w-full pointer-events-none select-none overflow-hidden ${className}`}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <motion.path
            d="M 0 30 L 1100 30 C 1110 30, 1120 45, 1130 45 C 1140 45, 1150 15, 1160 15 C 1170 15, 1180 30, 1190 30 L 1440 30"
            stroke="var(--color-brand-violet)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    );
  }

  // Abstract signature
  return (
    <svg viewBox="0 0 60 30" fill="none" className={`w-12 h-6 ${className}`}>
      <motion.path
        d="M 5 25 Q 15 5, 25 15 T 45 10 T 55 20"
        stroke="var(--color-brand-violet)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
    </svg>
  );
}
