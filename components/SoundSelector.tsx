import React from 'react';
// FIX: Corrected imports to use SOUND_PRACTICE_LIBRARIES from data/sounds.ts as SOUND_LIBRARIES is not exported.
import { SOUND_PRACTICE_LIBRARIES } from '../data/sounds';
import { Button } from './Button';
// FIX: Imported Difficulty type from types.ts, as SoundCategoryKey is obsolete and Difficulty is the correct type for sound practice levels.
import type { Difficulty } from '../types';

interface SoundSelectorProps {
  // FIX: Replaced obsolete SoundCategoryKey with Difficulty type.
  currentSound: Difficulty;
  // FIX: Replaced obsolete SoundCategoryKey with Difficulty type.
  onSoundChange: (sound: Difficulty) => void;
  disabled: boolean;
}

/**
 * NEW_FEATURE: A component that allows users to select a specific sound category
 * to practice (e.g., 'th', 'r', 'l'). This is displayed when the user is in
 * 'Sound Practice' mode.
 */
export const SoundSelector: React.FC<SoundSelectorProps> = ({ currentSound, onSoundChange, disabled }) => {
  // FIX: Used SOUND_PRACTICE_LIBRARIES and cast keys to Difficulty to match data structure.
  const sounds = Object.keys(SOUND_PRACTICE_LIBRARIES) as Difficulty[];

  return (
    <div className="flex flex-wrap justify-center items-center p-2 bg-gray-800 rounded-lg space-x-2 my-4">
      {sounds.map((sound) => {
        const isActive = currentSound === sound;
        return (
          <Button
            key={sound}
            onClick={() => onSoundChange(sound)}
            disabled={disabled}
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            aria-pressed={isActive}
            className={isActive ? 'shadow-md' : ''}
          >
            {/* FIX: Used SOUND_PRACTICE_LIBRARIES to access the name property. */}
            {SOUND_PRACTICE_LIBRARIES[sound].name}
          </Button>
        );
      })}
    </div>
  );
};
