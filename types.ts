
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

export interface SoundGroup {
  name: string;
  words: string[];
}

export interface MinimalPair {
  word1: string;
  word2: string;
  focus: string;
}

export interface IntonationPhrase {
  sentence: string; // e.g., "This is a **great** idea."
  type: string;     // e.g., "Statement with Emphasis"
  pattern: string;  // e.g., "Falling" or "Rising"
}

export interface ConnectedSpeechPhrase {
  sentence: string; // e.g., "What~are you doing?"
  feature: string;  // e.g., "Linking R and Flap T"
  naturalSpeech: string; // e.g., "Whaddaya doin'?"
}

export interface ShadowingPhrase {
  sentence: string;
  focus: string;
}


export type Difficulty = 'newbie' | 'apprentice' | 'expert' | 'master' | 'legend';

export type PracticeMode = 'phrase' | 'sound' | 'adaptation' | 'shadowing';

export type AdaptationDrill = 'minimal_pairs' | 'intonation' | 'connected_speech';