import json

with open('src/data/pokemon.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# We want to keep only one entry per (pokedexNumber, types, baseStats)
# Or if pokedexNumber is the same, baseStats are the same, and types are the same.
seen = set()
deduped = []
removed = []

for p in data:
    sig = (
        p['pokedexNumber'],
        tuple(sorted(p['types'])),
        p['baseStats']['hp'],
        p['baseStats']['attack'],
        p['baseStats']['defense'],
        p['baseStats']['spAttack'],
        p['baseStats']['spDefense'],
        p['baseStats']['speed'],
    )
    if sig not in seen:
        seen.add(sig)
        deduped.append(p)
    else:
        removed.append(p['koreanName'])

print(f"Removed {len(removed)} duplicate forms:")
for r in removed:
    print(" - " + r)

# If an entry is kept but it's the ONLY form left, we might want to clean up its form name?
# Actually, the user just said "하나로만 합쳐줘" (merge into one / keep only one).
# So simply dropping the duplicates is enough.

with open('src/data/pokemon.json', 'w', encoding='utf-8') as f:
    json.dump(deduped, f, indent=2, ensure_ascii=False)

