
import type { Difficulty, MinimalPair } from '../types';

/**
 * BATCH_2: This file centralizes content for the "Minimal Pair Practice" mode.
 * It's organized by difficulty to provide a progressive learning path for
 * distinguishing between similar English sounds.
 */

interface MinimalPairLevel {
  name: string;
  pairs: MinimalPair[];
}

export const MINIMAL_PAIR_LIBRARIES: Record<Difficulty, MinimalPairLevel> = {
  newbie: {
    name: 'Newbie (小学)',
    pairs: [
      { word1: "ship", word2: "sheep", focus: "/ɪ/ vs /iː/" },
      { word1: "bat",  word2: "bet",   focus: "/æ/ vs /e/" },
      { word1: "pin",  word2: "pen",   focus: "/ɪ/ vs /e/" },
      { word1: "cup",  word2: "cap",   focus: "/ʌ/ vs /æ/" },
      { word1: "desk", word2: "disk",  focus: "/e/ vs /ɪ/" },
    ],
  },
  apprentice: {
    name: 'Apprentice (初中)',
    pairs: [
      { word1: "lice", word2: "rice", focus: "/l/ vs /r/" },
      { word1: "very", word2: "berry", focus: "/v/ vs /b/" },
      { word1: "thin", word2: "fin", focus: "/θ/ vs /f/" },
      { word1: "fan",  word2: "van", focus: "/f/ vs /v/" },
      { word1: "cheer", word2: "share", focus: "/tʃ/ vs /ʃ/" },
    ],
  },
  expert: {
    name: 'Expert (高中)',
    pairs: [
      { word1: "wok",  word2: "walk", focus: "/ɒ/ vs /ɔːk/" },
      { word1: "then", word2: "zen", focus: "/ð/ vs /z/" },
      { word1: "pleasure", word2: "pressure", focus: "/ʒ/ vs /ʃ/" },
      { word1: "three", word2: "free", focus: "/θ/ vs /f/" },
      { word1: "ice",  word2: "eyes", focus: "voiceless /s/ vs voiced /z/" },
    ],
  },
  master: {
    name: 'Master (大学)',
    pairs: [
      { word1: "ether", word2: "either", focus: "/θ/ vs /ð/" },
      { word1: "statue", word2: "status", focus: "Ending sound /uː/ vs /əs/" },
      { word1: "search", word2: "church", focus: "/s/ vs /tʃ/" },
      { word1: "law",   word2: "low", focus: "/ɔː/ vs /oʊ/" },
      { word1: "worth", word2: "worse", focus: "Final /θ/ vs /s/" },
    ],
  },
  legend: {
    name: 'Legend (地狱模式)',
    pairs: [
      { word1: "colonel", word2: "kernel", focus: "Identical pronunciation" },
      { word1: "through", word2: "thorough", focus: "/uː/ vs /ˈθʌroʊ/" },
      { word1: "rural", word2: "juror", focus: "Complex /r/ and /l/ sounds" },
      { word1: "anesthetize", word2: "epitomize", focus: "Complex stress and vowel sounds" },
      { word1: "worcestershire", word2: "worcestershire", focus: "The infamous sauce name" },
    ],
  },
};
