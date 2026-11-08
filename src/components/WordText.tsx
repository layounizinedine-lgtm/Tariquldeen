import type { Settings } from '../settings'
import { ohneHarakat } from '../settings'

export default function ArText({ text, s, className }: { text: string; s: Settings; className?: string }) {
  return (
    <p className={`ar ${className ?? ''}`} dir="rtl" lang="ar"
       style={{ fontFamily: `'${s.schrift}', serif`, fontSize: s.groesse, lineHeight: 2.1 }}>
      {s.harakatAus ? ohneHarakat(text) : text}
    </p>
  )
}
