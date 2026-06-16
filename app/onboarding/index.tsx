import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useMaterial3Theme } from "react-native-material3-theme";
import {
    Button,
    Card,
    RadioButton,
    Switch,
    Text,
    useTheme,
} from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSettingsStore } from "../../src/store/settingsStore";

// Die definierten Schritte durch den Onboarding-Prozess
const STEPS = [
  "language",
  "theme_color",
  "dark_mode",
  "notifications",
  "welcome",
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  // Holt das aktuelle MD3-Theme von React Native Paper
  const paperTheme = useTheme();
  // Methode zum Updaten des dynamischen Material You Themes
  const { updateTheme } = useMaterial3Theme();

  // Zustand Store-Anbindung
  const {
    language,
    setLanguage,
    accentColor,
    setAccentColor,
    colorScheme,
    setColorScheme,
    finishOnboarding,
  } = useSettingsStore();

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Onboarding abschließen, persistieren & umleiten
      finishOnboarding();
      router.replace("/(tabs)");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  // Trigger für Expo Notifications System-Dialog
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      // Optional: Hier ein Fallback-UI einblenden, falls abgelehnt
    }
    // Nach der Entscheidung automatisch weiter zum nächsten Schritt
    handleNext();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: paperTheme.colors.background },
      ]}
    >
      {/* Progress Bar (Oben) */}
      <View style={styles.progressContainer}>
        {STEPS.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.progressBar,
              {
                backgroundColor:
                  idx <= step
                    ? paperTheme.colors.primary
                    : paperTheme.colors.surfaceVariant,
              },
            ]}
          />
        ))}
      </View>

      {/* Interaktiver Step-Content */}
      <View style={styles.stepContainer}>
        {/* Schritt 1: Sprachauswahl */}
        {STEPS[step] === "language" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              Sprache wählen
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Wähle deine bevorzugte Sprache für das Interface.
            </Text>

            <RadioButton.Group
              onValueChange={(value) => setLanguage(value)}
              value={language}
            >
              <RadioButton.Item label="Deutsch" value="de" />
              <RadioButton.Item label="English" value="en" />
            </RadioButton.Group>
          </Animated.View>
        )}

        {/* Schritt 2: Material 3 Theme / Akzentfarbe */}
        {STEPS[step] === "theme_color" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              Deine Akzentfarbe
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Individualisiere das Interface mit einer Primärfarbe.
            </Text>

            <View style={styles.colorPalette}>
              {["#6750A4", "#2E7D32", "#C62828", "#0288D1", "#F57C00"].map(
                (color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => {
                        setAccentColor(color);
                        updateTheme(color);
                    }}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color },
                      accentColor === color && styles.colorSwatchSelected,
                    ]}
                  />
                ),
              )}
            </View>
          </Animated.View>
        )}

        {/* Schritt 3: Helles / Dunkles Design */}
        {STEPS[step] === "dark_mode" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              Erscheinungsbild
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Nutze ein helles oder dunkles Design für deine Augen.
            </Text>

            <Card style={styles.card} mode="outlined">
              <Card.Content style={styles.switchRow}>
                <Text variant="bodyLarge">Dunkles Design (Dark Mode)</Text>
                <Switch
                  value={colorScheme === "dark"}
                  onValueChange={(val) =>
                    setColorScheme(val ? "dark" : "light")
                  }
                />
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Schritt 4: Push-Notifications */}
        {STEPS[step] === "notifications" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              Erinnerungen
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Erlaube Benachrichtigungen, um tägliche Check-ins für deine
              mentale Gesundheit nicht zu vergessen.
            </Text>
            <Button
              mode="contained"
              onPress={requestNotificationPermission}
              style={styles.actionButton}
            >
              Berechtigung erteilen
            </Button>
            <Button mode="text" onPress={handleNext} style={{ marginTop: 8 }}>
              Später erinnern
            </Button>
          </Animated.View>
        )}

        {/* Schritt 5: Willkommen / Ready Screen */}
        {STEPS[step] === "welcome" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              Alles bereit!
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Deine Einstellungen wurden erfolgreich übernommen. Du kannst dein
              Journal jetzt vollumfänglich nutzen.
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Navigationsleiste (Unten) */}
      <View style={styles.navigationRow}>
        <Button
          mode="text"
          disabled={step === 0}
          onPress={handleBack}
          style={{ opacity: step === 0 ? 0 : 1 }}
        >
          Zurück
        </Button>

        {/* Verstecke den Standard-Weiter-Button im Notification-Step, da der User dort eine Aktion ausführen soll */}
        {STEPS[step] !== "notifications" && (
          <Button mode="contained" onPress={handleNext}>
            {step === STEPS.length - 1 ? "Starten" : "Weiter"}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 6,
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
  },
  animatedContent: {
    width: "100%",
  },
  title: {
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  colorPalette: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 10,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  card: {
    marginVertical: 10,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  actionButton: {
    marginTop: 10,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
