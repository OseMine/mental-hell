// src/theme/useAppTheme.ts
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import Colors from '@/constants/Colors'; // Deine ursprünglichen Farbdefinitionen

export function useAppTheme() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  // Wähle das offizielle Material 3 Basis-Theme aus
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const legacyColors = Colors[colorScheme];

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      // Hier mappen wir deine alten Styles auf das neue System,
      // damit bestehende Screens beim Umbau nicht kaputtgehen!
      legacyText: legacyColors.text,
      legacyTint: legacyColors.tint,
      legacyCard: legacyColors.card,
      legacyBorder: legacyColors.lightGray,
    },
    isDark,
  };
}