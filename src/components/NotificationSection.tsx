import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text, Switch, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomCard } from '@/src/widgets/CustomCard';
import { InfoBox } from '@/src/widgets/InfoBox';
import { SettingsSection } from '@/src/components/SettingsSection';
import { useTranslation } from '@/src/i18n/useTranslation';

interface NotificationSectionProps {
  theme: MD3Theme;
  notificationsEnabled: boolean;
  onToggle: () => void;
}

export function NotificationSection({ theme, notificationsEnabled, onToggle }: NotificationSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingsSection title={t('settings.notifications')} theme={theme}>
      <CustomCard glass style={styles.settingItem}>
        <View style={styles.cardContent}>
          <Ionicons name="notifications" size={22} color={theme.colors.primary} style={styles.icon} />
          <View style={styles.textContent}>
            <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
              {t('settings.dailyNotifications')}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              {t('settings.notificationTimes')}
            </Text>
          </View>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
          thumbColor={notificationsEnabled ? theme.colors.onPrimary : theme.colors.outline}
          ios_backgroundColor={theme.colors.surfaceVariant}
        />
      </CustomCard>

      {Platform.OS === 'web' && (
        <View style={styles.infoSpacing}>
          <InfoBox text={t('settings.notificationWebInfo')} />
        </View>
      )}
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
