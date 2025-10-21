// utils/audio.ts

/**
 * Encodes an array of bytes into a Base64 string.
 * @param {Uint8Array} bytes The bytes to encode.
 * @returns {string} The Base64 encoded string.
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
 * Decodes a Base64 string into an array of bytes.
 * @param {string} base64 The Base64 string to decode.
 * @returns {Uint8Array} The decoded bytes.
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

/**
 * Decodes raw PCM audio data into an AudioBuffer for playback.
 * The browser's native decodeAudioData is for file formats like MP3/WAV, not raw streams.
 * @param {Uint8Array} data The raw PCM data (Int16).
 * @param {AudioContext} ctx The AudioContext for creating the buffer.
 * @param {number} sampleRate The sample rate of the audio.
 * @param {number} numChannels The number of audio channels.
 * @returns {Promise<AudioBuffer>} A promise that resolves with the AudioBuffer.
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
