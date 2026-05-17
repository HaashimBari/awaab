import type { SessionRecord } from './storage';

export interface DayCompletion {
  date: string;        // YYYY-MM-DD
  count: number;       // sessions completed that day (0–3)
}

export interface StreakInfo {
  current: number;
  longest: number;
}

export interface WeeklyStats {
  thisWeek: number;   // sessions completed Mon–today
  lastWeek: number;
}

export interface CategoryStats {
  category: string;
  totalSessions: number;
  lastCompleted: string | null;
}

// Returns a map of date -> session count for the last `days` days
export function getCompletionsByDate(
  sessions: SessionRecord[],
  days = 84,
): DayCompletion[] {
  const today = new Date();
  const result: DayCompletion[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = sessions.filter((s) => s.date === dateStr).length;
    result.push({ date: dateStr, count });
  }

  return result;
}

export function calculateStreak(sessions: SessionRecord[]): StreakInfo {
  if (sessions.length === 0) return { current: 0, longest: 0 };

  // Build a set of unique dates that have at least one session
  const datesWithSession = new Set(sessions.map((s) => s.date));

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);

  // Current streak: count back from today (or yesterday if nothing done today yet)
  let current = 0;
  const startDate = datesWithSession.has(today) ? today : yesterday;

  if (datesWithSession.has(startDate)) {
    const cursor = new Date(startDate);
    while (datesWithSession.has(cursor.toISOString().slice(0, 10))) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // Longest streak: scan all days
  const sortedDates = [...datesWithSession].sort();
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;

  for (const dateStr of sortedDates) {
    const d = new Date(dateStr);
    if (prev) {
      const diff = (d.getTime() - prev.getTime()) / 864e5;
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = d;
  }

  return { current, longest };
}

export function getCategoryStats(sessions: SessionRecord[]): CategoryStats[] {
  const categories = ['after-salah', 'morning', 'evening'];
  return categories.map((category) => {
    const cat = sessions.filter((s) => s.category === category);
    const last = cat.length > 0
      ? cat.reduce((a, b) => (a.completedAt > b.completedAt ? a : b)).date
      : null;
    return { category, totalSessions: cat.length, lastCompleted: last };
  });
}

export function getWeeklyStats(sessions: SessionRecord[]): WeeklyStats {
  const now = new Date();

  // Start of this week (Monday)
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  thisMonday.setHours(0, 0, 0, 0);

  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(lastMonday.getDate() - 7);

  const thisWeek = sessions.filter((s) => new Date(s.completedAt) >= thisMonday).length;
  const lastWeek = sessions.filter((s) => {
    const d = new Date(s.completedAt);
    return d >= lastMonday && d < thisMonday;
  }).length;

  return { thisWeek, lastWeek };
}

export function formatCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    'after-salah': 'After Salah',
    morning: 'Morning',
    evening: 'Evening',
  };
  return map[category] ?? category;
}
