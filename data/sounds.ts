
import type { Difficulty, SoundGroup } from '../types';

/**
 * REFACTOR: This file centralizes content for the "Sound Practice" mode, now organized by difficulty
 * to align with the "Phrase Practice" mode's structure. This creates a unified progression system.
 */

// A type for the structure of each difficulty level's data for sound practice.
interface SoundDifficultyLevel {
  name: string;
  soundGroups: SoundGroup[];
}

// The main data structure containing all practice words, organized by difficulty and sound group.
export const SOUND_PRACTICE_LIBRARIES: Record<Difficulty, SoundDifficultyLevel> = {
  newbie: {
    name: 'Newbie (小学)',
    soundGroups: [
      { name: "Short 'a' sound /æ/", words: ["cat", "hat", "map", "bag", "apple"] },
      { name: "Short 'e' sound /ɛ/", words: ["red", "bed", "ten", "pen", "egg"] },
      { name: "Short 'i' sound /ɪ/", words: ["sit", "pin", "lip", "big", "is"] },
      { name: "Short 'o' sound /ɒ/", words: ["dog", "hot", "pot", "mop", "box"] },
      { name: "Short 'u' sound /ʌ/", words: ["cup", "sun", "bug", "run", "up"] },
    ],
  },
  apprentice: {
    name: 'Apprentice (初中)',
    soundGroups: [
      { name: "Voiceless 'th' sound /θ/", words: ["think", "three", "thumb", "healthy", "mouth", "path"] },
      { name: "Voiced 'th' sound /ð/", words: ["this", "that", "mother", "father", "together", "breathe"] },
      { name: "'sh' sound /ʃ/", words: ["she", "ship", "shoe", "fish", "wash"] },
      { name: "'ch' sound /tʃ/", words: ["chin", "chair", "watch", "catch", "teacher"] },
      { name: "Long 'ee' sound /iː/", words: ["see", "three", "meet", "sleep", "cheese"] },
    ],
  },
  expert: {
    name: 'Expert (高中)',
    soundGroups: [
      { name: "American 'r' sound /r/", words: ["red", "read", "carry", "around", "river", "right", "try"] },
      { name: "Light and Dark 'l' sound /l/", words: ["light", "look", "hello", "call", "feel", "always", "little"] },
      { name: "Distinguishing 'v' /v/ and 'w' /w/", words: ["vest", "west", "vine", "wine", "very", "wary"] },
      { name: "'j' sound /dʒ/", words: ["jump", "judge", "large", "age", "gentle"] },
      { name: "'ng' sound /ŋ/", words: ["sing", "king", "thing", "running", "morning"] },
    ],
  },
  master: {
    name: 'Master (大学)',
    soundGroups: [
      { name: "Vowel /ɪ/ vs /iː/ (sit vs seat)", words: ["sit", "seat", "ship", "sheep", "live", "leave", "chip", "cheap"] },
      { name: "Vowel /æ/ vs /ɛ/ (cat vs ket)", words: ["cat", "kettle", "bat", "bet", "pan", "pen", "sad", "said"] },
      { name: "Vowel /ɒ/ vs /ɔː/ (cot vs caught)", words: ["cot", "caught", "pot", "port", "not", "naught", "shot", "short"] },
      { name: "Silent 'b' and 'h'", words: ["doubt", "comb", "thumb", "hour", "honest", "what"] },
      { name: "Consonant clusters with 's'", words: ["street", "splash", "scratch", "spring", "scream", "crisp"] },
    ],
  },
  legend: {
    name: 'Legend (地狱模式)',
    soundGroups: [
      { name: "The 'schwa' sound /ə/", words: ["about", "sofa", "banana", "camera", "problem", "family"] },
      { name: "Ending with 'rl'", words: ["girl", "world", "curl", "hurl", "pearl"] },
      { name: "Ending with 'thm'", words: ["rhythm", "algorithm", "logarithm"] },
      { name: "Complex consonant clusters", words: ["sixth", "strengths", "angst", "twelfth", "crisps"] },
      { name: "Words of French origin", words: ["croissant", "bourgeois", "rendezvous", "chauffeur", "genre"] },
    ],
  },
};
