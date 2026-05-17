import type { DhikrId } from '../constants/dhikr';

const PATTERNS: Record<DhikrId, RegExp[]> = {
  subhanallah: [
    /subhan\s*all?ah/i,
    /subhan\s*allah/i,
    /سبحان\s*الله/,
    /subhanallah/i,
    /subhan allah/i,
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
  'la-ilaha-complete': [
    /la\s*ilaha\s*ill?all?ah/i,
    /لا\s*إله\s*إلا\s*الله/,
  ],
  'ayatul-kursi': [
    /allahu\s*la\s*ilaha\s*illa\s*huw/i,
    /ayatul?\s*kursi/i,
    /آية\s*الكرسي/,
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
