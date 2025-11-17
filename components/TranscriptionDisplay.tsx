import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { cn } from '../utils/cn';

interface TranscriptionDisplayProps {
  title: string;
  text: string;
  // NEW_FEATURE: Prop to receive the URL of the user's recorded audio.
  recordedAudioUrl: string | null;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ title, text, recordedAudioUrl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!recordedAudioUrl) return;

    const audio = new Audio(recordedAudioUrl);
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onEnd = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('playing', onPlay);
    audio.addEventListener('pause', onEnd);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('playing', onPlay);
      audio.removeEventListener('pause', onEnd);
      audio.removeEventListener('ended', onEnd);
      audioRef.current = null;
    };
  }, [recordedAudioUrl]);

  const handlePlayRecording = () => {
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
            className={cn(
              "transition-colors duration-200 p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
              isPlaying ? "text-blue-400 animate-pulse" : "text-gray-400 hover:text-white"
            )}
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
