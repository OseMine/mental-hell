export const PHQ9_QUESTIONS = Array.from({ length: 9 }, (_, i) => ``);
export const GAD7_QUESTIONS = Array.from({ length: 7 }, (_, i) => ``);

export function calculatePHQ9Score(answers: number[]): number {
  return answers.slice(0, 9).reduce((sum, val) => sum + val, 0);
}

export function calculateGAD7Score(answers: number[]): number {
  return answers.slice(9, 16).reduce((sum, val) => sum + val, 0);
}

export function getPHQ9Severity(score: number): string {
  if (score < 5) return "minimal";
  if (score < 10) return "mild";
  if (score < 15) return "moderate";
  if (score < 20) return "moderatelySevere";
  return "severe";
}

export function getGAD7Severity(score: number): string {
  if (score < 5) return "minimal";
  if (score < 10) return "mild";
  if (score < 15) return "moderate";
  return "severe";
}
