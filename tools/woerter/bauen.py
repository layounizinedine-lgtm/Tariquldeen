"""Wortdaten für das Antippen von Wörtern erzeugen (Entwurf, maschinell: CAMeL Tools + Regeln + MT).
Aufruf (Venv mit camel-tools, torch, transformers; CAMELTOOLS_DATA gesetzt):
    python tools/woerter/bauen.py
Schreibt content/woerter/<geschichte>.json  {satz-id: [Wort|null, ...]}  (ein Eintrag je Leerzeichen-Token).
Handkorrekturen der deutschen Bedeutung: content/woerter-de.json  {"lemma|pos": "Bedeutung"}"""
import json, glob, os, re, sys, collections
sys.path.insert(0, os.path.dirname(__file__))
from analyse import analyse, analyse_satz, strip_punct
from lemmata import bare_gloss, uebersetze
from camel_tools.morphology.utils import strip_lex

def vokallos(s): return re.sub('[ًٌٍَُِّْٰ]', '', s)
def K(s):
    """Schlüssel-Normalisierung für Handkorrekturen: ohne Harakat, Hamza-Träger vereinheitlicht."""
    s = vokallos(s).replace('ٱ', 'ا')
    s = re.sub('[أإآ]', 'ا', s).replace('ؤ', 'و').replace('ئ', 'ي').replace('ء', '')
    return s


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
GLOSS_CACHE = os.path.join(os.path.dirname(__file__), 'gloss_de.json')
OVERRIDE = os.path.join(ROOT, 'content', 'woerter-de.json')
WURZELN = os.path.join(ROOT, 'content', 'woerter-wurzeln.json')
_ov = json.load(open(OVERRIDE, encoding='utf-8')) if os.path.exists(OVERRIDE) else {}
OV_EXACT = {k: v for k, v in _ov.items() if not k.startswith('_') and re.search('[ًٌٍَُِّْ]', k)}
OV = {K(k): v for k, v in _ov.items() if not k.startswith('_') and not re.search('[ًٌٍَُِّْ]', k)}
_wz = json.load(open(WURZELN, encoding='utf-8')) if os.path.exists(WURZELN) else {}
WZ = {K(k): v for k, v in _wz.items()}
_NOROOT = ('part', 'pron', 'prep', 'conj', 'interj', 'adv', 'verb_pseudo', 'abbrev', 'foreign', 'digit')

WORTART = {'noun': 'Nomen', 'noun_prop': 'Eigenname', 'adj': 'Adjektiv', 'adj_comp': 'Adjektiv (Steigerung)', 'adj_num': 'Zahlwort',
  'verb': 'Verb', 'verb_pseudo': 'Verb (Hilfsverb)', 'prep': 'Präposition', 'conj': 'Konjunktion', 'conj_sub': 'Konjunktion',
  'part': 'Partikel', 'part_neg': 'Verneinung', 'part_det': 'Partikel', 'part_focus': 'Partikel', 'part_fut': 'Partikel', 'part_interrog': 'Fragepartikel',
  'part_verb': 'Partikel', 'part_voc': 'Anrufpartikel', 'part_restrict': 'Partikel', 'part_emphatic': 'Partikel', 'part_connect': 'Partikel', 'part_response': 'Partikel', 'part_neg_': 'Verneinung',
  'pron': 'Pronomen', 'pron_dem': 'Demonstrativpronomen', 'pron_rel': 'Relativpronomen', 'pron_interrog': 'Fragewort', 'pron_exclam': 'Ausruf',
  'adv': 'Adverb', 'adv_interrog': 'Fragewort', 'adv_rel': 'Adverb', 'noun_num': 'Zahlwort', 'noun_quant': 'Mengenwort', 'digit': 'Zahl', 'interj': 'Ausruf', 'abbrev': 'Abkürzung', 'foreign': 'Fremdwort'}
KASUS = {'n': 'Nominativ (marfūʿ)', 'a': 'Akkusativ (manṣūb)', 'g': 'Genitiv (madschrūr)'}
NUM = {'s': 'Einzahl (Mufrad)', 'd': 'Dual – zwei (Muthanna)', 'p': 'Mehrzahl (Dschamʿ)'}
GEN = {'m': 'männlich (muʾannath: nein)', 'f': 'weiblich (muʾannath)'}
PERS = {'1': '1. Person (ich/wir)', '2': '2. Person (du/ihr)', '3': '3. Person (er/sie/sie pl.)'}
PRC = {'wa_conj': 'wa- = und', 'wa_part': 'wa- = und', 'wa_sub': 'wa- = und', 'wa_prep': 'wa- = bei (Schwurpartikel)', 'fa_conj': 'fa- = dann / so', 'fa_sub': 'fa- = dann / damit', 'fa_rc': 'fa- = so / dann', 'fa_conn': 'fa- = dann / so',
  'bi_prep': 'bi- = mit / durch / in', 'bi_part': 'bi- = mit', 'li_prep': 'li- = für / zu', 'li_sub': 'li- = damit', 'la_prep': 'li- = für / zu', 'ka_prep': 'ka- = wie', 'ta_prep': 'ta- = bei (Schwur)', 'sa_fut': 'sa- = wird bald (Zukunft)', 'la_emph': 'la- = wahrlich', 'la_rc': 'la- = wahrlich', 'Al_det': 'al- = der/die/das (bestimmter Artikel)', 'Al_rel': 'al- = der, welcher', 'a_ques': 'a- = Fragepartikel', 'sa_fut': 'sa- = wird (Zukunft)', 'ya_voc': 'ya = o (Anrede)', 'wa_rc': 'wa- = und'}
ENC = {'1s': 'mich / mein', '1p': 'uns / unser', '2ms': 'dich / dein', '2fs': 'dich / dein', '2d': 'euch beide / euer', '2mp': 'euch / euer', '2fp': 'euch / euer', '3ms': 'ihn / sein', '3fs': 'sie / ihr', '3d': 'sie beide / ihr', '3mp': 'sie / ihr', '3fp': 'sie / ihr', '1s_pron': 'mich', '1p_pron': 'uns'}
ENC_SUFFIX = {'1s': '-ī', '1p': '-nā', '2ms': '-ka', '2fs': '-ki', '2d': '-kumā', '2mp': '-kum', '2fp': '-kunna', '3ms': '-hu', '3fs': '-hā', '3d': '-humā', '3mp': '-hum', '3fp': '-hunna'}
KLEIN_WORTER = {  # häufige Funktionswörter: feste deutsche Bedeutung + Hinweis
  'فِي': ('in', 'Präposition: das folgende Wort steht im Genitiv (madschrūr).'), 'مِنْ': ('von / aus', 'Präposition: das folgende Wort steht im Genitiv (madschrūr).'),
  'عَلَى': ('auf / über', 'Präposition: das folgende Wort steht im Genitiv (madschrūr).'), 'إِلَى': ('zu / nach', 'Präposition: das folgende Wort steht im Genitiv (madschrūr).'),
  'عَنْ': ('von / über', 'Präposition: das folgende Wort steht im Genitiv (madschrūr).'), 'مَعَ': ('mit / bei', 'Das folgende Wort steht im Genitiv (madschrūr).'),
  'أَنَّ': ('dass', 'Partikel: das folgende Nomen steht im Akkusativ (manṣūb), danach folgt das Prädikat im Nominativ.'), 'إِنَّ': ('wahrlich / gewiss', 'Partikel: das folgende Nomen steht im Akkusativ (manṣūb).'),
  'أَنْ': ('dass / zu', 'Nach أَنْ steht das Verb im Subjunktiv (manṣūb).'), 'لَا': ('nicht / kein', 'Verneinung / Verbot (vor Jussiv).'), 'لَمْ': ('nicht (Vergangenheit)', 'Nach لَمْ steht das Verb im Jussiv (madschzūm) und bezieht sich auf die Vergangenheit.'),
  'لَنْ': ('nie / nicht (Zukunft)', 'Nach لَنْ steht das Verb im Subjunktiv (manṣūb).'), 'مَا': ('nicht / was', 'Je nach Satz: Verneinung („nicht“) oder Fragewort/Relativwort („was“).'), 'قَدْ': ('schon / wahrlich', 'Vor Perfekt: „schon“ / Betonung; vor Imperfekt: „vielleicht / manchmal“.'),
  'ثُمَّ': ('dann / danach', 'Konjunktion: reiht Handlungen zeitlich nacheinander.'), 'كَانَ': ('war / sein', 'Hilfsverb „sein“: das Subjekt steht im Nominativ, das Prädikat im Akkusativ.'), 'الَّذِي': ('der, welcher', 'Relativpronomen (bestimmt, Einzahl männlich).'),
  'الَّذِينَ': ('die, welche', 'Relativpronomen (Mehrzahl männlich).'), 'هَذَا': ('dieser / dies', 'Demonstrativpronomen (Einzahl männlich).'), 'هَذِهِ': ('diese', 'Demonstrativpronomen (Einzahl weiblich).'), 'ذَلِكَ': ('jener / das', 'Demonstrativpronomen (fern).'),
  'هُوَ': ('er', 'Selbständiges Personalpronomen (3. Person m. Sg.).'), 'هِيَ': ('sie', 'Selbständiges Personalpronomen (3. Person f. Sg.).'), 'هُمْ': ('sie', 'Selbständiges Personalpronomen (3. Person m. Pl.).'), 'أَنَا': ('ich', 'Selbständiges Personalpronomen (1. Person).'), 'أَنْتَ': ('du', 'Selbständiges Personalpronomen (2. Person m.).'), 'نَحْنُ': ('wir', 'Selbständiges Personalpronomen (1. Person Pl.).'),
  'إِذْ': ('als / damals', 'Zeitwort-Partikel für die Vergangenheit.'), 'إِذَا': ('wenn', 'Bedingungs-/Zeitpartikel.'), 'لَقَدْ': ('wahrlich, schon', 'la- (Betonung) + qad.'), 'بَلْ': ('vielmehr / sondern', 'Konjunktion: widerspricht dem Vorhergehenden.'), 'أَوْ': ('oder', 'Konjunktion.'), 'كُلّ': ('jeder / alle', 'Kommt oft in einer Idafa vor.'),
}
LOWER = {'noun_prop': False}

def gloss_tabelle(alle_lemmata):
    cache = json.load(open(GLOSS_CACHE, encoding='utf-8')) if os.path.exists(GLOSS_CACHE) else {}
    todo = [k for k in alle_lemmata if k not in cache]
    if todo:
        print('übersetze', len(todo), 'Lemmata ...')
        rows = []
        for k in todo:
            lex, pos = k.split('|'); g = bare_gloss(lex, pos, alle_lemmata[k])
            rows.append((k, g))
        # jede Teilbedeutung einzeln übersetzen
        einzel = sorted({(t.strip(), k.endswith('|verb')) for k, g in rows for t in g.split(';') if t.strip()})
        en = [('to ' if v else '') + t for t, v in einzel]
        de = uebersetze(en)
        tr = {}
        for (t, v), d in zip(einzel, de):
            d = d.strip().rstrip('.')
            if v:
                d = re.sub(r'^(um )?zu ', '', d); d = re.sub(r' zu (\w+)$', r' \1', d); d = re.sub(r'(\w+) zu (\w+)$', r'\1 \2', d)
            tr[(t, v)] = d
        for k, g in rows:
            v = k.endswith('|verb'); pos = k.split('|')[1]
            teile = []
            for t in [x.strip() for x in g.split(';') if x.strip()]:
                d = tr.get((t, v), t)
                if pos == 'noun_prop': d = t
                elif pos in ('noun', 'noun_num', 'noun_quant'): d = d[:1].upper() + d[1:]
                else: d = d[:1].lower() + d[1:]
                if d and d.lower() not in [x.lower() for x in teile] and not re.search(r'\bnein\b.*\bnein\b', d): teile.append(d)
            cache[k] = ', '.join(teile[:3]) if teile else '–'
        json.dump(cache, open(GLOSS_CACHE, 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True)
    ov = json.load(open(OVERRIDE, encoding='utf-8')) if os.path.exists(OVERRIDE) else {}
    return cache

def wurzel(a, lexf=None):
    r = a.get('root') or ''
    if not r or 'NTWS' in r or r in ('na', '-'): return '–'
    rad = r.split('.')
    if '#' not in rad: return ' '.join(rad)
    sk = vokallos(lexf or strip_lex(a['lex'])).replace('ٱ', 'ا').replace('ى', 'ي')
    sk = re.sub('[ءأإؤئ]', 'ء', sk)
    if len(sk) == len(rad):   # einfaches Grundmuster: schwache/Hamza-Radikale aus dem Lemma ablesen
        out = []
        for c, l in zip(rad, sk):
            out.append(c if c != '#' else (l if l in 'ءوي' else '؟'))
        return ' '.join(out)
    return ' '.join('؟' if c == '#' else c for c in rad)

def verbform(a):
    if a['pos'] != 'verb': return None
    lem = strip_lex(a['lex']); rad = [c for c in (a.get('root') or '').split('.') if c]
    if len(rad) != 3: return None
    sk = vokallos(lem); sch = 'ّ' in lem
    if sk.startswith('است') and len(sk) >= 6: return 'X'
    if sk.startswith('ان') and len(sk) == 5: return 'VII'
    if sk.startswith('ا') and len(sk) == 5 and sk[2] == 'ت': return 'VIII'
    if sk.startswith('ت') and len(sk) == 5 and sk[2] == 'ا': return 'VI'
    if sk.startswith('ت') and len(sk) == 4 and sch: return 'V'
    if sk.startswith('ا') and len(sk) == 4 and sch: return 'IX'
    if sk.startswith('أ') and len(sk) == 4 and not sch: return 'IV'
    if len(sk) == 4 and sk[1] == 'ا': return 'III'
    if len(sk) == 3 and sch: return 'II'
    if len(sk) == 3: return 'I'
    return None

ENC_RE = {'3ms': 'ه[ُِ]$', '3fs': 'هَا$', '3mp': 'ه[ُِ]مْ$', '3d': 'ه[ُِ]مَا$', '3fp': 'ه[ُِ]نَّ$', '2ms': 'كَ$', '2fs': 'كِ$', '2mp': 'كُمْ$', '2d': 'كُمَا$', '1p': 'نَا$'}
def kasus_aus_wort(bare, enc_typ):
    """Kasus aus der Endung des Wortes ablesen (zuverlässiger als die Wahl der Analyse)."""
    st = bare
    if enc_typ and enc_typ in ENC_RE:
        st = re.sub(ENC_RE[enc_typ], '', st)
    elif enc_typ == '1s':
        st = re.sub('ي$', '', st)
    st = re.sub('[ْ]$', '', st)
    if re.search('ُونَ?$', st) or re.search('َانِ?$', st): return 'n'
    if re.search('[ِ]ينَ?$|َيْنِ?$', st): return None   # a/g nicht unterscheidbar an der Endung allein
    if st.endswith('ُ') or st.endswith('ٌ'): return 'n'
    if st.endswith('َ') or st.endswith('ً') or st.endswith('ًا') or st.endswith('اً'): return 'a'
    if st.endswith('ِ') or st.endswith('ٍ'): return 'g'
    if re.search('[ُ]و$', st) or st.endswith('و'): return 'n' if len(st) > 3 and enc_typ else None
    return None

def fix_lex(a, bare):
    """CAMeL-Lemma-Fehler (z. B. رَأَى → «راوَنْد») korrigieren: beim 3. Pers. m. Sg. Perfekt ohne Anhänge ist das Wort selbst das Lemma."""
    if a['pos'] == 'verb' and a.get('asp') == 'p' and a.get('per') == '3' and a.get('num') == 's' and a.get('gen') == 'm' \
       and all(a.get(k) in ('0', 'na') for k in ('prc0', 'prc1', 'prc2', 'prc3', 'enc0')):
        return bare
    return strip_lex(a['lex'])

def baue_satz(tokens, ana, gloss):
    """tokens: Liste Originaltokens; ana: Analysen (dict|None). Gibt Liste von Wort-Dicts zurück."""
    out = []
    for i, (t, a) in enumerate(zip(tokens, ana)):
        if a is None: out.append(None); continue
        bare = strip_punct(t); pos = a['pos']; lex = fix_lex(a, bare); key = f"{a['lex']}|{pos}"
        gd = gloss.get(key) or gloss.get(f"{strip_lex(a['lex'])}|{pos}") or '–'
        prc = [PRC.get(a.get(k), None) for k in ('prc3', 'prc2', 'prc1', 'prc0')]
        prc = [p for p in prc if p]
        enc = a.get('enc0'); enc_typ = (enc or '').split('_')[0] if enc not in (None, '0', 'na') else None
        if enc_typ not in ENC: enc_typ = None
        poss = bool(enc and enc.endswith('_poss'))
        w = {'text': t, 'wurzel': wurzel(a, lex), 'grundform': lex.replace('ٱ', 'ا'), 'wortart': WORTART.get(pos, 'Wort'),
             'bedeutung_grund': gd}
        notes = []; cas_f = a.get('cas')
        # Bedeutung im Satz: Vorsilben + Bedeutung + Suffix
        kern = gd.split(',')[0].strip()
        teile = []
        for p in prc:
            if 'al- ' in p or p.startswith('al-'): continue
            teile.append(p.split('=')[1].strip().split(' / ')[0])
        pre = ' '.join(teile)
        suf = ''
        if enc_typ:
            e = ENC.get(enc_typ, '')
            suf = (e.split(' / ')[1] if (poss and ' / ' in e) else e.split(' / ')[0])
        if pos == 'verb' or pos in ('prep',):
            ctx = ' '.join(x for x in [pre, kern, suf] if x)
        elif poss:
            ctx = ' '.join(x for x in [pre, suf, kern] if x)
        else:
            ctx = ' '.join(x for x in [pre, kern, suf] if x)
        w['bedeutung_kontext'] = ctx
        # Handkorrekturen (Bedeutung, Wortart) und Wurzeln
        ov = OV_EXACT.get(lex.replace('ٱ', 'ا')) or OV.get(K(lex)) or None
        if ov:
            w['bedeutung_grund'] = ov['de']; kern = ov['de'].split('/')[0].strip(); 
            if ov.get('art'): w['wortart'] = ov['art']
            ctx = ' '.join(x for x in ([pre, suf, kern] if poss and pos != 'verb' else [pre, kern, suf]) if x)
            w['bedeutung_kontext'] = ctx
        wz = WZ.get(K(lex))
        if wz: w['wurzel'] = wz
        if pos == 'noun_prop' or pos.startswith(_NOROOT) or (ov and ov.get('art') in ('Eigenname', 'Partikel', 'Präposition', 'Konjunktion')): 
            if not wz: w['wurzel'] = '–'
        # Funktionswörter
        kw = KLEIN_WORTER.get(lex) or KLEIN_WORTER.get(vokallos(lex))
        if bare in KLEIN_WORTER or kw:
            kw = KLEIN_WORTER.get(bare) or kw
            w['bedeutung_grund'] = kw[0]; w['bedeutung_kontext'] = kw[0]; notes.append(kw[1]); kw_note = True; w['grundform'] = bare if bare in KLEIN_WORTER else w['grundform']
        else: kw_note = False
        # Nomen / Adjektiv
        if pos in ('noun', 'adj', 'noun_prop', 'adj_comp', 'noun_num', 'noun_quant', 'adj_num'):
            num, gen, cas, stt = a.get('num'), a.get('gen'), a.get('cas'), a.get('stt')
            if pos != 'noun_prop':
                if re.search('َيْنِ?$|َانِ$', bare): num = 'd'
                elif re.search('[ُِ]ي?[ون]نَ?$|[ُِ]ونَ$|[ِ]ينَ$', bare) and num == 'd': num = 'p'
            kz = kasus_aus_wort(bare, enc_typ) if pos != 'noun_prop' else None
            if kz: cas = kz
            cas_f = cas
            if num in NUM: w['numerus'] = NUM[num]
            if gen in GEN and pos != 'noun_prop': w['genus'] = 'männlich (mudhakkar)' if gen == 'm' else 'weiblich (muʾannath)'
            if cas in KASUS: w['kasus'] = KASUS[cas]
            if stt == 'd': w['status'] = 'bestimmt (mit al- oder Eigenname)'
            elif stt == 'i': w['status'] = 'unbestimmt (Tanwin)'
            elif stt == 'c': w['status'] = 'Verbindungsform (Idafa) – ohne Tanwin und ohne al-'
            if num == 'p' and a.get('form_num') == 's': notes.append('Gebrochene Mehrzahl (unregelmäßig): ändert das Wortgerüst – die Einzahl ist ' + lex + '.')
            elif num == 'p': notes.append('Regelmäßige Mehrzahl (Suffix -ūna/-īna bzw. -āt). Einzahl: ' + lex + '.')
            elif num == 'd': notes.append('Zweizahl (Dual) auf -āni / -ayni.')
            if enc_typ and poss: notes.append(f'Besitz: das Suffix {ENC_SUFFIX.get(enc_typ, "")} bedeutet „{ENC[enc_typ].split(" / ")[-1]}“ – Nomen + Suffix bilden eine Idafa.')
        elif pos == 'verb':
            asp, vox, mod, per, num, gen = a.get('asp'), a.get('vox'), a.get('mod'), a.get('per'), a.get('num'), a.get('gen')
            w['zeit'] = {'p': 'Perfekt (Vergangenheit, māḍī)', 'i': 'Imperfekt (Gegenwart/Zukunft, muḍāriʿ)', 'c': 'Imperativ (Befehl, amr)'}.get(asp)
            if per in PERS:
                pn = {'s': 'Einzahl', 'd': 'Zweizahl', 'p': 'Mehrzahl'}.get(num, '')
                w['person'] = f"{PERS[per]}, {'männlich' if gen == 'm' else 'weiblich' if gen == 'f' else ''} {pn}".replace('  ', ' ').strip(', ')
            vf = verbform(a)
            if vf: w['verbform'] = vf
            if vox == 'p': notes.append('Passiv (Majhūl): der Handelnde wird nicht genannt.')
            if asp == 'i' and mod == 's': notes.append('Subjunktiv (manṣūb): steht z. B. nach أَنْ / لِ / لَنْ.')
            if asp == 'i' and mod == 'j': notes.append('Jussiv (madschzūm): steht z. B. nach لَمْ / لَا (Verbot).')
            if enc_typ: notes.append(f'Das Suffix {ENC_SUFFIX.get(enc_typ, "")} ist das Objekt („{ENC[enc_typ].split(" / ")[0]}“).')
        elif pos == 'prep' and not kw_note:
            notes.append('Präposition (Harf Dschar): das folgende Wort steht im Genitiv (madschrūr).')
            if enc_typ: notes.append(f'Das Suffix {ENC_SUFFIX.get(enc_typ, "")} = „{ENC[enc_typ].split(" / ")[0]}“ (Pronomen als Ergänzung der Präposition).')
        # Vorsilben
        for p in prc: notes.append('Vorsilbe ' + p + '.')
        w['_a'] = {'pos': pos, 'cas': cas_f, 'stt': a.get('stt'), 'enc_poss': poss, 'prep_clitic': a.get('prc1') in ('bi_prep', 'li_prep', 'ka_prep', 'bi_part', 'ta_prep', 'li_sub') and a.get('prc1') != 'li_sub', 'asp': a.get('asp')}
        w['_notes'] = notes
        out.append(w)
    # Kontext-Regeln über Nachbarn
    for i, w in enumerate(out):
        if not w: continue
        A = w['_a']; notes = w['_notes']
        prev = next((out[j] for j in range(i - 1, -1, -1) if out[j]), None) if i else None
        nxt = out[i + 1] if i + 1 < len(out) else None
        if A['pos'] in ('noun', 'adj', 'noun_prop', 'noun_num', 'noun_quant') and A['cas'] == 'g':
            if A['prep_clitic'] or (prev and prev['_a']['pos'] == 'prep'):
                notes.append('Genitiv (madschrūr), weil davor eine Präposition steht.')
            elif prev and (prev['_a']['stt'] == 'c' or prev['_a']['enc_poss']) and prev['_a']['pos'] in ('noun', 'noun_prop', 'noun_num', 'noun_quant'):
                notes.append('Mudāf ilayhi: zweites Glied der Idafa (Genitivverbindung) – steht immer im Genitiv.')
                if 'Mudāf' not in ''.join(prev['_notes']): prev['_notes'].append('Mudāf: erstes Glied einer Idafa – ohne Tanwin und ohne al-; das nächste Wort steht im Genitiv.')
            else:
                notes.append('Genitiv (madschrūr).')
        if A['pos'] in ('noun',) and A['stt'] == 'c' and not A['enc_poss'] and nxt and nxt['_a']['pos'] in ('noun', 'noun_prop', 'noun_num', 'noun_quant', 'adj') and nxt['_a']['cas'] == 'g' and not any('Mudāf:' in n for n in notes):
            notes.append('Mudāf: erstes Glied einer Idafa – ohne Tanwin und ohne al-; das nächste Wort steht im Genitiv.')
        if A['pos'] == 'adj' and prev and prev['_a']['pos'] in ('noun', 'noun_prop') and not any('Mudāf ilayhi' in n for n in notes):
            notes.append('Adjektiv (Sifa): richtet sich nach dem Nomen davor in Kasus, Numerus, Genus und Bestimmtheit.')
        if A['pos'] in ('noun', 'noun_prop') and A['cas'] == 'a' and not any('Genitiv' in n for n in notes):
            if prev and prev['_a']['pos'] == 'verb': notes.append('Akkusativ (manṣūb): Objekt (Maful bihi) oder Umstand beim Verb davor.')
        if A['pos'] in ('noun', 'noun_prop') and A['cas'] == 'n' and i == 0:
            notes.append('Nominativ (marfūʿ): steht hier am Satzanfang als Subjekt/Thema (Mubtadaʾ).')
    for w in out:
        if not w: continue
        w['hinweis'] = ' '.join(dict.fromkeys(w.pop('_notes')))
        w.pop('_a')
        if not w['hinweis']: w.pop('hinweis')
        for k in [k for k, v in w.items() if v in (None, '')]: w.pop(k)
    return out

def main():
    stories = {}; satz_ana = {}; lemma = {}
    for f in sorted(glob.glob(os.path.join(ROOT, 'src/data/geschichten/*.json'))):
        if f.endswith('index.json'): continue
        g = json.load(open(f, encoding='utf-8')); stories[g['id']] = g
    cache = {}
    for sid, g in stories.items():
        for n, fa in g['fassungen'].items():
            for s in fa['saetze']:
                if s.get('zitat_id'): continue
                tk = tuple(s['text_ar_mit_harakat'].split())
                if tk not in cache: cache[tk] = analyse_satz(list(tk))
                satz_ana[(sid, s['id'])] = cache[tk]
                for a in cache[tk]:
                    if a: lemma.setdefault(f"{a['lex']}|{a['pos']}", a['gloss'])
    gloss = gloss_tabelle(lemma)
    od = os.path.join(ROOT, 'content', 'woerter'); os.makedirs(od, exist_ok=True)
    for sid, g in stories.items():
        res = {}
        for n, fa in g['fassungen'].items():
            for s in fa['saetze']:
                if s.get('zitat_id'): continue
                tk = s['text_ar_mit_harakat'].split()
                ws = baue_satz(tk, satz_ana[(sid, s['id'])], gloss)
                if any(ws): res[s['id']] = ws
        json.dump(res, open(os.path.join(od, sid + '.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print('fertig:', len(stories), 'Geschichten')

if __name__ == '__main__':
    main()
