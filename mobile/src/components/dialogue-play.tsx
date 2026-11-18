import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { amharicAudio } from '@/lib/amharicAudio';
import { buildScene, type Said, type Turn } from '@/lib/conversation';
import type { LessonSection, Track } from '@/lib/courses';
import { englishAudioUrl, isSpeakableEnglish } from '@/lib/englishAudio';
import { typedMatches } from '@/lib/interactive';
import { feel } from '@/haptics';
import Peek from '@/components/peek';
import { play, playEffect } from '@/components/sound';
import Speaker from '@/components/speaker';
import Walia from '@/components/walia';
import { fonts, makeStyles } from '@/theme';

// "Act it out", like the website's (DialoguePlay.tsx): a lesson's dialogue as
// a conversation that flows down the screen. Walia's lines appear and are
// read aloud; on your turn you pick the right reply or type the missing word.

type Shown = { who: 'them' | 'you' | 'note'; said?: Said; text?: string };

function audioFor(text: string, track: Track) {
  if (track === 'english') return isSpeakableEnglish(text) ? englishAudioUrl(text) : null;
  return amharicAudio(text);
}

function Bubble({ shown, track }: { shown: Shown; track: Track }) {
  const styles = useStyles();
  if (shown.who === 'note') return <Text style={styles.note}>{shown.text}</Text>;
  const line = shown.said!;
  const theirs = shown.who === 'them';
  const audio = audioFor(line.learn, track);
  return (
    <View style={[styles.line, !theirs && styles.lineYou]}>
      {theirs ? <Walia pose="happy" size={40} /> : null}
      <View style={[styles.bubble, !theirs && styles.bubbleYou]}>
        <Text style={track === 'english' ? styles.learnEn : styles.learn}>{line.learn}</Text>
        {line.roman ? <Text style={styles.roman}>{line.roman}</Text> : null}
        <Peek track={track}>
          <Text style={styles.meaning}>{line.meaning}</Text>
        </Peek>
      </View>
      {audio ? <Speaker onPress={() => play(audio)} label={`Hear ${line.meaning}`} /> : null}
    </View>
  );
}

export default function DialoguePlay({ lesson, courseLessons, track, onClose }: { lesson: LessonSection; courseLessons: LessonSection[]; track: Track; onClose: () => void }) {
  const styles = useStyles();
  const [scene, setScene] = useState(() => buildScene(lesson, courseLessons, track));
  const [shown, setShown] = useState<Shown[]>([]);
  const [at, setAt] = useState(0);
  const [typed, setTyped] = useState('');
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState('');
  const [mistakes, setMistakes] = useState(0);

  const turns = scene?.turns ?? [];
  const turn: Turn | undefined = turns[at];
  const done = !!scene && at >= turns.length;

  // Walia's lines play by themselves, one after another.
  useEffect(() => {
    if (!turn || (turn.kind !== 'them' && turn.kind !== 'note')) return;
    const t = setTimeout(
      () => {
        if (turn.kind === 'them') {
          setShown(s => [...s, { who: 'them', said: turn.said }]);
          const audio = audioFor(turn.said.learn, track);
          if (audio) play(audio);
        } else {
          setShown(s => [...s, { who: 'note', text: turn.text }]);
        }
        setAt(a => a + 1);
      },
      at === 0 ? 300 : 900,
    );
    return () => clearTimeout(t);
  }, [turn, at, track]);

  if (!scene) return null;

  function answered(line: Said) {
    playEffect('correct');
    setShown(s => [...s, { who: 'you', said: line }]);
    setHint('');
    setTyped('');
    setTries(0);
    setAt(a => a + 1);
  }

  function miss(message: string) {
    playEffect('wrong');
    setHint(message);
    setMistakes(m => m + 1);
  }

  function pick(option: Said) {
    if (turn?.kind !== 'choose') return;
    if (option.learn === turn.said.learn) return answered(option);
    miss(`Not quite: that one means “${option.meaning}”. What would you say back?`);
  }

  function check() {
    if (turn?.kind !== 'fill' || !typed.trim()) return;
    if (typedMatches(turn.accept, typed)) return answered(turn.said);
    const n = tries + 1;
    setTries(n);
    if (n >= 3) {
      setHint(`It was ${turn.accept.join(' (')}${turn.accept.length > 1 ? ')' : ''}.`);
      setTimeout(() => answered(turn.said), 1600);
      return;
    }
    miss(n === 1 ? `Not quite. It starts with ${turn.hint}` : `Close? The whole line means “${turn.said.meaning}”.`);
  }

  return (
    <View style={styles.box}>
      <View style={styles.scene}>
        <Text style={styles.sceneTitle}>{scene.title}</Text>
        <Text style={styles.sceneText}>{scene.setting}</Text>
      </View>

      {shown.map((s, i) => (
        <Bubble key={i} shown={s} track={track} />
      ))}

      {turn?.kind === 'fill' ? (
        <View style={[styles.line, styles.lineYou]}>
          <View style={[styles.bubble, styles.bubbleYou, styles.draft]}>
            <Text style={track === 'english' ? styles.learnEn : styles.learn}>
              {turn.words.map((w, i) => (i === turn.blank ? `${typed || '_____'} ` : `${w} `)).join('')}
            </Text>
          </View>
        </View>
      ) : null}

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}

      {turn?.kind === 'choose' ? (
        <>
          <Text style={styles.task}>Your turn. What do you say?</Text>
          {turn.options.map(o => (
            <Pressable
              key={o.learn}
              onPress={() => {
                feel('pick');
                pick(o);
              }}
              style={({ pressed }) => [styles.option, pressed && styles.optionDown]}
              accessibilityRole="button"
            >
              <Text style={track === 'english' ? styles.learnEn : styles.optionText}>{o.learn}</Text>
              {o.roman ? <Text style={styles.roman}>{o.roman}</Text> : null}
            </Pressable>
          ))}
        </>
      ) : null}

      {turn?.kind === 'fill' ? (
        <>
          <Text style={styles.task}>Your turn. Type the missing word{track === 'amharic' ? ', in ፊደል or Latin letters' : ''}.</Text>
          <View style={styles.fillRow}>
            <TextInput
              value={typed}
              onChangeText={setTyped}
              onSubmitEditing={check}
              placeholder={track === 'amharic' ? 'e.g. selam or ሰላም' : 'Type the word'}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              style={styles.input}
              accessibilityLabel="The missing word"
            />
            <Pressable onPress={check} disabled={!typed.trim()} style={({ pressed }) => [styles.button, !typed.trim() && styles.disabled, pressed && styles.buttonDown]} accessibilityRole="button">
              <Text style={styles.buttonText}>Check</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      {done ? (
        <>
          <Text style={styles.task}>{mistakes === 0 ? 'Perfect conversation!' : 'Conversation done!'}</Text>
          <View style={styles.fillRow}>
            <Pressable
              onPress={() => {
                setScene(buildScene(lesson, courseLessons, track));
                setShown([]);
                setAt(0);
                setMistakes(0);
                setHint('');
              }}
              style={({ pressed }) => [styles.button, styles.buttonSecondary, pressed && styles.buttonDown]}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, styles.buttonSecondaryText]}>Play again</Text>
            </Pressable>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.button, styles.flex, pressed && styles.buttonDown]} accessibilityRole="button">
              <Text style={styles.buttonText}>Done</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles(c => ({
  flex: { flex: 1 },
  box: { gap: 10, padding: 14, borderRadius: 20, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: c.bgSoft },
  scene: { padding: 12, borderRadius: 14, borderWidth: 2, borderColor: c.line, backgroundColor: c.bg, gap: 2 },
  sceneTitle: { fontFamily: fonts.black, fontSize: 16, color: c.ink },
  sceneText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: c.muted },
  note: { alignSelf: 'center', fontFamily: fonts.bold, fontSize: 13, color: c.muted },
  line: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '100%' },
  lineYou: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  bubble: { flexShrink: 1, gap: 2, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16, borderBottomLeftRadius: 4, borderWidth: 2, borderColor: c.line, backgroundColor: c.bg },
  bubbleYou: { borderBottomLeftRadius: 16, borderBottomRightRadius: 4, borderColor: '#bcd2f5', backgroundColor: '#e6eefb' },
  draft: { borderStyle: 'dashed' },
  learn: { fontFamily: fonts.amharicBold, fontSize: 19, lineHeight: 28, color: c.ink },
  learnEn: { fontFamily: fonts.black, fontSize: 17, lineHeight: 23, color: c.ink },
  roman: { fontFamily: fonts.bold, fontSize: 13, color: c.blue },
  meaning: { fontFamily: fonts.body, fontSize: 13, color: c.muted },
  hint: { padding: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff6dc', fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: '#6b5200' },
  task: { fontFamily: fonts.black, fontSize: 15, color: c.ink, marginTop: 4 },
  option: { gap: 2, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: c.bg },
  optionDown: { borderBottomWidth: 2, marginTop: 2 },
  optionText: { fontFamily: fonts.amharicBold, fontSize: 18, lineHeight: 27, color: c.ink },
  fillRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, borderColor: c.line, backgroundColor: c.bg, fontFamily: fonts.bold, fontSize: 17, color: c.ink },
  button: { minHeight: 48, paddingHorizontal: 18, borderRadius: 14, borderBottomWidth: 5, borderBottomColor: c.primaryShadow, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
  buttonDown: { borderBottomWidth: 0, marginTop: 5 },
  buttonText: { fontFamily: fonts.black, fontSize: 15, color: '#ffffff' },
  buttonSecondary: { backgroundColor: c.bg, borderWidth: 2, borderBottomWidth: 5, borderColor: c.line, borderBottomColor: c.line },
  buttonSecondaryText: { color: c.blue },
  disabled: { opacity: 0.5 },
}));
