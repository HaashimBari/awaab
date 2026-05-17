import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../constants/theme';
import { getTodaySessions } from '../lib/storage';

interface SessionCard {
  key: string;
  label: string;
  arabic: string;
  route: string;
  comingSoon: boolean;
}

const SESSIONS: SessionCard[] = [
  {
    key: 'after-salah',
    label: 'After Salah',
    arabic: 'أذكار بعد الصلاة',
    route: '/(session)/after-salah',
    comingSoon: false,
  },
  {
    key: 'morning',
    label: 'Morning Adhkar',
    arabic: 'أذكار الصباح',
    route: '/(session)/morning',
    comingSoon: false,
  },
  {
    key: 'evening',
    label: 'Evening Adhkar',
    arabic: 'أذكار المساء',
    route: '/(session)/evening',
    comingSoon: false,
  },
];

export default function HomeScreen() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadToday() {
      const results: Record<string, boolean> = {};
      for (const s of SESSIONS) {
        const sessions = await getTodaySessions(s.key);
        results[s.key] = sessions.length > 0;
      }
      setCompleted(results);
    }
    loadToday();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.greeting}>بسم الله الرحمن الرحيم</Text>
        <Text style={styles.title}>Awaab</Text>
        <Text style={styles.subtitle}>Your daily dhikr companion</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>TODAY'S SESSIONS</Text>

        {SESSIONS.map((session) => (
          <Pressable
            key={session.key}
            style={[styles.card, session.comingSoon && styles.cardDisabled]}
            onPress={() => !session.comingSoon && router.push(session.route as never)}
            disabled={session.comingSoon}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardArabic}>{session.arabic}</Text>
              <Text style={styles.cardLabel}>{session.label}</Text>
              {session.comingSoon && (
                <Text style={styles.comingSoon}>Coming soon</Text>
              )}
            </View>

            <View style={styles.cardRight}>
              {completed[session.key] ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✓ Done</Text>
                </View>
              ) : session.comingSoon ? (
                <Text style={styles.lockIcon}>🔒</Text>
              ) : (
                <Text style={styles.arrow}>›</Text>
              )}
            </View>
          </Pressable>
        ))}

        <Text style={styles.sectionLabel} >PROGRESS</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>
              {Object.values(completed).filter(Boolean).length}
            </Text>
            <Text style={styles.statLabel}>Done today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{SESSIONS.filter((s) => !s.comingSoon).length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  greeting: {
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scroll: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardLeft: { flex: 1, gap: Spacing.xs },
  cardArabic: { fontSize: 20, color: Colors.text, fontWeight: '500' },
  cardLabel: { fontSize: FontSize.label, color: Colors.textSecondary },
  comingSoon: { fontSize: FontSize.small, color: Colors.textMuted },
  cardRight: { alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.md },
  badge: {
    backgroundColor: Colors.successDim,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  badgeText: { color: Colors.success, fontSize: FontSize.small, fontWeight: '600' },
  lockIcon: { fontSize: 20 },
  arrow: { fontSize: 24, color: Colors.primary, fontWeight: '300' },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statNum: { fontSize: 32, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: FontSize.small, color: Colors.textSecondary },
});
