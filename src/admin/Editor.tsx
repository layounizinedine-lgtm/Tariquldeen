import { useState } from 'react'
import type { Fassung, Geschichte, Niveau, Quelle, Satz, VerstaendnisFrage } from '../types'
import { hochladen, loescheFassung, speichereFassung, speichereGeschichte, speichereQuiz } from '../db'
import { ohneHarakat } from '../settings'

const NIVEAUS: Niveau[] = ['klassisch', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const BEREICHE = ['anbiya', 'sahaba', 'tabiin', 'aimma', 'ahmad'] as const
const toks = (t: string) => t.trim().split(/\s+/).filter(Boolean)

export default function Editor({ start, rolle, zurueck }: { start: Geschichte; rolle: string; zurueck: () => void }) {
  const [angelegt, setAngelegt] = useState(!!start.id)
  const neu = !angelegt
  const [g, setG] = useState<Geschichte>(start)
  const [niveau, setNiveau] = useState<Niveau>(Object.keys(start.fassungen)[0] as Niveau ?? 'A2')
  const [zitateText, setZitateText] = useState(JSON.stringify(start.zitate, null, 1))
  const [msg, setMsg] = useState('')
  const darf = rolle === 'admin' || rolle === 'pruefer'
  const f = g.fassungen[niveau]
  const patch = (p: Partial<Geschichte>) => setG((x) => ({ ...x, ...p }))
  const setF = (p: Partial<Fassung>) => setG((x) => ({ ...x, fassungen: { ...x.fassungen, [niveau]: { ...(x.fassungen[niveau] as Fassung), ...p } } }))
  const run = async (fn: () => Promise<void>, ok: string) => { try { await fn(); setMsg('✓ ' + ok) } catch (e) { setMsg('✗ ' + (e as Error).message) } }

  const speichereKopf = (status: 'entwurf' | 'geprüft') => run(async () => {
    if (!/^[a-z0-9-]+$/.test(g.id)) throw new Error('ID: nur a–z, 0–9 und Bindestrich')
    let zitate = g.zitate
    try { zitate = JSON.parse(zitateText) } catch { throw new Error('Zitate: kein gültiges JSON') }
    if (status === 'geprüft' && g.quellen.some((q) => q.platzhalter || !q.werk || !q.stelle)) throw new Error('Freigabe nicht möglich: Quellen unvollständig oder noch Platzhalter')
    const neuG = { ...g, zitate, status }
    await speichereGeschichte(neuG); setG(neuG); setAngelegt(true)
  }, status === 'geprüft' ? 'Geschichte freigegeben' : 'Gespeichert (Entwurf)')

  const speichereF = (status: 'entwurf' | 'geprüft') => run(async () => {
    if (!f) return
    for (const s of f.saetze) if (s.woerter && s.woerter.length !== toks(s.text_ar_mit_harakat).length)
      throw new Error(`Satz ${s.id}: Wortdaten (${s.woerter.length}) passen nicht zur Wortzahl (${toks(s.text_ar_mit_harakat).length})`)
    if (status === 'geprüft' && f.audio_platzhalter) throw new Error('Freigabe nicht möglich: Audio ist noch Platzhalter')
    await speichereFassung(g.id, niveau, { ...f, status }); setF({ status })
  }, status === 'geprüft' ? 'Fassung freigegeben' : 'Fassung gespeichert')

  const satz = (i: number, p: Partial<Satz>) => setF({ saetze: f!.saetze.map((s, n) => (n === i ? { ...s, ...p } : s)) })
  const verschiebe = (i: number, d: number) => { const a = [...f!.saetze], j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setF({ saetze: a }) }

  return (
    <main className="seite admin">
      <button className="link" onClick={zurueck}>← Zur Liste</button>
      <h1>{neu ? 'Neue Geschichte' : g.titel_de}</h1>
      <p>Status: <em className={`tag${g.status === 'geprüft' ? ' ok' : ''}`}>{g.status}</em></p>
      {msg && <p className="hinweis" role="status">{msg}</p>}

      <h2>Stammdaten</h2>
      <label className="feld">ID (Slug)<input value={g.id} disabled={!neu} onChange={(e) => patch({ id: e.target.value })} placeholder="z. B. nuh" /></label>
      <label className="feld">Bereich<select value={g.bereich} onChange={(e) => patch({ bereich: e.target.value as Geschichte['bereich'] })}>{BEREICHE.map((b) => <option key={b}>{b}</option>)}</select></label>
      <label className="feld">Titel (arabisch, mit Harakat)<input dir="rtl" className="ar" value={g.titel_ar} onChange={(e) => patch({ titel_ar: e.target.value })} /></label>
      <label className="feld">Titel (deutsch)<input value={g.titel_de} onChange={(e) => patch({ titel_de: e.target.value })} /></label>
      <label className="feld">Bildmotiv (kurz, ohne Lebewesen)<input value={g.bild_motiv} onChange={(e) => patch({ bild_motiv: e.target.value })} placeholder="z. B. Schiff auf Wellen" /></label>
      <label className="feld">Titelbild hochladen<input type="file" accept="image/webp,image/png,image/jpeg" disabled={!g.id}
        onChange={(e) => { const file = e.target.files?.[0]; if (file) run(async () => patch({ bild_url: await hochladen('bilder', `${g.id}/titel-${Date.now()}.${file.name.split('.').pop()}`, file) }), 'Bild hochgeladen (noch speichern)') }} /></label>
      {g.bild_url && <img src={g.bild_url} alt="" style={{ width: '100%', borderRadius: 12 }} />}
      <label className="feld">Hinweis (z. B. Meinungsverschiedenheiten)<textarea value={g.hinweis ?? ''} onChange={(e) => patch({ hinweis: e.target.value })} /></label>

      <h2>Quellen</h2>
      {g.quellen.map((q, i) => (
        <div key={i} className="quellzeile">
          <input placeholder="Werk" value={q.werk} onChange={(e) => patch({ quellen: g.quellen.map((x, n) => n === i ? { ...x, werk: e.target.value } : x) })} />
          <input placeholder="Band/Seite oder Hadith-Nr." value={q.stelle} onChange={(e) => patch({ quellen: g.quellen.map((x, n) => n === i ? { ...x, stelle: e.target.value } : x) })} />
          <select value={q.einstufung ?? ''} onChange={(e) => patch({ quellen: g.quellen.map((x, n) => n === i ? { ...x, einstufung: (e.target.value || undefined) as Quelle['einstufung'] } : x) })}>
            <option value="">Einstufung –</option><option value="sahih">sahih</option><option value="hasan">hasan</option><option value="daif">da'if</option></select>
          <label className="check"><input type="checkbox" checked={!!q.platzhalter} onChange={(e) => patch({ quellen: g.quellen.map((x, n) => n === i ? { ...x, platzhalter: e.target.checked } : x) })} /> Platzhalter</label>
          <button className="link" onClick={() => patch({ quellen: g.quellen.filter((_, n) => n !== i) })}>✕</button>
        </div>
      ))}
      <button className="link" onClick={() => patch({ quellen: [...g.quellen, { werk: '', stelle: '' }] })}>+ Quelle</button>

      <h2>Zitate (Ayat/Hadith/Athar) – JSON</h2>
      <p className="klein">Quran-Text nur aus geprüfter Quelle einfügen (Tanzil/Quran.com), nie selbst tippen. Hadith-Einstufung angeben.</p>
      <textarea className="code" rows={8} value={zitateText} onChange={(e) => setZitateText(e.target.value)} />

      <div className="ws-knoepfe">
        <button className="gross-btn" disabled={!g.id} onClick={() => speichereKopf('entwurf')}>Speichern (Entwurf)</button>
        {darf && <button className="gold gross-btn" disabled={!g.id} onClick={() => speichereKopf('geprüft')}>Als geprüft freigeben</button>}
      </div>
      {!darf && <p className="klein">Freigabe nur für admin/pruefer. Änderungen an geprüften Inhalten setzen sie automatisch zurück auf „entwurf“.</p>}

      {!neu && (<>
        <h2>Fassungen</h2>
        <div className="niveaus">{NIVEAUS.map((n) => <button key={n} className={n === niveau ? 'on' : ''} onClick={() => setNiveau(n)}>{n}{g.fassungen[n] ? ' ●' : ''}</button>)}</div>
        {!f && <button className="gross-btn" onClick={() => setF({ status: 'entwurf', saetze: [], hinweis: n_hinweis(niveau) })}>Fassung {niveau} anlegen</button>}
        {f && (<>
          <p>Fassung-Status: <em className={`tag${f.status === 'geprüft' ? ' ok' : ''}`}>{f.status}</em></p>
          <label className="feld">Hinweis zur Fassung<input value={f.hinweis ?? ''} onChange={(e) => setF({ hinweis: e.target.value })} /></label>
          <label className="check"><input type="checkbox" checked={!!f.audio_platzhalter} onChange={(e) => setF({ audio_platzhalter: e.target.checked })} /> Audio ist nur Platzhalter</label>
          <label className="feld">Schluss-Zitate (IDs, Komma-getrennt)<input value={(f.schluss_zitate ?? []).join(', ')} onChange={(e) => setF({ schluss_zitate: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} /></label>

          {f.saetze.map((s, i) => (
            <div key={i} className="satzedit">
              <div className="satzkopf"><input className="id" value={s.id} onChange={(e) => satz(i, { id: e.target.value })} aria-label="Satz-ID" />
                <span><button className="link" onClick={() => verschiebe(i, -1)}>↑</button><button className="link" onClick={() => verschiebe(i, 1)}>↓</button>
                  <button className="link" onClick={() => setF({ saetze: f.saetze.filter((_, n) => n !== i) })}>✕</button></span></div>
              <textarea dir="rtl" lang="ar" className="ar ar-edit" rows={2} value={s.text_ar_mit_harakat} onChange={(e) => satz(i, { text_ar_mit_harakat: e.target.value })} aria-label="Arabisch mit Harakat" />
              <p className="klein">{toks(s.text_ar_mit_harakat).length} Wörter · ohne Harakat: <span className="ar" dir="rtl">{ohneHarakat(s.text_ar_mit_harakat)}</span></p>
              <textarea rows={2} value={s.text_de} onChange={(e) => satz(i, { text_de: e.target.value })} aria-label="Deutsch" />
              <label className="feld">Zitat-ID (Satz ist Originalzitat)<input value={s.zitat_id ?? ''} onChange={(e) => satz(i, { zitat_id: e.target.value || undefined })} /></label>
              <label className="feld">Zitat-Kasten danach (ID)<input value={s.zitat_nach ?? ''} onChange={(e) => satz(i, { zitat_nach: e.target.value || undefined })} /></label>
              <label className="feld">Audio {s.audio_url ? '✓' : '–'}<input type="file" accept="audio/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) run(async () => satz(i, { audio_url: await hochladen('audio', `${g.id}/${niveau}/${s.id}.${file.name.split('.').pop()}`, file) }), 'Audio hochgeladen (noch speichern)') }} /></label>
              <details><summary>Wortdaten &amp; Zeitstempel (JSON)</summary>
                <textarea className="code" rows={6} defaultValue={JSON.stringify({ woerter: s.woerter ?? [], wort_zeitstempel: s.wort_zeitstempel ?? [] }, null, 1)}
                  onBlur={(e) => { try { const j = JSON.parse(e.target.value); satz(i, { woerter: j.woerter?.length ? j.woerter : undefined, wort_zeitstempel: j.wort_zeitstempel?.length ? j.wort_zeitstempel : undefined }); setMsg('✓ Wortdaten übernommen') } catch { setMsg('✗ Wortdaten: kein gültiges JSON') } }} /></details>
            </div>
          ))}
          <button className="link" onClick={() => setF({ saetze: [...f.saetze, { id: `s${f.saetze.length + 1}`, text_ar_mit_harakat: '', text_de: '' }] })}>+ Satz</button>

          <details><summary>Export / Import für die Audio-Erzeugung (GPU)</summary>
            <button className="link" onClick={() => download(`${g.id}-${niveau}-saetze.json`, f.saetze.map((s) => ({ id: s.id, ar: s.text_ar_mit_harakat, de: s.text_de })))}>Sätze als JSON exportieren (für tools/tts)</button>
            <p className="klein">Ergebnis von <code>generate_audio.py</code> (id → audio_url, wort_zeitstempel) hier einfügen:</p>
            <textarea className="code" rows={4} onBlur={(e) => { if (!e.target.value.trim()) return; try { const m = JSON.parse(e.target.value); setF({ saetze: f.saetze.map((s) => (m[s.id] ? { ...s, ...m[s.id] } : s)) }); setMsg('✓ Audio-Metadaten übernommen') } catch { setMsg('✗ Kein gültiges JSON') } }} /></details>

          <div className="ws-knoepfe">
            <button className="gross-btn" onClick={() => speichereF('entwurf')}>Fassung speichern (Entwurf)</button>
            {darf && <button className="gold gross-btn" onClick={() => speichereF('geprüft')}>Fassung freigeben</button>}
            {darf && <button className="gross-btn" onClick={() => confirm(`Fassung ${niveau} wirklich löschen?`) && run(async () => { await loescheFassung(g.id, niveau); setG((x) => { const fa = { ...x.fassungen }; delete fa[niveau]; return { ...x, fassungen: fa } }) }, 'Fassung gelöscht')}>Löschen</button>}
          </div>

          <h2>Verständnisfragen ({niveau})</h2>
          {(g.quiz?.[niveau] ?? []).map((q, i) => (
            <div key={i} className="satzedit">
              <input placeholder="Frage" value={q.frage} onChange={(e) => qs(i, { frage: e.target.value })} />
              <select value={q.satz} onChange={(e) => qs(i, { satz: e.target.value })}>{f.saetze.map((s) => <option key={s.id}>{s.id}</option>)}</select>
              {q.optionen.map((o, n) => (
                <label key={n} className="quellzeile"><input type="radio" checked={q.richtig === n} onChange={() => qs(i, { richtig: n })} />
                  <input value={o} onChange={(e) => qs(i, { optionen: q.optionen.map((x, m) => (m === n ? e.target.value : x)) })} /></label>))}
              <button className="link" onClick={() => setG((x) => ({ ...x, quiz: { ...x.quiz, [niveau]: x.quiz![niveau]!.filter((_, n) => n !== i) } }))}>✕ Frage löschen</button>
            </div>
          ))}
          <button className="link" onClick={() => setG((x) => ({ ...x, quiz: { ...x.quiz, [niveau]: [...(x.quiz?.[niveau] ?? []), { satz: f.saetze[0]?.id ?? '', frage: '', optionen: ['', '', '', ''], richtig: 0 }] } }))}>+ Frage</button>
          <button className="gross-btn" onClick={() => run(() => speichereQuiz(g.id, niveau, g.quiz?.[niveau] ?? [], 'entwurf'), 'Quiz gespeichert (Entwurf)')}>Quiz speichern</button>
          {darf && <button className="gold gross-btn" onClick={() => run(() => speichereQuiz(g.id, niveau, g.quiz?.[niveau] ?? [], 'geprüft'), 'Quiz freigegeben')}>Quiz freigeben</button>}
        </>)}
      </>)}
    </main>
  )

  function qs(i: number, p: Partial<VerstaendnisFrage>) {
    setG((x) => ({ ...x, quiz: { ...x.quiz, [niveau]: x.quiz![niveau]!.map((q, n) => (n === i ? { ...q, ...p } : q)) } }))
  }
}

const n_hinweis = (n: Niveau) => (n === 'klassisch' ? 'Klassisch = Originalwortlaut der Überlieferung.' : `Vereinfachte Nacherzählung (${n}).`)
function download(name: string, data: unknown) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })); a.download = name; a.click()
}
