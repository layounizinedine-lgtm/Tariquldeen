// Pfade wie "/audio/x.mp3" an den Basis-Pfad der Seite anpassen (GitHub Pages: /Tariquldeen/)
export const asset = (u?: string) => (u && u.startsWith('/') && !u.startsWith('//') && !u.startsWith(import.meta.env.BASE_URL) ? import.meta.env.BASE_URL + u.slice(1) : u)
