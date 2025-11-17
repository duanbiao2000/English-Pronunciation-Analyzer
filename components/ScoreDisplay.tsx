import React from 'react';

interface ScoreDisplayProps {
  score: number | null;
  isHighScore: boolean;
  // NEW_FEATURE: A boolean for a perfect score to trigger a special celebration effect.
  isPerfectScore: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, isHighScore, isPerfectScore }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = score !== null ? circumference - (score / 100) * circumference : circumference;

  // NEW_FEATURE: A perfect score gets a special golden color.
  const scoreColor = isPerfectScore ? 'text-yellow-400' : score !== null ? (score >= 80 ? 'text-green-400' : score > 60 ? 'text-yellow-400' : 'text-red-400') : 'text-gray-400';

  return (
    // NEW_FEATURE: Conditionally apply a more intense 'perfect-score-glow' for a score of 100.
    <div className={`bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col items-center justify-center min-h-[150px] h-full transition-shadow duration-500 ${isPerfectScore ? 'perfect-score-glow' : isHighScore ? 'high-score-glow' : ''}`}>
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
       {/* NEW_FEATURE: Display a "Perfect!" message for a score of 100. */}
      {isPerfectScore && (
        <p className="mt-2 text-yellow-400 font-bold text-lg animate-pulse">
          Perfect! 🎉
        </p>
      )}
    </div>
  );
};