import React from 'react';

interface TurevaLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export default function TurevaLogo({ className = '', size = 48, color = 'currentColor' }: TurevaLogoProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={`inline-block ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Defined with precise slanted geometry and smooth corner transitions mimicking original brand image */}
      <g>
        {/* Left 'T' Shape */}
        <path 
          d="M 12 12 
             C 12 12, 43 12, 45 12 
             C 47 12, 47 14, 46 16
             L 22.4 90.3
             C 22.1 91.3, 21.2 92, 20.1 92
             L 5.8 92
             C 4.6 92, 3.8 91, 4.1 89.8
             L 19.8 28.5
             C 20.1 27.5, 19.3 26.5, 18.2 26.5
             L 2.8 26.5
             C 1.4 26.5, 0.4 25.1, 0.9 23.7
             L 7.4 13.9
             C 8.1 12.7, 9.4 12, 10.8 12
             Z" 
          fill={color}
        />
        
        {/* Right 'T' Shape */}
        <path 
          d="M 53.6 15.3 
             C 54.3 13.3, 56.2 12, 58.3 12
             L 93.4 12
             C 94.8 12, 95.8 13.2, 95.4 14.5
             L 90.4 30.5
             C 90.1 31.5, 89.1 32.2, 88.1 32.2
             L 69.2 32.2
             C 68.1 32.2, 67.3 33.2, 67.6 34.3
             L 49.6 90.3
             C 49.3 91.3, 48.4 92, 47.3 92
             L 33 92
             C 31.8 92, 31 91, 31.3 89.8
             L 51.5 21.5
             C 51.7 20.8, 51.7 20.1, 51.5 19.4
             L 53.6 15.3
             Z" 
          fill={color}
        />
      </g>
    </svg>
  );
}
