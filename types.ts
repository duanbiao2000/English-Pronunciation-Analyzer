export interface ErrorPattern {
  error: string;
  explanation: string;
  exercises: string;
}

export interface AnalysisResult {
  score: number;
  correctedPhrase: string;
  feedback: string;
  errorPatterns: ErrorPattern[];
}
