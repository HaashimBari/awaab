import { useCallback, useRef, useState } from 'react';
import { AFTER_SALAH_DHIKR, type DhikrId } from '../constants/dhikr';
import { saveSesssion } from '../lib/storage';

type Counts = Record<DhikrId, number>;

function buildInitialCounts(): Counts {
  return Object.fromEntries(
    AFTER_SALAH_DHIKR.map((d) => [d.id, 0]),
  ) as Counts;
}

export function useTasbih() {
  const [counts, setCounts] = useState<Counts>(buildInitialCounts);
  const [isComplete, setIsComplete] = useState(false);
  const sessionStart = useRef(Date.now());

  const increment = useCallback((id: DhikrId) => {
    setCounts((prev) => {
      const dhikr = AFTER_SALAH_DHIKR.find((d) => d.id === id);
      if (!dhikr) return prev;
      const current = prev[id] ?? 0;
      if (current >= dhikr.count) return prev;
      const updated = { ...prev, [id]: current + 1 };

      const allDone = AFTER_SALAH_DHIKR.every((d) => (updated[d.id] ?? 0) >= d.count);
      if (allDone) {
        setIsComplete(true);
        const now = Date.now();
        saveSesssion({
          id: String(now),
          date: new Date().toISOString().slice(0, 10),
          category: 'after-salah',
          completedAt: new Date().toISOString(),
          durationMs: now - sessionStart.current,
          totalCompleted: AFTER_SALAH_DHIKR.reduce((sum, d) => sum + d.count, 0),
        }).catch(console.error);
      }
      return updated;
    });
  }, []);

  const reset = useCallback(() => {
    setCounts(buildInitialCounts());
    setIsComplete(false);
    sessionStart.current = Date.now();
  }, []);

  const getCount = useCallback(
    (id: DhikrId) => counts[id] ?? 0,
    [counts],
  );

  return { counts, isComplete, increment, reset, getCount };
}
