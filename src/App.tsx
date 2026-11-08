import { useState } from 'react'
import { alleGeschichten, bereiche, sichtbar } from './data'
import { useSettings } from './settings'
import Reader from './components/Reader'
import CoverArt from './components/CoverArt'

export default function App() {
  const [s, set] = useSettings()
  const [id, setId] = useState<string | null>(null)
  const g = alleGeschichten.find((x) => x.id === id)
  if (g) return <Reader g={g} s={s} set={set} zurueck={() => setId(null)} />

  return (
    <main className="seite">
      <header className="kopf">
        <p className="ar logo" dir="rtl" lang="ar">طَرِيقُ الدِّينِ</p>
        <h1>Arabisch lernen mit den Geschichten des Islam</h1>
      </header>
      {bereiche.map((b) => {
        const liste = alleGeschichten.filter((x) => x.bereich === b.id && sichtbar(x))
        return (
          <section key={b.id} className="bereich">
            <h2><span className="ar" dir="rtl" lang="ar">{b.ar}</span> · {b.de}</h2>
            <p className="klein">{b.beschr}</p>
            {liste.length === 0 && <p className="leer">Noch keine geprüften Geschichten.</p>}
            {liste.map((x) => (
              <button key={x.id} className="karte" onClick={() => setId(x.id)}>
                <CoverArt motiv={x.bild_motiv} />
                <span>{x.titel_de}{x.status === 'entwurf' && <em className="tag">Entwurf</em>}</span>
              </button>
            ))}
          </section>
        )
      })}
    </main>
  )
}
