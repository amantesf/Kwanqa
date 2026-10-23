// Lip sync for Walia in Talk calls: measures how loud his voice is while a clip
// plays and writes it to the CSS variable --mouth (0 closed to 1 wide open) on
// his wrapper, which opens his mouth (see .walia-talking in globals.css).

export type LipSync = {
  /** Routes a clip through the meter. False if the browser can't, so the caller can fake it. */
  attach: (clip: HTMLAudioElement) => boolean;
  close: () => void;
};

export function createLipSync(target: () => HTMLElement | null): LipSync {
  let context: AudioContext | null = null;
  let meter: AnalyserNode | null = null;
  let samples: Uint8Array<ArrayBuffer> | null = null;
  let frame = 0;
  let level = 0;

  function setMouth(value: number) {
    target()?.style.setProperty('--mouth', value.toFixed(2));
  }

  function tick() {
    if (!meter || !samples) return;
    meter.getByteTimeDomainData(samples);
    let sum = 0;
    for (const s of samples) sum += ((s - 128) / 128) ** 2;
    const loudness = Math.min(1, Math.sqrt(sum / samples.length) * 5);
    // open quickly, close a little slower, so it reads as speech rather than flicker
    level = loudness > level ? level * 0.4 + loudness * 0.6 : level * 0.7 + loudness * 0.3;
    setMouth(level < 0.06 ? 0 : level);
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(frame);
    level = 0;
    setMouth(0);
  }

  return {
    attach(clip) {
      try {
        context ??= new AudioContext();
        if (context.state !== 'running') {
          // Not allowed to play through it yet: play normally this time, and ask to start for the next clip.
          void context.resume();
          return false;
        }
        if (!meter) {
          meter = context.createAnalyser();
          meter.fftSize = 512;
          samples = new Uint8Array(new ArrayBuffer(meter.fftSize));
          meter.connect(context.destination);
        }
        context.createMediaElementSource(clip).connect(meter);
      } catch {
        return false;
      }
      clip.addEventListener('play', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(tick);
      });
      clip.addEventListener('pause', stop);
      clip.addEventListener('ended', stop);
      return true;
    },
    close() {
      stop();
      void context?.close();
      context = null;
      meter = null;
    },
  };
}
