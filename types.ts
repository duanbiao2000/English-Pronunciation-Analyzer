
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

// NEW_FEATURE: A type for a single practice item in sound mode.
// It represents a group of words focusing on a specific sound.
export interface SoundGroup {
  name: string;
  words: string[];
}

// A type definition for the keys used in the practice libraries.
export type Difficulty = 'newbie' | 'apprentice' | 'expert' | 'master' | 'legend';
