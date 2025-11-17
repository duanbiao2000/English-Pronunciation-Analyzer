
import React, { useRef, useEffect, useState } from 'react';

interface WaveformDisplayProps {
  audioUrl: string;
  color: string;
}

// Create a single, shared AudioContext instance for decoding.
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

/**
 * NEW_FEATURE: A component that visualizes audio from a given URL as a waveform on a canvas.
 * UX_IMPROVEMENT: Now includes loading and error states for better user feedback.
 */
export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({ audioUrl, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas before processing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const draw = (audioBuffer: AudioBuffer) => {
      const data = audioBuffer.getChannelData(0);
      const width = canvas.width;
      const height = canvas.height;
      const step = Math.ceil(data.length / width);
      const amp = height / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;

        for (let j = 0; j < step; j++) {
          const datum = data[(i * step) + j];
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }
        
        ctx.moveTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
      }
      ctx.stroke();
    };

    const processAudio = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const parent = canvas.parentElement;
        if(parent) {
            canvas.width = parent.clientWidth;
            canvas.height = 80;
        }
        
        draw(audioBuffer);

      } catch (e) {
        console.error("Error processing audio for waveform:", e);
        setError("Could not load waveform");
      } finally {
        setIsLoading(false);
      }
    };
    
    processAudio();
    
    // Optional: Add resize observer to redraw on container resize
    const resizeObserver = new ResizeObserver(() => {
        // Debounce or throttle this in a real app for performance
        processAudio();
    });
    if(canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      if(canvas.parentElement) {
         resizeObserver.unobserve(canvas.parentElement);
      }
    };
  }, [audioUrl, color]);

  return (
    <div className="w-full h-[80px] bg-gray-900/50 rounded-md relative flex items-center justify-center">
      {isLoading && <span className="text-gray-400 text-xs">Loading waveform...</span>}
      {error && <span className="text-red-400 text-xs font-semibold">{error}</span>}
      <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0" />
    </div>
  );
};
