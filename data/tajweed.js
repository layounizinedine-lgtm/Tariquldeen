// data/tajweed.js
// Übersicht über die wichtigsten Tajweed-Regeln (Regeln der korrekten
// Quran-Rezitation), mit arabischen Beispielen und deutscher Erklärung.
// Dient als Lernbegleiter – ersetzt nicht das Lernen bei einem Lehrer
// (Talaqqi), was für den Erwerb der korrekten Aussprache unerlässlich ist.

export const TAJWEED_CATEGORIES = [
  {
    id: "grundlagen",
    title: "Grundlagen",
    icon: "📖",
    rules: [
      {
        title: "Was ist Tajweed?",
        description:
          "Tajweed (تجويد) bedeutet wörtlich „Verbesserung/Verschönerung“. Es bezeichnet die Wissenschaft, den Quran so zu rezitieren, wie er dem Propheten ﷺ offenbart wurde – mit korrekter Artikulation der Buchstaben (Makharij), ihren Eigenschaften (Sifat) und den Regeln, die beim Zusammentreffen von Buchstaben gelten.",
      },
      {
        title: "Makharij al-Huruf – Artikulationsstellen",
        description:
          "Jeder arabische Buchstabe hat einen bestimmten Ort im Mund- und Rachenraum, an dem er gebildet wird: die Kehle (ء ه ع ح غ خ), die Zunge (die meisten Buchstaben), die Lippen (ب م و ف) und die Nasenhöhle (Ghunna). Die genaue Artikulationsstelle lernt man am besten praktisch bei einem qualifizierten Lehrer.",
      },
      {
        title: "Farbcodierung im Mushaf",
        description:
          "Viele „Tajweed-Mushafs“ nutzen Farben, um Regeln visuell hervorzuheben, z. B. Rot/Rosa für Madd (Dehnung), Grün für Ghunna (Nasallaut), Blau für Idgham. Diese App zeigt die Regeln textuell – nutze zusätzlich einen farbcodierten Mushaf oder eine Quran-App zur Übung.",
      },
    ],
  },
  {
    id: "noon-tanwin",
    title: "Noon Sakinah & Tanwin",
    icon: "ن",
    rules: [
      {
        title: "Izhar (Klare Aussprache) – إظهار",
        description:
          "Tritt Noon Sakinah (نْ) oder Tanwin auf einen der 6 Kehlbuchstaben (ء ه ع ح غ خ), wird das Noon klar und deutlich ohne Ghunna-Verlängerung ausgesprochen.",
        example: "مَنْ آمَنَ — كُفُوًا أَحَدٌ",
      },
      {
        title: "Idgham (Verschmelzung) – إدغام",
        description:
          "Noon Sakinah/Tanwin verschmilzt mit einem der 6 Buchstaben ي ر م ل و ن (zusammengefasst im Merkwort „يرملون“). Man unterscheidet Idgham mit Ghunna (ي ن م و) und ohne Ghunna (ل ر).",
        example: "مَن يَقُولُ (mit Ghunna) — مِن لَّدُنْهُ (ohne Ghunna)",
      },
      {
        title: "Iqlab (Umwandlung) – إقلاب",
        description:
          "Trifft Noon Sakinah/Tanwin auf den Buchstaben ب, wird das Noon in ein Meem (م) mit Ghunna umgewandelt, gesprochen mit geschlossenen Lippen.",
        example: "مِنْ بَعْدِ → „mim ba‘di“",
      },
      {
        title: "Ikhfa (Verstecken) – إخفاء",
        description:
          "Bei den übrigen 15 Buchstaben wird das Noon Sakinah/Tanwin weder klar ausgesprochen noch vollständig verschmolzen, sondern „versteckt“ mit einer nasalen Ghunna zwischen Izhar und Idgham.",
        example: "مَن تَابَ — عَذَابٌ أَلِيمٌ",
      },
    ],
  },
  {
    id: "meem-sakinah",
    title: "Meem Sakinah",
    icon: "م",
    rules: [
      {
        title: "Ikhfa Shafawi (Labiales Verstecken)",
        description: "Trifft Meem Sakinah (مْ) auf ب, wird es mit leichter Ghunna und geschlossenen Lippen „versteckt“ ausgesprochen.",
        example: "تَرْمِيهِم بِحِجَارَةٍ",
      },
      {
        title: "Idgham Shafawi",
        description: "Trifft Meem Sakinah auf ein weiteres م, verschmelzen beide zu einem betonten Meem mit Ghunna.",
        example: "لَهُم مَّا يَشَاءُونَ",
      },
      {
        title: "Izhar Shafawi",
        description: "Bei allen anderen Buchstaben wird Meem Sakinah klar und deutlich ausgesprochen, besonders deutlich vor و und ف.",
        example: "عَلَيْهِمْ وَلَا الضَّالِّينَ",
      },
    ],
  },
  {
    id: "qalqalah",
    title: "Qalqalah (Echo-Laut)",
    icon: "ق",
    rules: [
      {
        title: "Die Qalqalah-Buchstaben",
        description:
          "Die fünf Buchstaben ق ط ب ج د (zusammengefasst im Merkwort „قُطْبُ جَدٍ“) erhalten, wenn sie mit Sukun (Ruhezeichen) stehen, einen kleinen „Echo“-Klang statt einer stummen Aussprache.",
        example: "يَخْلُقُ — أَحَطتُ — يَجْعَلُ",
      },
      {
        title: "Qalqalah Sughra & Kubra",
        description:
          "Sughra (klein): der Buchstabe steht in der Wortmitte mit Sukun. Kubra (groß): der Buchstabe steht am Wortende (z. B. beim Stopp/Waqf) – hier ist das Echo deutlicher hörbar.",
        example: "Sughra: يَقْطَعُونَ — Kubra: الْفَلَقْ (bei Waqf)",
      },
    ],
  },
  {
    id: "madd",
    title: "Madd (Dehnung)",
    icon: "ٓ",
    rules: [
      {
        title: "Madd Asli / Tabi'i (Natürliche Dehnung)",
        description:
          "Die Grunddehnung um 2 Zeitmaße (Harakat), wenn einer der Dehnungsbuchstaben ا و ي auf den passenden kurzen Vokal folgt, ohne Hamza oder Sukun danach.",
        example: "قَالَ — يَقُولُ — قِيلَ",
      },
      {
        title: "Madd Muttasil (Verbundene Dehnung)",
        description: "Trifft ein Dehnungsbuchstabe innerhalb desselben Wortes auf ein Hamza, wird um 4–5 Zeitmaße gedehnt (Pflicht-Dehnung).",
        example: "السَّمَاءِ — جَاءَ",
      },
      {
        title: "Madd Munfasil (Getrennte Dehnung)",
        description: "Endet ein Wort auf einen Dehnungsbuchstaben und das nächste Wort beginnt mit Hamza, wird um 4–5 Zeitmaße gedehnt (je nach Riwaya optional 2).",
        example: "يَا أَيُّهَا — إِنَّا أَعْطَيْنَاكَ",
      },
      {
        title: "Madd Lazim (Notwendige Dehnung)",
        description: "Folgt auf den Dehnungsbuchstaben ein Sukun (fest, auch in gestoppter Form), wird um 6 Zeitmaße gedehnt – die längste Dehnungsform.",
        example: "الضَّالِّينَ — الْحَاقَّةُ",
      },
      {
        title: "Madd Arid Lissukun (Vorübergehende Dehnung beim Stopp)",
        description: "Beim Stoppen (Waqf) am Versende, wenn davor ein natürlicher Dehnungsbuchstabe steht, kann 2, 4 oder 6 Zeitmaße gedehnt werden.",
        example: "الرَّحِيمِ (bei Waqf am Versende)",
      },
    ],
  },
  {
    id: "ghunna-laam-ra",
    title: "Ghunna, Laam & Ra",
    icon: "ﻎ",
    rules: [
      {
        title: "Ghunna (Nasallaut)",
        description:
          "Ein nasaler Klang von 2 Zeitmaßen, der bei betontem Noon (نّ) und Meem (مّ) mit Shadda entsteht, sowie in abgeschwächter Form bei Idgham, Ikhfa und Iqlab.",
        example: "إِنَّ — ثُمَّ",
      },
      {
        title: "Lam Shamsiyya vs. Lam Qamariyya",
        description:
          "Der bestimmte Artikel „ال“ wird vor „Sonnenbuchstaben“ (ت ث د ذ ر ز س ش ص ض ط ظ ل ن) nicht ausgesprochen, sondern der folgende Buchstabe verdoppelt (Shamsiyya). Vor „Mondbuchstaben“ (den restlichen 14) wird das Lam klar ausgesprochen (Qamariyya).",
        example: "Shamsiyya: الشَّمْسُ — Qamariyya: الْقَمَرُ",
      },
      {
        title: "Tafkhim & Tarqiq beim Ra (ر)",
        description:
          "Das Ra wird „schwer“ (Tafkhim) ausgesprochen bei Fatha/Damma oder Sukun nach Fatha/Damma, und „leicht“ (Tarqiq) bei Kasra. Es gibt Sonderfälle, die man am besten praktisch übt.",
        example: "Schwer: رَبِّ — Leicht: مِرْيَةٍ",
      },
    ],
  },
  {
    id: "waqf",
    title: "Waqf-Zeichen (Stoppzeichen)",
    icon: "۩",
    rules: [
      {
        title: "مـ (Waqf Lazim)",
        description: "Notwendiger Stopp – ein Weiterlesen ohne Pause würde die Bedeutung verfälschen.",
      },
      {
        title: "لا",
        description: "Kein Stopp erlaubt – hier soll nicht angehalten werden, außer am Versende.",
      },
      {
        title: "ج (Waqf Ja'iz)",
        description: "Erlaubter Stopp – Anhalten oder Weiterlesen sind beide zulässig.",
      },
      {
        title: "قلى",
        description: "Weiterlesen ist besser erlaubt, aber Stoppen ist bevorzugt.",
      },
      {
        title: "صلى",
        description: "Stoppen ist erlaubt, aber Weiterlesen ist bevorzugt.",
      },
      {
        title: "∴ ∴ (Mu'anaqah)",
        description: "An einer von zwei nah beieinanderliegenden Stellen sollte gestoppt werden, aber nicht an beiden.",
      },
    ],
  },
];
