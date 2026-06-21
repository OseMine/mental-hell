import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomCard } from '@/src/widgets/CustomCard';
import { InfoBox } from '@/src/widgets/InfoBox';
import { SettingsSection } from '@/src/components/SettingsSection';
import { useTranslation } from '@/src/i18n/useTranslation';

interface ExportSectionProps {
  theme: MD3Theme;
  isExporting: boolean;
  onExport: () => void;
}

export function ExportSection({ theme, isExporting, onExport }: ExportSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingsSection title={t('settings.export')} theme={theme}>
      <TouchableOpacity onPress={onExport} disabled={isExporting}>
        <CustomCard glass style={styles.settingItem}>
          <View style={styles.cardContent}>
            <Ionicons name="download" size={22} color={theme.colors.primary} style={styles.icon} />
            <View style={styles.textContent}>
              <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                {t('settings.exportJSON')}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                {isExporting ? t('settings.exporting') : t('settings.downloadData')}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
        </CustomCard>
      </TouchableOpacity>

      <View style={styles.infoSpacing}>
        <InfoBox text={t('settings.exportInfo')} />
      </View>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  icon: { alignSelf: 'center' },
  textContent: { flex: 1 },
  infoSpacing: { marginTop: 10 },
});
