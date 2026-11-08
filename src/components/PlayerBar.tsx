import type { usePlayer } from '../usePlayer'

type P = ReturnType<typeof usePlayer>
export default function PlayerBar({ p, anzahl }: { p: P; anzahl: number }) {
  return (
    <div className="playerbar" role="group" aria-label="Audio-Player">
      <div className="pb-zeile">
        <button onClick={p.zurueck} aria-label="Satz zurück">⏮</button>
        <button className="gross" onClick={p.toggle} aria-label={p.playing ? 'Pause' : 'Abspielen'}>{p.playing ? '⏸' : '▶'}</button>
        <button onClick={p.stop} aria-label="Stopp">⏹</button>
        <button onClick={p.weiter} aria-label="Satz vor">⏭</button>
        <button className={p.repeat ? 'on' : ''} onClick={() => p.setRepeat(!p.repeat)} aria-pressed={p.repeat} aria-label="Satz wiederholen">🔁</button>
        <span className="klein">{p.index >= 0 ? `${p.index + 1}/${anzahl}` : `–/${anzahl}`}</span>
      </div>
      <label className="pb-tempo">Tempo {p.rate.toFixed(1)}×
        <input type="range" min={0.5} max={1.5} step={0.1} value={p.rate} onChange={(e) => p.setRate(+e.target.value)} />
      </label>
    </div>
  )
}
