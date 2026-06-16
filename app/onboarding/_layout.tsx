import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useSettingsStore } from "../../src/store/settingsStore";

export default function OnboardingLayout() {
  const { colorScheme } = useSettingsStore();
  const systemColorScheme = useColorScheme();
  const isDark = colorScheme === "dark" || (colorScheme === "system" && systemColorScheme === "dark");

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
