import { useCallback, useEffect, useRef, useState } from 'react'
import type { WortZeitstempel } from './types'

export interface Spur { id: string; audio_url?: string; ts?: WortZeitstempel[] }

// Satz-Player: Play/Pause/Stop, Satz vor/zurück, Wiederholen, Tempo (mit Tonhöhenkorrektur),
// aktives Wort aus vorab gespeicherten Zeitstempeln. Kein Audio wird live erzeugt.
export function usePlayer(spuren: Spur[]) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const spurenRef = useRef(spuren); spurenRef.current = spuren
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [rate, setRateState] = useState(1)
  const [repeat, setRepeat] = useState(false)
  const [wort, setWort] = useState(-1)
  const rateRef = useRef(1), repeatRef = useRef(false), idxRef = useRef(-1)
  repeatRef.current = repeat

  const el = () => {
    if (!audio.current) {
      const a = new Audio(); a.preload = 'auto'
      // Tonhöhe bleibt beim Tempowechsel erhalten
      a.preservesPitch = true
      ;(a as unknown as { webkitPreservesPitch: boolean }).webkitPreservesPitch = true
      audio.current = a
    }
    return audio.current
  }

  const stopAll = useCallback(() => {
    const a = el(); a.pause(); a.currentTime = 0
    idxRef.current = -1; setIndex(-1); setPlaying(false); setWort(-1)
  }, [])

  const spiele = useCallback((i: number) => {
    const liste = spurenRef.current
    while (i < liste.length && !liste[i].audio_url) i++ // Sätze ohne Audio überspringen
    if (i >= liste.length) { stopAll(); return }
    const a = el()
    a.src = liste[i].audio_url!
    a.playbackRate = rateRef.current
    idxRef.current = i; setIndex(i); setWort(-1)
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [stopAll])

  useEffect(() => {
    const a = el()
    const ende = () => (repeatRef.current ? spiele(idxRef.current) : spiele(idxRef.current + 1))
    a.addEventListener('ended', ende)
    a.addEventListener('pause', () => setPlaying(false))
    a.addEventListener('play', () => setPlaying(true))
    return () => { a.removeEventListener('ended', ende); a.pause() }
  }, [spiele])

  // Mitlesen: aktives Wort per Animationsframe bestimmen
  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = () => {
      const ts = spurenRef.current[idxRef.current]?.ts
      if (ts) {
        const t = el().currentTime
        const hit = ts.find((w) => t >= w.start && t < w.ende)
        if (hit) setWort(hit.wort_index)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, index])

  const setRate = (r: number) => {
    const v = Math.min(1.5, Math.max(0.5, Math.round(r * 10) / 10))
    rateRef.current = v; setRateState(v); el().playbackRate = v
  }
  const toggle = () => {
    const a = el()
    if (idxRef.current < 0) return spiele(0)
    if (a.paused) a.play(); else a.pause()
  }
  return {
    index, playing, rate, repeat, wort, setRate, setRepeat, stop: stopAll, toggle,
    play: spiele,
    weiter: () => spiele(Math.max(0, idxRef.current) + (idxRef.current < 0 ? 0 : 1)),
    zurueck: () => spiele(Math.max(0, idxRef.current - 1)),
  }
}
