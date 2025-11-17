/**
 * NEW_FEATURE: This file contains functions to generate simple audio sound effects
 * using the browser's Web Audio API. This avoids the need for external audio files.
 */

// Create a single, shared AudioContext to be reused for all sound effects.
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

interface ToneOptions {
    type?: OscillatorType;
    gain?: number;
}

/**
 * A helper function to play a single tone with more control.
 * @param frequency The frequency of the tone in Hertz.
 * @param duration The duration of the tone in seconds.
 * @param startTime The time to start playing the tone, relative to the AudioContext's clock.
 * @param options Optional settings for the oscillator type and gain.
 */
function playTone(frequency: number, duration: number, startTime: number, options: ToneOptions = {}) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const { type = 'sine', gain = 0.1 } = options;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Configure the sound properties
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gainNode.gain.setValueAtTime(gain, startTime);
  // Fade out quickly to avoid clicks
  gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

  // Schedule the start and stop times
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

/**
 * UX_IMPROVEMENT: Plays a more complex, layered, and celebratory sound for high scores.
 * This new sound is richer and more noticeable than the previous simple chime.
 * It consists of a low bass note for foundation and a pleasant, ascending arpeggio with a final sparkle.
 */
export const playSuccessSound = () => {
  const now = audioCtx.currentTime;
  const baseGain = 0.08;

  // 1. Subtle bass note for foundation
  playTone(130.81, 0.4, now, { type: 'sine', gain: baseGain * 0.8 }); // C3

  // 2. Main ascending arpeggio using a richer 'triangle' wave
  playTone(523.25, 0.12, now, { type: 'triangle', gain: baseGain });       // C5
  playTone(659.25, 0.12, now + 0.1, { type: 'triangle', gain: baseGain }); // E5
  playTone(783.99, 0.12, now + 0.2, { type: 'triangle', gain: baseGain }); // G5
  playTone(987.77, 0.12, now + 0.3, { type: 'triangle', gain: baseGain }); // B5

  // 3. Final high "sparkle" note
  playTone(1046.50, 0.15, now + 0.4, { type: 'sine', gain: baseGain * 0.9 }); // C6
};
