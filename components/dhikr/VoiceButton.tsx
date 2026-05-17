import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../../constants/theme';
import type { VoiceState } from '../../hooks/useVoiceRecognition';

interface Props {
  state: VoiceState;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function VoiceButton({ state, onPressIn, onPressOut }: Props) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (state === 'recording') {
      pulse.value = withRepeat(withTiming(1.2, { duration: 600 }), -1, true);
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(1, { duration: 150 });
    }
  }, [state]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: state === 'recording' ? 0.4 : 0,
  }));

  const buttonColor =
    state === 'recording'
      ? '#E03030'
      : state === 'processing'
        ? Colors.textMuted
        : Colors.primary;

  const label =
    state === 'recording'
      ? 'Release'
      : state === 'processing'
        ? 'Processing…'
        : 'Hold & Say';

  return (
    <View style={styles.wrapper}>
      {/* Pulse ring */}
      <Animated.View
        style={[styles.pulse, { backgroundColor: buttonColor }, pulseStyle]}
        pointerEvents="none"
      />

      <Pressable
        onPressIn={state === 'idle' || state === 'error' ? onPressIn : undefined}
        onPressOut={state === 'recording' ? onPressOut : undefined}
        style={[styles.button, { backgroundColor: buttonColor }]}
        disabled={state === 'processing'}
      >
        <Text style={styles.icon}>
          {state === 'recording' ? '⏹' : state === 'processing' ? '⏳' : '🎙'}
        </Text>
      </Pressable>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    top: -4,
    left: -4,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
