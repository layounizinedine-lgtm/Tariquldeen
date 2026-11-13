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
