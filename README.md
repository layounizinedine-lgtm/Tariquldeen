# طريق الدين – Tariq al-Din

Mobile-first PWA zum Arabischlernen anhand echter islamischer Geschichten (Propheten, Sahaba, Tabi'in, Imam Ahmad).
Arabisch mit Harakat, deutsche Übersetzung, Wort-Popup, Audio mit Mitlesen, Vokabeln (Wiederholungssystem) und Quizze.

**Inhalte sind Entwürfe**, bis eine fachkundige Person sie auf „geprüft“ setzt. Nichts wird erfunden: Quran-Verse kommen aus der
Quran.com-API (`npm run fetch:quran`), jede Geschichte hat ein Quellenfeld, Platzhalter sind markiert.

## Entwickeln
```
npm install
npm run dev          # lokal
npm run build        # Produktion
npm run check:data   # Wortdaten passen zu den Sätzen?
```
Entwürfe sieht man im Dev-Modus oder mit `?entwurf=1` in der Adresse.

## Supabase & Admin
Siehe `supabase/README.md`. Admin-Ansicht: `#/admin` an die Adresse hängen.

## Audio
Siehe `tools/tts/README.md` (läuft auf einem Rechner mit GPU).

## Veröffentlichung
GitHub Pages über `.github/workflows/pages.yml` (Repo → Settings → Pages → Source: *GitHub Actions*).
Optional unter Settings → Secrets and variables → Actions → *Variables*: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## Geschichten-Katalog
`content/katalog.json` listet alle Geschichten (25 Propheten, die zehn mit Paradies-Zusage, weitere Sahaba, Tabi'in, Imam Ahmad & Schüler).
`npm run build:katalog` lädt dazu Quran-Verse (Quran.com-API) und Hadith (hadith-api) und schreibt `src/data/geschichten/*.json`.
Alles ist `entwurf`. Ohne Quellentext bleibt ein „Gerüst“ mit Platzhaltern – nichts wird erfunden.

## Prüfen & Freigeben (ohne Supabase)
1. Fachkundige Person öffnet die App mit `#/pruefen`, hakt je Geschichte alle Punkte ab und wählt die geprüften Fassungen.
2. „Eintrag kopieren“ → in `content/pruefung.json` unter `"freigaben"` einfügen (Link „Auf GitHub einfügen“).
3. Nach dem Speichern baut GitHub die Seite neu; die Geschichte ist dann ohne `?entwurf=1` sichtbar und trägt „✓ Geprüft von … am …“.
Freigaben macht nur ein Mensch – nie die KI.

## Bilder
`public/bilder/<id>.webp` (Aquarell, ohne Menschen/Gesichter). Fehlt ein Bild, zeigt die App eine einfache Grafik.
