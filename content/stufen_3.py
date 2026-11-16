import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from yusuf_a import YA
from yusuf_b import YB
from stufen_lib import speichere
speichere({"yusuf": {k: YA[k] + YB[k] for k in YA}})
