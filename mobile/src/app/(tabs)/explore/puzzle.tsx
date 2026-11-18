import { useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { amharicAudio } from '@/lib/amharicAudio';
import { FIDEL } from '@/lib/fidel';
import {
  PUZZLE_LENGTH,
  PUZZLE_TRIES,
  markGuess,
  puzzleNumber,
  puzzleWord,
  rowInWord,
  sameRow,
  shareText,
  type Mark,
} from '@/lib/fidelPuzzle';
import { storage } from '@/lib/storage';
import { feel } from '@/haptics';
import { play, playEffect } from '@/components/sound';
import { fonts, makeStyles, useColors } from '@/theme';

// The daily ፊደል puzzle, like the website's (alphabet page → Puzzle): guess
// today's three-letter word in six tries. Tap a letter family, then pick the
// vowel. Green: right letter, right place. Blue: right consonant, wrong vowel.
// Gold: in the word, another place. Today's board is kept on this phone.

const KEY = 'kwanqa-fidel-puzzle';

function load(number: number): string[] {
  try {
    const saved = JSON.parse(storage().getItem(KEY) ?? 'null') as { number: number; guesses: string[] } | null;
    return saved?.number === number ? saved.guesses : [];
  } catch {
    return [];
  }
}

function save(number: number, guesses: string[]) {
  try {
    storage().setItem(KEY, JSON.stringify({ number, guesses }));
  } catch {
    // not saved: the board lasts until the app closes
  }
}

const LEGEND: [Mark, string][] = [
  ['right', 'right letter, right place'],
  ['family', 'right consonant, wrong vowel'],
  ['moved', 'in the word, another place'],
];

export default function Puzzle() {
  const styles = useStyles();
  const colors = useColors();
  const [number] = useState(() => puzzleNumber());
  const answer = puzzleWord(number);
  const [guesses, setGuesses] = useState<string[]>(() => load(number));
  const [typed, setTyped] = useState<string[]>([]);
  const [row, setRow] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const marks = guesses.map(g => markGuess(g, answer.word));
  const won = marks.some(m => m.every(x => x === 'right'));
  const over = won || guesses.length >= PUZZLE_TRIES;

  const fill: Record<Mark, string> = { right: colors.green, family: colors.blue, moved: colors.gold, out: '#a39887' };

  function add(char: string) {
    if (over || typed.length >= PUZZLE_LENGTH) return;
    feel('pick');
    setTyped(t => [...t, char]);
    setRow(null);
    setNote('');
  }

  function guess() {
    if (over) return;
    if (typed.length < PUZZLE_LENGTH) {
      setNote(`Today’s word has ${PUZZLE_LENGTH} letters.`);
      return;
    }
    const next = [...guesses, typed.join('')];
    const right = markGuess(next[next.length - 1], answer.word).every(m => m === 'right');
    playEffect(right ? 'complete' : next.length >= PUZZLE_TRIES ? 'wrong' : 'correct');
    setGuesses(next);
    save(number, next);
    setTyped([]);
  }

  /** The best thing known about a consonant key, to colour it. */
  function keyState(base: string): Mark | undefined {
    let best: Mark | undefined;
    guesses.forEach((g, gi) =>
      [...g].forEach((ch, i) => {
        if (!sameRow(ch, base)) return;
        const m = marks[gi][i];
        if (m === 'right') best = 'right';
        else if (m === 'moved' && best !== 'right') best = 'moved';
        else if (m === 'family' && best !== 'right' && best !== 'moved') best = 'family';
        else if (!best && !rowInWord(base, answer.word)) best = 'out';
      }),
    );
    return best;
  }

  const open = row ? FIDEL.find(r => r.base === row) : null;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>Daily ፊደል puzzle</Text>
      <Text style={styles.lead}>Guess today’s three-letter Amharic word in six tries. Tap a letter family, then pick the vowel.</Text>

      <View style={styles.board}>
        {Array.from({ length: PUZZLE_TRIES }, (_, i) => {
          const letters = i < guesses.length ? [...guesses[i]] : i === guesses.length && !over ? typed : [];
          return (
            <View key={i} style={styles.boardRow}>
              {Array.from({ length: PUZZLE_LENGTH }, (_, j) => {
                const m = i < guesses.length ? marks[i][j] : undefined;
                return (
                  <View key={j} style={[styles.tile, letters[j] && !m && styles.tileTyped, m && { backgroundColor: fill[m], borderColor: fill[m] }]}>
                    <Text style={[styles.tileText, m && (m === 'moved' ? styles.tileTextDark : styles.tileTextOn)]}>{letters[j] ?? ''}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        {LEGEND.map(([m, label]) => (
          <View key={m} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: fill[m] }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>

      {over ? (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>{won ? `Got it in ${guesses.length}!` : 'Not this time.'}</Text>
          <Pressable
            onPress={() => {
              const audio = amharicAudio(answer.word);
              if (audio) play(audio);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Hear ${answer.tr}`}
          >
            <Text style={styles.resultWord}>{answer.word}</Text>
          </Pressable>
          <Text style={styles.resultText}>
            {answer.tr} · “{answer.meaning}”
          </Text>
          <Pressable
            onPress={() => void Share.share({ message: shareText(number, marks, won) }).catch(() => {})}
            style={({ pressed }) => [styles.button, pressed && styles.buttonDown]}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Share your result</Text>
          </Pressable>
          <Text style={styles.legendText}>A new word comes at midnight.</Text>
        </View>
      ) : (
        <>
          {note ? <Text style={styles.note}>{note}</Text> : null}
          {open ? (
            <View style={styles.vowels}>
              {open.cells.map(cell => (
                <Pressable key={cell.char} onPress={() => add(cell.char)} style={({ pressed }) => [styles.vowel, pressed && styles.keyDown]} accessibilityRole="button" accessibilityLabel={cell.roman}>
                  <Text style={styles.vowelChar}>{cell.char}</Text>
                  <Text style={styles.vowelRoman}>{cell.roman || cell.vowel.roman}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <View style={styles.keys}>
            {FIDEL.map(r => {
              const state = keyState(r.base);
              return (
                <Pressable
                  key={r.base}
                  onPress={() => {
                    feel('pick');
                    setRow(o => (o === r.base ? null : r.base));
                  }}
                  style={({ pressed }) => [
                    styles.key,
                    row === r.base && styles.keyOn,
                    state && state !== 'out' && { backgroundColor: fill[state], borderColor: fill[state] },
                    state === 'out' && styles.keyOut,
                    pressed && styles.keyDown,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: row === r.base }}
                >
                  <Text style={[styles.keyText, (state === 'right' || state === 'family') && styles.tileTextOn]}>{r.base}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={() => {
                setTyped(t => t.slice(0, -1));
                setNote('');
              }}
              disabled={!typed.length}
              style={({ pressed }) => [styles.button, styles.buttonSecondary, !typed.length && styles.disabled, pressed && styles.buttonDown]}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, styles.buttonSecondaryText]}>Delete</Text>
            </Pressable>
            <Pressable onPress={guess} style={({ pressed }) => [styles.button, styles.flex, pressed && styles.buttonDown]} accessibilityRole="button">
              <Text style={styles.buttonText}>Guess</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const useStyles = makeStyles(c => ({
  page: { padding: 16, gap: 14, paddingBottom: 48, alignItems: 'stretch' },
  heading: { fontFamily: fonts.black, fontSize: 26, color: c.ink, textAlign: 'center' },
  lead: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: c.muted, textAlign: 'center' },
  flex: { flex: 1 },
  board: { alignSelf: 'center', gap: 8 },
  boardRow: { flexDirection: 'row', gap: 8 },
  tile: { width: 60, height: 60, borderRadius: 14, borderWidth: 2, borderColor: c.line, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' },
  tileTyped: { borderColor: c.stoneEdge },
  tileText: { fontFamily: fonts.amharicBold, fontSize: 28, lineHeight: 38, color: c.ink },
  tileTextOn: { color: '#ffffff' },
  tileTextDark: { color: '#5a4300' },
  legend: { gap: 6, alignItems: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 4 },
  legendText: { fontFamily: fonts.bold, fontSize: 13, color: c.muted, textAlign: 'center' },
  note: { fontFamily: fonts.heavy, fontSize: 14, color: c.primary, textAlign: 'center' },
  vowels: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 10, borderRadius: 16, backgroundColor: c.bgSoft, justifyContent: 'center' },
  vowel: { width: 64, alignItems: 'center', paddingVertical: 6, borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: c.bg },
  vowelChar: { fontFamily: fonts.amharicBold, fontSize: 24, lineHeight: 34, color: c.ink },
  vowelRoman: { fontFamily: fonts.bold, fontSize: 12, color: c.muted },
  keys: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  key: { width: 44, height: 46, borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' },
  keyOn: { borderColor: c.primary, backgroundColor: c.primarySoft },
  keyOut: { opacity: 0.35 },
  keyDown: { borderBottomWidth: 2 },
  keyText: { fontFamily: fonts.amharicBold, fontSize: 20, lineHeight: 28, color: c.ink },
  actions: { flexDirection: 'row', gap: 10 },
  button: { minHeight: 50, paddingHorizontal: 22, borderRadius: 16, borderBottomWidth: 5, borderBottomColor: c.primaryShadow, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
  buttonDown: { borderBottomWidth: 0, marginTop: 5 },
  buttonText: { fontFamily: fonts.black, fontSize: 16, color: '#ffffff' },
  buttonSecondary: { backgroundColor: c.bg, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line, borderBottomColor: c.line },
  buttonSecondaryText: { color: c.blue },
  disabled: { opacity: 0.5 },
  result: { alignItems: 'center', gap: 8, padding: 18, borderRadius: 18, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line },
  resultTitle: { fontFamily: fonts.black, fontSize: 22, color: c.ink },
  resultWord: { fontFamily: fonts.amharicBold, fontSize: 34, lineHeight: 46, color: c.primary, textDecorationLine: 'underline', textDecorationStyle: 'dotted' },
  resultText: { fontFamily: fonts.bold, fontSize: 15, color: c.muted },
}));
