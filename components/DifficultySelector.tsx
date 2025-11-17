
import React from 'react';
import { PHRASE_LIBRARIES, Difficulty } from '../data/phrases';
// REFACTOR: Import the new reusable Button and cn utility.
import { Button } from './Button';

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
      {/* REFACTOR: The button element is replaced with the new reusable Button component. */}
      {difficulties.map((difficulty) => {
        const isActive = currentDifficulty === difficulty;
        return (
          <Button
            key={difficulty}
            onClick={() => onDifficultyChange(difficulty)}
            disabled={disabled}
            // REFACTOR: Style variations are now handled by the 'variant' prop, making the code cleaner.
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            aria-pressed={isActive}
            // REFACTOR: Additional shadow is added for active state for better visual distinction.
            className={isActive ? 'shadow-md' : ''}
          >
            {PHRASE_LIBRARIES[difficulty].name}
          </Button>
        );
      })}
    </div>
  );
};
