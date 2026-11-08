import type { Settings } from '../settings'
import { ohneHarakat } from '../settings'

export default function ArText({ text, s, className, words }: { text: string; s: Settings; className?: string; words?: { aktiv: number; onTap?: (i: number) => void; tippbar?: boolean[] } }) {
  const ar = (t: string) => (s.harakatAus ? ohneHarakat(t) : t)
  return (
    <p className={`ar ${className ?? ''}`} dir="rtl" lang="ar"
       style={{ fontFamily: `'${s.schrift}', serif`, fontSize: s.groesse, lineHeight: 2.1 }}>
      {words
        ? text.split(/\s+/).map((w, i) => <span key={i} className={`wort${i === words.aktiv ? ' aktiv-wort' : ''}${words.tippbar?.[i] ? ' tippbar' : ''}`}
            onClick={words.tippbar?.[i] ? () => words.onTap?.(i) : undefined}>{ar(w)} </span>)
        : ar(text)}
    </p>
  )
}
