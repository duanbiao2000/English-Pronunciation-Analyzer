
import React from 'react';
import { PlayIcon } from './icons/PlayIcon';

interface PronunciationCardProps {
  phrase: string;
  audioUrl: string | null;
  // NEW_FEATURE: Props to display the current stage progress (e.g., "Stage 3 of 5").
  stage: number;
  totalStages: number;
}

export const PronunciationCard: React.FC<PronunciationCardProps> = ({ phrase, audioUrl, stage, totalStages }) => {
  
  const handlePlay = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
  };
  
  return (
    <div className="w-full p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-center">
        <div>
           {/* NEW_FEATURE: Display the current stage progress to enhance the game-like feel. */}
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-md font-semibold text-blue-300">Let's Practice:</h2>
            <span className="text-xs font-mono px-2 py-1 bg-gray-700 text-gray-300 rounded-md">
              Stage {stage} / {totalStages}
            </span>
          </div>
          <p className="text-xl sm:text-2xl text-gray-200 font-medium">
            "{phrase}"
          </p>
        </div>
        {audioUrl && (
          <button
            onClick={handlePlay}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-3 rounded-full bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Play correct pronunciation"
          >
            <PlayIcon />
          </button>
        )}
      </div>
    </div>
  );
};
