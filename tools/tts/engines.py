"""Adapter für TTS-Engines. Jede Engine: synth(text, out_wav) -> None."""
import pathlib

class Silma:
    name = "silma"
    def __init__(self, ref, ref_text):
        from silma_tts.api import SilmaTTS  # MIT-Code, Apache-2.0-Gewichte
        self.t, self.ref, self.ref_text = SilmaTTS(), ref, ref_text
    def synth(self, text, out):
        self.t.infer(ref_file=self.ref, ref_text=self.ref_text, gen_text=text, file_wave=str(out), seed=42, speed=1)

class Chatterbox:  # TODO: Adapter (Chatterbox Multilingual, MIT) – nach Test mit SILMA entscheiden
    name = "chatterbox"
    def __init__(self, *a): raise NotImplementedError("Adapter noch nicht umgesetzt")

class Habibi:  # TODO: Habibi-TTS (SWivid) – Lizenz vor Nutzung prüfen
    name = "habibi"
    def __init__(self, *a): raise NotImplementedError("Adapter noch nicht umgesetzt")

ENGINES = {"silma": Silma, "chatterbox": Chatterbox, "habibi": Habibi}
