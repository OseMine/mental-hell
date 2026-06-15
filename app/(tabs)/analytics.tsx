import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme, Button, ProgressBar, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHealthStore } from '@/src/store/healthStore';
import { MoodChart } from '@/src/components/MoodChart';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { InfoBox } from '@/src/widgets/InfoBox';
import { ResultCard } from '@/src/widgets/ResultCard';
import {
  GAD7_QUESTIONS,
  PHQ9_QUESTIONS,
  QUESTION_OPTIONS,
  calculateGAD7Score,
  calculatePHQ9Score,
  getGAD7Severity,
  getPHQ9Severity,
} from '@/src/utils/questionnaire';

type QuestionnaireStep = 'menu' | 'phq9' | 'gad7' | 'results';

export default function AnalyticsScreen() {
  const theme = useTheme() as MD3Theme;
  const { getLastSevenDaysLogs, addWeeklyAssessment, getLastWeeklyAssessment } = useHealthStore();

  const [step, setStep] = useState<QuestionnaireStep>('menu');
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [phq9Score, setPHQ9Score] = useState(0);
  const [gad7Score, setGAD7Score] = useState(0);

  const lastSevenDaysLogs = getLastSevenDaysLogs();
  const lastAssessment = getLastWeeklyAssessment();

  // Helper, um Farb-Feedback basierend auf den klinischen Grenzwerten (M3 Semantics) zu erhalten
  const getSeverityColor = (score: number, type: 'phq9' | 'gad7') => {
    const limit = type === 'phq9' ? 10 : 10;
    const highLimit = type === 'phq9' ? 15 : 15;
    if (score < limit) return theme.colors.primary; // Unbedenklich / Stabil
    if (score < highLimit) return theme.colors.tertiary; // Leicht erhöht / Warnung
    return theme.colors.error; // Kritisch
  };

  const handleStartQuestionnaire = () => {
    setStep('phq9');
    setAnswers([]);
    setCurrentQuestion(0);
  };

  const handleAnswerQuestion = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step === 'phq9' && currentQuestion < PHQ9_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (step === 'phq9' && currentQuestion === PHQ9_QUESTIONS.length - 1) {
      setStep('gad7');
      setCurrentQuestion(0);
    } else if (step === 'gad7' && currentQuestion < GAD7_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (step === 'gad7' && currentQuestion === GAD7_QUESTIONS.length - 1) {
      const phq9 = calculatePHQ9Score(newAnswers);
      const gad7 = calculateGAD7Score(newAnswers);
      setPHQ9Score(phq9);
      setGAD7Score(gad7);

      addWeeklyAssessment({
        timestamp: Date.now(),
        phq9_score: phq9,
        gad7_score: gad7,
        total_wellbeing_score: (10 - (phq9 / 27) * 10 + 10 - (gad7 / 21) * 10) / 2,
      });

      setStep('results');
    }
  };

  const handleBackToMenu = () => {
    setStep('menu');
    setAnswers([]);
    setCurrentQuestion(0);
    setPHQ9Score(0);
    setGAD7Score(0);
  };

  // ── Zustand: Menü (Hauptansicht) ──────────────────────────────────────────
  const renderMenu = () => (
    <View>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
          Analyse
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          Überwache deine mentale Gesundheit im Detail
        </Text>
      </View>

      {/* Chart Bereich verpackt in CustomCard */}
      <CustomCard style={styles.chartCard}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Stimmungs-Verlauf (Letzte 7 Tage)
        </Text>
        <View style={styles.chartWrapper}>
          <MoodChart logs={lastSevenDaysLogs} width={340} height={220} />
        </View>
      </CustomCard>

      {/* Letzte Bewertung (falls vorhanden) */}
      {lastAssessment && (
        <CustomCard style={styles.assessmentCard}>
          <Text variant="titleSmall" style={{ color: theme.colors.outline, fontWeight: '700', marginBottom: 12 }}>
            LETZTE BEWERTUNG
          </Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>PHQ-9 (Depression)</Text>
              <Text variant="headlineSmall" style={[styles.scoreValue, { color: getSeverityColor(lastAssessment.phq9_score, 'phq9') }]}>
                {lastAssessment.phq9_score} <Text variant="labelSmall" style={{ color: theme.colors.outline }}>/27</Text>
              </Text>
              <Text variant="bodySmall" style={[styles.scoreSeverity, { color: theme.colors.outline }]}>
                {getPHQ9Severity(lastAssessment.phq9_score)}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

            <View style={styles.scoreItem}>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>GAD-7 (Angstzustände)</Text>
              <Text variant="headlineSmall" style={[styles.scoreValue, { color: getSeverityColor(lastAssessment.gad7_score, 'gad7') }]}>
                {lastAssessment.gad7_score} <Text variant="labelSmall" style={{ color: theme.colors.outline }}>/21</Text>
              </Text>
              <Text variant="bodySmall" style={[styles.scoreSeverity, { color: theme.colors.outline }]}>
                {getGAD7Severity(lastAssessment.gad7_score)}
              </Text>
            </View>
          </View>
        </CustomCard>
      )}

      {/* Primärer M3 Button zum Starten */}
      <Button
        mode="contained"
        icon="clipboard-text"
        onPress={handleStartQuestionnaire}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
      >
        Wöchentlichen Check-In starten
      </Button>

      <InfoBox text="Der klinisch validierte PHQ-9 & GAD-7 Kombi-Fragebogen hilft dir, deine psychische Gesundheit systematisch zu screenen und Trends über Monate hinweg aufzudecken." />
    </View>
  );

  // ── Zustand: Fragebogen läuft ──────────────────────────────────────────────
  const renderQuestionnaire = () => {
    const isPhq9 = step === 'phq9';
    const questions = isPhq9 ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
    const question = questions[currentQuestion];
    const progressValue = (currentQuestion + 1) / questions.length;

    return (
      <View>
        <View style={styles.questionnaireHeader}>
          <TouchableOpacity onPress={handleBackToMenu} style={styles.backArrow}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text variant="titleMedium" style={[styles.questionnaireTitle, { color: theme.colors.onBackground }]}>
            {isPhq9 ? 'PHQ-9 Depression-Skala' : 'GAD-7 Angst-Skala'}
          </Text>
        </View>

        {/* Reines M3 Progressbar-Element */}
        <ProgressBar progress={progressValue} color={theme.colors.primary} style={styles.progressBar} />

        <Text variant="labelMedium" style={{ color: theme.colors.outline, marginBottom: 16 }}>
          Frage {currentQuestion + 1} von {questions.length}
        </Text>

        {/* Die Frage selbst */}
        <CustomCard style={styles.questionContainer}>
          <Text variant="titleMedium" style={[styles.questionText, { color: theme.colors.onSurface }]}>
            {question}
          </Text>
        </CustomCard>

        {/* Antwort-Optionen als formschöne Touchables */}
        <View style={styles.optionsContainer}>
          {QUESTION_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
              ]}
              onPress={() => handleAnswerQuestion(option.value)}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionDot, { backgroundColor: theme.colors.primary }]} />
                <View style={styles.optionTextContainer}>
                  <Text variant="bodyMedium" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                    {option.label}
                  </Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 1 }}>
                    Wertung: +{option.value} {option.value === 1 ? 'Punkt' : 'Punkte'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // ── Zustand: Ergebnisse der aktuellen Session ─────────────────────────────────
  const renderResults = () => (
    <View>
      <TouchableOpacity style={styles.backButtonInline} onPress={handleBackToMenu}>
        <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
        <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          Zurück zur Übersicht
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ fontWeight: '800' }}>
          Deine Ergebnisse
        </Text>
      </View>

      {/* PHQ-9 Card über das Widget */}
      <ResultCard
        title="PHQ-9 Depression-Score"
        severity={getPHQ9Severity(phq9Score)}
        score={phq9Score}
        maxScore={27}
        description={getPhq9Description(phq9Score)}
        iconName="sad-outline"
        scoreColor={getSeverityColor(phq9Score, 'phq9')}
      />

      {/* GAD-7 Card über das Widget */}
      <ResultCard
        title="GAD-7 Angst-Score"
        severity={getGAD7Severity(gad7Score)}
        score={gad7Score}
        maxScore={21}
        description={getGad7Description(gad7Score)}
        iconName="alert-circle-outline"
        scoreColor={getSeverityColor(gad7Score, 'gad7')}
      />

      <InfoBox text="Hinweis: Diese App ersetzt keine fachärztliche Diagnose. Solltest du dich über längere Zeit unwohl fühlen, suche bitte das Gespräch mit Therapeuten oder Medizinern." />

      <Button
        mode="contained-tonal"
        onPress={handleBackToMenu}
        style={styles.finishButton}
      >
        Ergebnisse schließen
      </Button>
    </View>
  );

  return (
    <Background scrollable={true}>
      {step === 'menu' && renderMenu()}
      {(step === 'phq9' || step === 'gad7') && renderQuestionnaire()}
      {step === 'results' && renderResults()}
    </Background>
  );
}

// ── Beschreibungs-Mapper (unverändert, bereinigt) ───────────────────────────

function getPhq9Description(score: number): string {
  if (score < 5) return 'Minimale Symptome. Du zeigst aktuell keine signifikanten Anzeichen einer depressiven Belastung.';
  if (score < 10) return 'Leichte Depression. Phasenweise Verstimmungen liegen vor. Achtsamkeitspraktiken können helfen.';
  if (score < 15) return 'Moderate Depression. Eine ärztliche oder therapeutische Beratung zur Abklärung wird empfohlen.';
  if (score < 20) return 'Moderat schwere Depression. Belastungen engen den Alltag ein. Professionelle Begleitung ist ratsam.';
  return 'Schwere Depression. Akuter Handlungsbedarf. Bitte kontaktiere umgehend einen Arzt, Therapeuten oder Krisendienst.';
}

function getGad7Description(score: number): string {
  if (score < 5) return 'Minimale Angst. Dein emotionales Grundgerüst ist derzeit stabil und entspannt.';
  if (score < 10) return 'Leichte Angst. Sorgen-Spiralen treten vereinzelt auf. Stressmanagement reguliert das Befinden.';
  if (score < 15) return 'Moderate Angst. Nervosität und Anspannung nehmen zu. Eine professionelle Beratung ist zu empfehlen.';
  return 'Schwere Angst. Starke Einschränkungen im Alltag durch Angst- oder Panikgefühle. Suche zeitnah fachliche Hilfe.';
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5, marginBottom: 2 },
  chartCard: { padding: 14, marginBottom: 16 },
  sectionTitle: { fontWeight: '700', marginBottom: 12 },
  chartWrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
  assessmentCard: { padding: 16, marginBottom: 20 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scoreItem: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 50, opacity: 0.3 },
  scoreValue: { fontWeight: '800', marginTop: 4, marginBottom: 2 },
  scoreSeverity: { fontWeight: '600', textAlign: 'center' },
  actionButton: { marginTop: 4, marginBottom: 16, borderRadius: 100 },
  actionButtonContent: { paddingVertical: 6 },
  
  // Questionnaire Layouts
  questionnaireHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
  backArrow: { paddingVertical: 4, paddingRight: 8 },
  questionnaireTitle: { fontWeight: '700', flex: 1 },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 8 },
  questionContainer: { padding: 20, marginBottom: 16 },
  questionText: { fontWeight: '700', lineHeight: 24, textAlign: 'center' },
  optionsContainer: { gap: 10, marginBottom: 24 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionContent: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 },
  optionDot: { width: 10, height: 10, borderRadius: 5 },
  optionTextContainer: { flex: 1 },
  
  // Results
  backButtonInline: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  finishButton: { borderRadius: 100, paddingVertical: 2, marginBottom: 24 },
});