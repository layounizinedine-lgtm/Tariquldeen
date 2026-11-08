import { useState } from 'react'
import type { Geschichte, Niveau, Zitat } from '../types'
import type { Settings } from '../settings'
import ArText from './WordText'
import CoverArt from './CoverArt'
import SettingsBar from './SettingsBar'

const NIVEAUS: Niveau[] = ['klassisch', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

function ZitatBox({ z, s }: { z: Zitat; s: Settings }) {
  const label = { ayah: 'Ayah', hadith: 'Hadith', athar: 'Athar' }[z.typ]
  return (
    <aside className="zitat">
      <div className="zitat-kopf"><span>{label}</span><span>{z.quelle}</span></div>
      <ArText text={z.text_ar} s={s} />
      {s.uebersetzung !== 'aus' && <p className="de">{z.text_de}</p>}
      {z.einstufung && <p className="klein">Einstufung: {z.einstufung}</p>}
      {z.hinweis && <p className="hinweis">Hinweis: {z.hinweis}</p>}
      {z.rezitation_url && (
        <audio controls preload="none" src={z.rezitation_url} aria-label={`Rezitation: ${z.qari}`} />
      )}
      {z.qari && <p className="klein">Rezitation: {z.qari}</p>}
    </aside>
  )
}

export default function Reader({ g, s, set, zurueck }: {
  g: Geschichte; s: Settings; set: (p: Partial<Settings>) => void; zurueck: () => void
}) {
  const verfuegbar = NIVEAUS.filter((n) => g.fassungen[n])
  const [niveau, setNiveau] = useState<Niveau>(verfuegbar.includes('A2') ? 'A2' : verfuegbar[0])
  const [offen, setOffen] = useState<Set<string>>(new Set())
  const f = g.fassungen[niveau]!
  const toggle = (id: string) => setOffen((o) => { const n = new Set(o); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <main className="seite">
      <button className="link" onClick={zurueck}>← Zurück</button>
      <CoverArt motiv={g.bild_motiv} />
      <h1>{g.titel_de}</h1>
      <p className="ar titel-ar" dir="rtl" lang="ar">{g.titel_ar}</p>
      {g.status === 'entwurf' && <p className="banner">Entwurf – noch nicht von einer fachkundigen Person geprüft</p>}

      <div className="niveaus" role="tablist" aria-label="Lernniveau">
        {NIVEAUS.map((n) => (
          <button key={n} role="tab" aria-selected={n === niveau} disabled={!g.fassungen[n]}
                  className={n === niveau ? 'on' : ''} onClick={() => setNiveau(n)}>
            {n === 'klassisch' ? 'Klassisch' : n}
          </button>
        ))}
      </div>
      {niveau !== 'klassisch' && <p className="klein">Vereinfachte Nacherzählung · Ayat bleiben im Originalwortlaut</p>}
      {f.hinweis && <p className="klein">{f.hinweis}</p>}

      <SettingsBar s={s} set={set} />

      <section>
        {f.saetze.map((sa) => {
          const z = sa.zitat_id ? g.zitate[sa.zitat_id] : undefined
          const nach = sa.zitat_nach ? g.zitate[sa.zitat_nach] : undefined
          return (
            <div key={sa.id} className="satz">
              {z ? <ZitatBox z={z} s={s} /> : (
                <>
                  <ArText text={sa.text_ar_mit_harakat} s={s} />
                  {s.uebersetzung === 'immer' && <p className="de">{sa.text_de}</p>}
                  {s.uebersetzung === 'tippen' && (
                    <>
                      <button className="link" onClick={() => toggle(sa.id)}>
                        {offen.has(sa.id) ? 'Übersetzung ausblenden' : 'Übersetzung zeigen'}
                      </button>
                      {offen.has(sa.id) && <p className="de">{sa.text_de}</p>}
                    </>
                  )}
                </>
              )}
              {nach && <ZitatBox z={nach} s={s} />}
            </div>
          )
        })}
        {f.schluss_zitate?.map((id) => <ZitatBox key={id} z={g.zitate[id]} s={s} />)}
      </section>

      <section className="quellen">
        <h2>Quellen</h2>
        <ul>
          {g.quellen.map((q, i) => (
            <li key={i} className={q.platzhalter ? 'platzhalter' : ''}>
              <strong>{q.werk}</strong> – {q.stelle}{q.einstufung ? ` (${q.einstufung})` : ''}
            </li>
          ))}
        </ul>
        {g.hinweis && <p className="hinweis">{g.hinweis}</p>}
      </section>
    </main>
  )
}
