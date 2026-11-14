import type { Bereich, Geschichte } from '../types'
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

export async function ladeVoll(g: Geschichte): Promise<Geschichte> {
  if (g.quellen.length || Object.keys(g.fassungen).length) return g // schon vollständig (Yusuf oder aus Supabase)
  const f = dateien[`./geschichten/${g.id}.json`]
  return f ? f() : g
}
export const bereiche: { id: Bereich; ar: string; de: string; beschr: string }[] = [
  { id: 'anbiya', ar: 'قَصَصُ الْأَنْبِيَاءِ', de: 'Propheten', beschr: 'Geschichten der Propheten, Friede auf ihnen' },
  { id: 'sahaba', ar: 'الصَّحَابَةُ', de: 'Sahaba', beschr: 'Die Gefährten des Propheten ﷺ, darunter die zehn mit der Zusage des Paradieses' },
  { id: 'tabiin', ar: 'التَّابِعُونَ', de: "Tabi'in", beschr: 'Die Generation nach den Gefährten' },
  { id: 'aimma', ar: 'الْأَئِمَّةُ', de: 'Imame', beschr: 'Die großen Imame der Rechtsschulen: Abu Hanifa, Malik, asch-Schafiʿi' },
  { id: 'ahmad', ar: 'الْإِمَامُ أَحْمَدُ', de: 'Imam Ahmad & Schüler', beschr: 'Leben, Mihna und Wara\u2019' },
]
// Nur geprüfte Inhalte sind für Nutzer sichtbar; Entwürfe nur im Entwicklungsmodus oder mit ?entwurf=1
export const zeigeEntwuerfe =
  import.meta.env.DEV || new URLSearchParams(location.search).has('entwurf')
export const sichtbar = (g: Geschichte) => zeigeEntwuerfe || g.status === 'geprüft'
