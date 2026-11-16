# Fortschritt Inhalte (zum Weitermachen)

Werkzeuge:
- `python3 scripts/quellen.py find 10906 "<Name>"` → Biografie im Siyar (turath.io, Buch 10906) finden
- `python3 scripts/quellen.py read 10906 <page_id> <n> <maxzeichen>` → lesen
- `python3 scripts/quellen.py save <id> 10906 <page_id> <n>` → Seiten wörtlich nach `content/quellen/<id>.json`
- Biografie schreiben: `content/bios_*.py` (Helper `content/bio.py`), dann `npm run build:katalog && npm run check:data`
- Regeln: nur Berichte, die adh-Dhahabi als gesichert/sahih/hasan nennt oder als Tatsache berichtet; kein "qila", keine Isra'iliyyat; jeder Satz mit Seite; Zitate wörtlich (Builder prüft das).

## Status
Fertig (Siyar, mit Seiten + wörtlichen Zitaten): abdullah-ibn-ahmad, abdurrahman-ibn-awf, abu-bakr, abu-dawud, abu-dharr, abu-hanifa, abu-hurayra, abu-ubayda, ahmad, ahmad-mihna, aisha, ali, ata, athram, bilal, fatima, hamza, harb-kirmani, hasan-basri, ibn-abbas, ibn-sirin, jafar, khadija, khalid, malik, marrudhi, muadh, musab, sad, said-ibn-musayyib, said-ibn-zayd, salih-ibn-ahmad, salman, shafii, sufyan-thawri, sufyan-uyayna, talha, tawus, umar, umar-ibn-abdulaziz, urwa, uthman, uways, zaynulabidin, zubayr

## Offen
- ishaq-ibn-hani: nicht im Siyar → andere Quelle (Tabaqat al-Hanabila) suchen
- ✅ Prüfdurchgang 1 erledigt (automatischer Harakat-Check `python3 scripts/check-harakat.py`, alle Sätze gelesen, 26 Korrekturen, Browser-Test aller 71 Geschichten ohne Fehler)
- Offen: Prüfung durch fachkundige Person; Wortdaten/Quizze für neue Geschichten; deutsche Übersetzung der Hadith-Zitate aus hadith-api
- ✅ Bilder: alle 70 (+ Yusuf) erzeugt und gesichtet, ohne Menschen
- ✅ Hadith-Übersetzungen (content/hadith-de.json, Entwurf)
- ✅ Prüfablauf: #/pruefen + content/pruefung.json (noch keine Freigaben – nur durch Menschen)

## Sprachstufen A1–C2 (Stand)
- Format: `content/stufen_*.py` (je Geschichte alle Stufen, jeder Satz mit Vers-Beleg) → `content/stufen.json` → `npm run build:katalog`.
- ✅ fertig: nuh, adam, musa, ibrahim, isa, muhammad (A1, A2, B1, B2, C1, C2 + klassisch)
- Ausführen in Reihenfolge: `python3 content/stufen_1.py && python3 content/stufen_2.py …` (stufen_1 legt stufen.json neu an, die weiteren ergänzen)
- Offen: Yusuf (eigene Datei yusuf.ts; braucht Ausbau der ganzen Sure 12), alle weiteren Propheten (B1 existiert, A1/A2/B2/C1/C2 fehlen), danach Sahaba/Tabi'in/Imame (Siyar).
- Regeln: gleicher Inhalt wie B1, keine neuen Fakten, keine wörtlichen Quran-Zitate in eigenen Sätzen; Stufen unterscheiden sich in Satzlänge, Wortschatz und Grammatik.
## Stimme
- Chatterbox-Standardstimme + Nachbearbeitung klang zu künstlich. Natürlichere Stimme braucht eine Referenzaufnahme mit ausdrücklicher Zustimmung des Sprechers (siehe README, Abschnitt Erzählerstimme).

## Stand: Yusuf vollständig (Sure 12 in 11 Kapiteln)
- Yusuf ist jetzt Katalogeintrag (klassisch 12:4–111 aus Quran.com) + B1/A1/A2/B2/C1/C2 in `content/yusuf_a.py`/`yusuf_b.py` (Kapitelmarker `("#", Titel)`), erzeugt über `content/stufen_3.py` (Reihenfolge: stufen_1, stufen_2, stufen_3; `stufen_lib.py` = Writer).
- Alte `src/data/yusuf.ts` wird nur noch vom Admin-Import-Beispiel genutzt.
- Offen: Stufen für 18 weitere Propheten, Sahaba/Tabi'in/Imame-Stufen, Stimme (C_langsam) + Audio-Workflow.

## Stand: alle 24 Propheten mit A1–C2
- `content/stufen_1..7.py` + `yusuf_a/b.py` (Reihenfolge: 1,2,3,4,5,6,7; Writer `stufen_lib.py`). Alle Belege geprüft mit `npm run check:data`.
- Kurze Quran-Figuren (Idris, Dhul-Kifl, al-Yasa, Harun, Ilyas) haben bewusst wenig Text: der Quran sagt dort nicht mehr; Verlängerung nur mit belegtem Tafsir/Hadith.
- Audio: Workflow `audio.yml` (C_langsam) für yusuf,nuh,musa,ibrahim,hud,salih gestartet; weitere Geschichten nachziehen (`geschichten: alle`).
- OFFEN: Stufen A1–C2 für Sahaba/Tabi'in/Imame/Ahmad-Kreis (45 Biografien nur B1, je ~9 Sätze; Belege = Siyar-Seiten, `stufen_lib.py` muss dafür ein Nicht-Quran-Beleg-Format bekommen); längere Kapitel aus weiteren Siyar-Seiten; ishaq-ibn-hani (andere Quelle); Wortpopups/Quiz für neue Geschichten.

## Stand: Biografien mit A1–C2
- `content/stufen_8..12.py`: A1/A2/B2/C1/C2 für alle 45 Biografien (abu-bakr mit 4 Kapiteln). Beleg-Format `B:n,m-k` = Sätze der Biografie (Builder löst es zu Siyar-Seiten auf; `check-data` prüft die Indizes).
- Reihenfolge zum Neuerzeugen: stufen_1 … stufen_12 (stufen_1 zuerst, schreibt neu).
- OFFEN: längere Kapitel aus weiteren Siyar-Seiten (die Niveaus spiegeln bisher nur die 5–10 belegten B1-Sätze), `ishaq-ibn-hani` (andere Quelle), Audio für alle Geschichten, Wortpopups/Quiz.

## Wortanalyse beim Antippen (maschinell, Entwurf)
- `tools/woerter/bauen.py` (CAMeL Tools: Morphologie + BERT-Disambiguierung, MT en→de, Regeln für Idafa/Kasus/Präposition) schreibt `content/woerter/<id>.json`; `scripts/build-katalog.mjs` hängt es an die Sätze.
- Handkorrekturen: `content/woerter-de.json` (Bedeutung/Wortart je Grundform), `content/woerter-wurzeln.json` (Wurzeln schwacher Verben).
- Neu erzeugen: venv mit `camel-tools` (+ `camel_data -i morphology-db-msa-r13 disambig-bert-unfactored-all`), torch, transformers; `CAMELTOOLS_DATA` setzen; `python tools/woerter/bauen.py`; danach `node scripts/build-katalog.mjs`.
- Quiz-Tab ist ausgeblendet (Code bleibt). Quran-/Athar-Zitate haben noch keine Wortanalyse.

## Ahadith (Stand)
- 36 weitere Hadithe (Bukhari/Muslim/Tirmidhi) in `content/katalog.json` (`hadith`), deutsche Entwurfsübersetzung in `content/hadith-de.json`; Bukhari/Muslim ohne API-Einstufung erhalten den Vermerk „Sammlung gilt als authentisch (keine Einzelprüfung)“.
- `content/stufen_13.py` hängt zu jedem dieser Hadithe Zusammenfassungen in eigenen Worten an A1–C2 an (Beleg-Format `H:<zitat-id>`); Reihenfolge der Stufen-Skripte: 1…12, dann 13.
- Offen: weitere Hadithe zu Hamza, Salman, Uways, Abdurrahman ibn Awf, Nuh, Musa u. a. (Quelle suchen, Übersetzung prüfen).
