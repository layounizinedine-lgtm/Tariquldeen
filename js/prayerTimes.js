// prayerTimes.js
// Berechnung der fünf Gebetszeiten (Salah) auf Basis der Sonnenposition.
// Verwendet Standard-Astronomieformeln (Sonnendeklination, Zeitgleichung,
// Stundenwinkel), wie sie in gängigen Gebetszeit-Rechnern verwendet werden.

export const CALCULATION_METHODS = {
  MWL: { name: "Muslim World League", fajrAngle: 18, ishaAngle: 17 },
  ISNA: { name: "Islamic Society of North America (ISNA)", fajrAngle: 15, ishaAngle: 15 },
  EGYPT: { name: "Ägyptische Generalbehörde für Vermessung", fajrAngle: 19.5, ishaAngle: 17.5 },
  KARACHI: { name: "Universität von Karachi", fajrAngle: 18, ishaAngle: 18 },
  UMM_AL_QURA: { name: "Umm al-Qura, Mekka", fajrAngle: 18.5, ishaAngle: null, ishaOffsetMin: 90 },
  TEHRAN: { name: "Institut für Geophysik, Teheran", fajrAngle: 17.7, ishaAngle: 14, maghribAngle: 4.5 },
  JAFARI: { name: "Ja'fari (Schia)", fajrAngle: 16, ishaAngle: 14, maghribAngle: 4 },
};

export const ASR_FACTORS = {
  STANDARD: { name: "Standard (Shafi'i, Maliki, Hanbali)", factor: 1 },
  HANAFI: { name: "Hanafi", factor: 2 },
};

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const sin = (d) => Math.sin(d * D2R);
const cos = (d) => Math.cos(d * D2R);
const tan = (d) => Math.tan(d * D2R);
const asin = (x) => Math.asin(x) * R2D;
const acos = (x) => Math.acos(x) * R2D;
const atan2 = (y, x) => Math.atan2(y, x) * R2D;
const acot = (x) => Math.atan(1 / x) * R2D;
const fixHour = (h) => {
  h = h % 24;
  return h < 0 ? h + 24 : h;
};
const fixAngle = (a) => {
  a = a % 360;
  return a < 0 ? a + 360 : a;
};

function julianDate(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

// Liefert Sonnendeklination (Grad) und Zeitgleichung (Stunden) für einen
// gegebenen Julianischen Tag (0h UT).
function sunPosition(jd) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sin(g) + 0.02 * sin(2 * g));
  const e = 23.439 - 0.00000036 * D;

  const RA = atan2(cos(e) * sin(L), cos(L)) / 15;
  const eqt = q / 15 - fixHour(RA);
  const decl = asin(sin(e) * sin(L));

  return { declination: decl, equationOfTime: eqt };
}

// Stundenwinkel (in Stunden) zwischen Mittag und dem Zeitpunkt, an dem die
// Sonne den gegebenen Winkel unter/über dem Horizont erreicht.
function hourAngle(angleDeg, lat, decl) {
  const val =
    (-sin(angleDeg) - sin(lat) * sin(decl)) / (cos(lat) * cos(decl));
  const clamped = Math.max(-1, Math.min(1, val));
  return acos(clamped) / 15;
}

// Asr-Stundenwinkel abhängig vom Schattenfaktor (1 = Standard, 2 = Hanafi).
function asrHourAngle(factor, lat, decl) {
  const angle = -acot(factor + tan(Math.abs(lat - decl)));
  return hourAngle(angle, lat, decl);
}

/**
 * Berechnet die Gebetszeiten für ein Datum und einen Standort.
 * @param {Date} date - lokales Datum (Jahr/Monat/Tag werden verwendet)
 * @param {number} lat - Breitengrad
 * @param {number} lon - Längengrad
 * @param {number} tzOffset - Zeitzonen-Offset zu UTC in Stunden (z. B. 1 oder 2 für Deutschland)
 * @param {object} options - { method, asrFactor }
 * @returns {object} Zeiten als Dezimalstunden { fajr, sunrise, dhuhr, asr, maghrib, isha }
 */
export function calculatePrayerTimes(date, lat, lon, tzOffset, options = {}) {
  const methodKey = options.method || "MWL";
  const method = CALCULATION_METHODS[methodKey] || CALCULATION_METHODS.MWL;
  const asrFactor = ASR_FACTORS[options.asrFactor || "STANDARD"].factor;

  const jd = julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  // Iterative Annäherung: Sonnenposition wird zunächst für Mittag (JD + 0.5)
  // berechnet, was für Gebetszeitzwecke ausreichend genau ist.
  const jdNoon = jd - lon / 360;
  const { declination: decl, equationOfTime: eqt } = sunPosition(jdNoon + 0.5);

  const dhuhr = fixHour(12 - lon / 15 + tzOffset - eqt);

  const sunriseAngle = 0.833; // Standard-Horizontdepression (Refraktion + Sonnenradius)
  const tSunrise = hourAngle(sunriseAngle, lat, decl);
  const sunrise = dhuhr - tSunrise;
  const maghribAngle = method.maghribAngle ?? sunriseAngle;
  const tMaghrib = hourAngle(maghribAngle, lat, decl);
  const maghrib = dhuhr + tMaghrib;

  const tFajr = hourAngle(method.fajrAngle, lat, decl);
  const fajr = dhuhr - tFajr;

  let isha;
  if (method.ishaAngle) {
    const tIsha = hourAngle(method.ishaAngle, lat, decl);
    isha = dhuhr + tIsha;
  } else {
    isha = maghrib + (method.ishaOffsetMin || 90) / 60;
  }

  const tAsr = asrHourAngle(asrFactor, lat, decl);
  const asr = dhuhr + tAsr;

  return {
    fajr: fixHour(fajr),
    sunrise: fixHour(sunrise),
    dhuhr: fixHour(dhuhr),
    asr: fixHour(asr),
    maghrib: fixHour(maghrib),
    isha: fixHour(isha),
  };
}

export function decimalHourToDate(baseDate, decimalHour) {
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);
  const hours = Math.floor(decimalHour);
  const minutesFull = (decimalHour - hours) * 60;
  const minutes = Math.floor(minutesFull);
  const seconds = Math.round((minutesFull - minutes) * 60);
  d.setHours(hours, minutes, seconds, 0);
  return d;
}

export function formatTime(decimalHour, is24h = true) {
  const totalMinutes = Math.round(decimalHour * 60);
  let h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  if (is24h) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const suffix = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export const PRAYER_LABELS = {
  fajr: "Fajr",
  sunrise: "Sonnenaufgang",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export const PRAYER_ARABIC = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};
