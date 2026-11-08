import { useEffect, useState } from 'react'
import { supabase, ladeAlle, meineRolle, speichereGeschichte, speichereFassung, speichereQuiz } from '../db'
import { yusuf } from '../data/yusuf'
import type { Geschichte, Niveau } from '../types'
import Editor from './Editor'

export default function Admin() {
  const [sitzung, setSitzung] = useState<boolean | null>(null)
  const [rolle, setRolle] = useState<string | null>(null)
  const [liste, setListe] = useState<Geschichte[]>([])
  const [offen, setOffen] = useState<Geschichte | null>(null)
  const [meldung, setMeldung] = useState('')
  const laden = () => ladeAlle().then(setListe).catch((e) => setMeldung(e.message))

  useEffect(() => {
    if (!supabase) return
    const pruefe = async () => { const { data } = await supabase!.auth.getSession(); setSitzung(!!data.session); if (data.session) { setRolle(await meineRolle()); laden() } }
    pruefe()
    const { data: sub } = supabase.auth.onAuthStateChange(() => pruefe())
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!supabase) return (
    <main className="seite"><a className="link" href="#/">← Zur App</a><h1>Admin</h1>
      <p className="hinweis">Supabase ist nicht konfiguriert. Setze <code>VITE_SUPABASE_URL</code> und <code>VITE_SUPABASE_ANON_KEY</code> (siehe <code>.env.example</code> und <code>supabase/README.md</code>).</p></main>)
  if (sitzung === null) return <main className="seite"><p className="klein">Lade …</p></main>
  if (!sitzung) return <Login />
  if (!rolle) return (
    <main className="seite"><a className="link" href="#/">← Zur App</a><h1>Admin</h1>
      <p className="hinweis">Dein Konto hat keine Team-Rolle. Eine Rolle (admin, pruefer, editor) wird im Supabase-SQL-Editor vergeben, siehe <code>supabase/README.md</code>.</p>
      <button className="gross-btn" onClick={() => supabase!.auth.signOut()}>Abmelden</button></main>)

  if (offen) return <Editor start={offen} rolle={rolle} zurueck={() => { setOffen(null); laden() }} />
  const darf = rolle === 'admin' || rolle === 'pruefer'
  return (
    <main className="seite admin">
      <a className="link" href="#/">← Zur App</a>
      <h1>Inhalte verwalten</h1>
      <p className="klein">Angemeldet als <strong>{rolle}</strong>{darf ? ' – darf freigeben' : ' – darf Entwürfe bearbeiten, nicht freigeben'} · <button className="link" onClick={() => supabase!.auth.signOut()}>Abmelden</button></p>
      {meldung && <p className="hinweis">{meldung}</p>}
      <button className="gold gross-btn" onClick={() => setOffen({ id: '', bereich: 'anbiya', titel_ar: '', titel_de: '', bild_motiv: '', quellen: [], zitate: {}, fassungen: {}, quiz: {}, status: 'entwurf' })}>+ Neue Geschichte</button>
      <ul className="vokliste breit">
        {liste.map((g) => (
          <li key={g.id}><button className="link" onClick={() => setOffen(g)}><b>{g.titel_de}</b> <span className="ar" lang="ar" dir="rtl">{g.titel_ar}</span></button>
            <span><em className={`tag${g.status === 'geprüft' ? ' ok' : ''}`}>{g.status}</em><small>{Object.keys(g.fassungen).join(', ') || 'keine Fassung'}</small></span></li>
        ))}
      </ul>
      {liste.length === 0 && (
        <div className="lernkarte links"><p>Noch keine Inhalte in der Datenbank.</p>
          <button className="gross-btn" onClick={async () => {
            try {
              await speichereGeschichte({ ...yusuf, status: 'entwurf' })
              for (const [n, f] of Object.entries(yusuf.fassungen)) await speichereFassung(yusuf.id, n as Niveau, { ...f, status: 'entwurf' })
              for (const [n, q] of Object.entries(yusuf.quiz ?? {})) await speichereQuiz(yusuf.id, n as Niveau, q, 'entwurf')
              setMeldung('Yusuf als Entwurf importiert.'); laden()
            } catch (e) { setMeldung((e as Error).message) }
          }}>Beispiel „Yusuf“ als Entwurf importieren</button></div>)}
    </main>
  )
}

function Login() {
  const [mail, setMail] = useState(''), [pw, setPw] = useState(''), [fehler, setFehler] = useState('')
  const los = async () => { const r = await supabase!.auth.signInWithPassword({ email: mail, password: pw }); if (r.error) setFehler(r.error.message) }
  return (
    <main className="seite admin"><a className="link" href="#/">← Zur App</a><h1>Admin-Login</h1>
      <label className="feld">E-Mail<input type="email" value={mail} onChange={(e) => setMail(e.target.value)} autoComplete="username" /></label>
      <label className="feld">Passwort<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" onKeyDown={(e) => e.key === 'Enter' && los()} /></label>
      {fehler && <p className="hinweis">{fehler}</p>}
      <button className="gold gross-btn" onClick={los}>Anmelden</button></main>
  )
}
