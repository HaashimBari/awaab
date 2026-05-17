import { Audio } from 'expo-av';
import { useCallback, useRef, useState } from 'react';
import type { DhikrId } from '../constants/dhikr';
import { matchDhikr } from '../lib/dhikrMatcher';
import { transcribeAudio } from '../lib/whisper';

export type VoiceState = 'idle' | 'recording' | 'processing' | 'error';

export function useVoiceRecognition(onMatch: (id: DhikrId) => void) {
  const [state, setState] = useState<VoiceState>('idle');
  const [lastError, setLastError] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setLastError(null);
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        setLastError('Microphone permission denied');
        setState('error');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      setState('recording');
    } catch (err) {
      console.error('startRecording error:', err);
      setLastError('Could not start recording');
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
      const matched = matchDhikr(transcript);

      if (matched) {
        onMatch(matched);
      } else {
        setLastError(`Could not recognise dhikr: "${transcript}"`);
      }
      setState('idle');
    } catch (err) {
      console.error('stopRecording error:', err);
      setLastError('Could not process recording');
      setState('error');
      recordingRef.current = null;
    }
  }, [onMatch]);

  const clearError = useCallback(() => {
    setLastError(null);
    setState('idle');
  }, []);

  return { state, lastError, startRecording, stopRecording, clearError };
}
