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
- ✅ fertig: nuh, adam, musa (A1, A2, B1, B2, C1, C2 + klassisch)
- Offen: alle weiteren Propheten (B1 existiert, A1/A2/B2/C1/C2 fehlen), danach Sahaba/Tabi'in/Imame (Siyar).
- Regeln: gleicher Inhalt wie B1, keine neuen Fakten, keine wörtlichen Quran-Zitate in eigenen Sätzen; Stufen unterscheiden sich in Satzlänge, Wortschatz und Grammatik.
## Stimme
- Chatterbox-Standardstimme + Nachbearbeitung klang zu künstlich. Natürlichere Stimme braucht eine Referenzaufnahme mit ausdrücklicher Zustimmung des Sprechers (siehe README, Abschnitt Erzählerstimme).
