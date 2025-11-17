
import React from 'react';

interface FeedbackCardProps {
  feedback: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="w-full p-5 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-md border border-gray-600">
      <h3 className="text-lg font-bold text-teal-300 mb-2">AI Feedback</h3>
      <p className="text-gray-300 whitespace-pre-wrap">{feedback}</p>
    </div>
  );
};
