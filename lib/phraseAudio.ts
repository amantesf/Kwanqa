// Recorded audio for lesson phrases. To add one: put the mp3 in
// public/sounds/phrases/ and add a line below with the Amharic exactly as it
// appears in the lesson (punctuation and spacing don't matter).

const RECORDINGS: Record<string, string> = {
  'እግዚአብሔር ይመስገን': 'egziabher-yimesgen.mp3',
  'ደህና ነኝ፣ አንተስ?': 'dehna-negn-antes.mp3',
  'ሰላም እንዴት ነህ?': 'selam-endet-neh.mp3',
  'ሰላም እንዴት ነሽ?': 'selam-endet-nesh.mp3',
  'ደህና ነኝ፣ አንቺስ?': 'dehna-negn-anchis.mp3',
  'ደህና ነኝ፣ እግዚአብሔር ይመስገን።': 'dehna-negn-egziabher-yimesgen.mp3',
  'ደህና ነኝ': 'dehna-negn.mp3',
  'ሰላም እንዴት': 'selam-endet.mp3',
  // single words, for the word tiles
  'ነህ': 'neh.mp3',
  'ደህና': 'dehna.mp3',
  'ሰላም': 'selam.mp3',
  'ነኝ': 'negn.mp3',
  'እንዴት': 'endet.mp3',
  'እንገናኝ': 'inigenagn.mp3',
  'ስምዎ': 'simwo.mp3',
  'ትንሽ': 'tinish.mp3',
  'አንተስ': 'antes.mp3',
  'ነገ': 'nege.mp3',
  'ሁን': 'hun.mp3',
  'በመንገድህ': 'bemengedih.mp3',
  'ትናገራለህ': 'tinageraleh.mp3',
  'አደሩ': 'aderu.mp3',
  'እግዚአብሔር': 'egziabher.mp3',
  'ነሽ': 'nesh.mp3',
  'ይመስገን': 'yimesgen.mp3',
  'አንቺስ': 'anchis.mp3',
};

/**
 * Ignore Ethiopic and Latin punctuation, spaces and fill-in blanks when matching,
 * so "ደህና ነኝ፣ ____?" plays the recording of the part you can see, "ደህና ነኝ".
 */
function key(text: string) {
  return text.replace(/[።፣፤፥፦፧?!.,'"“”_\s]/g, '');
}

const BY_KEY = new Map(Object.entries(RECORDINGS).map(([text, file]) => [key(text), `/sounds/phrases/${file}`]));

/** The recording for this Amharic text, or null if there isn't one yet. */
export function phraseAudio(text: string): string | null {
  return BY_KEY.get(key(text)) ?? null;
}
