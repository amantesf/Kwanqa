// Recorded audio for lesson phrases. To add one: put the mp3 in
// public/sounds/phrases/ and add a line below with the Amharic exactly as it
// appears in the lesson (punctuation and spacing don't matter).

const RECORDINGS: Record<string, string> = {
  'ደህና ነኝ፣ አንቺ?': 'dehna-negn-anchi.mp3',
};

/** Ignore Ethiopic and Latin punctuation and spaces when matching. */
function key(text: string) {
  return text.replace(/[።፣፤፥፦፧?!.,'"“”\s]/g, '');
}

const BY_KEY = new Map(Object.entries(RECORDINGS).map(([text, file]) => [key(text), `/sounds/phrases/${file}`]));

/** The recording for this Amharic text, or null if there isn't one yet. */
export function phraseAudio(text: string): string | null {
  return BY_KEY.get(key(text)) ?? null;
}
