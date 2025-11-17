import React from 'react';
import type { ErrorPattern } from '../types';

interface ErrorPatternsCardProps {
  patterns: ErrorPattern[];
}

export const ErrorPatternsCard: React.FC<ErrorPatternsCardProps> = ({ patterns }) => {
  if (!patterns || patterns.length === 0) {
    return null;
  }

  return (
    <div className="w-full p-5 bg-gray-800/70 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-lg font-bold text-teal-300 mb-4">Areas for Improvement</h3>
      <div className="space-y-6">
        {patterns.map((pattern, index) => (
          <div key={index} className="border-l-4 border-yellow-500 pl-4">
            <h4 className="text-md font-semibold text-yellow-400">{pattern.error}</h4>
            <p className="mt-1 text-sm text-gray-300">{pattern.explanation}</p>
            <div className="mt-3">
              <h5 className="text-xs font-bold text-gray-400 uppercase">Practice</h5>
              <p className="mt-1 text-sm text-gray-200 font-mono bg-gray-900/50 p-2 rounded">
                {pattern.exercises}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
