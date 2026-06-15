import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { File, Paths } from "expo-file-system/next"; // new API
import { HealthState } from "../store/healthStore";

// ... keep exportHealthDataAsJSON and exportWebJSON unchanged ...

async function exportNativeJSON(
  jsonData: string,
  filename: string,
): Promise<void> {
  try {
    // New File API — write directly to the documents directory
    const file = new File(Paths.document, filename);
    await file.create();
    await file.write(jsonData);

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(file.uri, {
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