import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from '@/src/i18n/useTranslation';
import { TouchableOpacity } from 'react-native';

const ACTIVITY_OPTIONS = [
  { key: 'sedentary', icon: 'bed-outline' as const },
  { key: 'light', icon: 'walk-outline' as const },
  { key: 'moderate', icon: 'bicycle-outline' as const },
  { key: 'active', icon: 'fitness-outline' as const },
  { key: 'veryActive', icon: 'barbell-outline' as const },
];

interface ActivitySelectorProps {
  value: string | undefined;
  onChange: (activity: string) => void;
}

export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();

  return (
    <View>
      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        {t('activity.selectLevel')}
      </Text>
      <View style={styles.optionsRow}>
        {ACTIVITY_OPTIONS.map((opt) => {
          const isSelected = value === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onChange(isSelected ? '' : opt.key)}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? theme.colors.tertiaryContainer : theme.colors.surfaceVariant,
                  borderColor: isSelected ? theme.colors.tertiary : 'transparent',
                },
              ]}
            >
              <Ionicons
                name={opt.icon}
                size={22}
                color={isSelected ? theme.colors.tertiary : theme.colors.outline}
              />
              <Text
                variant="labelSmall"
                style={{
                  color: isSelected ? theme.colors.tertiary : theme.colors.outline,
                  fontWeight: isSelected ? '700' : '400',
                  marginTop: 2,
                }}
              >
                {t(`activity.${opt.key}`)}
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
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    flex: 1,
    minWidth: 56,
  },
});