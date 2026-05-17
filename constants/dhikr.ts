export type DhikrCategory = 'after-salah' | 'morning' | 'evening';

export type DhikrId =
  | 'subhanallah'
  | 'alhamdulillah'
  | 'allahuakbar'
  | 'la-ilaha-complete'
  | 'ayatul-kursi';

export interface DhikrItem {
  id: DhikrId;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  category: DhikrCategory;
  order: number;
  isTasbih: boolean;
}

export const DHIKR: DhikrItem[] = [
  // ── After Salah ──────────────────────────────────────────
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    count: 33,
    category: 'after-salah',
    order: 1,
    isTasbih: true,
  },
  {
    id: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah',
    count: 33,
    category: 'after-salah',
    order: 2,
    isTasbih: true,
  },
  {
    id: 'allahuakbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    count: 33,
    category: 'after-salah',
    order: 3,
    isTasbih: true,
  },
  {
    id: 'la-ilaha-complete',
    arabic:
      'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ ٱلْمُلْكُ وَلَهُ ٱلْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr',
    translation:
      'There is none worthy of worship except Allah, alone, without partner. To Him belongs sovereignty and praise, and He is over all things capable.',
    count: 1,
    category: 'after-salah',
    order: 4,
    isTasbih: false,
  },
];

export const AFTER_SALAH_DHIKR = DHIKR.filter(
  (d) => d.category === 'after-salah',
).sort((a, b) => a.order - b.order);

export const TASBIH_DHIKR = DHIKR.filter((d) => d.isTasbih);
