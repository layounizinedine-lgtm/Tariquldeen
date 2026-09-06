// app.js — Haupt-Logik der Tariq al-Din App
import {
  calculatePrayerTimes,
  formatTime,
  CALCULATION_METHODS,
  PRAYER_LABELS,
  PRAYER_ARABIC,
} from "./prayerTimes.js";
import { startAdhanWatcher, playAdhan, requestNotificationPermission } from "./adhan.js";
import { generateWeeklyPlan, buildUserPrompt, renderMarkdown } from "./planner.js";
import {
  getSettings,
  saveSettings,
  getScheduleEntries,
  saveScheduleEntries,
  getWeeklyPlan,
  saveWeeklyPlan,
  getDhikrCounters,
  saveDhikrCounters,
} from "./storage.js";
import { ADHKAR_CATEGORIES, ADHKAR } from "../data/adhkar.js";
import { TAJWEED_CATEGORIES } from "../data/tajweed.js";

let settings = getSettings();
let currentTimesDecimal = null;

// ---------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

// ---------------------------------------------------------------------
// Gebetszeiten
// ---------------------------------------------------------------------
function updateLocationInfo() {
  const el = document.getElementById("location-info");
  if (settings.lat != null && settings.lon != null) {
    const name = settings.cityName ? settings.cityName + " — " : "";
    el.textContent = `${name}${settings.lat.toFixed(3)}, ${settings.lon.toFixed(3)} (UTC${settings.tzOffset >= 0 ? "+" : ""}${settings.tzOffset})`;
  } else {
    el.textContent = "Kein Standort gesetzt — bitte Standort verwenden oder in den Einstellungen eintragen.";
  }
}

function useGeolocation() {
  if (!("geolocation" in navigator)) {
    alert("Geolocation wird von diesem Browser nicht unterstützt.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      settings.lat = pos.coords.latitude;
      settings.lon = pos.coords.longitude;
      settings.tzOffset = -new Date().getTimezoneOffset() / 60;
      saveSettings(settings);
      updateLocationInfo();
      refreshPrayerTimes();
      populateSettingsForm();
    },
    (err) => {
      alert("Standort konnte nicht ermittelt werden: " + err.message);
    }
  );
}

function refreshPrayerTimes() {
  const dateEl = document.getElementById("today-date");
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const listEl = document.getElementById("prayer-list");
  listEl.innerHTML = "";

  if (settings.lat == null || settings.lon == null) {
    listEl.innerHTML = '<p class="muted">Bitte zuerst einen Standort festlegen.</p>';
    document.getElementById("next-prayer-name").textContent = "—";
    document.getElementById("next-prayer-countdown").textContent = "Standort fehlt";
    currentTimesDecimal = null;
    return;
  }

  const times = calculatePrayerTimes(now, settings.lat, settings.lon, settings.tzOffset, {
    method: settings.method,
    asrFactor: settings.asrFactor,
  });
  currentTimesDecimal = times;

  const order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  order.forEach((key) => {
    const row = document.createElement("div");
    row.className = "prayer-row";
    const is24h = settings.is24h;
    const timeStr = formatTime(times[key], is24h);

    let toggleHtml = "";
    if (key !== "sunrise") {
      const checked = settings.adhanEnabled?.[key] ? "checked" : "";
      toggleHtml = `
        <label class="switch">
          <input type="checkbox" data-prayer="${key}" class="adhan-toggle" ${checked}>
          <span class="slider"></span>
        </label>`;
    }

    row.innerHTML = `
      <div class="prayer-name">
        <span class="prayer-arabic">${PRAYER_ARABIC[key]}</span>
        <span>${PRAYER_LABELS[key]}</span>
      </div>
      <div class="prayer-time">${timeStr}</div>
      <div class="prayer-toggle">${toggleHtml}</div>
    `;
    listEl.appendChild(row);
  });

  listEl.querySelectorAll(".adhan-toggle").forEach((el) => {
    el.addEventListener("change", () => {
      settings.adhanEnabled = settings.adhanEnabled || {};
      settings.adhanEnabled[el.dataset.prayer] = el.checked;
      saveSettings(settings);
    });
  });

  updateNextPrayer();
}

function updateNextPrayer() {
  if (!currentTimesDecimal) return;
  const now = new Date();
  const nowDecimal = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const order = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

  let next = null;
  for (const key of order) {
    if (currentTimesDecimal[key] > nowDecimal) {
      next = key;
      break;
    }
  }

  const nameEl = document.getElementById("next-prayer-name");
  const countdownEl = document.getElementById("next-prayer-countdown");

  let targetDecimal;
  if (next) {
    nameEl.innerHTML = `${PRAYER_ARABIC[next]} <span class="latin">${PRAYER_LABELS[next]}</span>`;
    targetDecimal = currentTimesDecimal[next];
  } else {
    // Nach Isha: Fajr des nächsten Tages (grobe Näherung, gleicher Wert)
    nameEl.innerHTML = `${PRAYER_ARABIC.fajr} <span class="latin">${PRAYER_LABELS.fajr} (morgen)</span>`;
    targetDecimal = currentTimesDecimal.fajr + 24;
  }

  let diff = targetDecimal - nowDecimal;
  if (diff < 0) diff += 24;
  const h = Math.floor(diff);
  const m = Math.floor((diff - h) * 60);
  const s = Math.floor(((diff - h) * 60 - m) * 60);
  countdownEl.textContent = `in ${h}h ${m}m ${s}s`;
}

// ---------------------------------------------------------------------
// Adhkar
// ---------------------------------------------------------------------
let currentAdhkarCategory = ADHKAR_CATEGORIES[0].id;
let dhikrCounters = getDhikrCounters();

function renderAdhkarCategories() {
  const el = document.getElementById("adhkar-categories");
  el.innerHTML = "";
  ADHKAR_CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat.id === currentAdhkarCategory ? " active" : "");
    btn.type = "button";
    btn.innerHTML = `${cat.icon} ${cat.title}`;
    btn.addEventListener("click", () => {
      currentAdhkarCategory = cat.id;
      renderAdhkarCategories();
      renderAdhkarList();
    });
    el.appendChild(btn);
  });
}

function renderAdhkarList() {
  const el = document.getElementById("adhkar-list");
  el.innerHTML = "";
  const items = ADHKAR[currentAdhkarCategory] || [];
  items.forEach((item, idx) => {
    const counterKey = `${currentAdhkarCategory}-${idx}`;
    const currentCount = dhikrCounters[counterKey] || 0;
    const card = document.createElement("div");
    card.className = "card dhikr-card";
    card.innerHTML = `
      <div class="dhikr-header">
        <h4>${item.title}</h4>
        ${item.count > 1 ? `<span class="badge">${item.count}×</span>` : ""}
      </div>
      <p class="arabic-text">${item.arabic}</p>
      <p class="translit">${item.translit}</p>
      <p class="translation">${item.translation}</p>
      ${item.note ? `<p class="muted small note">💡 ${item.note}</p>` : ""}
      <div class="dhikr-counter-row">
        <button class="btn-secondary counter-btn" type="button">🔁 Gezählt: <span class="counter-value">${currentCount}</span></button>
        <button class="btn-ghost reset-btn" type="button">Zurücksetzen</button>
      </div>
    `;
    card.querySelector(".counter-btn").addEventListener("click", () => {
      dhikrCounters[counterKey] = (dhikrCounters[counterKey] || 0) + 1;
      saveDhikrCounters(dhikrCounters);
      card.querySelector(".counter-value").textContent = dhikrCounters[counterKey];
    });
    card.querySelector(".reset-btn").addEventListener("click", () => {
      dhikrCounters[counterKey] = 0;
      saveDhikrCounters(dhikrCounters);
      card.querySelector(".counter-value").textContent = 0;
    });
    el.appendChild(card);
  });
}

// ---------------------------------------------------------------------
// Tajweed
// ---------------------------------------------------------------------
let currentTajweedCategory = TAJWEED_CATEGORIES[0].id;

function renderTajweedCategories() {
  const el = document.getElementById("tajweed-categories");
  el.innerHTML = "";
  TAJWEED_CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat.id === currentTajweedCategory ? " active" : "");
    btn.type = "button";
    btn.innerHTML = `${cat.icon} ${cat.title}`;
    btn.addEventListener("click", () => {
      currentTajweedCategory = cat.id;
      renderTajweedCategories();
      renderTajweedList();
    });
    el.appendChild(btn);
  });
}

function renderTajweedList() {
  const el = document.getElementById("tajweed-list");
  el.innerHTML = "";
  const category = TAJWEED_CATEGORIES.find((c) => c.id === currentTajweedCategory);
  (category?.rules || []).forEach((rule) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${rule.title}</h4>
      <p>${rule.description}</p>
      ${rule.example ? `<p class="arabic-text example">${rule.example}</p>` : ""}
    `;
    el.appendChild(card);
  });
}

// ---------------------------------------------------------------------
// Wochenplaner
// ---------------------------------------------------------------------
const DAY_ORDER = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

function renderScheduleEntries() {
  const entries = getScheduleEntries();
  const el = document.getElementById("schedule-entries");
  el.innerHTML = "";
  const sorted = [...entries].sort((a, b) => {
    const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.time.localeCompare(b.time);
  });
  sorted.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "entry-item";
    li.innerHTML = `
      <span><strong>${entry.day}</strong> ${entry.time} Uhr — ${entry.activity}</span>
      <button class="btn-ghost delete-entry-btn" type="button" aria-label="Löschen">✕</button>
    `;
    li.querySelector(".delete-entry-btn").addEventListener("click", () => {
      const all = getScheduleEntries().filter((e) => e.id !== entry.id);
      saveScheduleEntries(all);
      renderScheduleEntries();
    });
    el.appendChild(li);
  });
  if (sorted.length === 0) {
    el.innerHTML = '<li class="muted small">Noch keine Termine hinzugefügt.</li>';
  }
}

function initPlannerForm() {
  const form = document.getElementById("schedule-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const day = document.getElementById("entry-day").value;
    const time = document.getElementById("entry-time").value;
    const activity = document.getElementById("entry-activity").value.trim();
    if (!day || !time || !activity) return;
    const entries = getScheduleEntries();
    entries.push({ id: crypto.randomUUID(), day, time, activity });
    saveScheduleEntries(entries);
    document.getElementById("entry-activity").value = "";
    renderScheduleEntries();
  });

  document.getElementById("generate-plan-btn").addEventListener("click", onGeneratePlan);
  document.getElementById("clear-plan-btn").addEventListener("click", () => {
    saveWeeklyPlan(null);
    renderStoredPlan();
  });
}

async function onGeneratePlan() {
  const statusEl = document.getElementById("plan-status");
  const btn = document.getElementById("generate-plan-btn");
  const entries = getScheduleEntries();

  if (!settings.apiKey) {
    statusEl.textContent = "⚠️ Bitte zuerst einen API-Schlüssel in den Einstellungen hinterlegen.";
    return;
  }
  if (!currentTimesDecimal) {
    statusEl.textContent = "⚠️ Bitte zuerst einen Standort festlegen (Tab Gebetszeiten oder Einstellungen).";
    return;
  }

  const extraWishes = document.getElementById("extra-wishes").value;
  const userPrompt = buildUserPrompt(entries, currentTimesDecimal, settings.is24h, extraWishes);

  btn.disabled = true;
  statusEl.textContent = "⏳ Dein Wochenplan wird erstellt… Dies kann bis zu einer Minute dauern.";

  try {
    const markdown = await generateWeeklyPlan(settings.apiKey, settings.apiModel, userPrompt);
    saveWeeklyPlan({ markdown, createdAt: new Date().toISOString() });
    statusEl.textContent = "✅ Plan erfolgreich erstellt.";
    renderStoredPlan();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ " + err.message;
  } finally {
    btn.disabled = false;
  }
}

function renderStoredPlan() {
  const plan = getWeeklyPlan();
  const card = document.getElementById("plan-result-card");
  const resultEl = document.getElementById("plan-result");
  if (!plan) {
    card.hidden = true;
    resultEl.innerHTML = "";
    return;
  }
  card.hidden = false;
  resultEl.innerHTML = renderMarkdown(plan.markdown);
}

// ---------------------------------------------------------------------
// Einstellungen
// ---------------------------------------------------------------------
function populateMethodOptions() {
  const select = document.getElementById("setting-method");
  select.innerHTML = "";
  Object.entries(CALCULATION_METHODS).forEach(([key, val]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = val.name;
    select.appendChild(opt);
  });
}

function renderAdhanToggles() {
  const el = document.getElementById("setting-adhan-toggles");
  el.innerHTML = "";
  const keys = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  keys.forEach((key) => {
    const checked = settings.adhanEnabled?.[key] ? "checked" : "";
    const row = document.createElement("label");
    row.className = "toggle-row";
    row.innerHTML = `
      <span>${PRAYER_ARABIC[key]} ${PRAYER_LABELS[key]}</span>
      <label class="switch">
        <input type="checkbox" data-prayer="${key}" class="adhan-toggle-setting" ${checked}>
        <span class="slider"></span>
      </label>
    `;
    el.appendChild(row);
  });
  el.querySelectorAll(".adhan-toggle-setting").forEach((input) => {
    input.addEventListener("change", () => {
      settings.adhanEnabled = settings.adhanEnabled || {};
      settings.adhanEnabled[input.dataset.prayer] = input.checked;
      saveSettings(settings);
      refreshPrayerTimes();
    });
  });
}

function populateSettingsForm() {
  document.getElementById("setting-city").value = settings.cityName || "";
  document.getElementById("setting-lat").value = settings.lat ?? "";
  document.getElementById("setting-lon").value = settings.lon ?? "";
  document.getElementById("setting-tz").value = settings.tzOffset ?? "";
  document.getElementById("setting-method").value = settings.method;
  document.getElementById("setting-asr").value = settings.asrFactor;
  document.getElementById("setting-timeformat").value = settings.is24h ? "24" : "12";
  document.getElementById("setting-api-key").value = settings.apiKey || "";
  document.getElementById("setting-api-model").value = settings.apiModel || "claude-sonnet-4-5";
  renderAdhanToggles();
}

function initSettingsForm() {
  populateMethodOptions();
  populateSettingsForm();

  document.getElementById("save-settings-btn").addEventListener("click", () => {
    settings.cityName = document.getElementById("setting-city").value.trim();
    const lat = parseFloat(document.getElementById("setting-lat").value);
    const lon = parseFloat(document.getElementById("setting-lon").value);
    settings.lat = Number.isFinite(lat) ? lat : null;
    settings.lon = Number.isFinite(lon) ? lon : null;
    const tz = parseFloat(document.getElementById("setting-tz").value);
    settings.tzOffset = Number.isFinite(tz) ? tz : settings.tzOffset;
    settings.method = document.getElementById("setting-method").value;
    settings.asrFactor = document.getElementById("setting-asr").value;
    settings.is24h = document.getElementById("setting-timeformat").value === "24";
    settings.apiKey = document.getElementById("setting-api-key").value.trim();
    settings.apiModel = document.getElementById("setting-api-model").value;

    saveSettings(settings);
    document.getElementById("settings-status").textContent = "✅ Einstellungen gespeichert.";
    setTimeout(() => (document.getElementById("settings-status").textContent = ""), 3000);

    updateLocationInfo();
    refreshPrayerTimes();
  });
}

// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------
function init() {
  initTabs();

  document.getElementById("use-geolocation-btn").addEventListener("click", useGeolocation);
  document.getElementById("use-geolocation-btn-2").addEventListener("click", useGeolocation);

  document.getElementById("adhan-volume").value = settings.adhanVolume ?? 0.8;
  document.getElementById("adhan-volume").addEventListener("input", (e) => {
    settings.adhanVolume = parseFloat(e.target.value);
    saveSettings(settings);
  });
  document.getElementById("test-adhan-btn").addEventListener("click", () => {
    playAdhan(settings.adhanVolume ?? 0.8);
  });

  updateLocationInfo();
  refreshPrayerTimes();
  setInterval(refreshPrayerTimes, 60 * 1000); // Zeiten/Tagwechsel neu berechnen
  setInterval(updateNextPrayer, 1000); // Countdown live

  renderAdhkarCategories();
  renderAdhkarList();

  renderTajweedCategories();
  renderTajweedList();

  initPlannerForm();
  renderScheduleEntries();
  renderStoredPlan();

  initSettingsForm();

  requestNotificationPermission();
  startAdhanWatcher(
    () => currentTimesDecimal || {},
    () => settings,
    (key) => console.log("Adhan ausgelöst für:", key)
  );

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW-Registrierung fehlgeschlagen:", e));
  }
}

document.addEventListener("DOMContentLoaded", init);
