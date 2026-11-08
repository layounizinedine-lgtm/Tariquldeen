import { useEffect, useMemo, useState } from 'react'
import { usePlayer, type Spur } from '../usePlayer'
import PlayerBar from './PlayerBar'
import type { Geschichte, Niveau, Zitat } from '../types'
import type { Settings } from '../settings'
import ArText from './WordText'
import CoverArt from './CoverArt'
import SettingsBar from './SettingsBar'

interface Item extends Spur { kind: 'satz' | 'zitat'; ar: string; de: string; zitat?: Zitat }
const NIVEAUS: Niveau[] = ['klassisch', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

function ZitatBox({ z, s, aktiv }: { z: Zitat; s: Settings; aktiv?: boolean }) {
  const label = { ayah: 'Ayah', hadith: 'Hadith', athar: 'Athar' }[z.typ]
  return (
    <aside className={`zitat${aktiv ? ' aktiv' : ''}`}>
      <div className="zitat-kopf"><span>{label}</span><span>{z.quelle}</span></div>
      <ArText text={z.text_ar} s={s} />
      {s.uebersetzung !== 'aus' && <p className="de">{z.text_de}</p>}
      {z.einstufung && <p className="klein">Einstufung: {z.einstufung}</p>}
      {z.hinweis && <p className="hinweis">Hinweis: {z.hinweis}</p>}
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

  // Flache Abspielliste: Sätze, Zitate und Schlusszitate in Lesereihenfolge
  const items = useMemo<Item[]>(() => {
    const zi = (z: Zitat): Item => ({ id: z.id, kind: 'zitat', ar: z.text_ar, de: z.text_de, zitat: z, audio_url: z.rezitation_url })
    const out: Item[] = []
    for (const sa of f.saetze) {
      const z = sa.zitat_id ? g.zitate[sa.zitat_id] : undefined
      if (z) out.push(zi(z))
      else out.push({ id: sa.id, kind: 'satz', ar: sa.text_ar_mit_harakat, de: sa.text_de, audio_url: sa.audio_url, ts: sa.wort_zeitstempel })
      if (sa.zitat_nach) out.push(zi(g.zitate[sa.zitat_nach]))
    }
    f.schluss_zitate?.forEach((id) => out.push(zi(g.zitate[id])))
    return out
  }, [f, g])
  const p = usePlayer(items)
  useEffect(() => { p.stop() }, [niveau]) // eslint-disable-line react-hooks/exhaustive-deps
  const aktivId = p.index >= 0 ? items[p.index]?.id : undefined
  useEffect(() => {
    if (aktivId) document.getElementById(`item-${aktivId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [aktivId])

  return (
    <main className="seite">
      <button className="link" onClick={zurueck}>← Zurück</button>
      <CoverArt motiv={g.bild_motiv} url={g.bild_url} />
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

      {f.audio_platzhalter && <p className="hinweis">Platzhalter-Audio: Testtöne ohne Stimme, nur zum Testen von Tempo und Mitlesen. Verse werden mit echter Rezitation abgespielt.</p>}
      <section>
        {items.map((it, i) => (
          <div key={it.id} id={`item-${it.id}`} className="satz">
            {it.zitat ? <ZitatBox z={it.zitat} s={s} aktiv={aktivId === it.id} /> : (
              <div className={aktivId === it.id ? 'aktiv-satz' : ''}>
                <ArText text={it.ar} s={s} words={it.ts ? { aktiv: aktivId === it.id ? p.wort : -1, ts: it.ts } : undefined} />
                {s.uebersetzung === 'immer' && <p className="de">{it.de}</p>}
                {s.uebersetzung === 'tippen' && (
                  <>
                    <button className="link" onClick={() => toggle(it.id)}>
                      {offen.has(it.id) ? 'Übersetzung ausblenden' : 'Übersetzung zeigen'}
                    </button>
                    {offen.has(it.id) && <p className="de">{it.de}</p>}
                  </>
                )}
              </div>
            )}
            {it.audio_url && <button className="link" onClick={() => p.play(i)}>▶ ab hier abspielen</button>}
          </div>
        ))}
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
      <PlayerBar p={p} anzahl={items.length} />
    </main>
  )
}
