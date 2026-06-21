import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { useMaterial3Theme } from 'react-native-material3-theme';
import { useSettingsStore } from '../src/store/settingsStore';
import { StatusBar } from 'expo-status-bar';

function buildPitchBlackTheme(accent: string, darkColors: Record<string, any>) {
  return {
    ...MD3DarkTheme,
    colors: {
      ...darkColors,
      primary: accent,
      onPrimary: '#000000',
      primaryContainer: accent + '26',
      onPrimaryContainer: accent,

      secondary: '#9E9E9E',
      onSecondary: '#000000',
      secondaryContainer: '#1A1A1A',
      onSecondaryContainer: '#CCCCCC',

      tertiary: '#7C7C7C',
      onTertiary: '#000000',
      tertiaryContainer: '#141414',
      onTertiaryContainer: '#B0B0B0',

      error: '#CF6679',
      onError: '#000000',
      errorContainer: '#370B1E',
      onErrorContainer: '#F2B8C5',

      background: '#000000',
      onBackground: '#E0E0E0',

      surface: '#000000',
      onSurface: '#E0E0E0',
      surfaceVariant: '#121212',
      onSurfaceVariant: '#A0A0A0',

      outline: '#2C2C2C',
      outlineVariant: '#1A1A1A',

      inverseSurface: '#E0E0E0',
      inverseOnSurface: '#000000',
      inversePrimary: accent,

      shadow: '#000000',
      scrim: '#000000',
      surfaceDisabled: '#1A1A1A',
      onSurfaceDisabled: '#4A4A4A',
      backdrop: '#000000',

      surfaceContainer: '#000000',
      surfaceContainerLow: '#000000',
      surfaceContainerLowest: '#000000',
      surfaceContainerHigh: '#0A0A0A',
      surfaceContainerHighest: '#141414',
      surfaceBright: '#1A1A1A',
      surfaceDim: '#000000',
      surfaceTint: accent,

      elevation: {
        level0: '#000000',
        level1: '#000000',
        level2: '#050505',
        level3: '#0A0A0A',
        level4: '#0F0F0F',
        level5: '#141414',
      },
    },
  };
}

export default function RootLayout() {
  const { accentColor, colorScheme } = useSettingsStore();
  const systemColorScheme = useColorScheme();

  const { theme, updateTheme } = useMaterial3Theme({ fallbackSourceColor: accentColor || '#6750A4' });

  useEffect(() => {
    if (accentColor) updateTheme(accentColor);
  }, [accentColor]);

  const isSystemDark = systemColorScheme === 'dark';
  const effectiveScheme = colorScheme === 'system' ? (isSystemDark ? 'dark' : 'light') : colorScheme;
  const isDark = effectiveScheme === 'dark' || effectiveScheme === 'pitch-black';
  const isPitchBlack = effectiveScheme === 'pitch-black';

  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const m3Colors = isDark ? theme.dark : theme.light;

  const paperTheme = isPitchBlack
    ? buildPitchBlackTheme(m3Colors.primary, m3Colors)
    : { ...baseTheme, colors: m3Colors };

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="screens/journal-editor" options={{ presentation: 'modal', headerShown: true, headerTitle: '' }} />
        <Stack.Screen name="screens/journal-view" options={{ presentation: 'modal', headerShown: true, headerTitle: '' }} />
        <Stack.Screen name="screens/therapist-report" options={{ presentation: 'modal', headerShown: true, headerTitle: '' }} />
        <Stack.Screen name="screens/ai-chat" options={{ presentation: 'modal', headerShown: true, headerTitle: '' }} />
      </Stack>
    </PaperProvider>
  );
}
