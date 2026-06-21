import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, MD3Theme } from 'react-native-paper';

interface SettingsSectionProps {
  title: string;
  theme: MD3Theme;
  children: React.ReactNode;
}

export function SettingsSection({ title, theme, children }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  sectionTitle: { fontWeight: '700', marginBottom: 10 },
});
