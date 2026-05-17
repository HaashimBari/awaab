import { Audio } from 'expo-av';
import { useCallback, useRef, useState } from 'react';
import type { DhikrItem } from '../constants/dhikr';
import { scorePronunciation } from '../lib/groq';
import { transcribeAudio } from '../lib/whisper';

export type RecorderState = 'idle' | 'recording' | 'processing' | 'done' | 'error';

export interface PronunciationResult {
  score: number;
  feedback: string;
  transcript: string;
}

export function usePronunciationRecorder(dhikr: DhikrItem) {
  const [state, setState] = useState<RecorderState>('idle');
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setResult(null);
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        setError('Microphone permission denied');
        setState('error');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      setState('recording');
    } catch {
      setError('Could not start recording');
      setState('error');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording) return;

    try {
      setState('processing');
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      recordingRef.current = null;
      if (!uri) throw new Error('No audio URI');

      const transcript = await transcribeAudio(uri);
      const { score, feedback } = await scorePronunciation(dhikr, transcript);
      setResult({ score, feedback, transcript });
      setState('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not process recording';
      setError(msg);
      setState('error');
      recordingRef.current = null;
    }
  }, [dhikr]);

  const reset = useCallback(() => {
    setState('idle');
    setResult(null);
    setError(null);
  }, []);

  return { state, result, error, startRecording, stopRecording, reset };
}
