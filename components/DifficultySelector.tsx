
import React from 'react';
import { PHRASE_LIBRARIES, Difficulty } from '../data/phrases';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  disabled: boolean;
}

/**
 * NEW_FEATURE: A component that allows users to select their desired difficulty level.
 * This is a key part of the new gamified progression system.
 */
export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ currentDifficulty, onDifficultyChange, disabled }) => {
  const difficulties = Object.keys(PHRASE_LIBRARIES) as Difficulty[];

  return (
    <div className="flex flex-wrap justify-center items-center p-2 bg-gray-800 rounded-lg space-x-2 my-4">
      {difficulties.map((difficulty) => {
        const isActive = currentDifficulty === difficulty;
        const baseClasses = "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500";
        const activeClasses = "bg-blue-600 text-white shadow-md";
        const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";
        const disabledClasses = "opacity-50 cursor-not-allowed";

        return (
          <button
            key={difficulty}
            onClick={() => onDifficultyChange(difficulty)}
            disabled={disabled}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${disabled ? disabledClasses : ''}`}
            aria-pressed={isActive}
          >
            {PHRASE_LIBRARIES[difficulty].name}
          </button>
        );
      })}
    </div>
  );
};
