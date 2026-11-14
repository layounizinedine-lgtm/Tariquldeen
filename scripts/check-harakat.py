"""Prüft die selbst geschriebenen Nacherzählungen (B1/A2) auf typische Harakat-Fehler.
Meldet: Wörter mit zu wenig Vokalzeichen, doppelte Vokalzeichen, Schadda ohne Vokal, Tanwin mitten im Wort."""
import json, glob, re, sys
H = 'ًٌٍَُِْ'   # Tanwin + kurze Vokale + Sukun
SH = 'ّ'
LET = re.compile(r'[ء-ي]')
probleme = []
def pruefe(gid, sid, text):
    for w in re.findall(r'[ء-يً-ْٰ]+', text):
        letters = LET.findall(w)
        if len(letters) < 2: continue
        # Buchstaben, die üblicherweise kein Zeichen tragen: ا (außer Hamza), ى am Ende, و/ي als Dehnung, ل in "ال"
        voc = 0; need = 0
        for i, ch in enumerate(w):
            if not LET.match(ch): continue
            nxt = w[i+1:i+3]
            stumm = ch in 'اى' or (ch in 'وي' and i > 0 and w[i-1] in 'ُِ') or (ch == 'ل' and w[:i].endswith('ا') and i <= 2)
            if stumm: continue
            need += 1
            if any(c in H or c == SH for c in nxt[:2]): voc += 1
        if need and voc / need < 0.6: probleme.append((gid, sid, w, 'wenig Harakat'))
        if re.search(f'[{H}][{H}]', w): probleme.append((gid, sid, w, 'doppelte Harakat'))
        if re.search(f'(?<![{H}]){SH}(?![{H}])', w): probleme.append((gid, sid, w, 'Schadda ohne Vokal'))
        if re.search('[ًٌٍ](?=[ء-ي])', w) and not re.search('ًا$|ًى$', w): probleme.append((gid, sid, w, 'Tanwin mitten im Wort'))
for f in [x for x in glob.glob('src/data/geschichten/*.json') if not x.endswith('index.json')]:
    g = json.load(open(f))
    for niv, fa in g.get('fassungen', {}).items():
        if niv == 'klassisch': continue
        for s in fa['saetze']: pruefe(g['id'], s['id'], s['text_ar_mit_harakat'])
for x in probleme: print(*x, sep=' | ')
print(len(probleme), 'Hinweise', file=sys.stderr)
