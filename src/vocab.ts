import { useSyncExternalStore } from 'react'
import type { Wort } from './types'

// Lernkarten mit Wiederholungssystem (Leitner-Boxen). Lokal gespeichert; später Sync über Supabase.
export interface Karte { id: string; wort: Wort; geschichte: string; box: number; faellig: number; hinzu: number }
const KEY = 'tad-vokabeln'
const TAGE = [0, 1, 3, 7, 14, 30] // Intervall je Box in Tagen
const DAY = 86_400_000

let karten: Karte[] = (() => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] } })()
const subs = new Set<() => void>()
const save = (k: Karte[]) => {
  karten = k
  try { localStorage.setItem(KEY, JSON.stringify(k)) } catch { /* ohne Speicher weiter */ }
  subs.forEach((f) => f())
}
const useKarten = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => karten)

export const kartenId = (w: Wort) => `${w.wurzel}|${w.grundform}`
export const useVokabeln = () => useKarten()
export const hatKarte = (k: Karte[], w: Wort) => k.some((c) => c.id === kartenId(w))
export const faellige = (k: Karte[], jetzt = Date.now()) => k.filter((c) => c.faellig <= jetzt)

export function hinzufuegen(wort: Wort, geschichte: string) {
  if (hatKarte(karten, wort)) return
  save([...karten, { id: kartenId(wort), wort, geschichte, box: 0, faellig: Date.now(), hinzu: Date.now() }])
}
export const entfernen = (id: string) => save(karten.filter((c) => c.id !== id))

/** Bewertung: 0 = nochmal, 1 = gut, 2 = leicht */
export function bewerten(id: string, note: 0 | 1 | 2) {
  save(karten.map((c) => {
    if (c.id !== id) return c
    const box = note === 0 ? 0 : Math.min(TAGE.length - 1, c.box + note)
    return { ...c, box, faellig: Date.now() + (note === 0 ? 10 * 60_000 : TAGE[box] * DAY) }
  }))
}
