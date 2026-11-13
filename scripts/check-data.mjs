// Prüft: Wort-Einträge passen 1:1 zu den Wörtern der Sätze (gleiche Anzahl + gleicher Text).
import { readFileSync } from 'node:fs'
const saetze = JSON.parse(readFileSync('src/data/yusuf-saetze-a2.json', 'utf8'))
const woerter = JSON.parse(readFileSync('src/data/yusuf-woerter-a2.json', 'utf8'))
let fehler = 0
for (const s of saetze) {
  const tok = s.ar.split(/\s+/), w = woerter[s.id] ?? []
  if (tok.length !== w.length) { console.error(`${s.id}: ${tok.length} Wörter im Satz, ${w.length} Einträge`); fehler++; continue }
  tok.forEach((t, i) => { if (t !== w[i].text) { console.error(`${s.id}[${i}]: "${t}" ≠ "${w[i].text}"`); fehler++ } })
}
// Nacherzählungen: jeder Satz braucht einen Beleg, und jeder belegte Vers muss in der Klassisch-Fassung der Geschichte stehen
import { existsSync } from 'node:fs'
if (existsSync('content/nacherzaehlungen.json')) {
  const nach = JSON.parse(readFileSync('content/nacherzaehlungen.json', 'utf8'))
  for (const [id, nz] of Object.entries(nach)) {
    const g = JSON.parse(readFileSync(`src/data/geschichten/${id}.json`, 'utf8'))
    for (const [i, x] of nz.saetze.entries()) {
      if (!x.beleg) { console.error(`${id}[${i}]: Beleg fehlt`); fehler++; continue }
      for (const teil of x.beleg.replace('Quran ', '').split(';')) {
        const [sure, rest] = teil.trim().split(':'), [a, b] = rest.split('-').map(Number)
        for (let v = a; v <= (b ?? a); v++) if (!g.zitate[`q-${sure}:${v}`]) { console.error(`${id}[${i}]: Vers ${sure}:${v} nicht in der Auswahl`); fehler++ }
      }
    }
  }
}
console.log(fehler ? `${fehler} Fehler` : 'Wortdaten OK')
process.exit(fehler ? 1 : 0)
