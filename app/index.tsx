import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Root() {
  const router = useRouter();
  useEffect(() => {
    AsyncStorage.getItem('onboarding_done').then(done => {
      if (done) {
        router.replace('/(tabs)');
      } else {
        // Hier fehlte der abschließende Slash im String selbst:
        router.replace('/onboarding'); 
      }
    });
  }, []);
  return null;
}