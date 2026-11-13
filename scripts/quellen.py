"""Recherche-Werkzeug für klassische Werke über die turath.io-API (Shamela-Texte).

  python3 scripts/quellen.py find <book_id> <muster>          # Überschriften suchen
  python3 scripts/quellen.py read <book_id> <page_id> [n] [maxzeichen]  # n Seiten lesen (mit Band/Seite)
  python3 scripts/quellen.py meta <book_id>                   # Titel/Edition
  python3 scripts/quellen.py save <id> <book_id> <page_id> <n>  # Seiten wörtlich nach content/quellen/<id>.json sichern

Texte werden in content/.cache/turath/ zwischengespeichert. Fußnoten der Herausgeber werden abgeschnitten.
"""
import json, os, re, sys, time, urllib.request, html, ssl

CACHE = os.path.join(os.path.dirname(__file__), '..', 'content', '.cache', 'turath')
os.makedirs(CACHE, exist_ok=True)
_CA = os.environ.get('SSL_CERT_FILE') or ('/root/.ccr/ca-bundle.crt' if os.path.exists('/root/.ccr/ca-bundle.crt') else None)
CTX = ssl.create_default_context(cafile=_CA) if _CA else ssl.create_default_context()

def _get(url, path):
    if os.path.exists(path):
        return json.load(open(path, encoding='utf-8'))
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'tariq-al-din-recherche'}), timeout=40, context=CTX) as r:
                d = json.loads(r.read().decode('utf-8'))
            json.dump(d, open(path, 'w', encoding='utf-8'), ensure_ascii=False)
            return d
        except Exception as e:  # noqa
            time.sleep(2 ** i)
    raise SystemExit('Abruf fehlgeschlagen: ' + url)

def index(book):
    return _get(f'https://api.turath.io/book?id={book}&include=indexes', f'{CACHE}/{book}-index.json')

def page(book, pg):
    d = _get(f'https://api.turath.io/page?book_id={book}&pg={pg}', f'{CACHE}/{book}-{pg}.json')
    meta = json.loads(d['meta']) if isinstance(d['meta'], str) else d['meta']
    return meta, clean(d['text'])

def clean(t):
    t = re.sub(r'<[^>]+>', '', t)
    t = html.unescape(t)
    t = t.split('__________')[0]          # Fußnoten des Herausgebers abtrennen
    t = re.sub(r'\(\d+\)|\[\d+\]', '', t)  # Fußnoten-Marker
    t = re.sub(r'[ \t]+', ' ', t)
    return t.strip()

if __name__ == '__main__':
    cmd, book = sys.argv[1], sys.argv[2]
    if cmd == 'meta':
        m = index(book)['meta']; print(m['name']); print(m.get('info', '')[:400])
    elif cmd == 'find':
        pat = sys.argv[3]
        for i, h in enumerate(index(book)['indexes']['headings']):
            if re.search(pat, h['title']):
                print(i, h['level'], h['page'], h['title'][:90])
    elif cmd == 'save':
        gid, book = sys.argv[2], sys.argv[3]; start, n = int(sys.argv[4]), int(sys.argv[5])
        os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'content', 'quellen'), exist_ok=True)
        ziel = os.path.join(os.path.dirname(__file__), '..', 'content', 'quellen', f'{gid}.json')
        alt = json.load(open(ziel, encoding='utf-8')) if os.path.exists(ziel) else {'id': gid, 'seiten': []}
        werk = index(book)['meta']['name']
        have = {(x['book_id'], x['page_id']) for x in alt['seiten']}
        for pg in range(start, start + n):
            if (int(book), pg) in have: continue
            meta, t = page(book, pg)
            alt['seiten'].append({'book_id': int(book), 'werk': werk, 'page_id': pg, 'band': str(meta.get('vol')), 'seite': meta.get('page'), 'text': t})
        json.dump(alt, open(ziel, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print('gesichert:', ziel, len(alt['seiten']), 'Seiten')
    elif cmd == 'read':
        start = int(sys.argv[3]); n = int(sys.argv[4]) if len(sys.argv) > 4 else 1
        mx = int(sys.argv[5]) if len(sys.argv) > 5 else 100000
        out = ''
        for pg in range(start, start + n):
            meta, t = page(book, pg)
            out += f"\n=== page_id {pg} | Band {meta.get('vol')} S. {meta.get('page')} ===\n{t}\n"
        print(out[:mx])
