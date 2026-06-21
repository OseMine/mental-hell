import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomCard } from '@/src/widgets/CustomCard';
import { SettingsSection } from '@/src/components/SettingsSection';
import { useTranslation } from '@/src/i18n/useTranslation';

interface DataManagementSectionProps {
  theme: MD3Theme;
  onClearAllData: () => void;
}

export function DataManagementSection({ theme, onClearAllData }: DataManagementSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingsSection title={t('settings.dataManagement')} theme={theme}>
      <TouchableOpacity onPress={onClearAllData}>
        <CustomCard
          style={[
            styles.destructiveCard,
            {
              backgroundColor: `${theme.colors.error}14`,
              borderColor: theme.colors.error,
            },
          ]}
        >
          <View style={styles.cardContent}>
            <Ionicons name="trash" size={22} color={theme.colors.error} style={styles.icon} />
            <View style={styles.textContent}>
              <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.error }}>
                {t('settings.clearAllData')}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                {t('settings.clearAllSubtitle')}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.error} />
        </CustomCard>
      </TouchableOpacity>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  destructiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  icon: { alignSelf: 'center' },
  textContent: { flex: 1 },
});
