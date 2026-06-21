import React from 'react';
import { Platform, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useTheme, MD3Theme } from 'react-native-paper';

interface CustomCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glass?: boolean;
}

export function CustomCard({ children, style, glass }: CustomCardProps) {
  const theme = useTheme() as MD3Theme;
  const isPitchBlack = theme.colors.surface === '#000000';
  const colors = theme.colors as any;

  const bgColor = glass
    ? theme.dark
      ? 'rgba(30,30,35,0.7)'
      : 'rgba(255,255,255,0.7)'
    : colors.surfaceContainerLow ?? theme.colors.surface;

  const platformStyle = Platform.select({
    android: {
      elevation: glass ? 4 : 1,
    } as any,
    ios: {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: glass ? 4 : 1 },
      shadowOpacity: glass ? 0.15 : 0.08,
      shadowRadius: glass ? 12 : 4,
    } as any,
    web: glass
      ? ({
          boxShadow: `0 4px 24px rgba(0,0,0,${theme.dark ? 0.3 : 0.08})`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        } as any)
      : ({
          boxShadow: `0 1px 4px rgba(0,0,0,${theme.dark ? 0.2 : 0.05})`,
        } as any),
  });

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: bgColor,
        borderColor: glass ? 'rgba(128,128,128,0.15)' : theme.colors.outlineVariant,
      },
      platformStyle,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 16,
    marginBottom: 12,
  },
});
