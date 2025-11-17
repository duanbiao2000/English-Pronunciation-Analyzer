
import React from 'react';

interface StatusMessageProps {
  isLoading: boolean;
  error: string | null;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ isLoading, error }) => {
  if (error) {
    return <div className="text-red-400 text-center mt-4">{error}</div>;
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center space-x-2 text-gray-400 mt-4">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
            <span>Analyzing...</span>
        </div>
    );
  }

  return null;
};
