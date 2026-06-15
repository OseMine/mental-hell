// PHQ-9 and GAD-7 questionnaire definitions and scoring

export const PHQ9_QUESTIONS = [
  "Wenig Interesse oder Freude an Aktivitäten",
  "Depressiv oder hoffnungslos fühlen",
  "Schwierigkeiten einzuschlafen oder zu lange zu schlafen",
  "Müdigkeit oder Energiemangel",
  "Schlechter Appetit oder Überessen",
  "Sich selbst negativ fühlen",
  "Schwierigkeiten, sich zu konzentrieren",
  "Zu langsam oder zu schnell bewegen/sprechen",
  "Gedanken, lieber tot zu sein oder sich selbst Schaden zuzufügen",
];

export const GAD7_QUESTIONS = [
  "Nervosität, Angst oder Sorge",
  "Nicht in der Lage sein, sich Sorgen zu machen oder diese zu kontrollieren",
  "Zu viele Dinge auf einmal sich Sorgen machen",
  "Schwierigkeiten zu entspannen",
  "Reizbar sein",
  "Angst, dass etwas Schlimmes passiert",
  "Angst vor der Zukunft",
];

export const QUESTION_OPTIONS = [
  { label: "Überhaupt nicht", value: 0 },
  { label: "Mehrere Tage", value: 1 },
  { label: "Mehr als die Hälfte der Tage", value: 2 },
  { label: "Beinahe jeden Tag", value: 3 },
];

export function calculatePHQ9Score(answers: number[]): number {
  return answers.slice(0, 9).reduce((sum, val) => sum + val, 0);
}

export function calculateGAD7Score(answers: number[]): number {
  return answers.slice(9, 16).reduce((sum, val) => sum + val, 0);
}

export function getPHQ9Severity(score: number): string {
  if (score < 5) return "Minimal";
  if (score < 10) return "Mild";
  if (score < 15) return "Moderat";
  if (score < 20) return "Moderat schwer";
  return "Schwer";
}

export function getGAD7Severity(score: number): string {
  if (score < 5) return "Minimal";
  if (score < 10) return "Mild";
  if (score < 15) return "Moderat";
  return "Schwer";
}
