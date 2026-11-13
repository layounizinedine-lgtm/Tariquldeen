"""Hilfsfunktion zum Anlegen von Biografie-Dateien (content/biografien/<id>.json).
Jeder Satz: (arabisch mit Harakat, deutsch, page_id[, book_id]). Jedes Zitat: wörtlicher Ausschnitt aus content/quellen/<id>.json."""
import json, os, sys
SIYAR = 10906
def bio(gid, saetze, zitate, werk_kurz="Siyar", book=SIYAR, niveau="B1", hinweis=None):
    d = {"id": gid, "niveau": niveau, "werk_kurz": werk_kurz, "hinweis": hinweis,
         "saetze": [{"ar": s[0], "de": s[1], "page_id": s[2], "book_id": s[3] if len(s) > 3 else book} for s in saetze],
         "zitate": [{"typ": z[0], "text_ar": z[1], "text_de": z[2], "page_id": z[3], "einstufung": z[4] if len(z) > 4 else None, "book_id": z[5] if len(z) > 5 else book} for z in zitate]}
    p = os.path.join(os.path.dirname(__file__), 'biografien', f'{gid}.json')
    json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('geschrieben', p, len(saetze), 'Sätze', len(zitate), 'Zitate')
