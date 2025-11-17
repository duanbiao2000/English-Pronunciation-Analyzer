import React, { useRef, useEffect } from 'react';
// NEW_FEATURE: Import the icon for the new playback button.
import { PlayIcon } from './icons/PlayIcon';

interface TranscriptionDisplayProps {
  title: string;
  text: string;
  // NEW_FEATURE: Prop to receive the URL of the user's recorded audio.
  recordedAudioUrl: string | null;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ title, text, recordedAudioUrl }) => {
  // UX_IMPROVEMENT: Use a ref to hold the audio instance, preventing multiple playbacks on rapid clicks.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // When the audio URL changes, create a new audio object.
  useEffect(() => {
    if (recordedAudioUrl) {
      audioRef.current = new Audio(recordedAudioUrl);
    }
    // Cleanup function to pause audio if the component unmounts or URL changes.
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [recordedAudioUrl]);
  
  // NEW_FEATURE: A handler function that plays the audio from the provided URL.
  const handlePlayRecording = () => {
    // UX_IMPROVEMENT: Control a single audio instance to prevent overlapping sounds.
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 min-h-[150px] h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-400">{title}</h3>
        {/* NEW_FEATURE: This button allows users to play back their own recording. 
            It only appears after a recording has been made and is available. */}
        {recordedAudioUrl && (
          <button 
            onClick={handlePlayRecording}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Play your recording"
          >
            <PlayIcon />
          </button>
        )}
      </div>
      <p className="text-gray-200 flex-grow">{text || '...'}</p>
    </div>
  );
};