import type { Settings } from '../settings'

export default function SettingsBar({ s, set }: { s: Settings; set: (p: Partial<Settings>) => void }) {
  return (
    <details className="einstellungen">
      <summary>Anzeige-Einstellungen</summary>
      <label>Schriftgröße: {s.groesse}px
        <input type="range" min={22} max={56} value={s.groesse} onChange={(e) => set({ groesse: +e.target.value })} />
      </label>
      <label>Schrift
        <select value={s.schrift} onChange={(e) => set({ schrift: e.target.value as Settings['schrift'] })}>
          <option>Amiri</option><option>Scheherazade New</option>
        </select>
      </label>
      <label>Übersetzung
        <select value={s.uebersetzung} onChange={(e) => set({ uebersetzung: e.target.value as Settings['uebersetzung'] })}>
          <option value="immer">immer sichtbar</option><option value="tippen">erst beim Antippen</option><option value="aus">ausgeblendet</option>
        </select>
      </label>
      <label className="check"><input type="checkbox" checked={s.harakatAus} onChange={(e) => set({ harakatAus: e.target.checked })} /> Harakat ausblenden (Übungsmodus)</label>
      <label>Design
        <select value={s.theme} onChange={(e) => set({ theme: e.target.value as Settings['theme'] })}>
          <option value="auto">System</option><option value="hell">Hell</option><option value="dunkel">Dunkel</option>
        </select>
      </label>
    </details>
  )
}
