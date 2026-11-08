import { useMemo, useState } from 'react'
import type { Geschichte, Niveau } from '../types'
import { baueQuiz } from '../quiz'
import { markiereGelesen, speichereQuiz } from '../progress'
import { hatKarte, hinzufuegen, useVokabeln } from '../vocab'

export default function QuizView({ g, niveau, zurueck }: { g: Geschichte; niveau: Niveau; zurueck: () => void }) {
  const [lauf, setLauf] = useState(0)
  const { fragen, hinweise } = useMemo(() => baueQuiz(g, niveau, Date.now() + lauf), [g, niveau, lauf])
  const [i, setI] = useState(0)
  const [wahl, setWahl] = useState<number | null>(null)
  const [richtig, setRichtig] = useState(0)
  const karten = useVokabeln()
  const fertig = i >= fragen.length
  const f = fragen[i]

  const antworte = (n: number) => { if (wahl === null) { setWahl(n); if (n === f.richtig) setRichtig((x) => x + 1) } }
  const weiter = () => {
    if (i + 1 >= fragen.length) { speichereQuiz(`${g.id}|${niveau}`, richtig, fragen.length); markiereGelesen(g.id) }
    setI(i + 1); setWahl(null)
  }
  const neu = () => { setLauf((x) => x + 1); setI(0); setWahl(null); setRichtig(0) }

  return (
    <main className="seite">
      <button className="link" onClick={zurueck}>← Zur Geschichte</button>
      <h1>Quiz: {g.titel_de} · {niveau}</h1>
      {g.status === 'entwurf' && <p className="banner">Entwurf – Fragen noch nicht geprüft</p>}
      {hinweise.map((h) => <p key={h} className="klein">{h}</p>)}

      {fragen.length === 0 && <p className="leer">Für dieses Niveau gibt es noch kein Quiz.</p>}
      {fragen.length > 0 && !fertig && f && (
        <section className="frage">
          <p className="klein">Frage {i + 1} von {fragen.length}</p>
          <div className="balken"><i style={{ width: `${(i / fragen.length) * 100}%` }} /></div>
          <h2>{f.prompt}</h2>
          {f.promptAr && <p className="ar" dir="rtl" lang="ar" style={{ fontSize: 34 }}>{f.promptAr}</p>}
          {f.audio && <audio controls src={f.audio} />}
          <div className="optionen">
            {f.optionen.map((o, n) => {
              const st = wahl === null ? '' : n === f.richtig ? ' richtig' : n === wahl ? ' falsch' : ''
              return (
                <button key={n} className={`opt${st}`} disabled={wahl !== null} onClick={() => antworte(n)}>
                  {f.optAr ? <span className="ar" dir="rtl" lang="ar" style={{ fontSize: 26 }}>{o}</span> : o}
                </button>
              )
            })}
          </div>
          {wahl !== null && (
            <div className="feedback">
              <p><strong>{wahl === f.richtig ? '✓ Richtig!' : '✗ Leider falsch.'}</strong> {f.erklaerung}</p>
              {f.wort && wahl !== f.richtig && !hatKarte(karten, f.wort) && (
                <button className="link" onClick={() => hinzufuegen(f.wort!, g.id)}>+ Wort zu meinen Vokabeln</button>
              )}
              <button className="gold gross-btn" onClick={weiter}>{i + 1 >= fragen.length ? 'Ergebnis' : 'Weiter'}</button>
            </div>
          )}
        </section>
      )}
      {fragen.length > 0 && fertig && (
        <section className="lernkarte">
          <h2>{richtig} von {fragen.length} richtig</h2>
          <p>+{richtig * 10} Punkte · Geschichte als gelesen gespeichert</p>
          <div className="ws-knoepfe"><button onClick={neu}>Neues Quiz</button><button className="gold" onClick={zurueck}>Fertig</button></div>
        </section>
      )}
    </main>
  )
}
