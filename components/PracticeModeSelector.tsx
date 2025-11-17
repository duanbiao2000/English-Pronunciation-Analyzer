import React from 'react';
import { Button } from './Button';

interface PracticeModeSelectorProps {
  currentMode: 'phrase' | 'sound';
  onModeChange: (mode: 'phrase' | 'sound') => void;
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
    </div>
  );
};