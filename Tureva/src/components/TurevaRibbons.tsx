import React from 'react';

export default function TurevaRibbons() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none" id="tureva-bg-ribbons">
      {/* Dynamic Keyframe Injection for High-Quality Smooth Fluid Ribbon Motion */}
      <style>{`
        @keyframes sway-ribbourn-1 {
          0% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(25px, -30px) rotate(1.5deg) scale(1.02);
          }
          66% {
            transform: translate(-15px, 20px) rotate(-1deg) scale(0.98);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
          }
        }

        @keyframes sway-ribbourn-2 {
          0% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-30px, 25px) rotate(-2deg) scale(1.04);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
          }
        }

        @keyframes sway-ribbourn-3 {
          0% {
            transform: translate(0px, 0px) rotate(0deg) scale(0.98);
          }
          40% {
            transform: translate(20px, 15px) rotate(1deg) scale(1.02);
          }
          70% {
            transform: translate(-10px, -20px) rotate(-0.5deg) scale(1);
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg) scale(0.98);
          }
        }

        .ribbon-flow-1 {
          animation: sway-ribbourn-1 30s ease-in-out infinite;
          transform-origin: center center;
          transform-box: fill-box;
        }

        .ribbon-flow-2 {
          animation: sway-ribbourn-2 38s ease-in-out infinite;
          transform-origin: center center;
          transform-box: fill-box;
        }

        .ribbon-flow-3 {
          animation: sway-ribbourn-3 45s ease-in-out infinite;
          transform-origin: center center;
          transform-box: fill-box;
        }
      `}</style>

      <svg
        className="w-full h-full opacity-[0.09]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wave 1: Pure Neon Green to Transparent */}
          <linearGradient id="neonGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34FF18" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#059669" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#34FF18" stopOpacity="0.0" />
          </linearGradient>

          {/* Wave 2: Mint Green highlight */}
          <linearGradient id="neonGlow2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#34FF18" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
          </linearGradient>

          {/* Wave 3: Deep Emerald soft Ribbon */}
          <linearGradient id="neonGlow3" x1="10%" y1="90%" x2="90%" y2="10%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#34FF18" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Curved Ribbon 1: Upper flowing band */}
        <path
          className="ribbon-flow-1"
          d="M -100,150 
             C 250,550, 650,50, 1100,380 
             C 1250,490, 1400,450, 1550,300 
             L 1550,480 
             C 1400,600, 1250,620, 1100,520 
             C 650,225, 250,680, -100,320 
             Z"
          fill="url(#neonGlow1)"
        />

        {/* Curved Ribbon 2: Interactive crossing band */}
        <path
          className="ribbon-flow-2"
          d="M -50,650 
             C 300,300, 800,880, 1200,450 
             C 1320,320, 1420,380, 1500,420 
             L 1500,560 
             C 1420,520, 1320,460, 1200,590 
             C 800,990, 300,450, -50,800 
             Z"
          fill="url(#neonGlow2)"
        />

        {/* Curved Ribbon 3: Fine atmospheric light band crossing vertically */}
        <path
          className="ribbon-flow-3"
          d="M 200,-100 
             C 500,300, 100,600, 800,1000 
             L 950,1000 
             C 250,600, 650,300, 350,-100 
             Z"
          fill="url(#neonGlow3)"
        />
      </svg>
    </div>
  );
}
