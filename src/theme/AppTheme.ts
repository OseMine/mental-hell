// src/theme/AppTheme.ts
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useMaterial3Theme } from 'react-native-material3-theme';
import Colors from '@/constants/Colors'; // Deine bestehende Farbdatei

export function useAppTheme() {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useMaterial3Theme();

  // Material 3 Basis-Themes mit deinen benutzerdefinierten Konstanten erweitern
  const baseTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const systemColors = colorScheme === 'dark' ? theme.dark : theme.light;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...systemColors,
      // Hier kannst du feste Fallbacks aus deiner Colors.ts mappen
      customCard: Colors[colorScheme].card,
      customTint: Colors[colorScheme].tint,
    },
    isDark: colorScheme === 'dark',
  };
}