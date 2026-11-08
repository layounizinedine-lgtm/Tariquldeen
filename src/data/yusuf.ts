import type { Geschichte, Zitat } from '../types'
import quran from './quran-yusuf.json'

// Quran-Text stammt aus scripts/fetch-quran.mjs (Quran.com-API), nie von Hand getippt.
const q = (key: keyof typeof quran): Zitat => ({
  id: `q-${key}`, typ: 'ayah', text_ar: quran[key].text_ar, text_de: quran[key].text_de,
  quelle: quran[key].quelle, rezitation_url: quran[key].audio, qari: quran[key].qari,
})
const z4 = q('12:4'), z15 = q('12:15'), z20 = q('12:20')
const z53: Zitat = {
  ...q('12:53'),
  hinweis:
    'Die Tafsir-Gelehrten sind uneinig, ob diese Worte von Yusuf (Friede auf ihm) oder von der Frau des Aziz stammen. [Platzhalter: Belegstellen aus Tafsir noch einzutragen – Ibn Kathir, Tafsir zu 12:53]',
}

export const yusuf: Geschichte = {
  id: 'yusuf', bereich: 'anbiya', titel_ar: 'يُوسُفُ عَلَيْهِ السَّلَامُ', titel_de: 'Yusuf (Josef)',
  bild_motiv: 'brunnen', status: 'entwurf',
  quellen: [
    { werk: 'Quran', stelle: 'Sure 12 (Yusuf), hier 12:4, 12:15, 12:20, 12:53' },
    { werk: 'Ibn Kathir, Qisas al-Anbiya', stelle: '[Platzhalter: Seite/Kapitel noch einzutragen]', platzhalter: true },
  ],
  hinweis: 'ENTWURF: Auswahl, Nacherzählung und Harakat der vereinfachten Fassungen müssen von einer fachkundigen Person geprüft werden.',
  zitate: { [z4.id]: z4, [z15.id]: z15, [z20.id]: z20, [z53.id]: z53 },
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
      hinweis: 'Vereinfachte Nacherzählung (Entwurf, Harakat ungeprüft). Inhalt stützt sich nur auf Sure 12.',
      schluss_zitate: [z53.id],
      saetze: [
        { id: 'a1', text_ar_mit_harakat: 'كَانَ يُوسُفُ وَلَدًا صَغِيرًا.', text_de: 'Yusuf war ein kleiner Junge.' },
        { id: 'a2', text_ar_mit_harakat: 'رَأَى يُوسُفُ حُلْمًا.', text_de: 'Yusuf hatte einen Traum.' },
        { id: 'a3', text_ar_mit_harakat: 'رَأَى أَحَدَ عَشَرَ كَوْكَبًا وَالشَّمْسَ وَالْقَمَرَ.', text_de: 'Er sah elf Sterne, die Sonne und den Mond.', zitat_nach: z4.id },
        { id: 'a4', text_ar_mit_harakat: 'أَخْبَرَ يُوسُفُ أَبَاهُ بِالْحُلْمِ.', text_de: 'Yusuf erzählte seinem Vater von dem Traum.' },
        { id: 'a5', text_ar_mit_harakat: 'أَلْقَاهُ إِخْوَتُهُ فِي الْجُبِّ.', text_de: 'Seine Brüder warfen ihn in den Brunnen.', zitat_nach: z15.id },
        { id: 'a6', text_ar_mit_harakat: 'بِيعَ يُوسُفُ بِدَرَاهِمَ قَلِيلَةٍ.', text_de: 'Yusuf wurde für wenige Dirhams verkauft.', zitat_nach: z20.id },
      ],
    },
  },
}
