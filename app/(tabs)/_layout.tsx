import React from "react";
import { Tabs } from "expo-router";
import { useTheme, MD3Theme } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// Ein zentraler, wiederverwendbarer Tab-Bar-Icon-Renderer
function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>["name"]; color: string }) {
  return <Ionicons size={24} name={name} color={color} style={{ marginBottom: -3 }} />;
}

export default function TabLayout() {
  const theme = useTheme() as MD3Theme;

  return (
    <Tabs
      screenOptions={{
        // Nutzt die primäre Markenfarbe von MD3 für den aktiven Zustand
        tabBarActiveTintColor: theme.colors.primary,
        // Nutzt die dezente Outline-Farbe für inaktive Tabs
        tabBarInactiveTintColor: theme.colors.outline,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          // Hintergrund- und Trennlinienfarben direkt aus dem globalen MD3-Theme
          backgroundColor: theme.colors.elevation.level2, 
          borderTopColor: theme.colors.surfaceVariant,
          elevation: 8, // Subtiler Schatten für Android
          shadowOpacity: 0.1, // Subtiler Schatten für iOS
        },
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
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitle: "Mental Health Tracker",
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: "Heute",
          tabBarIcon: ({ color }) => <TabBarIcon name="heart-circle" color={color} />,
          headerTitle: "Tages-Check-Ins",
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analyse",
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
          headerTitle: "Analyse & Fragebogen",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Optionen",
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
          headerTitle: "Einstellungen",
        }}
      />
    </Tabs>
  );
}