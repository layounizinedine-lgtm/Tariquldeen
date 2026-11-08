import argparse, json, pathlib
from engines import ENGINES

ap = argparse.ArgumentParser()
ap.add_argument("--ref", required=True); ap.add_argument("--ref-text", required=True)
ap.add_argument("--engines", default="silma")
ap.add_argument("--saetze", default="../../src/data/yusuf-saetze-a2.json")
a = ap.parse_args()
saetze = json.loads(pathlib.Path(a.saetze).read_text(encoding="utf-8"))[:5]  # 5 Testsätze
ref_text = pathlib.Path(a.ref_text).read_text(encoding="utf-8").strip()
for name in a.engines.split(","):
    eng = ENGINES[name](a.ref, ref_text)
    out = pathlib.Path("out/vergleich") / name; out.mkdir(parents=True, exist_ok=True)
    for s in saetze:
        eng.synth(s["ar"], out / f"{s['id']}.wav"); print(name, s["id"])
