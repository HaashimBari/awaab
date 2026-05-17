import type { DhikrId } from '../constants/dhikr';

// Only tasbih dhikr are matched via voice input — recite steps use DhikrRecorder instead
const PATTERNS: Partial<Record<DhikrId, RegExp[]>> = {
  subhanallah: [
    /subhan\s*all?ah/i,
    /سبحان\s*الله/,
    /subhanallah/i,
  ],
  alhamdulillah: [
    /alhamdu\s*lill?ah/i,
    /al\s*hamdu\s*lill?ah/i,
    /الحمد\s*لله/,
    /alhamdulillah/i,
    /alhamdo\s*lillah/i,
  ],
  allahuakbar: [
    /allah\s*u?\s*akbar/i,
    /allahu\s*akbar/i,
    /الله\s*أكبر/,
    /allahuakbar/i,
    /allah akber/i,
    /allaho\s*akbar/i,
  ],
  'istighfar-evening': [
    /astaghfirullah/i,
    /astagh\s*firullah/i,
    /أستغفر\s*الله/,
  ],
};

export function matchDhikr(transcript: string): DhikrId | null {
  const normalized = transcript.trim();
  for (const [id, patterns] of Object.entries(PATTERNS) as [DhikrId, RegExp[]][]) {
    for (const pattern of patterns) {
      if (pattern.test(normalized)) return id;
    }
  }
  return null;
}
