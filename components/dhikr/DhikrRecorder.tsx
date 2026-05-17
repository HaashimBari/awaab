import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import type { DhikrItem } from '../../constants/dhikr';
import { usePronunciationRecorder } from '../../hooks/usePronunciationRecorder';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { PronunciationFeedback } from './PronunciationFeedback';

interface Props {
  dhikr: DhikrItem;
  repetition: number;   // which repetition this is (1-based, for count > 1)
  onComplete: () => void;
}

export function DhikrRecorder({ dhikr, repetition, onComplete }: Props) {
  const { state, result, error, startRecording, stopRecording, reset } =
    usePronunciationRecorder(dhikr);

  const pulse = useSharedValue(1);

  React.useEffect(() => {
    if (state === 'recording') {
      pulse.value = withRepeat(withTiming(1.15, { duration: 700 }), -1, true);
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(1, { duration: 150 });
    }
  }, [state]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: state === 'recording' ? 0.35 : 0,
  }));

  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';
  const isDone = state === 'done';

  const btnColor = isRecording ? '#E03030' : isDone ? Colors.success : Colors.primary;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Repetition indicator */}
      {dhikr.count > 1 && (
        <Text style={styles.repIndicator}>
          Repetition {repetition} of {dhikr.count}
        </Text>
      )}

      {/* Arabic text */}
      <View style={styles.arabicCard}>
        <Text style={styles.arabic}>{dhikr.arabic}</Text>
        <Text style={styles.transliteration}>{dhikr.transliteration}</Text>
        <Text style={styles.translation}>{dhikr.translation}</Text>
      </View>

      {/* Feedback */}
      {isDone && result && (
        <PronunciationFeedback result={result} />
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Record button */}
      <View style={styles.recordArea}>
        <View>
          <Animated.View
            style={[styles.pulseBg, { backgroundColor: btnColor }, pulseStyle]}
            pointerEvents="none"
          />
          <Pressable
            style={[styles.recordBtn, { backgroundColor: btnColor }]}
            onPressIn={state === 'idle' || state === 'error' ? startRecording : undefined}
            onPressOut={isRecording ? stopRecording : undefined}
            disabled={isProcessing}
          >
            <Text style={styles.recordIcon}>
              {isRecording ? '⏹' : isProcessing ? '⏳' : isDone ? '🔄' : '🎙'}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.recordHint}>
          {isRecording
            ? 'Release when done'
            : isProcessing
              ? 'Scoring…'
              : isDone
                ? 'Hold to try again'
                : 'Hold & recite'}
        </Text>
      </View>

      {/* Next / Skip buttons */}
      <View style={styles.actions}>
        {isDone && (
          <Pressable style={styles.btnPrimary} onPress={() => { reset(); onComplete(); }}>
            <Text style={styles.btnPrimaryText}>
              {repetition < dhikr.count ? `Next (${repetition + 1}/${dhikr.count})` : 'Continue →'}
            </Text>
          </Pressable>
        )}
        <Pressable style={styles.btnSkip} onPress={onComplete}>
          <Text style={styles.btnSkipText}>Skip</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.lg,
    alignItems: 'center',
    flexGrow: 1,
  },
  repIndicator: {
    fontSize: FontSize.label,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  arabicCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    width: '100%',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  arabic: {
    fontSize: FontSize.arabicLarge,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 52,
    fontWeight: '600',
  },
  transliteration: {
    fontSize: FontSize.body,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  translation: {
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: '#4A1A1A',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    width: '100%',
  },
  errorText: { color: '#FF6B6B', fontSize: FontSize.label, textAlign: 'center' },
  recordArea: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pulseBg: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    top: -4,
    left: -4,
  },
  recordBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  recordIcon: { fontSize: 30 },
  recordHint: {
    color: Colors.textSecondary,
    fontSize: FontSize.label,
    fontWeight: '500',
  },
  actions: { width: '100%', gap: Spacing.sm },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#0A1628', fontWeight: '700', fontSize: FontSize.body },
  btnSkip: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnSkipText: { color: Colors.textMuted, fontSize: FontSize.label },
});
