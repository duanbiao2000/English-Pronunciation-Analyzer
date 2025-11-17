import React, { useRef, useEffect } from 'react';

interface WaveformDisplayProps {
  audioUrl: string;
  color: string;
}

// Create a single, shared AudioContext instance.
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

/**
 * NEW_FEATURE: A component that visualizes audio from a given URL as a waveform on a canvas.
 */
export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({ audioUrl, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;

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
        
        // Draw a vertical line from min to max amplitude for this segment
        ctx.moveTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
      }
      ctx.stroke();
    };

    const processAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        // Use the shared AudioContext to decode the data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Set canvas dimensions based on parent container
        const parent = canvas.parentElement;
        if(parent) {
            canvas.width = parent.clientWidth;
            canvas.height = 80; // Fixed height for waveform
        }
        
        draw(audioBuffer);

      } catch (e) {
        console.error("Error processing audio for waveform:", e);
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
      cancelAnimationFrame(animationFrameId);
      if(canvas.parentElement) {
         resizeObserver.unobserve(canvas.parentElement);
      }
    };
  }, [audioUrl, color]);

  return <canvas ref={canvasRef} className="w-full h-[80px] bg-gray-900/50 rounded-md" />;
};