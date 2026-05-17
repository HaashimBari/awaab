import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import type { DhikrItem } from '../../constants/dhikr';

interface Props {
  dhikr: DhikrItem;
  count: number;
  onTap: () => void;
  isActive: boolean;  // current dhikr in sequence
}

const ACCENT: Record<string, string> = {
  subhanallah: Colors.subhanallah,
  alhamdulillah: Colors.alhamdulillah,
  allahuakbar: Colors.allahuakbar,
};

export function TasbihCounter({ dhikr, count, onTap, isActive }: Props) {
  const done = count >= dhikr.count;
  const accent = ACCENT[dhikr.id] ?? Colors.primary;
  const progress = Math.min(count / dhikr.count, 1);

  const scale = useSharedValue(1);
  const flash = useSharedValue(0);

  useEffect(() => {
    if (count > 0) {
      scale.value = withSequence(
        withTiming(1.06, { duration: 60 }),
        withTiming(1, { duration: 100 }),
      );
      flash.value = withSequence(
        withTiming(1, { duration: 60 }),
        withTiming(0, { duration: 200 }),
      );
    }
  }, [count]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value * 0.15,
  }));

  return (
    <Pressable onPress={isActive && !done ? onTap : undefined} style={styles.wrapper}>
      <Animated.View
        style={[
          styles.card,
          isActive && styles.cardActive,
          done && styles.cardDone,
          animStyle,
        ]}
      >
        {/* Flash overlay */}
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.flashOverlay, { backgroundColor: accent }, flashStyle]}
          pointerEvents="none"
        />

        <View style={styles.left}>
          <Text style={[styles.arabic, { color: done ? Colors.success : Colors.text }]}>
            {dhikr.arabic}
          </Text>
          <Text style={styles.transliteration}>{dhikr.transliteration}</Text>
          <Text style={styles.translation}>{dhikr.translation}</Text>
        </View>

        <View style={styles.right}>
          {/* Circular progress ring */}
          <View style={[styles.ring, { borderColor: done ? Colors.success : accent }]}>
            <View style={[styles.ringFill, { backgroundColor: done ? Colors.success : accent, opacity: 0.15 + progress * 0.2 }]} />
            <Text style={[styles.countText, { color: done ? Colors.success : accent }]}>
              {count}
            </Text>
            <Text style={[styles.targetText, { color: done ? Colors.success : Colors.textSecondary }]}>
              /{dhikr.count}
            </Text>
          </View>
          {done && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: Colors.primary,
  },
  cardDone: {
    borderColor: Colors.successDim,
    opacity: 0.85,
  },
  flashOverlay: {
    borderRadius: Radius.md,
  },
  left: {
    flex: 1,
    gap: Spacing.xs,
  },
  arabic: {
    fontSize: FontSize.arabic,
    color: Colors.text,
    textAlign: 'left',
    fontWeight: '600',
    lineHeight: 42,
  },
  transliteration: {
    fontSize: FontSize.body,
    color: Colors.primary,
    fontWeight: '500',
  },
  translation: {
    fontSize: FontSize.label,
    color: Colors.textSecondary,
  },
  right: {
    alignItems: 'center',
    marginLeft: Spacing.md,
    gap: Spacing.xs,
  },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  ringFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
  },
  countText: {
    fontSize: FontSize.heading,
    fontWeight: '700',
  },
  targetText: {
    fontSize: FontSize.small,
  },
  checkmark: {
    fontSize: 20,
    color: Colors.success,
    fontWeight: '700',
  },
});
