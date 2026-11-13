import type { Fassung, Geschichte, Niveau, Wort } from './types'
import { kartenId } from './vocab'

export type FrageTyp = 'verstaendnis' | 'vokabel_ar_de' | 'vokabel_de_ar' | 'hoeren' | 'luecke' | 'grammatik'
export interface Frage {
  id: string; typ: FrageTyp; prompt: string; promptAr?: string; audio?: string
  optionen: string[]; optAr?: boolean; richtig: number; erklaerung?: string; wort?: Wort
}

const strip = (t: string) => t.replace(/[.,:؟!]+$/, '')
// Zufall mit Seed, damit ein Quizlauf stabil bleibt
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const mische = <T,>(a: T[], r: () => number) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const nimm = <T,>(a: T[], n: number, r: () => number) => mische(a, r).slice(0, n)

function frage(base: Omit<Frage, 'optionen' | 'richtig'>, richtig: string, falsche: string[], r: () => number): Frage | null {
  const f = [...new Set(falsche.filter((x) => x !== richtig))].slice(0, 3)
  if (f.length < 2) return null // zu wenig sinnvolle Ablenker
  const opt = mische([richtig, ...f], r)
  return { ...base, optionen: opt, richtig: opt.indexOf(richtig) }
}

export function quizVerfuegbar(g: Geschichte, n: Niveau) {
  const f = g.fassungen[n]
  return !!f && (!!g.quiz?.[n]?.length || f.saetze.some((s) => s.woerter))
}

export function baueQuiz(g: Geschichte, n: Niveau, seed = Date.now()): { fragen: Frage[]; hinweise: string[] } {
  const f = g.fassungen[n] as Fassung
  const r = rng(seed), out: Frage[] = [], hinweise: string[] = []
  const add = (x: Frage | null) => x && out.push(x)

  // 1) Verständnisfragen (von Hand, mit Beleg-Satz)
  {
    for (const v of g.quiz?.[n] ?? []) {
      const s = f.saetze.find((x) => x.id === v.satz)
      add({ id: `v-${v.satz}`, typ: 'verstaendnis', prompt: v.frage, optionen: v.optionen, richtig: v.richtig,
        erklaerung: s ? `Siehe Satz: ${s.text_de}` : undefined })
    }
  }
  const saetze = f.saetze.filter((s) => s.woerter)
  const alle = saetze.flatMap((s) => s.woerter!.map((w, i) => ({ w, s, i }))).filter((x) => x.w.wortart !== 'Eigenname')
  const eindeutig = [...new Map(alle.map((x) => [kartenId(x.w), x])).values()]

  // 2) Vokabeln
  nimm(eindeutig, 3, r).forEach(({ w }) => add(frage(
    { id: `ad-${kartenId(w)}`, typ: 'vokabel_ar_de', prompt: 'Was bedeutet dieses Wort?', promptAr: w.grundform, wort: w },
    w.bedeutung_grund, eindeutig.map((x) => x.w.bedeutung_grund).sort(() => r() - 0.5), r)))
  nimm(eindeutig, 2, r).forEach(({ w }) => add(frage(
    { id: `da-${kartenId(w)}`, typ: 'vokabel_de_ar', prompt: `Welches Wort bedeutet „${w.bedeutung_grund}“?`, optAr: true, wort: w },
    w.grundform, eindeutig.map((x) => x.w.grundform).sort(() => r() - 0.5), r)))

  // 3) Lückentext mit Harakat
  const luecken = alle.filter((x) => ['Nomen', 'Verb', 'Adjektiv'].includes(x.w.wortart) && x.s.text_ar_mit_harakat.split(/\s+/).length >= 3)
  nimm(luecken, 2, r).forEach(({ w, s, i }) => {
    const tok = s.text_ar_mit_harakat.split(/\s+/)
    const richtig = strip(tok[i]), punkt = tok[i].slice(richtig.length)
    tok[i] = '_____' + punkt
    add(frage({ id: `l-${s.id}-${i}`, typ: 'luecke', prompt: `Ergänze die Lücke: „${s.text_de}“`, promptAr: tok.join(' '), optAr: true, wort: w },
      richtig, alle.filter((x) => x.w.wortart === w.wortart).map((x) => strip(x.w.text)).sort(() => r() - 0.5), r))
  })

  // 4) Grammatik: Wurzel und Verbform
  const mitWurzel = eindeutig.filter((x) => x.w.wurzel.includes(' '))
  nimm(mitWurzel, 2, r).forEach(({ w, s, i }) => add(frage(
    { id: `w-${kartenId(w)}`, typ: 'grammatik', prompt: 'Welche Wurzel hat dieses Wort?', promptAr: strip(s.woerter![i].text), optAr: true, wort: w },
    w.wurzel, mitWurzel.map((x) => x.w.wurzel).sort(() => r() - 0.5), r)))
  const FORMEN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
  nimm(eindeutig.filter((x) => x.w.verbform), 2, r).forEach(({ w, s, i }) => add(frage(
    { id: `vf-${kartenId(w)}`, typ: 'grammatik', prompt: 'In welcher Verbform (I–X) steht dieses Verb?', promptAr: strip(s.woerter![i].text), wort: w,
      erklaerung: `Wurzel ${w.wurzel}, Grundform ${w.grundform}` },
    `Form ${w.verbform}`, FORMEN.map((x) => `Form ${x}`).sort(() => r() - 0.5), r)))

  // 5) Hörverstehen: nur mit echten Audios (Platzhalter-Töne wären sinnlos)
  if (f.audio_platzhalter) hinweise.push('Hörverstehen folgt, sobald echte Audios vorliegen (aktuell Platzhalter-Töne).')
  else nimm(f.saetze.filter((s) => s.audio_url), 2, r).forEach((s) => add(frage(
    { id: `h-${s.id}`, typ: 'hoeren', prompt: 'Höre den Satz. Welche Übersetzung passt?', audio: s.audio_url },
    s.text_de, f.saetze.map((x) => x.text_de).sort(() => r() - 0.5), r)))

  return { fragen: out, hinweise }
}
