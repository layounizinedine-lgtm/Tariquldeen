import type { Geschichte, Wort, Zitat } from '../types'
import quran from './quran-yusuf.json'
import a2Saetze from './yusuf-saetze-a2.json'
import woerter from './yusuf-woerter-a2.json' // ENTWURF, von Hand vorberechnet, ungeprüft
import quizA2 from './yusuf-quiz-a2.json'
import audio from './yusuf-audio.json' // PLATZHALTER-Töne, siehe scripts/make-placeholder-audio.py

// Quran-Text stammt aus scripts/fetch-quran.mjs (Quran.com-API), nie von Hand getippt.
const q = (key: keyof typeof quran): Zitat => ({
  id: `q-${key}`, typ: 'ayah', text_ar: quran[key].text_ar, text_de: quran[key].text_de,
  quelle: quran[key].quelle, wort_zeitstempel: (quran[key] as { wort_zeitstempel?: Zitat['wort_zeitstempel'] }).wort_zeitstempel, rezitation_url: quran[key].audio, qari: quran[key].qari,
})
const z4 = q('12:4'), z15 = q('12:15'), z20 = q('12:20')
const z53: Zitat = {
  ...q('12:53'),
  hinweis:
    'Die Tafsir-Gelehrten sind uneinig, ob diese Worte von Yusuf (Friede auf ihm) oder von der Frau des Aziz stammen. [Platzhalter: Belegstellen aus Tafsir noch einzutragen – Ibn Kathir, Tafsir zu 12:53]',
}

export const yusuf: Geschichte = {
  id: 'yusuf', bereich: 'anbiya', titel_ar: 'يُوسُفُ عَلَيْهِ السَّلَامُ', titel_de: 'Yusuf (Josef)',
  bild_motiv: 'brunnen', bild_url: '/bilder/yusuf.webp', status: 'entwurf',
  quellen: [
    { werk: 'Quran', stelle: 'Sure 12 (Yusuf), hier 12:4, 12:15, 12:20, 12:53' },
    { werk: 'Ibn Kathir, Qisas al-Anbiya', stelle: '[Platzhalter: Seite/Kapitel noch einzutragen]', platzhalter: true },
  ],
  hinweis: 'ENTWURF: Auswahl, Nacherzählung und Harakat der vereinfachten Fassungen müssen von einer fachkundigen Person geprüft werden.',
  zitate: { [z4.id]: z4, [z15.id]: z15, [z20.id]: z20, [z53.id]: z53 },
  quiz: { A2: quizA2.verstaendnis },
  fassungen: {
    klassisch: {
      status: 'entwurf',
      hinweis: 'Klassisch = Originalwortlaut des Qurans. Auswahl der Verse ist ein Entwurf.',
      saetze: [
        { id: 'k1', text_ar_mit_harakat: z4.text_ar, text_de: z4.text_de, zitat_id: z4.id },
        { id: 'k2', text_ar_mit_harakat: z15.text_ar, text_de: z15.text_de, zitat_id: z15.id },
        { id: 'k3', text_ar_mit_harakat: z20.text_ar, text_de: z20.text_de, zitat_id: z20.id },
        { id: 'k4', text_ar_mit_harakat: z53.text_ar, text_de: z53.text_de, zitat_id: z53.id },
      ],
    },
    A2: {
      status: 'entwurf',
      audio_platzhalter: true,
      hinweis: 'Vereinfachte Nacherzählung (Entwurf, Harakat ungeprüft). Inhalt stützt sich nur auf Sure 12.',
      schluss_zitate: [z53.id],
      saetze: a2Saetze.map((x) => ({
        id: x.id, text_ar_mit_harakat: x.ar, text_de: x.de,
        zitat_nach: (x as { zitat_nach?: string }).zitat_nach,
        woerter: woerter[x.id as keyof typeof woerter] as Wort[],
        ...audio[x.id as keyof typeof audio],
      })),
    },
  },
}
