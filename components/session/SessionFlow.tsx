import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DhikrItem } from '../../constants/dhikr';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import { TasbihCounter } from '../dhikr/TasbihCounter';
import { DhikrRecorder } from '../dhikr/DhikrRecorder';
import { VoiceButton } from '../dhikr/VoiceButton';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import type { DhikrId } from '../../constants/dhikr';
import { SessionComplete } from './SessionComplete';
import { saveSession } from '../../lib/storage';

interface Props {
  dhikrList: DhikrItem[];
  category: string;
  title: string;
}

// Each step = one dhikr item + which repetition (for count > 1 non-tasbih)
interface Step {
  dhikr: DhikrItem;
  repetition: number; // 1-based
}

function buildSteps(list: DhikrItem[]): Step[] {
  const steps: Step[] = [];
  for (const dhikr of list) {
    if (dhikr.isTasbih) {
      // Tasbih items are a single step (the counter handles all repetitions)
      steps.push({ dhikr, repetition: 1 });
    } else {
      // Recite items get one step per repetition
      for (let i = 1; i <= dhikr.count; i++) {
        steps.push({ dhikr, repetition: i });
      }
    }
  }
  return steps;
}

export function SessionFlow({ dhikrList, category, title }: Props) {
  const steps = React.useMemo(() => buildSteps(dhikrList), [dhikrList]);
  const [stepIndex, setStepIndex] = useState(0);
  const [tasbihCounts, setTasbihCounts] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const sessionStart = useRef(Date.now());

  const currentStep = steps[stepIndex];

  const advance = useCallback(() => {
    if (stepIndex + 1 >= steps.length) {
      setIsComplete(true);
      const now = Date.now();
      saveSession({
        id: String(now),
        date: new Date().toISOString().slice(0, 10),
        category,
        completedAt: new Date().toISOString(),
        durationMs: now - sessionStart.current,
        totalCompleted: steps.length,
      }).catch(console.error);
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [stepIndex, steps.length, category]);

  const incrementTasbih = useCallback(
    (id: DhikrId) => {
      if (!currentStep || currentStep.dhikr.id !== id) return;
      setTasbihCounts((prev) => {
        const next = (prev[id] ?? 0) + 1;
        const updated = { ...prev, [id]: next };
        if (next >= currentStep.dhikr.count) {
          // auto-advance after a short tick
          setTimeout(() => advance(), 600);
        }
        return updated;
      });
    },
    [currentStep, advance],
  );

  const { state: voiceState, lastError, startRecording, stopRecording, clearError } =
    useVoiceRecognition(incrementTasbih);

  const reset = useCallback(() => {
    setStepIndex(0);
    setTasbihCounts({});
    setIsComplete(false);
    sessionStart.current = Date.now();
  }, []);

  if (!currentStep) return null;

  const progress = stepIndex / steps.length;
  const isTasbihStep = currentStep.dhikr.isTasbih;
  const tasbihCount = tasbihCounts[currentStep.dhikr.id] ?? 0;

  return (
    <>
      <View style={styles.container}>
        {/* Header progress */}
        <View style={styles.header}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.stepText}>
            {stepIndex + 1} / {steps.length}
          </Text>
        </View>

        {/* Step content */}
        <View style={styles.content}>
          {isTasbihStep ? (
            <>
              <TasbihCounter
                dhikr={currentStep.dhikr}
                count={tasbihCount}
                onTap={() => incrementTasbih(currentStep.dhikr.id as DhikrId)}
                isActive
              />
              {lastError && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{lastError}</Text>
                  <Text style={styles.errorDismiss} onPress={clearError}>✕</Text>
                </View>
              )}
              <View style={styles.voiceArea}>
                <Text style={styles.hint}>
                  Tap or hold & speak {currentStep.dhikr.transliteration}
                </Text>
                <VoiceButton
                  state={voiceState}
                  onPressIn={startRecording}
                  onPressOut={stopRecording}
                />
              </View>
            </>
          ) : (
            <DhikrRecorder
              dhikr={currentStep.dhikr}
              repetition={currentStep.repetition}
              onComplete={advance}
            />
          )}
        </View>
      </View>

      <SessionComplete
        visible={isComplete}
        durationMs={Date.now() - sessionStart.current}
        onReset={reset}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.xs,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  stepText: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  content: { flex: 1 },
  voiceArea: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  hint: { color: Colors.textSecondary, fontSize: FontSize.label },
  errorBanner: {
    backgroundColor: '#4A1A1A',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorText: { flex: 1, color: '#FF6B6B', fontSize: FontSize.label },
  errorDismiss: { color: Colors.textMuted, fontSize: 16, padding: 4 },
});
