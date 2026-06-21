import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeInDown } from 'react-native-reanimated';
import { useHealthStore } from '@/src/store/healthStore';
import { useMentalScore } from '@/src/store/useMentalScore';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { StatCard } from '@/src/widgets/StatCard';
import { MiniPill } from '@/src/widgets/MiniPill';
import { AssessmentScore } from '@/src/widgets/AssessmentScore';
import { WeekChart } from '@/src/components/WeekChart';
import { AnimatedScore } from '@/src/components/AnimatedScore';
import { StaggeredEntrance } from '@/src/components/StaggeredEntrance';
import { TabPageTransition } from '@/src/components/TabPageTransition';
import { useTranslation } from '@/src/i18n/useTranslation';
import { getScoreDetails } from '@/src/theme/scoreTheme';
import { getDateFormatted, formatTime } from '@/src/utils/formatters';
import { useResponsive } from '@/src/utils/responsive';

export default function HomeScreen() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  const {
    getTodaysLogs,
    getLastSevenDaysLogs,
    getLastWeeklyAssessment,
    getStreak,
  } = useHealthStore();

  const todaysLogs = getTodaysLogs();
  const sevenDayLogs = getLastSevenDaysLogs();
  const lastAssessment = getLastWeeklyAssessment();
  const streak = getStreak();

  const mentalScore = useMentalScore(todaysLogs, sevenDayLogs, lastAssessment);
  const scoreMeta = getScoreDetails(mentalScore, theme.colors);

  const barWidth = useSharedValue(0);
  useEffect(() => {
    barWidth.value = withTiming(mentalScore !== null ? (mentalScore / 10) * 100 : 0, {
      duration: 800,
    });
  }, [mentalScore]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  const typeLabels: Record<string, string> = {
    morning: t('home.morning'),
    midday: t('home.midday'),
    evening: t('home.evening'),
  };

  return (
    <Background scrollable={true}>
      <TabPageTransition>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
          {t('headers.homeHeader')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          {getDateFormatted(new Date())}
        </Text>
      </View>

      <Animated.View entering={FadeInDown.duration(600).springify().damping(24).stiffness(160)}>
        <CustomCard glass style={[styles.scoreCard, isDesktop && { paddingVertical: 32, paddingHorizontal: 32 }]}>
          <Text variant="labelLarge" style={[styles.scoreCardTitle, { color: theme.colors.outline }]}>
            {t('home.mentalScore')}
          </Text>
          <View style={styles.scoreRow}>
            <AnimatedScore score={mentalScore} color={scoreMeta.color} theme={theme} />
            <Text variant="titleLarge" style={{ color: theme.colors.outline }}>{t('home.outOfTen')}</Text>
          </View>

          <Animated.View
            entering={FadeInDown.duration(500).delay(200).springify().damping(24).stiffness(160)}
            style={[styles.scoreBadge, { backgroundColor: scoreMeta.badgeBg }]}
          >
            <Text variant="labelMedium" style={{ color: scoreMeta.color, fontWeight: '700' }}>
              {scoreMeta.label}
            </Text>
          </Animated.View>

          <View style={[styles.scoreBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Animated.View
              style={[
                styles.scoreBarFill,
                { backgroundColor: scoreMeta.color },
                barStyle,
              ]}
            />
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
            {t('home.basedOn')}
          </Text>
        </CustomCard>
      </Animated.View>

      <View style={[styles.statsRow, isDesktop && { gap: 16 }]}>
        <StaggeredEntrance index={0}><StatCard icon="flame" label={t('home.streak')} value={`${streak}d`} iconColor={theme.colors.error} /></StaggeredEntrance>
        <StaggeredEntrance index={1}><StatCard icon="today" label={t('home.today')} value={`${todaysLogs.length}/3`} iconColor={theme.colors.primary} /></StaggeredEntrance>
        <StaggeredEntrance index={2}><StatCard icon="analytics" label={t('home.entries')} value={`${sevenDayLogs.length}`} iconColor={theme.colors.secondary} /></StaggeredEntrance>
      </View>

      {isDesktop ? (
        <View style={styles.desktopRow}>
          <View style={{ flex: 1 }}>
            <StaggeredEntrance index={3}>
              <CustomCard glass>
                <Text variant="titleMedium" style={styles.sectionTitle}>{t('home.moodLast7Days')}</Text>
                <WeekChart sevenDayLogs={sevenDayLogs} />
              </CustomCard>
            </StaggeredEntrance>
          </View>
          <View style={{ flex: 1 }}>
            <StaggeredEntrance index={4}>
              <CustomCard glass>
                <Text variant="titleMedium" style={styles.sectionTitle}>{t('home.todaysCheckIns')}</Text>
                {todaysLogs.length === 0 ? (
                  <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.outline }]}>
                    {t('home.noCheckIns')}
                  </Text>
                ) : (
                  todaysLogs.map((log, i) => (
                    <Animated.View
                      key={log.id}
                      entering={FadeInDown.duration(400).delay(300 + i * 100).springify().damping(24).stiffness(160)}
                      style={[styles.logRow, { borderBottomColor: theme.colors.outlineVariant }]}
                    >
                      <View style={styles.logLeft}>
                        <Ionicons
                          name={
                            log.type === 'morning' ? 'sunny-outline'
                            : log.type === 'midday' ? 'cloud-outline'
                            : 'moon-outline'
                          }
                          size={20}
                          color={theme.colors.primary}
                        />
                        <View style={{ marginLeft: 12 }}>
                          <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                            {typeLabels[log.type] || log.type}
                          </Text>
                          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                            {t('home.saved')} {formatTime(log.saved_at)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.logRight}>
                        <MiniPill emoji="😊" value={log.mood_score} color={theme.colors.primary} />
                        <MiniPill emoji="😰" value={log.stress_level} color={theme.colors.tertiary} />
                      </View>
                    </Animated.View>
                  ))
                )}
              </CustomCard>
            </StaggeredEntrance>
          </View>
        </View>
      ) : (
        <>
          <StaggeredEntrance index={3}>
            <CustomCard glass>
              <Text variant="titleMedium" style={styles.sectionTitle}>{t('home.moodLast7Days')}</Text>
              <WeekChart sevenDayLogs={sevenDayLogs} />
            </CustomCard>
          </StaggeredEntrance>

          <StaggeredEntrance index={4}>
            <CustomCard glass>
              <Text variant="titleMedium" style={styles.sectionTitle}>{t('home.todaysCheckIns')}</Text>
              {todaysLogs.length === 0 ? (
                <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.outline }]}>
                  {t('home.noCheckIns')}
                </Text>
              ) : (
                todaysLogs.map((log, i) => (
                  <Animated.View
                    key={log.id}
                    entering={FadeInDown.duration(400).delay(300 + i * 100).springify().damping(24).stiffness(160)}
                    style={[styles.logRow, { borderBottomColor: theme.colors.outlineVariant }]}
                  >
                    <View style={styles.logLeft}>
                      <Ionicons
                        name={
                          log.type === 'morning' ? 'sunny-outline'
                          : log.type === 'midday' ? 'cloud-outline'
                          : 'moon-outline'
                        }
                        size={20}
                        color={theme.colors.primary}
                      />
                      <View style={{ marginLeft: 12 }}>
                        <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                          {typeLabels[log.type] || log.type}
                        </Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                          {t('home.saved')} {formatTime(log.saved_at)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.logRight}>
                      <MiniPill emoji="😊" value={log.mood_score} color={theme.colors.primary} />
                      <MiniPill emoji="😰" value={log.stress_level} color={theme.colors.tertiary} />
                    </View>
                  </Animated.View>
                ))
              )}
            </CustomCard>
          </StaggeredEntrance>
        </>
      )}

      {lastAssessment && (
        <StaggeredEntrance index={5}>
          <CustomCard glass>
            <Text variant="titleMedium" style={styles.sectionTitle}>{t('home.lastQuestionnaire')}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 12 }}>
              {new Date(lastAssessment.timestamp).toLocaleDateString('de-DE', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </Text>
            <View style={styles.assessmentRow}>
              <AssessmentScore label="PHQ-9" value={lastAssessment.phq9_score} max={27} color={theme.colors.primary} />
              <AssessmentScore label="GAD-7" value={lastAssessment.gad7_score} max={21} color={theme.colors.tertiary} />
            </View>
          </CustomCard>
        </StaggeredEntrance>
      )}
      </TabPageTransition>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5 },
  scoreCard: { alignItems: 'center', paddingVertical: 24 },
  scoreCardTitle: { fontWeight: '700', letterSpacing: 1 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  scoreNumber: { fontWeight: '800', lineHeight: 68 },
  scoreBadge: { borderRadius: 100, paddingHorizontal: 16, paddingVertical: 4, marginVertical: 12 },
  scoreBarBg: { width: '100%', height: 8, borderRadius: 100, overflow: 'hidden', marginBottom: 8 },
  scoreBarFill: { height: '100%', borderRadius: 100 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  sectionTitle: { fontWeight: '700', marginBottom: 12 },
  emptyText: { textAlign: 'center', paddingVertical: 16 },
  logRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1,
  },
  logLeft: { flexDirection: 'row', alignItems: 'center' },
  logRight: { flexDirection: 'row', gap: 16 },
  assessmentRow: { flexDirection: 'row', width: '100%' },
  desktopRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
});
