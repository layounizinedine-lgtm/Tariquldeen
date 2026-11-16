import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from stufen_lib import speichere
ST = {}
ST["ismail"] = {
"B1": [
 ("#", "Ismail, treu im Versprechen"),
 ("وَاذْكُرْ فِي الْكِتَابِ إِسْمَاعِيلَ، إِنَّهُ كَانَ صَادِقَ الْوَعْدِ وَكَانَ رَسُولًا نَبِيًّا.", "Und erwähne im Buch Ismail: Er hielt sein Versprechen wahrhaftig und war ein Gesandter und Prophet.", "19:54"),
 ("وَكَانَ يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ وَالزَّكَاةِ، وَكَانَ عِنْدَ رَبِّهِ مَرْضِيًّا.", "Er trug seiner Familie Gebet und Zakat auf, und er war bei seinem Herrn wohlgefällig.", "19:55"),
 ("#", "Das große Opfer"),
 ("وَقَالَ إِبْرَاهِيمُ: إِنِّي ذَاهِبٌ إِلَى رَبِّي سَيَهْدِينِ.", "Und Ibrahim sagte: Ich gehe zu meinem Herrn; Er wird mich leiten.", "37:99"),
 ("رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ، فَبَشَّرْنَاهُ بِغُلَامٍ حَلِيمٍ.", "Mein Herr, schenke mir einen von den Rechtschaffenen. Da verkündeten Wir ihm einen sanftmütigen Jungen.", "37:100-101"),
 ("فَلَمَّا بَلَغَ مَعَهُ السَّعْيَ قَالَ: يَا بُنَيَّ إِنِّي أَرَى فِي الْمَنَامِ أَنِّي أَذْبَحُكَ، فَانْظُرْ مَاذَا تَرَى.", "Als er alt genug war, mit ihm zu gehen, sagte er: Mein Sohn, ich sehe im Traum, dass ich dich schlachte; sieh, was du meinst.", "37:102"),
 ("قَالَ: يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ، سَتَجِدُنِي إِنْ شَاءَ اللَّهُ مِنَ الصَّابِرِينَ.", "Er sagte: Mein Vater, tu, was dir befohlen wird; du wirst mich, so Allah will, unter den Geduldigen finden.", "37:102"),
 ("فَلَمَّا أَسْلَمَا وَتَلَّهُ لِلْجَبِينِ، نَادَيْنَاهُ أَنْ يَا إِبْرَاهِيمُ قَدْ صَدَّقْتَ الرُّؤْيَا.", "Als beide sich ergeben hatten und er ihn auf die Stirn gelegt hatte, riefen Wir ihm zu: Ibrahim, du hast die Vision bewahrheitet.", "37:103-105"),
 ("إِنَّ هَذَا لَهُوَ الْبَلَاءُ الْمُبِينُ، وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ.", "Das war wahrlich die offenkundige Prüfung. Und Wir lösten ihn mit einem großen Opfertier aus.", "37:106-107"),
],
"A1": [
 ("إِسْمَاعِيلُ يُحَافِظُ عَلَى وَعْدِهِ.", "Ismail hält sein Versprechen.", "19:54"),
 ("هُوَ رَسُولٌ وَنَبِيٌّ.", "Er ist Gesandter und Prophet.", "19:54"),
 ("هُوَ يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ.", "Er trägt seiner Familie das Gebet auf.", "19:55"),
 ("إِبْرَاهِيمُ يَرَى حُلْمًا.", "Ibrahim hat einen Traum.", "37:102"),
 ("الِابْنُ يَقُولُ: يَا أَبِي، افْعَلْ مَا تُؤْمَرُ.", "Der Sohn sagt: Mein Vater, tu, was dir befohlen wird.", "37:102"),
 ("الِابْنُ صَبُورٌ.", "Der Sohn ist geduldig.", "37:102"),
 ("اللَّهُ يَفْدِيهِ بِذِبْحٍ عَظِيمٍ.", "Allah löst ihn mit einem großen Opfertier aus.", "37:107"),
],
"A2": [
 ("كَانَ إِسْمَاعِيلُ صَادِقَ الْوَعْدِ، وَكَانَ رَسُولًا نَبِيًّا.", "Ismail hielt sein Versprechen wahrhaftig und war ein Gesandter und Prophet.", "19:54"),
 ("كَانَ يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ وَالزَّكَاةِ، وَكَانَ مَرْضِيًّا عِنْدَ رَبِّهِ.", "Er trug seiner Familie Gebet und Zakat auf, und er war bei seinem Herrn wohlgefällig.", "19:55"),
 ("وَهَبَ اللَّهُ لِإِبْرَاهِيمَ غُلَامًا حَلِيمًا.", "Allah schenkte Ibrahim einen sanftmütigen Jungen.", "37:100-101"),
 ("رَأَى إِبْرَاهِيمُ فِي الْمَنَامِ أَنَّهُ يَذْبَحُ ابْنَهُ.", "Ibrahim sah im Traum, dass er seinen Sohn schlachtet.", "37:102"),
 ("قَالَ الِابْنُ: يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ، سَتَجِدُنِي مِنَ الصَّابِرِينَ.", "Der Sohn sagte: Mein Vater, tu, was dir befohlen wird; du wirst mich unter den Geduldigen finden.", "37:102"),
 ("فَلَمَّا أَسْلَمَا نَادَاهُ اللَّهُ: يَا إِبْرَاهِيمُ قَدْ صَدَّقْتَ الرُّؤْيَا.", "Als beide sich ergeben hatten, rief Allah ihm zu: Ibrahim, du hast die Vision bewahrheitet.", "37:103-105"),
 ("وَفَدَاهُ اللَّهُ بِذِبْحٍ عَظِيمٍ.", "Und Allah löste ihn mit einem großen Opfertier aus.", "37:107"),
],
"B2": [
 ("ذَكَرَ اللَّهُ إِسْمَاعِيلَ بِأَنَّهُ صَادِقُ الْوَعْدِ، رَسُولٌ نَبِيٌّ، يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ وَالزَّكَاةِ، وَهُوَ مَرْضِيٌّ عِنْدَ رَبِّهِ.", "Allah erwähnt Ismail als jemanden, der sein Versprechen wahrhaftig hielt, Gesandter und Prophet war, seiner Familie Gebet und Zakat auftrug und bei seinem Herrn wohlgefällig ist.", "19:54-55"),
 ("وَفِي سُورَةِ الصَّافَّاتِ بَشَّرَ اللَّهُ إِبْرَاهِيمَ بِغُلَامٍ حَلِيمٍ، فَلَمَّا بَلَغَ السَّعْيَ رَأَى أَبُوهُ فِي الْمَنَامِ أَنَّهُ يَذْبَحُهُ، فَعَرَضَ عَلَيْهِ الْأَمْرَ فَاسْتَسْلَمَ صَابِرًا.", "In der Sure as-Saffat verkündete Allah Ibrahim einen sanftmütigen Jungen; als er alt genug war, sah der Vater im Traum, dass er ihn schlachtet, legte es ihm vor, und der Sohn fügte sich geduldig.", "37:100-102"),
 ("فَلَمَّا أَسْلَمَا نَادَاهُ اللَّهُ بِأَنَّهُ صَدَّقَ الرُّؤْيَا، وَفَدَاهُ بِذِبْحٍ عَظِيمٍ، وَكَانَ ذَلِكَ الْبَلَاءَ الْمُبِينَ.", "Als beide sich ergeben hatten, rief Allah ihm zu, dass er die Vision bewahrheitet habe, und löste ihn mit einem großen Opfertier aus – das war die offenkundige Prüfung.", "37:103-107"),
],
"C1": [
 ("وُصِفَ إِسْمَاعِيلُ بِصِدْقِ الْوَعْدِ وَالرِّسَالَةِ وَالنُّبُوَّةِ وَبِأَنَّهُ كَانَ يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ وَالزَّكَاةِ مَرْضِيًّا عِنْدَ رَبِّهِ، وَارْتَبَطَ ذِكْرُهُ عِنْدَ أَكْثَرِ الْعُلَمَاءِ بِالْغُلَامِ الْحَلِيمِ الَّذِي اسْتَسْلَمَ لِأَمْرِ اللَّهِ فَفُدِيَ بِذِبْحٍ عَظِيمٍ.", "Ismail wird als wahrhaftig im Versprechen, als Gesandter und Prophet beschrieben, der seiner Familie Gebet und Zakat auftrug und bei seinem Herrn wohlgefällig war; bei den meisten Gelehrten wird er mit dem sanftmütigen Jungen verbunden, der sich Allahs Befehl fügte und mit einem großen Opfertier ausgelöst wurde.", "19:54-55; 37:100-107"),
],
"C2": [
 ("امْتَازَ إِسْمَاعِيلُ بِصِدْقِ الْوَعْدِ وَإِقَامَةِ الصَّلَاةِ فِي أَهْلِهِ، وَيَرَى أَكْثَرُ الْعُلَمَاءِ أَنَّهُ الْغُلَامُ الْحَلِيمُ الَّذِي صَبَرَ لِأَمْرِ رَبِّهِ فَفَدَاهُ اللَّهُ بِذِبْحٍ عَظِيمٍ.", "Ismail zeichnete sich durch Wahrhaftigkeit im Versprechen und das Verrichten des Gebets in seiner Familie aus; die meisten Gelehrten meinen, er sei der sanftmütige Junge, der sich dem Befehl seines Herrn geduldig fügte, worauf Allah ihn mit einem großen Opfertier auslöste (der Koran nennt den Sohn in Sure 37 nicht beim Namen).", "19:54-55; 37:100-107"),
],
}
ST["ishaq"] = {
"B1": [
 ("#", "Die Gäste Ibrahims"),
 ("وَلَقَدْ جَاءَتْ رُسُلُنَا إِبْرَاهِيمَ بِالْبُشْرَى قَالُوا سَلَامًا، قَالَ سَلَامٌ.", "Unsere Gesandten kamen mit froher Botschaft zu Ibrahim; sie sagten: Frieden! Er sagte: Frieden!", "11:69"),
 ("فَمَا لَبِثَ أَنْ جَاءَ بِعِجْلٍ حَنِيذٍ.", "Und es dauerte nicht lange, da brachte er ein gebratenes Kalb.", "11:69"),
 ("فَلَمَّا رَأَى أَيْدِيَهُمْ لَا تَصِلُ إِلَيْهِ نَكِرَهُمْ وَأَوْجَسَ مِنْهُمْ خِيفَةً.", "Als er sah, dass ihre Hände nicht danach griffen, misstraute er ihnen und empfand Furcht vor ihnen.", "11:70"),
 ("قَالُوا: لَا تَخَفْ إِنَّا أُرْسِلْنَا إِلَى قَوْمِ لُوطٍ.", "Sie sagten: Fürchte dich nicht; wir wurden zum Volk Luts gesandt.", "11:70"),
 ("#", "Die frohe Botschaft"),
 ("وَامْرَأَتُهُ قَائِمَةٌ فَضَحِكَتْ، فَبَشَّرْنَاهَا بِإِسْحَاقَ وَمِنْ وَرَاءِ إِسْحَاقَ يَعْقُوبَ.", "Seine Frau stand dabei und lachte; da verkündeten Wir ihr Ishaq und nach Ishaq Yaqub.", "11:71"),
 ("قَالَتْ: يَا وَيْلَتَى أَأَلِدُ وَأَنَا عَجُوزٌ وَهَذَا بَعْلِي شَيْخًا؟ إِنَّ هَذَا لَشَيْءٌ عَجِيبٌ.", "Sie sagte: Wehe mir! Soll ich gebären, wo ich alt bin und dies mein Mann ein Greis ist? Das ist wahrlich etwas Erstaunliches.", "11:72"),
 ("قَالُوا: أَتَعْجَبِينَ مِنْ أَمْرِ اللَّهِ؟ رَحْمَتُ اللَّهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ الْبَيْتِ.", "Sie sagten: Wunderst du dich über Allahs Befehl? Allahs Barmherzigkeit und Segnungen seien auf euch, Leute des Hauses.", "11:73"),
 ("وَبَشَّرْنَاهُ بِإِسْحَاقَ نَبِيًّا مِنَ الصَّالِحِينَ، وَبَارَكْنَا عَلَيْهِ وَعَلَى إِسْحَاقَ.", "Und Wir verkündeten ihm Ishaq, einen Propheten von den Rechtschaffenen, und Wir segneten ihn und Ishaq.", "37:112-113"),
],
"A1": [
 ("الرُّسُلُ يَأْتُونَ إِلَى إِبْرَاهِيمَ.", "Die Gesandten kommen zu Ibrahim.", "11:69"),
 ("هُمْ يَقُولُونَ: سَلَامٌ.", "Sie sagen: Frieden.", "11:69"),
 ("إِبْرَاهِيمُ يُحْضِرُ عِجْلًا.", "Ibrahim bringt ein Kalb.", "11:69"),
 ("هُمْ لَا يَأْكُلُونَ، وَإِبْرَاهِيمُ يَخَافُ.", "Sie essen nicht, und Ibrahim hat Angst.", "11:70"),
 ("هُمْ يَقُولُونَ: لَا تَخَفْ.", "Sie sagen: Hab keine Angst.", "11:70"),
 ("هُمْ يُبَشِّرُونَهَا بِإِسْحَاقَ.", "Sie verkünden ihr Ishaq.", "11:71"),
 ("اللَّهُ يُبَارِكُ إِبْرَاهِيمَ وَإِسْحَاقَ.", "Allah segnet Ibrahim und Ishaq.", "37:113"),
],
"A2": [
 ("جَاءَتْ رُسُلُ اللَّهِ إِلَى إِبْرَاهِيمَ بِالْبُشْرَى وَقَالُوا: سَلَامٌ.", "Die Gesandten Allahs kamen mit froher Botschaft zu Ibrahim und sagten: Frieden.", "11:69"),
 ("قَدَّمَ لَهُمْ عِجْلًا مَشْوِيًّا، لَكِنَّ أَيْدِيَهُمْ لَمْ تَصِلْ إِلَيْهِ.", "Er brachte ihnen ein gebratenes Kalb, aber ihre Hände griffen nicht danach.", "11:69-70"),
 ("فَخَافَ مِنْهُمْ، فَقَالُوا: لَا تَخَفْ، نَحْنُ مُرْسَلُونَ إِلَى قَوْمِ لُوطٍ.", "Da fürchtete er sie, und sie sagten: Hab keine Angst; wir sind zum Volk Luts gesandt.", "11:70"),
 ("وَكَانَتِ امْرَأَتُهُ قَائِمَةً، فَضَحِكَتْ، فَبَشَّرُوهَا بِإِسْحَاقَ وَبَعْدَهُ يَعْقُوبَ.", "Seine Frau stand dabei und lachte; da verkündeten sie ihr Ishaq und nach ihm Yaqub.", "11:71"),
 ("قَالَتْ: كَيْفَ أَلِدُ وَأَنَا عَجُوزٌ وَزَوْجِي شَيْخٌ؟", "Sie sagte: Wie soll ich gebären, wo ich alt bin und mein Mann ein Greis ist?", "11:72"),
 ("قَالُوا: أَتَعْجَبِينَ مِنْ أَمْرِ اللَّهِ؟", "Sie sagten: Wunderst du dich über Allahs Befehl?", "11:73"),
 ("وَبَارَكَ اللَّهُ عَلَى إِبْرَاهِيمَ وَعَلَى إِسْحَاقَ.", "Und Allah segnete Ibrahim und Ishaq.", "37:112-113"),
],
"B2": [
 ("جَاءَتْ رُسُلُ اللَّهِ إِلَى إِبْرَاهِيمَ بِالْبُشْرَى فَقَدَّمَ لَهُمْ عِجْلًا حَنِيذًا، فَلَمَّا رَأَى أَنَّ أَيْدِيَهُمْ لَا تَصِلُ إِلَيْهِ خَافَ مِنْهُمْ، فَطَمْأَنُوهُ بِأَنَّهُمْ أُرْسِلُوا إِلَى قَوْمِ لُوطٍ.", "Die Gesandten Allahs kamen mit froher Botschaft zu Ibrahim, er reichte ihnen ein gebratenes Kalb, und als er sah, dass ihre Hände nicht danach griffen, fürchtete er sich; sie beruhigten ihn, dass sie zum Volk Luts gesandt seien.", "11:69-70"),
 ("ثُمَّ بَشَّرُوا امْرَأَتَهُ بِإِسْحَاقَ وَمِنْ وَرَائِهِ يَعْقُوبَ، فَتَعَجَّبَتْ لِكِبَرِهَا وَكِبَرِ زَوْجِهَا، فَذَكَّرُوهَا بِأَنَّ ذَلِكَ أَمْرُ اللَّهِ وَرَحْمَتُهُ وَبَرَكَاتُهُ عَلَيْهِمْ.", "Dann verkündeten sie seiner Frau Ishaq und nach ihm Yaqub; sie wunderte sich wegen ihres und ihres Mannes hohen Alters, und sie erinnerten sie, dass dies Allahs Befehl sei und Seine Barmherzigkeit und Segnungen auf ihnen ruhten.", "11:71-73"),
 ("وَوُصِفَ إِسْحَاقُ بِأَنَّهُ نَبِيٌّ مِنَ الصَّالِحِينَ، وَبَارَكَ اللَّهُ عَلَيْهِ وَعَلَى أَبِيهِ.", "Ishaq wird als Prophet von den Rechtschaffenen beschrieben, und Allah segnete ihn und seinen Vater.", "37:112-113"),
],
"C1": [
 ("بُشِّرَ إِبْرَاهِيمُ وَامْرَأَتُهُ عَلَى لِسَانِ الرُّسُلِ بِإِسْحَاقَ وَمِنْ وَرَائِهِ يَعْقُوبَ، فَتَعَجَّبَتِ الْمَرْأَةُ مِنْ ذَلِكَ لِكِبَرِهَا، فَرُدَّ عَلَيْهَا بِأَنَّهُ أَمْرُ اللَّهِ وَبَرَكَتُهُ عَلَى أَهْلِ الْبَيْتِ.", "Ibrahim und seine Frau erhielten durch die Gesandten die frohe Botschaft von Ishaq und nach ihm Yaqub; die Frau wunderte sich wegen ihres Alters, und es wurde ihr geantwortet, es sei Allahs Befehl und Segen für die Leute des Hauses.", "11:69-73"),
 ("وَسَمَّاهُ اللَّهُ نَبِيًّا مِنَ الصَّالِحِينَ وَبَارَكَ عَلَيْهِ.", "Und Allah nannte ihn einen Propheten von den Rechtschaffenen und segnete ihn.", "37:112-113"),
],
"C2": [
 ("جَاءَتْ رُسُلُ اللَّهِ إِبْرَاهِيمَ بِبُشْرَى إِسْحَاقَ، وَمِنْ وَرَائِهِ يَعْقُوبَ، فَتَعَجَّبَتْ زَوْجُهُ لِكِبَرِهَا وَكِبَرِ بَعْلِهَا، فَقِيلَ لَهَا إِنَّ ذَلِكَ أَمْرُ اللَّهِ وَرَحْمَتُهُ وَبَرَكَاتُهُ، وَصَارَ إِسْحَاقُ نَبِيًّا مِنَ الصَّالِحِينَ.", "Die Gesandten Allahs brachten Ibrahim die frohe Botschaft von Ishaq und nach ihm Yaqub; seine Frau wunderte sich wegen ihres und ihres Mannes Alters, und man sagte ihr, dies sei Allahs Befehl, Barmherzigkeit und Segen; und Ishaq wurde ein Prophet von den Rechtschaffenen.", "11:69-73; 37:112-113"),
],
}
ST["yaqub"] = {
"B1": [
 ("#", "Das Vermächtnis"),
 ("وَوَصَّى بِهَا إِبْرَاهِيمُ بَنِيهِ وَيَعْقُوبُ: يَا بَنِيَّ إِنَّ اللَّهَ اصْطَفَى لَكُمُ الدِّينَ فَلَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ.", "Und Ibrahim trug es seinen Söhnen auf, ebenso Yaqub: Meine Söhne, Allah hat euch die Religion erwählt; sterbt nur als Muslime.", "2:132"),
 ("أَمْ كُنْتُمْ شُهَدَاءَ إِذْ حَضَرَ يَعْقُوبَ الْمَوْتُ إِذْ قَالَ لِبَنِيهِ: مَا تَعْبُدُونَ مِنْ بَعْدِي؟", "Wart ihr etwa Zeugen, als der Tod zu Yaqub kam und er zu seinen Söhnen sagte: Was werdet ihr nach mir anbeten?", "2:133"),
 ("قَالُوا: نَعْبُدُ إِلَهَكَ وَإِلَهَ آبَائِكَ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَإِسْحَاقَ إِلَهًا وَاحِدًا وَنَحْنُ لَهُ مُسْلِمُونَ.", "Sie sagten: Wir beten deinen Gott an und den Gott deiner Väter Ibrahim, Ismail und Ishaq, einen einzigen Gott, und wir sind Ihm ergeben.", "2:133"),
 ("#", "Die Geduld"),
 ("قَالَ يَعْقُوبُ: بَلْ سَوَّلَتْ لَكُمْ أَنْفُسُكُمْ أَمْرًا فَصَبْرٌ جَمِيلٌ.", "Yaqub sagte: Vielmehr haben eure Seelen euch etwas ausgemalt; schöne Geduld!", "12:83"),
 ("وَتَوَلَّى عَنْهُمْ وَقَالَ: يَا أَسَفَى عَلَى يُوسُفَ، وَابْيَضَّتْ عَيْنَاهُ مِنَ الْحُزْنِ فَهُوَ كَظِيمٌ.", "Er wandte sich von ihnen ab und sagte: Wie groß ist mein Kummer um Yusuf! Seine Augen wurden weiß vor Trauer, doch er hielt ihn zurück.", "12:84"),
 ("قَالَ: إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ، وَأَعْلَمُ مِنَ اللَّهِ مَا لَا تَعْلَمُونَ.", "Er sagte: Ich klage meinen Kummer und meine Trauer nur Allah, und ich weiß von Allah, was ihr nicht wisst.", "12:86"),
 ("يَا بَنِيَّ اذْهَبُوا فَتَحَسَّسُوا مِنْ يُوسُفَ وَأَخِيهِ وَلَا تَيْأَسُوا مِنْ رَوْحِ اللَّهِ.", "Meine Söhne, geht und forscht nach Yusuf und seinem Bruder, und verliert nicht die Hoffnung auf Allahs Erbarmen.", "12:87"),
 ("#", "Das Wiedersehen"),
 ("وَلَمَّا فَصَلَتِ الْعِيرُ قَالَ أَبُوهُمْ: إِنِّي لَأَجِدُ رِيحَ يُوسُفَ لَوْلَا أَنْ تُفَنِّدُونِ.", "Als die Karawane aufbrach, sagte ihr Vater: Ich nehme Yusufs Duft wahr, wenn ihr mich nicht für altersschwach haltet.", "12:94"),
 ("فَلَمَّا جَاءَ الْبَشِيرُ أَلْقَاهُ عَلَى وَجْهِهِ فَارْتَدَّ بَصِيرًا.", "Als der Freudenbote kam, warf er das Hemd auf sein Gesicht, und er wurde wieder sehend.", "12:96"),
 ("قَالَ: أَلَمْ أَقُلْ لَكُمْ إِنِّي أَعْلَمُ مِنَ اللَّهِ مَا لَا تَعْلَمُونَ؟", "Er sagte: Habe ich euch nicht gesagt, dass ich von Allah weiß, was ihr nicht wisst?", "12:96"),
],
"A1": [
 ("يَعْقُوبُ يَقُولُ لِأَبْنَائِهِ: مَاتُوا مُسْلِمِينَ.", "Yaqub sagt zu seinen Söhnen: Sterbt als Muslime.", "2:132"),
 ("الْأَبْنَاءُ يَقُولُونَ: نَعْبُدُ إِلَهًا وَاحِدًا.", "Die Söhne sagen: Wir beten einen einzigen Gott an.", "2:133"),
 ("يَعْقُوبُ فَقَدَ يُوسُفَ.", "Yaqub hat Yusuf verloren.", "12:84"),
 ("يَعْقُوبُ يَقُولُ: صَبْرٌ جَمِيلٌ.", "Yaqub sagt: Schöne Geduld.", "12:83"),
 ("يَعْقُوبُ حَزِينٌ.", "Yaqub ist traurig.", "12:84"),
 ("هُوَ يَشْكُو إِلَى اللَّهِ.", "Er klagt Allah sein Leid.", "12:86"),
 ("لَا تَيْأَسُوا مِنْ رَحْمَةِ اللَّهِ.", "Verliert nicht die Hoffnung auf Allahs Erbarmen.", "12:87"),
 ("الْقَمِيصُ عَلَى وَجْهِهِ، وَهُوَ يَرَى.", "Das Hemd liegt auf seinem Gesicht, und er sieht.", "12:96"),
],
"A2": [
 ("قَالَ يَعْقُوبُ لِأَبْنَائِهِ: لَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ.", "Yaqub sagte zu seinen Söhnen: Sterbt nur als Muslime.", "2:132"),
 ("وَسَأَلَهُمْ: مَاذَا تَعْبُدُونَ بَعْدِي؟", "Und er fragte sie: Was werdet ihr nach mir anbeten?", "2:133"),
 ("قَالُوا: نَعْبُدُ إِلَهَكَ وَإِلَهَ آبَائِكَ، إِلَهًا وَاحِدًا.", "Sie sagten: Wir beten deinen Gott und den Gott deiner Väter an, einen einzigen Gott.", "2:133"),
 ("فَقَدَ يَعْقُوبُ ابْنَهُ، فَقَالَ: صَبْرٌ جَمِيلٌ.", "Yaqub verlor seinen Sohn, und er sagte: Schöne Geduld.", "12:83"),
 ("وَابْيَضَّتْ عَيْنَاهُ مِنَ الْحُزْنِ.", "Und seine Augen wurden weiß vor Trauer.", "12:84"),
 ("قَالَ: أَشْكُو حُزْنِي إِلَى اللَّهِ، وَلَا تَيْأَسُوا مِنْ رَحْمَتِهِ.", "Er sagte: Ich klage Allah meine Trauer, und verliert nicht die Hoffnung auf Seine Barmherzigkeit.", "12:86-87"),
 ("شَمَّ رِيحَ يُوسُفَ، وَلَمَّا أُلْقِيَ الْقَمِيصُ عَلَى وَجْهِهِ عَادَ بَصِيرًا.", "Er nahm Yusufs Duft wahr, und als das Hemd auf sein Gesicht gelegt wurde, wurde er wieder sehend.", "12:94-96"),
],
"B2": [
 ("أَوْصَى يَعْقُوبُ بَنِيهِ كَمَا أَوْصَى إِبْرَاهِيمُ بِأَنْ لَا يَمُوتُوا إِلَّا مُسْلِمِينَ، وَسَأَلَهُمْ عِنْدَ الْمَوْتِ عَمَّا يَعْبُدُونَ، فَأَجَابُوا بِأَنَّهُمْ يَعْبُدُونَ إِلَهَهُ وَإِلَهَ آبَائِهِ إِلَهًا وَاحِدًا.", "Yaqub trug seinen Söhnen auf, wie es Ibrahim getan hatte, nur als Muslime zu sterben, und fragte sie beim Tod, was sie anbeten würden; sie antworteten, sie beteten seinen Gott und den Gott seiner Väter an, einen einzigen Gott.", "2:132-133"),
 ("وَلَمَّا فَقَدَ يُوسُفَ وَأَخَاهُ قَابَلَ ذَلِكَ بِالصَّبْرِ الْجَمِيلِ وَشَكَا بَثَّهُ إِلَى اللَّهِ حَتَّى ابْيَضَّتْ عَيْنَاهُ، وَلَمْ يَيْأَسْ مِنْ رَوْحِ اللَّهِ.", "Als er Yusuf und dessen Bruder verlor, begegnete er dem mit schöner Geduld und klagte Allah seinen Kummer, bis seine Augen weiß wurden, und er verzweifelte nicht an Allahs Erbarmen.", "12:83-87"),
 ("ثُمَّ وَجَدَ رِيحَ يُوسُفَ قَبْلَ وُصُولِ الْبَشِيرِ، وَلَمَّا أُلْقِيَ الْقَمِيصُ عَلَى وَجْهِهِ ارْتَدَّ بَصِيرًا.", "Dann nahm er Yusufs Duft wahr, noch ehe der Bote ankam, und als das Hemd auf sein Gesicht gelegt wurde, wurde er wieder sehend.", "12:94-96"),
],
"C1": [
 ("جَمَعَ يَعْقُوبُ بَيْنَ الْوَصِيَّةِ بِالتَّوْحِيدِ وَالصَّبْرِ الْجَمِيلِ عَلَى فَقْدِ وَلَدَيْهِ، فَشَكَا بَثَّهُ إِلَى اللَّهِ وَحْدَهُ وَحَثَّ بَنِيهِ عَلَى الْبَحْثِ وَعَدَمِ الْيَأْسِ مِنْ رَوْحِ اللَّهِ.", "Yaqub verband das Vermächtnis der Einzigkeit Allahs mit schöner Geduld im Verlust seiner beiden Söhne; er klagte seinen Kummer allein Allah und trieb seine Söhne an, zu suchen und nicht an Allahs Erbarmen zu verzweifeln.", "2:132-133; 12:83-87"),
 ("وَلَمَّا أُلْقِيَ الْقَمِيصُ عَلَى وَجْهِهِ عَادَ بَصَرُهُ، وَقَالَ إِنَّهُ يَعْلَمُ مِنَ اللَّهِ مَا لَا يَعْلَمُونَ.", "Als das Hemd auf sein Gesicht gelegt wurde, kehrte sein Augenlicht zurück, und er sagte, er wisse von Allah, was sie nicht wissen.", "12:93-96"),
],
"C2": [
 ("ظَلَّ يَعْقُوبُ ثَابِتًا عَلَى التَّوْحِيدِ وَوَصَّى بَنِيهِ بِهِ، وَصَبَرَ صَبْرًا جَمِيلًا عَلَى مَا أَصَابَهُ، وَرَجَا رَوْحَ اللَّهِ حَتَّى ارْتَدَّ بَصِيرًا بِقَمِيصِ يُوسُفَ.", "Yaqub blieb standhaft bei der Einzigkeit Allahs und trug sie seinen Söhnen als Vermächtnis auf, übte schöne Geduld im Leid und hoffte auf Allahs Erbarmen, bis er durch Yusufs Hemd wieder sehend wurde.", "2:132-133; 12:83-87; 12:93-96"),
],
}
ST["ayyub"] = {
"B1": [
 ("#", "Die Prüfung"),
 ("وَأَيُّوبَ إِذْ نَادَى رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ.", "Und Ayyub, als er seinen Herrn anrief: Mich hat Leid getroffen, und Du bist der Barmherzigste der Barmherzigen.", "21:83"),
 ("وَاذْكُرْ عَبْدَنَا أَيُّوبَ إِذْ نَادَى رَبَّهُ أَنِّي مَسَّنِيَ الشَّيْطَانُ بِنُصْبٍ وَعَذَابٍ.", "Und erwähne Unseren Diener Ayyub, als er seinen Herrn anrief: Der Satan hat mich mit Mühsal und Pein berührt.", "38:41"),
 ("#", "Die Erhörung"),
 ("فَاسْتَجَبْنَا لَهُ فَكَشَفْنَا مَا بِهِ مِنْ ضُرٍّ.", "Da erhörten Wir ihn und nahmen das Leid von ihm.", "21:84"),
 ("ارْكُضْ بِرِجْلِكَ، هَذَا مُغْتَسَلٌ بَارِدٌ وَشَرَابٌ.", "Stampfe mit deinem Fuß auf; hier ist ein kühles Bad und ein Trank.", "38:42"),
 ("وَآتَيْنَاهُ أَهْلَهُ وَمِثْلَهُمْ مَعَهُمْ رَحْمَةً مِنَّا وَذِكْرَى لِلْعَابِدِينَ.", "Und Wir gaben ihm seine Familie und noch einmal so viele dazu, als Barmherzigkeit von Uns und als Erinnerung für die Dienenden.", "21:84"),
 ("وَخُذْ بِيَدِكَ ضِغْثًا فَاضْرِبْ بِهِ وَلَا تَحْنَثْ.", "Und nimm ein Bündel in deine Hand und schlage damit und brich deinen Eid nicht.", "38:44"),
 ("إِنَّا وَجَدْنَاهُ صَابِرًا، نِعْمَ الْعَبْدُ إِنَّهُ أَوَّابٌ.", "Wir fanden ihn geduldig; ein vortrefflicher Diener, wahrlich, er wandte sich stets Allah zu.", "38:44"),
],
"A1": [
 ("أَيُّوبُ مَرِيضٌ وَفِي ضُرٍّ.", "Ayyub ist krank und leidet.", "21:83"),
 ("أَيُّوبُ يَدْعُو رَبَّهُ.", "Ayyub ruft seinen Herrn an.", "21:83"),
 ("هُوَ يَقُولُ: أَنْتَ أَرْحَمُ الرَّاحِمِينَ.", "Er sagt: Du bist der Barmherzigste der Barmherzigen.", "21:83"),
 ("هُوَ صَابِرٌ.", "Er ist geduldig.", "38:44"),
 ("اللَّهُ يَقُولُ: اضْرِبْ بِرِجْلِكَ.", "Allah sagt: Stampfe mit deinem Fuß.", "38:42"),
 ("اللَّهُ يُزِيلُ الضُّرَّ.", "Allah nimmt das Leid weg.", "21:84"),
 ("اللَّهُ يُعْطِيهِ أَهْلَهُ وَمِثْلَهُمْ.", "Allah gibt ihm seine Familie und noch einmal so viele.", "21:84"),
],
"A2": [
 ("أَصَابَ أَيُّوبَ الضُّرُّ، فَنَادَى رَبَّهُ.", "Ayyub traf Leid, und er rief seinen Herrn an.", "21:83"),
 ("قَالَ: مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ.", "Er sagte: Mich hat Leid getroffen, und Du bist der Barmherzigste der Barmherzigen.", "21:83"),
 ("فَاسْتَجَابَ اللَّهُ لَهُ، وَقَالَ لَهُ: اضْرِبْ بِرِجْلِكَ.", "Da erhörte Allah ihn und sagte zu ihm: Stampfe mit deinem Fuß.", "21:84; 38:42"),
 ("هَذَا مَاءٌ بَارِدٌ لِلِاغْتِسَالِ وَالشُّرْبِ.", "Das ist kaltes Wasser zum Baden und Trinken.", "38:42"),
 ("وَكَشَفَ اللَّهُ عَنْهُ الضُّرَّ، وَأَعْطَاهُ أَهْلَهُ وَمِثْلَهُمْ مَعَهُمْ.", "Und Allah nahm das Leid von ihm und gab ihm seine Familie und noch einmal so viele dazu.", "21:84"),
 ("وَجَدَهُ اللَّهُ صَابِرًا، نِعْمَ الْعَبْدُ.", "Allah fand ihn geduldig, ein vortrefflicher Diener.", "38:44"),
],
"B2": [
 ("أَصَابَ أَيُّوبَ ضُرٌّ شَدِيدٌ، فَصَبَرَ وَلَمْ يَشْكُ إِلَّا إِلَى رَبِّهِ، وَدَعَاهُ بِأَنَّهُ أَرْحَمُ الرَّاحِمِينَ.", "Ayyub traf schweres Leid; er blieb geduldig und klagte nur seinem Herrn und rief Ihn als den Barmherzigsten der Barmherzigen an.", "21:83; 38:41"),
 ("فَاسْتَجَابَ اللَّهُ لَهُ، وَأَمَرَهُ أَنْ يَضْرِبَ الْأَرْضَ بِرِجْلِهِ فَنَبَعَ مَاءٌ بَارِدٌ لِلِاغْتِسَالِ وَالشُّرْبِ.", "Allah erhörte ihn und befahl ihm, mit dem Fuß auf die Erde zu stampfen, worauf kaltes Wasser zum Baden und Trinken hervorkam.", "38:42"),
 ("ثُمَّ كَشَفَ عَنْهُ الضُّرَّ وَأَعْطَاهُ أَهْلَهُ وَمِثْلَهُمْ رَحْمَةً مِنْهُ وَذِكْرَى لِلْعَابِدِينَ، وَشَهِدَ لَهُ بِالصَّبْرِ.", "Dann nahm Er das Leid von ihm, gab ihm seine Familie und noch einmal so viele als Barmherzigkeit und Erinnerung für die Dienenden und bezeugte ihm die Geduld.", "21:84; 38:43-44"),
],
"C1": [
 ("دَعَا أَيُّوبُ رَبَّهُ فِي ضُرِّهِ مُتَوَسِّلًا بِرَحْمَتِهِ، فَاسْتَجَابَ اللَّهُ لَهُ وَأَمَرَهُ بِالرَّكْضِ بِرِجْلِهِ لِيَنْبُعَ مَاءٌ بَارِدٌ، وَكَشَفَ ضُرَّهُ وَرَدَّ إِلَيْهِ أَهْلَهُ وَمِثْلَهُمْ رَحْمَةً وَذِكْرَى لِأُولِي الْأَلْبَابِ.", "Ayyub rief in seinem Leid seinen Herrn an und berief sich auf Seine Barmherzigkeit; Allah erhörte ihn, hieß ihn mit dem Fuß aufstampfen, damit kaltes Wasser hervorsprudelte, nahm sein Leid und gab ihm seine Familie und noch einmal so viele zurück als Barmherzigkeit und Erinnerung für die Verständigen.", "21:83-84; 38:41-43"),
 ("وَأَرْشَدَهُ إِلَى الْبَرِّ بِقَسَمِهِ بِالضِّغْثِ، وَشَهِدَ لَهُ بِالصَّبْرِ وَالْأَوْبَةِ.", "Und Er leitete ihn, seinen Eid mit dem Bündel zu erfüllen, und bezeugte ihm Geduld und Umkehr.", "38:44"),
],
"C2": [
 ("ابْتُلِيَ أَيُّوبُ بِالضُّرِّ فَصَبَرَ وَنَادَى رَبَّهُ، فَاسْتُجِيبَ لَهُ وَكُشِفَ مَا بِهِ وَرُدَّ إِلَيْهِ أَهْلُهُ وَمِثْلُهُمْ رَحْمَةً مِنَ اللَّهِ وَذِكْرَى لِلْعَابِدِينَ، وَشُهِدَ لَهُ بِأَنَّهُ نِعْمَ الْعَبْدُ أَوَّابٌ.", "Ayyub wurde mit Leid geprüft, blieb geduldig und rief seinen Herrn an; er wurde erhört, sein Leid wurde genommen, und seine Familie und noch einmal so viele wurden ihm gegeben als Barmherzigkeit von Allah und Erinnerung für die Dienenden; und ihm wurde bezeugt, ein vortrefflicher Diener zu sein, der sich stets zuwendet.", "21:83-84; 38:41-44"),
],
}
ST["harun"] = {
"B1": [
 ("#", "Musas Bitte"),
 ("وَاجْعَلْ لِي وَزِيرًا مِنْ أَهْلِي، هَارُونَ أَخِي.", "Und mache mir einen Helfer aus meiner Familie, Harun, meinen Bruder.", "20:29-30"),
 ("اشْدُدْ بِهِ أَزْرِي، وَأَشْرِكْهُ فِي أَمْرِي.", "Stärke durch ihn meinen Rücken und lass ihn an meiner Aufgabe teilhaben.", "20:31-32"),
 ("كَيْ نُسَبِّحَكَ كَثِيرًا وَنَذْكُرَكَ كَثِيرًا، إِنَّكَ كُنْتَ بِنَا بَصِيرًا.", "Damit wir Dich viel preisen und viel an Dich denken; Du warst uns gegenüber stets sehend.", "20:33-35"),
 ("#", "Die Erhörung"),
 ("قَالَ: قَدْ أُوتِيتَ سُؤْلَكَ يَا مُوسَى.", "Er sagte: Dir ist deine Bitte gewährt, Musa.", "20:36"),
 ("وَوَهَبْنَا لَهُ مِنْ رَحْمَتِنَا أَخَاهُ هَارُونَ نَبِيًّا.", "Und Wir schenkten ihm aus Unserer Barmherzigkeit seinen Bruder Harun als Propheten.", "19:53"),
],
"A1": [
 ("مُوسَى يَدْعُو رَبَّهُ.", "Musa ruft seinen Herrn an.", "20:29"),
 ("هُوَ يَقُولُ: اجْعَلْ هَارُونَ أَخِي وَزِيرًا لِي.", "Er sagt: Mach meinen Bruder Harun zu meinem Helfer.", "20:29-30"),
 ("هَارُونُ يُقَوِّي مُوسَى.", "Harun stärkt Musa.", "20:31"),
 ("اللَّهُ يَقُولُ: قَدْ أُوتِيتَ سُؤْلَكَ.", "Allah sagt: Dir ist deine Bitte gewährt.", "20:36"),
 ("هَارُونُ نَبِيٌّ.", "Harun ist ein Prophet.", "19:53"),
],
"A2": [
 ("طَلَبَ مُوسَى مِنْ رَبِّهِ: اجْعَلْ لِي وَزِيرًا مِنْ أَهْلِي.", "Musa bat seinen Herrn: Mach mir einen Helfer aus meiner Familie.", "20:29"),
 ("قَالَ: هَارُونُ أَخِي، اشْدُدْ بِهِ ظَهْرِي، وَأَشْرِكْهُ فِي أَمْرِي.", "Er sagte: Harun, mein Bruder; stärke durch ihn meinen Rücken und lass ihn an meiner Aufgabe teilhaben.", "20:30-32"),
 ("لِنُسَبِّحَكَ كَثِيرًا وَنَذْكُرَكَ كَثِيرًا.", "Damit wir Dich viel preisen und viel an Dich denken.", "20:33-34"),
 ("فَقَالَ اللَّهُ: قَدْ أُوتِيتَ سُؤْلَكَ يَا مُوسَى.", "Da sagte Allah: Dir ist deine Bitte gewährt, Musa.", "20:36"),
 ("وَجَعَلَ اللَّهُ هَارُونَ نَبِيًّا رَحْمَةً بِمُوسَى.", "Und Allah machte Harun zum Propheten, aus Barmherzigkeit mit Musa.", "19:53"),
],
"B2": [
 ("سَأَلَ مُوسَى رَبَّهُ أَنْ يَجْعَلَ لَهُ وَزِيرًا مِنْ أَهْلِهِ هُوَ أَخُوهُ هَارُونُ، يَشُدُّ بِهِ ظَهْرَهُ وَيُشْرِكُهُ فِي أَمْرِهِ لِيُكْثِرَا مِنْ تَسْبِيحِ اللَّهِ وَذِكْرِهِ.", "Musa bat seinen Herrn, ihm einen Helfer aus seiner Familie zu geben, seinen Bruder Harun, durch den er seinen Rücken stärkt und der an seiner Aufgabe teilhat, damit sie Allah viel preisen und seiner gedenken.", "20:29-35"),
 ("فَاسْتَجَابَ اللَّهُ لَهُ وَوَهَبَهُ أَخَاهُ هَارُونَ نَبِيًّا رَحْمَةً مِنْهُ.", "Allah erhörte ihn und schenkte ihm seinen Bruder Harun als Propheten aus Barmherzigkeit.", "20:36; 19:53"),
],
"C1": [
 ("دَعَا مُوسَى رَبَّهُ أَنْ يُؤَيِّدَهُ بِأَخِيهِ هَارُونَ وَزِيرًا وَشَرِيكًا فِي الرِّسَالَةِ لِكَثْرَةِ التَّسْبِيحِ وَالذِّكْرِ، فَأُجِيبَ سُؤْلُهُ وَصَارَ هَارُونُ نَبِيًّا رَحْمَةً مِنَ اللَّهِ.", "Musa bat seinen Herrn, ihn durch seinen Bruder Harun als Helfer und Teilhaber an der Botschaft zu stärken, damit sie Allah häufig preisen und gedenken; seine Bitte wurde erfüllt, und Harun wurde ein Prophet aus Allahs Barmherzigkeit.", "20:29-36; 19:53"),
],
"C2": [
 ("سَأَلَ مُوسَى أَنْ يَشُدَّ اللَّهُ أَزْرَهُ بِأَخِيهِ هَارُونَ وَيُشْرِكَهُ فِي أَمْرِهِ، فَقَالَ اللَّهُ: قَدْ أُوتِيتَ سُؤْلَكَ، وَوَهَبَ لَهُ مِنْ رَحْمَتِهِ أَخَاهُ نَبِيًّا.", "Musa bat, dass Allah seinen Rücken durch seinen Bruder Harun stärke und ihn an seiner Aufgabe teilhaben lasse; da sprach Allah: Dir ist deine Bitte gewährt, und Er schenkte ihm aus Seiner Barmherzigkeit seinen Bruder als Propheten.", "20:29-36; 19:53"),
],
}
speichere(ST)
