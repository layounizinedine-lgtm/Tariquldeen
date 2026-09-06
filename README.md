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
- Gebetsruf (Adhan) pro Gebet ein-/ausschaltbar, mit Lautstärkeregler und
  Test-Button. Ohne eigene Audiodatei wird ein sanfter Erinnerungston
  abgespielt (Web Audio API). Für den authentischen Gebetsruf einfach eine
  eigene Datei unter `assets/adhan.mp3` ablegen.
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
```

## Hinweise

- Diese App ist eine Lern- und Erinnerungshilfe, kein Ersatz für das Lernen
  bei qualifizierten Lehrern und Gelehrten — insbesondere für Tajweed
  (Aussprache) und Fiqh-Detailfragen.
- Browser können Timer in Hintergrund-Tabs verlangsamen. Für zuverlässige
  Adhan-Erinnerungen die App geöffnet halten bzw. als PWA installieren.

Möge Allah unsere Schritte auf dem Weg des Wissens und der Gottesfurcht
festigen. آمين
