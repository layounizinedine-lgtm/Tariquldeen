// planner.js
// KI-gestützter Wochenplaner. Nutzt die Anthropic Claude API direkt aus dem
// Browser (mit dem vom Nutzer bereitgestellten, lokal gespeicherten
// API-Schlüssel). Es werden nur die Angaben gesendet, die für die
// Planerstellung nötig sind (Termine + Gebetszeiten) – niemals der Schlüssel
// an einen anderen Server als api.anthropic.com.

const API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `Du bist ein weiser, warmherziger islamischer Lebens- und Lerncoach, der Muslimen hilft,
ihre Woche so zu planen, dass die fünf täglichen Pflichtgebete (Fajr, Dhuhr, Asr, Maghrib, Isha) und ihr
spiritueller Fortschritt im Zentrum stehen. Du hilfst dem Nutzer, seine beste Version zu werden und ein
ernsthafter, disziplinierter Schüler des islamischen Wissens (Talib al-'Ilm) zu sein.

Aufgabe: Erstelle auf Basis der vom Nutzer angegebenen festen Termine (Schule, Arbeit, Uni, Sport etc.) und
seiner täglichen Gebetszeiten einen realistischen, motivierenden Wochenplan (Montag bis Sonntag).

Der Plan soll für jeden Tag enthalten:
- Die festen Termine des Nutzers (unverändert übernehmen)
- Die fünf Gebetszeiten, klar eingeplant, mit ein wenig Pufferzeit davor/danach falls möglich
- Sinnvolle, realistische Blöcke für: Quran-Rezitation/Tajweed-Übung, Lernen von Wissen (Fiqh, Aqidah, Sira, Hadith – je nach Level), Adhkar (morgens/abends), Bewegung/Gesundheit, Zeit für Familie/Gemeinschaft, ausreichend Schlaf
- Diese Blöcke dürfen sich NICHT mit den festen Terminen oder Gebetszeiten überschneiden

Gib danach zusätzlich:
1. Konkrete, praktische Tipps, wie der Nutzer die Gebete pünktlich einhalten kann (z. B. Wecker, Umgebung, Vorbereitung)
2. Ratschläge zur Stärkung der Willenskraft, Disziplin und Aufrichtigkeit (Ikhlas)
3. Empfehlungen für einen strukturierten Weg des Wissenserwerbs (z. B. mit welchen Grundlagenbüchern/Themen man beginnen könnte, allgemein gehalten, ohne einen bestimmten Gelehrten oder eine bestimmte Gruppierung vorzuschreiben)
4. Eine kurze, ermutigende Erinnerung (Nasiha) zum Abschluss

Antworte ausschließlich auf Deutsch, in klar strukturiertem Markdown mit Überschriften pro Wochentag
(## Montag, ## Dienstag, ...), Aufzählungspunkten für die Tagesblöcke, und eigenen Abschnitten für die
Tipps am Ende. Sei präzise, respektvoll, konfessionell neutral innerhalb des sunnitischen Mainstream-Verständnisses,
und vermeide strittige Detailfragen des Fiqh — verweise bei Detailfragen auf lokale Gelehrte.`;

function formatPrayerTimesForPrompt(times, is24h) {
  const order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  const labels = {
    fajr: "Fajr",
    sunrise: "Sonnenaufgang",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
  };
  return order
    .map((k) => `${labels[k]}: ${formatDecimal(times[k], is24h)}`)
    .join(", ");
}

function formatDecimal(decimalHour, is24h) {
  const totalMinutes = Math.round(decimalHour * 60);
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function buildUserPrompt(entries, prayerTimes, is24h, extraWishes) {
  const grouped = {};
  entries.forEach((e) => {
    grouped[e.day] = grouped[e.day] || [];
    grouped[e.day].push(`${e.time} Uhr – ${e.activity}`);
  });

  const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  const scheduleText = days
    .map((d) => {
      const items = grouped[d];
      return `${d}: ${items && items.length ? items.join("; ") : "keine festen Termine angegeben"}`;
    })
    .join("\n");

  let prompt = `Hier sind meine festen wöchentlichen Termine:\n${scheduleText}\n\n`;
  prompt += `Meine ungefähren täglichen Gebetszeiten (können je nach Jahreszeit leicht variieren): ${formatPrayerTimesForPrompt(prayerTimes, is24h)}\n\n`;
  if (extraWishes && extraWishes.trim()) {
    prompt += `Zusätzliche Wünsche / Kontext von mir: ${extraWishes.trim()}\n\n`;
  }
  prompt += `Bitte erstelle mir jetzt meinen vollständigen Wochenplan wie beschrieben.`;
  return prompt;
}

/**
 * Ruft die Anthropic Claude API direkt aus dem Browser auf.
 * @param {string} apiKey
 * @param {string} model
 * @param {string} userPrompt
 * @returns {Promise<string>} Antworttext (Markdown)
 */
export async function generateWeeklyPlan(apiKey, model, userPrompt) {
  if (!apiKey) {
    throw new Error("Kein API-Schlüssel hinterlegt. Bitte in den Einstellungen eintragen.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: model || "claude-sonnet-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    let detail = "";
    try {
      const errJson = await response.json();
      detail = errJson?.error?.message || JSON.stringify(errJson);
    } catch (e) {
      detail = await response.text();
    }
    if (response.status === 401) {
      throw new Error("API-Schlüssel ungültig oder abgelaufen. Bitte in den Einstellungen prüfen.");
    }
    if (response.status === 429) {
      throw new Error("Rate-Limit erreicht. Bitte kurz warten und erneut versuchen.");
    }
    throw new Error(`Fehler bei der API-Anfrage (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((c) => c.type === "text");
  return textBlock?.text || "Keine Antwort erhalten.";
}

// Sehr einfacher Markdown-zu-HTML Renderer für die Plananzeige (keine externe
// Bibliothek nötig — deckt Überschriften, Listen, Fett/Kursiv ab).
export function renderMarkdown(md) {
  const lines = md.split("\n");
  let html = "";
  let inList = false;

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  const inline = (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed === "") {
      closeList();
      return;
    }
    if (trimmed.startsWith("## ")) {
      closeList();
      html += `<h3>${inline(trimmed.slice(3))}</h3>`;
    } else if (trimmed.startsWith("# ")) {
      closeList();
      html += `<h2>${inline(trimmed.slice(2))}</h2>`;
    } else if (trimmed.startsWith("### ")) {
      closeList();
      html += `<h4>${inline(trimmed.slice(4))}</h4>`;
    } else if (/^[-*]\s+/.test(trimmed)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inline(trimmed.replace(/^[-*]\s+/, ""))}</li>`;
    } else if (/^\d+\.\s+/.test(trimmed)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inline(trimmed.replace(/^\d+\.\s+/, ""))}</li>`;
    } else {
      closeList();
      html += `<p>${inline(trimmed)}</p>`;
    }
  });
  closeList();
  return html;
}
