import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import type { Settings } from '../settings'
import { ohneHarakat } from '../settings'

interface Words { aktiv: number; onTap?: (i: number, el: HTMLElement) => void; tippbar?: boolean[] }

// Arabischer Text. Mit `words` werden Wörter einzeln gerendert (antippbar) und ein
// gleitender Kasten folgt dem gerade gesprochenen Wort.
export default function ArText({ text, s, className, words }: { text: string; s: Settings; className?: string; words?: Words }) {
  const ar = (t: string) => (s.harakatAus ? ohneHarakat(t) : t)
  const wrap = useRef<HTMLParagraphElement>(null)
  const [box, setBox] = useState<{ l: number; t: number; w: number; h: number } | null>(null)
  const aktiv = words?.aktiv ?? -1

  useLayoutEffect(() => {
    const sp = aktiv >= 0 ? wrap.current?.querySelector<HTMLElement>(`[data-w="${aktiv}"]`) : null
    setBox(sp ? { l: sp.offsetLeft, t: sp.offsetTop, w: sp.offsetWidth, h: sp.offsetHeight } : null)
  }, [aktiv, s.groesse, s.harakatAus, s.schrift])

  return (
    <p ref={wrap} className={`ar ${className ?? ''}`} dir="rtl" lang="ar"
       style={{ fontFamily: `'${s.schrift}', serif`, fontSize: s.groesse, lineHeight: 2.1, position: 'relative' }}>
      {box && <i className="glide" style={{ left: box.l - 4, top: box.t + 4, width: box.w + 8, height: box.h - 8 }} />}
      {words
        ? text.split(/\s+/).map((w, i) => (
            <Fragment key={i}><span data-w={i} className={`wort${i === aktiv ? ' aktiv-wort' : ''}${words.tippbar?.[i] ? ' tippbar' : ''}`}
              onClick={words.tippbar?.[i] ? (e) => words.onTap?.(i, e.currentTarget) : undefined}>{ar(w)}</span>{' '}</Fragment>
          ))
        : ar(text)}
    </p>
  )
}
