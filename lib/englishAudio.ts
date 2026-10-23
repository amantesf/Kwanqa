// Spoken English for the English course. Amharic speakers learning English
// hear every English line, answer and word tile, read by a natural English
// voice (Azure, through /api/speak?lang=en). If that isn't available the
// browser's own English voice reads it instead, so there's always sound.

import { englishCourses } from '@/lib/courses-english';
import { PICTURES } from '@/lib/pictures';
import { abcSpeakable } from '@/lib/abc';
import { englishConversations } from '@/lib/conversations-english';

const ETHIOPIC = /[ሀ-፿]/;

/** Plain English we can say out loud (not Amharic, and not a sentence with a blank in it). */
export function isSpeakableEnglish(text: string | null | undefined): text is string {
  return !!text && /[A-Za-z]/.test(text) && !ETHIOPIC.test(text) && !text.includes('__');
}

/** The words of a line, without punctuation, as they appear on word tiles. */
export function englishWords(text: string) {
  return text
    .split(/\s+/)
    .map(w => w.replace(/[.,!?;:“”"…()]/g, ''))
    .filter(Boolean);
}

/** Every line, word and picture name in the English course: the only text /api/speak?lang=en reads. */
export function speakableEnglish(): Set<string> {
  const lines = Object.values(englishCourses).flatMap(course =>
    course.sections.flatMap(s => [...(s.phrases ?? []), ...(s.dialogue ?? [])].map(c => c.english)),
  );
  return new Set([
    ...lines,
    ...lines.flatMap(englishWords),
    ...PICTURES.map(p => p.english),
    ...abcSpeakable(),
    // Walia's lines and the example answers in the English Talk calls
    ...englishConversations.flatMap(c =>
      c.turns.flatMap(t => ['m' in t.walia ? [t.walia.m.english, t.walia.f.english] : [t.walia.english], t.example.english].flat()),
    ),
  ]);
}

export function englishAudioUrl(text: string, slow = false) {
  return `/api/speak?lang=en&text=${encodeURIComponent(text)}${slow ? '&slow=1' : ''}`;
}

/** The browser's own English voice, as a fallback. */
export function speakWithBrowser(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    const voice = synth.getVoices().find(v => v.lang === 'en-US') ?? synth.getVoices().find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  } catch {
    // no voice available: stay quiet
  }
}
