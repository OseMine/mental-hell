import { useHealthStore } from "@/src/store/healthStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { exportHealthDataAsJSON } from "@/src/utils/exporter";
import { Background } from "@/src/widgets/Background";
import { CustomCard } from "@/src/widgets/CustomCard";
import { TabPageTransition } from "@/src/components/TabPageTransition";
import { SettingsSection } from "@/src/components/SettingsSection";
import { useTranslation } from "@/src/i18n/useTranslation";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, useTheme, MD3Theme } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { LanguageSection } from "@/src/components/LanguageSection";
import { AppearanceSection } from "@/src/components/AppearanceSection";
import { StatisticsSection } from "@/src/components/StatisticsSection";
import { ExportSection } from "@/src/components/ExportSection";
import { NotificationSection } from "@/src/components/NotificationSection";
import { DataManagementSection } from "@/src/components/DataManagementSection";
import { AboutSection } from "@/src/components/AboutSection";
import { useResponsive } from "@/src/utils/responsive";
import {
  checkNotificationPermissions,
  requestNotificationPermissions,
  scheduleDailyNotifications,
  cancelAllNotifications,
} from "@/src/utils/notifications";

export default function SettingsScreen() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();
  const { dailyLogs, weeklyAssessments, clearAllData } = useHealthStore();
  const {
    language,
    setLanguage,
    accentColor,
    setAccentColor,
    colorScheme,
    setColorScheme,
  } = useSettingsStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      const granted = await checkNotificationPermissions();
      setNotificationsEnabled(granted);
    })();
  }, []);

  const handleNotificationsToggle = async () => {
    if (Platform.OS === "web") {
      Alert.alert(
        t('settings.webNotifications'),
        t('settings.webNotificationsMsg'),
      );
      return;
    }

    if (!notificationsEnabled) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        setNotificationsEnabled(true);
        await scheduleDailyNotifications();
        Alert.alert(t('common.success'), t('settings.notificationsEnabled'));
      } else {
        Alert.alert(t('common.error'), t('settings.permissionDenied'));
      }
    } else {
      setNotificationsEnabled(false);
      await cancelAllNotifications();
      Alert.alert(t('common.success'), t('settings.notificationsDisabled'));
    }
  };

  const handleExport = async () => {
    if (dailyLogs.length === 0 && weeklyAssessments.length === 0) {
      Alert.alert(t('settings.noData'), t('settings.noDataMsg'));
      return;
    }

    setIsExporting(true);
    try {
      await exportHealthDataAsJSON({ dailyLogs, weeklyAssessments });
      Alert.alert(t('settings.exportSuccess'), t('settings.exportSuccessMsg'));
    } catch {
      Alert.alert(t('settings.exportFailed'), t('settings.exportFailedMsg'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      t('settings.clearConfirmTitle'),
      t('settings.clearConfirmMsg'),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('common.delete'),
          style: "destructive",
          onPress: () => {
            clearAllData();
            Alert.alert(t('common.success'), t('settings.dataCleared'));
          },
        },
      ],
    );
  };

  const statisticsItems = [
    { label: t('settings.dailyEntries'), value: dailyLogs.length, icon: "checkmark-circle" as const },
    { label: t('settings.weeklyAssessments'), value: weeklyAssessments.length, icon: "calendar" as const },
  ];

  return (
    <Background scrollable={true}>
      <TabPageTransition>
      <View style={styles.header}>
        <Text
          variant="headlineLarge"
          style={[styles.headerTitle, { color: theme.colors.onBackground }]}
        >
          {t('headers.settingsHeader')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          {t('settings.subtitle')}
        </Text>
      </View>

      {isDesktop ? (
        <>
          <View style={styles.desktopRow}>
            <View style={{ flex: 1 }}>
              <Animated.View entering={FadeInDown.duration(500).springify().damping(22).stiffness(180)}>
                <LanguageSection theme={theme} language={language} onLanguageChange={(lang) => { setLanguage(lang); }} />
              </Animated.View>
            </View>
            <View style={{ flex: 1 }}>
              <Animated.View entering={FadeInDown.duration(500).delay(60).springify().damping(22).stiffness(180)}>
                <AppearanceSection
                  theme={theme}
                  accentColor={accentColor}
                  colorScheme={colorScheme}
                  onAccentColorChange={setAccentColor}
                  onColorSchemeChange={setColorScheme}
                />
              </Animated.View>
            </View>
          </View>
          <View style={styles.desktopRow}>
            <View style={{ flex: 1 }}>
              <Animated.View entering={FadeInDown.duration(500).delay(120).springify().damping(22).stiffness(180)}>
                <StatisticsSection theme={theme} items={statisticsItems} />
              </Animated.View>
            </View>
            <View style={{ flex: 1 }}>
              <Animated.View entering={FadeInDown.duration(500).delay(180).springify().damping(22).stiffness(180)}>
                <ExportSection theme={theme} isExporting={isExporting} onExport={handleExport} />
              </Animated.View>
            </View>
          </View>
          <View style={styles.desktopRow}>
            <View style={{ flex: 1 }}>
              <Animated.View entering={FadeInDown.duration(500).delay(240).springify().damping(22).stiffness(180)}>
                <NotificationSection
                  theme={theme}
                  notificationsEnabled={notificationsEnabled}
                  onToggle={handleNotificationsToggle}
                />
              </Animated.View>
            </View>
            <View style={{ flex: 1 }}>
              <Animated.View entering={FadeInDown.duration(500).delay(300).springify().damping(22).stiffness(180)}>
                <DataManagementSection theme={theme} onClearAllData={handleClearAllData} />
              </Animated.View>
            </View>
          </View>
          <Animated.View entering={FadeInDown.duration(500).delay(360).springify().damping(22).stiffness(180)}>
            <SettingsSection title="Tools" theme={theme}>
              <TouchableOpacity onPress={() => router.push('/screens/ai-chat')}>
                <CustomCard glass style={styles.toolCard}>
                  <Ionicons name="chatbubbles" size={22} color={theme.colors.primary} />
                  <View style={styles.toolText}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                      AI Chat
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      Free AI assistant for mental health insights
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
                </CustomCard>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/screens/therapist-report')}>
                <CustomCard glass style={styles.toolCard}>
                  <Ionicons name="medical" size={22} color={theme.colors.primary} />
                  <View style={styles.toolText}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                      {t('therapist.title')}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      {t('therapist.subtitle')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
                </CustomCard>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)/science')}>
                <CustomCard glass style={styles.toolCard}>
                  <Ionicons name="flask" size={22} color={theme.colors.primary} />
                  <View style={styles.toolText}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                      {t('science.title')}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      {t('science.subtitle')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
                </CustomCard>
              </TouchableOpacity>
            </SettingsSection>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(420).springify().damping(22).stiffness(180)}>
            <AboutSection theme={theme} />
          </Animated.View>
        </>
      ) : (
        <>
          <Animated.View entering={FadeInDown.duration(500).springify().damping(22).stiffness(180)}>
            <LanguageSection theme={theme} language={language} onLanguageChange={(lang) => { setLanguage(lang); }} />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(60).springify().damping(22).stiffness(180)}>
            <AppearanceSection
              theme={theme}
              accentColor={accentColor}
              colorScheme={colorScheme}
              onAccentColorChange={setAccentColor}
              onColorSchemeChange={setColorScheme}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(120).springify().damping(22).stiffness(180)}>
            <StatisticsSection theme={theme} items={statisticsItems} />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(180).springify().damping(22).stiffness(180)}>
            <ExportSection theme={theme} isExporting={isExporting} onExport={handleExport} />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(240).springify().damping(22).stiffness(180)}>
            <NotificationSection
              theme={theme}
              notificationsEnabled={notificationsEnabled}
              onToggle={handleNotificationsToggle}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(300).springify().damping(22).stiffness(180)}>
            <DataManagementSection theme={theme} onClearAllData={handleClearAllData} />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(360).springify().damping(22).stiffness(180)}>
            <SettingsSection title="Tools" theme={theme}>
              <TouchableOpacity onPress={() => router.push('/screens/ai-chat')}>
                <CustomCard glass style={styles.toolCard}>
                  <Ionicons name="chatbubbles" size={22} color={theme.colors.primary} />
                  <View style={styles.toolText}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                      AI Chat
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      Free AI assistant for mental health insights
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
                </CustomCard>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/screens/therapist-report')}>
                <CustomCard glass style={styles.toolCard}>
                  <Ionicons name="medical" size={22} color={theme.colors.primary} />
                  <View style={styles.toolText}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                      {t('therapist.title')}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      {t('therapist.subtitle')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
                </CustomCard>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)/science')}>
                <CustomCard glass style={styles.toolCard}>
                  <Ionicons name="flask" size={22} color={theme.colors.primary} />
                  <View style={styles.toolText}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                      {t('science.title')}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      {t('science.subtitle')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
                </CustomCard>
              </TouchableOpacity>
            </SettingsSection>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(420).springify().damping(22).stiffness(180)}>
            <AboutSection theme={theme} />
          </Animated.View>
        </>
      )}

      <View style={styles.spacing} />
      </TabPageTransition>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  headerTitle: { fontWeight: "800", letterSpacing: -0.5, marginBottom: 2 },
  spacing: { height: 24 },
  desktopRow: { flexDirection: 'row', gap: 16, marginBottom: 0 },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  toolText: { flex: 1 },
});
