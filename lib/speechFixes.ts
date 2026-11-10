// Respellings for words Walia's voice says wrong. ፊደል doesn't show doubled
// consonants (ገና "still" vs ገና "Christmas", said with a long n), so the voice
// sometimes guesses wrong. Write the word as kwanqa shows it on the left and
// a spelling the voice reads correctly on the right; only the voice sees the
// respelling. Find them on /voice-lab, and bump VOICE_VERSION after adding.

const FIXES: Record<string, string> = {
  // 'word as written': 'spelling that makes the voice say it right',
};

export function respell(text: string): string {
  let out = text;
  for (const [word, fix] of Object.entries(FIXES)) out = out.split(word).join(fix);
  return out;
}
