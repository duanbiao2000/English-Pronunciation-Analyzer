
import React from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, onClick }) => {
  const buttonClass = isRecording
    ? "bg-red-500 hover:bg-red-600 animate-pulse"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <button
      onClick={onClick}
      className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-in-out shadow-2xl focus:outline-none focus:ring-4 focus:ring-opacity-50 ${isRecording ? 'focus:ring-red-400' : 'focus:ring-blue-400'} ${buttonClass}`}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? <StopIcon /> : <MicrophoneIcon />}
    </button>
  );
};
