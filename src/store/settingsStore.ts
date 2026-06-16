// src/store/settingsStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware"; // 1. createJSONStorage importieren

interface SettingsState {
  language: string;
  accentColor: string;
  colorScheme: "light" | "dark" | "system";
  onboardingDone: boolean;
  setLanguage: (lang: string) => void;
  setAccentColor: (color: string) => void;
  setColorScheme: (scheme: "light" | "dark" | "system") => void;
  finishOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "de",
      accentColor: "#6750A4",
      colorScheme: "system",
      onboardingDone: false,
      setLanguage: (lang) => set({ language: lang }),
      setAccentColor: (color) => set({ accentColor: color }),
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      finishOnboarding: () => set({ onboardingDone: true }),
    }),
    {
      name: "settings",
      // 2. Nutze createJSONStorage, um AsyncStorage sauber für Zustand zu wrappen
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
