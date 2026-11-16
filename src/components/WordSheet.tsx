import { useRef } from 'react'
import type { Wort, WortZeitstempel } from '../types'
import { asset } from '../assetUrl'
import { hatKarte, hinzufuegen, entfernen, kartenId, useVokabeln } from '../vocab'

// Hinweise sind als zusammenhängender Text gespeichert; für die Anzeige in Stichpunkte teilen.
const punkte = (t?: string) => (t ?? '').split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ„])/).map((x) => x.trim()).filter(Boolean)

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
  const zeile = (k: string, v?: string, ar = false) => v && v !== '–' && (
    <div className="ws-zeile"><span>{k}</span><strong {...(ar ? { dir: 'rtl', lang: 'ar', className: 'ar' } : {})}>{v}</strong></div>)
  const chips = [wort.wortart, wort.numerus, wort.genus, wort.kasus, wort.status].filter(Boolean) as string[]
  return (
    <div className="sheet-bg" onClick={zu}>
      <div className="sheet" role="dialog" aria-label="Wortdetails" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-zu" onClick={zu} aria-label="Schließen">✕</button>
        <p className="ar sheet-wort" dir="rtl" lang="ar">{wort.text.replace(/[.,:؟!،؛]$/, '')}</p>
        <p className="ws-kontext">{wort.bedeutung_kontext}</p>
        {chips.length > 0 && <p className="ws-chips">{chips.map((c) => <span key={c} className="chip">{c}</span>)}</p>}
        {zeile('Grundform', wort.grundform, true)}
        {zeile('Wurzel', wort.wurzel, true)}
        {zeile('Grundbedeutung', wort.bedeutung_grund)}
        {zeile('Verbform', wort.verbform && `Form ${wort.verbform}`)}
        {zeile('Zeit', wort.zeit)}
        {zeile('Person', wort.person)}
        {punkte(wort.hinweis).length > 0 && (
          <div className="ws-gramm">
            <h4>Grammatik (vereinfacht)</h4>
            <ul>{punkte(wort.hinweis).map((p, i) => <li key={i}>{p}</li>)}</ul>
          </div>
        )}
        <p className="klein">Maschinelle Wortanalyse (Entwurf) – kann Fehler enthalten und ist noch nicht fachlich geprüft.</p>
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
