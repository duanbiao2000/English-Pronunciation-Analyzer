
import React from 'react';

export const LegendMonster: React.FC = () => (
  <svg width="200" height="180" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <path d="M100 180 C 80 140, 120 140, 100 180 Z" fill="#4a5568" />
    <path d="M70 120 C 40 180, 160 180, 130 120 C 120 100, 80 100, 70 120 Z" fill="url(#grad_body)" />
    
    {/* Left Head */}
    <path d="M60 120 C 20 100, 20 40, 50 20 C 70 30, 80 70, 60 120 Z" fill="url(#grad_head)" stroke="#2d3748" strokeWidth="2"/>
    <circle cx="45" cy="40" r="6" fill="#ef4444"/>
    <path d="M40 55 C 45 60, 55 60, 60 55" stroke="white" strokeWidth="2" strokeLinecap="round"/>

    {/* Middle Head */}
    <path d="M100 130 C 80 80, 120 80, 100 20 C 110 50, 120 90, 100 130 Z" fill="url(#grad_head)" stroke="#2d3748" strokeWidth="2"/>
    <circle cx="100" cy="45" r="8" fill="#ef4444"/>
    <path d="M90 65 C 100 75, 110 75, 120 65" stroke="white" strokeWidth="3" strokeLinecap="round"/>

    {/* Right Head */}
    <path d="M140 120 C 180 100, 180 40, 150 20 C 130 30, 120 70, 140 120 Z" fill="url(#grad_head)" stroke="#2d3748" strokeWidth="2"/>
    <circle cx="155" cy="40" r="6" fill="#ef4444"/>
    <path d="M140 55 C 145 60, 155 60, 160 55" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    
    <defs>
      <radialGradient id="grad_body">
        <stop offset="0%" stopColor="#718096" />
        <stop offset="100%" stopColor="#2d3748" />
      </radialGradient>
      <radialGradient id="grad_head">
        <stop offset="0%" stopColor="#4a5568" />
        <stop offset="100%" stopColor="#1a202c" />
      </radialGradient>
    </defs>
  </svg>
);
