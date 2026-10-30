import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { useProfile } from '@/lib/profile';
import { useAuth } from '@/auth';
import { useColors } from '@/theme';

export default function TabsLayout() {
  const colors = useColors();
  const profile = useProfile();
  const { user } = useAuth();
  // New learners start on the welcome screen, then the Get started survey; a
  // signed-in learner without saved answers goes straight to the survey.
  if (!profile) return <Redirect href={user ? '/welcome' : '/start'} />;
  return (
    <NativeTabs backgroundColor={colors.bg} iconColor={{ default: colors.muted, selected: colors.primary }} labelStyle={{ selected: { color: colors.primary } }}>
      <NativeTabs.Trigger name="(learn)">
        <NativeTabs.Trigger.Label>Learn</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="hiking" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="alphabet">
        <NativeTabs.Trigger.Label>Alphabet</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'character.book.closed', selected: 'character.book.closed.fill' }} md="translate" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="talk">
        <NativeTabs.Trigger.Label>Talk</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'phone', selected: 'phone.fill' }} md="call" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'safari', selected: 'safari.fill' }} md="explore" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
