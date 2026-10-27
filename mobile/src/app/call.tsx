import { IOSOutputFormat, AudioQuality, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioRecorderState, type RecordingOptions } from 'expo-audio';
import { File, Paths } from 'expo-file-system';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { completeCall } from '@/lib/climb';
import { allConversations, check, normalize, spokenText, waliaLine, type Gender, type Line } from '@/lib/conversations';
import type { CallLine, TutorReply, TutorVerdict } from '@/lib/tutor';
import Button from '@/components/button';
import { Grass } from '@/components/icons';
import { play, playEffect, stopVoice } from '@/components/sound';
import Walia, { type Mood } from '@/components/walia';
import { SITE } from '@/site';
import { supabase } from '@/supabase';
import { colors, fonts } from '@/theme';

// A call with Walia, like the website's (components/TalkCall.tsx). Walia says a
// line (Azure, Ameha's voice), the learner taps the mic and answers out loud,
// Azure writes down what it heard (/api/listen), and Walia's brain (/api/tutor,
// Claude) decides whether it fits and what to say back. If the brain can't be
// reached, the script in lib/conversations.ts checks the answer instead.

type Phase = 'walia' | 'ready' | 'listening' | 'checking' | 'verdict' | 'done';
type Answer = { verdict: TutorVerdict; reply: Line | null; note: string };

// 16 kHz mono 16-bit WAV, which is what /api/listen hands to Azure.
const WAV: RecordingOptions = {
  extension: '.wav',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000,
  isMeteringEnabled: true,
  ios: { extension: '.wav', outputFormat: IOSOutputFormat.LINEARPCM, audioQuality: AudioQuality.MAX, sampleRate: 16000, linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false },
  // Android can't record WAV, so its calls are typed for now
  android: { extension: '.m4a', outputFormat: 'mpeg4', audioEncoder: 'aac', sampleRate: 16000 },
  web: {},
};
const canRecord = Platform.OS === 'ios';

function speakPath(text: string, slow = false, lang?: 'en') {
  return `/api/speak?text=${encodeURIComponent(text)}${slow ? '&slow=1' : ''}${lang ? `&lang=${lang}` : ''}`;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = (await supabase?.auth.getSession())?.data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** The words on the call screen. English calls are for Amharic speakers: Amharic first. */
function callText(english: boolean) {
  const both = (en: string, am: string) => (english ? `${am} · ${en}` : en);
  return {
    titles: {
      right: both('Nice footing!', 'ጎበዝ!'),
      slip: both('Almost there', 'ልትደርስ ነው'),
      retry: both('Let’s try that again', 'እንደገና እንሞክር'),
      question: both('Good question', 'ጥሩ ጥያቄ'),
    } as Record<TutorVerdict, string>,
    silent: both('Walia didn’t catch anything. Hold the phone a little closer and try again.', 'ዋሊያ ምንም አልሰማም። ስልኩን ትንሽ አቅርበው እንደገና ይሞክሩ።'),
    unclear: both('Hmm, that didn’t sound like an answer to Walia. Try again, or tap “What can I say?”.', 'ይህ ለዋሊያ ጥያቄ መልስ አይመስልም። እንደገና ይሞክሩ፣ ወይም “ምን ልበል?” የሚለውን ይንኩ።'),
    youSaid: both('You said', 'ያሉት'),
    asked: both('Walia asked:', 'ዋሊያ የጠየቀው፡'),
    slowly: both('Say it slowly', 'በዝግታ'),
    help: both('What can I say?', 'ምን ልበል?'),
    hideHelp: both('Hide help', 'እርዳታውን ደብቅ'),
    couldSay: both('You could say', 'እንዲህ ማለት ይችላሉ'),
    finished: english ? 'ጎበዝ! · Call finished' : 'ጎበዝ! Call finished',
    grass: both('grass', 'ሳር'),
    onOwn: (n: number, total: number) => (english ? `ከ${total} ጥያቄዎች ${n}ን በራስዎ መለሱ። · You answered ${n} of ${total} on your own.` : `You answered ${n} of ${total} on your own.`),
    again: (all: boolean) => (all ? both('Walia is impressed.', 'ዋሊያ ተደንቋል።') : both('Call again to get them all.', 'ሁሉንም ለመመለስ እንደገና ይደውሉ።')),
    callAgain: both('Call again', 'እንደገና ደውል'),
    hangUp: both('Hang up', 'ዝጋ'),
    finish: both('Finish', 'ጨርስ'),
    continue: both('Continue', 'ቀጥል'),
    answer: both('Answer Walia', 'ለዋሊያ መልስ'),
    tryAgain: both('Try again', 'እንደገና ሞክር'),
    skip: both('Skip for now', 'ለአሁን ዝለል'),
    send: both('Send', 'ላክ'),
    typeHere: english ? 'Type your answer in English' : 'Type your answer in ፊደል',
    mic: both('Walia needs your microphone. Allow it in Settings, or type your answer instead.', 'ዋሊያ ማይክሮፎንዎን ይፈልጋል። በቅንብሮች ይፍቀዱ፣ ወይም መልስዎን ይጻፉ።'),
    noMic: both('Speaking works on iPhone for now. Type your answer instead.', 'መናገር ለጊዜው በአይፎን ብቻ ነው። መልስዎን ይጻፉ።'),
    listening: both('Listening. Take your time, tap again when you’re done.', 'እያዳመጠ ነው። ሲጨርሱ እንደገና ይንኩ።'),
    checking: both('Walia is listening back…', 'ዋሊያ እያዳመጠ ነው…'),
    tapMic: english ? 'ማይኩን ይንኩና በእንግሊዝኛ ይመልሱ · Tap the mic and answer Walia in English' : 'Tap the mic and answer Walia out loud',
    you: english ? 'እርስዎ' : 'You',
  };
}

// When Walia's brain can't be reached, the script's own checker decides.
function scriptAnswer(verdict: ReturnType<typeof check>, text: ReturnType<typeof callText>): Answer {
  switch (verdict.kind) {
    case 'right':
      return { verdict: 'right', reply: null, note: '' };
    case 'tip':
      return { verdict: 'slip', reply: null, note: verdict.tip };
    case 'silent':
      return { verdict: 'retry', reply: null, note: text.silent };
    default:
      return { verdict: 'retry', reply: null, note: text.unclear };
  }
}

/** A fresh file in the cache for one of Walia's spoken replies. */
let clips = 0;
const clipFile = () => new File(Paths.cache, `walia-${Date.now()}-${clips++}.mp3`);

/** Gives up on a step that takes too long, so a call never hangs silently. */
function withTimeout<T>(work: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    work.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

const formatTime = (total: number) => `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;

function Icon({ d, size = 28, color = '#ffffff', fill }: { d: string; size?: number; color?: string; fill?: boolean }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d={d} fill={fill ? color : 'none'} stroke={fill ? 'none' : color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const MIC = 'M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21';
const STOP = 'M8 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z';
const REPLAY = 'M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5';
const KEYS = 'M5 6h14a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 19 18H5a2.5 2.5 0 0 1-2.5-2.5v-7A2.5 2.5 0 0 1 5 6zM6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M8 14h8';
const END =
  'M3.5 14.2c4.9-4.3 12.1-4.3 17 0l-1.9 2.6c-.3.4-.9.5-1.3.3l-2.6-1.3c-.4-.2-.6-.6-.6-1v-1.6a10.6 10.6 0 0 0-4.2 0v1.6c0 .4-.2.8-.6 1l-2.6 1.3c-.4.2-1 .1-1.3-.3z';

/** A line of the call: the language being practised big, its meaning underneath when switched on. */
function LineText({ line, meaning, englishCall }: { line: Line; meaning: boolean; englishCall: boolean }) {
  if (englishCall) {
    return (
      <>
        <Text style={styles.lineEn}>{line.english}</Text>
        {meaning ? <Text style={styles.meaningAm}>{line.amharic}</Text> : null}
      </>
    );
  }
  return (
    <>
      <Text style={styles.lineAm}>{line.amharic}</Text>
      <Text style={styles.lineTr}>{line.transliteration}</Text>
      {meaning ? <Text style={styles.meaning}>{line.english}</Text> : null}
    </>
  );
}

export default function Call() {
  const params = useLocalSearchParams<{ slug: string; gender?: string }>();
  const conversation = allConversations.find(c => c.slug === params.slug) ?? allConversations[0];
  const gender: Gender = params.gender === 'f' ? 'f' : 'm';

  const [turnIndex, setTurnIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('walia');
  const [heard, setHeard] = useState('');
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [history, setHistory] = useState<CallLine[]>(() => [
    { from: 'walia', text: spokenText(waliaLine(conversation.turns[0], gender), conversation) },
  ]);
  const [misses, setMisses] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [meaning, setMeaning] = useState(true);
  const [typing, setTyping] = useState(!canRecord);
  const [typed, setTyped] = useState('');
  const [problem, setProblem] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [onOwn, setOnOwn] = useState(0);
  const [answers, setAnswers] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [earned, setEarned] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const spoken = useRef(new Map<string, string>()); // reply text → file of its audio
  const scroller = useRef<ScrollViewInstance>(null);

  const recorder = useAudioRecorder(WAV);
  const recorderState = useAudioRecorderState(recorder, 100);
  // metering is in decibels (about -60 quiet to 0 loud); the self-view shows it as 0–1
  const level = phase === 'listening' ? Math.max(0, Math.min(1, ((recorderState.metering ?? -60) + 60) / 60)) : 0;

  const englishCall = conversation.lang === 'en';
  const text = callText(englishCall);
  const lang = englishCall ? ('en' as const) : undefined;
  const say_ = (l: Line) => spokenText(l, conversation);
  const turn = conversation.turns[turnIndex];
  const line = waliaLine(turn, gender);
  const last = turnIndex === conversation.turns.length - 1;

  // call timer
  useEffect(() => {
    const tick = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  // hang up cleanly: stop the mic and any audio
  useEffect(
    () => () => {
      stopVoice();
      void recorder.stop().catch(() => {});
      void setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
    },
    [recorder],
  );

  function speak(path: string, done?: () => void) {
    play(
      path,
      () => {
        setSpeaking(false);
        done?.();
      },
      () => setSpeaking(true),
    );
  }

  /** Walia says his line at the start of every turn. */
  function startTurn(index: number, fresh = false) {
    const said = say_(waliaLine(conversation.turns[index], gender));
    setHistory(h => [...(fresh ? [] : h), { from: 'walia', text: said }]);
    speak(speakPath(said, false, lang), () => setPhase(p => (p === 'walia' ? 'ready' : p)));
  }

  // the call opens with Walia's first line (already in the transcript)
  useEffect(() => {
    speak(speakPath(say_(line), false, lang), () => setPhase(p => (p === 'walia' ? 'ready' : p)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the call connects
  }, []);

  // keep the newest lines in view
  useEffect(() => {
    scroller.current?.scrollToEnd({ animated: true });
  }, [history.length, phase]);


  /** A reply Walia's brain just wrote: spoken fresh, for signed-in learners. */
  async function playReply(reply: string, slow = false) {
    const key = `${slow ? 'slow:' : ''}${reply}`;
    let uri = spoken.current.get(key);
    if (!uri) {
      try {
        const res = await fetch(`${SITE}/api/speak`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
          body: JSON.stringify({ text: reply, slow, lang }),
        });
        if (!res.ok) return; // the words are on screen either way
        const file = clipFile();
        file.write(new Uint8Array(await res.arrayBuffer()));
        uri = file.uri;
        spoken.current.set(key, uri);
      } catch {
        return;
      }
    }
    speak(uri);
  }

  function say(shown: Line, slow = false) {
    if (shown === line) speak(speakPath(say_(shown), slow, lang));
    else void playReply(say_(shown), slow);
  }

  async function askBrain(heardText: string): Promise<Answer | null> {
    try {
      const res = await withTimeout(
        fetch(`${SITE}/api/tutor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
          body: JSON.stringify({ slug: conversation.slug, turn: turnIndex, gender, heard: heardText, history }),
        }),
        20000,
        'Walia’s brain took too long',
      );
      if (!res.ok) return null;
      const data = (await res.json()) as TutorReply;
      return { verdict: data.verdict, reply: say_(data.reply) ? data.reply : null, note: data.note };
    } catch (error) {
      console.warn('Kwanqa: Walia’s brain could not answer, the script checks instead', error);
      return null;
    }
  }

  async function judge(heardText: string) {
    setHeard(heardText);
    setPhase('checking');
    const said = normalize(heardText);
    const result = (said && (await askBrain(said))) || scriptAnswer(check(turn, heardText), text);

    setAnswer(result);
    setPhase('verdict');
    setHistory(h => [...h, ...(said ? [{ from: 'learner' as const, text: said }] : []), ...(result.reply ? [{ from: 'walia' as const, text: say_(result.reply) }] : [])]);
    if (result.reply) void playReply(say_(result.reply));

    if (result.verdict !== 'question') setAnswers(n => n + 1);
    if (result.verdict === 'right') {
      setCorrect(n => n + 1);
      playEffect('correct');
      if (misses === 0 && !showExample) setOnOwn(n => n + 1);
    } else if (result.verdict !== 'question') {
      playEffect('wrong');
      const nextMisses = misses + 1;
      setMisses(nextMisses);
      if (nextMisses >= 2) setShowExample(true);
    }
  }

  async function startTalking() {
    setProblem('');
    stopVoice();
    if (!canRecord) {
      setProblem(text.noMic);
      setTyping(true);
      return;
    }
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) throw new Error('no microphone');
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setPhase('listening');
    } catch {
      setProblem(text.mic);
      setPhase('ready');
    }
  }

  async function stopTalking() {
    setPhase('checking');
    try {
      await withTimeout(recorder.stop(), 5000, 'The recording didn’t finish. Try again.');
      // back to the loudspeaker for Walia's voice
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
      const uri = recorder.uri;
      if (!uri) throw new Error('Walia couldn’t hear that. Try again.');
      // the recording goes straight from its file to /api/listen
      const res = await withTimeout(
        uploadAsync(`${SITE}/api/listen${englishCall ? '?lang=en' : ''}`, uri, {
          httpMethod: 'POST',
          uploadType: FileSystemUploadType.BINARY_CONTENT,
          headers: { 'Content-Type': 'audio/wav', ...(await authHeaders()) },
        }),
        25000,
        'Walia couldn’t be reached. Check your connection and try again.',
      );
      let data: { text?: string; error?: string } = {};
      try {
        data = JSON.parse(res.body);
      } catch {
        // not JSON: an error page; the status says what happened
      }
      if (res.status !== 200) throw new Error(data.error ?? `Walia couldn’t hear that (error ${res.status}). Try again.`);
      await judge(data.text ?? '');
    } catch (error) {
      console.warn('Kwanqa: listening failed', error);
      setProblem(error instanceof Error ? error.message : 'Something went wrong. Try again.');
      setPhase('ready');
    }
  }

  function tapMic() {
    if (phase === 'ready' || phase === 'walia') void startTalking();
    else if (phase === 'listening') void stopTalking();
  }

  function sendTyped() {
    if (!typed.trim()) return;
    void judge(typed);
    setTyped('');
  }

  function retry() {
    setAnswer(null);
    setHeard('');
    setPhase('ready');
  }

  function next() {
    setAnswer(null);
    setHeard('');
    setMisses(0);
    setShowExample(false);
    if (last) {
      setPhase('done');
      setEarned(completeCall(conversation.slug, onOwn, conversation.turns.length, { answers, correct, seconds }));
    } else {
      setPhase('walia');
      setTurnIndex(turnIndex + 1);
      startTurn(turnIndex + 1);
    }
  }

  function callAgain() {
    setOnOwn(0);
    setAnswers(0);
    setCorrect(0);
    setEarned(null);
    setSeconds(0);
    setAnswer(null);
    setHeard('');
    setMisses(0);
    setShowExample(false);
    setPhase('walia');
    setTurnIndex(0);
    startTurn(0, true);
  }

  const hangUp = () => (router.canGoBack() ? router.back() : router.replace('/talk'));

  const verdict = phase === 'verdict' ? answer?.verdict : undefined;
  const right = verdict === 'right';
  // What Walia is saying right now: his reply after an answer, otherwise his question.
  const shown = (phase === 'verdict' && answer?.reply) || line;
  const mood: Mood | undefined = phase === 'checking' ? 'thinking' : phase === 'done' || right ? 'cheer' : verdict === 'slip' || verdict === 'retry' ? 'sad' : undefined;
  const busy = phase === 'checking' || phase === 'done';
  const good = phase === 'done' || right;
  const bad = verdict === 'slip' || verdict === 'retry';

  return (
    <View style={styles.screen}>
      {/* the "video": Walia on a mountain sky */}
      <View style={styles.video}>
        <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="call-sky" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#9fd2f1" />
              <Stop offset="1" stopColor="#e3f3fb" />
            </LinearGradient>
          </Defs>
          <Rect width={100} height={100} fill="url(#call-sky)" />
          <Path d="M0 78 L22 52 L36 64 L55 38 L74 60 L100 44 L100 100 L0 100 Z" fill="#c5dbee" />
          <Path d="M0 88 Q30 76 55 86 T100 82 L100 100 L0 100 Z" fill="#93cf58" />
        </Svg>
        <SafeAreaView edges={['top']} style={styles.top}>
          <View>
            <Text style={styles.who}>Walia</Text>
            <Text style={styles.whoSub}>
              {conversation.title} · {formatTime(seconds)}
            </Text>
          </View>
          <View style={[styles.self, phase === 'listening' && styles.selfLive]}>
            <Text style={styles.selfText}>{text.you}</Text>
            {phase === 'listening' ? (
              <View style={styles.bars}>
                {[0.6, 0.9, 1, 0.8, 0.5].map((k, i) => (
                  <View key={i} style={[styles.bar, { height: 4 + 18 * Math.max(0.15, Math.min(1, level * k * 1.6)) }]} />
                ))}
              </View>
            ) : null}
          </View>
        </SafeAreaView>
        <View style={styles.waliaBox} pointerEvents="none">
          <Walia mood={mood} pose={speaking && !mood ? 'wave' : 'happy'} size={190} />
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.turns}>
          {conversation.turns.map((_, i) => (
            <View key={i} style={[styles.turnDot, (i < turnIndex || phase === 'done') && styles.turnDone, i === turnIndex && phase !== 'done' && styles.turnNow]} />
          ))}
        </View>

        <ScrollView ref={scroller} style={styles.flex} contentContainerStyle={styles.panelBody} keyboardShouldPersistTaps="handled">
          {heard && phase === 'verdict' ? (
            <View style={styles.heard}>
              <Text style={styles.heardLabel}>{text.youSaid}</Text>
              <Text style={englishCall ? styles.heardEn : styles.heardAm}>{heard}</Text>
            </View>
          ) : null}

          <View style={[styles.caption, good && styles.captionGood, bad && styles.captionBad]}>
            {phase === 'done' ? (
              <View style={styles.finish}>
                <Text style={styles.finishTitle}>{text.finished}</Text>
                {earned !== null ? (
                  <View style={styles.earned}>
                    <Grass size={18} />
                    <Text style={styles.earnedText}>
                      +{earned} {text.grass}
                    </Text>
                  </View>
                ) : null}
                <Text style={styles.note}>
                  {text.onOwn(onOwn, conversation.turns.length)} {text.again(onOwn >= conversation.turns.length)}
                </Text>
                <Button label={text.callAgain} onPress={callAgain} />
                <Button label={text.hangUp} tone="plain" onPress={hangUp} />
              </View>
            ) : (
              <>
                {phase === 'checking' ? <Text style={styles.dots}>• • •</Text> : <LineText line={shown} meaning={meaning} englishCall={englishCall} />}

                {shown !== line && verdict !== 'retry' ? (
                  <Text style={styles.asked}>
                    {text.asked} {say_(line)}
                  </Text>
                ) : null}

                {phase !== 'checking' ? (
                  <View style={styles.tools}>
                    <Pressable onPress={() => say(shown, true)} hitSlop={6}>
                      <Text style={styles.tool}>{text.slowly}</Text>
                    </Pressable>
                    <Pressable onPress={() => setShowExample(s => !s)} hitSlop={6}>
                      <Text style={styles.tool}>{showExample ? text.hideHelp : text.help}</Text>
                    </Pressable>
                  </View>
                ) : null}

                {showExample && phase !== 'checking' ? (
                  <View style={styles.example}>
                    <Text style={styles.exampleLabel}>{text.couldSay}</Text>
                    <LineText line={turn.example} meaning englishCall={englishCall} />
                  </View>
                ) : null}

                {verdict && answer ? (
                  <View style={styles.feedback}>
                    <Text style={[styles.feedbackTitle, { color: right ? '#3a9a28' : verdict === 'question' ? colors.blue : '#d9443a' }]}>{text.titles[verdict]}</Text>
                    {answer.note ? <Text style={styles.note}>{answer.note}</Text> : null}
                    {right ? (
                      <Button label={last ? text.finish : text.continue} tone="green" onPress={next} />
                    ) : verdict === 'question' ? (
                      <Button label={text.answer} onPress={retry} />
                    ) : (
                      <>
                        <Button label={text.tryAgain} tone="red" onPress={retry} />
                        {misses >= 2 ? <Button label={text.skip} tone="plain" onPress={next} /> : null}
                      </>
                    )}
                  </View>
                ) : null}
              </>
            )}
          </View>

          {typing && (phase === 'ready' || phase === 'walia') ? (
            <View style={styles.type}>
              <TextInput
                value={typed}
                onChangeText={setTyped}
                placeholder={text.typeHere}
                placeholderTextColor="#afafaf"
                style={styles.input}
                onSubmitEditing={sendTyped}
                returnKeyType="send"
              />
              <Pressable onPress={sendTyped} style={styles.send}>
                <Text style={styles.sendText}>{text.send}</Text>
              </Pressable>
            </View>
          ) : null}

          <Text style={styles.hint}>
            {problem || (phase === 'listening' ? text.listening : phase === 'checking' ? text.checking : phase === 'ready' || phase === 'walia' ? (canRecord ? text.tapMic : text.noMic) : ' ')}
          </Text>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={styles.controls}>
          <Pressable onPress={() => setMeaning(m => !m)} style={[styles.ctl, meaning && styles.ctlOn]} accessibilityLabel={meaning ? 'Hide the meaning' : 'Show the meaning'}>
            <Text style={[styles.ctlText, meaning && styles.ctlTextOn]}>{englishCall ? 'አማ' : 'EN'}</Text>
          </Pressable>
          <Pressable onPress={() => say(shown)} disabled={busy || phase === 'listening'} style={styles.ctl} accessibilityLabel="Hear Walia again">
            <Icon d={REPLAY} size={24} color={colors.ink} />
          </Pressable>
          <Pressable
            onPress={tapMic}
            disabled={busy || phase === 'verdict'}
            style={[styles.mic, phase === 'listening' && styles.micOn, (busy || phase === 'verdict') && styles.micOff]}
            accessibilityLabel={phase === 'listening' ? 'Stop and send' : 'Start talking'}
          >
            <Icon d={phase === 'listening' ? STOP : MIC} size={32} fill={phase === 'listening'} />
          </Pressable>
          <Pressable onPress={() => setTyping(t => !t)} disabled={busy} style={[styles.ctl, typing && styles.ctlOn]} accessibilityLabel={typing ? 'Stop typing' : 'Type instead'}>
            <Icon d={KEYS} size={24} color={typing ? colors.blue : colors.ink} />
          </Pressable>
          <Pressable onPress={hangUp} style={[styles.ctl, styles.end]} accessibilityLabel="End the call">
            <Icon d={END} size={28} fill />
          </Pressable>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  flex: { flex: 1 },
  video: { height: '42%', overflow: 'hidden' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 18, paddingTop: 8 },
  who: { fontFamily: fonts.black, fontSize: 22, color: '#1f3a52' },
  whoSub: { fontFamily: fonts.bold, fontSize: 13, color: '#4d5866' },
  self: { width: 74, height: 96, marginTop: 8, borderRadius: 16, backgroundColor: 'rgba(36,26,20,0.55)', alignItems: 'center', justifyContent: 'center', gap: 6 },
  selfLive: { backgroundColor: 'rgba(210,88,46,0.85)' },
  selfText: { fontFamily: fonts.heavy, fontSize: 13, color: '#ffffff' },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 22 },
  bar: { width: 5, borderRadius: 3, backgroundColor: '#ffffff' },
  waliaBox: { position: 'absolute', bottom: -6, left: 0, right: 0, alignItems: 'center' },
  panel: { flex: 1, marginTop: -18, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#ffffff' },
  turns: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 12 },
  turnDot: { width: 22, height: 6, borderRadius: 3, backgroundColor: colors.line },
  turnDone: { backgroundColor: colors.green },
  turnNow: { backgroundColor: colors.primary },
  panelBody: { padding: 16, gap: 12 },
  heard: { alignSelf: 'flex-end', maxWidth: '85%', padding: 10, borderRadius: 14, backgroundColor: '#e6eefb' },
  heardLabel: { fontFamily: fonts.heavy, fontSize: 11, color: colors.blue, textTransform: 'uppercase', letterSpacing: 0.5 },
  heardAm: { fontFamily: fonts.amharicBold, fontSize: 17, lineHeight: 25, color: colors.ink },
  heardEn: { fontFamily: fonts.heavy, fontSize: 16, color: colors.ink },
  caption: { gap: 6, padding: 16, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line },
  captionGood: { borderColor: '#a5ed6e', backgroundColor: '#f4fcf1' },
  captionBad: { borderColor: '#ffc9c4', backgroundColor: '#fff6f5' },
  lineAm: { fontFamily: fonts.amharicBold, fontSize: 24, lineHeight: 35, color: colors.ink },
  lineTr: { fontFamily: fonts.heavy, fontSize: 16, color: colors.primary },
  lineEn: { fontFamily: fonts.black, fontSize: 22, lineHeight: 28, color: colors.ink },
  meaning: { fontFamily: fonts.bold, fontSize: 16, color: colors.muted },
  meaningAm: { fontFamily: fonts.amharic, fontSize: 17, lineHeight: 25, color: colors.muted },
  dots: { fontFamily: fonts.black, fontSize: 28, color: colors.primary, letterSpacing: 4 },
  asked: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  tools: { flexDirection: 'row', gap: 18, marginTop: 4 },
  tool: { fontFamily: fonts.heavy, fontSize: 14, color: colors.blue },
  example: { gap: 2, marginTop: 6, padding: 12, borderRadius: 14, backgroundColor: '#fff6dc' },
  exampleLabel: { fontFamily: fonts.heavy, fontSize: 11, color: colors.goldShadow, textTransform: 'uppercase', letterSpacing: 0.5 },
  feedback: { gap: 8, marginTop: 8 },
  feedbackTitle: { fontFamily: fonts.black, fontSize: 19 },
  note: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: colors.ink },
  finish: { gap: 10 },
  finishTitle: { fontFamily: fonts.amharicBold, fontSize: 22, lineHeight: 32, color: '#3a9a28' },
  earned: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  earnedText: { fontFamily: fonts.black, fontSize: 16, color: '#3a9a28' },
  type: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, minHeight: 48, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.bgSoft, fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  send: { paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendText: { fontFamily: fonts.black, fontSize: 14, color: '#ffffff', textTransform: 'uppercase' },
  hint: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: colors.muted, textAlign: 'center' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6, borderTopWidth: 2, borderTopColor: colors.line },
  ctl: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgSoft },
  ctlOn: { backgroundColor: '#e6eefb' },
  ctlText: { fontFamily: fonts.black, fontSize: 15, color: colors.ink },
  ctlTextOn: { color: colors.blue },
  mic: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderBottomWidth: 5, borderBottomColor: colors.primaryShadow },
  micOn: { backgroundColor: '#ff5a4e', borderBottomColor: '#d9443a' },
  micOff: { backgroundColor: colors.line, borderBottomColor: colors.line },
  end: { backgroundColor: '#ff5a4e' },
});
