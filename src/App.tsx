import { useState } from 'react'
import { alleGeschichten, bereiche, sichtbar } from './data'
import { useSettings } from './settings'
import Reader from './components/Reader'
import CoverArt from './components/CoverArt'
import VocabView from './components/VocabView'
import { serie, useFortschritt } from './progress'
import { faellige, useVokabeln } from './vocab'

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
    <main className="seite home">
      <header className="home-kopf">
        <p className="ar logo" dir="rtl" lang="ar">طَرِيقُ الدِّينِ</p>
        <h1>Arabisch lernen mit den Geschichten des Islam</h1>
        <div className="chips">
          <span>🔥 {serie(fort.tage)} Tage</span><span>⭐ {fort.punkte} Punkte</span><span>📖 {Object.keys(fort.gelesen).length} gelesen</span>
        </div>
      </header>
      <button className="vok-karte" onClick={() => setVok(true)}>
        <span>📚 Meine Vokabeln<small>{karten.length} Karten</small></span>
        <em className="tag">{faellige(karten).length} fällig</em>
      </button>
      {bereiche.map((b) => {
        const liste = alleGeschichten.filter((x) => x.bereich === b.id && sichtbar(x))
        return (
          <section key={b.id} className="bereich">
            <div className="bereich-kopf">
              <h2>{b.de}</h2><span className="ar" dir="rtl" lang="ar">{b.ar}</span>
            </div>
            <p className="klein">{b.beschr}</p>
            {liste.length === 0 && <p className="leer">Noch keine geprüften Geschichten.</p>}
            {liste.map((x) => (
              <button key={x.id} className="karte" onClick={() => setId(x.id)}>
                <CoverArt motiv={x.bild_motiv} url={x.bild_url} />
                <span className="karte-text">
                  <span className="ar" dir="rtl" lang="ar">{x.titel_ar}</span>
                  <b>{x.titel_de}</b>
                  <span>{x.status === 'entwurf' && <em className="tag">Entwurf</em>}{fort.gelesen[x.id] && <em className="tag ok">✓ gelesen</em>}</span>
                </span>
              </button>
            ))}
          </section>
        )
      })}
    </main>
  )
}
