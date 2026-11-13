"""Erzeugt PLATZHALTER-Audio (Testtöne, KEINE Stimme) samt Wort-Zeitstempeln,
nur zum Testen von Player, Tempo und Mitlese-Hervorhebung.
Echte Audios entstehen mit tools/tts/generate_audio.py."""
import json, math, struct, wave, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
src = json.loads((root / "src/data/yusuf-saetze-a2.json").read_text(encoding="utf-8"))
out_dir = root / "public/audio/yusuf/A2"
out_dir.mkdir(parents=True, exist_ok=True)
SR = 16000
meta = {}
for s in src:
    words = s["ar"].split()
    frames, t, ts = [], 0.0, []
    for i, w in enumerate(words):
        dur = 0.25 + 0.06 * len(re.sub(r"[ً-ٰٟ.,:]", "", w))
        f = 300 + 40 * (i % 5)
        n = int(SR * dur)
        for k in range(n):
            env = min(1, k / 400, (n - k) / 400)
            frames.append(int(9000 * env * math.sin(2 * math.pi * f * k / SR)))
        ts.append({"wort_index": i, "start": round(t, 3), "ende": round(t + dur, 3)})
        t += dur
        gap = int(SR * 0.08); frames.extend([0] * gap); t += 0.08
    with wave.open(str(out_dir / f"{s['id']}.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(struct.pack(f"<{len(frames)}h", *frames))
    meta[s["id"]] = {"audio_url": f"/audio/yusuf/A2/{s['id']}.wav", "wort_zeitstempel": ts}
(root / "src/data/yusuf-audio.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(meta), "Dateien")
