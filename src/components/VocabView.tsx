import { useState } from 'react'
import { bewerten, entfernen, faellige, useVokabeln } from '../vocab'

export default function VocabView({ zurueck }: { zurueck: () => void }) {
  const karten = useVokabeln()
  const [lernen, setLernen] = useState(false)
  const [zeige, setZeige] = useState(false)
  const dran = faellige(karten).sort((a, b) => a.faellig - b.faellig)
  const k = dran[0]

  return (
    <main className="seite">
      <button className="link" onClick={zurueck}>← Zurück</button>
      <h1>Meine Vokabeln</h1>
      <p className="klein">{karten.length} Karten · {dran.length} fällig</p>
      {!lernen && <button className="gold gross-btn" disabled={!dran.length} onClick={() => { setLernen(true); setZeige(false) }}>Lernen starten</button>}

      {lernen && (k ? (
        <div className="lernkarte">
          <p className="ar" dir="rtl" lang="ar" style={{ fontSize: 40 }}>{k.wort.text.replace(/[.,:؟!]$/, '')}</p>
          {zeige ? (
            <>
              <p><strong>{k.wort.bedeutung_grund}</strong></p>
              <p className="klein">Im Satz: {k.wort.bedeutung_kontext} · Wurzel {k.wort.wurzel}</p>
              <div className="ws-knoepfe">
                <button onClick={() => { bewerten(k.id, 0); setZeige(false) }}>Nochmal</button>
                <button onClick={() => { bewerten(k.id, 1); setZeige(false) }}>Gut</button>
                <button className="gold" onClick={() => { bewerten(k.id, 2); setZeige(false) }}>Leicht</button>
              </div>
            </>
          ) : <button className="gold" onClick={() => setZeige(true)}>Antwort zeigen</button>}
        </div>
      ) : <p className="leer">Alles gelernt für heute. 🎉</p>)}
      {lernen && <button className="link" onClick={() => setLernen(false)}>Lernen beenden</button>}

      <h2>Alle Karten</h2>
      {karten.length === 0 && <p className="leer">Tippe in einer Geschichte auf ein Wort und wähle „Zu meinen Vokabeln“.</p>}
      <ul className="vokliste">
        {karten.map((c) => (
          <li key={c.id}>
            <span className="ar" dir="rtl" lang="ar" style={{ fontSize: 24 }}>{c.wort.grundform}</span>
            <span>{c.wort.bedeutung_grund}<small> · Box {c.box + 1}</small></span>
            <button className="link" onClick={() => entfernen(c.id)} aria-label="Karte löschen">✕</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
