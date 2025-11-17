
/**
 * NEW_FEATURE: This file contains functions to generate simple audio sound effects
 * using the browser's Web Audio API. This avoids the need for external audio files.
 */

// Create a single, shared AudioContext to be reused for all sound effects.
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

/**
 * A helper function to play a single tone.
 * @param frequency The frequency of the tone in Hertz.
 * @param duration The duration of the tone in seconds.
 * @param startTime The time to start playing the tone, relative to the AudioContext's clock.
 */
function playTone(frequency: number, duration: number, startTime: number) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Configure the sound properties
  oscillator.type = 'sine'; // A smooth, clean tone
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gainNode.gain.setValueAtTime(0.1, startTime); // Start at a safe volume
  // Fade out quickly to avoid clicks
  gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

  // Schedule the start and stop times
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

/**
 * Plays a cheerful, ascending three-tone chime.
 * This is used as a success sound when the user achieves a high score.
 */
export const playSuccessSound = () => {
  const now = audioCtx.currentTime;
  playTone(523.25, 0.1, now);       // C5
  playTone(659.25, 0.1, now + 0.1); // E5
  playTone(783.99, 0.15, now + 0.2); // G5
};
