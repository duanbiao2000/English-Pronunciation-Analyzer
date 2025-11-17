
import React from 'react';

interface ScoreDisplayProps {
  score: number | null;
  // NEW_FEATURE: A boolean to indicate if the score is high enough to trigger a special visual effect.
  isHighScore: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, isHighScore }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = score !== null ? circumference - (score / 100) * circumference : circumference;

  const scoreColor = score !== null ? (score >= 80 ? 'text-green-400' : score > 60 ? 'text-yellow-400' : 'text-red-400') : 'text-gray-400';

  return (
    // NEW_FEATURE: Conditionally apply the 'high-score-glow' class for a celebratory visual effect.
    <div className={`bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col items-center justify-center min-h-[150px] h-full transition-shadow duration-500 ${isHighScore ? 'high-score-glow' : ''}`}>
      <h3 className="text-sm font-semibold text-gray-400 mb-2">Accuracy Score</h3>
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className={`transform -rotate-90 origin-center transition-all duration-1000 ease-in-out ${scoreColor}`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${scoreColor}`}>
            {score !== null ? score : '--'}
          </span>
        </div>
      </div>
    </div>
  );
};
