import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import type { PronunciationResult } from '../../hooks/usePronunciationRecorder';

interface Props {
  result: PronunciationResult;
}

function scoreColor(score: number) {
  if (score >= 90) return Colors.success;
  if (score >= 70) return '#3B82F6';
  if (score >= 50) return Colors.primary;
  return '#EF4444';
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Developing';
  return 'Keep Practising';
}

export function PronunciationFeedback({ result }: Props) {
  const color = scoreColor(result.score);

  return (
    <View style={styles.container}>
      <View style={[styles.scoreRing, { borderColor: color }]}>
        <Text style={[styles.scoreNum, { color }]}>{result.score}</Text>
        <Text style={[styles.scoreLabel, { color }]}>{scoreLabel(result.score)}</Text>
      </View>

      <View style={styles.feedbackBox}>
        <Text style={styles.feedbackIcon}>💬</Text>
        <Text style={styles.feedbackText}>{result.feedback}</Text>
      </View>

      {result.transcript ? (
        <View style={styles.transcriptBox}>
          <Text style={styles.transcriptLabel}>You said</Text>
          <Text style={styles.transcriptText}>"{result.transcript}"</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  scoreRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  scoreNum: {
    fontSize: 32,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: FontSize.small,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: '100%',
  },
  feedbackIcon: { fontSize: 16 },
  feedbackText: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.body,
    lineHeight: 22,
  },
  transcriptBox: {
    width: '100%',
    gap: Spacing.xs,
  },
  transcriptLabel: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  transcriptText: {
    color: Colors.textSecondary,
    fontSize: FontSize.label,
    fontStyle: 'italic',
  },
});
