import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Tabs } from "expo-router";
import React from "react";
import { MD3Theme, useTheme } from "react-native-paper";
import { FrostedTabBar } from "@/src/components/FrostedTabBar";
import { useTranslation } from "@/src/i18n/useTranslation";

export default function TabLayout() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <FrostedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          color: theme.colors.onSurface,
          fontWeight: "700",
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          headerTitle: t('headers.homeTitle'),
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: t('tabs.today'),
          headerTitle: t('headers.todayTitle'),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: t('journal.title'),
          headerTitle: t('journal.title'),
        }}
      />
      <Tabs.Screen
        name="science"
        options={{
          title: t('science.title'),
          headerTitle: t('science.title'),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: t('tabs.analytics'),
          headerTitle: t('headers.analyticsTitle'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          headerTitle: t('headers.settingsTitle'),
        }}
      />
    </Tabs>
  );
}
