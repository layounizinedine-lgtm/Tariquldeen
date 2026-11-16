"""Morphologische Analyse (CAMeL Tools, calima-msa-r13) für voll vokalisierte Wörter.
Wählt unter allen Analysen zuerst die mit exakt passenden Harakat, dann die wahrscheinlichste (pos_lex_logprob)."""
import re, unicodedata, functools
from camel_tools.morphology.database import MorphologyDB
from camel_tools.morphology.analyzer import Analyzer

_db = MorphologyDB.builtin_db('calima-msa-r13', 'a')
_an = Analyzer(_db)
_an_prop = Analyzer(_db, 'NOAN_PROP')
HARAKAT = 'ًٌٍَُِّْٰ'

def norm(s, keep_case=True):
    s = unicodedata.normalize('NFC', s)
    s = s.replace('ٱ', 'ا').replace('آ', 'أا').replace('ـ', '')
    s = re.sub('[ّْ]', '', s)            # Shadda/Sukun ignorieren
    s = s.replace('ًا', 'ً').replace('اً', 'ً')
    s = s.replace('ٰ', 'ا')              # Dolch-Alif
    s = re.sub('[ءأإؤئ]', 'ء', s)       # Hamza-Träger egal
    s = s.replace('ى', 'ي')
    s = re.sub('َ(?=ا)|ُ(?=و)|ِ(?=ي)', '', s)   # Vokalzeichen vor Langvokal egal
    s = re.sub('(?<=ا)[ًٌٍَُِ](?=[هكن])', '', s) # DB-Eigenheit: Kasus-Zeichen hinter Alif
    if not keep_case:
        s = re.sub('[ًٌٍَُِ]$', '', s)
    return s

def strip_punct(w):
    return re.sub(r'^[^\u0621-\u064A\u0670\u0671]+|[^\u0621-\u0652\u0670\u0671]+$', '', w)

@functools.lru_cache(maxsize=None)
def analyse(wort):
    w = strip_punct(wort)
    cands = _an.analyze(w)
    if not cands:
        cands = _an_prop.analyze(w)
        if not cands: return None
    nw = norm(w)
    exakt = [c for c in cands if norm(c['diac']) == nw]
    if not exakt:
        nw2 = norm(w, False)
        exakt = [c for c in cands if norm(c['diac'], False) == nw2]
    voc = lambda x: re.sub('[ًٌٍَُِّْٰ]', '', norm(x))
    nv = voc(w)
    breit = [c for c in cands if voc(c['diac']) == nv] or cands
    exset = {id(c) for c in exakt}
    pool = list({id(c): c for c in (exakt + breit)}.values())
    import difflib
    wv = re.sub('[ًٌٍَُِْٰ]', '', w)
    def score(c):
        s = c.get('pos_lex_logprob') or -99
        lex = re.sub('_\\d+$', '', c['lex'])
        s += 1.5 * difflib.SequenceMatcher(None, re.sub('[ًٌٍَُِْٰ]', '', lex), wv).ratio()
        if ('ّ' in lex) != ('ّ' in w) and c['pos'] in ('noun', 'adj', 'verb'): s -= 1
        if id(c) in exset: s += 3.5
        if c['pos'] in ('noun_prop', 'abbrev'): s -= 3
        if c['pos'] in ('foreign', 'digit', 'punc'): s -= 8
        return s
    best = max(pool, key=score)
    best = dict(best); best['_exakt'] = bool(exakt)
    return best


# --- Kontextabhängige Wahl (BERT-Disambiguierer von CAMeL Tools) ---
_bert = None
def analyse_satz(tokens):
    """Analysen für alle Tokens eines Satzes. Nutzt den Satzkontext; unter den Kandidaten wird bevorzugt, dessen Harakat zum Wort passen."""
    global _bert
    if _bert is None:
        from camel_tools.disambig.bert import BERTUnfactoredDisambiguator
        _bert = BERTUnfactoredDisambiguator.pretrained('msa', top=6)
    clean = [strip_punct(t) for t in tokens]
    idx = [i for i, c in enumerate(clean) if c]
    out = [None] * len(tokens)
    if not idx: return out
    res = _bert.disambiguate([clean[i] for i in idx])
    for i, d in zip(idx, res):
        w = clean[i]; nw = norm(w)
        pick = None
        for a in d.analyses:
            if norm(a.analysis['diac']) == nw: pick = a; break
        exakt = pick is not None
        if pick is None:
            nv = re.sub('[ًٌٍَُِّْٰ]', '', nw)
            for a in d.analyses:
                if re.sub('[ًٌٍَُِّْٰ]', '', norm(a.analysis['diac'])) == nv: pick = a; break
        if pick is None and d.analyses: pick = d.analyses[0]
        if pick is None:
            out[i] = analyse(tokens[i]); continue
        c = dict(pick.analysis)
        if c.get('gloss') == 'NO_ANALYSIS' or c.get('pos') in ('foreign', 'punc', 'digit') and not re.search('[0-9٠-٩]', w):
            alt = analyse(tokens[i])
            if alt: c = alt; exakt = alt['_exakt']
        c['_exakt'] = exakt
        out[i] = c
    return out
