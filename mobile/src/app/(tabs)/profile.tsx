import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { altitudeFor, climbStreak, hornLevel, trackTotals, useClimb } from '@/lib/climb';
import { displayName, useAuth } from '@/auth';
import { Grass, Peak } from '@/components/icons';
import { Mesob } from '@/components/stone';
import Walia from '@/components/walia';
import { colors, fonts, tabBarTop } from '@/theme';

// The learner's climb at a glance, and their account: make one to keep
// progress on any device, or log out.

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <View style={styles.stat}>
      {icon}
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

export default function Profile() {
  const climb = useClimb();
  const { user, enabled, loading, signOut } = useAuth();
  const horns = hornLevel(climb.grass);
  const streak = climbStreak(climb.days);
  const amharic = trackTotals(climb, 'amharic');
  const english = trackTotals(climb, 'english');
  const lessons = amharic.done + english.done;
  const altitude = altitudeFor(amharic.done, amharic.total);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.head}>
          <Walia pose="wave" size={92} hornScale={horns.scale} />
          <View style={styles.headText}>
            <Text style={styles.name}>{user ? displayName(user) : 'Your climb'}</Text>
            <Text style={styles.sub}>{user ? user.email : 'Saved on this phone'}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <Stat icon={<Peak lit={streak.doneToday} size={30} />} value={streak.count} label="Day streak" />
          <Stat icon={<Grass size={30} />} value={climb.grass} label="Grass" />
          <Stat icon={<Walia size={30} hornScale={horns.scale} />} value={`${horns.level} of ${horns.max}`} label="Horn level" />
          <Stat icon={<Mesob open />} value={`${altitude.toLocaleString()} m`} label={`${lessons} ${lessons === 1 ? 'lesson' : 'lessons'} done`} />
        </View>

        {enabled && !loading && !user ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Keep your progress safe</Text>
            <Text style={styles.cardText}>Your climb is only saved on this phone. Make a free account to keep your grass, horns and progress on any device and on kwanqa.com.</Text>
            <Button label="Create account" onPress={() => router.push({ pathname: '/account', params: { mode: 'signup' } })} />
            <Button label="Log in" plain onPress={() => router.push({ pathname: '/account', params: { mode: 'login' } })} />
          </View>
        ) : null}

        {user ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account</Text>
            <Text style={styles.cardText}>Your progress is saved to your account, so it follows you to kwanqa.com and any phone you log in on.</Text>
            <Button label="Log out" plain onPress={signOut} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Button({ label, onPress, plain }: { label: string; onPress: () => void; plain?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, plain && styles.buttonPlain, pressed && styles.buttonDown]}>
      <Text style={[styles.buttonText, plain && styles.buttonTextPlain]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingTop: tabBarTop },
  page: { padding: 16, gap: 18, paddingBottom: 40 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headText: { flex: 1, gap: 2 },
  name: { fontFamily: fonts.black, fontSize: 28, color: colors.ink },
  sub: { fontFamily: fonts.bold, fontSize: 15, color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { width: '48%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.line },
  statValue: { fontFamily: fonts.black, fontSize: 19, color: colors.ink },
  statLabel: { fontFamily: fonts.bold, fontSize: 13, color: colors.muted },
  card: { gap: 10, padding: 16, borderRadius: 20, borderWidth: 2, borderBottomWidth: 5, borderColor: colors.line },
  cardTitle: { fontFamily: fonts.black, fontSize: 20, color: colors.ink },
  cardText: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21, color: colors.muted },
  button: { minHeight: 50, borderRadius: 16, borderBottomWidth: 5, borderBottomColor: colors.primaryShadow, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  buttonPlain: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: colors.line, borderBottomColor: colors.line },
  buttonDown: { borderBottomWidth: 0, marginTop: 5 },
  buttonText: { fontFamily: fonts.black, fontSize: 16, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.8 },
  buttonTextPlain: { color: colors.blue },
});
