import { useHealthStore } from "@/src/store/healthStore";
import { exportHealthDataAsJSON } from "@/src/utils/exporter";
import { Background } from "@/src/widgets/Background";
import { CustomCard } from "@/src/widgets/CustomCard";
import { InfoBox } from "@/src/widgets/InfoBox";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { MD3Theme, Text, useTheme } from "react-native-paper";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function SettingsScreen() {
  const theme = useTheme() as MD3Theme;
  const { dailyLogs, weeklyAssessments, clearAllData } = useHealthStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Check notification permissions on mount
  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    if (Platform.OS === "web") {
      setNotificationsEnabled(false);
      return;
    }

    const permissions = await Notifications.getPermissionsAsync();
    const isGranted = permissions.granted || permissions.android?.granted;
    setNotificationsEnabled(!!isGranted);
  };

  const handleNotificationsToggle = async () => {
    if (Platform.OS === "web") {
      console.log("Web-Push aktiviert (in Systembenachrichtigungen)");
      Alert.alert(
        "Web-Benachrichtigungen",
        "Web-Benachrichtigungen sind in Ihrem Browser aktiviert. Sie erhalten Erinnerungen um 08:00, 13:00 und 20:00 Uhr.",
      );
      return;
    }

    if (!notificationsEnabled) {
      // Request permissions
      const permissions = await Notifications.requestPermissionsAsync();
      const isGranted = permissions.granted || permissions.android?.granted;
      if (isGranted) {
        setNotificationsEnabled(true);
        scheduleNotifications();
        Alert.alert("Erfolg", "Benachrichtigungen aktiviert");
      } else {
        Alert.alert("Fehler", "Berechtigung für Benachrichtigungen verweigert");
      }
    } else {
      setNotificationsEnabled(false);
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert("Erfolg", "Benachrichtigungen deaktiviert");
    }
  };

  const scheduleNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Morning notification (08:00)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Mental Health Check-In",
          body: "Zeit für deinen Morgen-Check! Wie geht es dir heute?",
          sound: true,
          priority: "high",
        },
        trigger: {
          type: "calendar" as any,
          hour: 8,
          minute: 0,
          repeats: true,
        },
      });

      // Midday notification (13:00)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Mental Health Check-In",
          body: "Mittags-Check: Wie verläuft dein Tag bisher?",
          sound: true,
          priority: "high",
        },
        trigger: {
          type: "calendar" as any,
          hour: 13,
          minute: 0,
          repeats: true,
        },
      });

      // Evening notification (20:00)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Mental Health Check-In",
          body: "Abend-Check: Reflektiere über deinen heutigen Tag.",
          sound: true,
          priority: "high",
        },
        trigger: {
          type: "calendar" as any,
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error("Failed to schedule notifications:", error);
    }
  };

  const handleExport = async () => {
    if (dailyLogs.length === 0 && weeklyAssessments.length === 0) {
      Alert.alert("Keine Daten", "Es gibt keine Daten zum Exportieren.");
      return;
    }

    setIsExporting(true);
    try {
      await exportHealthDataAsJSON({
        dailyLogs,
        weeklyAssessments,
      });
      Alert.alert("Export erfolgreich", "Deine Daten wurden exportiert.");
    } catch (error) {
      Alert.alert(
        "Export fehlgeschlagen",
        "Es gab ein Problem beim Exportieren deiner Daten.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Alle Daten löschen?",
      "Diese Aktion kann nicht rückgängig gemacht werden. Bitte exportiere deine Daten vorher.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: () => {
            clearAllData();
            Alert.alert("Erfolg", "Alle Daten wurden gelöscht.");
          },
        },
      ],
    );
  };

  const statisticsItems = [
    {
      label: "Tägliche Einträge",
      value: dailyLogs.length,
      icon: "checkmark-circle",
    },
    {
      label: "Wöchentliche Bewertungen",
      value: weeklyAssessments.length,
      icon: "calendar",
    },
  ];

  return (
    <Background scrollable={true}>
      <View style={styles.header}>
        <Text
          variant="headlineLarge"
          style={[styles.headerTitle, { color: theme.colors.onBackground }]}
        >
          Optionen
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          Einstellungen & Datenverwaltung
        </Text>
      </View>

      {/* Statistics Section */}
      <View style={styles.section}>
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          Datenstatistiken
        </Text>
        <View style={styles.statisticsGrid}>
          {statisticsItems.map((item, index) => (
            <CustomCard key={index} style={styles.statisticCard}>
              <Ionicons
                name={item.icon as any}
                size={22}
                color={theme.colors.primary}
                style={styles.statisticIcon}
              />
              <Text
                variant="headlineSmall"
                style={[styles.statisticValue, { color: theme.colors.primary }]}
              >
                {item.value}
              </Text>
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.outline, textAlign: "center" }}
              >
                {item.label}
              </Text>
            </CustomCard>
          ))}
        </View>
      </View>

      {/* Export Section */}
      <View style={styles.section}>
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          Daten exportieren
        </Text>

        <TouchableOpacity onPress={handleExport} disabled={isExporting}>
          <CustomCard style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Ionicons
                name="download"
                size={22}
                color={theme.colors.primary}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContent}>
                <Text
                  variant="bodyLarge"
                  style={{ fontWeight: "600", color: theme.colors.onSurface }}
                >
                  JSON-Datei exportieren
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.outline }}
                >
                  {isExporting
                    ? "Wird exportiert..."
                    : "Lade deine Daten herunter"}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.outline}
            />
          </CustomCard>
        </TouchableOpacity>

        <View style={styles.infoSpacing}>
          <InfoBox text="Kopiere diese Datei in ein LLM deiner Wahl (z.B. Claude, ChatGPT, NotebookLM) für eine tiefere KI-Analyse deiner mentalen Gesundheitstrends." />
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          Erinnerungen
        </Text>

        <CustomCard style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Ionicons
              name="notifications"
              size={22}
              color={theme.colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingTextContent}>
              <Text
                variant="bodyLarge"
                style={{ fontWeight: "600", color: theme.colors.onSurface }}
              >
                Tägliche Benachrichtigungen
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                08:00, 13:00, 20:00 Uhr
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{
              false: theme.colors.surfaceVariant,
              true: theme.colors.primary,
            }}
            thumbColor={
              notificationsEnabled
                ? theme.colors.onPrimary
                : theme.colors.outline
            }
            ios_backgroundColor={theme.colors.surfaceVariant}
          />
        </CustomCard>

        {Platform.OS === "web" && (
          <View style={styles.infoSpacing}>
            <InfoBox text="Web-Benachrichtigungen verwenden das System zur Anzeige von Browserbenachrichtigungen. Stelle sicher, dass Benachrichtigungen für diese Website in deinen Browser-Einstellungen aktiviert sind." />
          </View>
        )}
      </View>

      {/* Data Management Section */}
      <View style={styles.section}>
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          Datenverwaltung
        </Text>

        <TouchableOpacity onPress={handleClearAllData}>
          <CustomCard
            style={[
              styles.settingItem,
              {
                backgroundColor: `${theme.colors.error}14`, // ~8% Opacity Hex
                borderColor: theme.colors.errorVariant || theme.colors.error,
              },
            ]}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons
                name="trash"
                size={22}
                color={theme.colors.error}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContent}>
                <Text
                  variant="bodyLarge"
                  style={{ fontWeight: "600", color: theme.colors.error }}
                >
                  Alle Daten löschen
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.outline }}
                >
                  Permanente Löschung aller Einträge
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.error}
            />
          </CustomCard>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          Über diese App
        </Text>

        <CustomCard style={styles.aboutCard}>
          <View style={styles.aboutHeaderRow}>
            <Ionicons
              name="information-circle"
              size={22}
              color={theme.colors.primary}
            />
            <View style={styles.settingTextContent}>
              <Text
                variant="bodyLarge"
                style={{ fontWeight: "700", color: theme.colors.onSurface }}
              >
                Mental Hell
              </Text>
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.outline, marginTop: 1 }}
              >
                Version 1.0.0
              </Text>
            </View>
          </View>
          <Text
            variant="bodyMedium"
            style={[
              styles.aboutDescription,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Eine App zur Verfolgung deiner psychischen Gesundheit mit PHQ-9 und
            GAD-7 Fragebögen. Die Daten werden verschlüsselt und lokal auf
            deinem Gerät gespeichert.
          </Text>
        </CustomCard>
      </View>

      <View style={styles.spacing} />
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },
  statisticsGrid: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  statisticCard: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  statisticIcon: {
    marginBottom: 4,
  },
  statisticValue: {
    fontWeight: "800",
    marginBottom: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    alignSelf: "center",
  },
  settingTextContent: {
    flex: 1,
  },
  infoSpacing: {
    marginTop: 10,
  },
  aboutCard: {
    padding: 14,
  },
  aboutHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  aboutDescription: {
    lineHeight: 18,
  },
  spacing: {
    height: 24,
  },
});
