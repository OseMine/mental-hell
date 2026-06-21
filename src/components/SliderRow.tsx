import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useTranslation } from '@/src/i18n/useTranslation';

interface SliderRowProps {
  label: string;
  value: number;
  color: string;
  trackColor: string;
  onChange: (v: number) => void;
  hint?: string;
  min?: number;
  max?: number;
}

const MOOD_KEYS = ['veryBad', 'bad', 'neutral', 'good', 'veryGood'] as const;

export function SliderRow({ label, value, color, trackColor, onChange, hint, min = 1, max = 10 }: SliderRowProps) {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const moodIndex = Math.min(Math.max(Math.round(value) - 1, 0), 4);
  const displayHint = hint ?? t(`mood.${MOOD_KEYS[moodIndex]}`);

  return (
    <View style={styles.sliderSection}>
      <View style={styles.labelRow}>
        <Text variant="labelLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
          {label}
        </Text>
        <View style={[styles.valueBadge, { backgroundColor: color + '20' }]}>
          <Text variant="labelMedium" style={{ fontWeight: '700', color, minWidth: 28, textAlign: 'center' }}>
            {Math.round(value)}
          </Text>
        </View>
      </View>
      <View style={styles.sliderRow}>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, minWidth: 16 }}>
          {min}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={1}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={color}
          maximumTrackTintColor={trackColor}
          thumbTintColor={color}
        />
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, minWidth: 16, textAlign: 'right' }}>
          {max}
        </Text>
      </View>
      {displayHint && (
        <Text variant="bodySmall" style={[styles.sliderHint, { color: theme.colors.onSurfaceVariant }]}>
          {displayHint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sliderSection: { marginBottom: 20 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  valueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  slider: { flex: 1, height: 40 },
  sliderHint: { marginTop: 2, fontWeight: '500', opacity: 0.7 },
});
