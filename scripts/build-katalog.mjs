// Baut aus content/katalog.json die Geschichten-Dateien in src/data/geschichten/.
// Quran-Text + deutsche Übersetzung: Quran.com-API (geprüfte Quelle). Hadith-Text: fawazahmed0/hadith-api
// (Arabisch/Englisch, Einstufungen wie dort angegeben). NICHTS wird von KI geschrieben; was fehlt, ist als [Platzhalter] markiert.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'

const katalog = JSON.parse(readFileSync('content/katalog.json', 'utf8'))
const SKIP = new Set(['yusuf']) // von Hand kuratiert (src/data/yusuf.ts)
mkdirSync('content/.cache', { recursive: true }); mkdirSync('src/data/geschichten', { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function getJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok) return await r.json(); if (r.status === 404) return null } catch { /* retry */ }
    await wait(1000 * 2 ** i)
  }
  throw new Error('Abruf fehlgeschlagen: ' + url)
}
const strip = (t) => t.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]+>/g, '').trim()

async function kapitel(n) {
  const f = `content/.cache/ch-${n}.json`
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'))
  const verse = {}
  for (let page = 1; ; page++) {
    const j = await getJson(`https://api.quran.com/api/v4/verses/by_chapter/${n}?language=de&words=false&translations=27&fields=text_uthmani&audio=7&per_page=50&page=${page}`)
    for (const v of j.verses) verse[v.verse_number] = v
    if (!j.pagination?.next_page) break
  }
  writeFileSync(f, JSON.stringify(verse)); return verse
}
async function hadith(sammlung, nr) {
  const f = `content/.cache/h-${sammlung}-${nr}.json`
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'))
  const base = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions'
  const [ar, en] = await Promise.all([getJson(`${base}/ara-${sammlung}/${nr}.json`), getJson(`${base}/eng-${sammlung}/${nr}.json`)])
  const a = ar?.hadiths?.find((h) => h.hadithnumber === nr), e = en?.hadiths?.find((h) => h.hadithnumber === nr)
  if (!a) throw new Error(`Hadith nicht gefunden: ${sammlung} ${nr}`)
  const out = { ar: a.text.replace(/‏/g, '').replace(/\s+/g, ' ').trim(), en: e?.text, grades: a.grades ?? [] }
  writeFileSync(f, JSON.stringify(out)); return out
}
const ts = (v) => {
  const seg = v.audio?.segments ?? [], toks = v.text_uthmani.split(/\s+/)
  const idx = toks.map((t, i) => (/[ء-ي]/.test(t) ? i : -1)).filter((i) => i >= 0)
  return seg.length === idx.length ? seg.map(([, , a, b], n) => ({ wort_index: idx[n], start: a / 1000, ende: b / 1000 })) : undefined
}

const nach = JSON.parse(readFileSync('content/nacherzaehlungen.json', 'utf8'))
const WERK = { 10906: "adh-Dhahabi, Siyar A'lam an-Nubala (Ausgabe ar-Risala)" }
const BAND = { 'راشدون': 'al-Khulafa ar-Rashidun', 'سيرة 1': 'as-Sira 1', 'سيرة 2': 'as-Sira 2' }
const band = (b) => BAND[b] ?? b
const norm = (t) => t.replace(/\s+/g, ' ').trim()
// Biografien aus klassischen Werken: Sätze mit Seitenbeleg, Zitate wörtlich aus den gesicherten Seiten
function biografie(id) {
  const f = `content/biografien/${id}.json`
  if (!existsSync(f)) return null
  const b = JSON.parse(readFileSync(f, 'utf8')), q = JSON.parse(readFileSync(`content/quellen/${id}.json`, 'utf8'))
  const seite = (book, pg) => {
    const s = q.seiten.find((x) => x.book_id === book && x.page_id === pg)
    if (!s) throw new Error(`${id}: Seite ${book}/${pg} nicht gesichert`)
    return s
  }
  const stelle = (book, pg, kurz) => { const s = seite(book, pg); return `${kurz ? b.werk_kurz : WERK[book] ?? s.werk}, Bd. ${band(s.band)}, S. ${s.seite}` }
  const zit = b.zitate.map((z, i) => {
    const s = seite(z.book_id, z.page_id)
    if (!norm(s.text).includes(norm(z.text_ar))) throw new Error(`${id}: Zitat ${i + 1} steht nicht wörtlich auf Seite ${z.page_id}`)
    return { id: `a-${id}-${i + 1}`, typ: z.typ, text_ar: z.text_ar, text_de: z.text_de + ' [Übersetzung: Entwurf]', quelle: stelle(z.book_id, z.page_id), einstufung: z.einstufung ?? undefined }
  })
  const seiten = [...new Set(q.seiten.map((s) => `${s.book_id}|${s.band}`))].map((k) => {
    const [book, bandName] = k.split('|'), ps = q.seiten.filter((s) => `${s.book_id}` === book && s.band === bandName).map((s) => s.seite)
    return { werk: WERK[book] ?? q.seiten[0].werk, stelle: `Bd. ${band(bandName)}, S. ${Math.min(...ps)}–${Math.max(...ps)} (Text: turath.io / Shamela)` }
  })
  return {
    zitate: zit, quellen: seiten, hinweis: b.hinweis,
    saetze: b.saetze.map((x, i) => ({ id: `b${i + 1}`, text_ar_mit_harakat: x.ar, text_de: x.de, beleg: stelle(x.book_id, x.page_id, true) })),
    niveau: b.niveau,
  }
}
let n = 0
const index = []
for (const e of katalog) {
  if (SKIP.has(e.id)) continue
  const zitate = {}, saetze = [], quellen = []
  for (const r of e.quran) {
    const [s, v1] = r.von.split(':').map(Number), v2 = Number(r.bis.split(':')[1])
    const ch = await kapitel(s)
    for (let v = v1; v <= v2; v++) {
      const x = ch[v]; if (!x) throw new Error(`Vers fehlt ${s}:${v}`)
      const id = `q-${s}:${v}`
      if (zitate[id]) continue
      zitate[id] = {
        id, typ: 'ayah', text_ar: x.text_uthmani, text_de: strip(x.translations?.[0]?.text ?? ''),
        quelle: `Quran ${s}:${v}`, qari: 'Mishari Rashid al-Afasy',
        rezitation_url: `https://verses.quran.com/${x.audio.url}`, wort_zeitstempel: ts(x),
      }
      saetze.push({ id: `k${saetze.length + 1}`, text_ar_mit_harakat: x.text_uthmani, text_de: zitate[id].text_de, zitat_id: id })
    }
    quellen.push({ werk: 'Quran', stelle: r.von === r.bis ? `Sure ${r.von}` : `Sure ${r.von}–${r.bis.split(':')[1]}` })
  }
  for (const h of e.hadith) {
    const x = await hadith(h.sammlung, h.nr), id = `h-${h.sammlung}-${h.nr}`
    const grade = x.grades.map((g) => `${g.grade} (${g.name})`).join('; ') || '[Platzhalter: Einstufung fehlt]'
    zitate[id] = {
      id, typ: 'hadith', text_ar: x.ar, text_en: x.en, text_de: '[Platzhalter: deutsche Übersetzung noch zu ergänzen]',
      quelle: `${h.edition} ${h.nr}`, einstufung: grade,
    }
    saetze.push({ id: `k${saetze.length + 1}`, text_ar_mit_harakat: x.ar, text_de: zitate[id].text_de, zitat_id: id })
    quellen.push({ werk: h.edition, stelle: `Hadith Nr. ${h.nr} (Daten: hadith-api; Einstufung wie dort angegeben)`, einstufung: /sahih/i.test(grade) ? 'sahih' : /hasan/i.test(grade) ? 'hasan' : undefined })
  }
  const fassungen = saetze.length ? { klassisch: { status: 'entwurf', hinweis: 'Klassisch = Originalwortlaut der Überlieferung. Auswahl ist ein Entwurf.', saetze } } : {}
  const bio = biografie(e.id)
  if (bio) {
    for (const z of bio.zitate) zitate[z.id] = z
    const k = fassungen.klassisch ?? { status: 'entwurf', hinweis: 'Klassisch = Originalwortlaut der Überlieferung (Druckausgabe ohne vollständige Harakat).', saetze: [] }
    k.saetze = [...k.saetze, ...bio.zitate.map((z, i) => ({ id: `kz${i + 1}`, text_ar_mit_harakat: z.text_ar, text_de: z.text_de, zitat_id: z.id }))]
    fassungen.klassisch = k
    fassungen[bio.niveau] = { status: 'entwurf', hinweis: 'Nacherzählung in eigenen Worten (Entwurf) nach den angegebenen Seiten. Harakat und Übersetzung ungeprüft.', saetze: bio.saetze }
  }
  const nz = nach[e.id]
  if (nz) fassungen[nz.niveau] = {
    status: 'entwurf', hinweis: 'Vereinfachte Nacherzählung (Entwurf): nur Inhalte, die durch die angegebenen Verse belegt sind. Stufe, Harakat und Übersetzung ungeprüft.',
    saetze: nz.saetze.map((x, i) => ({ id: `n${i + 1}`, text_ar_mit_harakat: x.ar, text_de: x.de, beleg: x.beleg })),
  }
  const g = {
    id: e.id, bereich: e.bereich, titel_ar: e.titel_ar, titel_de: e.titel_de, bild_motiv: e.motiv,
    quellen: [...quellen, ...(bio?.quellen ?? []), ...e.quellen.filter((q) => !(bio && /Siyar/.test(q.werk)))],
    hinweis: bio ? (bio.hinweis ?? 'Nacherzählung und Zitate nach adh-Dhahabis Siyar (Seiten angegeben). Weitere Quellen noch zu ergänzen.') : e.hinweis, status: 'entwurf', zitate,
    fassungen,
  }
  writeFileSync(`src/data/geschichten/${e.id}.json`, JSON.stringify(g)); n++
  index.push({ id: g.id, bereich: g.bereich, titel_ar: g.titel_ar, titel_de: g.titel_de, bild_motiv: g.bild_motiv, status: g.status, hat_inhalt: Object.keys(fassungen).length > 0 })
}
writeFileSync('src/data/geschichten/index.json', JSON.stringify(index, null, 1))
console.log(n, 'Geschichten geschrieben')
