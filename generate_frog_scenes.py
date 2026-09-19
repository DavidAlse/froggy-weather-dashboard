from pathlib import Path
from collections import defaultdict
import json

frog_dir = Path("frontend/public/images/frogs/wide") #square or wide path

groups = defaultdict(set)

for file in frog_dir.glob("*.png"):
    stem = file.stem

    if stem.endswith("_bg"):
        groups[stem[:-3]].add("bg")
    elif stem.endswith("_mg"):
        groups[stem[:-3]].add("mg")
    elif stem.endswith("_fg"):
        groups[stem[:-3]].add("fg")

valid = []

for base, layers in sorted(groups.items()):
    if {"bg", "mg", "fg"} <= layers:
        valid.append(base)

print(json.dumps(valid, indent=2))