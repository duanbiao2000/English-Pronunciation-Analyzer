import type { Difficulty, ConnectedSpeechPhrase } from '../types';

/**
 * BATCH_4: This file centralizes content for the "Connected Speech Practice" mode.
 * It's organized by difficulty to provide a progressive learning path for
 * mastering how words link together in natural American English.
 * The '~' character indicates a consonant-to-vowel link.
 */

interface ConnectedSpeechLevel {
  name: string;
  phrases: ConnectedSpeechPhrase[];
}

export const CONNECTED_SPEECH_LIBRARIES: Record<Difficulty, ConnectedSpeechLevel> = {
  newbie: {
    name: 'Newbie (小学)',
    phrases: [
      { sentence: "an~apple", feature: "Linking N to Vowel", naturalSpeech: "anapple" },
      { sentence: "it~is", feature: "Linking T to Vowel", naturalSpeech: "idis" },
      { sentence: "read~it", feature: "Linking D to Vowel", naturalSpeech: "readit" },
      { sentence: "because~I", feature: "Linking Z to Vowel", naturalSpeech: "becauzy" },
      { sentence: "turn~off", feature: "Linking N to Vowel", naturalSpeech: "turnoff" },
    ],
  },
  apprentice: {
    name: 'Apprentice (初中)',
    phrases: [
      { sentence: "What~are you doing?", feature: "Flap T and Linking R", naturalSpeech: "Whaddaya doin'?" },
      { sentence: "I'm going~to go.", feature: "Reduction (gonna)", naturalSpeech: "I'm gonna go." },
      { sentence: "She should~have told me.", feature: "Reduction (should've)", naturalSpeech: "She shoulda told me." },
      { sentence: "first~of~all", feature: "Linking and Elision (of v)", naturalSpeech: "firstofall" },
      { sentence: "next~door", feature: "Elision (t)", naturalSpeech: "nexdoor" },
    ],
  },
  expert: {
    name: 'Expert (高中)',
    phrases: [
      { sentence: "Did~you eat yet?", feature: "Assimilation (d+y = j)", naturalSpeech: "Jeet yet?" },
      { sentence: "I'll let~you know.", feature: "Assimilation (t+y = ch)", naturalSpeech: "I'll letcha know." },
      { sentence: "It must~have been him.", feature: "Elision (t, h)", naturalSpeech: "It musta bin 'im." },
      { sentence: "I don't~know what~to do.", feature: "Elision (t) and Reduction", naturalSpeech: "I dunno whadda do." },
      { sentence: "We're supposed~to be there.", feature: "Elision (d)", naturalSpeech: "We're supposta be there." },
    ],
  },
  master: {
    name: 'Master (大学)',
    phrases: [
      { sentence: "Is~that~what~you wanted?", feature: "Linking and Assimilation", naturalSpeech: "Iz zat whachu wanted?" },
      { sentence: "It's~a matter~of~opinion.", feature: "Linking and Flap T", naturalSpeech: "It's a madder of opinion." },
      { sentence: "He has~to understand~it.", feature: "Reduction and Linking", naturalSpeech: "He hasta understandit." },
      { sentence: "Would~you mind~if~I asked?", feature: "Assimilation and Linking", naturalSpeech: "Wouldja mind ifi asked?" },
      { sentence: "The facts~of~the case are clear.", feature: "Linking and Elision", naturalSpeech: "The factsa the case are clear." },
    ],
  },
  legend: {
    name: 'Legend (地狱模式)',
    phrases: [
      { sentence: "Give~me~a break.", feature: "Reduction (Gimme)", naturalSpeech: "Gimme a break." },
      { sentence: "I~should~have thought~of~that.", feature: "Multiple Reductions", naturalSpeech: "I shoulda thoughta that." },
      { sentence: "What~do~you want~to~do?", feature: "Multiple Reductions (Whatcha wanna do?)", naturalSpeech: "Whatcha wanna do?" },
      { sentence: "It's not~as~bad~as~it seems.", feature: "Multiple Links", naturalSpeech: "It's notaz badazit seems." },
      { sentence: "I could~have been~a contender.", feature: "Multiple Reductions (coulda been a)", naturalSpeech: "I coulda been a contender." },
    ],
  },
};