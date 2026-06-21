import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storageAdapter = Platform.select({
  web: {
    getItem: async (name: string) => await AsyncStorage.getItem(name),
    setItem: async (name: string, value: string) => await AsyncStorage.setItem(name, value),
    removeItem: async (name: string) => await AsyncStorage.removeItem(name),
  },
  default: {
    getItem: async (name: string) => await SecureStore.getItemAsync(name),
    setItem: async (name: string, value: string) => await SecureStore.setItemAsync(name, value),
    removeItem: async (name: string) => await SecureStore.deleteItemAsync(name),
  },
});

export interface DailyLog {
  id: string;
  type: "morning" | "midday" | "evening";
  mood_score: number;
  stress_level: number;
  notes: string;
  scheduled_time: string;  // e.g. "08:00"
  opened_at: number;       // unix ms — when user expanded the form
  saved_at: number;        // unix ms — when user pressed Save
  weather?: string;        // weather condition description
  activity?: string;       // activity level or type
}

export interface WeeklyAssessment {
  id: string;
  timestamp: number;
  phq9_score: number;
  gad7_score: number;
  total_wellbeing_score: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood_score: number;
  created_at: number;
  updated_at: number;
  tags: string[];
}

export interface HealthState {
  dailyLogs: DailyLog[];
  weeklyAssessments: WeeklyAssessment[];
  journalEntries: JournalEntry[];
  todos: TodoItem[];
  addDailyLog: (log: Omit<DailyLog, "id">) => void;
  addWeeklyAssessment: (assessment: Omit<WeeklyAssessment, "id">) => void;
  clearAllData: () => void;
  getDailyLogsByType: (type: DailyLog["type"]) => DailyLog | undefined;
  getTodaysLogs: () => DailyLog[];
  getLastSevenDaysLogs: () => DailyLog[];
  getLastWeeklyAssessment: () => WeeklyAssessment | undefined;
  deleteDailyLog: (id: string) => void;
  getStreak: () => number;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "created_at" | "updated_at">) => void;
  updateJournalEntry: (id: string, data: Partial<Pick<JournalEntry, "title" | "content" | "mood_score" | "tags">>) => void;
  deleteJournalEntry: (id: string) => void;
  getJournalEntry: (id: string) => JournalEntry | undefined;
  getJournalEntries: () => JournalEntry[];
  getTodosForToday: () => TodoItem[];
  addTodo: (todo: Omit<TodoItem, "id" | "created_at">) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  created_at: number;
  date: string; // date string for which day it belongs to
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      dailyLogs: [],
      weeklyAssessments: [],
      journalEntries: [],
      todos: [],

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

      clearAllData: () => set({ dailyLogs: [], weeklyAssessments: [], journalEntries: [], todos: [] }),

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

      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [
            {
              id: `journal_${Date.now()}_${Math.random()}`,
              created_at: Date.now(),
              updated_at: Date.now(),
              ...entry,
            },
            ...state.journalEntries,
          ],
        })),

      updateJournalEntry: (id, data) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((e) =>
            e.id === id ? { ...e, ...data, updated_at: Date.now() } : e
          ),
        })),

      deleteJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter((e) => e.id !== id),
        })),

      getJournalEntry: (id) => get().journalEntries.find((e) => e.id === id),

      getJournalEntries: () =>
        get().journalEntries.slice().sort((a, b) => b.created_at - a.created_at),

      getTodosForToday: () => {
        const todayStr = new Date().toDateString();
        return get().todos?.filter((t) => t.date === todayStr) ?? [];
      },

      addTodo: (todo) =>
        set((state) => ({
          todos: [
            ...(state.todos ?? []),
            { id: `todo_${Date.now()}_${Math.random()}`, created_at: Date.now(), ...todo },
          ],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: (state.todos ?? []).map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: (state.todos ?? []).filter((t) => t.id !== id),
        })),
    }),
    {
      name: "mental-health-store",
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);