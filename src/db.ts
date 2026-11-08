import { createClient } from '@supabase/supabase-js'
import type { Fassung, Geschichte, Niveau, VerstaendnisFrage } from './types'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
/** null, solange kein Supabase konfiguriert ist (dann nutzt die App die mitgelieferten Beispieldaten). */
export const supabase = url && key ? createClient(url, key) : null

const chk = <T,>(r: { data: T | null; error: { message: string } | null }): T => {
  if (r.error) throw new Error(r.error.message)
  return r.data as T
}

export async function ladeAlle(): Promise<Geschichte[]> {
  if (!supabase) return []
  const [g, f, q] = await Promise.all([
    supabase.from('geschichten').select('*').order('titel_de'),
    supabase.from('fassungen').select('*'),
    supabase.from('quiz').select('*'),
  ])
  const fassungen = chk(f) as Record<string, unknown>[], quiz = chk(q) as Record<string, unknown>[]
  return (chk(g) as Record<string, unknown>[]).map((r) => {
    const id = r.id as string
    const out: Geschichte = {
      id, bereich: r.bereich as Geschichte['bereich'], titel_ar: r.titel_ar as string, titel_de: r.titel_de as string,
      bild_url: (r.bild_url as string) || undefined, bild_motiv: r.bild_motiv as string,
      quellen: r.quellen as Geschichte['quellen'], zitate: r.zitate as Geschichte['zitate'],
      hinweis: (r.hinweis as string) || undefined, status: r.status as Geschichte['status'], fassungen: {}, quiz: {},
    }
    for (const x of fassungen.filter((x) => x.geschichte_id === id))
      out.fassungen[x.niveau as Niveau] = {
        status: x.status as Fassung['status'], hinweis: (x.hinweis as string) || undefined,
        audio_platzhalter: x.audio_platzhalter as boolean, saetze: x.saetze as Fassung['saetze'],
        schluss_zitate: (x.schluss_zitate as string[]).length ? (x.schluss_zitate as string[]) : undefined,
      }
    for (const x of quiz.filter((x) => x.geschichte_id === id)) out.quiz![x.niveau as Niveau] = x.fragen as VerstaendnisFrage[]
    return out
  })
}

// ---------- Schreiben (nur Team; RLS erzwingt das serverseitig) ----------
export async function speichereGeschichte(g: Geschichte) {
  const r = await supabase!.from('geschichten').upsert({
    id: g.id, bereich: g.bereich, titel_ar: g.titel_ar, titel_de: g.titel_de, bild_url: g.bild_url ?? null,
    bild_motiv: g.bild_motiv, quellen: g.quellen, zitate: g.zitate, hinweis: g.hinweis ?? null, status: g.status,
  })
  if (r.error) throw new Error(r.error.message)
}
export async function speichereFassung(id: string, n: Niveau, f: Fassung) {
  const r = await supabase!.from('fassungen').upsert({
    geschichte_id: id, niveau: n, status: f.status, hinweis: f.hinweis ?? null,
    audio_platzhalter: !!f.audio_platzhalter, saetze: f.saetze, schluss_zitate: f.schluss_zitate ?? [],
  })
  if (r.error) throw new Error(r.error.message)
}
export async function speichereQuiz(id: string, n: Niveau, fragen: VerstaendnisFrage[], status: 'entwurf' | 'geprüft') {
  const r = await supabase!.from('quiz').upsert({ geschichte_id: id, niveau: n, fragen, status })
  if (r.error) throw new Error(r.error.message)
}
export async function loescheFassung(id: string, n: Niveau) {
  const r = await supabase!.from('fassungen').delete().eq('geschichte_id', id).eq('niveau', n)
  if (r.error) throw new Error(r.error.message)
}
export async function hochladen(bucket: 'audio' | 'bilder', pfad: string, file: File): Promise<string> {
  const r = await supabase!.storage.from(bucket).upload(pfad, file, { upsert: true, contentType: file.type })
  if (r.error) throw new Error(r.error.message)
  return supabase!.storage.from(bucket).getPublicUrl(pfad).data.publicUrl
}
export async function meineRolle(): Promise<string | null> {
  const u = (await supabase!.auth.getUser()).data.user
  if (!u) return null
  const r = await supabase!.from('rollen').select('rolle').eq('user_id', u.id).maybeSingle()
  return (r.data?.rolle as string) ?? null
}
