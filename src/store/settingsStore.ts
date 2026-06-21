import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  language: string;
  accentColor: string;
  colorScheme: "light" | "dark" | "system" | "pitch-black";
  onboardingDone: boolean;
  setLanguage: (lang: string) => void;
  setAccentColor: (color: string) => void;
  setColorScheme: (scheme: "light" | "dark" | "system" | "pitch-black") => void;
  finishOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "auto",
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
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
