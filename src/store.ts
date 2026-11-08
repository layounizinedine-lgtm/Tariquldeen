import { useEffect, useState } from 'react'
import { ladeAlle, supabase } from './db'
import { alleGeschichten as beispiele } from './data'
import type { Geschichte } from './types'

const CACHE = 'tad-cache-v1'
/** Geschichten: aus Supabase (mit lokalem Cache für Offline), sonst die mitgelieferten Beispieldaten. */
export function useGeschichten() {
  const [liste, setListe] = useState<Geschichte[]>(() => {
    if (!supabase) return beispiele
    try { return JSON.parse(localStorage.getItem(CACHE) ?? '[]') } catch { return [] }
  })
  const [laedt, setLaedt] = useState(!!supabase)
  const [fehler, setFehler] = useState<string | null>(null)
  useEffect(() => {
    if (!supabase) return
    ladeAlle().then((l) => {
      setListe(l)
      try { localStorage.setItem(CACHE, JSON.stringify(l)) } catch { /* Cache optional */ }
    }).catch((e) => setFehler(String(e.message ?? e))).finally(() => setLaedt(false))
  }, [])
  return { liste, laedt, fehler }
}
