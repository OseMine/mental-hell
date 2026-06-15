import Colors from "@/constants/Colors";
import { useHealthStore } from "@/src/store/healthStore";
import { exportHealthDataAsJSON } from "@/src/utils/exporter";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
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
      // Cancel all existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule morning notification (08:00)
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

      // Schedule midday notification (13:00)
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

      // Schedule evening notification (20:00)
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Optionen
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.gray }]}>
            Einstellungen & Datenverwaltung
          </Text>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Datenstatistiken
          </Text>
          <View style={styles.statisticsGrid}>
            {statisticsItems.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.statisticCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.lightGray,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={colors.blue}
                  style={styles.statisticIcon}
                />
                <Text style={[styles.statisticValue, { color: colors.blue }]}>
                  {item.value}
                </Text>
                <Text style={[styles.statisticLabel, { color: colors.gray }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Export Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Daten exportieren
          </Text>

          <TouchableOpacity
            style={[
              styles.settingItem,
              { backgroundColor: colors.card, borderColor: colors.lightGray },
            ]}
            onPress={handleExport}
            disabled={isExporting}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons
                name="download"
                size={24}
                color={colors.blue}
                style={styles.settingIcon}
              />
              <View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  JSON-Datei exportieren
                </Text>
                <Text
                  style={[styles.settingDescription, { color: colors.gray }]}
                >
                  {isExporting
                    ? "Wird exportiert..."
                    : "Lade deine Daten herunter"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>

          <View
            style={[
              styles.infoSection,
              { backgroundColor: "#FFF8E1", borderColor: "#FFE082" },
            ]}
          >
            <Ionicons name="information-circle" size={20} color="#FF9800" />
            <Text style={[styles.infoSectionText, { color: "#333" }]}>
              Kopiere diese Datei in ein LLM deiner Wahl (z.B. Claude, ChatGPT,
              NotebookLM) für eine tiefere KI-Analyse deiner mentalen
              Gesundheitstrends.
            </Text>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Erinnerungen
          </Text>

          <View
            style={[
              styles.notificationItem,
              { backgroundColor: colors.card, borderColor: colors.lightGray },
            ]}
          >
            <View style={styles.notificationItemLeft}>
              <Ionicons
                name="notifications"
                size={24}
                color={colors.blue}
                style={styles.settingIcon}
              />
              <View style={styles.notificationItemContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Tägliche Benachrichtigungen
                </Text>
                <Text
                  style={[styles.settingDescription, { color: colors.gray }]}
                >
                  08:00, 13:00, 20:00 Uhr
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: colors.lightGray, true: colors.green }}
              thumbColor={notificationsEnabled ? colors.green : colors.gray}
              ios_backgroundColor={colors.lightGray}
            />
          </View>

          {Platform.OS === "web" && (
            <View
              style={[
                styles.infoSection,
                { backgroundColor: "#EBF3FF", borderColor: colors.lightGray },
              ]}
            >
              <Ionicons name="alert-circle" size={20} color={colors.blue} />
              <Text style={[styles.infoSectionText, { color: colors.text }]}>
                Web-Benachrichtigungen verwenden das System zur Anzeige von
                Browserbenachrichtigungen. Stelle sicher, dass
                Benachrichtigungen für diese Website in deinen
                Browser-Einstellungen aktiviert sind.
              </Text>
            </View>
          )}
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Datenverwaltung
          </Text>

          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: colors.red,
                opacity: 0.1,
                borderColor: colors.red,
              },
            ]}
            onPress={handleClearAllData}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons
                name="trash"
                size={24}
                color={colors.red}
                style={styles.settingIcon}
              />
              <View>
                <Text style={[styles.settingTitle, { color: colors.red }]}>
                  Alle Daten löschen
                </Text>
                <Text
                  style={[styles.settingDescription, { color: colors.gray }]}
                >
                  Permanente Löschung aller Einträge
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.red} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Über diese App
          </Text>

          <View
            style={[
              styles.infoSection,
              { backgroundColor: colors.card, borderColor: colors.lightGray },
            ]}
          >
            <Ionicons name="information-circle" size={20} color={colors.blue} />
            <View style={styles.aboutContent}>
              <Text style={[styles.aboutTitle, { color: colors.text }]}>
                Mental Health Tracker
              </Text>
              <Text style={[styles.aboutVersion, { color: colors.gray }]}>
                Version 1.0.0
              </Text>
              <Text style={[styles.aboutDescription, { color: colors.gray }]}>
                Eine App zur Verfolgung deiner psychischen Gesundheit mit PHQ-9
                und GAD-7 Fragebögen. Die Daten werden lokal auf deinem Gerät
                gespeichert.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  statisticsGrid: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  statisticCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  statisticIcon: {
    marginBottom: 6,
  },
  statisticValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  statisticLabel: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    marginRight: 4,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    fontWeight: "400",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  notificationItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  notificationItemContent: {
    flex: 1,
  },
  infoSection: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 12,
    marginTop: 10,
  },
  infoSectionText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
  },
  aboutContent: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  aboutVersion: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
  },
  aboutDescription: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  spacing: {
    height: 20,
  },
});
