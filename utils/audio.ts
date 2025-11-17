// FIX: Alias the Blob type from @google/genai to avoid conflict with the native browser Blob.
import { Blob as GeminiBlob } from '@google/genai';

// Custom base64 encode function as required by Gemini docs
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Custom base64 decode function as required by Gemini docs
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Custom audio decoding function as browser's native decodeAudioData doesn't work on raw PCM streams
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

/**
 * NEW_FEATURE: A helper function to encode a Float32Array of PCM data into a WAV file Blob.
 * This has been refactored to be reusable for both user recordings and AI-generated audio.
 * @param pcmData The raw audio data.
 * @param sampleRate The sample rate of the audio.
 * @returns A Blob representing the WAV file.
 */
function encodeWAV(pcmData: Float32Array, sampleRate: number): Blob {
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

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + pcm16Data.byteLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, pcm16Data.byteLength, true);

    // 3. Write the PCM data after the header
    new Int16Array(buffer, 44).set(pcm16Data);

    // 4. Return the complete WAV file as a Blob
    return new Blob([view], { type: 'audio/wav' });
}


/**
 * NEW_FEATURE: Creates a WAV file Blob from an array of raw PCM audio chunks (Float32Array).
 * This function is crucial for enabling the playback of the user's recorded audio.
 * @param chunks An array of Float32Array audio chunks.
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
    return encodeWAV(combined, sampleRate);
}


/**
 * NEW_FEATURE: Converts a standard Web Audio API AudioBuffer into a WAV file Blob.
 * This is used to make the AI-generated TTS audio replayable and visualizable.
 * @param buffer The AudioBuffer to convert.
 * @returns A Blob representing the WAV file.
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
    // Assuming mono audio, get the PCM data from the first channel.
    const pcmData = buffer.getChannelData(0);
    return encodeWAV(pcmData, buffer.sampleRate);
}