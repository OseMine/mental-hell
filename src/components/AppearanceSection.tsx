import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomCard } from '@/src/widgets/CustomCard';
import { SettingsSection } from '@/src/components/SettingsSection';
import { useTranslation } from '@/src/i18n/useTranslation';

const COLOR_OPTIONS = ['#6750A4', '#2E7D32', '#C62828', '#0288D1', '#F57C00'];

interface AppearanceSectionProps {
  theme: MD3Theme;
  accentColor: string;
  colorScheme: string;
  onAccentColorChange: (color: string) => void;
  onColorSchemeChange: (scheme: 'light' | 'dark' | 'system' | 'pitch-black') => void;
}

export function AppearanceSection({
  theme,
  accentColor,
  colorScheme,
  onAccentColorChange,
  onColorSchemeChange,
}: AppearanceSectionProps) {
  const { t } = useTranslation();

  const SCHEME_OPTIONS = [
    { value: 'system', label: t('appearance.system'), icon: 'phone-portrait' as const },
    { value: 'light', label: t('appearance.light'), icon: 'sunny' as const },
    { value: 'dark', label: t('appearance.dark'), icon: 'moon' as const },
    { value: 'pitch-black', label: t('appearance.pitchBlack'), icon: 'planet' as const },
  ];

  return (
    <SettingsSection title={t('appearance.title')} theme={theme}>
      <CustomCard glass style={styles.settingItem}>
        <View style={styles.appearanceRow}>
          <Ionicons name="color-palette" size={22} color={theme.colors.primary} style={styles.settingIcon} />
          <Text variant="bodyLarge" style={{ fontWeight: '600', marginRight: 12 }}>
            {t('appearance.accentColor')}
          </Text>
        </View>
        <View style={styles.colorPalette}>
          {COLOR_OPTIONS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => onAccentColorChange(color)}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                accentColor === color && styles.colorSwatchSelected,
              ]}
            />
          ))}
        </View>
      </CustomCard>

      <CustomCard glass style={styles.settingItem}>
        <View style={styles.darkModeSection}>
          <View style={styles.appearanceRow}>
            <Ionicons name="contrast" size={22} color={theme.colors.primary} style={styles.settingIcon} />
            <Text variant="bodyLarge" style={{ fontWeight: '600' }}>
              {t('appearance.scheme')}
            </Text>
          </View>
          <View style={styles.schemePills}>
            {SCHEME_OPTIONS.map((opt) => {
              const selected = colorScheme === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => onColorSchemeChange(opt.value as any)}
                  style={[
                    styles.schemePill,
                    { backgroundColor: (theme.colors as any).surfaceContainerHigh ?? theme.colors.surfaceVariant },
                    selected && { backgroundColor: theme.colors.primaryContainer as string },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={opt.icon}
                    size={18}
                    color={selected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
                  />
                  <Text
                    variant="labelSmall"
                    style={{
                      color: selected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
                      fontWeight: selected ? '700' : '500',
                      marginTop: 2,
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </CustomCard>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  appearanceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingIcon: { alignSelf: 'center' },
  colorPalette: { flexDirection: 'row', gap: 10, marginTop: 10 },
  colorSwatch: { width: 36, height: 36, borderRadius: 18 },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 4,
    ...Platform.select({
      web: { boxShadow: '0 2px 3px rgba(0,0,0,0.3)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
    }),
  },
  darkModeSection: { gap: 12 },
  schemePills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  schemePill: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 72,
  },
});
