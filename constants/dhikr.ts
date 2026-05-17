export type DhikrCategory = 'after-salah' | 'morning' | 'evening';

export type DhikrId =
  // After salah
  | 'subhanallah'
  | 'alhamdulillah'
  | 'allahuakbar'
  | 'la-ilaha-complete'
  | 'after-salah-ayatul-kursi'
  // Morning
  | 'morning-opening'
  | 'morning-protection'
  | 'morning-ikhlas'
  | 'morning-falaq'
  | 'morning-nas'
  | 'sayyidul-istighfar'
  // Evening
  | 'evening-opening'
  | 'evening-protection'
  | 'evening-ikhlas'
  | 'evening-falaq'
  | 'evening-nas'
  | 'istighfar-evening';

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

const IKHLAS_ARABIC =
  'قُلْ هُوَ ٱللَّٰهُ أَحَدٌ ۝ ٱللَّٰهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ';
const IKHLAS_TRANS =
  'Qul huwa Allāhu aḥad, Allāhuṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakun lahū kufuwan aḥad';
const IKHLAS_TRANSLATION =
  'Say: He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.';

const FALAQ_ARABIC =
  'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ';
const FALAQ_TRANS =
  'Qul aʿūdhu bi-rabbil-falaq, min sharri mā khalaq, wa min sharri ghāsiqin idhā waqab, wa min sharrin-naffāthāti fil-ʿuqad, wa min sharri ḥāsidin idhā ḥasad';
const FALAQ_TRANSLATION =
  'Say: I seek refuge in the Lord of daybreak, from the evil of that which He created, and from the evil of darkness when it settles, and from the evil of those who blow on knots, and from the evil of an envier when he envies.';

const NAS_ARABIC =
  'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝ مَلِكِ ٱلنَّاسِ ۝ إِلَٰهِ ٱلنَّاسِ ۝ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۝ ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ ۝ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ';
const NAS_TRANS =
  'Qul aʿūdhu bi-rabbin-nās, malikin-nās, ilāhin-nās, min sharril-waswāsil-khannās, alladhī yuwaswisu fī ṣudūrin-nās, minal-jinnati wan-nās';
const NAS_TRANSLATION =
  'Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer, who whispers in the breasts of mankind, among jinn and among people.';

export const DHIKR: DhikrItem[] = [
  // ── After Salah ──────────────────────────────────────────────────────────
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
      'There is none worthy of worship except Allah, alone, without partner. To Him belongs all sovereignty and all praise, and He is over all things capable.',
    count: 1,
    category: 'after-salah',
    order: 4,
    isTasbih: false,
  },
  {
    id: 'after-salah-ayatul-kursi',
    arabic:
      'ٱللَّٰهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَيُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي ٱلسَّمَٰوَٰتِ وَمَا فِي ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِيُّ ٱلْعَظِيمُ',
    transliteration:
      'Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā taʾkhudhuhū sinatun wa lā nawm...',
    translation: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence...',
    count: 1,
    category: 'after-salah',
    order: 5,
    isTasbih: false,
  },

  // ── Morning Adhkar ────────────────────────────────────────────────────────
  {
    id: 'morning-opening',
    arabic:
      'أَصْبَحْنَا وَأَصْبَحَ ٱلْمُلْكُ لِلَّٰهِ، وَٱلْحَمْدُ لِلَّٰهِ، لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ ٱلْمُلْكُ وَلَهُ ٱلْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahu lā sharīka lah...',
    translation:
      'We have reached the morning and at this very time unto Allah belongs all sovereignty. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner...',
    count: 1,
    category: 'morning',
    order: 1,
    isTasbih: false,
  },
  {
    id: 'morning-protection',
    arabic:
      'ٱللَّٰهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ ٱلنُّشُورُ',
    transliteration:
      'Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūt, wa ilayk-an-nushūr',
    translation:
      'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
    count: 1,
    category: 'morning',
    order: 2,
    isTasbih: false,
  },
  {
    id: 'morning-ikhlas',
    arabic: IKHLAS_ARABIC,
    transliteration: IKHLAS_TRANS,
    translation: IKHLAS_TRANSLATION,
    count: 3,
    category: 'morning',
    order: 3,
    isTasbih: false,
  },
  {
    id: 'morning-falaq',
    arabic: FALAQ_ARABIC,
    transliteration: FALAQ_TRANS,
    translation: FALAQ_TRANSLATION,
    count: 3,
    category: 'morning',
    order: 4,
    isTasbih: false,
  },
  {
    id: 'morning-nas',
    arabic: NAS_ARABIC,
    transliteration: NAS_TRANS,
    translation: NAS_TRANSLATION,
    count: 3,
    category: 'morning',
    order: 5,
    isTasbih: false,
  },
  {
    id: 'sayyidul-istighfar',
    arabic:
      'ٱللَّٰهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا ٱسْتَطَعْتُ، أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَٱغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ ٱلذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      'Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa anā ʿabduk, wa anā ʿalā ʿahdika wa waʿdika mastaṭaʿt...',
    translation:
      'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your slave. I am faithful to my covenant and promise as much as I can. I seek refuge in You from the evil I have done...',
    count: 1,
    category: 'morning',
    order: 6,
    isTasbih: false,
  },

  // ── Evening Adhkar ────────────────────────────────────────────────────────
  {
    id: 'evening-opening',
    arabic:
      'أَمْسَيْنَا وَأَمْسَى ٱلْمُلْكُ لِلَّٰهِ، وَٱلْحَمْدُ لِلَّٰهِ، لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ ٱلْمُلْكُ وَلَهُ ٱلْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahu lā sharīka lah...',
    translation:
      'We have reached the evening and at this very time unto Allah belongs all sovereignty. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner...',
    count: 1,
    category: 'evening',
    order: 1,
    isTasbih: false,
  },
  {
    id: 'evening-protection',
    arabic:
      'ٱللَّٰهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ ٱلْمَصِيرُ',
    transliteration:
      'Allāhumma bika amsaynā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūt, wa ilayk-al-maṣīr',
    translation:
      'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
    count: 1,
    category: 'evening',
    order: 2,
    isTasbih: false,
  },
  {
    id: 'evening-ikhlas',
    arabic: IKHLAS_ARABIC,
    transliteration: IKHLAS_TRANS,
    translation: IKHLAS_TRANSLATION,
    count: 3,
    category: 'evening',
    order: 3,
    isTasbih: false,
  },
  {
    id: 'evening-falaq',
    arabic: FALAQ_ARABIC,
    transliteration: FALAQ_TRANS,
    translation: FALAQ_TRANSLATION,
    count: 3,
    category: 'evening',
    order: 4,
    isTasbih: false,
  },
  {
    id: 'evening-nas',
    arabic: NAS_ARABIC,
    transliteration: NAS_TRANS,
    translation: NAS_TRANSLATION,
    count: 3,
    category: 'evening',
    order: 5,
    isTasbih: false,
  },
  {
    id: 'istighfar-evening',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullāha wa atūbu ilayh',
    translation: 'I seek the forgiveness of Allah and repent to Him.',
    count: 100,
    category: 'evening',
    order: 6,
    isTasbih: true,
  },
];

export const AFTER_SALAH_DHIKR = DHIKR.filter(
  (d) => d.category === 'after-salah',
).sort((a, b) => a.order - b.order);

export const MORNING_DHIKR = DHIKR.filter(
  (d) => d.category === 'morning',
).sort((a, b) => a.order - b.order);

export const EVENING_DHIKR = DHIKR.filter(
  (d) => d.category === 'evening',
).sort((a, b) => a.order - b.order);

export const TASBIH_DHIKR = DHIKR.filter((d) => d.isTasbih);
