import { router } from 'expo-router';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';

interface Props {
  visible: boolean;
  durationMs: number;
  onReset: () => void;
}

function formatDuration(ms: number) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export function SessionComplete({ visible, durationMs, onReset }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🤲</Text>
          <Text style={styles.title}>MashAllah!</Text>
          <Text style={styles.subtitle}>You completed your after-salah tasbih</Text>

          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDuration(durationMs)}</Text>
            <Text style={styles.statLabel}>Time taken</Text>
          </View>

          <Text style={styles.arabic}>
            {'سُبْحَانَكَ ٱللَّٰهُمَّ وَبِحَمْدِكَ'}
          </Text>

          <View style={styles.actions}>
            <Pressable style={styles.btnPrimary} onPress={onReset}>
              <Text style={styles.btnPrimaryText}>Start Again</Text>
            </Pressable>
            <Pressable style={styles.btnSecondary} onPress={() => router.back()}>
              <Text style={styles.btnSecondaryText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  emoji: { fontSize: 56 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  stat: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: 32, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: FontSize.label, color: Colors.textMuted },
  arabic: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 30,
  },
  actions: { width: '100%', gap: Spacing.sm, marginTop: Spacing.sm },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#0A1628', fontWeight: '700', fontSize: FontSize.body },
  btnSecondary: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnSecondaryText: { color: Colors.textSecondary, fontSize: FontSize.body },
});
