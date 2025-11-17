
import React from 'react';
import { Button } from './Button';
import type { PracticeMode } from '../types';

interface PracticeModeSelectorProps {
  currentMode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  disabled: boolean;
}

/**
 * NEW_FEATURE: A component that allows the user to switch between the main
 * practice modes: practicing full phrases or focusing on specific sounds.
 */
export const PracticeModeSelector: React.FC<PracticeModeSelectorProps> = ({ currentMode, onModeChange, disabled }) => {
  return (
    <div className="flex justify-center items-center p-2 bg-gray-900 rounded-lg space-x-2 my-4 border border-gray-700">
      <Button
        onClick={() => onModeChange('phrase')}
        disabled={disabled}
        variant={currentMode === 'phrase' ? 'primary' : 'secondary'}
        size="sm"
        aria-pressed={currentMode === 'phrase'}
      >
        Phrase Practice
      </Button>
      <Button
        onClick={() => onModeChange('sound')}
        disabled={disabled}
        variant={currentMode === 'sound' ? 'primary' : 'secondary'}
        size="sm"
        aria-pressed={currentMode === 'sound'}
      >
        Sound Practice
      </Button>
       <Button
        onClick={() => onModeChange('shadowing')}
        disabled={disabled}
        variant={currentMode === 'shadowing' ? 'primary' : 'secondary'}
        size="sm"
        aria-pressed={currentMode === 'shadowing'}
      >
        Shadowing Practice
      </Button>
      <Button
        onClick={() => onModeChange('adaptation')}
        disabled={disabled}
        variant={currentMode === 'adaptation' ? 'primary' : 'secondary'}
        size="sm"
        aria-pressed={currentMode === 'adaptation'}
      >
        Adaptation Practice
      </Button>
    </div>
  );
};