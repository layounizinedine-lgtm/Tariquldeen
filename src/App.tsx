import { useState } from 'react'
import { alleGeschichten, bereiche, sichtbar } from './data'
import { useSettings } from './settings'
import Reader from './components/Reader'
import VocabView from './components/VocabView'
import { serie, useFortschritt } from './progress'
import { faellige, useVokabeln } from './vocab'
import CoverArt from './components/CoverArt'

export default function App() {
  const [s, set] = useSettings()
  const [id, setId] = useState<string | null>(null)
  const [vok, setVok] = useState(false)
  const karten = useVokabeln()
  const fort = useFortschritt()
  const g = alleGeschichten.find((x) => x.id === id)
  if (vok) return <VocabView zurueck={() => setVok(false)} />
  if (g) return <Reader g={g} s={s} set={set} zurueck={() => setId(null)} />

  return (
    <main className="seite">
      <header className="kopf">
        <p className="ar logo" dir="rtl" lang="ar">طَرِيقُ الدِّينِ</p>
        <h1>Arabisch lernen mit den Geschichten des Islam</h1>
      </header>
      <p className="stats">🔥 {serie(fort.tage)} Tage Serie · ⭐ {fort.punkte} Punkte · 📖 {Object.keys(fort.gelesen).length} gelesen</p>
      <button className="karte vok-knopf" onClick={() => setVok(true)}>📚 Meine Vokabeln <em className="tag">{faellige(karten).length} fällig</em></button>
      {bereiche.map((b) => {
        const liste = alleGeschichten.filter((x) => x.bereich === b.id && sichtbar(x))
        return (
          <section key={b.id} className="bereich">
            <h2><span className="ar" dir="rtl" lang="ar">{b.ar}</span> · {b.de}</h2>
            <p className="klein">{b.beschr}</p>
            {liste.length === 0 && <p className="leer">Noch keine geprüften Geschichten.</p>}
            {liste.map((x) => (
              <button key={x.id} className="karte" onClick={() => setId(x.id)}>
                <CoverArt motiv={x.bild_motiv} url={x.bild_url} />
                <span>{x.titel_de}{x.status === 'entwurf' && <em className="tag">Entwurf</em>}{fort.gelesen[x.id] && <em className="tag">✓ gelesen</em>}</span>
              </button>
            ))}
          </section>
        )
      })}
    </main>
  )
}
