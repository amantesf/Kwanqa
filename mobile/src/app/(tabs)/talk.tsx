import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { callBest, useClimb } from '@/lib/climb';
import { LEVELS, conversationsFor, type Gender, type Level } from '@/lib/conversations';
import type { Track } from '@/lib/courses';
import { useProfile } from '@/lib/profile';
import { storage } from '@/lib/storage';
import { useAuth } from '@/auth';
import Button from '@/components/button';
import Walia from '@/components/walia';
import { colors, fonts, tabBarTop } from '@/theme';

// Talk with Walia, like the website's /talk (components/TalkPage.tsx): pick a
// call by level, and Walia rings. Calls use real speech recognition, so they
// need an account. English learners (Amharic speakers) get English calls,
// with Amharic first in the words around them.

const GENDER_KEY = 'kwanqa-talk-gender';
const MINUTES: Record<Level, number> = { beginner: 3, intermediate: 4, advanced: 5 };

function PhoneIcon({ size = 20, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        d="M6.6 3.5l2.6.4c.5.1.8.4.9.9l.6 3.1c.1.4-.1.9-.4 1.1L8.6 10.3a12 12 0 0 0 5.1 5.1l1.3-1.7c.3-.4.7-.5 1.1-.4l3.1.6c.5.1.8.5.9.9l.4 2.6c.1.6-.3 1.2-.9 1.3-1 .2-2 .3-3 .3A13.6 13.6 0 0 1 3 4.4c0-1 .1-2 .3-3 .1-.6.7-1 1.3-.9z"
        fill={color}
      />
    </Svg>
  );
}

function text(track: Track) {
  const en = track === 'english';
  const both = (english: string, amharic: string) => (en ? `${amharic} · ${english}` : english);
  return {
    lede: en
      ? 'ለዋሊያ ይደውሉ። ቀላል ጥያቄዎችን በእንግሊዝኛ ይጠይቅዎታል፣ እርስዎም ጮክ ብለው በእንግሊዝኛ ይመልሳሉ። Give Walia a call: he asks simple questions in English, and you answer out loud.'
      : 'Give Walia a call. He’ll ask you simple questions in Amharic, and you answer out loud, just like talking with family back home.',
    gateTitle: both('Make a free account to call Walia', 'ለዋሊያ ለመደወል በነፃ ይመዝገቡ'),
    gateText: en
      ? 'ጥሪዎቹ እውነተኛ የድምፅ ማወቂያ ይጠቀማሉ፣ ስለዚህ መለያ ያስፈልጋል። ነፃ ነው። Calls use real speech recognition, so they’re for learners with an account. It’s free.'
      : 'Calls use real speech recognition, so they’re for learners with an account. It’s free and takes a minute.',
    signUp: both('Sign up', 'ይመዝገቡ'),
    logIn: both('Log in', 'ይግቡ'),
    genderTitle: en ? 'ዋሊያ በአማርኛ ሲያብራራ እንዴት ያናግርዎ? · How should Walia talk to you?' : 'How should Walia talk to you?',
    genderNote: en
      ? 'የአማርኛ ትርጉሞችና ማብራሪያዎች ለወንድና ለሴት ይለያያሉ። The Amharic help changes for a man or a woman.'
      : 'Amharic changes with who you’re talking to, so Walia asks a man and a woman differently.',
    asMan: both('As a man', 'እንደ ወንድ'),
    asWoman: both('As a woman', 'እንደ ሴት'),
    level: (id: Level, label: string) => (en ? `${{ beginner: 'ጀማሪ', intermediate: 'መካከለኛ', advanced: 'የላቀ' }[id]} · ${label}` : label),
    questions: (n: number) => both(`${n} questions`, `${n} ጥያቄዎች`),
    minutes: (n: number) => both(`about ${n} min`, `${n} ደቂቃ ያህል`),
    done: (best: number, total: number) => both(`Done · ${best}/${total} on your own`, `ተጠናቋል · ${best}/${total}`),
    call: en ? 'ደውል' : 'Call',
  };
}

export default function Talk() {
  const profile = useProfile();
  const climb = useClimb();
  const { user, enabled, loading } = useAuth();
  const [track, setTrack] = useState<Track>(profile?.track ?? 'amharic');
  const [gender, setGender] = useState<Gender | null>(() => {
    const saved = storage().getItem(GENDER_KEY);
    return saved === 'm' || saved === 'f' ? saved : null;
  });
  const t = text(track);
  const calls = conversationsFor(track);
  const locked = enabled && !loading && !user;

  function pickGender(g: Gender) {
    setGender(g);
    storage().setItem(GENDER_KEY, g);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.tracks}>
          {(['amharic', 'english'] as Track[]).map(k => (
            <Pressable key={k} onPress={() => setTrack(k)} style={[styles.chip, track === k && styles.chipOn]}>
              <Text style={[styles.chipText, track === k && styles.chipTextOn]}>{k === 'amharic' ? 'Amharic calls' : 'English calls'}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.hero}>
          <Walia pose="wave" size={110} />
          <View style={styles.heroText}>
            <Text style={styles.heading}>Talk with Walia</Text>
            <Text style={styles.lede}>{t.lede}</Text>
          </View>
        </View>

        {locked ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.gateTitle}</Text>
            <Text style={styles.cardText}>{t.gateText}</Text>
            <Button label={t.signUp} onPress={() => router.push({ pathname: '/account', params: { mode: 'signup' } })} />
            <Button label={t.logIn} tone="plain" onPress={() => router.push({ pathname: '/account', params: { mode: 'login' } })} />
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.genderTitle}</Text>
          <Text style={styles.cardText}>{t.genderNote}</Text>
          <View style={styles.genders}>
            {(['m', 'f'] as Gender[]).map(g => (
              <Pressable key={g} onPress={() => pickGender(g)} style={[styles.gender, gender === g && styles.genderOn]} accessibilityState={{ selected: gender === g }}>
                <Text style={[styles.genderText, gender === g && styles.genderTextOn]}>{g === 'm' ? t.asMan : t.asWoman}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {LEVELS.map(level => {
          const list = calls.filter(c => c.level === level.id);
          if (!list.length) return null;
          return (
            <View key={level.id} style={styles.level}>
              <Text style={styles.levelTitle}>{t.level(level.id, level.label)}</Text>
              {list.map(c => {
                const best = callBest(climb, c.slug);
                const ready = !locked && gender !== null;
                return (
                  <View key={c.slug} style={styles.call}>
                    <View style={styles.callText}>
                      <Text style={styles.callTitle}>{c.title}</Text>
                      <Text style={styles.callAm}>{c.amharicTitle}</Text>
                      <Text style={styles.callBlurb}>{c.blurb}</Text>
                      <Text style={styles.callMeta}>
                        {t.questions(c.turns.length)} · {t.minutes(MINUTES[c.level])}
                      </Text>
                      {best !== null ? <Text style={styles.callDone}>✓ {t.done(best, c.turns.length)}</Text> : null}
                    </View>
                    <Pressable
                      disabled={!ready}
                      onPress={() => router.push({ pathname: '/call', params: { slug: c.slug, gender: gender ?? 'm' } })}
                      style={({ pressed }) => [styles.callButton, !ready && styles.callButtonOff, pressed && styles.callButtonDown]}
                      accessibilityRole="button"
                      accessibilityLabel={`${t.call} ${c.title}`}
                    >
                      <PhoneIcon color={ready ? '#ffffff' : '#afafaf'} />
                      <Text style={[styles.callButtonText, !ready && styles.callButtonTextOff]}>{t.call}</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingTop: tabBarTop },
  page: { padding: 16, gap: 16, paddingBottom: 48 },
  tracks: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line },
  chipOn: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  chipText: { fontFamily: fonts.heavy, fontSize: 14, color: colors.muted },
  chipTextOn: { color: colors.primary },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroText: { flex: 1, gap: 4 },
  heading: { fontFamily: fonts.black, fontSize: 28, color: colors.ink },
  lede: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: colors.muted },
  card: { gap: 10, padding: 16, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line },
  cardTitle: { fontFamily: fonts.black, fontSize: 18, lineHeight: 24, color: colors.ink },
  cardText: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: colors.muted },
  genders: { flexDirection: 'row', gap: 8 },
  gender: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line },
  genderOn: { borderColor: '#b9cdf2', backgroundColor: '#e6eefb' },
  genderText: { fontFamily: fonts.heavy, fontSize: 15, color: colors.muted },
  genderTextOn: { color: colors.blue },
  level: { gap: 10 },
  levelTitle: { fontFamily: fonts.black, fontSize: 22, color: colors.ink, marginTop: 6 },
  call: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line, backgroundColor: '#ffffff' },
  callText: { flex: 1, gap: 2 },
  callTitle: { fontFamily: fonts.black, fontSize: 17, color: colors.ink },
  callAm: { fontFamily: fonts.amharicBold, fontSize: 15, lineHeight: 22, color: colors.primary },
  callBlurb: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 18, color: colors.muted },
  callMeta: { fontFamily: fonts.heavy, fontSize: 12, color: '#afafaf', marginTop: 2 },
  callDone: { fontFamily: fonts.heavy, fontSize: 12, color: '#3a9a28' },
  callButton: { alignItems: 'center', justifyContent: 'center', gap: 2, width: 66, height: 66, borderRadius: 33, backgroundColor: colors.green, borderBottomWidth: 4, borderBottomColor: '#3a9a28' },
  callButtonOff: { backgroundColor: colors.line, borderBottomColor: colors.line },
  callButtonDown: { borderBottomWidth: 0, marginTop: 4 },
  callButtonText: { fontFamily: fonts.black, fontSize: 12, color: '#ffffff' },
  callButtonTextOff: { color: '#afafaf' },
});
