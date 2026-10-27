import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { amharicAudio } from '@/lib/amharicAudio';
import { completeLesson, completeReview, REST_COST, spendGrass, useClimb } from '@/lib/climb';
import { courseCatalog, courseContent, type Track } from '@/lib/courses';
import { holidayById } from '@/lib/holidays';
import { englishAudioUrl, isSpeakableEnglish } from '@/lib/englishAudio';
import { buildExercises, shuffle, type Exercise, type MatchExercise } from '@/lib/exercises';
import { clearMistakes, readMistakes, recordMistake, reviewSession } from '@/lib/mistakes';
import { play, playEffect } from '@/components/sound';
import { Grass } from '@/components/icons';
import Speaker from '@/components/speaker';
import Walia, { type Mood } from '@/components/walia';
import { siteUrl } from '@/site';
import { colors, fonts } from '@/theme';

// A lesson's practice, like the website's (components/Practice.tsx): Walia asks,
// you answer, and a green or red bar says how it went. Missed questions come
// back at the end; a mistake costs a hoof of stamina and three right answers in
// a row win one back. Finishing earns grass and marks the stone done, and
// wrong answers are saved for the camp's review (lib/climb.ts, lib/mistakes.ts),
// all the same as on the website. With review=1 it asks those saved questions.

const MAX_STAMINA = 5;
const STREAK_TO_RECOVER = 3;

type Phase = 'question' | 'feedback' | 'cheer' | 'rest' | 'done';

const CHEERS: Record<number, { amharic: string; transliteration: string; english: string }> = {
  3: { amharic: 'ጎበዝ!', transliteration: 'gobez!', english: 'Well done. 3 in a row!' },
  5: { amharic: 'በጣም ጥሩ!', transliteration: 'betam tiru!', english: 'Very good. 5 in a row!' },
  8: { amharic: 'ዋው!', transliteration: 'wow!', english: 'Super impressive. 8 in a row!' },
  12: { amharic: 'ጎበዝ ጎበዝ!', transliteration: 'gobez gobez!', english: 'Walia can’t keep up with you. 12 in a row!' },
};

/** English learners read Amharic first, with the English beside it (as on the website). */
function uiText(track: Track) {
  const both = (en: string, am: string) => (track === 'english' ? `${am} · ${en}` : en);
  return {
    check: both('Check', 'አረጋግጥ'),
    continue: both('Continue', 'ቀጥል'),
    good: both('Nice footing!', 'ጎበዝ!'),
    bad: both('Walia slipped!', 'ዋሊያ ተንሸራተተ!'),
    correctAnswer: both('Correct answer:', 'ትክክለኛው መልስ፡'),
    comeBack: both('This one will come back later.', 'ይህ ጥያቄ እንደገና ይመጣል።'),
    previous: both('Previous mistake', 'ያለፈው ስህተት'),
    inARow: (n: number, more: number) => (track === 'english' ? `${n} በተከታታይ · ${n} in a row` : `${n} in a row. ${more} more to regain stamina`),
    restTitle: both('Walia needs a rest', 'ዋሊያ ማረፍ ያስፈልገዋል'),
    restText:
      track === 'english'
        ? 'ጉልበቱ አልቋል። ሳር በልቶ ይበርታ፣ ወይም ሐረጎቹን ይከልሱ። · Out of stamina. Graze to recover, or review the phrases.'
        : 'Out of stamina on this ledge. Graze to recover, or review the phrases and try again.',
    eat: (n: number) => both(`Eat ${n} grass`, `${n} ሳር ብላ`),
    review: both('Review phrases', 'ሐረጎቹን ከልስ'),
    leaveTitle: both('Wait, don’t go!', 'ቆይ፣ አትሂድ!'),
    leaveText: both('You’ll lose your progress in this lesson if you quit now.', 'አሁን ካቆምክ የዚህ ትምህርት ሂደትህ ይጠፋል።'),
    keepLearning: both('Keep learning', 'መማር ቀጥል'),
    endSession: both('End session', 'ውጣ'),
    complete: both('Lesson complete!', 'ትምህርቱ ተጠናቀቀ!'),
    fixed: both('Mistakes fixed!', 'ስህተቶቹ ተስተካከሉ!'),
  };
}

function accuracyLabel(accuracy: number) {
  if (accuracy === 100) return 'Amazing';
  if (accuracy >= 80) return 'Great';
  if (accuracy >= 60) return 'Good';
  return 'Keep going';
}

const ETHIOPIC = /[ሀ-፿]/;

/** End with a full stop, unless the answer already ends a sentence. */
const sentence = (text: string) => (/[.?!።፧]$/.test(text) ? text : `${text}.`);

function Hoof({ filled }: { filled: boolean }) {
  const fill = filled ? '#6b4a2b' : colors.line;
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24}>
      <Path d="M11 4 C 6 4, 4 9, 4.5 15 C 5 19, 7.5 21, 10 20 C 11.2 19.5, 11.2 17, 11 14 Z" fill={fill} />
      <Path d="M13 4 C 18 4, 20 9, 19.5 15 C 19 19, 16.5 21, 14 20 C 12.8 19.5, 12.8 17, 13 14 Z" fill={fill} />
    </Svg>
  );
}

function Mark({ good }: { good: boolean }) {
  return (
    <View style={[styles.mark, { backgroundColor: good ? colors.green : '#ff5a4e' }]}>
      <Svg viewBox="0 0 24 24" width={30} height={30}>
        <Path d={good ? 'M5 12.5l4.5 4.5L19 7.5' : 'M7 7l10 10M17 7L7 17'} stroke="#ffffff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    </View>
  );
}

/** A chunky 3D button, like the website's .btn. */
function Button({ label, onPress, disabled, tone = 'primary' }: { label: string; onPress: () => void; disabled?: boolean; tone?: 'primary' | 'green' | 'red' | 'plain' }) {
  const look = disabled
    ? { bg: colors.line, edge: colors.line, fg: '#afafaf' }
    : tone === 'green'
      ? { bg: colors.green, edge: '#3a9a28', fg: '#ffffff' }
      : tone === 'red'
        ? { bg: '#ff5a4e', edge: '#d9443a', fg: '#ffffff' }
        : tone === 'plain'
          ? { bg: '#ffffff', edge: colors.line, fg: colors.muted }
          : { bg: colors.primary, edge: colors.primaryShadow, fg: '#ffffff' };
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: look.bg, borderBottomColor: look.edge },
        tone === 'plain' && !disabled && styles.buttonPlain,
        pressed && !disabled && styles.buttonDown,
      ]}
    >
      <Text style={[styles.buttonText, { color: look.fg }]}>{label}</Text>
    </Pressable>
  );
}

function MatchRound({ exercise, onMistake, onSolved, onSay }: { exercise: MatchExercise; onMistake: () => void; onSolved: () => void; onSay: (text: string) => void }) {
  const rights = useMemo(() => shuffle(exercise.pairs.map(p => p.right)), [exercise]);
  const [left, setLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const matchedRights = new Set(exercise.pairs.filter(p => matched.has(p.left)).map(p => p.right));

  function pickRight(right: string) {
    if (!left) return;
    const pair = exercise.pairs.find(p => p.left === left);
    if (pair?.right === right) {
      const next = new Set(matched).add(left);
      setMatched(next);
      setLeft(null);
      if (next.size === exercise.pairs.length) onSolved();
    } else {
      setWrong(right);
      setLeft(null);
      onMistake();
      setTimeout(() => setWrong(null), 500);
    }
  }

  return (
    <View style={styles.matchGrid}>
      <View style={styles.matchCol}>
        {exercise.pairs.map(p => (
          <Pressable
            key={p.left}
            disabled={matched.has(p.left)}
            onPress={() => {
              setLeft(p.left);
              onSay(p.left);
            }}
            style={[styles.option, left === p.left && styles.optionSelected, matched.has(p.left) && styles.optionMatched]}
          >
            <Text style={[styles.optionText, ETHIOPIC.test(p.left) && styles.amharic]}>{p.left}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.matchCol}>
        {rights.map(r => (
          <Pressable
            key={r}
            disabled={matchedRights.has(r) || !left}
            onPress={() => {
              onSay(r);
              pickRight(r);
            }}
            style={[styles.option, matchedRights.has(r) && styles.optionMatched, wrong === r && styles.optionWrong]}
          >
            <Text style={[styles.optionText, ETHIOPIC.test(r) && styles.amharic]}>{r}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function Practice() {
  const params = useLocalSearchParams<{ slug?: string; lesson?: string; review?: string; holiday?: string; track?: Track }>();
  const review = params.review === '1';
  // A holiday's lesson is saved as "holiday-<id>-<track>", as on the website.
  const holiday = params.holiday ? holidayById(params.holiday) : null;
  const holidayTrack: Track = params.track === 'english' ? 'english' : 'amharic';
  const slug = holiday ? `holiday-${holiday.id}-${holidayTrack}` : (params.slug ?? '');
  const lessonIndex = holiday ? 0 : Number(params.lesson ?? 0);
  const lessons = holiday ? [holiday.lessons[holidayTrack]] : (courseContent[slug]?.sections ?? []);
  const lesson = lessons[lessonIndex];
  const track: Track = holiday ? holidayTrack : (courseCatalog.find(c => c.slug === slug)?.track ?? 'amharic');
  const ui = uiText(track);

  // a review asks the camp's saved mistakes instead of a lesson's own questions
  const [session] = useState(() =>
    review
      ? reviewSession(readMistakes()[slug] ?? [])
      : { exercises: lesson ? buildExercises(lesson, lessons, track, slug === 'amharic-beginner-1' && lessonIndex === 0) : [], keys: [] },
  );
  const initial = session.exercises;
  const climb = useClimb();
  const [earned, setEarned] = useState(0);
  const [startedAt] = useState(() => Date.now()); // for the daily log's time spent
  const [queue, setQueue] = useState<Exercise[]>(initial);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [stamina, setStamina] = useState(MAX_STAMINA);
  const [leaving, setLeaving] = useState(false);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [choice, setChoice] = useState<string | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
  const [lastCorrect, setLastCorrect] = useState(true);
  const [reaction, setReaction] = useState<'slip' | 'hop' | null>(null);

  const current = queue[0];

  // The language being learned is the one that's spoken.
  function soundFor(text: string | null | undefined) {
    if (!text) return null;
    if (track === 'english') return isSpeakableEnglish(text) ? englishAudioUrl(text) : null;
    return amharicAudio(text);
  }

  // Fill-in-the-blank questions keep quiet until answered, then say the whole line.
  const reveal = current?.kind === 'choice' && current.revealAudio ? current.revealAudio : null;
  const promptAudio = !current || current.kind === 'match' ? null : reveal && phase === 'feedback' ? (soundFor(reveal) ?? soundFor(current.prompt)) : soundFor(current.prompt);
  const promptKey = !promptAudio ? null : phase === 'question' ? `${current.id}:${queue.length}` : reveal && phase === 'feedback' ? `${current.id}:${queue.length}:reveal` : null;

  // the question's sound plays by itself once when it appears
  useEffect(() => {
    if (promptKey && promptAudio) play(promptAudio);
  }, [promptKey]); // eslint-disable-line react-hooks/exhaustive-deps

  function sayAloud(text: string) {
    const src = soundFor(text);
    if (src) play(src);
  }

  const progress = initial.length ? solved.size / initial.length : 1;
  const mood: Mood = phase === 'feedback' ? (lastCorrect ? 'cheer' : 'sad') : current?.kind === 'match' && reaction ? (reaction === 'hop' ? 'cheer' : 'sad') : 'thinking';

  function loseStamina() {
    setCombo(0);
    setMistakes(m => m + 1);
    setStreak(0);
    setReaction('slip');
    setStamina(s => Math.max(0, s - 1));
  }

  function gainStreak() {
    setReaction('hop');
    setCombo(c => c + 1);
    if (streak + 1 >= STREAK_TO_RECOVER) {
      setStamina(s => Math.min(MAX_STAMINA, s + 1));
      setStreak(0);
    } else {
      setStreak(streak + 1);
    }
  }

  const builtAnswer = current?.kind === 'build' ? picked.map(i => current.tiles[i]) : [];
  const canCheck = current?.kind === 'choice' ? choice !== null : current?.kind === 'build' ? picked.length > 0 : false;

  function check() {
    if (!current || !canCheck) return;
    let correct: boolean;
    if (current.kind === 'choice') correct = choice === current.answer;
    else if (current.kind === 'build') correct = builtAnswer.join(' ') === current.answer.join(' ');
    else return;
    setLastCorrect(correct);
    playEffect(correct ? 'correct' : 'wrong');
    if (correct) gainStreak();
    else {
      loseStamina();
      // remember it, so it's asked again before the next camp
      if (!review) recordMistake(slug, lessonIndex, current);
    }
    setPhase('feedback');
  }

  /** Saves the finished lesson (or review) and returns the grass it earned. */
  function finish() {
    // every question was answered correctly once, plus each wrong try along the way
    const work = { answers: initial.length + mistakes, correct: initial.length, seconds: (Date.now() - startedAt) / 1000 };
    if (review) {
      clearMistakes(slug, session.keys);
      return completeReview(work);
    }
    return completeLesson(slug, lessonIndex, mistakes, work);
  }

  function solveMatch() {
    setLastCorrect(true);
    playEffect('correct');
    gainStreak();
    setPhase('feedback');
  }

  function advance() {
    if (!current) return;
    const nextSolved = new Set(solved);
    let nextQueue = queue.slice(1);
    if (lastCorrect) nextSolved.add(current.id);
    else {
      nextQueue = [...nextQueue, current]; // missed questions come back later
      setMissed(m => new Set(m).add(current.id));
    }
    setSolved(nextSolved);
    setQueue(nextQueue);
    setChoice(null);
    setPicked([]);
    setReaction(null);

    if (nextQueue.length === 0) {
      setEarned(finish());
      playEffect('complete');
      setPhase('done');
    } else if (stamina === 0) setPhase('rest');
    else if (lastCorrect && CHEERS[combo]) setPhase('cheer');
    else setPhase('question');
  }

  // back to the lesson, or to the trail when practice was opened from a link
  const exit = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!lesson && !review) return null;

  // A lesson without phrases has nothing to quiz; it can be marked done straight away.
  if (initial.length === 0 && phase !== 'done') {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Walia mood="thinking" size={150} />
        <Text style={styles.restText}>{review ? 'Nothing to review here right now.' : 'This lesson has no practice yet.'}</Text>
        <View style={styles.doneButton}>
          {review ? null : (
            <Button
              label="Mark complete"
              onPress={() => {
                setEarned(completeLesson(slug, lessonIndex, 0));
                setPhase('done');
              }}
            />
          )}
          <Button label={ui.continue} tone={review ? 'primary' : 'plain'} onPress={exit} />
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'done') {
    const answers = initial.length + mistakes;
    const accuracy = answers ? Math.round((initial.length / answers) * 100) : 100;
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Walia mood="cheer" size={170} />
        <Text style={styles.doneTitle}>{review ? ui.fixed : ui.complete}</Text>
        {initial.length ? (
          <View style={styles.stats}>
            <View style={[styles.stat, { borderColor: colors.green }]}>
              <Text style={[styles.statHead, { backgroundColor: colors.green }]}>{accuracyLabel(accuracy)}</Text>
              <Text style={[styles.statValue, { color: '#3a9a28' }]}>{accuracy}%</Text>
            </View>
            <View style={[styles.stat, { borderColor: '#5fb84a' }]}>
              <Text style={[styles.statHead, { backgroundColor: '#5fb84a' }]}>Grass</Text>
              <View style={styles.statRow}>
                <Grass size={26} />
                <Text style={[styles.statValue, { color: '#3a9a28' }]}>+{earned}</Text>
              </View>
            </View>
          </View>
        ) : null}
        {lesson?.note && !review ? <Text style={styles.doneNote}>{lesson.note}</Text> : null}
        <View style={styles.doneButton}>
          <Button label={ui.continue} onPress={exit} />
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'rest') {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Walia mood="sad" size={150} />
        <Text style={styles.doneTitle}>{ui.restTitle}</Text>
        <Text style={styles.restText}>{ui.restText}</Text>
        <View style={styles.doneButton}>
          <Button
            label={ui.eat(REST_COST)}
            disabled={climb.grass < REST_COST}
            onPress={() => {
              if (spendGrass(REST_COST)) {
                setStamina(MAX_STAMINA);
                setPhase('question');
              }
            }}
          />
          <Button label={ui.review} tone="plain" onPress={exit} />
        </View>
        <View style={styles.statRow}>
          <Grass size={18} />
          <Text style={styles.grassLeft}>
            You have {climb.grass} grass{climb.grass >= REST_COST ? '' : '. Finish lessons to earn more'}.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const feedback = phase === 'feedback';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Modal visible={leaving} transparent animationType="fade" onRequestClose={() => setLeaving(false)}>
        <Pressable style={styles.backdrop} onPress={() => setLeaving(false)}>
          <Pressable style={styles.dialog} onPress={() => {}}>
            <View style={styles.dialogWalia}>
              <Walia mood="sad" size={110} />
            </View>
            <Text style={styles.dialogTitle}>{ui.leaveTitle}</Text>
            <Text style={styles.dialogText}>{ui.leaveText}</Text>
            <Button label={ui.keepLearning} onPress={() => setLeaving(false)} />
            <Pressable onPress={exit} style={styles.endSession}>
              <Text style={styles.endSessionText}>{ui.endSession}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={styles.top}>
        <Pressable onPress={() => (solved.size > 0 || mistakes > 0 ? setLeaving(true) : exit())} accessibilityLabel="Leave practice" hitSlop={10}>
          <Svg viewBox="0 0 24 24" width={26} height={26}>
            <Path d="M6 6l12 12M18 6L6 18" stroke="#afafaf" strokeWidth={3} strokeLinecap="round" />
          </Svg>
        </Pressable>
        <View style={styles.meter}>
          <View style={[styles.meterFill, { width: `${Math.max(progress * 100, 6)}%` }]} />
        </View>
        <View style={styles.stamina} accessibilityLabel={`Stamina ${stamina} of ${MAX_STAMINA}`}>
          {Array.from({ length: MAX_STAMINA }, (_, i) => (
            <Hoof key={i} filled={i < stamina} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {phase === 'cheer' && CHEERS[combo] ? (
          <View style={styles.cheer}>
            <Walia pose="cheer" size={160} />
            <View style={styles.cheerBubble}>
              <Text style={styles.cheerBig}>{CHEERS[combo].amharic}</Text>
              <Text style={styles.cheerRoman}>{CHEERS[combo].transliteration}</Text>
              <Text style={styles.cheerText}>{CHEERS[combo].english}</Text>
            </View>
          </View>
        ) : (
          <>
            {missed.has(current.id) ? <Text style={styles.retry}>{ui.previous}</Text> : null}
            <Text style={styles.instruction}>{current.instruction}</Text>

            {!(current.kind === 'choice' && current.pictures && !current.hideWords) && (
              <View style={styles.ask}>
                <Walia mood={mood} size={96} />
                {current.kind !== 'match' && (
                  <View style={styles.bubble}>
                    {promptAudio ? <Speaker onPress={() => play(promptAudio)} label="Play it again" /> : null}
                    <View style={styles.bubbleText}>
                      <Text style={[styles.prompt, ETHIOPIC.test(current.prompt) && styles.promptAmharic]}>{current.prompt}</Text>
                      {current.promptHint ? <Text style={styles.promptHint}>{current.promptHint}</Text> : null}
                    </View>
                  </View>
                )}
              </View>
            )}

            {current.kind === 'choice' ? (
              <View style={current.pictures ? styles.pictureGrid : styles.options}>
                {current.options.map((option, i) => {
                  const state = feedback ? (option === current.answer ? 'correct' : option === choice ? 'wrong' : null) : option === choice ? 'selected' : null;
                  const picture = current.pictures?.[option];
                  return (
                    <Pressable
                      key={option}
                      disabled={feedback}
                      onPress={() => {
                        setChoice(option);
                        sayAloud(option);
                      }}
                      style={[
                        styles.option,
                        picture && styles.pictureOption,
                        state === 'selected' && styles.optionSelected,
                        state === 'correct' && styles.optionMatched,
                        state === 'wrong' && styles.optionWrong,
                      ]}
                    >
                      {picture ? (
                        <>
                          <Image source={{ uri: siteUrl(picture.src) }} style={styles.picture} contentFit="contain" />
                          {current.hideWords && !feedback ? (
                            <View style={styles.hiddenWord} />
                          ) : (
                            <>
                              <Text style={[styles.optionText, styles.amharic]}>{option}</Text>
                              <Text style={styles.pictureRoman}>{picture.transliteration}</Text>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <View style={styles.key}>
                            <Text style={styles.keyText}>{i + 1}</Text>
                          </View>
                          <Text style={[styles.optionText, ETHIOPIC.test(option) && styles.amharic]}>{option}</Text>
                        </>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ) : current.kind === 'build' ? (
              <View style={styles.build}>
                <View style={styles.buildAnswer}>
                  {picked.map(i => (
                    <Pressable key={i} disabled={feedback} onPress={() => setPicked(p => p.filter(x => x !== i))} style={styles.tile}>
                      <Text style={[styles.tileText, track === 'amharic' && styles.amharic]}>{current.tiles[i]}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.bank}>
                  {current.tiles.map((tile, i) => {
                    const used = picked.includes(i);
                    return (
                      <Pressable
                        key={i}
                        disabled={used || feedback}
                        onPress={() => {
                          setPicked(p => [...p, i]);
                          sayAloud(tile);
                        }}
                        style={[styles.tile, used && styles.tileUsed]}
                      >
                        <Text style={[styles.tileText, track === 'amharic' && styles.amharic, used && styles.tileTextUsed]}>{tile}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : (
              <MatchRound
                key={current.id + solved.size + queue.length}
                exercise={current}
                onSay={sayAloud}
                onMistake={() => {
                  playEffect('wrong');
                  loseStamina();
                  if (stamina <= 1) setPhase('rest');
                }}
                onSolved={solveMatch}
              />
            )}
          </>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={[styles.footer, feedback && (lastCorrect ? styles.footerGood : styles.footerBad)]}>
        {phase === 'cheer' ? (
          <Button label={ui.continue} onPress={() => setPhase('question')} />
        ) : feedback ? (
          <>
            <View style={styles.feedbackRow}>
              <Mark good={lastCorrect} />
              <View style={styles.feedbackText}>
                <Text style={[styles.feedbackTitle, { color: lastCorrect ? '#3a9a28' : '#d9443a' }]}>{lastCorrect ? ui.good : ui.bad}</Text>
                {current.kind !== 'match' && (
                  <Text style={[styles.feedbackBody, { color: lastCorrect ? '#3a9a28' : '#d9443a' }]}>
                    {lastCorrect ? current.explain : `${ui.correctAnswer} ${sentence(current.kind === 'build' ? current.answer.join(' ') : current.answer)} ${current.explain}`}
                  </Text>
                )}
                {!lastCorrect && <Text style={styles.comeBack}>{ui.comeBack}</Text>}
              </View>
            </View>
            <Button label={ui.continue} tone={lastCorrect ? 'green' : 'red'} onPress={advance} />
          </>
        ) : (
          <>
            {streak > 0 ? <Text style={styles.streak}>{ui.inARow(streak, STREAK_TO_RECOVER - streak)}</Text> : null}
            {current.kind !== 'match' && <Button label={ui.check} onPress={check} disabled={!canCheck} />}
          </>
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  meter: { flex: 1, height: 16, borderRadius: 8, backgroundColor: colors.line, overflow: 'hidden' },
  meterFill: { height: '100%', borderRadius: 8, backgroundColor: colors.primary },
  stamina: { flexDirection: 'row' },
  body: { padding: 16, gap: 16, paddingBottom: 32 },
  retry: { alignSelf: 'flex-start', fontFamily: fonts.heavy, fontSize: 13, color: '#8f4fd0', textTransform: 'uppercase', letterSpacing: 0.4 },
  instruction: { fontFamily: fonts.black, fontSize: 24, lineHeight: 30, color: colors.ink },
  ask: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubble: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, marginBottom: 24 },
  bubbleText: { flex: 1, gap: 2 },
  prompt: { fontFamily: fonts.heavy, fontSize: 19, lineHeight: 25, color: colors.ink },
  promptAmharic: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 32 },
  promptHint: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, backgroundColor: '#ffffff' },
  optionSelected: { borderColor: colors.blue, backgroundColor: '#e6eefb' },
  optionMatched: { borderColor: '#a5ed6e', backgroundColor: '#e9f8e4' },
  optionWrong: { borderColor: '#ffb3ad', backgroundColor: '#ffe9e7' },
  optionText: { flex: 1, fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  amharic: { fontFamily: fonts.amharicBold, fontSize: 19, lineHeight: 28 },
  key: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontFamily: fonts.heavy, fontSize: 13, color: colors.muted },
  pictureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  pictureOption: { flexDirection: 'column', width: '47%', gap: 4, paddingVertical: 14 },
  picture: { width: '100%', height: 110 },
  pictureRoman: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  hiddenWord: { height: 28 },
  build: { gap: 24 },
  buildAnswer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minHeight: 70, paddingVertical: 8, borderTopWidth: 2, borderBottomWidth: 2, borderColor: colors.line },
  bank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  tile: { minHeight: 52, paddingHorizontal: 18, justifyContent: 'center', borderRadius: 14, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line, backgroundColor: '#ffffff' },
  tileUsed: { backgroundColor: colors.line, borderColor: colors.line },
  tileText: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink },
  tileTextUsed: { color: colors.line },
  matchGrid: { flexDirection: 'row', gap: 10 },
  matchCol: { flex: 1, gap: 10 },
  cheer: { alignItems: 'center', gap: 16, paddingTop: 24 },
  cheerBubble: { alignItems: 'center', gap: 2, padding: 18, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line },
  cheerBig: { fontFamily: fonts.amharicBold, fontSize: 34, lineHeight: 48, color: colors.primary },
  cheerRoman: { fontFamily: fonts.heavy, fontSize: 16, color: colors.primary },
  cheerText: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, textAlign: 'center' },
  footer: { padding: 16, gap: 12, borderTopWidth: 2, borderTopColor: colors.line, backgroundColor: colors.bg },
  footerGood: { borderTopColor: 'transparent', backgroundColor: '#e9f8e4' },
  footerBad: { borderTopColor: 'transparent', backgroundColor: '#ffe9e7' },
  feedbackRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  mark: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  feedbackText: { flex: 1, gap: 2 },
  feedbackTitle: { fontFamily: fonts.black, fontSize: 21 },
  feedbackBody: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21 },
  comeBack: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  streak: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted, textAlign: 'center' },
  button: { minHeight: 52, borderRadius: 16, borderBottomWidth: 5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  buttonPlain: { borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line },
  buttonDown: { borderBottomWidth: 0, marginTop: 5 },
  buttonText: { fontFamily: fonts.black, fontSize: 16, textTransform: 'uppercase', letterSpacing: 0.8 },
  doneTitle: { fontFamily: fonts.black, fontSize: 28, color: colors.goldShadow, textAlign: 'center' },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { width: 130, borderRadius: 16, borderWidth: 2, overflow: 'hidden', alignItems: 'center' },
  statHead: { alignSelf: 'stretch', textAlign: 'center', paddingVertical: 4, fontFamily: fonts.black, fontSize: 13, color: '#ffffff', textTransform: 'uppercase' },
  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  grassLeft: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  statValue: { fontFamily: fonts.black, fontSize: 24, paddingVertical: 10 },
  doneNote: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: colors.ink, backgroundColor: colors.primarySoft, padding: 14, borderRadius: 16, overflow: 'hidden', maxWidth: 420 },
  doneButton: { alignSelf: 'stretch', gap: 10, maxWidth: 420, width: '100%', marginTop: 8 },
  restText: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.muted, textAlign: 'center', maxWidth: 360 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  dialog: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36, gap: 12, alignItems: 'stretch' },
  dialogWalia: { alignSelf: 'center' },
  dialogTitle: { fontFamily: fonts.black, fontSize: 24, color: colors.ink, textAlign: 'center' },
  dialogText: { fontFamily: fonts.bold, fontSize: 16, color: colors.muted, textAlign: 'center' },
  endSession: { paddingVertical: 12, alignItems: 'center' },
  endSessionText: { fontFamily: fonts.black, fontSize: 15, color: '#ff5a4e', textTransform: 'uppercase', letterSpacing: 0.8 },
});
