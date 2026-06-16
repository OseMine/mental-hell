import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { useMaterial3Theme } from 'react-native-material3-theme';
import { useSettingsStore } from '../src/store/settingsStore'; 
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const { accentColor, colorScheme } = useSettingsStore();
  const systemColorScheme = useColorScheme();

  const { theme, updateTheme } = useMaterial3Theme({ fallbackSourceColor: accentColor || '#6750A4' });

  useEffect(() => {
    if (accentColor) updateTheme(accentColor);
  }, [accentColor]);

  const isDark = colorScheme === 'dark' || (colorScheme === 'system' && systemColorScheme === 'dark');

  const paperTheme = isDark
    ? { ...MD3DarkTheme, colors: theme.dark }
    : { ...MD3LightTheme, colors: theme.light };

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Slot />
    </PaperProvider>
  );
}