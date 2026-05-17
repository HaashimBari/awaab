import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../constants/theme';
import {
  calculateStreak,
  formatCategoryLabel,
  getCategoryStats,
  getCompletionsByDate,
  getWeeklyStats,
  type DayCompletion,
  type StreakInfo,
  type CategoryStats,
  type WeeklyStats,
} from '../../lib/progressEngine';
import { getSessions } from '../../lib/storage';

const CELL_SIZE = 12;
const CELL_GAP = 3;
const WEEKS = 12;

function cellColor(count: number): string {
  if (count === 0) return Colors.border;
  if (count === 1) return '#5A3A0A';
  if (count === 2) return '#9A6018';
  return Colors.primary;
}

function CalendarGrid({ days }: { days: DayCompletion[] }) {
  // Split into columns of 7 (weeks), oldest first
  const columns: DayCompletion[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    columns.push(days.slice(w * 7, w * 7 + 7));
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={calendar.wrapper}>
      {/* Day labels */}
      <View style={calendar.labelCol}>
        {dayLabels.map((l, i) => (
          <Text key={i} style={calendar.dayLabel}>{l}</Text>
        ))}
      </View>
      {/* Week columns */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={calendar.grid}>
          {columns.map((week, wi) => (
            <View key={wi} style={calendar.col}>
              {week.map((day, di) => (
                <View
                  key={di}
                  style={[
                    calendar.cell,
                    { backgroundColor: cellColor(day.count) },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const calendar = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  labelCol: { gap: CELL_GAP, paddingTop: 1 },
  dayLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    height: CELL_SIZE,
    lineHeight: CELL_SIZE,
    width: 10,
    textAlign: 'right',
  },
  grid: { flexDirection: 'row', gap: CELL_GAP },
  col: { gap: CELL_GAP },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
  },
});

export default function ProgressScreen() {
  const [days, setDays] = useState<DayCompletion[]>([]);
  const [streak, setStreak] = useState<StreakInfo>({ current: 0, longest: 0 });
  const [weekly, setWeekly] = useState<WeeklyStats>({ thisWeek: 0, lastWeek: 0 });
  const [catStats, setCatStats] = useState<CategoryStats[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    getSessions().then((sessions) => {
      setDays(getCompletionsByDate(sessions, WEEKS * 7));
      setStreak(calculateStreak(sessions));
      setWeekly(getWeeklyStats(sessions));
      setCatStats(getCategoryStats(sessions));
      setTotalSessions(sessions.length);
    });
  }, []);

  const weekTrend = weekly.lastWeek === 0
    ? null
    : weekly.thisWeek > weekly.lastWeek ? '↑' : weekly.thisWeek < weekly.lastWeek ? '↓' : '→';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Progress',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>

        {/* Streak cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNum}>{streak.current}</Text>
            <Text style={styles.statLabel}>Current streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statNum}>{streak.longest}</Text>
            <Text style={styles.statLabel}>Longest streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📿</Text>
            <Text style={styles.statNum}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Total sessions</Text>
          </View>
        </View>

        {/* Weekly */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THIS WEEK</Text>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyItem}>
              <Text style={styles.weeklyNum}>{weekly.thisWeek}</Text>
              <Text style={styles.weeklyLabel}>This week</Text>
            </View>
            {weekTrend && (
              <Text style={[
                styles.trend,
                { color: weekTrend === '↑' ? Colors.success : weekTrend === '↓' ? '#EF4444' : Colors.textMuted },
              ]}>
                {weekTrend}
              </Text>
            )}
            <View style={styles.weeklyItem}>
              <Text style={[styles.weeklyNum, { color: Colors.textSecondary }]}>{weekly.lastWeek}</Text>
              <Text style={styles.weeklyLabel}>Last week</Text>
            </View>
          </View>
        </View>

        {/* Habit calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LAST {WEEKS} WEEKS</Text>
          <View style={styles.calendarCard}>
            <CalendarGrid days={days} />
            <View style={styles.legend}>
              {[0, 1, 2, 3].map((n) => (
                <View key={n} style={styles.legendItem}>
                  <View style={[styles.legendCell, { backgroundColor: cellColor(n) }]} />
                </View>
              ))}
              <Text style={styles.legendLabel}>Less → More</Text>
            </View>
          </View>
        </View>

        {/* Per-category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BY SESSION</Text>
          {catStats.map((cat) => (
            <View key={cat.category} style={styles.catCard}>
              <View style={styles.catLeft}>
                <Text style={styles.catName}>{formatCategoryLabel(cat.category)}</Text>
                {cat.lastCompleted && (
                  <Text style={styles.catLast}>Last: {cat.lastCompleted}</Text>
                )}
              </View>
              <View style={styles.catRight}>
                <Text style={styles.catNum}>{cat.totalSessions}</Text>
                <Text style={styles.catNumLabel}>sessions</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md },

  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  statEmoji: { fontSize: 20 },
  statNum: { fontSize: 26, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: FontSize.small, color: Colors.textSecondary, textAlign: 'center' },

  section: { gap: Spacing.sm },
  sectionTitle: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginLeft: Spacing.xs,
  },

  weeklyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  weeklyItem: { alignItems: 'center', gap: 2 },
  weeklyNum: { fontSize: 32, fontWeight: '700', color: Colors.primary },
  weeklyLabel: { fontSize: FontSize.small, color: Colors.textSecondary },
  trend: { fontSize: 28, fontWeight: '700' },

  calendarCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  legendItem: {},
  legendCell: { width: CELL_SIZE, height: CELL_SIZE, borderRadius: 2 },
  legendLabel: { fontSize: 9, color: Colors.textMuted, marginLeft: 4 },

  catCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  catLeft: { flex: 1, gap: 2 },
  catName: { fontSize: FontSize.body, color: Colors.text, fontWeight: '500' },
  catLast: { fontSize: FontSize.small, color: Colors.textMuted },
  catRight: { alignItems: 'center', gap: 2 },
  catNum: { fontSize: 26, fontWeight: '700', color: Colors.primary },
  catNumLabel: { fontSize: FontSize.small, color: Colors.textSecondary },
});
