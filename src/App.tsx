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
import type { AnalysisResult } from './types';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { playSuccessSound } from './utils/sfx';
import { PHRASE_LIBRARIES, Difficulty } from './data/phrases';
import { DifficultySelector } from './components/DifficultySelector';
import { ApiKeyErrorScreen } from './components/ApiKeyErrorScreen';
// REFACTOR: Import the new reusable Button component.
import { Button } from './components/Button';
// NEW_FEATURE: Import the custom hook for keyboard shortcuts.
import { useHotkeys } from './hooks/useHotkeys';


const ANALYSIS_PROMPT = (userAttempt: string, targetPhrase: string, language: 'en' | 'zh') => {
  const languageInstruction = language === 'zh'
    ? '你的所有回答，包括反馈、解释和练习，都必须使用中文。'
    : 'All of your feedback, explanations, and exercises must be in English.';

  return `
You are an expert American English pronunciation coach. Your task is to analyze a user's pronunciation of a given phrase and provide structured feedback.
The target phrase is: "${targetPhrase}"
The user's attempt (transcribed) is: "${userAttempt}"

${languageInstruction}

Analyze the user's attempt against the target phrase and return your analysis as a single JSON object. The JSON structure itself (keys like "score", "feedback") must remain in English, but the string values for "feedback", "error", "explanation", and "exercises" must be in the specified language.
`;
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: 'An integer from 0 to 100 representing the overall pronunciation accuracy. A higher score is better.' },
    correctedPhrase: { type: Type.STRING, description: 'The original target phrase.' },
    feedback: { type: Type.STRING, description: 'A short, general, and encouraging feedback on the user\'s pronunciation.' },
    errorPatterns: {
      type: Type.ARRAY,
      description: "An array of specific pronunciation errors. If no errors are found, this should be an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          error: { type: Type.STRING, description: 'A short description of the error (e.g., "\'th\' sound in \'the\' pronounced as \'d\'").' },
          explanation: { type: Type.STRING, description: 'A detailed explanation of the error, explaining the correct tongue/lip placement.' },
          exercises: { type: Type.STRING, description: 'A list of words or short sentences to practice the correct sound.' },
        },
        required: ['error', 'explanation', 'exercises']
      }
    }
  },
  required: ['score', 'correctedPhrase', 'feedback', 'errorPatterns']
};

// NEW_FEATURE: Constants for the API retry mechanism.
const MAX_ANALYSIS_RETRIES = 3;
const RETRY_DELAY_MS = 1500;


export default function App() {
  const isApiKeyConfigured = !!process.env.API_KEY;

  const [appState, setAppState] = useState<'idle' | 'recording' | 'confirming' | 'analyzing' | 'results' | 'levelComplete'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const [difficulty, setDifficulty] = useState<Difficulty>('newbie');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  
  const TARGET_PHRASE = PHRASE_LIBRARIES[difficulty].phrases[currentPhraseIndex];
  
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  
  const [userTranscription, setUserTranscription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [correctAudioUrl, setCorrectAudioUrl] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  // NEW_FEATURE: State to track the number of API call retries.
  const [retryCount, setRetryCount] = useState(0);

  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  // PERFORMANCE_OPTIMIZATION: Create persistent AudioContexts to avoid expensive re-initialization on every recording.
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const userTranscriptionRef = useRef('');
  const audioChunksRef = useRef<Float32Array[]>([]);
  // FIX: Add a ref to track the session's active state to prevent race conditions.
  const isSessionActiveRef = useRef(false);


  // PERFORMANCE_OPTIMIZATION: Initialize AudioContexts only once on component mount.
  useEffect(() => {
    audioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    return () => {
      audioContextRef.current?.close();
      outputAudioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (appState === 'results' && (analysisResult?.score ?? 0) >= 80) {
      playSuccessSound();
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
    // NEW_FEATURE: Reset the retry counter on a full state reset.
    setRetryCount(0);

    if (isNewLevel) {
      setCurrentPhraseIndex(0);
    }
  };
  
  const stopRecordingCleanup = () => {
     // FIX: Set the session active flag to false immediately on cleanup.
     isSessionActiveRef.current = false;
     if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    // PERFORMANCE_OPTIMIZATION: Disconnect nodes but don't close the persistent AudioContext.
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
    setRetryCount(0);
    setError(null);

    // NEW_FEATURE: Implement a retry loop for the API call.
    for (let attempt = 0; attempt < MAX_ANALYSIS_RETRIES; attempt++) {
      try {
        setRetryCount(attempt); // Update UI to show current attempt

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const analysisResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: ANALYSIS_PROMPT(userTranscriptionRef.current, TARGET_PHRASE, language),
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });
        
        const result: AnalysisResult = JSON.parse(analysisResponse.text);
        setAnalysisResult(result);

        if (result.correctedPhrase) {
           try {
             await playCorrectedAudio(ai, result.correctedPhrase);
           } catch (ttsError) {
             console.error("TTS generation failed, but analysis succeeded:", ttsError);
           }
        }
        
        setAppState('results');
        return; // Success, so we exit the function entirely.

      } catch (err: any) {
        console.error(`Analysis attempt ${attempt + 1} failed:`, err);
        
        if (attempt < MAX_ANALYSIS_RETRIES - 1) {
          // If it's not the last attempt, wait before trying again.
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          // This was the final attempt. Set a specific error message.
          setError("Analysis failed after multiple attempts. Please check your internet connection and try again.");
          setAppState('results');
          return; // Exit function after final failure.
        }
      }
    }
  };
  
  const playCorrectedAudio = async (ai: GoogleGenAI, textToSpeak: string) => {
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
        const outCtx = outputAudioContextRef.current;
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            outCtx,
            24000,
            1
        );
        
        const wavBlob = audioBufferToWavBlob(audioBuffer);
        const url = URL.createObjectURL(wavBlob);
        setCorrectAudioUrl(url);
        
        const source = outCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outCtx.destination);
        source.start(0);
      }
  }

  const startRecording = async () => {
    resetState();
    setAppState('recording');

    try {
      // PERFORMANCE_OPTIMIZATION: Resume persistent AudioContexts as per browser policy.
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

      isSessionActiveRef.current = true; // Set active flag before connecting.

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: { 
            responseModalities: [Modality.AUDIO], 
            inputAudioTranscription: {} 
        },
        callbacks: {
          onopen: () => {
            // FIX: Check if the session is still considered active before proceeding.
            if (!isSessionActiveRef.current) {
              console.warn("Ignoring onopen because session is no longer active.");
              return;
            }

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
    const currentLevelPhrases = PHRASE_LIBRARIES[difficulty].phrases;
    const nextIndex = currentPhraseIndex + 1;

    if (nextIndex >= currentLevelPhrases.length) {
      setAppState('levelComplete');
    } else {
      setCurrentPhraseIndex(nextIndex);
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

  // NEW_FEATURE: Setup keyboard shortcuts.
  useHotkeys([
    {
      key: ' ', // Spacebar
      callback: () => {
        if (appState === 'idle') {
          startRecording();
        } else if (appState === 'recording') {
          stopRecording();
        }
      },
    },
    {
      key: 'Enter',
      callback: () => {
        if (appState === 'confirming') {
          handleAnalyze();
        } else if (appState === 'results' && (analysisResult?.score ?? 0) >= 80) {
          handleNextStage();
        } else if (appState === 'levelComplete') {
          handleNextLevel();
        }
      },
    },
  ]);


  // REFACTOR: The FooterButton component has been removed and replaced by the generic Button component.
  if (!isApiKeyConfigured) {
    return <ApiKeyErrorScreen />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow">
        <Header />
        
        <DifficultySelector 
            currentDifficulty={difficulty}
            onDifficultyChange={(newDifficulty) => {
                setDifficulty(newDifficulty);
                resetState(true);
                setAttemptCount(0);
            }}
            disabled={appState !== 'idle'}
        />

        <LanguageSwitcher
          currentLanguage={language}
          onLanguageChange={setLanguage}
          disabled={appState === 'recording' || appState === 'analyzing'}
        />

        <main className="flex-grow flex flex-col items-center space-y-8 mt-4">
          {appState !== 'levelComplete' ? (
            <>
              <PronunciationCard
                phrase={TARGET_PHRASE}
                audioUrl={correctAudioUrl}
                stage={currentPhraseIndex + 1}
                totalStages={PHRASE_LIBRARIES[difficulty].phrases.length}
              />
          
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                     <TranscriptionDisplay title="You Said" text={userTranscription} recordedAudioUrl={recordedAudioUrl} />
                  </div>
                  <ScoreDisplay
                    score={analysisResult?.score ?? null}
                    isHighScore={(analysisResult?.score ?? 0) >= 80}
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
            <div className="text-center p-10 bg-gray-800 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-green-400">Level Cleared!</h2>
              <p className="mt-2 text-gray-300">You've mastered the {PHRASE_LIBRARIES[difficulty].name} level.</p>
            </div>
          )}

          <StatusMessage isLoading={appState === 'analyzing'} error={error} retryCount={retryCount} />
        </main>

        <footer className="w-full flex justify-center py-6 sticky bottom-0 bg-gray-900/80 backdrop-blur-sm">
          {appState === 'idle' && <RecordButton isRecording={false} onClick={startRecording} />}
          {appState === 'recording' && <RecordButton isRecording={true} onClick={stopRecording} />}
          {/* REFACTOR: All buttons now use the new, standardized Button component for consistency and maintainability. */}
          {appState === 'confirming' && (
            <div className="flex items-center space-x-4">
              <Button onClick={startRecording} variant="secondary" size="lg">Record Again</Button>
              <Button onClick={handleAnalyze} variant="primary" size="lg">Analyze Pronunciation</Button>
            </div>
          )}
          {appState === 'results' && (
             <div className="flex items-center space-x-4">
                <Button onClick={startRecording} variant="secondary" size="lg">Try Again</Button>
                
                {/* On high score, show Next Stage button */}
                {(analysisResult?.score ?? 0) >= 80 && (
                    <Button onClick={handleNextStage} variant="primary" size="lg">
                        Next Stage →
                    </Button>
                )}

                {/* If score is low after 3+ attempts, show Skip Stage button */}
                {(analysisResult?.score ?? 0) < 80 && attemptCount >= 3 && (
                    <Button onClick={handleNextStage} variant="secondary" size="lg">
                        Skip Stage →
                    </Button>
                )}
             </div>
          )}
          {appState === 'levelComplete' && (
             <div className="flex items-center space-x-4">
                <Button onClick={() => {
                    resetState(true);
                    setAttemptCount(0);
                    setAppState('idle');
                }} variant="secondary" size="lg">
                    Replay Level
                </Button>
                <Button onClick={handleNextLevel} variant="primary" size="lg">
                    Next Level →
                </Button>
             </div>
          )}
        </footer>
      </div>
    </div>
  );
}