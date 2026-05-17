import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import type { StreakInfo } from '../../lib/progressEngine';

interface Props {
  streak: StreakInfo;
  todayCount: number;   // sessions completed today (0–3)
}

export function StreakBanner({ streak, todayCount }: Props) {
  const allThreeDone = todayCount >= 3;

  return (
    <View style={[styles.container, allThreeDone && styles.containerComplete]}>
      <View style={styles.left}>
        <Text style={styles.fireEmoji}>{streak.current > 0 ? '🔥' : '💧'}</Text>
        <View>
          <Text style={styles.streakNum}>{streak.current}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.right}>
        <View style={styles.dotsRow}>
          {['After Salah', 'Morning', 'Evening'].map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i < todayCount && styles.dotDone]}
            />
          ))}
        </View>
        <Text style={styles.todayLabel}>
          {allThreeDone ? 'All done today! 🤲' : `${todayCount}/3 today`}
        </Text>
        {streak.longest > 0 && (
          <Text style={styles.bestLabel}>Best: {streak.longest} days</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  containerComplete: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fireEmoji: { fontSize: 32 },
  streakNum: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 32,
  },
  streakLabel: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  right: {
    flex: 1,
    gap: Spacing.xs,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  dotDone: {
    backgroundColor: Colors.primary,
  },
  todayLabel: {
    fontSize: FontSize.label,
    color: Colors.text,
    fontWeight: '500',
  },
  bestLabel: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
});
