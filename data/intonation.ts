import type { Difficulty, IntonationPhrase } from '../types';

/**
 * BATCH_3: This file centralizes content for the "Intonation & Stress Drill" mode.
 * It's organized by difficulty to provide a progressive learning path for
 * mastering English prosody (rhythm, stress, and intonation).
 */

interface IntonationLevel {
  name: string;
  phrases: IntonationPhrase[];
}

export const INTONATION_LIBRARIES: Record<Difficulty, IntonationLevel> = {
  newbie: {
    name: 'Newbie (小学)',
    phrases: [
      { sentence: "This is my **dog**.", type: "Statement", pattern: "Falling" },
      { sentence: "Where are you **go**ing?", type: "Wh-Question", pattern: "Falling" },
      { sentence: "Are you **rea**dy?", type: "Yes/No Question", pattern: "Rising" },
      { sentence: "She bought **three** new books.", type: "Statement", pattern: "Falling" },
      { sentence: "Is that your **car**?", type: "Yes/No Question", pattern: "Rising" },
    ],
  },
  apprentice: {
    name: 'Apprentice (初中)',
    phrases: [
      { sentence: "I'd like some **bread**, **cheese**, and **ap**ples.", type: "List", pattern: "Rising, Rising, Falling" },
      { sentence: "**Stop** doing that!", type: "Command", pattern: "Falling" },
      { sentence: "What an a**ma**zing view!", type: "Exclamation", pattern: "Falling" },
      { sentence: "If you **see** him, can you **tell** him I called?", type: "Conditional", pattern: "Rising, Falling" },
      { sentence: "He's **smart**, but he's **la**zy.", type: "Contrast", pattern: "Rising, Falling" },
    ],
  },
  expert: {
    name: 'Expert (高中)',
    phrases: [
      { sentence: "**I** didn't say he **stole** the money.", type: "Contrastive Stress (Implication)", pattern: "Varies" },
      { sentence: "She's not just a **doc**tor; she's a **sur**geon.", type: "Clarification", pattern: "Rising, Falling" },
      { sentence: "The **red** car, not the **blue** one, is mine.", type: "Contrastive Stress (Choice)", pattern: "Falling" },
      { sentence: "You're coming to the party, **aren't** you?", type: "Tag Question (Confirmation)", pattern: "Falling" },
      { sentence: "You don't know where it is, **do** you?", type: "Tag Question (Real Question)", pattern: "Rising" },
    ],
  },
  master: {
    name: 'Master (大学)',
    phrases: [
      { sentence: "The **qua**lity of their work is un**ques**tionably su**pe**rior.", type: "Complex Statement", pattern: "Falling" },
      { sentence: "To **be**, or **not** to be, that is the **ques**tion.", type: "Famous Quote", pattern: "Varies" },
      { sentence: "So, after **all** that, you're **still** not going?", type: "Incredulity", pattern: "Rising" },
      { sentence: "It's a fascinating, though **in**credibly complex, field of study.", type: "Parenthetical Phrase", pattern: "Varies" },
      { sentence: "Considering the **wea**ther, the **dis**tance, and the **time**, I think we should post**pone**.", type: "Complex List", pattern: "Rising, Rising, Rising, Falling" },
    ],
  },
  legend: {
    name: 'Legend (地狱模式)',
    phrases: [
      { sentence: "Oh, **that's** a **bril**liant idea.", type: "Sarcasm", pattern: "Falling then Rising" },
      { sentence: "A **rhi**noceros has a **rhi**zome on its **rhi**noplasty.", type: "Rhythmic Drill", pattern: "Varies" },
      { sentence: "Is it **pru**dence to pre**tend** to be pre**oc**cupied?", type: "Complex Question", pattern: "Rising" },
      { sentence: "The **phi**losopher's **phy**sicality was pheno**me**nally flawed.", type: "Alliteration and Stress", pattern: "Falling" },
      { sentence: "You **really** expect me to believe **that**?", type: "Rhetorical Question (Disbelief)", pattern: "Sharply Rising" },
    ],
  },
};