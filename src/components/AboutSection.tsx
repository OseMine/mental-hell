import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomCard } from '@/src/widgets/CustomCard';
import { SettingsSection } from '@/src/components/SettingsSection';
import { useTranslation } from '@/src/i18n/useTranslation';

interface AboutSectionProps {
  theme: MD3Theme;
}

export function AboutSection({ theme }: AboutSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingsSection title={t('settings.about')} theme={theme}>
      <CustomCard glass style={styles.aboutCard}>
        <View style={styles.aboutHeaderRow}>
          <Ionicons name="information-circle" size={22} color={theme.colors.primary} />
          <View style={styles.textContent}>
            <Text variant="bodyLarge" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
              Mental Hell
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 1 }}>
              {t('settings.version')}
            </Text>
          </View>
        </View>
        <Text
          variant="bodyMedium"
          style={[styles.aboutDescription, { color: theme.colors.onSurfaceVariant }]}
        >
          {t('settings.aboutDescription')}
        </Text>
      </CustomCard>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  aboutCard: { padding: 14 },
  aboutHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  textContent: { flex: 1 },
  aboutDescription: { lineHeight: 18 },
});
