export type Bereich = 'anbiya' | 'sahaba' | 'tabiin' | 'ahmad'
export type Status = 'entwurf' | 'geprüft'
export type Niveau = 'klassisch' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface Wort {
  text: string; wurzel: string; grundform: string; wortart: string
  verbform?: string; zeit?: string; person?: string; hinweis?: string; bedeutung_kontext: string; bedeutung_grund: string; audio_url?: string
}
export interface WortZeitstempel { wort_index: number; start: number; ende: number }
export interface Quelle { werk: string; stelle: string; einstufung?: 'sahih' | 'hasan' | 'daif'; platzhalter?: boolean }

export interface Zitat {
  id: string; typ: 'ayah' | 'hadith' | 'athar'
  text_ar: string; text_de: string; quelle: string
  einstufung?: string; hinweis?: string
  rezitation_url?: string; qari?: string
}
export interface Satz {
  id: string; text_ar_mit_harakat: string; text_de: string
  audio_url?: string; wort_zeitstempel?: WortZeitstempel[]; woerter?: Wort[]
  zitat_id?: string // Satz ist ein Originalzitat (Ayah/Hadith/Athar)
  zitat_nach?: string // Zitat-Kasten nach diesem Satz anzeigen
}
export interface Fassung { status: Status; saetze: Satz[]; hinweis?: string; schluss_zitate?: string[]; audio_platzhalter?: boolean }
export interface Geschichte {
  id: string; bereich: Bereich; titel_ar: string; titel_de: string
  bild_url?: string; bild_motiv: string
  quellen: Quelle[]; hinweis?: string; status: Status
  zitate: Record<string, Zitat>
  fassungen: Partial<Record<Niveau, Fassung>>
}
