import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSettingsStore } from "../../src/store/settingsStore";

export default function OnboardingLayout() {
  const { colorScheme } = useSettingsStore();
  const isDark = colorScheme === "dark";

  return (
    <>
      {/* Setzt die Statusleisten-Icons passend zum gewählten Farbschema */}
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right", // Sanfter, nativer Übergang beim Routenwechsel
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
