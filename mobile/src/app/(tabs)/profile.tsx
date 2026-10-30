import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { altitudeFor, climbStreak, hornLevel, isCallKey, trackCourses, trackTotals, useClimb, type Climb } from '@/lib/climb';
import { courseContent, type Track } from '@/lib/courses';
import { useProfile, type Profile as Survey } from '@/lib/profile';
import { accountLabel, displayName, useAuth } from '@/auth';
import Button from '@/components/button';
import Flag from '@/components/flag';
import { Grass, Peak } from '@/components/icons';
import MountainScene from '@/components/mountain-scene';
import Walia from '@/components/walia';
import { SITE } from '@/site';
import { supabase } from '@/supabase';
import { colors, fonts, tabBarTop } from '@/theme';

// The learner's profile, like the website's (components/ProfileView.tsx):
// statistics, achievements, their Get started answers, and their account
// (reminder emails, log out, delete account). Without an account, the climb
// on this phone still shows, with a way to save it.

const LANGUAGE: Record<string, string> = { amharic: 'Amharic', english: 'English', oromo: 'Afaan Oromo', tigrinya: 'Tigrinya', other: 'Another language' };
const LEVEL: Record<Survey['level'], string> = { new: 'Brand new', 'some-words': 'Knows some common words', basic: 'Basic conversations', conversational: 'Can talk about most topics' };
const REASON: Record<string, string> = { family: 'Talk with family', heritage: 'Connect with heritage', travel: 'Travel to Ethiopia', work: 'Work or school', fun: 'Just for fun', other: 'Something else' };
const GOAL: Record<number, string> = { 5: 'A stroll', 10: 'A hike', 15: 'A climb', 20: 'Summit push' };

const lessonsDone = (climb: Climb) => Object.entries(climb.completed).filter(([key]) => !isCallKey(key)).reduce((sum, [, list]) => sum + list.length, 0);
const campsDone = (climb: Climb) => Object.entries(courseContent).filter(([slug, course]) => course.sections.every((_, i) => climb.completed[slug]?.includes(i))).length;
const tracksDone = (climb: Climb) =>
  (['amharic', 'english'] as Track[]).filter(track => trackCourses(track).every(c => (courseContent[c.slug]?.sections ?? []).every((_, i) => climb.completed[c.slug]?.includes(i)))).length;

/** The longest run of consecutive practice days ever. */
function longestStreak(days: string[]) {
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const day of [...new Set(days)].sort()) {
    const [y, m, d] = day.split('-').map(Number);
    const t = Date.UTC(y, m - 1, d) / 86400000;
    run = prev !== null && t - prev === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  return best;
}

// White glyphs on the coloured achievement badges (the website's).
const GLYPHS: Record<string, ReactNode> = {
  mountain: <Path d="M4 40 L18 14 L26 26 L31 19 L44 40 Z" fill="#fff" />,
  grass: (
    <>
      <Path d="M10 40 C 11 30, 13 24, 11 14 C 17 22, 18 30, 18 40 Z" fill="#fff" />
      <Path d="M18 40 C 20 26, 22 18, 24 8 C 26 18, 28 26, 30 40 Z" fill="#fff" />
      <Path d="M30 40 C 30 30, 32 22, 38 15 C 36 25, 37 31, 38 40 Z" fill="#fff" />
    </>
  ),
  boot: <Path d="M14 8 h12 v18 l12 5 a5 5 0 0 1 3 4.6 V40 H11 Z" fill="#fff" />,
  tent: <Path d="M24 8 L42 40 H6 Z" fill="#fff" />,
  horns: (
    <>
      <Path d="M22 40 C 21 26, 15 14, 6 10 C 9 18, 12 28, 13 40 Z" fill="#fff" />
      <Path d="M26 40 C 27 26, 33 14, 42 10 C 39 18, 36 28, 35 40 Z" fill="#fff" />
    </>
  ),
  flag: (
    <>
      <Rect x={11} y={6} width={4} height={36} rx={2} fill="#fff" />
      <Path d="M15 8 H39 L33 16 L39 24 H15 Z" fill="#fff" />
    </>
  ),
};

type Achievement = { title: string; color: string; glyph: keyof typeof GLYPHS; value: number; tiers: number[]; describe: (goal: number) => string };

function AchievementRow({ a }: { a: Achievement }) {
  const reached = a.tiers.filter(t => a.value >= t).length;
  const maxed = reached === a.tiers.length;
  const goal = maxed ? a.tiers[a.tiers.length - 1] : a.tiers[reached];
  return (
    <View style={styles.ach}>
      <View style={[styles.badge, { backgroundColor: a.color }]}>
        <Svg viewBox="0 0 48 48" width={40} height={40}>
          {GLYPHS[a.glyph]}
        </Svg>
        <Text style={[styles.badgeLevel, { color: a.color }]}>{maxed ? 'MAX' : `LEVEL ${reached + 1}`}</Text>
      </View>
      <View style={styles.flex}>
        <View style={styles.achTop}>
          <Text style={styles.achTitle}>{a.title}</Text>
          <Text style={styles.achCount}>
            {Math.min(a.value, goal)}/{goal}
          </Text>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${Math.min(1, a.value / goal) * 100}%` }]} />
        </View>
        <Text style={styles.achText}>{maxed ? 'Completed every level!' : a.describe(goal)}</Text>
      </View>
    </View>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: ReactNode; label: string }) {
  return (
    <View style={styles.stat}>
      {icon}
      <View style={styles.flex}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

/** Streak reminder and holiday email switches, saved to the account (the website's ReminderToggle). */
function Reminders({ userId }: { userId: string }) {
  const [settings, setSettings] = useState<{ enabled: boolean; holiday_emails: boolean } | null>(null);
  useEffect(() => {
    let cancelled = false;
    supabase
      ?.from('reminders')
      .select('enabled, holiday_emails')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!cancelled && !error) setSettings({ enabled: data?.enabled ?? true, holiday_emails: data?.holiday_emails ?? true });
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function toggle(field: 'enabled' | 'holiday_emails', next: boolean) {
    setSettings(s => (s ? { ...s, [field]: next } : s));
    const { error } = (await supabase?.from('reminders').upsert({ user_id: userId, [field]: next, updated_at: new Date().toISOString() })) ?? {};
    if (error) setSettings(s => (s ? { ...s, [field]: !next } : s));
  }

  if (!settings) return null;
  return (
    <>
      {(
        [
          { field: 'enabled', title: 'Streak reminder emails', detail: 'An email at 7 pm if your streak is about to end.' },
          { field: 'holiday_emails', title: 'Holiday emails', detail: 'A greeting at 9 am on Ethiopian holidays, with a holiday lesson.' },
        ] as const
      ).map(s => (
        <View key={s.field} style={styles.switchRow}>
          <View style={styles.flex}>
            <Text style={styles.switchTitle}>{s.title}</Text>
            <Text style={styles.switchText}>{s.detail}</Text>
          </View>
          <Switch value={settings[s.field]} onValueChange={v => void toggle(s.field, v)} trackColor={{ true: colors.primary, false: colors.line }} thumbColor="#ffffff" />
        </View>
      ))}
    </>
  );
}

export default function Profile() {
  const climb = useClimb();
  const survey = useProfile();
  const { user, enabled, loading, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const horns = hornLevel(climb.grass);
  const streak = climbStreak(climb.days).count;
  const best = longestStreak(climb.days);
  const lessons = lessonsDone(climb);
  const totalLessons = (['amharic', 'english'] as Track[]).reduce((n, t) => n + trackTotals(climb, t).total, 0);
  const highest = Math.max(...(['amharic', 'english'] as Track[]).map(t => altitudeFor(trackTotals(climb, t).done, trackTotals(climb, t).total)));
  const fullName = user ? (user.user_metadata?.name as string) || displayName(user) : 'Your climb';
  const joined = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : null;

  const achievements: Achievement[] = [
    { title: 'Steady climber', color: '#ff6b4a', glyph: 'mountain', value: best, tiers: [3, 7, 14, 30, 60], describe: g => `Reach a ${g} day climb streak` },
    {
      title: 'Trailblazer',
      color: '#b06cf2',
      glyph: 'boot',
      value: lessons,
      tiers: [1, 5, 15, 30, totalLessons].filter((t, i, all) => all.indexOf(t) === i).sort((a, b) => a - b),
      describe: g => (g === 1 ? 'Complete your first lesson' : `Complete ${g} lessons`),
    },
    { title: 'Grass grazer', color: '#4fc23a', glyph: 'grass', value: climb.grass, tiers: [50, 150, 300, 600, 1000], describe: g => `Collect ${g} grass` },
    { title: 'Camp conqueror', color: '#1f5bd0', glyph: 'tent', value: campsDone(climb), tiers: [1, 3, 6], describe: g => (g === 1 ? 'Finish every lesson in a camp' : `Finish ${g} camps`) },
    { title: 'Ridge grower', color: '#e0a000', glyph: 'horns', value: horns.level, tiers: [2, 3, 4, 5], describe: g => `Grow Walia’s horns to level ${g}` },
    { title: 'Summit', color: '#d2582e', glyph: 'flag', value: tracksDone(climb), tiers: [1, 2], describe: g => (g === 1 ? 'Finish a whole track and reach ራስ ዳሽን' : 'Reach the summit of both tracks') },
  ];

  async function saveName() {
    const trimmed = name.trim();
    if (!trimmed || !supabase) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { name: trimmed } });
    setSaving(false);
    if (!error) setEditing(false);
  }

  function invite() {
    void Share.share({ message: 'Learn Amharic with me on Kwanqa, climbing the Simien Mountains with Walia! https://kwanqa.com' }).catch(() => {});
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        {/* a big avatar on a mountain backdrop */}
        <View style={styles.banner}>
          <View style={StyleSheet.absoluteFill}>
            <MountainScene />
          </View>
          {user ? (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{fullName.charAt(0).toUpperCase()}</Text>
            </View>
          ) : null}
          <View style={styles.bannerWalia} pointerEvents="none">
            <Walia pose="wave" size={96} hornScale={horns.scale} />
          </View>
        </View>

        <View style={styles.id}>
          <View style={styles.flex}>
            {editing ? (
              <View style={styles.nameForm}>
                <TextInput value={name} onChangeText={setName} maxLength={60} autoFocus style={styles.input} placeholder="Your name" placeholderTextColor="#afafaf" />
                <Pressable onPress={() => void saveName()} style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>{saving ? 'Saving…' : 'Save'}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                disabled={!user}
                onPress={() => {
                  setName((user?.user_metadata?.name as string) || '');
                  setEditing(true);
                }}
              >
                <Text style={styles.name}>{fullName}</Text>
              </Pressable>
            )}
            <Text style={styles.handle}>{user ? accountLabel(user) : 'Saved on this phone'}</Text>
            {joined ? <Text style={styles.joined}>Joined {joined}</Text> : null}
          </View>
          {survey ? <Flag name={survey.track === 'amharic' ? 'ethiopia' : 'usa'} width={44} /> : null}
        </View>

        {enabled && !loading && !user ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create a profile to keep your progress</Text>
            <Text style={styles.cardText}>Your climb is only saved on this phone. A free profile keeps your grass, lessons, achievements, and Walia’s horns on any device and on kwanqa.com.</Text>
            <Button label="Create a profile" onPress={() => router.push({ pathname: '/account', params: { mode: 'signup' } })} />
            <Button label="Log in" tone="plain" onPress={() => router.push({ pathname: '/account', params: { mode: 'login' } })} />
          </View>
        ) : null}

        <Text style={styles.title}>Statistics</Text>
        <View style={styles.grid}>
          <Stat icon={<Peak lit={streak > 0} size={30} />} value={streak} label="Day climb streak" />
          <Stat icon={<Grass size={30} />} value={climb.grass} label="Total grass" />
          <Stat
            icon={
              <Svg width={30} height={30} viewBox="0 0 24 24">
                <Path d="M12 3 L21 20 H3 Z" fill="#c98b68" />
                <Rect x={11.2} y={1} width={1.6} height={5} fill="#5c3a24" />
                <Path d="M12.8 1.2 L17 2.4 L12.8 3.8 Z" fill={colors.primary} />
              </Svg>
            }
            value={`${highest.toLocaleString()} m`}
            label="Highest altitude"
          />
          <Stat
            icon={
              <Svg width={30} height={30} viewBox="0 0 24 24">
                <Circle cx={12} cy={12} r={10} fill={colors.green} />
                <Path d="M7 12.5 L10.5 16 L17 8.5" stroke="#fff" strokeWidth={2.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            }
            value={lessons}
            label="Lessons completed"
          />
        </View>

        <Text style={styles.title}>Achievements</Text>
        <View style={styles.card}>
          {achievements.map(a => (
            <AchievementRow key={a.title} a={a} />
          ))}
        </View>

        <Text style={styles.title}>Your learning</Text>
        <View style={styles.card}>
          {survey ? (
            <>
              <Fact term="Learning" value={LANGUAGE[survey.track]} />
              <Fact term="Speaks" value={survey.speaks.map(sp => LANGUAGE[sp] ?? sp).join(', ') || 'Not answered'} />
              <Fact term="Starting level" value={LEVEL[survey.level]} />
              <Fact term="Why" value={survey.reasons.map(r => REASON[r] ?? r).join(', ') || 'Not answered'} />
              <Fact term="Daily goal" value={`${GOAL[survey.dailyMinutes] ?? 'Custom'} · ${survey.dailyMinutes} min / day`} />
            </>
          ) : (
            <Text style={styles.cardText}>You haven’t taken the Get started survey yet.</Text>
          )}
          <Button label={survey ? 'Retake survey' : 'Take the survey'} tone="plain" onPress={() => router.push('/welcome')} />
        </View>

        {user ? (
          <>
            <Text style={styles.title}>Account</Text>
            <View style={styles.card}>
              <Text style={styles.switchTitle}>{accountLabel(user)}</Text>
              <Text style={styles.switchText}>Your progress is saved to this account.</Text>
              <Reminders userId={user.id} />
              <Button label="Log out" tone="plain" onPress={() => void signOut()} />
            </View>
            <Pressable onPress={() => router.push('/delete-account')} style={styles.delete}>
              <Text style={styles.deleteText}>Delete account</Text>
            </Pressable>
          </>
        ) : null}

        <View style={styles.card}>
          <View style={styles.invite}>
            <Walia mood="cheer" size={72} hornScale={horns.scale} />
            <View style={styles.flex}>
              <Text style={styles.cardTitle}>Climbing is more fun together</Text>
              <Text style={styles.cardText}>Invite a friend or a cousin to learn with you. Walia loves company!</Text>
            </View>
          </View>
          <Button label="Invite friends" tone="plain" onPress={invite} />
        </View>

        <View style={styles.card}>
          <View style={styles.hornsHead}>
            <Text style={styles.cardTitle}>Walia’s horns</Text>
            <Text style={styles.kicker}>
              Level {horns.level} of {horns.max}
            </Text>
          </View>
          <Text style={styles.cardText}>
            {horns.next === null ? 'Walia’s horns are fully grown. You’re a true mountain ibex!' : `Collect ${horns.next - climb.grass} more grass to grow a new ridge.`}
          </Text>
        </View>

        {/* the website's own pages, opened in an in-app browser */}
        <View style={styles.links}>
          {[
            ['About Kwanqa', '/about'],
            ['Our approach', '/approach'],
            ['Our values', '/values'],
            ['Privacy', '/privacy'],
          ].map(([label, path]) => (
            <Pressable key={path} onPress={() => void WebBrowser.openBrowserAsync(SITE + path)} hitSlop={6}>
              <Text style={styles.linkText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factTerm}>{term}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingTop: tabBarTop },
  flex: { flex: 1 },
  page: { padding: 16, gap: 14, paddingBottom: 48 },
  banner: { height: 150, borderRadius: 22, overflow: 'hidden', backgroundColor: '#fcede6', justifyContent: 'flex-end', padding: 14 },
  avatar: { width: 84, height: 84, borderRadius: 42, borderWidth: 4, borderColor: '#ffffff', backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.black, fontSize: 38, color: '#ffffff' },
  bannerWalia: { position: 'absolute', right: 10, bottom: -4 },
  id: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontFamily: fonts.black, fontSize: 26, color: colors.ink },
  handle: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  joined: { fontFamily: fonts.bold, fontSize: 13, color: '#afafaf' },
  nameForm: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, minHeight: 46, paddingHorizontal: 12, borderRadius: 12, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.bgSoft, fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  smallButton: { paddingHorizontal: 16, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  smallButtonText: { fontFamily: fonts.black, fontSize: 14, color: '#ffffff' },
  title: { fontFamily: fonts.black, fontSize: 22, color: colors.ink, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { width: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line },
  statValue: { fontFamily: fonts.black, fontSize: 19, color: colors.ink },
  statLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  card: { gap: 12, padding: 16, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line },
  cardTitle: { fontFamily: fonts.black, fontSize: 18, lineHeight: 23, color: colors.ink },
  cardText: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: colors.muted },
  ach: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  badge: { width: 66, height: 72, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingBottom: 10 },
  badgeLevel: { position: 'absolute', bottom: 5, paddingHorizontal: 5, borderRadius: 6, overflow: 'hidden', backgroundColor: '#ffffff', fontFamily: fonts.black, fontSize: 9 },
  achTop: { flexDirection: 'row', justifyContent: 'space-between' },
  achTitle: { fontFamily: fonts.black, fontSize: 16, color: colors.ink },
  achCount: { fontFamily: fonts.heavy, fontSize: 14, color: colors.muted },
  bar: { height: 12, borderRadius: 6, backgroundColor: colors.line, overflow: 'hidden', marginVertical: 5 },
  barFill: { height: '100%', borderRadius: 6, backgroundColor: colors.gold },
  achText: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  fact: { gap: 1 },
  factTerm: { fontFamily: fonts.heavy, fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  factValue: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  switchTitle: { fontFamily: fonts.heavy, fontSize: 15, color: colors.ink },
  switchText: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 18, color: colors.muted },
  delete: { alignSelf: 'center', padding: 8 },
  deleteText: { fontFamily: fonts.heavy, fontSize: 14, color: '#d9443a' },
  invite: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hornsHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  links: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 18, paddingVertical: 8 },
  linkText: { fontFamily: fonts.heavy, fontSize: 14, color: colors.muted },
  kicker: { fontFamily: fonts.heavy, fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
});
