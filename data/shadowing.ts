
import type { Difficulty, ShadowingPhrase } from '../types';

/**
 * NEW_FEATURE: This file centralizes content for the "Shadowing Practice" mode.
 * The goal is to imitate the rhythm, stress, and intonation of a native speaker.
 * The content is organized by difficulty, consistent with other practice modes.
 */

interface ShadowingLevel {
  name: string;
  phrases: ShadowingPhrase[];
}

export const SHADOWING_LIBRARIES: Record<Difficulty, ShadowingLevel> = {
  newbie: {
    name: 'Newbie (小学)',
    phrases: [
      { sentence: "I need to go home now.", focus: "Simple declarative statement" },
      { sentence: "What time is it?", focus: "Basic Wh-question intonation" },
      { sentence: "It's a beautiful day, isn't it?", focus: "Tag question with falling intonation" },
      { sentence: "He likes to read books.", focus: "Simple subject-verb-object rhythm" },
      { sentence: "Can I help you with that?", focus: "Polite offer with rising intonation" },
    ],
  },
  apprentice: {
    name: 'Apprentice (初中)',
    phrases: [
      { sentence: "If it rains tomorrow, we'll have to cancel the picnic.", focus: "Conditional clause intonation" },
      { sentence: "She's not only smart, but she's also very kind.", focus: "Compound sentence with a pause" },
      { sentence: "I can't believe we actually won the game!", focus: "Expressing excitement and disbelief" },
      { sentence: "Could you please pass the salt?", focus: "Polite request" },
      { sentence: "We need to buy apples, bananas, and oranges.", focus: "List intonation" },
    ],
  },
  expert: {
    name: 'Expert (高中)',
    phrases: [
      { sentence: "The key to success, in my opinion, is consistent effort.", focus: "Parenthetical phrase intonation" },
      { sentence: "I didn't say he stole the money; I said he borrowed it.", focus: "Contrastive stress" },
      { sentence: "Despite the challenges, the team managed to complete the project on time.", focus: "Introductory clause with a pause" },
      { sentence: "Are you seriously telling me you've never seen that movie?", focus: "Expressing surprise" },
      { sentence: "The report, which was published last week, contains some fascinating insights.", focus: "Non-restrictive clause intonation" },
    ],
  },
  master: {
    name: 'Master (大学)',
    phrases: [
      { sentence: "To be, or not to be, that is the question.", focus: "Dramatic pausing and rhythm" },
      { sentence: "The evidence, though compelling, is ultimately inconclusive.", focus: "Complex sentence with multiple pauses" },
      { sentence: "On the one hand, we have a moral obligation to act; on the other, we must consider the potential consequences.", focus: "Balancing contrasting ideas" },
      { sentence: "It was the best of times, it was the worst of times.", focus: "Parallel structure and rhythm" },
      { sentence: "Ask not what your country can do for you; ask what you can do for your country.", focus: "Rhetorical and emphatic speech" },
    ],
  },
  legend: {
    name: 'Legend (地狱模式)',
    phrases: [
      { sentence: "So you're saying that, after all this time and all that effort, it was all for nothing?", focus: "Sarcasm and incredulity" },
      { sentence: "The sixth sick sheik's sixth sheep's sick.", focus: "Maintaining clarity through a difficult tongue-twister" },
      { sentence: "Alright, let me see if I've got this straight: you want to trade this priceless artifact for a sandwich?", focus: "Long, incredulous question with varying pace" },
      { sentence: "I'm not mad, I'm just... disappointed.", focus: "Conveying subtle emotion through intonation" },
      { sentence: "Inconceivable!", focus: "Matching a famous, highly expressive one-word line" },
    ],
  },
};
