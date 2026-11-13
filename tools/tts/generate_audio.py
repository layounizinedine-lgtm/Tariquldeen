"""Erzeugt pro Satz eine WAV-Datei + Wort-Zeitstempel (faster-whisper) im Format von src/data/yusuf-audio.json."""
import argparse, json, pathlib, re
from engines import ENGINES

root = pathlib.Path(__file__).resolve().parents[2]
ap = argparse.ArgumentParser()
ap.add_argument("--saetze", required=True); ap.add_argument("--ziel", required=True)  # z. B. yusuf/A2
ap.add_argument("--ref", required=True); ap.add_argument("--ref-text", required=True)
ap.add_argument("--engine", default="silma")
ap.add_argument("--meta", default=str(root / "src/data/yusuf-audio.json"))
a = ap.parse_args()

from faster_whisper import WhisperModel
whisper = WhisperModel("large-v3", device="cuda", compute_type="float16")
eng = ENGINES[a.engine](a.ref, pathlib.Path(a.ref_text).read_text(encoding="utf-8").strip())
out_dir = root / "public/audio" / a.ziel; out_dir.mkdir(parents=True, exist_ok=True)
strip = lambda w: re.sub(r"[ً-ٰٟ.,:؟!]", "", w)

meta = {}
for s in json.loads(pathlib.Path(a.saetze).read_text(encoding="utf-8")):
    wav = out_dir / f"{s['id']}.wav"; eng.synth(s["ar"], wav)
    segs, _ = whisper.transcribe(str(wav), language="ar", word_timestamps=True)
    heard = [w for sg in segs for w in sg.words]
    words = s["ar"].split()
    if len(heard) == len(words):  # 1:1 – Zeitstempel direkt übernehmen
        ts = [{"wort_index": i, "start": round(w.start, 3), "ende": round(w.end, 3)} for i, w in enumerate(heard)]
    else:  # Fallback: Gesamtdauer proportional zur Wortlänge verteilen -> bitte manuell prüfen
        total = heard[-1].end if heard else 0.0; lens = [max(1, len(strip(w))) for w in words]
        t, ts = (heard[0].start if heard else 0.0), []
        for i, l in enumerate(lens):
            d = (total - (heard[0].start if heard else 0)) * l / sum(lens)
            ts.append({"wort_index": i, "start": round(t, 3), "ende": round(t + d, 3)}); t += d
        print("WARNUNG: Wortzahl weicht ab, Zeitstempel geschätzt:", s["id"])
    meta[s["id"]] = {"audio_url": f"/audio/{a.ziel}/{s['id']}.wav", "wort_zeitstempel": ts}
pathlib.Path(a.meta).write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
