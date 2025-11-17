import React from 'react';
import { Button } from './Button';
import type { AdaptationDrill } from '../types';

interface AdaptationDrillSelectorProps {
  currentDrill: AdaptationDrill;
  onDrillChange: (drill: AdaptationDrill) => void;
  disabled: boolean;
}

const DRILL_OPTIONS: { id: AdaptationDrill; name: string }[] = [
    { id: 'minimal_pairs', name: 'Minimal Pairs' },
    { id: 'intonation', name: 'Intonation & Stress' },
    { id: 'connected_speech', name: 'Connected Speech' },
];

export const AdaptationDrillSelector: React.FC<AdaptationDrillSelectorProps> = ({ currentDrill, onDrillChange, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center items-center p-2 bg-gray-800 rounded-lg space-x-2 my-4">
      {DRILL_OPTIONS.map((drill) => {
        const isActive = currentDrill === drill.id;
        return (
          <Button
            key={drill.id}
            onClick={() => onDrillChange(drill.id)}
            disabled={disabled}
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            aria-pressed={isActive}
            className={isActive ? 'shadow-md' : ''}
          >
            {drill.name}
          </Button>
        );
      })}
    </div>
  );
};
