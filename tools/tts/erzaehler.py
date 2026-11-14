"""Erzählerstimme für eine Geschichte erzeugen (Chatterbox Multilingual, MIT-Lizenz, kostenlos; läuft auf CPU und GPU).

  python tools/tts/erzaehler.py <geschichte-id> [--stimme A_ruhig|B_neutral|C_langsam] [--max N]

Liest src/data/geschichten/<id>.json, vertont alle Sätze der Nacherzählungen (nicht die Quran-Verse – die kommen von einem Qari),
schreibt public/audio/<id>/<satz-id>.mp3 und public/audio/<id>/meta.json (Zeitstempel je Wort, per faster-whisper).
Bereits vorhandene Sätze werden übersprungen (fortsetzbar).

Erkenntnis aus Tests: Chatterbox spricht Arabisch DEUTLICH besser OHNE Harakat. Daher wird der Text ohne Vokalzeichen vorgelesen;
angezeigt wird weiterhin der Text mit Harakat. Standardstimme des Modells (kein Klonen einer realen Person).
"""
import argparse, json, os, re, subprocess, sys, tempfile
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
STIMMEN = {
    'A_ruhig': dict(exaggeration=0.3, cfg_weight=0.3, temperature=0.7),
    'B_neutral': dict(exaggeration=0.5, cfg_weight=0.5, temperature=0.8),
    'C_langsam': dict(exaggeration=0.25, cfg_weight=0.2, temperature=0.6),
}
# Tiefere, ältere Erzählerstimme: Basis = C_langsam, danach Tonhöhe senken (Tempo bleibt) + Klangfarbe (Bässe wärmer, Höhen weicher).
# Reine Signalbearbeitung der Standardstimme – es wird keine reale Person nachgebildet.
NACH = {  # (Tonhöhen-Faktor, zusätzliche ffmpeg-Filter)
    'D1_tief': (0.89, 'equalizer=f=140:t=q:w=1:g=3,lowpass=f=7500'),
    'D2_tiefer': (0.82, 'equalizer=f=130:t=q:w=1:g=4,equalizer=f=4500:t=h:w=2000:g=-4,lowpass=f=7000'),
    'D3_alt': (0.78, 'equalizer=f=120:t=q:w=1:g=5,equalizer=f=4000:t=h:w=2000:g=-5,lowpass=f=6500'),
}
for _k in NACH: STIMMEN[_k] = STIMMEN['C_langsam']
HARAKAT = re.compile(r'[ً-ٰٟـ]')

def tts_text(t: str) -> str:
    t = t.replace('ﷺ', ' صلى الله عليه وسلم ')
    t = HARAKAT.sub('', t)
    t = re.sub(r'[()\[\]«»"“”]', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()

def woerter_zeitstempel(whisper, wav, anzeige_tokens):
    segs, _ = whisper.transcribe(wav, language='ar', word_timestamps=True)
    ws = [w for s in segs for w in s.words]
    n = len(anzeige_tokens)
    if not ws: return None
    if len(ws) == n:  # 1:1
        return [dict(wort_index=i, start=round(w.start, 3), ende=round(w.end, 3)) for i, w in enumerate(ws)]
    # Fallback: Gesamtdauer proportional zur Wortlänge verteilen
    a, b = ws[0].start, ws[-1].end
    lens = [max(1, len(HARAKAT.sub('', t))) for t in anzeige_tokens]
    t0, out = a, []
    for i, l in enumerate(lens):
        d = (b - a) * l / sum(lens)
        out.append(dict(wort_index=i, start=round(t0, 3), ende=round(t0 + d, 3))); t0 += d
    return out

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('id'); ap.add_argument('--stimme', default='D2_tiefer'); ap.add_argument('--max', type=int, default=0)
    a = ap.parse_args()
    g = json.load(open(os.path.join(ROOT, 'src/data/geschichten', f'{a.id}.json'), encoding='utf-8'))
    saetze = [s for niv, f in g['fassungen'].items() if niv != 'klassisch' for s in f['saetze'] if not s.get('zitat_id')]
    out_dir = os.path.join(ROOT, 'public/audio', a.id); os.makedirs(out_dir, exist_ok=True)
    meta_p = os.path.join(out_dir, 'meta.json')
    meta = json.load(open(meta_p, encoding='utf-8')) if os.path.exists(meta_p) else {}
    todo = [s for s in saetze if s['id'] not in meta]
    if a.max: todo = todo[:a.max]
    if not todo: print('nichts zu tun'); return
    import torch, torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    from faster_whisper import WhisperModel
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    tts = ChatterboxMultilingualTTS.from_pretrained(device=dev)
    whisper = WhisperModel('small', device=dev, compute_type='float16' if dev == 'cuda' else 'int8')
    for s in todo:
        torch.manual_seed(7)
        wav = tts.generate(tts_text(s['text_ar_mit_harakat']), language_id='ar', **STIMMEN[a.stimme])
        tmp = tempfile.mktemp(suffix='.wav'); ta.save(tmp, wav, tts.sr)
        if a.stimme in NACH:
            f, eq = NACH[a.stimme]; tmp2 = tempfile.mktemp(suffix='.wav')
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-af', f'asetrate={int(tts.sr * f)},aresample={tts.sr},atempo={round(1 / f, 4)},{eq}', '-ac', '1', tmp2], check=True)
            os.replace(tmp2, tmp)
        mp3 = os.path.join(out_dir, f"{s['id']}.mp3")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-ac', '1', '-b:a', '48k', mp3], check=True)
        ts = woerter_zeitstempel(whisper, tmp, s['text_ar_mit_harakat'].split()); os.remove(tmp)
        meta[s['id']] = dict(audio_url=f"/audio/{a.id}/{s['id']}.mp3", wort_zeitstempel=ts, stimme=a.stimme)
        json.dump(meta, open(meta_p, 'w', encoding='utf-8'), ensure_ascii=False)  # nach jedem Satz speichern
        print('ok', a.id, s['id'], flush=True)

if __name__ == '__main__': main()
