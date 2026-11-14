import { useEffect, useMemo, useState } from 'react'
import { usePlayer, type Spur } from '../usePlayer'
import PlayerBar from './PlayerBar'
import WordSheet from './WordSheet'
import QuizView from './QuizView'
import { quizVerfuegbar } from '../quiz'
import { markiereGelesen, useFortschritt } from '../progress'
import { hatKarte, hinzufuegen, entfernen, kartenId, useVokabeln } from '../vocab'
import type { Geschichte, Niveau, Wort, Zitat } from '../types'
import type { Settings } from '../settings'
import ArText from './WordText'
import CoverArt from './CoverArt'
import SettingsBar from './SettingsBar'

interface Item extends Spur { beleg?: string; woerter?: Wort[]; kind: 'satz' | 'zitat'; ar: string; de: string; zitat?: Zitat }
const kurz = (t: string) => t.replace(/ (عَلَيْهِ السَّلَامُ|رَضِيَ اللَّهُ عَنْهُ|رَضِيَ اللَّهُ عَنْهَا|رَحِمَهُ اللَّهُ)$/, '')
const NIVEAUS: Niveau[] = ['klassisch', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
type Tab = 'text' | 'vokabeln' | 'quiz'

function ZitatBox({ z, s, aktiv, wort }: { z: Zitat; s: Settings; aktiv?: boolean; wort?: number }) {
  const label = { ayah: 'Ayah', hadith: 'Hadith', athar: 'Athar' }[z.typ]
  return (
    <aside className={`zitat${aktiv ? ' aktiv' : ''}`}>
      <div className="zitat-kopf"><span className="zitat-typ">❖ {label}</span><span>{z.quelle.split(' (')[0]}</span></div>
      <ArText text={z.text_ar} s={s} words={z.wort_zeitstempel ? { aktiv: aktiv ? (wort ?? -1) : -1 } : undefined} />
      {s.uebersetzung !== 'aus' && <p className="de">{z.text_de}</p>}
      {s.uebersetzung !== 'aus' && z.text_en && <p className="de en" lang="en">EN: {z.text_en}</p>}
      {z.einstufung && <p className="klein">Einstufung: {z.einstufung}</p>}
      {z.hinweis && <p className="hinweis">Hinweis: {z.hinweis}</p>}
      {z.qari && <p className="klein">Rezitation: {z.qari}</p>}
    </aside>
  )
}

export default function Reader(props: { g: Geschichte; s: Settings; set: (p: Partial<Settings>) => void; zurueck: () => void }) {
  const { g, zurueck } = props
  if (Object.keys(g.fassungen).length) return <ReaderInner {...props} />
  return (
    <main className="seite">
      <button className="link" onClick={zurueck}>← Zurück</button>
      <div className="hero"><CoverArt motiv={g.bild_motiv} url={g.bild_url} />
        <div className="hero-text"><span className="ar" dir="rtl" lang="ar" style={{ fontSize: g.titel_ar.length > 24 ? "1.5rem" : undefined }}>{g.titel_ar}</span><small>{g.titel_de}</small></div></div>
      <p className="banner">Gerüst – Inhalt in Vorbereitung</p>
      <p>Für diese Geschichte gibt es noch keinen geprüften Text. Es werden keine Inhalte ohne belegte Quelle ergänzt.</p>
      {g.hinweis && <p className="hinweis">{g.hinweis}</p>}
      <h2>Vorgesehene Quellen</h2>
      <ul>{g.quellen.map((q, i) => <li key={i} className={q.platzhalter ? 'platzhalter' : ''}><strong>{q.werk}</strong> – {q.stelle}</li>)}</ul>
    </main>
  )
}

function ReaderInner({ g, s, set, zurueck }: {
  g: Geschichte; s: Settings; set: (p: Partial<Settings>) => void; zurueck: () => void
}) {
  const verfuegbar = NIVEAUS.filter((n) => g.fassungen[n])
  const [niveau, setNiveau] = useState<Niveau>((['A2', 'B1', 'A1', 'B2'] as Niveau[]).find((n) => verfuegbar.includes(n)) ?? verfuegbar[0])
  const [tab, setTab] = useState<Tab>('text')
  const [einst, setEinst] = useState(false)
  const [offen, setOffen] = useState<Set<string>>(new Set())
  const f = g.fassungen[niveau]!
  const toggle = (id: string) => setOffen((o) => { const n = new Set(o); n.has(id) ? n.delete(id) : n.add(id); return n })

  // Flache Abspielliste: Sätze, Zitate und Schlusszitate in Lesereihenfolge
  const items = useMemo<Item[]>(() => {
    const zi = (z: Zitat): Item => ({ id: z.id, kind: 'zitat', ar: z.text_ar, de: z.text_de, zitat: z, audio_url: z.rezitation_url, ts: z.wort_zeitstempel })
    const out: Item[] = []
    for (const sa of f.saetze) {
      const z = sa.zitat_id ? g.zitate[sa.zitat_id] : undefined
      if (z) out.push(zi(z))
      else out.push({ id: sa.id, kind: 'satz', ar: sa.text_ar_mit_harakat, de: sa.text_de, audio_url: sa.audio_url, ts: sa.wort_zeitstempel, woerter: sa.woerter, beleg: sa.beleg })
      if (sa.zitat_nach) out.push(zi(g.zitate[sa.zitat_nach]))
    }
    f.schluss_zitate?.forEach((id) => out.push(zi(g.zitate[id])))
    return out
  }, [f, g])

  const [tip, setTip] = useState<{ item: Item; i: number; x: number; y: number } | null>(null)
  const [wahl, setWahl] = useState<{ item: Item; i: number } | null>(null)
  const [quiz, setQuiz] = useState(false)
  const fort = useFortschritt()
  const karten = useVokabeln()
  const p = usePlayer(items)
  useEffect(() => { p.stop(); setTip(null) }, [niveau, tab]) // eslint-disable-line react-hooks/exhaustive-deps
  const aktivId = p.index >= 0 ? items[p.index]?.id : undefined
  useEffect(() => {
    if (aktivId) document.getElementById(`item-${aktivId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [aktivId])
  // Aktives Wort immer im sichtbaren Bereich halten (zwischen Kopfleiste und Player)
  useEffect(() => {
    if (!aktivId || p.wort < 0) return
    const el = document.getElementById(`item-${aktivId}`)?.querySelector<HTMLElement>(`[data-w="${p.wort}"]`)
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < 170 || r.bottom > window.innerHeight - 200) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [aktivId, p.wort])

  const vokabeln = useMemo(() => {
    const alle = f.saetze.flatMap((x) => x.woerter ?? []).filter((w) => w.wortart !== 'Eigenname')
    return [...new Map(alle.map((w) => [kartenId(w), w])).values()]
  }, [f])

  if (quiz) return <QuizView g={g} niveau={niveau} zurueck={() => setQuiz(false)} />
  const tipWort = tip?.item.woerter?.[tip.i]
  const gelesen = !!fort.gelesen[g.id]
  const best = fort.quiz[`${g.id}|${niveau}`]

  return (
    <div className="reader" onClick={() => tip && setTip(null)}>
      <header className="kopfleiste">
        <button className="pillbtn" onClick={zurueck}>‹ Zurück</button>
        <div className="kopf-titel">
          <span className="ar" dir="rtl" lang="ar">{kurz(g.titel_ar)}</span>
          <small>{g.titel_de}</small>
        </div>
        <button className="pillbtn" onClick={() => setEinst(true)} aria-label="Anzeige-Einstellungen">Aa</button>
      </header>
      <nav className="tabs" role="tablist">
        {(['text', 'vokabeln', 'quiz'] as Tab[]).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {{ text: 'Text', vokabeln: 'Vokabeln', quiz: 'Quiz' }[t]}
          </button>
        ))}
      </nav>

      <main className="seite">
        <div className="hero">
          <CoverArt motiv={g.bild_motiv} url={g.bild_url} />
          <div className="hero-text">
            <span className="ar" dir="rtl" lang="ar" style={{ fontSize: g.titel_ar.length > 24 ? "1.5rem" : undefined }}>{g.titel_ar}</span>
            <small>{g.titel_de}</small>
          </div>
        </div>
        {g.status === 'entwurf' && <p className="banner">Entwurf – noch nicht von einer fachkundigen Person geprüft</p>}

        <div className="niveaus" role="group" aria-label="Lernniveau">
          {NIVEAUS.map((n) => (
            <button key={n} aria-pressed={n === niveau} disabled={!g.fassungen[n]} className={n === niveau ? 'on' : ''} onClick={() => setNiveau(n)}>
              {n === 'klassisch' ? 'Klassisch' : n}
            </button>
          ))}
        </div>

        {tab === 'text' && (
          <>
            <p className="klein hinweisleiste">
              {niveau !== 'klassisch' && !f.hinweis?.includes('Nacherzählung') ? 'Vereinfachte Nacherzählung · ' : ''}{f.hinweis}
              {f.audio_platzhalter && ' · Audio: Platzhalter-Töne ohne Stimme (Verse mit echter Rezitation).'}
            </p>
            <section className="text">
              {items.map((it, i) => (
                <div key={it.id} id={`item-${it.id}`} className="satz">
                  {it.zitat ? <ZitatBox z={it.zitat} s={s} aktiv={aktivId === it.id} wort={p.wort} /> : (
                    <div className={`satzbox${aktivId === it.id ? ' aktiv-satz' : ''}`}>
                      <ArText text={it.ar} s={s} words={it.ts || it.woerter ? {
                        aktiv: aktivId === it.id ? p.wort : -1, tippbar: it.woerter?.map(Boolean),
                        onTap: (n, el) => {
                          const r = el.getBoundingClientRect()
                          setTip({ item: it, i: n, x: Math.min(Math.max(r.left + r.width / 2, 90), window.innerWidth - 90), y: r.top })
                        },
                      } : undefined} />
                      {s.uebersetzung === 'immer' && <p className="de">{it.de}</p>}
                      {it.beleg && <p className="beleg">Beleg: {it.beleg}</p>}
                      {s.uebersetzung === 'tippen' && (
                        <>
                          <button className="link" onClick={(e) => { e.stopPropagation(); toggle(it.id) }}>
                            {offen.has(it.id) ? 'Übersetzung ausblenden' : 'Übersetzung zeigen'}
                          </button>
                          {offen.has(it.id) && <p className="de">{it.de}</p>}
                        </>
                      )}
                    </div>
                  )}
                  {it.audio_url && <button className="playpunkt" onClick={() => p.play(i)} aria-label="Ab hier abspielen">▶</button>}
                </div>
              ))}
              {f.schluss_zitate?.length ? <p className="klein">Passender Vers zur Geschichte</p> : null}
              {f.schluss_zitate?.map((id) => <ZitatBox key={id} z={g.zitate[id]} s={s} />)}
            </section>
            {items.some((x) => x.woerter) && <p className="klein mitte">Tippe auf ein Wort für die Bedeutung.</p>}
            <section className="abschluss">
              <button className="gross-btn" onClick={() => markiereGelesen(g.id)} disabled={gelesen}>
                {gelesen ? '✓ Als gelesen gespeichert' : 'Als gelesen markieren'}
              </button>
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
          </>
        )}

        {tab === 'vokabeln' && (
          <section>
            {vokabeln.length === 0 && <p className="leer">Für dieses Niveau gibt es noch keine Wortdaten.</p>}
            <p className="klein">Wortdaten sind Entwurf und noch nicht fachlich geprüft.</p>
            <ul className="vokliste breit">
              {vokabeln.map((w) => {
                const drin = hatKarte(karten, w)
                return (
                  <li key={kartenId(w)}>
                    <span className="ar" dir="rtl" lang="ar" style={{ fontSize: 28 }}>{w.grundform}</span>
                    <span className="vok-de">{w.bedeutung_grund}<small>{w.wurzel !== '–' ? `Wurzel ${w.wurzel}` : w.wortart}</small></span>
                    <button className={`rund${drin ? ' on' : ''}`} aria-label={drin ? 'Aus Vokabeln entfernen' : 'Zu Vokabeln'}
                      onClick={() => (drin ? entfernen(kartenId(w)) : hinzufuegen(w, g.id))}>{drin ? '✓' : '+'}</button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {tab === 'quiz' && (
          <section className="lernkarte links">
            <h2>Teste dein Verständnis</h2>
            {quizVerfuegbar(g, niveau)
              ? <>
                  <p className="klein">Verständnis, Vokabeln, Lückentext und Grammatik zu „{g.titel_de}“ ({niveau}).</p>
                  {best && <p>Bestes Ergebnis: <strong>{best.beste} %</strong> · {best.versuche}× versucht</p>}
                  <button className="gold gross-btn" onClick={() => setQuiz(true)}>Quiz starten</button>
                </>
              : <p className="klein">Für dieses Niveau gibt es noch kein Quiz.</p>}
          </section>
        )}
      </main>

      {tip && tipWort && (
        <div className="bubble" style={{ left: tip.x, top: tip.y }} onClick={(e) => e.stopPropagation()}>
          <strong>{tipWort.bedeutung_grund}</strong>
          <small>{tipWort.bedeutung_kontext}</small>
          <button onClick={() => { setWahl({ item: tip.item, i: tip.i }); setTip(null) }}>Details ›</button>
        </div>
      )}
      {wahl?.item.woerter && (
        <WordSheet wort={wahl.item.woerter[wahl.i]} geschichte={g.id} zu={() => setWahl(null)}
          ts={wahl.item.ts?.find((t) => t.wort_index === wahl.i)} audioUrl={wahl.item.audio_url} />
      )}
      {einst && (
        <div className="sheet-bg" onClick={() => setEinst(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-zu" onClick={() => setEinst(false)} aria-label="Schließen">✕</button>
            <SettingsBar s={s} set={set} />
          </div>
        </div>
      )}
      <PlayerBar p={p} anzahl={items.length} ausblenden={tab !== 'text'} />
    </div>
  )
}
