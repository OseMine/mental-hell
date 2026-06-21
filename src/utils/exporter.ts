import * as Sharing from "expo-sharing";
import { Paths, File, Directory } from "expo-file-system";
import { Platform } from "react-native";
import type { DailyLog, WeeklyAssessment } from "../store/healthStore";

interface ExportPayload {
  dailyLogs: DailyLog[];
  weeklyAssessments: WeeklyAssessment[];
}

function buildExportJSON(payload: ExportPayload): string {
  const dailyLogs = payload.dailyLogs
    .slice()
    .sort((a, b) => a.saved_at - b.saved_at);

  const weeklyAssessments = payload.weeklyAssessments
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp);

  const exportData = {
    exportDate: new Date().toISOString(),
    totalDailyLogs: dailyLogs.length,
    totalWeeklyAssessments: weeklyAssessments.length,
    dateRange:
      dailyLogs.length > 0
        ? {
            from: new Date(dailyLogs[0].saved_at).toISOString(),
            to: new Date(dailyLogs[dailyLogs.length - 1].saved_at).toISOString(),
          }
        : null,
    dailyLogs: dailyLogs.map((log) => ({
      id: log.id,
      type: log.type,
      mood_score: log.mood_score,
      stress_level: log.stress_level,
      notes: log.notes,
      scheduled_time: log.scheduled_time,
      opened_at: new Date(log.opened_at).toISOString(),
      saved_at: new Date(log.saved_at).toISOString(),
    })),
    weeklyAssessments: weeklyAssessments.map((a) => ({
      id: a.id,
      date: new Date(a.timestamp).toISOString(),
      phq9_score: a.phq9_score,
      gad7_score: a.gad7_score,
      total_wellbeing_score: a.total_wellbeing_score,
      interpretation: {
        phq9:
          a.phq9_score <= 4
            ? "minimal"
            : a.phq9_score <= 9
              ? "mild"
              : a.phq9_score <= 14
                ? "moderate"
                : a.phq9_score <= 19
                  ? "moderately severe"
                  : "severe",
        gad7:
          a.gad7_score <= 4
            ? "minimal"
            : a.gad7_score <= 9
              ? "mild"
              : a.gad7_score <= 14
                ? "moderate"
                : "severe",
      },
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

function generateFilename(): string {
  const timestamp = Date.now();
  return `mental_health_export_${timestamp}.json`;
}

function exportWebJSON(jsonData: string, filename: string): void {
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportNativeJSON(
  jsonData: string,
  filename: string,
): Promise<void> {
  try {
    const targetDir = new Directory(Paths.document, "exports");
    targetDir.create({ intermediates: true, idempotent: true });

    const targetFile = new File(targetDir, filename);
    if (targetFile.exists) {
      targetFile.delete();
    }

    targetFile.write(jsonData);

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(targetFile.uri, {
        mimeType: "application/json",
        dialogTitle: "Export Mental Health Data",
      });
    } else {
      console.warn("Sharing not available on this device");
    }
  } catch (error) {
    console.error("Native export failed:", error);
    throw new Error("Failed to export data on native platform");
  }
}

export async function exportHealthDataAsJSON(
  payload: ExportPayload,
): Promise<void> {
  const jsonData = buildExportJSON(payload);
  const filename = generateFilename();

  if (Platform.OS === "web") {
    exportWebJSON(jsonData, filename);
  } else {
    await exportNativeJSON(jsonData, filename);
  }
}