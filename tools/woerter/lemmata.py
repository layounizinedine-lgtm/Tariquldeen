"""Lemma-Tabelle: bereinigter englischer Gloss je (Lemma, Wortart) + automatische deutsche Übersetzung (opus-mt-en-de).
Manuelle Korrekturen haben Vorrang: content/woerter-de.json  {"lemma|pos": "deutsche Bedeutung"}"""
import re, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from analyse import _an, strip_punct

def bare_gloss(lex, pos, fallback=''):
    from camel_tools.morphology.utils import strip_lex
    l = strip_lex(lex)
    best = None
    for c in _an.analyze(l):
        if strip_lex(c['lex']) == l and c['pos'] == pos and c['enc0'] in ('0', 'na') and all(c.get(k) in ('0', 'na') for k in ('prc0','prc1','prc2','prc3')):
            best = c; break
    g = (best or {}).get('gloss') or fallback
    return clean(g)

def clean(g):
    g = g.split('+')[0] if not g.startswith('+') else g
    g = re.sub(r'\[[^\]]*\]', '', g).replace('_', ' ')
    g = re.sub(r'<[^>]*>', '', g)
    parts = [p.strip() for p in g.split(';') if p.strip() and 'NO ANALYSIS' not in p]
    return ';'.join(parts[:3])

_tok = _mod = None
def uebersetze(liste):
    global _tok, _mod
    if _mod is None:
        from transformers import MarianMTModel, MarianTokenizer
        n = 'Helsinki-NLP/opus-mt-en-de'
        _tok = MarianTokenizer.from_pretrained(n); _mod = MarianMTModel.from_pretrained(n)
    out = []
    for i in range(0, len(liste), 32):
        b = liste[i:i+32]
        enc = _tok(b, return_tensors='pt', padding=True)
        gen = _mod.generate(**enc, num_beams=4, max_length=40)
        out += _tok.batch_decode(gen, skip_special_tokens=True)
    return out
