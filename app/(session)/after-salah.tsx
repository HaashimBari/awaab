import { Stack } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { VoiceButton } from '../../components/dhikr/VoiceButton';
import { TasbihCounter } from '../../components/dhikr/TasbihCounter';
import { SessionComplete } from '../../components/session/SessionComplete';
import { AFTER_SALAH_DHIKR, type DhikrId } from '../../constants/dhikr';
import { Colors, FontSize, Spacing } from '../../constants/theme';
import { useTasbih } from '../../hooks/useTasbih';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

export default function AfterSalahScreen() {
  const { counts, isComplete, increment, reset } = useTasbih();
  const sessionStart = useRef(Date.now());

  const activeDhikrId = useMemo<DhikrId | null>(() => {
    for (const dhikr of AFTER_SALAH_DHIKR) {
      if (!dhikr.isTasbih) continue;
      if ((counts[dhikr.id] ?? 0) < dhikr.count) return dhikr.id;
    }
    return null;
  }, [counts]);

  const { state: voiceState, lastError, startRecording, stopRecording, clearError } =
    useVoiceRecognition(increment);

  const durationMs = isComplete ? Date.now() - sessionStart.current : 0;

  const totalCount = AFTER_SALAH_DHIKR.filter((d) => d.isTasbih).reduce(
    (sum, d) => sum + (counts[d.id] ?? 0),
    0,
  );
  const totalTarget = AFTER_SALAH_DHIKR.filter((d) => d.isTasbih).reduce(
    (sum, d) => sum + d.count,
    0,
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'After Salah',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.container}>
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(totalCount / totalTarget) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {totalCount} / {totalTarget}
        </Text>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {AFTER_SALAH_DHIKR.filter((d) => d.isTasbih).map((dhikr) => (
            <TasbihCounter
              key={dhikr.id}
              dhikr={dhikr}
              count={counts[dhikr.id] ?? 0}
              onTap={() => increment(dhikr.id)}
              isActive={activeDhikrId === dhikr.id}
            />
          ))}
        </ScrollView>

        {/* Error toast */}
        {lastError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{lastError}</Text>
            <Text style={styles.errorDismiss} onPress={clearError}>✕</Text>
          </View>
        )}

        {/* Voice button */}
        <View style={styles.voiceArea}>
          <Text style={styles.hint}>
            {activeDhikrId
              ? `Tap or speak ${AFTER_SALAH_DHIKR.find((d) => d.id === activeDhikrId)?.transliteration}`
              : 'All tasbih complete'}
          </Text>
          <VoiceButton
            state={voiceState}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          />
        </View>
      </View>

      <SessionComplete
        visible={isComplete}
        durationMs={durationMs}
        onReset={() => {
          reset();
          sessionStart.current = Date.now();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: FontSize.small,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  scroll: {
    paddingBottom: Spacing.lg,
  },
  errorBanner: {
    backgroundColor: '#4A1A1A',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 8,
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorText: {
    flex: 1,
    color: '#FF6B6B',
    fontSize: FontSize.label,
  },
  errorDismiss: {
    color: Colors.textMuted,
    fontSize: 16,
    padding: 4,
  },
  voiceArea: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  hint: {
    color: Colors.textSecondary,
    fontSize: FontSize.label,
  },
});
