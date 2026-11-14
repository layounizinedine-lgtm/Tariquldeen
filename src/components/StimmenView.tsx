const P = import.meta.env.BASE_URL + 'stimmen/'
const PROBEN = [
  ['C_langsam', 'Original – langsam (deine erste Wahl)', 'Standardstimme, langsam. Zum Vergleich.'],
  ['D1_tief', 'D1 – etwas tiefer', 'Leicht dunkler und wärmer.'],
  ['D2_tiefer', 'D2 – tiefer (Vorschlag)', 'Deutlich dunkler, ruhig, älter wirkend.'],
  ['D3_alt', 'D3 – tief und alt', 'Am tiefsten, weich, wie ein älterer Erzähler.'],
]
export default function StimmenView() {
  return (
    <main className="seite">
      <a className="link" href="#/">← Zur App</a>
      <h1>Erzählerstimme – Hörproben</h1>
      <p className="klein">Erzeugt mit <strong>Chatterbox</strong> (Resemble AI, MIT-Lizenz, kostenlos), mit der mitgelieferten Standardstimme – keine nachgeahmte Person. Text: Nuh, drei Sätze. Alle vier sind langsam. D1–D3 sind dieselbe Stimme, nur tiefer und wärmer bearbeitet. Sag mir, welche Variante es sein soll.</p>
      {PROBEN.map(([f, t, b]) => (
        <div key={f} className="lernkarte links"><h2>{t}</h2><p className="klein">{b}</p><audio controls preload="none" src={`${P}${f}.mp3`} style={{ width: '100%' }} /></div>
      ))}
      <p className="hinweis">Die Probe-Stimme ist KI-erzeugt. Verse (Ayat) werden später nur mit echter Rezitation eines Qari abgespielt, nicht mit dieser Stimme.</p>
    </main>
  )
}
