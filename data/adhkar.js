// data/adhkar.js
// Sammlung von Adhkar (Gedenken) und Bittgebeten (Dua), mit arabischem
// Original, Transliteration und deutscher Übersetzung. Basierend auf
// bekannten, authentischen Überlieferungen (u. a. „Hisnul Muslim“ –
// Festung des Muslims). Diese Sammlung ersetzt kein Studium bei
// qualifizierten Gelehrten, sondern dient als tägliche Erinnerung.

export const ADHKAR_CATEGORIES = [
  { id: "morgen", title: "Adhkar al-Sabah", subtitle: "Morgenerinnerungen", icon: "🌅" },
  { id: "abend", title: "Adhkar al-Masaa", subtitle: "Abenderinnerungen", icon: "🌇" },
  { id: "nach-gebet", title: "Nach dem Gebet", subtitle: "Dhikr nach dem Salah", icon: "🤲" },
  { id: "schlaf", title: "Vor dem Schlafen", subtitle: "Adhkar an-Naum", icon: "🌙" },
  { id: "alltag", title: "Alltags-Duas", subtitle: "Für alltägliche Situationen", icon: "🕌" },
  { id: "quran-duas", title: "Duas aus dem Quran", subtitle: "Rabbana-Bittgebete", icon: "📖" },
];

export const ADHKAR = {
  morgen: [
    {
      title: "Ayat al-Kursi",
      arabic:
        "اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
      translit: "Allāhu lā ilāha illā huwa-l-Ḥayyu-l-Qayyūm, lā ta'khudhuhū sinatun wa lā nawm...",
      translation:
        "Allah – es gibt keinen Gott außer Ihm, dem Lebendigen, dem Beständigen. Ihn überkommt weder Schlummer noch Schlaf... (Sure al-Baqara 2:255)",
      count: 1,
      note: "Wer dies morgens rezitiert, steht laut Überlieferung unter Allahs Schutz bis zum Abend.",
    },
    {
      title: "Bekräftigung des Morgens",
      arabic:
        "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَـٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      translit: "Aṣbaḥnā wa aṣbaḥa-l-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illa-llāhu waḥdahū lā sharīka lah...",
      translation:
        "Wir haben den Morgen erreicht, und die Herrschaft gehört Allah. Alles Lob gebührt Allah. Es gibt keinen Gott außer Allah, allein, ohne Teilhaber...",
      count: 1,
    },
    {
      title: "Sayyid al-Istighfar (Herr der Bitten um Vergebung)",
      arabic:
        "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَـٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
      translit: "Allāhumma anta Rabbī lā ilāha illā ant, khalaqtanī wa ana ‘abduk, wa ana ‘alā ‘ahdika wa wa‘dika mā-staṭa‘t...",
      translation:
        "O Allah, Du bist mein Herr, es gibt keinen Gott außer Dir. Du hast mich erschaffen und ich bin Dein Diener, und ich halte mich an Deinen Bund und Dein Versprechen, so gut ich kann...",
      count: 1,
      note: "Wer dies mit Überzeugung morgens spricht und am selben Tag stirbt, gehört zu den Bewohnern des Paradieses (so die Überlieferung).",
    },
    {
      title: "Drei Mal am Morgen",
      arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
      translit: "Bismillāhi-lladhī lā yaḍurru ma‘a-smihī shay'un fi-l-arḍi wa lā fi-s-samā'i wa huwa-s-Samī‘u-l-‘Alīm",
      translation:
        "Im Namen Allahs, mit dessen Namen nichts auf der Erde und im Himmel schaden kann, und Er ist der Allhörende, der Allwissende.",
      count: 3,
    },
    {
      title: "Zufriedenheit mit Allah",
      arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
      translit: "Raḍītu billāhi Rabban, wa bil-Islāmi dīnan, wa bi-Muḥammadin ﷺ Nabiyyā",
      translation:
        "Ich bin zufrieden mit Allah als Herrn, mit dem Islam als Din (Lebensweise) und mit Muhammad ﷺ als Prophet.",
      count: 3,
    },
  ],

  abend: [
    {
      title: "Ayat al-Kursi (abends)",
      arabic:
        "اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
      translit: "Allāhu lā ilāha illā huwa-l-Ḥayyu-l-Qayyūm...",
      translation:
        "Allah – es gibt keinen Gott außer Ihm, dem Lebendigen, dem Beständigen... (Sure al-Baqara 2:255)",
      count: 1,
    },
    {
      title: "Bekräftigung des Abends",
      arabic:
        "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَـٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      translit: "Amsaynā wa amsa-l-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illa-llāhu waḥdahū lā sharīka lah...",
      translation:
        "Wir haben den Abend erreicht, und die Herrschaft gehört Allah. Alles Lob gebührt Allah. Es gibt keinen Gott außer Allah, allein, ohne Teilhaber...",
      count: 1,
    },
    {
      title: "Al-Mu'awwidhatayn (Sure al-Falaq & an-Nas)",
      arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      translit: "Qul a‘ūdhu bi-Rabbi-l-Falaq... Qul a‘ūdhu bi-Rabbi-n-Nās...",
      translation:
        "Sprich: Ich suche Schutz beim Herrn der Morgendämmerung... Sprich: Ich suche Schutz beim Herrn der Menschen... (zusammen mit Sure al-Ikhlas je 3x rezitieren)",
      count: 3,
    },
    {
      title: "Schutz am Abend",
      arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      translit: "A‘ūdhu bi-kalimāti-llāhi-t-tāmmāti min sharri mā khalaq",
      translation:
        "Ich suche Schutz bei den vollkommenen Worten Allahs vor dem Übel dessen, was Er erschaffen hat.",
      count: 3,
    },
  ],

  "nach-gebet": [
    {
      title: "Astaghfirullah",
      arabic: "أَسْتَغْفِرُ اللَّهَ (×٣) اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ",
      translit: "Astaghfirullāh (3x). Allāhumma anta-s-Salāmu wa minka-s-salām, tabārakta yā Dhal-Jalāli wal-Ikrām",
      translation:
        "Ich bitte Allah um Vergebung (3x). O Allah, Du bist der Friede, und von Dir kommt der Friede. Gesegnet bist Du, o Besitzer der Erhabenheit und Ehre.",
      count: 1,
    },
    {
      title: "Tasbih nach dem Gebet",
      arabic: "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)",
      translit: "SubhanAllah (33x), Alhamdulillah (33x), Allahu Akbar (34x)",
      translation:
        "Gepriesen sei Allah (33x), aller Lobpreis gebührt Allah (33x), Allah ist der Größte (34x) – danach: Lā ilāha illallāhu waḥdahū lā sharīka lah...",
      count: 1,
    },
    {
      title: "Ayat al-Kursi nach jedem Pflichtgebet",
      arabic: "اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
      translit: "Allāhu lā ilāha illā huwa-l-Ḥayyu-l-Qayyūm...",
      translation:
        "Wer Ayat al-Kursi nach jedem Pflichtgebet rezitiert, dem steht laut Überlieferung nichts außer dem Tod im Weg zum Paradies.",
      count: 1,
    },
  ],

  schlaf: [
    {
      title: "Vor dem Schlafengehen",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      translit: "Bismika Allāhumma amūtu wa aḥyā",
      translation: "In Deinem Namen, o Allah, sterbe ich und lebe ich.",
      count: 1,
    },
    {
      title: "Sure al-Ikhlas, al-Falaq, an-Nas + in die Hände blasen",
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      translit: "Qul huwa-llāhu Aḥad... (in die zusammengelegten Hände blasen, über den Körper streichen)",
      translation:
        "Die drei Suren rezitieren, in die Hände blasen und über den ganzen Körper streichen – dreimal wiederholen.",
      count: 3,
    },
    {
      title: "Schutz-Dua vor dem Schlafen",
      arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
      translit: "Allāhumma qinī ‘adhābaka yawma tab‘athu ‘ibādak",
      translation:
        "O Allah, bewahre mich vor Deiner Strafe an dem Tag, an dem Du Deine Diener auferweckst.",
      count: 3,
    },
  ],

  alltag: [
    {
      title: "Vor dem Essen",
      arabic: "بِسْمِ اللَّهِ",
      translit: "Bismillāh",
      translation: "Im Namen Allahs. (Falls vergessen: Bismillāhi fī awwalihī wa ākhirih)",
      count: 1,
    },
    {
      title: "Nach dem Essen",
      arabic:
        "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَـٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      translit: "Alhamdulillāhi-lladhī aṭ‘amanī hādhā wa razaqanīhi min ghayri ḥawlin minnī wa lā quwwah",
      translation:
        "Aller Lobpreis gebührt Allah, Der mich dies essen ließ und es mir gab, ohne dass ich Kraft oder Vermögen dazu hatte.",
      count: 1,
    },
    {
      title: "Beim Betreten des Hauses",
      arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَىٰ رَبِّنَا تَوَكَّلْنَا",
      translit: "Bismillāhi walajnā, wa bismillāhi kharajnā, wa ‘alā Rabbinā tawakkalnā",
      translation:
        "Im Namen Allahs betreten wir, im Namen Allahs verlassen wir, und auf unseren Herrn vertrauen wir.",
      count: 1,
    },
    {
      title: "Beim Verlassen des Hauses",
      arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      translit: "Bismillāh, tawakkaltu ‘ala-llāh, wa lā ḥawla wa lā quwwata illā billāh",
      translation:
        "Im Namen Allahs, ich verlasse mich auf Allah, es gibt keine Macht und keine Kraft außer bei Allah.",
      count: 1,
    },
    {
      title: "Beim Betreten der Toilette",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
      translit: "Allāhumma innī a‘ūdhu bika mina-l-khubthi wal-khabā'ith",
      translation:
        "O Allah, ich suche Schutz bei Dir vor den männlichen und weiblichen Teufeln (Unreinheit/Übel).",
      count: 1,
    },
    {
      title: "Reise-Dua (Dua as-Safar)",
      arabic:
        "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَـٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
      translit: "Subḥāna-lladhī sakhkhara lanā hādhā wa mā kunnā lahū muqrinīn, wa innā ilā Rabbinā lamunqalibūn",
      translation:
        "Gepriesen sei Der, Der uns dies dienstbar gemacht hat, während wir es aus eigener Kraft nicht hätten bezwingen können, und wahrlich, zu unserem Herrn werden wir zurückkehren.",
      count: 1,
    },
    {
      title: "Bei Sorge und Angst",
      arabic:
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ",
      translit: "Allāhumma innī a‘ūdhu bika mina-l-hammi wal-ḥazan, wal-‘ajzi wal-kasal, wal-jubni wal-bukhl",
      translation:
        "O Allah, ich suche Schutz bei Dir vor Kummer und Traurigkeit, vor Unfähigkeit und Faulheit, vor Feigheit und Geiz.",
      count: 1,
    },
    {
      title: "Vor dem Lernen / Wissenserwerb",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      translit: "Rabbi zidnī ‘ilmā",
      translation: "Mein Herr, mehre mein Wissen. (Sure Ta-Ha 20:114)",
      count: 1,
    },
    {
      title: "Beim Betreten der Moschee",
      arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      translit: "Allāhumma-ftaḥ lī abwāba raḥmatik",
      translation: "O Allah, öffne mir die Tore Deiner Barmherzigkeit.",
      count: 1,
    },
    {
      title: "Beim Verlassen der Moschee",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
      translit: "Allāhumma innī as'aluka min faḍlik",
      translation: "O Allah, ich bitte Dich um Deine Gunst.",
      count: 1,
    },
  ],

  "quran-duas": [
    {
      title: "Rabbana atina (al-Baqara 2:201)",
      arabic:
        "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      translit: "Rabbanā ātinā fi-d-dunyā ḥasanatan wa fi-l-ākhirati ḥasanatan wa qinā ‘adhāba-n-nār",
      translation:
        "Unser Herr, gib uns Gutes im Diesseits und Gutes im Jenseits und bewahre uns vor der Strafe des Feuers.",
      count: 1,
    },
    {
      title: "Rabbi shrah li sadri (Ta-Ha 20:25-28)",
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
      translit: "Rabbi-shraḥ lī ṣadrī wa yassir lī amrī wa-ḥlul ‘uqdatan min lisānī yafqahū qawlī",
      translation:
        "Mein Herr, weite mir meine Brust, erleichtere mir meine Angelegenheit und löse den Knoten von meiner Zunge, damit sie meine Worte verstehen.",
      count: 1,
    },
    {
      title: "Rabbana la tuzigh qulubana (Aal Imran 3:8)",
      arabic:
        "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً",
      translit: "Rabbanā lā tuzigh qulūbanā ba‘da idh hadaytanā wa hab lanā min ladunka raḥmah",
      translation:
        "Unser Herr, lass unsere Herzen nicht abschweifen, nachdem Du uns rechtgeleitet hast, und schenke uns von Dir aus Barmherzigkeit.",
      count: 1,
    },
    {
      title: "Rabbi ij'alni muqim as-salah (Ibrahim 14:40)",
      arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
      translit: "Rabbi-j‘alnī muqīma-ṣ-ṣalāti wa min dhurriyyatī rabbanā wa taqabbal du‘ā'",
      translation:
        "Mein Herr, mache mich zu einem, der das Gebet verrichtet, und auch von meinen Nachkommen. Unser Herr, und nimm mein Bittgebet an.",
      count: 1,
    },
  ],
};
