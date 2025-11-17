
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type } from '@google/genai';
import { Header } from './components/Header';
import { PronunciationCard } from './components/PronunciationCard';
import { RecordButton } from './components/RecordButton';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { FeedbackCard } from './components/FeedbackCard';
import { StatusMessage } from './components/StatusMessage';
import { ScoreDisplay } from './components/ScoreDisplay';
import { ErrorPatternsCard } from './components/ErrorPatternsCard';
import { WaveformComparison } from './components/WaveformComparison';
import { encode, decode, decodeAudioData, createBlob, createWavBlob, audioBufferToWavBlob } from './utils/audio';
import type { AnalysisResult, PracticeMode, AdaptationDrill, MinimalPair, IntonationPhrase, ConnectedSpeechPhrase, ShadowingPhrase } from './types';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { playSuccessSound, playPerfectScoreSound } from './utils/sfx';
import { PHRASE_LIBRARIES, Difficulty } from './data/phrases';
import { DifficultySelector } from './components/DifficultySelector';
import { ApiKeyErrorScreen } from './components/ApiKeyErrorScreen';
import { Button } from './components/Button';
import { LevelCompleteAnimation } from './components/LevelCompleteAnimation';
import { SOUND_PRACTICE_LIBRARIES } from './data/sounds';
import { PracticeModeSelector } from './components/PracticeModeSelector';
import { AdaptationDrillSelector } from './components/AdaptationDrillSelector';
import { MINIMAL_PAIR_LIBRARIES } from './data/minimal_pairs';
import { INTONATION_LIBRARIES } from './data/intonation';
import { CONNECTED_SPEECH_LIBRARIES } from './data/connected_speech';
import { SHADOWING_LIBRARIES } from './data/shadowing';


const ANALYSIS_PROMPT = (userAttempt: string, targetPhrase: string, language: 'en' | 'zh' | 'ja') => {
  let languageInstruction = '';
  switch (language) {
    case 'zh':
      languageInstruction = '你的所有回答，包括反馈、解释和练习，都必须使用中文。';
      break;
    case 'ja':
      languageInstruction = 'あなたのすべての回答は、フィードバック、説明、練習問題を含め、すべて日本語でなければなりません。';
      break;
    case 'en':
    default:
      languageInstruction = 'All of your feedback, explanations, and exercises must be in English.';
      break;
  }

  return `
You are an expert American English pronunciation coach. Your task is to analyze a user's pronunciation of a given phrase and provide structured feedback.
The target phrase is: "${targetPhrase}"
The user's attempt (transcribed) is: "${userAttempt}"

${languageInstruction}

Analyze the user's attempt against the target phrase and return your analysis as a single JSON object. The JSON structure itself (keys like "score", "feedback") must remain in English, but the string values for "feedback", "error", "explanation", and "exercises" must be in the specified language.
`;
};

const MINIMAL_PAIR_ANALYSIS_PROMPT = (userAttempt: string, targetWord: string, otherWord: string, focus: string, language: 'en' | 'zh' | 'ja') => {
  let languageInstruction = '';
  switch (language) {
    case 'zh':
      languageInstruction = '你的所有回答，包括反馈、解释和练习，都必须使用中文。';
      break;
    case 'ja':
      languageInstruction = 'あなたのすべての回答は、フィードバック、説明、練習問題を含め、すべて日本語でなければなりません。';
      break;
    case 'en':
    default:
      languageInstruction = 'All of your feedback, explanations, and exercises must be in English.';
      break;
  }
  
  return `
You are an expert American English pronunciation coach specializing in minimal pairs. Your task is to analyze a user's pronunciation of a target word and determine if they successfully distinguished it from its minimal pair counterpart.

The minimal pair focuses on the difference: ${focus}.
The target word is: "${targetWord}"
The other word in the pair is: "${otherWord}"
The user's attempt (transcribed) is: "${userAttempt}"

${languageInstruction}

Your primary goal is to assess whether the user's pronunciation of the key sound in "${targetWord}" was distinct and correct, or if it sounded like the key sound in "${otherWord}". For example, if the target is "sheep" (/iː/) and the other word is "ship" (/ɪ/), did the user produce a long /iː/ or a short /ɪ/? Provide very specific feedback on this distinction.

Return your analysis as a single JSON object. The JSON structure itself (keys like "score", "feedback") must remain in English, but the string values for "feedback", "error", "explanation", and "exercises" must be in the specified language.
`;
}

const INTONATION_ANALYSIS_PROMPT = (userAttempt: string, targetSentenceWithMarkers: string, pattern: string, language: 'en' | 'zh' | 'ja') => {
  let languageInstruction = '';
  switch (language) {
    case 'zh':
      languageInstruction = '你的所有回答，包括反馈、解释和练习，都必须使用中文。';
      break;
    case 'ja':
      languageInstruction = 'あなたのすべての回答は、フィードバック、説明、練習問題を含め、すべて日本語でなければなりません。';
      break;
    case 'en':
    default:
      languageInstruction = 'All of your feedback, explanations, and exercises must be in English.';
      break;
  }
  
  const cleanTargetSentence = targetSentenceWithMarkers.replace(/\*\*|~/g, '');

  return `
You are an expert American English pronunciation coach specializing in prosody (intonation, stress, and rhythm).
Your task is to analyze the user's intonation and stress in a given sentence.

The target sentence is: "${cleanTargetSentence}"
The sentence with intended stress markers is: "${targetSentenceWithMarkers}". Words enclosed in double asterisks are the primary stress points.
The key focus is on achieving the correct "${pattern}" intonation pattern.

The user's attempt (transcribed) is: "${userAttempt}"

${languageInstruction}

Analyze the following points. Your feedback should be encouraging but also precise and actionable.
1.  **Intonation Contour**: Did the user's pitch rise or fall correctly to match the "${pattern}" pattern? For example, for a Yes/No question, pitch should rise at the end. For a statement, it should fall.
2.  **Stress Placement**: Did the user correctly emphasize the words marked with asterisks? Was the stress strong enough?
3.  **Overall Rhythm**: Was the flow of the sentence natural and not choppy?

Provide specific feedback on these points. Example: "Your pitch correctly fell at the end of the statement, which is great. However, the stress on the word 'really' could be stronger to convey more emphasis."

Return your analysis as a single JSON object. The \`correctedPhrase\` in your response should be the clean sentence without any markers. The JSON structure must remain in English, but the string values must be in the specified language.
`;
}

const CONNECTED_SPEECH_ANALYSIS_PROMPT = (userAttempt: string, targetSentenceWithMarkers: string, feature: string, naturalSpeech: string, language: 'en' | 'zh' | 'ja') => {
  let languageInstruction = '';
  switch (language) {
    case 'zh':
      languageInstruction = '你的所有回答，包括反馈、解释和练习，都必须使用中文。';
      break;
    case 'ja':
      languageInstruction = 'あなたのすべての回答は、フィードバック、説明、練習問題を含め、すべて日本語でなければなりません。';
      break;
    case 'en':
    default:
      languageInstruction = 'All of your feedback, explanations, and exercises must be in English.';
      break;
  }
  
  const cleanTargetSentence = targetSentenceWithMarkers.replace(/~|\*\*/g, '');

  return `
You are an expert American English pronunciation coach specializing in connected speech.
Your task is to analyze if the user correctly uses natural linking, reductions, and sound changes.

The target phrase is: "${cleanTargetSentence}"
The phrase with connection markers is: "${targetSentenceWithMarkers}". The '~' marker indicates where sounds should link.
The specific feature we are practicing is: "${feature}".
In natural, fast speech, this often sounds like: "${naturalSpeech}".

The user's attempt (transcribed) is: "${userAttempt}"

${languageInstruction}

Analyze the user's attempt with a focus on connected speech.
1.  **Linking/Connections**: Did the user smoothly link the words where the '~' marker is? For example, in "an~apple", did it sound like one word ("anapple")?
2.  **Reductions/Elision**: Did the user use common reductions (e.g., "going to" -> "gonna") or drop sounds (e.g., the 't' in "next door") as indicated by the 'feature'?
3.  **Assimilation**: Did any sounds change as they blended together (e.g., "did you" -> "dijoo")?

Provide specific, actionable feedback on these points. For example: "Great job linking 'turn' and 'off'. I heard a clear 'turn-off' sound. However, you pronounced each word in 'what are you' separately. Try to blend them together to sound more like 'whaddaya'."

Return your analysis as a single JSON object. The \`correctedPhrase\` in your response should be the clean sentence. The JSON structure must remain in English, but the string values must be in the specified language.
`;
}

const SHADOWING_ANALYSIS_PROMPT = (userAttempt: string, targetPhrase: string, focus: string, language: 'en' | 'zh' | 'ja') => {
  let languageInstruction = '';
  switch (language) {
    case 'zh':
      languageInstruction = '你的所有回答，包括反馈、解释和练习，都必须使用中文。';
      break;
    case 'ja':
      languageInstruction = 'あなたのすべての回答は、フィードバック、説明、練習問題を含め、すべて日本語でなければなりません。';
      break;
    case 'en':
    default:
      languageInstruction = 'All of your feedback, explanations, and exercises must be in English.';
      break;
  }

  return `
You are an expert American English pronunciation coach specializing in prosody, acting as a "Prosody Coach". Your task is to analyze a user's attempt to "shadow" (imitate) a target phrase, focusing on musicality rather than just phonetic accuracy.

The target phrase is: "${targetPhrase}"
The user's attempt (transcribed) is: "${userAttempt}"
The practice focus for this phrase is: "${focus}"

${languageInstruction}

Analyze the user's attempt by comparing its prosody (rhythm, pitch, stress) to a standard American English rendering of the target phrase. Provide specific, actionable feedback on the following points:
1.  **Rhythm and Pacing**: Was the user's speed similar to a natural pace? Was it too fast, too slow, or choppy? Did they pause appropriately?
2.  **Intonation Contour**: Did the user's pitch rise and fall correctly? For instance, did their pitch fall at the end of a statement or rise for a question as expected for "${focus}"?
3.  **Stress Placement**: Did the user emphasize the key words in the phrase to convey the intended meaning?

Your feedback should be encouraging and focus on these prosodic elements. Example: "Your pacing was excellent, matching a natural conversational speed. For the next attempt, try to let your pitch fall a little more at the very end of the sentence to sound more conclusive." Avoid focusing on minor individual sound errors unless they significantly disrupt the rhythm.

Return your analysis as a single JSON object. The JSON structure must remain in English, but the string values must be in the specified language.
`;
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: 'An integer from 0 to 100 representing the overall pronunciation accuracy, with a heavy weight on correct prosody (intonation and stress) or connected speech features.' },
    correctedPhrase: { type: Type.STRING, description: 'The original target word or phrase, without any markers.' },
    feedback: { type: Type.STRING, description: 'A short, general, and encouraging feedback on the user\'s performance.' },
    errorPatterns: {
      type: Type.ARRAY,
      description: "An array of specific errors related to the practice drill (e.g., prosody, minimal pair distinction, connected speech). If no errors are found, this should be an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          error: { type: Type.STRING, description: 'A short description of the error.' },
          explanation: { type: Type.STRING, description: 'A detailed explanation of the error and the correct pattern.' },
          exercises: { type: Type.STRING, description: 'A sentence or two to practice the correct pattern.' },
        },
        required: ['error', 'explanation', 'exercises']
      }
    }
  },
  required: ['score', 'correctedPhrase', 'feedback', 'errorPatterns']
};


export default function App() {
  const isApiKeyConfigured = !!process.env.API_KEY;

  const [appState, setAppState] = useState<'idle' | 'recording' | 'confirming' | 'analyzing' | 'results' | 'levelComplete'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('phrase');
  const [adaptationDrill, setAdaptationDrill] = useState<AdaptationDrill>('minimal_pairs');
  const [difficulty, setDifficulty] = useState<Difficulty>('newbie');
  
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentPairWordIndex, setCurrentPairWordIndex] = useState(0); // 0 for word1, 1 for word2
  const [hasListened, setHasListened] = useState(false); // For shadowing mode
  
  const [language, setLanguage] = useState<'en' | 'zh' | 'ja'>('zh');
  
  const [userTranscription, setUserTranscription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [correctAudioUrl, setCorrectAudioUrl] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [analysisRetryCount, setAnalysisRetryCount] = useState(0);

  const isPhraseMode = practiceMode === 'phrase';
  const isSoundMode = practiceMode === 'sound';
  const isShadowingMode = practiceMode === 'shadowing';
  const isAdaptationMode = practiceMode === 'adaptation';

  let TARGET_PHRASE: string = '';
  let displayPhrase: string = '';
  let cardProgressText: string = '';
  let cardDescription: string | undefined = undefined;

  if (isPhraseMode) {
    const currentLibrary = PHRASE_LIBRARIES[difficulty].phrases;
    TARGET_PHRASE = currentLibrary[currentGroupIndex];
    displayPhrase = TARGET_PHRASE;
    cardProgressText = `Stage ${currentGroupIndex + 1} / ${currentLibrary.length}`;
  } else if (isSoundMode) {
    const currentLibrary = SOUND_PRACTICE_LIBRARIES[difficulty].soundGroups;
    const currentGroup = currentLibrary[currentGroupIndex];
    TARGET_PHRASE = currentGroup.words[currentWordIndex];
    displayPhrase = TARGET_PHRASE;
    const totalWordsInGroup = currentGroup.words.length;
    cardProgressText = `Word ${currentWordIndex + 1} / ${totalWordsInGroup}`;
    cardDescription = `Sound Group ${currentGroupIndex + 1} / ${currentLibrary.length}: ${currentGroup.name}`;
  } else if (isShadowingMode) {
    const currentLibrary = SHADOWING_LIBRARIES[difficulty].phrases;
    const currentPhrase = currentLibrary[currentGroupIndex];
    TARGET_PHRASE = currentPhrase.sentence;
    displayPhrase = TARGET_PHRASE;
    cardProgressText = `Phrase ${currentGroupIndex + 1} / ${currentLibrary.length}`;
    cardDescription = `Focus: ${currentPhrase.focus}`;
  } else if (isAdaptationMode) {
    switch (adaptationDrill) {
      case 'minimal_pairs':
        const minimalPairLibrary = MINIMAL_PAIR_LIBRARIES[difficulty].pairs;
        const currentPair = minimalPairLibrary[currentGroupIndex];
        TARGET_PHRASE = currentPairWordIndex === 0 ? currentPair.word1 : currentPair.word2;
        displayPhrase = `${currentPair.word1} / ${currentPair.word2}`;
        cardProgressText = `Pair ${currentGroupIndex + 1} / ${minimalPairLibrary.length}`;
        cardDescription = `${currentPair.focus} | Now say: "${TARGET_PHRASE}"`;
        break;
      case 'intonation':
        const intonationLibrary = INTONATION_LIBRARIES[difficulty].phrases;
        const currentIntonationPhrase = intonationLibrary[currentGroupIndex];
        TARGET_PHRASE = currentIntonationPhrase.sentence;
        displayPhrase = currentIntonationPhrase.sentence;
        cardProgressText = `Phrase ${currentGroupIndex + 1} / ${intonationLibrary.length}`;
        cardDescription = `Pattern: ${currentIntonationPhrase.pattern} | Type: ${currentIntonationPhrase.type}`;
        break;
      case 'connected_speech':
        const connectedSpeechLibrary = CONNECTED_SPEECH_LIBRARIES[difficulty].phrases;
        const currentConnectedPhrase = connectedSpeechLibrary[currentGroupIndex];
        TARGET_PHRASE = currentConnectedPhrase.sentence;
        displayPhrase = currentConnectedPhrase.sentence;
        cardProgressText = `Phrase ${currentGroupIndex + 1} / ${connectedSpeechLibrary.length}`;
        cardDescription = `Feature: ${currentConnectedPhrase.feature} | Sounds like: "${currentConnectedPhrase.naturalSpeech}"`;
        break;
      default:
        TARGET_PHRASE = "Select a drill above to begin your practice.";
        displayPhrase = TARGET_PHRASE;
        cardProgressText = "Advanced";
        break;
    }
  }


  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const userTranscriptionRef = useRef('');
  const audioChunksRef = useRef<Float32Array[]>([]);

  useEffect(() => {
    audioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    return () => {
      audioContextRef.current?.close();
      outputAudioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (appState === 'results' && analysisResult) {
      if (analysisResult.score === 100) {
        playPerfectScoreSound();
      } else if (analysisResult.score >= 80) {
        playSuccessSound();
      }
    }
  }, [analysisResult, appState]);


  const resetState = (isNewLevel: boolean = false) => {
    if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    if (correctAudioUrl) URL.revokeObjectURL(correctAudioUrl);
    
    setRecordedAudioUrl(null);
    setCorrectAudioUrl(null);
    userTranscriptionRef.current = '';
    audioChunksRef.current = [];
    setUserTranscription('');
    setAnalysisResult(null);
    setError(null);
    setHasListened(false);
    setAnalysisRetryCount(0);

    if (isNewLevel) {
      setCurrentGroupIndex(0);
      setCurrentWordIndex(0);
      setCurrentPairWordIndex(0);
    }
  };
  
  const stopRecordingCleanup = () => {
     if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
        mediaStreamSourceRef.current = null;
    }
    if(sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => {
        session.close();
        sessionPromiseRef.current = null;
      });
    }
  }

  const stopRecording = () => {
    stopRecordingCleanup();

    if (audioChunksRef.current.length > 0 && audioContextRef.current) {
      const wavBlob = createWavBlob(audioChunksRef.current, audioContextRef.current.sampleRate);
      const url = URL.createObjectURL(wavBlob);
      setRecordedAudioUrl(url);
    }

    if (!userTranscriptionRef.current.trim()) {
        setError("No speech was detected. Please try again.");
        setAppState('results');
        return;
    }
    setAppState('confirming');
  };

  const handleAnalyze = async () => {
    setAppState('analyzing');
    setAttemptCount(prev => prev + 1);
    setError(null);

    const maxRetries = 2; // Total 3 attempts

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            setAnalysisRetryCount(attempt);

            if (attempt > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
            let prompt;
            let phraseForTts = TARGET_PHRASE.replace(/\*\*|~/g, '');

            if (isAdaptationMode) {
              switch (adaptationDrill) {
                case 'minimal_pairs':
                  const currentPair = MINIMAL_PAIR_LIBRARIES[difficulty].pairs[currentGroupIndex];
                  const otherWord = currentPairWordIndex === 0 ? currentPair.word2 : currentPair.word1;
                  prompt = MINIMAL_PAIR_ANALYSIS_PROMPT(userTranscriptionRef.current, TARGET_PHRASE, otherWord, currentPair.focus, language);
                  phraseForTts = TARGET_PHRASE;
                  break;
                case 'intonation':
                  const currentIntonationPhrase = INTONATION_LIBRARIES[difficulty].phrases[currentGroupIndex];
                  prompt = INTONATION_ANALYSIS_PROMPT(userTranscriptionRef.current, currentIntonationPhrase.sentence, currentIntonationPhrase.pattern, language);
                  break;
                case 'connected_speech':
                  const currentConnectedPhrase = CONNECTED_SPEECH_LIBRARIES[difficulty].phrases[currentGroupIndex];
                  prompt = CONNECTED_SPEECH_ANALYSIS_PROMPT(userTranscriptionRef.current, currentConnectedPhrase.sentence, currentConnectedPhrase.feature, currentConnectedPhrase.naturalSpeech, language);
                  break;
                default:
                  prompt = ANALYSIS_PROMPT(userTranscriptionRef.current, phraseForTts, language);
                  break;
              }
            } else if (isShadowingMode) {
                const currentShadowingPhrase = SHADOWING_LIBRARIES[difficulty].phrases[currentGroupIndex];
                prompt = SHADOWING_ANALYSIS_PROMPT(userTranscriptionRef.current, currentShadowingPhrase.sentence, currentShadowingPhrase.focus, language);
            } else {
                prompt = ANALYSIS_PROMPT(userTranscriptionRef.current, phraseForTts, language);
            }

            const analysisResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: analysisSchema,
                },
            });
            
            const result: AnalysisResult = JSON.parse(analysisResponse.text);
            setAnalysisResult(result);

            if (result.correctedPhrase) {
               try {
                 await playAudioForText(result.correctedPhrase);
               } catch (ttsError) {
                 console.error("TTS generation failed, but analysis succeeded:", ttsError);
               }
            }
            
            setAppState('results');
            return; // Success!

        } catch (err: any) {
            console.error(`Analysis error (attempt ${attempt + 1}):`, err);

            const errorMessage = err.message || '';
            const isQuotaError = errorMessage.includes('exceeded your current quota');
            const isRateLimitError = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');

            if (isQuotaError) {
                let quotaErrorMessage: string;
                switch (language) {
                    case 'zh':
                        quotaErrorMessage = "您已超出当天的 API 配额。请检查您的套餐和账单详情。暂时无法进行分析。";
                        break;
                    case 'ja':
                        quotaErrorMessage = "1日のAPIクォータを超えました。プランと請求の詳細を確認してください。現在、分析は利用できません。";
                        break;
                    case 'en':
                    default:
                        quotaErrorMessage = "You have exceeded your daily API quota. Please check your plan and billing details. Analysis is unavailable for now.";
                        break;
                }
                setError(quotaErrorMessage);
                setAppState('results');
                break; // Stop retrying immediately
            }
            
            if (isRateLimitError && attempt < maxRetries) {
                continue; // Retry on other (non-quota) rate limit errors
            } else if (isRateLimitError && attempt >= maxRetries) {
                setError("The server is currently busy. Please wait a moment and try again.");
                setAppState('results');
            } else {
                setError("Sorry, an error occurred during the analysis. Please check your connection and try again.");
                setAppState('results');
                break; // Exit loop on other errors
            }
        }
    }
  };
  
  const playAudioForText = async (textToSpeak: string) => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const ttsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: textToSpeak }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
      });
      
      const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && outputAudioContextRef.current) {
        if (outputAudioContextRef.current.state === 'suspended') {
          await outputAudioContextRef.current.resume();
        }
        const outCtx = outputAudioContextRef.current;
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            outCtx,
            24000,
            1
        );
        
        const wavBlob = audioBufferToWavBlob(audioBuffer);
        const url = URL.createObjectURL(wavBlob);
        setCorrectAudioUrl(url); // Set this so waveform can be displayed
        
        const source = outCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outCtx.destination);
        source.start(0);
      }
  }

  const handleListen = async () => {
    try {
      const phraseToHear = TARGET_PHRASE.replace(/\*\*|~/g, '');
      await playAudioForText(phraseToHear);
      setHasListened(true);
    } catch (e) {
      console.error("Error playing reference audio:", e);
      setError("Could not play reference audio. Please try again.");
    }
  };

  const startRecording = async () => {
    resetState();
    setAppState('recording');

    try {
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      if (outputAudioContextRef.current?.state === 'suspended') {
        await outputAudioContextRef.current.resume();
      }
      if (!audioContextRef.current || !outputAudioContextRef.current) {
        throw new Error("Audio contexts failed to initialize.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: { 
            responseModalities: [Modality.AUDIO], 
            inputAudioTranscription: {} 
        },
        callbacks: {
          onopen: () => {
            const currentAudioContext = audioContextRef.current;
            if (!currentAudioContext || !streamRef.current) {
              console.error("AudioContext or MediaStream not available in onopen");
              return;
            }
            mediaStreamSourceRef.current = currentAudioContext.createMediaStreamSource(streamRef.current);
            scriptProcessorRef.current = currentAudioContext.createScriptProcessor(4096, 1, 1);

            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              audioChunksRef.current.push(new Float32Array(inputData));

              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then((session) => session.sendRealtimeInput({ media: pcmBlob }));
            };

            mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(currentAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              userTranscriptionRef.current += text;
              setUserTranscription(userTranscriptionRef.current);
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('API Error:', e);
            setError(`An error occurred: ${e.message}. Please try again.`);
            stopRecordingCleanup();
            setAppState('results');
          },
          onclose: () => console.log('Session closed'),
        },
      });

    } catch (err: any) {
      console.error(err);
      setError(`Failed to start recording: ${err.message}. Please check microphone permissions.`);
      setAppState('idle');
    }
  };
  
  const handleNextStage = () => {
    let nextIndex, libraryLength;
    if (isPhraseMode || isShadowingMode) {
        const currentLibrary = isPhraseMode ? PHRASE_LIBRARIES[difficulty].phrases : SHADOWING_LIBRARIES[difficulty].phrases;
        nextIndex = currentGroupIndex + 1;
        libraryLength = currentLibrary.length;
    } else if (isSoundMode) {
        const currentLibrary = SOUND_PRACTICE_LIBRARIES[difficulty].soundGroups;
        const currentGroup = currentLibrary[currentGroupIndex];
        const nextWordIndex = currentWordIndex + 1;
        if (nextWordIndex >= currentGroup.words.length) {
            const nextGroupIndex = currentGroupIndex + 1;
            if (nextGroupIndex >= currentLibrary.length) {
                setAppState('levelComplete');
            } else {
                setCurrentGroupIndex(nextGroupIndex);
                setCurrentWordIndex(0);
                resetState();
                setAttemptCount(0);
                setAppState('idle');
            }
        } else {
            setCurrentWordIndex(nextWordIndex);
            resetState();
            setAttemptCount(0);
            setAppState('idle');
        }
        return;
    } else if (isAdaptationMode) {
        if (adaptationDrill === 'minimal_pairs') {
            const currentLibrary = MINIMAL_PAIR_LIBRARIES[difficulty].pairs;
            if (currentPairWordIndex === 0) {
                setCurrentPairWordIndex(1);
                resetState();
                setAttemptCount(0);
                setAppState('idle');
            } else {
                const nextPairIndex = currentGroupIndex + 1;
                if (nextPairIndex >= currentLibrary.length) {
                    setAppState('levelComplete');
                } else {
                    setCurrentGroupIndex(nextPairIndex);
                    setCurrentPairWordIndex(0);
                    resetState();
                    setAttemptCount(0);
                    setAppState('idle');
                }
            }
            return;
        } else if (adaptationDrill === 'intonation' || adaptationDrill === 'connected_speech') {
            const isIntonation = adaptationDrill === 'intonation';
            const currentLibrary = isIntonation ? INTONATION_LIBRARIES[difficulty].phrases : CONNECTED_SPEECH_LIBRARIES[difficulty].phrases;
            nextIndex = currentGroupIndex + 1;
            libraryLength = currentLibrary.length;
        } else {
             return;
        }
    } else {
        return;
    }

    if (nextIndex >= libraryLength) {
        setAppState('levelComplete');
    } else {
        setCurrentGroupIndex(nextIndex);
        resetState();
        setAttemptCount(0);
        setAppState('idle');
    }
  };

  const handleNextLevel = () => {
    const difficultyLevels = Object.keys(PHRASE_LIBRARIES) as Difficulty[];
    const currentDifficultyIndex = difficultyLevels.indexOf(difficulty);
    const nextDifficultyIndex = (currentDifficultyIndex + 1) % difficultyLevels.length;
    const nextDifficulty = difficultyLevels[nextDifficultyIndex];
    
    setDifficulty(nextDifficulty);
    resetState(true);
    setAttemptCount(0);
    setAppState('idle');
  };

  const handleReplayLevel = () => {
      resetState(true);
      setAttemptCount(0);
      setAppState('idle');
  };
  
  const getNextButtonText = () => {
    if (isPhraseMode || isShadowingMode) return 'Next Stage →';
    if (isSoundMode) {
      const soundGroups = SOUND_PRACTICE_LIBRARIES[difficulty].soundGroups;
      const currentGroup = soundGroups[currentGroupIndex];
      return currentWordIndex < currentGroup.words.length - 1 ? 'Next Word →' : 'Next Sound Group →';
    }
    if (isAdaptationMode) {
      if (adaptationDrill === 'minimal_pairs') {
        return currentPairWordIndex === 0 ? 'Practice Next Word →' : 'Next Pair →';
      }
      if (adaptationDrill === 'intonation' || adaptationDrill === 'connected_speech') {
        return 'Next Phrase →';
      }
    }
    return 'Next →';
  };

  if (!isApiKeyConfigured) {
    return <ApiKeyErrorScreen />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow">
        <Header />
        
        <PracticeModeSelector 
          currentMode={practiceMode}
          onModeChange={(mode) => {
            setPracticeMode(mode);
            resetState(true);
            setAttemptCount(0);
            setAppState('idle');
          }}
          disabled={appState !== 'idle' && appState !== 'levelComplete'}
        />

        {isAdaptationMode ? (
            <AdaptationDrillSelector
                currentDrill={adaptationDrill}
                onDrillChange={(drill) => {
                  setAdaptationDrill(drill);
                  resetState(true);
                  setAttemptCount(0);
                  setAppState('idle');
                }}
                disabled={appState !== 'idle' && appState !== 'levelComplete'}
            />
        ) : (
            <DifficultySelector 
                currentDifficulty={difficulty}
                onDifficultyChange={(newDifficulty) => {
                    setDifficulty(newDifficulty);
                    resetState(true);
                    setAttemptCount(0);
                }}
                disabled={appState !== 'idle' && appState !== 'levelComplete'}
            />
        )}

        <LanguageSwitcher
          currentLanguage={language}
          onLanguageChange={setLanguage}
          disabled={appState === 'recording' || appState === 'analyzing'}
        />

        <main className="flex-grow flex flex-col items-center justify-center space-y-8 mt-4">
          {appState !== 'levelComplete' ? (
            <>
              <PronunciationCard
                phrase={displayPhrase}
                audioUrl={correctAudioUrl}
                progressText={cardProgressText}
                description={cardDescription}
              />
          
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                     <TranscriptionDisplay title="You Said" text={userTranscription} recordedAudioUrl={recordedAudioUrl} />
                  </div>
                  <ScoreDisplay
                    score={analysisResult?.score ?? null}
                    isHighScore={(analysisResult?.score ?? 0) >= 80}
                    isPerfectScore={analysisResult?.score === 100}
                  />
              </div>

              {appState === 'results' && recordedAudioUrl && correctAudioUrl && (
                <WaveformComparison userAudioUrl={recordedAudioUrl} correctAudioUrl={correctAudioUrl} />
              )}
              
              <div className="w-full space-y-6">
                {analysisResult && <FeedbackCard feedback={analysisResult?.feedback ?? ''} />}
                {analysisResult && <ErrorPatternsCard patterns={analysisResult?.errorPatterns ?? []} />}
              </div>
            </>
          ) : (
            <LevelCompleteAnimation
              difficulty={difficulty}
              onNextLevel={handleNextLevel}
              onReplayLevel={handleReplayLevel}
            />
          )}

          <StatusMessage isLoading={appState === 'analyzing'} error={error} retryCount={analysisRetryCount} />
        </main>

        <footer className="w-full flex justify-center py-6 sticky bottom-0 bg-gray-900/80 backdrop-blur-sm h-28 items-center">
          {appState === 'idle' && practiceMode !== 'shadowing' && <RecordButton isRecording={false} onClick={startRecording} />}
          {appState === 'idle' && practiceMode === 'shadowing' && (
             <div className="flex items-center space-x-4">
               <Button onClick={handleListen} variant="primary" size="lg">Listen 🔊</Button>
               {hasListened && <RecordButton isRecording={false} onClick={startRecording} />}
            </div>
          )}
          {appState === 'recording' && <RecordButton isRecording={true} onClick={stopRecording} />}
          {appState === 'confirming' && (
            <div className="flex items-center space-x-4">
              <Button onClick={startRecording} variant="secondary" size="lg">Record Again</Button>
              <Button onClick={handleAnalyze} variant="primary" size="lg">Analyze Pronunciation</Button>
            </div>
          )}
          {appState === 'results' && (
             <div className="flex items-center space-x-4">
                <Button onClick={startRecording} variant="secondary" size="lg">Try Again</Button>
                {(analysisResult?.score ?? 0) >= 80 ? (
                    <Button onClick={handleNextStage} variant="primary" size="lg">
                        {getNextButtonText()}
                    </Button>
                ) : attemptCount >= 3 && (
                    <Button onClick={handleNextStage} variant="secondary" size="lg">
                        Skip →
                    </Button>
                )}
             </div>
          )}
        </footer>
      </div>
    </div>
  );
}
