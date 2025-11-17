import React from 'react';
import { WaveformDisplay } from './WaveformDisplay';

interface WaveformComparisonProps {
  userAudioUrl: string | null;
  correctAudioUrl: string | null;
}

/**
 * NEW_FEATURE: A container component that displays two audio waveforms for comparison:
 * one for the user's recording and one for the AI-generated correct pronunciation.
 */
export const WaveformComparison: React.FC<WaveformComparisonProps> = ({ userAudioUrl, correctAudioUrl }) => {
  if (!userAudioUrl || !correctAudioUrl) {
    return null;
  }

  return (
    <div className="w-full p-5 bg-gray-800/70 rounded-xl shadow-lg border border-gray-700 space-y-4">
      <h3 className="text-lg font-bold text-teal-300">Waveform Comparison</h3>
      <div className="space-y-3">
        {/* Waveform for the user's audio */}
        <div>
           <h4 className="text-sm font-semibold text-gray-400 mb-2">Your Waveform</h4>
           <WaveformDisplay audioUrl={userAudioUrl} color="#38bdf8" />
        </div>
        
        {/* Waveform for the correct, AI-generated audio */}
        <div>
           <h4 className="text-sm font-semibold text-gray-400 mb-2">Correct Waveform</h4>
           <WaveformDisplay audioUrl={correctAudioUrl} color="#34d399" />
        </div>
      </div>
    </div>
  );
};