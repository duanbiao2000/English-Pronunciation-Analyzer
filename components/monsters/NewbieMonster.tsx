
import React from 'react';

export const NewbieMonster: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="url(#paint0_radial_newbie)" />
    <circle cx="50" cy="50" r="12" fill="white" />
    <circle cx="50" cy="50" r="5" fill="black" />
    <path d="M35 70 Q 50 80 65 70" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <defs>
      <radialGradient id="paint0_radial_newbie" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(40)">
        <stop stopColor="#a78bfa" />
        <stop offset="1" stopColor="#7c3aed" />
      </radialGradient>
    </defs>
  </svg>
);
