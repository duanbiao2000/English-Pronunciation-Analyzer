
/**
 * NEW_FEATURE: This file centralizes the content for the gamified pronunciation practice.
 * It defines the different difficulty levels and the phrases associated with each,
 * creating a progressive learning path for the user.
 */

// A type definition for the keys used in our phrase library object.
export type Difficulty = 'newbie' | 'apprentice' | 'expert' | 'master' | 'legend';

// A type for the structure of each difficulty level's data.
interface DifficultyLevel {
  name: string;
  phrases: string[];
}

// The main data structure containing all phrases, organized by difficulty.
export const PHRASE_LIBRARIES: Record<Difficulty, DifficultyLevel> = {
  newbie: {
    name: 'Newbie (小学)',
    phrases: [
      "The cat sat on the mat.",
      "A red hen is in the pen.",
      "Big dogs run fast.",
      "I can see a big tree.",
      "He has a blue book.",
    ],
  },
  apprentice: {
    name: 'Apprentice (初中)',
    phrases: [
      "School is fun when you are learning.",
      "My brother likes to play video games.",
      "What is your favorite type of music?",
      "The library is a quiet place to study.",
      "She walked through the beautiful green park.",
    ],
  },
  expert: {
    name: 'Expert (高中)',
    phrases: [
      "The industrial revolution changed the world.",
      "Environmental conservation is a global responsibility.",
      "Shakespeare's contributions to literature are immense.",
      "Understanding calculus requires strong analytical skills.",
      "The political landscape is constantly evolving.",
    ],
  },
  master: {
    name: 'Master (大学)',
    phrases: [
      "Quantum mechanics presents a probabilistic view of nature.",
      "Socioeconomic factors significantly influence educational outcomes.",
      "Phonological awareness is crucial for literacy development.",
      "The research methodology must be rigorously validated.",
      "Existential philosophy explores the nature of freedom and responsibility.",
    ],
  },
  legend: {
    name: 'Legend (地狱模式)',
    phrases: [
      "She sells seashells by the seashore.",
      "Peter Piper picked a peck of pickled peppers.",
      "How can a clam cram in a clean cream can?",
      "The sixth sick sheik's sixth sheep's sick.",
      "Red lorry, yellow lorry.",
    ],
  },
};
