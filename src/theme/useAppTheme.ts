import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useSettingsStore } from '../store/settingsStore';
import Colors from '@/constants/Colors';

export function useAppTheme() {
  const settingsColorScheme = useSettingsStore((s) => s.colorScheme);
  const systemColorScheme = useColorScheme();

  const isDark = settingsColorScheme === 'dark' || (settingsColorScheme === 'system' && systemColorScheme === 'dark');

  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const legacyColors = Colors[isDark ? 'dark' : 'light'];

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      legacyText: legacyColors.text,
      legacyTint: legacyColors.tint,
      legacyCard: legacyColors.card,
      legacyBorder: legacyColors.lightGray,
    },
    isDark,
  };
}