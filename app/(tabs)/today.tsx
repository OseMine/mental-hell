import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useHealthStore } from '@/src/store/healthStore';
import { Background } from '@/src/widgets/Background';
import { InfoBox } from '@/src/widgets/InfoBox';
import { CheckInCard } from '@/src/components/CheckInCard';
import { TodoSection } from '@/src/components/TodoSection';
import { WeatherSelector } from '@/src/components/WeatherSelector';
import { ActivitySelector } from '@/src/components/ActivitySelector';
import { StaggeredEntrance } from '@/src/components/StaggeredEntrance';
import { TabPageTransition } from '@/src/components/TabPageTransition';
import { CustomCard } from '@/src/widgets/CustomCard';
import { useTranslation } from '@/src/i18n/useTranslation';
import { getDateFormatted } from '@/src/utils/formatters';
import { useResponsive } from '@/src/utils/responsive';

type CheckInType = 'morning' | 'midday' | 'evening';

interface CheckInState {
  mood_score: number;
  stress_level: number;
  notes: string;
  opened_at: number | null;
  weather?: string;
  activity?: string;
}

const INITIAL_STATE: CheckInState = { mood_score: 5, stress_level: 5, notes: '', opened_at: null };

export default function TodayScreen() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();
  const { addDailyLog, getTodaysLogs } = useHealthStore();

  const [expandedCheckIn, setExpandedCheckIn] = useState<CheckInType | null>(null);
  const [checkInData, setCheckInData] = useState<Record<CheckInType, CheckInState>>({
    morning: { ...INITIAL_STATE },
    midday:  { ...INITIAL_STATE },
    evening: { ...INITIAL_STATE },
  });

  const CHECK_IN_META: Array<{
    type: CheckInType;
    label: string;
    icon: React.ComponentProps<typeof import('@expo/vector-icons/Ionicons').default>['name'];
    scheduled_time: string;
  }> = [
    { type: 'morning', label: t('today.morningCheck'),  icon: 'sunny-outline',  scheduled_time: '08:00' },
    { type: 'midday',  label: t('today.middayCheck'), icon: 'cloud-outline',  scheduled_time: '13:00' },
    { type: 'evening', label: t('today.eveningCheck'),   icon: 'moon-outline',   scheduled_time: '20:00' },
  ];

  const handleExpand = (type: CheckInType) => {
    const isOpening = expandedCheckIn !== type;
    setExpandedCheckIn(isOpening ? type : null);
    if (isOpening && checkInData[type].opened_at === null) {
      setCheckInData((prev) => ({
        ...prev,
        [type]: { ...prev[type], opened_at: Date.now() },
      }));
    }
  };

  const handleSave = (type: CheckInType) => {
    const data = checkInData[type];
    const meta = CHECK_IN_META.find((m) => m.type === type)!;

    addDailyLog({
      type,
      mood_score: data.mood_score,
      stress_level: data.stress_level,
      notes: data.notes,
      scheduled_time: meta.scheduled_time,
      opened_at: data.opened_at ?? Date.now(),
      saved_at: Date.now(),
      weather: data.weather,
      activity: data.activity,
    });

    const labels: Record<string, string> = {
      morning: t('today.morning'),
      midday: t('today.midday'),
      evening: t('today.evening'),
    };
    Alert.alert(t('today.saved'), t('today.savedMsg', { type: labels[type] }));
    setExpandedCheckIn(null);
  };

  const handleDataChange = (type: CheckInType, data: CheckInState) => {
    setCheckInData((prev) => ({ ...prev, [type]: data }));
  };

  return (
    <Background scrollable={true}>
      <TabPageTransition>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
            {t('headers.todayHeader')}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
            {getDateFormatted(new Date())}
          </Text>
        </View>

        <StaggeredEntrance index={0}>
          <TodoSection />
        </StaggeredEntrance>

        {isDesktop ? (
          <View style={styles.desktopCheckinRow}>
            {CHECK_IN_META.map((meta, i) => (
              <StaggeredEntrance key={meta.type} index={i + 1}>
                <View style={{ flex: 1 }}>
                  <CheckInCard
                    meta={meta}
                    data={checkInData[meta.type]}
                    isExpanded={expandedCheckIn === meta.type}
                    onExpand={() => handleExpand(meta.type)}
                    onDataChange={(data) => handleDataChange(meta.type, data)}
                    onSave={() => handleSave(meta.type)}
                  >
                    {checkInData[meta.type].opened_at !== null && (
                      <View style={styles.enhancedFields}>
                        <WeatherSelector
                          value={checkInData[meta.type].weather}
                          onChange={(w) => handleDataChange(meta.type, { ...checkInData[meta.type], weather: w })}
                        />
                        <ActivitySelector
                          value={checkInData[meta.type].activity}
                          onChange={(a) => handleDataChange(meta.type, { ...checkInData[meta.type], activity: a })}
                        />
                      </View>
                    )}
                  </CheckInCard>
                </View>
              </StaggeredEntrance>
            ))}
          </View>
        ) : (
          CHECK_IN_META.map((meta, i) => (
            <StaggeredEntrance key={meta.type} index={i + 1}>
              <CheckInCard
                meta={meta}
                data={checkInData[meta.type]}
                isExpanded={expandedCheckIn === meta.type}
                onExpand={() => handleExpand(meta.type)}
                onDataChange={(data) => handleDataChange(meta.type, data)}
                onSave={() => handleSave(meta.type)}
              >
                {checkInData[meta.type].opened_at !== null && (
                  <View style={styles.enhancedFields}>
                    <WeatherSelector
                      value={checkInData[meta.type].weather}
                      onChange={(w) => handleDataChange(meta.type, { ...checkInData[meta.type], weather: w })}
                    />
                    <ActivitySelector
                      value={checkInData[meta.type].activity}
                      onChange={(a) => handleDataChange(meta.type, { ...checkInData[meta.type], activity: a })}
                    />
                  </View>
                )}
              </CheckInCard>
            </StaggeredEntrance>
          ))
        )}

        <InfoBox text={t('today.info')} />
      </TabPageTransition>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5 },
  enhancedFields: { paddingHorizontal: 16, paddingBottom: 4 },
  desktopCheckinRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
});
