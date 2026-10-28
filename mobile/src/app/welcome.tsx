import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { startCamp } from '@/lib/climb';
import type { Track } from '@/lib/courses';
import { readProfile, saveProfile, type Profile } from '@/lib/profile';
import { useAuth } from '@/auth';
import Button from '@/components/button';
import Flag from '@/components/flag';
import Walia from '@/components/walia';
import { supabase } from '@/supabase';
import { colors, fonts } from '@/theme';

// "Get started", like the website's survey (components/Onboarding.tsx): which
// language, what the learner already knows (it sets their starting camp and
// how hard practice is), why, and a daily goal. The answers are the same
// profile as the website's, so they follow the learner to their account.

type Answers = {
  track?: Track;
  speaks: string[];
  level?: Profile['level'];
  reasons: string[];
  heardFrom: string[];
  dailyMinutes?: number;
};

type Option = { value: string; label: string; sub?: string; icon?: ReactNode; soon?: boolean };

const LANGUAGE_NAME: Record<Track, string> = { amharic: 'Amharic', english: 'English' };

/** Signal-style bars for how much the learner knows. */
function Bars({ filled }: { filled: number }) {
  return (
    <Svg width={28} height={24} viewBox="0 0 28 24">
      {[0, 1, 2, 3].map(i => (
        <Rect key={i} x={i * 7} y={18 - i * 5} width={5} height={6 + i * 5} rx={2} fill={i < filled ? colors.primary : colors.line} />
      ))}
    </Svg>
  );
}

function BackArrow() {
  return (
    <Svg viewBox="0 0 24 24" width={26} height={26}>
      <Path d="M15 5l-7 7 7 7" stroke="#afafaf" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export default function Welcome() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Answers>({ speaks: [], reasons: [], heardFrom: [] });
  const [step, setStep] = useState(0);
  const lang = answers.track ? LANGUAGE_NAME[answers.track] : 'the language';

  const steps: { key: keyof Answers; question: string; multi?: boolean; options: Option[] }[] = [
    {
      key: 'track',
      question: 'What would you like to learn?',
      options: [
        { value: 'amharic', label: 'Amharic', sub: 'አማርኛ', icon: <Flag name="ethiopia" /> },
        { value: 'english', label: 'English', sub: 'እንግሊዝኛ', icon: <Flag name="usa" /> },
        { value: 'oromo', label: 'Afaan Oromoo', sub: 'Oromo', icon: <Flag name="oromia" />, soon: true },
        { value: 'tigrinya', label: 'Tigrinya', sub: 'ትግርኛ', icon: <Flag name="tigray" />, soon: true },
      ],
    },
    {
      key: 'speaks',
      question: 'Which languages do you already speak?',
      multi: true,
      options: [
        { value: 'english', label: 'English' },
        { value: 'amharic', label: 'Amharic', sub: 'አማርኛ' },
        { value: 'oromo', label: 'Afaan Oromo' },
        { value: 'tigrinya', label: 'Tigrinya', sub: 'ትግርኛ' },
        { value: 'other', label: 'Something else' },
      ],
    },
    {
      key: 'level',
      question: `How much ${lang} do you know?`,
      options: [
        { value: 'new', label: `I’m new to ${lang}`, icon: <Bars filled={1} /> },
        { value: 'some-words', label: 'I know some common words', icon: <Bars filled={2} /> },
        { value: 'basic', label: 'I can have basic conversations', icon: <Bars filled={3} /> },
        { value: 'conversational', label: 'I can talk about most topics', icon: <Bars filled={4} /> },
      ],
    },
    {
      key: 'reasons',
      question: `Why are you learning ${lang}?`,
      multi: true,
      options: [
        { value: 'family', label: 'Talk with family' },
        { value: 'heritage', label: 'Connect with my heritage' },
        { value: 'travel', label: 'Travel to Ethiopia' },
        { value: 'work', label: 'Work or school' },
        { value: 'fun', label: 'Just for fun' },
        { value: 'other', label: 'Something else' },
      ],
    },
    {
      key: 'heardFrom',
      question: 'How did you hear about kwanqa?',
      multi: true,
      options: [
        { value: 'friends', label: 'Friends or family' },
        { value: 'community', label: 'Church or community' },
        { value: 'social', label: 'Social media', sub: 'TikTok, Instagram, Telegram…' },
        { value: 'search', label: 'Search engine' },
        { value: 'other', label: 'Somewhere else' },
      ],
    },
    {
      key: 'dailyMinutes',
      question: 'What’s your daily learning goal?',
      options: [
        { value: '5', label: 'Casual', sub: '5 min / day' },
        { value: '10', label: 'Regular', sub: '10 min / day' },
        { value: '15', label: 'Serious', sub: '15 min / day' },
        { value: '20', label: 'Intense', sub: '20 min / day' },
      ],
    },
  ];

  const done = step >= steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const progress = Math.min(step, steps.length) / steps.length;
  const placedAt = startCamp(answers.track ?? 'amharic', answers.level);

  function isSelected(value: string) {
    const v = answers[current.key];
    return Array.isArray(v) ? v.includes(value) : String(v ?? '') === value;
  }

  function choose(value: string) {
    setAnswers(prev => {
      if (current.multi) {
        const key = current.key as 'speaks' | 'reasons' | 'heardFrom';
        return { ...prev, [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value] };
      }
      return { ...prev, [current.key]: current.key === 'dailyMinutes' ? Number(value) : value };
    });
  }

  const answer = answers[current.key];
  const answered = Array.isArray(answer) ? answer.length > 0 : answer !== undefined;

  function finish() {
    const track = answers.track ?? 'amharic';
    const before = readProfile();
    const earlier = before?.tracks ?? [];
    const level = answers.level ?? 'new';
    const profile: Profile = {
      track,
      tracks: earlier.includes(track) ? earlier : [...earlier, track],
      speaks: answers.speaks,
      level,
      levels: { ...before?.levels, [track]: level },
      reasons: answers.reasons,
      heardFrom: answers.heardFrom,
      dailyMinutes: answers.dailyMinutes ?? 10,
      completedAt: new Date().toISOString(),
    };
    saveProfile(profile);
    if (user) void supabase?.auth.updateUser({ data: { onboarding: profile } }); // retaking it while logged in
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <Pressable
          onPress={() => (step === 0 ? (router.canGoBack() ? router.back() : null) : setStep(s => s - 1))}
          hitSlop={10}
          accessibilityLabel="Back"
          style={step === 0 && !router.canGoBack() ? styles.hidden : null}
        >
          <BackArrow />
        </Pressable>
        <View style={styles.meter}>
          <View style={[styles.meterFill, { width: `${Math.max(progress * 100, 4)}%` }]} />
        </View>
      </View>

      {done ? (
        <View style={styles.done}>
          <Walia mood="cheer" size={150} />
          <Text style={styles.doneTitle}>You’re all set!</Text>
          <Text style={styles.doneText}>
            Learning <Text style={styles.strong}>{lang}</Text> · <Text style={styles.strong}>{answers.dailyMinutes ?? 10} min</Text> a day.{' '}
            {placedAt > 0 ? `You already know some ${lang}, so you’ll start at Camp ${placedAt + 1}. The camps below stay open for review.` : 'Your trail is ready. Let’s take the first step.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body} key={current.key}>
          <View style={styles.ask}>
            <Walia pose="wave" size={90} />
            <View style={styles.bubble}>
              <Text style={styles.question}>{current.question}</Text>
            </View>
          </View>
          {current.multi ? <Text style={styles.hint}>Choose all that apply</Text> : null}
          <View style={current.key === 'track' ? styles.cards : styles.options}>
            {current.options.map(option => {
              const on = isSelected(option.value);
              return (
                <Pressable
                  key={option.value}
                  disabled={option.soon}
                  onPress={() => choose(option.value)}
                  accessibilityState={{ selected: on, disabled: option.soon }}
                  style={[current.key === 'track' ? styles.card : styles.option, on && styles.optionOn, option.soon && styles.soon]}
                >
                  {option.icon ? <View style={current.key === 'track' ? styles.cardIcon : null}>{option.icon}</View> : null}
                  <View style={current.key === 'track' ? styles.cardText : styles.flex}>
                    <Text style={[styles.label, on && styles.labelOn, current.key === 'track' && styles.center]}>{option.label}</Text>
                    {option.sub ? <Text style={[styles.sub, current.key === 'track' && styles.center]}>{option.sub}</Text> : null}
                  </View>
                  {option.soon ? <Text style={styles.soonText}>Coming soon</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        {done ? <Button label="Start climbing" onPress={finish} /> : <Button label="Continue" onPress={() => setStep(s => s + 1)} disabled={!answered} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 10 },
  hidden: { opacity: 0 },
  meter: { flex: 1, height: 16, borderRadius: 8, backgroundColor: colors.line, overflow: 'hidden' },
  meterFill: { height: '100%', borderRadius: 8, backgroundColor: colors.primary },
  body: { padding: 16, gap: 14, paddingBottom: 32 },
  ask: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubble: { flex: 1, padding: 14, borderRadius: 18, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, marginBottom: 22 },
  question: { fontFamily: fonts.black, fontSize: 20, lineHeight: 26, color: colors.ink },
  hint: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  options: { gap: 10 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 58, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line, backgroundColor: '#ffffff' },
  card: { width: '47%', flexGrow: 1, alignItems: 'center', gap: 8, paddingVertical: 18, paddingHorizontal: 10, borderRadius: 18, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line, backgroundColor: '#ffffff' },
  cardIcon: { borderRadius: 6, overflow: 'hidden' },
  cardText: { alignItems: 'center' },
  center: { textAlign: 'center' },
  optionOn: { borderColor: '#b9cdf2', backgroundColor: '#e6eefb' },
  soon: { opacity: 0.55 },
  label: { fontFamily: fonts.heavy, fontSize: 17, color: colors.ink },
  labelOn: { color: colors.blue },
  sub: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  soonText: { fontFamily: fonts.heavy, fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  doneTitle: { fontFamily: fonts.black, fontSize: 30, color: colors.ink },
  doneText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 24, color: colors.muted, textAlign: 'center', maxWidth: 380 },
  strong: { fontFamily: fonts.black, color: colors.ink },
  footer: { padding: 16, borderTopWidth: 2, borderTopColor: colors.line },
});
