
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { PHRASE_LIBRARIES, Difficulty } from '../data/phrases';
import { NewbieMonster } from './monsters/NewbieMonster';
import { ApprenticeMonster } from './monsters/ApprenticeMonster';
import { ExpertMonster } from './monsters/ExpertMonster';
import { MasterMonster } from './monsters/MasterMonster';
import { LegendMonster } from './monsters/LegendMonster';

interface LevelCompleteAnimationProps {
  difficulty: Difficulty;
  onNextLevel: () => void;
  onReplayLevel: () => void;
}

interface MonsterConfig {
  component: React.FC;
  name: string;
  defeatAnimation: string;
}

const MONSTER_CONFIG: Record<Difficulty, MonsterConfig> = {
  newbie: {
    component: NewbieMonster,
    name: "Newbie Blob",
    defeatAnimation: 'animate-monster-defeat',
  },
  apprentice: {
    component: ApprenticeMonster,
    name: "Apprentice Slime",
    defeatAnimation: 'animate-monster-defeat',
  },
  expert: {
    component: ExpertMonster,
    name: "Expert Grimoire",
    defeatAnimation: 'animate-monster-defeat',
  },
  master: {
    component: MasterMonster,
    name: "Master Golem",
    defeatAnimation: 'animate-monster-defeat',
  },
  legend: {
    component: LegendMonster,
    name: "Legendary Hydra",
    defeatAnimation: 'animate-monster-explode',
  },
};

export const LevelCompleteAnimation: React.FC<LevelCompleteAnimationProps> = ({ difficulty, onNextLevel, onReplayLevel }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);

  useEffect(() => {
    const defeatTimer = setTimeout(() => {
      setIsDefeated(true);
    }, 500);

    const buttonTimer = setTimeout(() => {
      setShowButtons(true);
    }, 1500); // Buttons appear after the defeat animation starts

    return () => {
      clearTimeout(defeatTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const Monster = MONSTER_CONFIG[difficulty].component;
  const monsterName = MONSTER_CONFIG[difficulty].name;
  const defeatAnimation = MONSTER_CONFIG[difficulty].defeatAnimation;
  const levelName = PHRASE_LIBRARIES[difficulty].name;

  return (
    <div className="text-center flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-2xl shadow-xl w-full max-w-lg">
      <div className="animate-fade-in-and-up">
        <h2 className="text-4xl font-bold text-green-400">Level Cleared!</h2>
        <p className="mt-2 text-gray-300 text-lg">
            You've mastered the <span className="font-semibold text-white">{levelName}</span> level.
        </p>
         <p className="mt-1 text-sm text-green-400">
            The {monsterName} has been defeated!
        </p>
      </div>
      
      <div className="my-8 h-48 flex items-center justify-center">
        <div className={isDefeated ? defeatAnimation : 'animate-monster-intro'}>
          <Monster />
        </div>
      </div>

      {showButtons && (
        <div className="flex items-center space-x-4 animate-fade-in-and-up" style={{ animationDelay: '0.2s' }}>
          <Button onClick={onReplayLevel} variant="secondary" size="md">
            Replay Level
          </Button>
          <Button onClick={onNextLevel} variant="primary" size="md">
            Next Level →
          </Button>
        </div>
      )}
    </div>
  );
};
