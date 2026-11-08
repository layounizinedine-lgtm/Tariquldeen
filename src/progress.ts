import { useSyncExternalStore } from 'react'

export interface Fortschritt {
  gelesen: Record<string, number>
  quiz: Record<string, { beste: number; letzte: number; versuche: number }> // Schlüssel: geschichte|niveau, Werte in %
  punkte: number
  tage: string[] // aktive Tage (YYYY-MM-DD)
}
const KEY = 'tad-fortschritt'
const leer = (): Fortschritt => ({ gelesen: {}, quiz: {}, punkte: 0, tage: [] })
let st: Fortschritt = (() => { try { return { ...leer(), ...JSON.parse(localStorage.getItem(KEY) ?? '{}') } } catch { return leer() } })()
const subs = new Set<() => void>()
const heute = () => new Date().toISOString().slice(0, 10)
function save(n: Fortschritt) {
  st = { ...n, tage: n.tage.includes(heute()) ? n.tage : [...n.tage, heute()] }
  try { localStorage.setItem(KEY, JSON.stringify(st)) } catch { /* ohne Speicher weiter */ }
  subs.forEach((f) => f())
}
export const useFortschritt = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => st)

export const markiereGelesen = (id: string) => save({ ...st, gelesen: { ...st.gelesen, [id]: Date.now() } })
export function speichereQuiz(key: string, richtig: number, gesamt: number) {
  const pct = gesamt ? Math.round((richtig / gesamt) * 100) : 0
  const alt = st.quiz[key]
  save({ ...st, punkte: st.punkte + richtig * 10,
    quiz: { ...st.quiz, [key]: { beste: Math.max(alt?.beste ?? 0, pct), letzte: pct, versuche: (alt?.versuche ?? 0) + 1 } } })
}
/** Lernserie: aufeinanderfolgende aktive Tage bis heute (oder bis gestern). */
export function serie(tage: string[]) {
  const set = new Set(tage); let n = 0; const d = new Date()
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1)
  while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1) }
  return n
}
