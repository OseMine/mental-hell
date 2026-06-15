import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

function TabBarIconIonicons(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].card,
          borderTopColor: Colors[colorScheme ?? "light"].lightGray,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIconIonicons name="home" color={color} />,
          headerTitle: "Mental Health Tracker",
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: "Heute",
          tabBarIcon: ({ color }) => <TabBarIconIonicons name="heart-circle" color={color} />,
          headerTitle: "Tages-Check-Ins",
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analyse",
          tabBarIcon: ({ color }) => (
            <TabBarIconIonicons name="bar-chart" color={color} />
          ),
          headerTitle: "Analyse & Fragebogen",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Optionen",
          tabBarIcon: ({ color }) => (
            <TabBarIconIonicons name="settings" color={color} />
          ),
          headerTitle: "Einstellungen",
        }}
      />
    </Tabs>
  );
}