import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../src/store/settingsStore';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/onboarding'), 0);
    return () => clearTimeout(timer);
  }, []);

  return null;
}