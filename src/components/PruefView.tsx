import { useEffect, useState } from 'react'
import { alleGeschichten, bereiche, ladeVoll } from '../data'
import type { Geschichte, Niveau } from '../types'

// Prüfansicht für fachkundige Personen: Checkliste je Geschichte -> Freigabe-Eintrag für content/pruefung.json.
// Nichts wird hier automatisch freigegeben; der Eintrag muss von der prüfenden Person auf GitHub eingefügt werden.
const PUNKTE = [
  ['quellen', 'Quellen und Seitenangaben stimmen'],
  ['inhalt', 'Inhalt entspricht den Quellen (nichts erfunden, keine Isra’iliyyat als Tatsache)'],
  ['harakat', 'Harakat korrekt'],
  ['uebersetzung', 'Deutsche Übersetzung korrekt'],
  ['zitate', 'Zitate (Ayat/Hadith/Athar) und Einstufungen korrekt'],
] as const
const KEY = 'tad-pruefung'
const EDIT = 'https://github.com/layounizinedine-lgtm/Tariquldeen/edit/main/content/pruefung.json'
type Stand = Record<string, { haken: Record<string, boolean>; bemerkung: string; niveaus: string[] }>

const lade = (): { name: string; stand: Stand } => { try { return JSON.parse(localStorage.getItem(KEY) ?? '') } catch { return { name: '', stand: {} } } }

export default function PruefView() {
  const [d, setD] = useState(lade)
  const [offen, setOffen] = useState<Geschichte | null>(null)
  const [kopiert, setKopiert] = useState('')
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch { /* optional */ } }, [d])
  const st = (id: string) => d.stand[id] ?? { haken: {}, bemerkung: '', niveaus: [] }
  const setSt = (id: string, p: Partial<Stand[string]>) => setD((x) => ({ ...x, stand: { ...x.stand, [id]: { ...st(id), ...p } } }))
  const fertig = (id: string) => PUNKTE.every(([k]) => st(id).haken[k]) && st(id).niveaus.length > 0 && d.name.trim()

  const eintrag = (g: Geschichte) => {
    const s = st(g.id)
    return `"${g.id}": ${JSON.stringify({ pruefer: d.name.trim(), datum: new Date().toISOString().slice(0, 10), niveaus: s.niveaus as Niveau[], bemerkung: s.bemerkung || undefined })}`
  }

  return (
    <main className="seite admin">
      <a className="link" href="#/">← Zur App</a>
      <h1>Inhalte prüfen</h1>
      <p className="klein">Für fachkundige Personen. Hake erst ab, wenn du den Punkt selbst anhand der Quellen geprüft hast. Am Ende entsteht ein Freigabe-Eintrag, den du auf GitHub in <code>content/pruefung.json</code> unter <code>"freigaben"</code> einfügst. Nach dem Speichern dort erscheint die Geschichte automatisch als „geprüft“.</p>
      <label className="feld">Dein Name (erscheint als Prüfer)<input value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} /></label>

      {bereiche.map((b) => (
        <section key={b.id}>
          <h2>{b.de}</h2>
          {alleGeschichten.filter((g) => g.bereich === b.id).map((g) => (
            <div key={g.id} className="satzedit">
              <div className="satzkopf">
                <button className="link" onClick={async () => setOffen(offen?.id === g.id ? null : await ladeVoll(g))}><b>{g.titel_de}</b></button>
                <em className={`tag${g.status === 'geprüft' ? ' ok' : ''}`}>{g.status === 'geprüft' ? 'geprüft' : fertig(g.id) ? 'bereit' : 'offen'}</em>
              </div>
              {offen?.id === g.id && (
                <>
                  <a className="link" href={`#/g/${g.id}?entwurf=1`} onClick={() => { location.href = `?entwurf=1#/g/${g.id}` }}>Geschichte lesen ›</a>
                  {g.status === 'geprüft' && g.pruefung && <p className="klein">Bereits geprüft von {g.pruefung.pruefer} am {g.pruefung.datum}.</p>}
                  {PUNKTE.map(([k, t]) => (
                    <label key={k} className="check"><input type="checkbox" checked={!!st(g.id).haken[k]} onChange={(e) => setSt(g.id, { haken: { ...st(g.id).haken, [k]: e.target.checked } })} /> {t}</label>
                  ))}
                  <p className="klein">Geprüfte Fassungen:</p>
                  <div className="niveaus">
                    {Object.keys(offen.fassungen).map((n) => {
                      const an = st(g.id).niveaus.includes(n)
                      return <button key={n} className={an ? 'on' : ''} onClick={() => setSt(g.id, { niveaus: an ? st(g.id).niveaus.filter((x) => x !== n) : [...st(g.id).niveaus, n] })}>{n}</button>
                    })}
                  </div>
                  <label className="feld">Bemerkung (optional)<textarea value={st(g.id).bemerkung} onChange={(e) => setSt(g.id, { bemerkung: e.target.value })} /></label>
                  {fertig(g.id) ? (
                    <>
                      <textarea className="code" readOnly rows={3} value={eintrag(g)} />
                      <div className="ws-knoepfe">
                        <button className="gold" onClick={() => navigator.clipboard?.writeText(eintrag(g)).then(() => setKopiert(g.id))}>{kopiert === g.id ? '✓ Kopiert' : 'Eintrag kopieren'}</button>
                        <a className="gross-btn" href={EDIT} target="_blank" rel="noreferrer">Auf GitHub einfügen ›</a>
                      </div>
                    </>
                  ) : <p className="klein">Für die Freigabe: Name, alle Punkte und mindestens eine Fassung.</p>}
                </>
              )}
            </div>
          ))}
        </section>
      ))}
    </main>
  )
}
