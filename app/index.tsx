import { Redirect } from 'expo-router';
import { useSettingsStore } from '../src/store/settingsStore';

export default function Index() {
  const { onboardingDone } = useSettingsStore();

  if (!onboardingDone) return <Redirect href="/onboarding" />;

  return <Redirect href="/(tabs)" />;
}
