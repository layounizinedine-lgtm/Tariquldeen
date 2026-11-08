import type { Bereich, Geschichte } from '../types'
import { yusuf } from './yusuf'

export const alleGeschichten: Geschichte[] = [yusuf]
export const bereiche: { id: Bereich; ar: string; de: string; beschr: string }[] = [
  { id: 'anbiya', ar: 'قَصَصُ الْأَنْبِيَاءِ', de: 'Propheten', beschr: 'Geschichten der Gesandten Allahs' },
  { id: 'sahaba', ar: 'الصَّحَابَةُ', de: 'Sahaba', beschr: 'Die Gefährten des Propheten ﷺ' },
  { id: 'tabiin', ar: 'التَّابِعُونَ', de: "Tabi'in", beschr: 'Die Generation nach den Gefährten' },
  { id: 'ahmad', ar: 'الْإِمَامُ أَحْمَدُ', de: 'Imam Ahmad & Schüler', beschr: 'Leben, Mihna und Wara’' },
]
// Nur geprüfte Inhalte sind für Nutzer sichtbar; Entwürfe nur im Entwicklungsmodus oder mit ?entwurf=1
export const zeigeEntwuerfe =
  import.meta.env.DEV || new URLSearchParams(location.search).has('entwurf')
export const sichtbar = (g: Geschichte) => zeigeEntwuerfe || g.status === 'geprüft'
