import React, { useState } from 'react';
import { useHealthStore } from '@/src/store/healthStore';
import { StyleSheet, View } from 'react-native';
import { Background } from '@/src/widgets/Background';
import { TabPageTransition } from '@/src/components/TabPageTransition';
import { useResponsive } from '@/src/utils/responsive';
import { QuestionnaireMenu } from '@/src/components/QuestionnaireMenu';
import { QuestionnaireForm } from '@/src/components/QuestionnaireForm';
import { QuestionnaireResults } from '@/src/components/QuestionnaireResults';
import {
  GAD7_QUESTIONS,
  PHQ9_QUESTIONS,
  calculateGAD7Score,
  calculatePHQ9Score,
} from '@/src/utils/questionnaire';

type QuestionnaireStep = 'menu' | 'phq9' | 'gad7' | 'results';

export default function AnalyticsScreen() {
  const { addWeeklyAssessment } = useHealthStore();
  const { isDesktop } = useResponsive();

  const [step, setStep] = useState<QuestionnaireStep>('menu');
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [phq9Score, setPHQ9Score] = useState(0);
  const [gad7Score, setGAD7Score] = useState(0);

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

  return (
    <Background scrollable={true}>
      <TabPageTransition>
      <View style={isDesktop ? styles.desktopContent : undefined}>
        {step === 'menu' && <QuestionnaireMenu onStart={handleStartQuestionnaire} />}
        {(step === 'phq9' || step === 'gad7') && (
          <QuestionnaireForm
            step={step}
            currentQuestion={currentQuestion}
            onAnswer={handleAnswerQuestion}
            onBack={handleBackToMenu}
          />
        )}
        {step === 'results' && (
          <QuestionnaireResults
            phq9Score={phq9Score}
            gad7Score={gad7Score}
            onBack={handleBackToMenu}
          />
        )}
      </View>
      </TabPageTransition>
    </Background>
  );
}

const styles = StyleSheet.create({
  desktopContent: { maxWidth: 720, alignSelf: 'center', width: '100%' },
});