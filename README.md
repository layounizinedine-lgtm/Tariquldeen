# طريق الدين — Tariq al-Din

Eine Progressive Web App (PWA) für Muslime, die dabei helfen soll, die fünf
täglichen Gebete einzuhalten, tägliche Adhkar & Duas zu pflegen, die
Tajweed-Regeln des Quran zu lernen und die eigene Woche mithilfe von KI so zu
planen, dass Din (Glaubenspraxis) und Alltag zusammenpassen.

![Logo](assets/icon-512.png)

## Funktionen

### 🕌 Gebetszeiten & Adhan
- Automatische Berechnung der fünf Gebetszeiten (Fajr, Dhuhr, Asr, Maghrib,
  Isha) plus Sonnenaufgang, rein clientseitig über astronomische Formeln
  (Sonnendeklination, Zeitgleichung, Stundenwinkel) — keine externe API nötig.
- Auswahl gängiger Berechnungsmethoden (Muslim World League, ISNA, Ägyptische
  Generalbehörde, Karachi, Umm al-Qura, Teheran, Ja'fari) sowie Hanafi/Standard
  für die Asr-Berechnung.
- Countdown bis zum nächsten Gebet.
- Echter Adhan (Gebetsruf) als Audiodatei (`assets/adhan.mp3`), pro Gebet
  ein-/ausschaltbar, mit Lautstärkeregler und Test-Button. Ist keine
  Audiodatei vorhanden, spielt die App ersatzweise einen sanften Erinnerungston
  (Web Audio API). Die mitgelieferte Datei kann jederzeit durch eine eigene
  Aufnahme ersetzt werden (siehe Lizenzhinweis unten).
- System-Benachrichtigungen (Browser Notifications), sofern erlaubt.

### 📿 Adhkar & Dua
Kuratierte Sammlung an Erinnerungen und Bittgebeten (Arabisch, Transliteration,
deutsche Übersetzung) u. a.:
- Adhkar al-Sabah (Morgen) & Adhkar al-Masaa (Abend)
- Dhikr nach dem Pflichtgebet
- Adhkar vor dem Schlafen
- Alltags-Duas (Essen, Haus betreten/verlassen, Reise, Sorge/Angst,
  Wissenserwerb, Moschee)
- Rabbana-Bittgebete aus dem Quran

Jede Karte hat einen Mitzähl-Button für Wiederholungen.

### 📖 Tajweed
Lernbegleiter mit den wichtigsten Regeln der Quran-Rezitation: Noon Sakinah &
Tanwin (Izhar, Idgham, Iqlab, Ikhfa), Meem Sakinah, Qalqalah, alle Madd-Arten,
Ghunna, Lam Shamsiyya/Qamariyya, Ra (Tafkhim/Tarqiq) sowie Waqf-Zeichen — mit
arabischen Beispielen und deutscher Erklärung.

### 🗓️ KI-Wochenplaner
- Feste Termine eintragen (Wochentag, Uhrzeit, Aktivität).
- Ein Klick auf „Wochenplan erstellen“ sendet die Termine + die berechneten
  Gebetszeiten direkt (browserseitig) an die Anthropic Claude API und erhält
  einen vollständigen, strukturierten Wochenplan inkl. Zeit für Quran, Wissen,
  Adhkar, Familie und Erholung — plus konkrete Tipps zur Einhaltung der Gebete
  und zum Wachstum als Schüler des Wissens.
- **Eigener API-Schlüssel nötig** (siehe unten). Der Schlüssel wird
  ausschließlich lokal im Browser (`localStorage`) gespeichert und **nur**
  direkt an `api.anthropic.com` gesendet — niemals an einen anderen Server.

### ⚙️ Einstellungen
Standort (Geolocation oder manuell), Berechnungsmethode, Madhhab für Asr,
Zeitformat, Adhan pro Gebet, API-Schlüssel & Modellwahl.

## Nutzung

Die App ist eine reine Client-Anwendung ohne Build-Schritt oder Backend.

```bash
# Im Projektordner:
python3 -m http.server 8080
# Dann im Browser öffnen:
# http://localhost:8080/index.html
```

Sie kann auch direkt über GitHub Pages oder einen beliebigen statischen
Webserver gehostet werden. Als installierbare PWA (`manifest.json` +
`sw.js`) lässt sie sich auf dem Smartphone „Zum Startbildschirm hinzufügen“.

### API-Schlüssel für den Wochenplaner einrichten

1. Konto auf [console.anthropic.com](https://console.anthropic.com/) erstellen.
2. Einen API-Schlüssel generieren.
3. In der App unter **Einstellungen → KI-Wochenplaner** einfügen und speichern.

## Projektstruktur

```
index.html              Haupt-App (Single Page, Tab-Navigation)
manifest.json / sw.js    PWA-Manifest & Service Worker (Offline-Caching)
css/styles.css           Gesamtes Styling (dunkles Grün/Gold-Design)
js/
  app.js                 UI-Logik & Verdrahtung aller Bereiche
  prayerTimes.js         Astronomische Berechnung der Gebetszeiten
  adhan.js                Adhan-Wiedergabe & Zeitüberwachung
  planner.js              Anthropic-API-Integration für den Wochenplaner
  storage.js              localStorage-Helfer
data/
  adhkar.js                Adhkar- & Dua-Inhalte
  tajweed.js                Tajweed-Regeln
assets/
  logo.svg, icon-*.png     Logo „طريق الدين“ (arabische Kalligraphie-Optik)
  adhan.mp3                Gebetsruf-Audiodatei (siehe Lizenzhinweis unten)
```

## Lizenzhinweis zur Adhan-Audiodatei

Die mitgelieferte Datei `assets/adhan.mp3` ist „[The Adhan – Muslim Call to
Prayer](https://commons.wikimedia.org/wiki/File:The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3)“
von Aaqib Azeez (Wikimedia-Nutzer Atcovi), lizenziert unter
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), bezogen über
Wikimedia Commons. Bei Weitergabe/Veröffentlichung der App bitte die
Namensnennung beibehalten. Die Datei kann jederzeit durch eine eigene
Aufnahme ersetzt werden — einfach `assets/adhan.mp3` überschreiben.

## Hinweise

- Diese App ist eine Lern- und Erinnerungshilfe, kein Ersatz für das Lernen
  bei qualifizierten Lehrern und Gelehrten — insbesondere für Tajweed
  (Aussprache) und Fiqh-Detailfragen.
- Browser können Timer in Hintergrund-Tabs verlangsamen. Für zuverlässige
  Adhan-Erinnerungen die App geöffnet halten bzw. als PWA installieren.

Möge Allah unsere Schritte auf dem Weg des Wissens und der Gottesfurcht
festigen. آمين
