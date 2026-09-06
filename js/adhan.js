// adhan.js
// Überwacht die Gebetszeiten und löst zur jeweiligen Zeit den Gebetsruf aus.
// Hinweis: Browser können Timer in Hintergrund-Tabs verlangsamen. Für die
// zuverlässigste Erfahrung die App als PWA installieren und den Tab/die
// App-Instanz geöffnet lassen. Zusätzlich wird (falls erlaubt) eine
// System-Benachrichtigung gesendet.

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Einfache, freundliche Ton-Sequenz als Fallback, falls assets/adhan.mp3
// aus irgendeinem Grund nicht geladen werden kann.
function playToneFallback(volume = 0.8) {
  const ctx = getAudioContext();
  const notes = [523.25, 587.33, 659.25, 587.33, 523.25]; // C5 D5 E5 D5 C5
  const noteDuration = 0.45;
  let t = ctx.currentTime;

  notes.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume * 0.3, t + 0.05);
    gain.gain.linearRampToValueAtTime(0, t + noteDuration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + noteDuration + 0.05);
    t += noteDuration;
  });
}

let customAudioEl = null;
let customAudioChecked = false;
let customAudioAvailable = false;

async function checkCustomAudio() {
  if (customAudioChecked) return customAudioAvailable;
  customAudioChecked = true;
  try {
    const res = await fetch("assets/adhan.mp3", { method: "HEAD" });
    customAudioAvailable = res.ok;
  } catch (e) {
    customAudioAvailable = false;
  }
  return customAudioAvailable;
}

export async function playAdhan(volume = 0.8) {
  const hasCustom = await checkCustomAudio();
  if (hasCustom) {
    try {
      if (!customAudioEl) {
        customAudioEl = new Audio("assets/adhan.mp3");
      }
      customAudioEl.volume = volume;
      customAudioEl.currentTime = 0;
      await customAudioEl.play();
      return;
    } catch (e) {
      console.warn("Konnte assets/adhan.mp3 nicht abspielen, nutze Ton-Fallback.", e);
    }
  }
  playToneFallback(volume);
}

export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function notify(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body, icon: "assets/icon-192.png" });
    } catch (e) {
      /* ignore */
    }
  }
}

/**
 * Startet einen Prüf-Intervall, der jede Sekunde die aktuelle Zeit mit den
 * Gebetszeiten vergleicht und bei Erreichen (auf die Minute genau) den
 * Adhan auslöst — höchstens einmal pro Gebet und Tag.
 *
 * @param {() => Record<string, number>} getTimesDecimal - liefert heutige Zeiten in Dezimalstunden
 * @param {() => object} getSettings - liefert aktuelle Einstellungen (adhanEnabled, adhanVolume)
 * @param {(prayerKey: string) => void} onTrigger - Callback beim Auslösen
 */
export function startAdhanWatcher(getTimesDecimal, getSettings, onTrigger) {
  const triggeredToday = {};
  let lastDay = new Date().toDateString();

  const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  const PRAYER_NAMES_DE = {
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
  };

  const interval = setInterval(() => {
    const now = new Date();
    const today = now.toDateString();
    if (today !== lastDay) {
      lastDay = today;
      Object.keys(triggeredToday).forEach((k) => delete triggeredToday[k]);
    }

    const nowDecimal = now.getHours() + now.getMinutes() / 60;
    const times = getTimesDecimal();
    const settings = getSettings();

    PRAYER_KEYS.forEach((key) => {
      if (!settings.adhanEnabled?.[key]) return;
      const target = times[key];
      if (target === undefined) return;
      const diffMinutes = Math.abs((nowDecimal - target) * 60);
      const key_today = `${key}-${today}`;
      if (diffMinutes < 0.5 && !triggeredToday[key_today]) {
        triggeredToday[key_today] = true;
        playAdhan(settings.adhanVolume ?? 0.8);
        notify(
          "🕌 Gebetszeit: " + PRAYER_NAMES_DE[key],
          "Es ist Zeit für das " + PRAYER_NAMES_DE[key] + "-Gebet."
        );
        onTrigger?.(key);
      }
    });
  }, 1000);

  return () => clearInterval(interval);
}
