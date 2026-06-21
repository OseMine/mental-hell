import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
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
import { useTranslation } from "../../src/i18n/useTranslation";

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
  const { t } = useTranslation();

  const paperTheme = useTheme();
  const { updateTheme } = useMaterial3Theme();

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
      finishOnboarding();
      router.replace("/(tabs)");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === "web") {
      handleNext();
      return;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    handleNext();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: paperTheme.colors.background },
      ]}
    >
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

      <View style={styles.stepContainer}>
        {STEPS[step] === "language" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              {t('onboarding.languageTitle')}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {t('onboarding.languageSubtitle')}
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

        {STEPS[step] === "theme_color" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              {t('onboarding.accentTitle')}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {t('onboarding.accentSubtitle')}
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

        {STEPS[step] === "dark_mode" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              {t('onboarding.themeTitle')}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {t('onboarding.themeSubtitle')}
            </Text>

            <Card style={styles.card} mode="outlined">
              <Card.Content style={styles.switchRow}>
                <Text variant="bodyLarge">{t('onboarding.darkMode')}</Text>
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

        {STEPS[step] === "notifications" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              {t('onboarding.notificationsTitle')}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {t('onboarding.notificationsSubtitle')}
            </Text>
            <Button
              mode="contained"
              onPress={requestNotificationPermission}
              style={styles.actionButton}
            >
              {t('onboarding.grantPermission')}
            </Button>
            <Button mode="text" onPress={handleNext} style={{ marginTop: 8 }}>
              {t('onboarding.remindLater')}
            </Button>
          </Animated.View>
        )}

        {STEPS[step] === "welcome" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.animatedContent}
          >
            <Text variant="headlineMedium" style={styles.title}>
              {t('onboarding.readyTitle')}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {t('onboarding.readySubtitle')}
            </Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.navigationRow}>
        <Button
          mode="text"
          disabled={step === 0}
          onPress={handleBack}
          style={{ opacity: step === 0 ? 0 : 1 }}
        >
          {t('common.back')}
        </Button>

        {STEPS[step] !== "notifications" && (
          <Button mode="contained" onPress={handleNext}>
            {step === STEPS.length - 1 ? t('common.start') : t('common.next')}
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
    elevation: 4,
    ...Platform.select({
      web: { boxShadow: "0 2px 3px rgba(0,0,0,0.3)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
    }),
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
