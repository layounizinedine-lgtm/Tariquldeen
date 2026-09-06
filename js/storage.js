// storage.js
// Kleiner Wrapper um localStorage. Alle Daten (inkl. API-Schlüssel) bleiben
// ausschließlich lokal im Browser des Nutzers gespeichert.

const PREFIX = "tariqul-deen:";

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("storage.loadJSON failed for", key, e);
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn("storage.saveJSON failed for", key, e);
  }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key);
}

export const DEFAULT_SETTINGS = {
  lat: null,
  lon: null,
  cityName: "",
  tzOffset: -new Date().getTimezoneOffset() / 60,
  method: "MWL",
  asrFactor: "STANDARD",
  is24h: true,
  adhanEnabled: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
  adhanVolume: 0.8,
  apiKey: "",
  apiModel: "claude-sonnet-4-5",
};

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...loadJSON("settings", {}) };
}

export function saveSettings(settings) {
  saveJSON("settings", settings);
}

export function getScheduleEntries() {
  return loadJSON("schedule-entries", []);
}

export function saveScheduleEntries(entries) {
  saveJSON("schedule-entries", entries);
}

export function getWeeklyPlan() {
  return loadJSON("weekly-plan", null);
}

export function saveWeeklyPlan(plan) {
  saveJSON("weekly-plan", plan);
}

export function getDhikrCounters() {
  return loadJSON("dhikr-counters", {});
}

export function saveDhikrCounters(counters) {
  saveJSON("dhikr-counters", counters);
}
