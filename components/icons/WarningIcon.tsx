
import React from 'react';

/**
 * NEW_FEATURE: A simple warning triangle icon component for error messages.
 */
export const WarningIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 9v4" />
    <path d="M10.24 3.957l-8.24 14.043h16.48l-8.24 -14.043z" />
    <path d="M12 16h.01" />
  </svg>
);
