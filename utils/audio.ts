// REFACTOR: This file has been reorganized for clarity. Functions are grouped into logical sections.

// FIX: Alias the Blob type from @google/genai to avoid conflict with the native browser Blob.
import { Blob as GeminiBlob } from '@google/genai';


// =================================================================================
// Section 1: Base64 Utilities
// Purpose: Custom Base64 functions as required by the Gemini API documentation
// for handling binary data.
// =================================================================================

/**
 * Encodes a Uint8Array into a Base64 string.
 * This custom implementation is required by the Gemini API documentation.
 * @param bytes The byte array to encode.
 * @returns The Base64 encoded string.
 */
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64 string into a Uint8Array.
 * This custom implementation is required by the Gemini API documentation.
 * @param base64 The Base64 string to decode.
 * @returns The decoded byte array.
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}


// =================================================================================
// Section 2: Gemini API Audio Helpers
// Purpose: Functions for preparing audio data for the Gemini API and
// decoding its raw PCM audio output.
// =================================================================================

/**
 * Decodes raw PCM audio data received from the Gemini API into a Web Audio API AudioBuffer.
 * The browser's native `decodeAudioData` cannot handle raw PCM streams, so this is required.
 * @param data The raw 16-bit PCM audio data as a Uint8Array.
 * @param ctx The AudioContext to use for creating the AudioBuffer.
 * @param sampleRate The sample rate of the audio (e.g., 24000).
 * @param numChannels The number of audio channels (e.g., 1 for mono).
 * @returns A promise that resolves to an AudioBuffer.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Creates a Gemini-specific Blob object from raw PCM audio data (Float32Array).
 * This function converts the audio to 16-bit PCM and Base64 encodes it for the API.
 * @param data The raw Float32Array audio data from the microphone.
 * @returns A GeminiBlob object ready to be sent to the API.
 */
// FIX: Use the aliased GeminiBlob type for the API.
export function createBlob(data: Float32Array): GeminiBlob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}


// =================================================================================
// Section 3: WAV File Generation
// Purpose: Functions to convert raw audio data (PCM or AudioBuffer) into a
// standard, playable .wav file Blob for use in the browser.
// =================================================================================

/**
 * Core function to convert raw PCM data (Float32Array) into a Blob containing a WAV file.
 * This function constructs the necessary WAV file header and appends the PCM data.
 * @param pcmData The raw audio data.
 * @param sampleRate The sample rate of the audio.
 * @returns A Blob representing the WAV file.
 */
function pcmToWav(pcmData: Float32Array, sampleRate: number): Blob {
    // 1. Convert the Float32Array to 16-bit PCM (Int16Array)
    const pcm16Data = new Int16Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
        pcm16Data[i] = Math.max(-1, Math.min(1, pcmData[i])) * 32767;
    }

    // 2. Create the WAV file header
    const buffer = new ArrayBuffer(44 + pcm16Data.byteLength);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);

    // RIFF chunk descriptor
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + pcm16Data.byteLength, true); // chunk size
    writeString(8, 'WAVE');

    // "fmt " sub-chunk
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);                      // sub-chunk size (16 for PCM)
    view.setUint16(20, 1, true);                       // audio format (1 for PCM)
    view.setUint16(22, numChannels, true);             // number of channels
    view.setUint32(24, sampleRate, true);              // sample rate
    view.setUint32(28, byteRate, true);                // byte rate
    view.setUint16(32, blockAlign, true);              // block align
    view.setUint16(34, bitsPerSample, true);           // bits per sample
    
    // "data" sub-chunk
    writeString(36, 'data');
    view.setUint32(40, pcm16Data.byteLength, true); // sub-chunk size (audio data size)

    // 3. Write the PCM data after the header
    new Int16Array(buffer, 44).set(pcm16Data);

    // 4. Return the complete WAV file as a Blob
    return new Blob([view], { type: 'audio/wav' });
}


/**
 * Combines multiple chunks of raw PCM audio data and creates a single WAV file Blob.
 * This is used to package the user's complete microphone recording into a playable file.
 * @param chunks An array of Float32Array audio chunks from the microphone.
 * @param sampleRate The sample rate of the audio (e.g., 16000).
 * @returns A Blob representing the complete WAV file.
 */
// FIX: The return type `Blob` now correctly refers to the native browser Blob.
export function createWavBlob(chunks: Float32Array[], sampleRate: number): Blob {
    const totalLength = chunks.reduce((acc, val) => acc + val.length, 0);
    const combined = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
    }
    return pcmToWav(combined, sampleRate);
}


/**
 * Converts a standard Web Audio API AudioBuffer into a WAV file Blob.
 * This is used to make the AI-generated TTS audio replayable and visualizable.
 * @param buffer The AudioBuffer to convert.
 * @returns A Blob representing the WAV file.
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
    // Assuming mono audio, get the PCM data from the first channel.
    const pcmData = buffer.getChannelData(0);
    return pcmToWav(pcmData, buffer.sampleRate);
}