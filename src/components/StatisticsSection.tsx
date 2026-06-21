import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomCard } from '@/src/widgets/CustomCard';
import { SettingsSection } from '@/src/components/SettingsSection';
import { useTranslation } from '@/src/i18n/useTranslation';

interface StatItem {
  label: string;
  value: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

interface StatisticsSectionProps {
  theme: MD3Theme;
  items: StatItem[];
}

export function StatisticsSection({ theme, items }: StatisticsSectionProps) {
  const { t } = useTranslation();
  return (
    <SettingsSection title={t('settings.statistics')} theme={theme}>
      <View style={styles.statisticsGrid}>
        {items.map((item, index) => (
          <CustomCard glass key={index} style={styles.statisticCard}>
            <Ionicons
              name={item.icon}
              size={22}
              color={theme.colors.primary}
              style={styles.statisticIcon}
            />
            <Text
              variant="headlineSmall"
              style={[styles.statisticValue, { color: theme.colors.primary }]}
            >
              {item.value}
            </Text>
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.outline, textAlign: 'center' }}
            >
              {item.label}
            </Text>
          </CustomCard>
        ))}
      </View>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  statisticsGrid: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  statisticCard: { flex: 1, padding: 12, alignItems: 'center' },
  statisticIcon: { marginBottom: 4 },
  statisticValue: { fontWeight: '800', marginBottom: 2 },
});
