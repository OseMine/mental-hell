import Colors from "@/constants/Colors";
import { MoodChart } from "@/src/components/MoodChart";
import { useHealthStore } from "@/src/store/healthStore";
import {
    GAD7_QUESTIONS,
    PHQ9_QUESTIONS,
    QUESTION_OPTIONS,
    calculateGAD7Score,
    calculatePHQ9Score,
    getGAD7Severity,
    getPHQ9Severity,
} from "@/src/utils/questionnaire";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type QuestionnaireStep = "menu" | "phq9" | "gad7" | "results";

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { getLastSevenDaysLogs, addWeeklyAssessment, getLastWeeklyAssessment } =
    useHealthStore();

  const [step, setStep] = useState<QuestionnaireStep>("menu");
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [phq9Score, setPHQ9Score] = useState(0);
  const [gad7Score, setGAD7Score] = useState(0);

  const lastSevenDaysLogs = getLastSevenDaysLogs();
  const lastAssessment = getLastWeeklyAssessment();

  const handleStartQuestionnaire = () => {
    setStep("phq9");
    setAnswers([]);
    setCurrentQuestion(0);
  };

  const handleAnswerQuestion = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step === "phq9" && currentQuestion < PHQ9_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (
      step === "phq9" &&
      currentQuestion === PHQ9_QUESTIONS.length - 1
    ) {
      // Move to GAD7
      setStep("gad7");
      setCurrentQuestion(0);
    } else if (step === "gad7" && currentQuestion < GAD7_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (
      step === "gad7" &&
      currentQuestion === GAD7_QUESTIONS.length - 1
    ) {
      // Calculate scores and show results
      const phq9 = calculatePHQ9Score(newAnswers);
      const gad7 = calculateGAD7Score(newAnswers);
      setPHQ9Score(phq9);
      setGAD7Score(gad7);

      // Save to store
      addWeeklyAssessment({
        timestamp: Date.now(),
        phq9_score: phq9,
        gad7_score: gad7,
        total_wellbeing_score:
          (10 - (phq9 / 27) * 10 + 10 - (gad7 / 21) * 10) / 2,
      });

      setStep("results");
    }
  };

  const handleBackToMenu = () => {
    setStep("menu");
    setAnswers([]);
    setCurrentQuestion(0);
    setPHQ9Score(0);
    setGAD7Score(0);
  };

  const renderMenu = () => (
    <View>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Analyse
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.gray }]}>
          Überwache deine mentale Gesundheit
        </Text>
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Stimmungs-Verlauf (7 Tage)
        </Text>
        <MoodChart logs={lastSevenDaysLogs} width={350} height={240} />
      </View>

      {/* Last Assessment */}
      {lastAssessment && (
        <View
          style={[
            styles.assessmentCard,
            { backgroundColor: colors.card, borderColor: colors.lightGray },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Letzte Bewertung
          </Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreLabel, { color: colors.gray }]}>
                PHQ-9
              </Text>
              <Text
                style={[
                  styles.scoreValue,
                  {
                    color:
                      lastAssessment.phq9_score < 10
                        ? colors.green
                        : lastAssessment.phq9_score < 15
                          ? colors.orange
                          : colors.red,
                  },
                ]}
              >
                {lastAssessment.phq9_score}/27
              </Text>
              <Text style={[styles.scoreSeverity, { color: colors.gray }]}>
                {getPHQ9Severity(lastAssessment.phq9_score)}
              </Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreLabel, { color: colors.gray }]}>
                GAD-7
              </Text>
              <Text
                style={[
                  styles.scoreValue,
                  {
                    color:
                      lastAssessment.gad7_score < 10
                        ? colors.green
                        : lastAssessment.gad7_score < 15
                          ? colors.orange
                          : colors.red,
                  },
                ]}
              >
                {lastAssessment.gad7_score}/21
              </Text>
              <Text style={[styles.scoreSeverity, { color: colors.gray }]}>
                {getGAD7Severity(lastAssessment.gad7_score)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Questionnaire Button */}
      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: colors.blue }]}
        onPress={handleStartQuestionnaire}
      >
        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
        <Text style={styles.startButtonText}>
          Wöchentlicher Check-In starten (PHQ-9 & GAD-7)
        </Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={colors.blue} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          Der wöchentliche Fragebogen hilft dir, deine psychische Gesundheit
          systematisch zu bewerten und Veränderungen im Laufe der Zeit zu
          verfolgen.
        </Text>
      </View>
    </View>
  );

  const renderQuestionnaire = () => {
    const isPhq9 = step === "phq9";
    const questions = isPhq9 ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
    const question = questions[currentQuestion];
    const progress = isPhq9
      ? ((currentQuestion + 1) / PHQ9_QUESTIONS.length) * 100
      : ((currentQuestion + 1) / GAD7_QUESTIONS.length) * 100;

    return (
      <View>
        <View style={styles.questionnaireHeader}>
          <TouchableOpacity onPress={handleBackToMenu}>
            <Ionicons name="arrow-back" size={24} color={colors.blue} />
          </TouchableOpacity>
          <Text style={[styles.questionnaireTitle, { color: colors.text }]}>
            {isPhq9 ? "PHQ-9 Depression-Skala" : "GAD-7 Angst-Skala"}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={[styles.progressBar, { backgroundColor: colors.lightGray }]}
        >
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.blue, width: `${progress}%` },
            ]}
          />
        </View>

        <Text style={[styles.progressText, { color: colors.gray }]}>
          Frage {currentQuestion + 1} von {questions.length}
        </Text>

        {/* Question */}
        <View
          style={[
            styles.questionContainer,
            { backgroundColor: colors.card, borderColor: colors.lightGray },
          ]}
        >
          <Text style={[styles.question, { color: colors.text }]}>
            {question}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {QUESTION_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { backgroundColor: colors.card, borderColor: colors.lightGray },
              ]}
              onPress={() => handleAnswerQuestion(option.value)}
            >
              <View style={styles.optionContent}>
                <View
                  style={[styles.optionDot, { backgroundColor: colors.blue }]}
                />
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.optionValue, { color: colors.gray }]}>
                    Punkte: {option.value}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderResults = () => (
    <View>
      <TouchableOpacity style={styles.backButton} onPress={handleBackToMenu}>
        <Ionicons name="arrow-back" size={24} color={colors.blue} />
        <Text style={[styles.backButtonText, { color: colors.blue }]}>
          Zurück
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Ergebnisse
        </Text>
      </View>

      {/* PHQ-9 Result */}
      <View
        style={[
          styles.resultCard,
          { backgroundColor: colors.card, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.resultHeader}>
          <Ionicons name="sad" size={32} color={colors.orange} />
          <View>
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              PHQ-9 Depression-Score
            </Text>
            <Text style={[styles.resultSeverity, { color: colors.gray }]}>
              {getPHQ9Severity(phq9Score)}
            </Text>
          </View>
        </View>
        <Text style={[styles.resultScore, { color: colors.blue }]}>
          {phq9Score} / 27 Punkte
        </Text>
        <Text style={[styles.resultDescription, { color: colors.gray }]}>
          {getPhq9Description(phq9Score)}
        </Text>
      </View>

      {/* GAD-7 Result */}
      <View
        style={[
          styles.resultCard,
          { backgroundColor: colors.card, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.resultHeader}>
          <Ionicons name="alert-circle" size={32} color={colors.orange} />
          <View>
            <Text style={[styles.resultTitle, { color: colors.text }]}>
              GAD-7 Angst-Score
            </Text>
            <Text style={[styles.resultSeverity, { color: colors.gray }]}>
              {getGAD7Severity(gad7Score)}
            </Text>
          </View>
        </View>
        <Text style={[styles.resultScore, { color: colors.blue }]}>
          {gad7Score} / 21 Punkte
        </Text>
        <Text style={[styles.resultDescription, { color: colors.gray }]}>
          {getGad7Description(gad7Score)}
        </Text>
      </View>

      {/* Recommendation */}
      <View style={[styles.infoBox, { backgroundColor: "#F0F0F0" }]}>
        <Ionicons name="bulb" size={20} color={colors.blue} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          Exportiere diese Daten und teile sie mit deinem Arzt oder Therapeuten
          für eine fundierte klinische Bewertung.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: colors.blue }]}
        onPress={handleBackToMenu}
      >
        <Text style={styles.continueButtonText}>Zu Analyse zurück</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === "menu" && renderMenu()}
        {(step === "phq9" || step === "gad7") && renderQuestionnaire()}
        {step === "results" && renderResults()}
      </ScrollView>
    </SafeAreaView>
  );
}

function getPhq9Description(score: number): string {
  if (score < 5)
    return "Minimale Symptome. Du zeigst nur wenige Anzeichen von Depression.";
  if (score < 10)
    return "Leichte Depression. Es könnte hilfreich sein, mit jemandem zu sprechen.";
  if (score < 15)
    return "Moderate Depression. Eine ärztliche Beratung wird empfohlen.";
  if (score < 20)
    return "Moderat schwere Depression. Suche professionelle Hilfe auf.";
  return "Schwere Depression. Kontaktiere sofort einen Arzt oder Therapeuten.";
}

function getGad7Description(score: number): string {
  if (score < 5)
    return "Minimale Angst. Du befindest dich in einem guten emotionalen Zustand.";
  if (score < 10)
    return "Leichte Angst. Achtsamkeit und Selbstfürsorge können helfen.";
  if (score < 15)
    return "Moderate Angst. Eine ärztliche Beratung wird empfohlen.";
  return "Schwere Angst. Kontaktiere einen Fachmann zur Unterstützung.";
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
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  assessmentCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scoreItem: {
    alignItems: "center",
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  scoreSeverity: {
    fontSize: 11,
    fontWeight: "400",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EBF3FF",
    borderRadius: 10,
    padding: 12,
    gap: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
  },
  // Questionnaire
  questionnaireHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  questionnaireTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 16,
  },
  questionContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  optionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  optionValue: {
    fontSize: 11,
    fontWeight: "400",
  },
  // Results
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  resultSeverity: {
    fontSize: 11,
    fontWeight: "400",
  },
  resultScore: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  },
  continueButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
