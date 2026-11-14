import type { Bereich, Geschichte, Satz } from '../types'
import { yusuf } from './yusuf'
import katalog from './geschichten/index.json'
import pruefung from '../../content/pruefung.json'

// Katalog: leichte Einträge, vollständige Geschichte wird erst beim Öffnen nachgeladen (eigene Chunks, offlinefähig via PWA).
const stub = (k: (typeof katalog)[number]): Geschichte => ({ ...k, bereich: k.bereich as Bereich, status: k.status as Geschichte['status'], quellen: [], zitate: {}, fassungen: {} })
// Freigabe für die von Hand gepflegte Yusuf-Geschichte (die übrigen setzt der Builder)
const frY = (pruefung.freigaben as Record<string, Geschichte['pruefung']>)['yusuf']
const yusufMitFreigabe: Geschichte = frY ? { ...yusuf, status: 'geprüft', pruefung: frY,
  fassungen: Object.fromEntries(Object.entries(yusuf.fassungen).map(([n, f]) => [n, frY.niveaus.includes(n as never) ? { ...f!, status: 'geprüft' } : f])) } : yusuf
export const alleGeschichten: Geschichte[] = [yusufMitFreigabe, ...katalog.map(stub)]
const dateien = import.meta.glob('./geschichten/*.json', { import: 'default' }) as Record<string, () => Promise<Geschichte>>

// Erzähler-Audio (KI-Stimme) liegt je Geschichte unter audio/<id>/meta.json und wird beim Öffnen zugemischt.
async function mitAudio(g: Geschichte): Promise<Geschichte> {
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}audio/${g.id}/meta.json`)
    if (!r.ok || !(r.headers.get('content-type') ?? '').includes('json')) return g
    const meta = (await r.json()) as Record<string, { audio_url: string; wort_zeitstempel?: Satz['wort_zeitstempel'] }>
    const fassungen = Object.fromEntries(Object.entries(g.fassungen).map(([n, f]) => {
      if (!f) return [n, f]
      let ki = false
      const saetze = f.saetze.map((s) => (meta[s.id] && !s.zitat_id ? ((ki = true), { ...s, audio_url: meta[s.id].audio_url, wort_zeitstempel: meta[s.id].wort_zeitstempel }) : s))
      return [n, { ...f, saetze, audio_ki: ki || undefined }]
    }))
    return { ...g, fassungen }
  } catch { return g }
}

export async function ladeVoll(g: Geschichte): Promise<Geschichte> {
  let voll = g
  if (!(g.quellen.length || Object.keys(g.fassungen).length)) { // nur Katalog-Eintrag -> Datei nachladen
    const f = dateien[`./geschichten/${g.id}.json`]
    voll = f ? await f() : g
  }
  return g.id === 'yusuf' ? voll : mitAudio(voll)
}
export const bereiche: { id: Bereich; ar: string; de: string; beschr: string }[] = [
  { id: 'anbiya', ar: 'قَصَصُ الْأَنْبِيَاءِ', de: 'Propheten', beschr: 'Geschichten der Propheten, Friede auf ihnen' },
  { id: 'sahaba', ar: 'الصَّحَابَةُ', de: 'Sahaba', beschr: 'Die Gefährten des Propheten ﷺ, darunter die zehn mit der Zusage des Paradieses' },
  { id: 'tabiin', ar: 'التَّابِعُونَ', de: "Tabi'in", beschr: 'Die Generation nach den Gefährten' },
  { id: 'aimma', ar: 'الْأَئِمَّةُ', de: 'Imame', beschr: 'Die großen Imame der Rechtsschulen: Abu Hanifa, Malik, asch-Schafiʿi' },
  { id: 'ahmad', ar: 'الْإِمَامُ أَحْمَدُ', de: 'Imam Ahmad & Schüler', beschr: 'Leben, Mihna und Wara\u2019' },
]
// Entwürfe sind sichtbar (mit Hinweis "noch nicht fachlich geprüft"). Nur geprüfte zeigen: ?nur-geprueft=1
export const zeigeEntwuerfe = !new URLSearchParams(location.search).has('nur-geprueft')
export const sichtbar = (g: Geschichte) => zeigeEntwuerfe || g.status === 'geprüft'
