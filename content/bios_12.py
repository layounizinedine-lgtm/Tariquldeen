from bio import bio
E = "[Einstufung nicht angegeben – zu prüfen]"
S = [
 # --- Kapitel 1
 ("اسْمُهُ عَبْدُ اللَّهِ بْنُ أَبِي قُحَافَةَ، وَلَقَبُهُ عَتِيقٌ.", "Sein Name war Abdullah ibn Abi Quhafa, sein Beiname ʿAtiq.", 1155),
 ("كَانَ أَوَّلَ مَنْ آمَنَ مِنَ الرِّجَالِ.", "Er war der erste Mann, der den Glauben annahm.", 1155),
 ("وَأَنْفَقَ أَمْوَالَهُ عَلَى النَّبِيِّ ﷺ وَفِي سَبِيلِ اللَّهِ.", "Er gab sein Vermögen für den Propheten ﷺ und auf Allahs Weg aus.", 1156),
 ("سَأَلَ عَمْرُو بْنُ الْعَاصِ النَّبِيَّ ﷺ: أَيُّ الرِّجَالِ أَحَبُّ إِلَيْكَ؟ فَقَالَ: أَبُو بَكْرٍ.", "ʿAmr ibn al-ʿAs fragte den Propheten ﷺ: Welcher Mann ist dir am liebsten? Er sagte: Abu Bakr.", 1156),
 ("وَقَالَ النَّبِيُّ ﷺ: لَوْ كَانَ يَتَّخِذُ خَلِيلًا لَاتَّخَذَ أَبَا بَكْرٍ.", "Der Prophet ﷺ sagte, wenn er einen engsten Freund (Khalil) nähme, dann würde er Abu Bakr nehmen.", 1158),
 ("وَأَمَرَهُ النَّبِيُّ ﷺ أَنْ يَؤُمَّ النَّاسَ فِي الصَّلَاةِ.", "Der Prophet ﷺ trug ihm auf, die Menschen im Gebet zu leiten.", 1160),
 # --- Kapitel 2
 ("تُوُفِّيَ النَّبِيُّ ﷺ وَأَبُو بَكْرٍ فِي السُّنْحِ، عَلَى أَطْرَافِ الْمَدِينَةِ.", "Als der Prophet ﷺ starb, war Abu Bakr in as-Sunh, am Rand von Medina.", 1168),
 ("فَقَالَ عُمَرُ: وَاللَّهِ مَا مَاتَ رَسُولُ اللَّهِ ﷺ.", "ʿUmar sagte: Bei Allah, der Gesandte Allahs ﷺ ist nicht gestorben!", 1168),
 ("فَجَاءَ أَبُو بَكْرٍ، وَكَشَفَ عَنْ وَجْهِ النَّبِيِّ ﷺ، وَقَبَّلَهُ.", "Da kam Abu Bakr, enthüllte das Gesicht des Propheten ﷺ und küsste ihn.", 1169),
 ("وَقَالَ: طِبْتَ حَيًّا وَمَيِّتًا، وَلَا يُذِيقُكَ اللَّهُ مَوْتَتَيْنِ أَبَدًا.", "Er sagte: Gut warst du im Leben und im Tod; Allah lässt dich nie zweimal den Tod kosten.", 1169),
 ("ثُمَّ خَرَجَ إِلَى النَّاسِ وَقَالَ: مَنْ كَانَ يَعْبُدُ مُحَمَّدًا فَإِنَّ مُحَمَّدًا قَدْ مَاتَ، وَمَنْ كَانَ يَعْبُدُ اللَّهَ فَإِنَّ اللَّهَ حَيٌّ لَا يَمُوتُ.", "Dann trat er zu den Leuten und sagte: Wer Muhammad verehrte – Muhammad ist gestorben; wer Allah verehrt – Allah lebt und stirbt nicht.", 1169),
 ("وَاسْتَشْهَدَ بِآيَتَيْنِ مِنَ الْقُرْآنِ، فَبَكَى النَّاسُ.", "Er führte zwei Verse aus dem Quran an, und die Leute weinten.", 1169),
 ("وَاجْتَمَعَتِ الْأَنْصَارُ فِي سَقِيفَةِ بَنِي سَاعِدَةَ، وَقَالُوا: مِنَّا أَمِيرٌ وَمِنْكُمْ أَمِيرٌ.", "Die Ansar versammelten sich in der Saqifa der Banu Saʿida und sagten: Von uns ein Befehlshaber und von euch ein Befehlshaber.", 1169),
 ("فَذَهَبَ إِلَيْهِمْ أَبُو بَكْرٍ وَعُمَرُ وَأَبُو عُبَيْدَةَ.", "Abu Bakr, ʿUmar und Abu ʿUbayda gingen zu ihnen.", 1169),
 ("وَقَالَ أَبُو بَكْرٍ لِعُمَرَ: ابْسُطْ يَدَكَ نُبَايِعْكَ. فَقَالَ عُمَرُ: أَنْتَ أَفْضَلُ مِنِّي.", "Abu Bakr sagte zu ʿUmar: Streck deine Hand aus, wir huldigen dir. ʿUmar antwortete: Du bist besser als ich.", 1172),
 ("وَقَالَ أَبُو عُبَيْدَةَ لِعُمَرَ: أَتُبَايِعُنِي وَفِيكُمُ الصِّدِّيقُ وَثَانِي اثْنَيْنِ؟", "Auch Abu ʿUbayda sagte zu ʿUmar: Du willst mir huldigen, wo doch der Siddiq und der „Zweite von zweien“ unter euch ist?", 1172),
 ("فَبَسَطَ أَبُو بَكْرٍ يَدَهُ، فَبَايَعَهُ عُمَرُ، ثُمَّ بَايَعَهُ الْمُهَاجِرُونَ وَالْأَنْصَارُ.", "Da streckte Abu Bakr seine Hand aus, ʿUmar huldigte ihm, dann huldigten ihm die Auswanderer und die Ansar.", 1171),
 ("وَقَالَ عُمَرُ: مَا وَجَدْنَا أَمْرًا أَوْفَقَ مِنْ مُبَايَعَةِ أَبِي بَكْرٍ، لِأَنَّنَا خَشِينَا الْخِلَافَ.", "ʿUmar sagte: Wir fanden nichts Passenderes als die Huldigung an Abu Bakr; wir fürchteten Zwietracht.", 1171),
 ("ثُمَّ جَاءَ عَلِيٌّ، فَقَالَ لِأَبِي بَكْرٍ: لَا تَثْرِيبَ عَلَيْكَ يَا خَلِيفَةَ رَسُولِ اللَّهِ، وَبَايَعَهُ.", "Später kam ʿAli, sagte zu Abu Bakr: Kein Vorwurf, Kalif des Gesandten Allahs – und huldigte ihm.", 1173),
 ("وَقَالَ عَلِيٌّ: اخْتَارَ الْمُسْلِمُونَ لِدُنْيَاهُمْ مَنِ اخْتَارَهُ رَسُولُ اللَّهِ لِدِينِهِمْ.", "ʿAli sagte: Die Muslime wählten für ihre weltlichen Angelegenheiten den, den der Gesandte Allahs für ihre Religion gewählt hatte.", 1174),
 # --- Kapitel 3
 ("لَمَّا صَارَ خَلِيفَةً وَضَعَ مَا عِنْدَهُ مِنْ دَنَانِيرَ وَدَرَاهِمَ فِي بَيْتِ الْمَالِ.", "Als er Kalif wurde, legte er seine Dinare und Dirhams in die Staatskasse.", 1162),
 ("وَقَالَ: كُنْتُ أَتَّجِرُ بِهَا، فَلَمَّا وَلِيتُهُمْ شَغَلُونِي.", "Er sagte: Ich habe damit Handel getrieben; seit ich ihre Angelegenheiten führe, haben sie mich davon abgehalten.", 1162),
 ("فَفَرَضُوا لَهُ كُلَّ يَوْمٍ نِصْفَ شَاةٍ.", "Man setzte ihm für jeden Tag eine halbe Ziege fest.", 1162),
 ("وَقَالَ عُمَرُ: إِلَيَّ الْقَضَاءُ، وَقَالَ أَبُو عُبَيْدَةَ: إِلَيَّ الْفَيْءُ.", "ʿUmar sagte: Mir obliegt das Richteramt; Abu ʿUbayda sagte: Mir die Staatseinnahmen.", 1162),
 ("وَقَالَ ابْنُ سِيرِينَ: كَانَ أَبُو بَكْرٍ أَعْبَرَ هَذِهِ الْأُمَّةِ لِلرُّؤْيَا بَعْدَ النَّبِيِّ ﷺ.", "Ibn Sirin sagte: Abu Bakr war nach dem Propheten ﷺ der beste Traumdeuter dieser Umma.", 1162),
 ("وَكَانَ أَوَّلَ مَنْ جَمَعَ الْقُرْآنَ بَيْنَ اللَّوْحَيْنِ.", "Er war der Erste, der den Quran zwischen zwei Buchdeckeln sammelte.", 1163),
 ("وَقَالَ عَلِيٌّ: خَيْرُ هَذِهِ الْأُمَّةِ بَعْدَ نَبِيِّهَا أَبُو بَكْرٍ وَعُمَرُ.", "ʿAli sagte: Die Besten dieser Umma nach ihrem Propheten sind Abu Bakr und ʿUmar.", 1163),
 # --- Kapitel 4
 ("بَدَأَ مَرَضُهُ بَعْدَ أَنِ اغْتَسَلَ فِي يَوْمٍ بَارِدٍ، فَحُمَّ خَمْسَةَ عَشَرَ يَوْمًا.", "Seine Krankheit begann, nachdem er an einem kalten Tag gebadet hatte; er hatte fünfzehn Tage Fieber.", 1164),
 ("وَكَانَ فِي مَرَضِهِ يَأْمُرُ عُمَرَ أَنْ يُصَلِّيَ بِالنَّاسِ.", "In seiner Krankheit ließ er ʿUmar das Gebet leiten.", 1164),
 ("وَلَمَّا ثَقُلَ مَرَضُهُ دَعَا عَبْدَ الرَّحْمَنِ بْنَ عَوْفٍ وَسَأَلَهُ عَنْ عُمَرَ، ثُمَّ دَعَا عُثْمَانَ.", "Als die Krankheit schwerer wurde, rief er ʿAbd ar-Rahman ibn ʿAwf und fragte ihn nach ʿUmar, dann rief er ʿUthman.", 1164),
 ("وَقَالَ لِمَنْ خَوَّفَهُ مِنْ غِلْظَةِ عُمَرَ: أَبِاللَّهِ تُخَوِّفُونِي؟ أَقُولُ: اسْتَخْلَفْتُ عَلَيْهِمْ خَيْرَ أَهْلِكَ.", "Zu dem, der ihn vor ʿUmars Härte warnte, sagte er: Wollt ihr mir mit Allah Angst machen? Ich werde sagen: Ich habe den Besten deiner Leute über sie gesetzt.", 1164),
 ("ثُمَّ أَمَرَ عُثْمَانَ أَنْ يَكْتُبَ عَهْدَهُ.", "Dann ließ er ʿUthman sein Vermächtnis aufschreiben.", 1164),
 ("فَلَمَّا أُغْمِيَ عَلَيْهِ كَتَبَ عُثْمَانُ اسْمَ عُمَرَ، فَلَمَّا أَفَاقَ كَبَّرَ، وَقَالَ: جَزَاكَ اللَّهُ عَنِ الْإِسْلَامِ خَيْرًا.", "Als er ohnmächtig wurde, schrieb ʿUthman ʿUmars Namen; als Abu Bakr erwachte und es hörte, rief er „Allahu akbar“ und sagte: Allah vergelte dir für den Islam Gutes.", 1165),
 ("وَأَمَرَ النَّاسَ أَنْ يَسْمَعُوا لِعُمَرَ وَيُطِيعُوهُ.", "Er befahl den Leuten, auf ʿUmar zu hören und ihm zu gehorchen.", 1165),
 ("وَقَالَ: مُنْذُ وَلِينَا أَمْرَ الْمُسْلِمِينَ لَمْ نَأْكُلْ لَهُمْ دِينَارًا وَلَا دِرْهَمًا.", "Er sagte: Seit wir die Angelegenheiten der Muslime führen, haben wir von ihnen keinen Dinar und keinen Dirham verzehrt.", 1167),
 ("وَأَمَرَ أَنْ يُرَدَّ إِلَى عُمَرَ مَا بَقِيَ عِنْدَهُمْ: الْعَبْدُ، وَالْبَعِيرُ، وَالْقَطِيفَةُ.", "Er ordnete an, dass ʿUmar das zurückgegeben werde, was noch in ihrem Besitz war: der Sklave, das Kamel und die Decke.", 1167),
 ("فَلَمَّا أَخَذَهَا عُمَرُ قَالَ: رَحِمَ اللَّهُ أَبَا بَكْرٍ، لَقَدْ أَتْعَبَ مَنْ بَعْدَهُ.", "Als ʿUmar sie nahm, sagte er: Allah erbarme sich Abu Bakrs – er hat es denen nach ihm schwer gemacht.", 1167),
 ("وَأَوْصَى أَنْ تَغْسِلَهُ زَوْجَتُهُ أَسْمَاءُ بِنْتُ عُمَيْسٍ.", "Er verfügte, dass seine Frau Asma bint ʿUmays ihn wasche.", 1167),
 ("تُوُفِّيَ مَسَاءَ لَيْلَةِ الثُّلَاثَاءِ، وَكَانَتْ خِلَافَتُهُ سَنَتَيْنِ وَمِئَةَ يَوْمٍ.", "Er starb am Abend der Nacht zum Dienstag; sein Kalifat dauerte zwei Jahre und hundert Tage.", 1164),
 ("وَكَانَ عُمْرُهُ ثَلَاثًا وَسِتِّينَ سَنَةً.", "Er wurde dreiundsechzig Jahre alt.", 1168),
]
Z = [
 ("athar", "وكان أول من آمن من الرجال.", "Und er war der erste Mann, der glaubte.", 1155),
 ("hadith", "إن من أمن الناس علي في صحبته وماله أبو بكر، ولو كنت متخذا خليلا لاتخذت أبا بكر خليلا، ولكن أخوة الإسلام", "Der mir in seiner Gefährtenschaft und mit seinem Vermögen am meisten Gutes getan hat, ist Abu Bakr. Würde ich einen engsten Freund nehmen, so nähme ich Abu Bakr; doch es ist die Brüderlichkeit des Islam.", 1158, "متفق على صحته (laut adh-Dhahabi)"),
 ("athar", "بأبي أنت وأمي، طبت حيا وميتا، والذي نفسي بيده لا يذيقك الله موتتين أبدا", "Mein Vater und meine Mutter seien dein Lösegeld! Gut warst du im Leben und im Tod; bei Dem, in Dessen Hand meine Seele ist: Allah lässt dich nie zweimal den Tod kosten. (Abu Bakr)", 1169),
 ("athar", "من كان يعبد محمدا فإن محمدا قد مات، ومن كان يعبد الله فإن الله حي لا يموت", "Wer Muhammad verehrte – Muhammad ist gestorben; wer Allah verehrt – Allah lebt und stirbt nicht. (Abu Bakr)", 1169),
 ("athar", "رحم الله أبا بكر لقد أتعب من بعده", "Allah erbarme sich Abu Bakrs – er hat es denen nach ihm schwer gemacht. (ʿUmar)", 1167),
 ("athar", "خير هذه الأمة بعد نبيها أبو بكر، وعمر.", "Die Besten dieser Umma nach ihrem Propheten sind Abu Bakr und ʿUmar. (ʿAli)", 1163, "متواتر عنه (laut adh-Dhahabi)"),
 ("athar", "أعظم الناس أجرا في المصاحف أبو بكر، كان أول من جمع القرآن بين اللوحين.", "Den größten Lohn bezüglich der Mushafe hat Abu Bakr: Er sammelte als Erster den Quran zwischen zwei Deckeln. (ʿAli)", 1163, "إسناده حسن (laut adh-Dhahabi)"),
]
bio("abu-bakr", S, Z, kapitel={0: "Frühzeit und Gefährtenschaft", 6: "Der Tod des Propheten ﷺ und die Nachfolge", 20: "Seine Amtsführung", 27: "Krankheit, Nachfolger und Tod"})
