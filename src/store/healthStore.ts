import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const secureStoreAdapter = {
  getItem: async (name: string) => await SecureStore.getItemAsync(name),
  setItem: async (name: string, value: string) => await SecureStore.setItemAsync(name, value),
  removeItem: async (name: string) => await SecureStore.deleteItemAsync(name),
};

export interface DailyLog {
  id: string;
  type: "morning" | "midday" | "evening";
  mood_score: number;
  stress_level: number;
  notes: string;
  scheduled_time: string;  // e.g. "08:00"
  opened_at: number;       // unix ms — when user expanded the form
  saved_at: number;        // unix ms — when user pressed Save
}

export interface WeeklyAssessment {
  id: string;
  timestamp: number;
  phq9_score: number;
  gad7_score: number;
  total_wellbeing_score: number;
}

export interface HealthState {
  dailyLogs: DailyLog[];
  weeklyAssessments: WeeklyAssessment[];
  addDailyLog: (log: Omit<DailyLog, "id">) => void;
  addWeeklyAssessment: (assessment: Omit<WeeklyAssessment, "id">) => void;
  clearAllData: () => void;
  getDailyLogsByType: (type: DailyLog["type"]) => DailyLog | undefined;
  getTodaysLogs: () => DailyLog[];
  getLastSevenDaysLogs: () => DailyLog[];
  getLastWeeklyAssessment: () => WeeklyAssessment | undefined;
  deleteDailyLog: (id: string) => void;
  getStreak: () => number;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      dailyLogs: [],
      weeklyAssessments: [],

      addDailyLog: (log) =>
        set((state) => ({
          dailyLogs: [
            ...state.dailyLogs,
            { id: `log_${Date.now()}_${Math.random()}`, ...log },
          ],
        })),

      addWeeklyAssessment: (assessment) =>
        set((state) => ({
          weeklyAssessments: [
            ...state.weeklyAssessments,
            { id: `assessment_${Date.now()}_${Math.random()}`, ...assessment },
          ],
        })),

      clearAllData: () => set({ dailyLogs: [], weeklyAssessments: [] }),

      getDailyLogsByType: (type) => {
        const todayStr = new Date().toDateString();
        return get().dailyLogs.find(
          (log) =>
            log.type === type &&
            new Date(log.saved_at).toDateString() === todayStr
        );
      },

      getTodaysLogs: () => {
        const todayStr = new Date().toDateString();
        return get().dailyLogs.filter(
          (log) => new Date(log.saved_at).toDateString() === todayStr
        );
      },

      getLastSevenDaysLogs: () => {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return get()
          .dailyLogs.filter((log) => log.saved_at >= sevenDaysAgo)
          .sort((a, b) => a.saved_at - b.saved_at);
      },

      getLastWeeklyAssessment: () => {
        const { weeklyAssessments } = get();
        return weeklyAssessments.length > 0
          ? weeklyAssessments[weeklyAssessments.length - 1]
          : undefined;
      },

      deleteDailyLog: (id) =>
        set((state) => ({
          dailyLogs: state.dailyLogs.filter((log) => log.id !== id),
        })),

      getStreak: () => {
        const logs = get().dailyLogs;
        if (logs.length === 0) return 0;
        const days = new Set(
          logs.map((log) => new Date(log.saved_at).toDateString())
        );
        let streak = 0;
        const cursor = new Date();
        while (days.has(cursor.toDateString())) {
          streak++;
          cursor.setDate(cursor.getDate() - 1);
        }
        return streak;
      },
    }),
    {
      name: "mental-health-store",
      storage: createJSONStorage(() => secureStoreAdapter),
    }
  )
);