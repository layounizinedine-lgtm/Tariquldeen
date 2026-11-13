import { useEffect, useState } from 'react'

export type Uebersetzung = 'immer' | 'tippen' | 'aus'
export interface Settings {
  theme: 'auto' | 'hell' | 'dunkel'; schrift: 'Amiri' | 'Scheherazade New'
  groesse: number; uebersetzung: Uebersetzung; harakatAus: boolean
}
const DEFAULT: Settings = { theme: 'auto', schrift: 'Amiri', groesse: 30, uebersetzung: 'immer', harakatAus: false }
const KEY = 'tad-settings'

export function useSettings() {
  const [s, setS] = useState<Settings>(() => {
    try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') } } catch { return DEFAULT }
  })
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ohne Speicher weiter */ }
    const r = document.documentElement
    if (s.theme === 'auto') r.removeAttribute('data-theme'); else r.dataset.theme = s.theme === 'hell' ? 'light' : 'dark'
  }, [s])
  return [s, (p: Partial<Settings>) => setS((o) => ({ ...o, ...p }))] as const
}

// Entfernt Harakat/Koranzeichen für den Übungsmodus
export const ohneHarakat = (t: string) => t.replace(/[ً-ٰٟۖ-ۭ]/g, '')
