import { useState } from 'react'
import { bereiche, sichtbar, ladeVoll } from './data'
import { useEffect } from 'react'
import { useGeschichten } from './store'
import { useSettings } from './settings'
import Reader from './components/Reader'
import CoverArt from './components/CoverArt'
import VocabView from './components/VocabView'
import { serie, useFortschritt } from './progress'
import { faellige, useVokabeln } from './vocab'

export default function App() {
  const [s, set] = useSettings()
  const ausHash = () => (location.hash.match(/^#\/g\/([\w-]+)/) ?? [])[1] ?? null
  const [id, setIdState] = useState<string | null>(ausHash)
  const setId = (x: string | null) => { setIdState(x); history.replaceState(null, '', x ? `#/g/${x}` : '#/') }
  useEffect(() => { const f = () => setIdState(ausHash()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  const [vok, setVok] = useState(false)
  const karten = useVokabeln()
  const fort = useFortschritt()
  const { liste: alleGeschichten, laedt, fehler } = useGeschichten()
  const stub = alleGeschichten.find((x) => x.id === id)
  const [g, setGanz] = useState<typeof stub>(undefined)
  useEffect(() => { setGanz(undefined); if (stub) ladeVoll(stub).then(setGanz) }, [id]) // eslint-disable-line react-hooks/exhaustive-deps
  if (vok) return <VocabView zurueck={() => setVok(false)} />
  if (stub && !g) return <main className="seite"><p className="klein mitte">Lade …</p></main>
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
      {laedt && <p className="klein mitte">Lade Geschichten …</p>}
      {fehler && <p className="hinweis">Offline oder Serverfehler – zeige gespeicherte Geschichten. ({fehler})</p>}
      <p className="hinweis">Alle Inhalte sind <strong>Entwürfe</strong> und noch nicht fachlich geprüft. Fehler bitte melden.</p>
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
              <button key={x.id} className="karte-klein" onClick={() => setId(x.id)}>
                <span className="mini"><CoverArt motiv={x.bild_motiv} url={x.bild_url} /></span>
                <span className="kk-text"><span className="ar" dir="rtl" lang="ar">{x.titel_ar}</span><b>{x.titel_de}</b>
                  <span>{x.hat_inhalt === false && <em className="tag">Gerüst</em>}{x.status === 'entwurf' && <em className="tag">Entwurf</em>}{fort.gelesen[x.id] && <em className="tag ok">✓ gelesen</em>}</span></span>
              </button>
            ))}
          </section>
        )
      })}
    </main>
  )
}
