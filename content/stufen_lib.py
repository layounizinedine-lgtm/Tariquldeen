import json, os
P = os.path.join(os.path.dirname(__file__), 'stufen.json')
def speichere(ST):
    """ST: {geschichte: {stufe: [(ar, de, beleg) | ("#", kapiteltitel)]}} -> content/stufen.json (ergänzt/ersetzt)."""
    out = json.load(open(P, encoding='utf-8')) if os.path.exists(P) else {}
    for gid, lv in ST.items():
        out[gid] = {}
        for k, v in lv.items():
            kap, arr = None, []
            for it in v:
                if it[0] == "#": kap = it[1]; continue
                a, d, b = it
                arr.append({"ar": a, "de": d, "beleg": b if b[:2] in ("B:", "H:") else "Quran " + b, **({"kapitel": kap} if kap else {})})
            out[gid][k] = arr
    json.dump(out, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print({g: {k: len(v) for k, v in lv.items()} for g, lv in ST.items()})


def ergaenze(ST, kapitel="Überlieferungen (Ahadith)"):
    """Hängt Sätze an bestehende Stufen an (z. B. Hadith-Zusammenfassungen). Beleg-Format: 'H:<zitat-id>[,<zitat-id>]'."""
    out = json.load(open(P, encoding='utf-8'))
    for gid, lv in ST.items():
        for k, v in lv.items():
            arr = out.setdefault(gid, {}).setdefault(k, [])
            for a, d, b in v:
                arr.append({"ar": a, "de": d, "beleg": b, "kapitel": kapitel})
    json.dump(out, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print({g: {k: len(v) for k, v in lv.items()} for g, lv in ST.items()})
