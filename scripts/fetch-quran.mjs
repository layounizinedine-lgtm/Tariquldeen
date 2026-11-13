// Lädt Quran-Verse (Uthmani) + deutsche Übersetzung aus der Quran.com-API.
// Der Quran-Text wird NIE von Hand/KI geschrieben, nur von hier übernommen.
import { writeFileSync } from 'node:fs'

const KEYS = ['12:4', '12:15', '12:20', '12:53']
const TRANSLATION = 27 // Frank Bubenheim & Nadeem Elyas
const out = {}
for (const key of KEYS) {
  const r = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${key}?fields=text_uthmani&translations=${TRANSLATION}&audio=7`,
  )
  const { verse } = await r.json()
  // Wort-Zeitstempel (Quran.com-Segmente, Alafasy): nur übernehmen, wenn Wortzahl exakt passt
  const toks = verse.text_uthmani.split(/\s+/)
  const istWort = (t) => /[\u0621-\u064A]/.test(t) // Stoppzeichen/۞ sind keine Wörter
  const wortIdx = toks.map((t, i) => (istWort(t) ? i : -1)).filter((i) => i >= 0)
  const seg = verse.audio?.segments ?? []
  const ts = seg.length === wortIdx.length
    ? seg.map(([, , von, bis], n) => ({ wort_index: wortIdx[n], start: von / 1000, ende: bis / 1000 }))
    : undefined
  if (!ts) console.warn(`${key}: Segmente (${seg.length}) ≠ Wörter (${wortIdx.length}) – keine Zeitstempel`)
  out[key] = {
    wort_zeitstempel: ts,
    key,
    text_ar: verse.text_uthmani,
    text_de: verse.translations[0].text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]+>/g, ''),
    quelle: `Quran ${key} (Quran.com-API, Uthmani; Übersetzung: Bubenheim & Elyas)`,
    audio: `https://verses.quran.com/Alafasy/mp3/${key.split(':').map((n) => n.padStart(3, '0')).join('')}.mp3`,
    qari: 'Mishari Rashid al-Afasy',
  }
}
writeFileSync('src/data/quran-yusuf.json', JSON.stringify(out, null, 2))
console.log(Object.keys(out))
