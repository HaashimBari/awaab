import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StreakBanner } from '../components/home/StreakBanner';
import { Colors, FontSize, Radius, Spacing } from '../constants/theme';
import { calculateStreak, type StreakInfo } from '../lib/progressEngine';
import { getSessions, getTodaySessions } from '../lib/storage';

interface SessionCard {
  key: string;
  label: string;
  arabic: string;
  route: string;
}

const SESSIONS: SessionCard[] = [
  { key: 'after-salah', label: 'After Salah',     arabic: 'أذكار بعد الصلاة', route: '/(session)/after-salah' },
  { key: 'morning',     label: 'Morning Adhkar',  arabic: 'أذكار الصباح',     route: '/(session)/morning'    },
  { key: 'evening',     label: 'Evening Adhkar',  arabic: 'أذكار المساء',     route: '/(session)/evening'    },
];

export default function HomeScreen() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState<StreakInfo>({ current: 0, longest: 0 });

  useEffect(() => {
    async function load() {
      const results: Record<string, boolean> = {};
      for (const s of SESSIONS) {
        const sessions = await getTodaySessions(s.key);
        results[s.key] = sessions.length > 0;
      }
      setCompleted(results);

      const all = await getSessions();
      setStreak(calculateStreak(all));
    }
    load();
  }, []);

  const todayCount = Object.values(completed).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.greeting}>بسم الله الرحمن الرحيم</Text>
        <Text style={styles.title}>Awaab</Text>
        <Text style={styles.subtitle}>Your daily dhikr companion</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <StreakBanner streak={streak} todayCount={todayCount} />

        <Text style={styles.sectionLabel}>TODAY'S SESSIONS</Text>

        {SESSIONS.map((session) => (
          <Pressable
            key={session.key}
            style={styles.card}
            onPress={() => router.push(session.route as never)}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardArabic}>{session.arabic}</Text>
              <Text style={styles.cardLabel}>{session.label}</Text>
            </View>
            <View style={styles.cardRight}>
              {completed[session.key] ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✓ Done</Text>
                </View>
              ) : (
                <Text style={styles.arrow}>›</Text>
              )}
            </View>
          </Pressable>
        ))}

        <Pressable style={styles.progressLink} onPress={() => router.push('/progress')}>
          <Text style={styles.progressLinkText}>📊  View Progress & Streaks</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

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
    marginTop: Spacing.sm,
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
  cardLeft: { flex: 1, gap: Spacing.xs },
  cardArabic: { fontSize: 20, color: Colors.text, fontWeight: '500' },
  cardLabel: { fontSize: FontSize.label, color: Colors.textSecondary },
  cardRight: { alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.md },
  badge: {
    backgroundColor: Colors.successDim,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  badgeText: { color: Colors.success, fontSize: FontSize.small, fontWeight: '600' },
  arrow: { fontSize: 24, color: Colors.primary, fontWeight: '300' },
  progressLink: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  progressLinkText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
