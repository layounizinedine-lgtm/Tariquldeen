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
console.log(fehler ? `${fehler} Fehler` : 'Wortdaten OK')
process.exit(fehler ? 1 : 0)
