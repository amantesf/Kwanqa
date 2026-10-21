// Records the microphone as 16 kHz mono WAV, the format Azure speech-to-text
// reads directly. (MediaRecorder gives webm or mp4 depending on the browser,
// which Azure's quick transcription endpoint doesn't accept.)

const TARGET_RATE = 16000;
const MAX_SECONDS = 30;

export type Recording = {
  /** Stops recording and returns the audio as a WAV file. */
  stop: () => Promise<Blob>;
  /** Stops without keeping anything. */
  cancel: () => void;
  /** Rough loudness right now, 0 to 1, for the level bars. */
  level: () => number;
};

export async function startRecording(onLimit?: () => void): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
  });
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  // ScriptProcessor is old but works in every browser and needs no extra worker file.
  const processor = context.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  let loudness = 0;
  let samples = 0;

  processor.onaudioprocess = event => {
    const input = event.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(input));
    samples += input.length;
    let sum = 0;
    for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
    loudness = Math.min(1, Math.sqrt(sum / input.length) * 6);
    if (samples / context.sampleRate >= MAX_SECONDS) onLimit?.();
  };
  source.connect(processor);
  processor.connect(context.destination);

  function close() {
    processor.disconnect();
    source.disconnect();
    stream.getTracks().forEach(t => t.stop());
    void context.close();
  }

  return {
    level: () => loudness,
    cancel: close,
    async stop() {
      const rate = context.sampleRate;
      close();
      return toWav(downsample(merge(chunks), rate));
    },
  };
}

function merge(chunks: Float32Array[]) {
  const out = new Float32Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

function downsample(input: Float32Array, rate: number) {
  if (rate === TARGET_RATE) return input;
  const ratio = rate / TARGET_RATE;
  const out = new Float32Array(Math.floor(input.length / ratio));
  for (let i = 0; i < out.length; i++) {
    // Average the samples that fold into this one, which also smooths out hiss.
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += input[j];
    out[i] = sum / Math.max(1, end - start);
  }
  return out;
}

function toWav(samples: Float32Array) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const text = (offset: number, s: string) => [...s].forEach((ch, i) => view.setUint8(offset + i, ch.charCodeAt(0)));
  text(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, TARGET_RATE, true);
  view.setUint32(28, TARGET_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}
