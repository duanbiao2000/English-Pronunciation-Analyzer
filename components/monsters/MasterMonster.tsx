
import React from 'react';

export const MasterMonster: React.FC = () => (
  <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <path d="M40 20 L60 20 L65 40 L35 40 Z" fill="url(#grad1)" />
    {/* Body */}
    <path d="M30 45 L70 45 L75 75 L25 75 Z" fill="url(#grad2)" />
    {/* Eye */}
    <circle cx="50" cy="30" r="4" fill="#60a5fa" />
    {/* Left Arm */}
    <path d="M20 50 L30 45 L30 65 Z" fill="url(#grad1)" />
    {/* Right Arm */}
    <path d="M80 50 L70 45 L70 65 Z" fill="url(#grad1)" />
    {/* Left Leg */}
    <path d="M30 75 L40 75 L35 95 Z" fill="url(#grad2)" />
    {/* Right Leg */}
    <path d="M70 75 L60 75 L65 95 Z" fill="url(#grad2)" />
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
  </svg>
);
