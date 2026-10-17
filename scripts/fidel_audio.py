"""Make a recording of every fidel letter for the Alphabet page.

Uses Meta's free, open-source Amharic voice (MMS-TTS):
https://huggingface.co/facebook/mms-tts-amh  (license: CC-BY-NC 4.0, non-commercial)

It reads the letters from lib/fidel.ts, says each one, and saves it to
public/sounds/fidel/<code point>.mp3 (e.g. 1200.mp3 for ሀ). Letters that sound
the same as another (sameAs) are skipped; the app reuses the other's recording.

Run it once from the project folder:
    python3 -m venv .venv-audio
    .venv-audio/bin/pip install -r scripts/requirements-fidel-audio.txt
    .venv-audio/bin/python scripts/fidel_audio.py

Existing files are kept, so a native speaker's recording dropped into
public/sounds/fidel/ is never overwritten. Use --force to remake everything.

To compare voice settings on a few letters first:
    .venv-audio/bin/python scripts/fidel_audio.py --compare
That writes _voice-test/<letter>-A.mp3, -B.mp3, -C.mp3 to listen to. Then make
everything with the setting you like, e.g.:
    .venv-audio/bin/python scripts/fidel_audio.py --force --style B
"""

import re
import sys
from pathlib import Path

import lameenc
import numpy as np
import torch
from transformers import AutoTokenizer, VitsModel

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "sounds" / "fidel"
MODEL = "facebook/mms-tts-amh"
VOWEL_ORDERS = 7

# Voice styles to compare. A single syllable on its own can come out breathy,
# so B and C turn down the random "noise" and slow the voice a little.
#   noise: how much random breathiness/variation (model default 0.667)
#   length: how much variation in timing (model default 0.8)
#   rate: speaking speed (1.0 = normal, lower = slower)
#   suffix: text added after the letter (C adds the Ethiopic full stop, so it's
#           read like a short sentence rather than a fragment)
STYLES = {
    "A": dict(noise=0.667, length=0.8, rate=1.0, suffix=""),
    "B": dict(noise=0.3, length=0.4, rate=0.85, suffix=""),
    "C": dict(noise=0.3, length=0.4, rate=0.8, suffix="።"),
}
COMPARE_LETTERS = ["ሀ", "ለ", "መ", "ቀ", "ጠ", "ጨ", "ጸ", "ኡ"]


def letters():
    """Code points of every letter that needs its own recording."""
    source = (ROOT / "lib" / "fidel.ts").read_text(encoding="utf-8")
    codes = []
    for line in source.splitlines():
        m = re.search(r"code:\s*0x([0-9a-fA-F]+)", line)
        if m and "sameAs" not in line:
            base = int(m.group(1), 16)
            codes.extend(base + i for i in range(VOWEL_ORDERS))
    return codes


def to_mp3(wave: np.ndarray, rate: int) -> bytes:
    # Trim silence at the ends, leave a little breathing room, and normalise.
    loud = np.where(np.abs(wave) > 0.02 * np.abs(wave).max())[0]
    if loud.size:
        pad = int(0.06 * rate)
        wave = wave[max(0, loud[0] - pad) : loud[-1] + pad]
    wave = wave / (np.abs(wave).max() or 1) * 0.9
    pcm = (wave * 32767).astype(np.int16).tobytes()
    enc = lameenc.Encoder()
    enc.set_bit_rate(64)
    enc.set_in_sample_rate(rate)
    enc.set_channels(1)
    enc.set_quality(2)
    return enc.encode(pcm) + enc.flush()


def load_voice():
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    model = VitsModel.from_pretrained(MODEL)
    model.eval()
    romanize = None
    if getattr(tokenizer, "is_uroman", False):
        import uroman  # this voice expects romanised text

        romanize = uroman.Uroman().romanize_string
    return tokenizer, model, romanize


def say(text, style, voice):
    tokenizer, model, romanize = voice
    s = STYLES[style]
    model.noise_scale = s["noise"]
    model.noise_scale_duration = s["length"]
    model.speaking_rate = s["rate"]
    phrase = text + s["suffix"]
    inputs = tokenizer(romanize(phrase) if romanize else phrase, return_tensors="pt")
    if inputs["input_ids"].shape[-1] == 0:
        return None
    torch.manual_seed(0)  # the same letter always sounds the same
    with torch.no_grad():
        wave = model(**inputs).waveform[0].numpy()
    return to_mp3(wave, model.config.sampling_rate)


def compare():
    out = ROOT / "_voice-test"
    out.mkdir(exist_ok=True)
    print("Loading the Amharic voice…")
    voice = load_voice()
    for letter in COMPARE_LETTERS:
        for style in STYLES:
            mp3 = say(letter, style, voice)
            if mp3:
                (out / f"{letter}-{style}.mp3").write_bytes(mp3)
        print(f"  {letter}  A B C")
    print(f"Done. Listen to the files in {out.relative_to(ROOT)}/ (delete the folder afterwards)")


def main():
    if "--compare" in sys.argv:
        return compare()
    force = "--force" in sys.argv
    style = sys.argv[sys.argv.index("--style") + 1] if "--style" in sys.argv else "B"
    if style not in STYLES:
        sys.exit(f"Unknown style {style}. Choose one of: {', '.join(STYLES)}")
    OUT.mkdir(parents=True, exist_ok=True)
    codes = letters()
    todo = [c for c in codes if force or not (OUT / f"{c:x}.mp3").exists()]
    print(f"{len(codes)} letters, {len(todo)} to record in style {style}. Loading the Amharic voice…")
    if not todo:
        return

    voice = load_voice()
    skipped = []
    for n, code in enumerate(todo, 1):
        text = chr(code)
        mp3 = say(text, style, voice)
        if mp3 is None:
            skipped.append(text)
            continue
        (OUT / f"{code:x}.mp3").write_bytes(mp3)
        print(f"  {n}/{len(todo)}  {text}")

    print(f"Done. Saved to {OUT.relative_to(ROOT)}")
    if skipped:
        print("The voice couldn't read these letters:", " ".join(skipped))


if __name__ == "__main__":
    main()
