import { useRef } from 'react'
import type { Wort, WortZeitstempel } from '../types'
import { asset } from '../assetUrl'
import { hatKarte, hinzufuegen, entfernen, kartenId, useVokabeln } from '../vocab'

export default function WordSheet({ wort, ts, audioUrl, geschichte, zu }: {
  wort: Wort; ts?: WortZeitstempel; audioUrl?: string; geschichte: string; zu: () => void
}) {
  const karten = useVokabeln()
  const drin = hatKarte(karten, wort)
  const a = useRef<HTMLAudioElement | null>(null)
  // Audio nur für dieses Wort: Ausschnitt aus der Satz-Aufnahme anhand der Zeitstempel
  const hoeren = () => {
    if (!audioUrl || !ts) return
    a.current?.pause()
    const el = new Audio(asset(audioUrl)); a.current = el
    el.currentTime = ts.start
    el.ontimeupdate = () => { if (el.currentTime >= ts.ende) el.pause() }
    el.play().catch(() => {})
  }
  const zeile = (k: string, v?: string) => v && <div className="ws-zeile"><span>{k}</span><strong>{v}</strong></div>
  return (
    <div className="sheet-bg" onClick={zu}>
      <div className="sheet" role="dialog" aria-label="Wortdetails" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-zu" onClick={zu} aria-label="Schließen">✕</button>
        <p className="ar sheet-wort" dir="rtl" lang="ar">{wort.text.replace(/[.,:؟!]$/, '')}</p>
        <p className="ws-kontext">{wort.bedeutung_kontext}</p>
        {zeile('Wurzel', wort.wurzel)}
        {zeile('Grundform', wort.grundform)}
        {zeile('Wortart', wort.wortart)}
        {zeile('Verbform', wort.verbform && `Form ${wort.verbform}`)}
        {zeile('Zeit', wort.zeit)}
        {zeile('Person', wort.person)}
        {zeile('Grundbedeutung', wort.bedeutung_grund)}
        {wort.hinweis && <p className="hinweis">{wort.hinweis}</p>}
        <p className="klein">Wortdaten: Entwurf, noch nicht fachlich geprüft.</p>
        <div className="ws-knoepfe">
          <button disabled={!audioUrl || !ts} onClick={hoeren}>🔊 Wort anhören</button>
          <button className="gold" onClick={() => (drin ? entfernen(kartenId(wort)) : hinzufuegen(wort, geschichte))}>
            {drin ? '✓ In meinen Vokabeln (entfernen)' : '+ Zu meinen Vokabeln'}
          </button>
        </div>
      </div>
    </div>
  )
}
