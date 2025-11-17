
import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { cn } from '../utils/cn';

interface PronunciationCardProps {
  phrase: string;
  audioUrl: string | null;
  progressText: string;
  description?: string;
}

// Helper function to render phrases with various markdown-style markers.
const renderFormattedPhrase = (phrase: string) => {
  // Split by bold markers first to handle stress.
  const parts = phrase.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    // If it's a bolded part, render it as a strong element.
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-blue-300 font-bold">{part.slice(2, -2)}</strong>;
    }
    
    // BATCH_4: For regular text parts, check for connection markers.
    // The '~' character is replaced with a visual ligature to show word linking.
    const connectionParts = part.split('~');
    return connectionParts.map((text, i) => (
      <React.Fragment key={`${index}-${i}`}>
        {text}
        {i < connectionParts.length - 1 && <span className="text-gray-500 font-sans mx-1">‿</span>}
      </React.Fragment>
    ));
  });
};


export const PronunciationCard: React.FC<PronunciationCardProps> = ({ phrase, audioUrl, progressText, description }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
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
  }, [audioUrl]);
  
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  };
  
  return (
    <div className="w-full p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-md font-semibold text-blue-300">Let's Practice:</h2>
            <span className="text-xs font-mono px-2 py-1 bg-gray-700 text-gray-300 rounded-md">
              {progressText}
            </span>
          </div>
          {description && <p className="text-sm text-gray-400 mb-2">{description}</p>}
          <p className="text-xl sm:text-2xl text-gray-200 font-medium">
            "{renderFormattedPhrase(phrase)}"
          </p>
        </div>
        {audioUrl && (
          <button
            onClick={handlePlay}
            className={cn(
              "transition-colors duration-200 p-3 rounded-full bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
              isPlaying ? "text-blue-400 animate-pulse" : "text-gray-400 hover:text-white"
            )}
            aria-label="Play correct pronunciation"
          >
            <PlayIcon />
          </button>
        )}
      </div>
    </div>
  );
};