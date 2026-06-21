import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';
import { useTranslation } from '@/src/i18n/useTranslation';

const WEATHER_OPTIONS = [
  { key: 'sunny', icon: 'sunny' as const, emoji: '☀️' },
  { key: 'cloudy', icon: 'cloudy' as const, emoji: '☁️' },
  { key: 'rainy', icon: 'rainy' as const, emoji: '🌧️' },
  { key: 'snowy', icon: 'snow' as const, emoji: '❄️' },
  { key: 'stormy', icon: 'thunderstorm' as const, emoji: '⛈️' },
  { key: 'foggy', icon: 'cloudy' as const, emoji: '🌫️' },
];

interface WeatherSelectorProps {
  value: string | undefined;
  onChange: (weather: string) => void;
}

export function WeatherSelector({ value, onChange }: WeatherSelectorProps) {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();

  return (
    <View>
      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        {t('weather.selectCondition')}
      </Text>
      <View style={styles.optionsRow}>
        {WEATHER_OPTIONS.map((opt) => {
          const isSelected = value === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onChange(isSelected ? '' : opt.key)}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                  borderColor: isSelected ? theme.colors.primary : 'transparent',
                },
              ]}
            >
              <Text variant="titleLarge">{opt.emoji}</Text>
              <Text
                variant="labelSmall"
                style={{
                  color: isSelected ? theme.colors.primary : theme.colors.outline,
                  fontWeight: isSelected ? '700' : '400',
                  marginTop: 2,
                }}
              >
                {t(`weather.${opt.key}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '600', marginBottom: 10, marginTop: 8 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    minWidth: 56,
  },
});