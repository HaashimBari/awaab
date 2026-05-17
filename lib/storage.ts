import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionRecord {
  id: string;
  date: string;        // ISO date string
  category: string;
  completedAt: string; // ISO datetime
  durationMs: number;
  totalCompleted: number;
}

const SESSIONS_KEY = '@awaab/sessions';

export async function saveSesssion(session: SessionRecord): Promise<void> {
  const existing = await getSessions();
  existing.unshift(session);
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(existing));
}

export async function getSessions(): Promise<SessionRecord[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SessionRecord[];
  } catch {
    return [];
  }
}

export async function getTodaySessions(category: string): Promise<SessionRecord[]> {
  const all = await getSessions();
  const today = new Date().toISOString().slice(0, 10);
  return all.filter((s) => s.date === today && s.category === category);
}

export async function clearSessions(): Promise<void> {
  await AsyncStorage.removeItem(SESSIONS_KEY);
}
