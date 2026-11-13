# Audio-Erzeugung (läuft auf einem Rechner mit GPU, nicht im Browser)

1. `pip install silma-tts faster-whisper` (SILMA: `apt install ffmpeg` nötig)
2. **Referenzstimme:** nur eine Aufnahme verwenden, deren Sprecher *schriftlich* zugestimmt hat.
   Keine bekannten Qurra oder Sprecher ohne Erlaubnis nachbilden. Ziel: ruhiger, würdevoller Fusha-Erzählstil.
   Lege sie als `ref.wav` (+ exakte Transkription in `ref.txt`) ab.
3. **Stimmen testen** (5 Beispielsätze aus den Geschichten):
   `python compare_voices.py --ref ref.wav --ref-text ref.txt` → `out/vergleich/<engine>/*.wav`
   Hör auf: Aussprache der Harakat, Natürlichkeit, Tempo. SILMA ist vorbereitet; Chatterbox
   und Habibi-TTS sind als Adapter-Stub in `engines.py` markiert (Lizenz vor Nutzung prüfen).
4. **Erzeugen:** `python generate_audio.py --saetze ../../src/data/yusuf-saetze-a2.json --ziel yusuf/A2 --ref ref.wav --ref-text ref.txt`
   → `public/audio/yusuf/A2/<id>.wav` und `src/data/yusuf-audio.json` (Wort-Zeitstempel).
   Danach in `src/data/yusuf.ts` das Flag `audio_platzhalter` entfernen.
5. Ayat werden **nie** per KI vorgelesen – nur echte Rezitation (Quran.com/EveryAyah) mit Qari-Nennung.

Nicht getestet in der Entwicklungsumgebung (keine GPU, keine Modellgewichte): erster Lauf bitte mit
wenigen Sätzen prüfen. Die Zeitstempel sind Whisper-Schätzungen und müssen stichprobenartig gehört werden.
