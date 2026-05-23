import urllib.request
import json
import os

FORM_TRANSLATION = {
    "Gmax": "거다이맥스",
    "Mega": "메가",
    "Mega X": "메가 X",
    "Mega Y": "메가 Y",
    "Alola": "알로라",
    "Galar": "가라르",
    "Hisui": "히스이",
    "Paldea": "팔데아",
    "Primal": "원시",
    "Origin": "오리진",
    "Therian": "영물",
    "Incarnate": "화신",
    "Altered": "어나더",
    "Zen": "달마모드",
    "Galar-Zen": "가라르-달마모드",
    "Ash": "지우",
    "Eternamax": "무한다이맥스",
    "Single-Strike": "일격",
    "Rapid-Strike": "연격",
    "Midday": "한낮",
    "Midnight": "한밤중",
    "Dusk": "황혼",
    "Dawn": "새벽",
    "Ultra": "울트라",
    "Crowned": "검왕",
    "10": "10%",
    "50": "50%",
    "Complete": "퍼펙트",
    "Attack": "어택",
    "Defense": "디펜스",
    "Speed": "스피드",
    "Normal": "노말",
    "Blade": "블레이드",
    "Shield": "실드",
    "Sandy": "모래땅",
    "Trash": "슈레기",
    "Plant": "초목",
    "Sky": "스카이",
    "Land": "랜드",
    "Hero": "마이티",
    "Zero": "나이브",
    "Black": "블랙",
    "White": "화이트",
    "Active": "액티브",
    "Aria": "보이스",
    "Pirouette": "스텝",
    "Hangry": "배고픈",
    "Full-Belly": "배부른",
    "Gorging": "꿀꺽",
    "Gulping": "우그욱",
    "Amped": "하이",
    "Low-Key": "로우",
    "Noice": "나이스",
    "Ice": "백마탄",
    "Shadow": "흑마탄",
    "Heat": "히트",
    "Wash": "워시",
    "Mow": "커트",
    "Fan": "스핀",
    "Frost": "프로스트",
    "Standard": "노말",
    "Original": "오리지널",
    "Totem": "주인",
    "Totem-Alola": "주인-알로라",
    "Sunny": "포지티브",
    "Rainy": "빗방울",
    "Snowy": "설운",
    "Busted": "들킨",
    "Disguised": "탈",
    "Original-Cap": "오리지널캡",
    "Hoenn-Cap": "호연캡",
    "Sinnoh-Cap": "신오캡",
    "Unova-Cap": "하나캡",
    "Kalos-Cap": "칼로스캡",
    "Alola-Cap": "알로라캡",
    "Partner-Cap": "너로정했다캡",
    "World-Cap": "월드캡",
    "Cosplay": "옷갈아입기",
    "Rock-Star": "하드록",
    "Belle": "마담",
    "Pop-Star": "아이돌",
    "Phd": "닥터",
    "Libre": "마스크드",
    "Combat-Breed": "컴뱃종",
    "Blaze-Breed": "블레이즈종",
    "Aqua-Breed": "워터종",
    "Average": "보통사이즈",
    "Small": "작은사이즈",
    "Large": "큰사이즈",
    "Super": "특대사이즈",
    "Red-Striped": "적색근",
    "Blue-Striped": "청색근",
    "White-Striped": "백색근",
    "Battle-Bond": "유대변화",
    "Overcast": "네거티브",
    "West": "서쪽바다",
    "East": "동쪽바다",
    "Baile": "이글이글",
    "Pom-Pom": "파칙파칙",
    "Pau": "훌라훌라",
    "Sensu": "하늘하늘",
    "Red-Meteor": "유성",
    "Orange-Meteor": "유성",
    "Yellow-Meteor": "유성",
    "Green-Meteor": "유성",
    "Blue-Meteor": "유성",
    "Indigo-Meteor": "유성",
    "Violet-Meteor": "유성",
    "Red": "빨강코어",
    "Orange": "주황코어",
    "Yellow": "노랑코어",
    "Green": "초록코어",
    "Blue": "파랑코어",
    "Indigo": "남색코어",
    "Violet": "보라코어",
    "Phony": "가품",
    "Antique": "진품",
    "Green-Plumage": "초록깃털",
    "Blue-Plumage": "파랑깃털",
    "Yellow-Plumage": "노랑깃털",
    "White-Plumage": "하얀깃털",
    "Curly": "젖혀진",
    "Droopy": "쳐진",
    "Stretchy": "뻗은",
    "Teal-Mask": "벽록가면",
    "Wellspring-Mask": "우물가면",
    "Hearthflame-Mask": "화덕가면",
    "Cornerstone-Mask": "주춧돌가면",
    "Terastal": "테라스탈",
    "Stellar": "스텔라",
    "Chest": "상자",
    "Roaming": "도보",
    "Two-Segment": "두마디",
    "Three-Segment": "세마디",
    "Family-Of-Four": "네식구",
    "Family-Of-Three": "세식구",
    "Ordinary": "평소",
    "Resolute": "각오",
    "Bloodmoon": "다투곰",
    "Paldea-Combat-Breed": "팔데아-컴뱃종",
    "Paldea-Blaze-Breed": "팔데아-블레이즈종",
    "Paldea-Aqua-Breed": "팔데아-워터종",
    "Starter": "파트너",
    "Power-Construct": "스웜체인지",
    "Confined": "굴레에빠진",
    "Unbound": "굴레를벗어난",
    "Own-Tempo": "마이페이스",
    "School": "군집",
    "Solo": "단독",
    "Vanilla-Cream-Strawberry-Sweet": "밀키바닐라",
    "Female": "암컷",
    "Male": "수컷",
    "Dada": "아빠",
    "Apex-Build": "완전형태",
    "Gliding-Build": "활공형태",
    "Limited-Build": "제한형태",
    "Sprinting-Build": "질주형태",
    "Swimming-Build": "유영형태",
    "Ultimate-Mode": "컴플리트모드",
    "Aquatic-Mode": "플로트모드",
    "Drive-Mode": "드라이브모드",
    "Glide-Mode": "글라이드모드",
    "Low-Power-Mode": "리미트모드",
    "Counterfeit": "범작",
    "Unremarkable": "범작",
    "A": "A",
    "Spring": "봄",
    "Eternal": "영원의꽃",
    "Natural": "야생",
    "Icy-Snow": "빙설",
    "Meadow": "화원",
    "10-Power-Construct": "10%-스웜체인지",
    "50-Power-Construct": "50%-스웜체인지",
}

def translate_form(form):
    if not form:
        return ""
    if form in FORM_TRANSLATION:
        return FORM_TRANSLATION[form]
    
    parts = form.split("-")
    translated_parts = [FORM_TRANSLATION.get(p, p) for p in parts]
    return "-".join(translated_parts)

def fetch_pokemon_data():
    url = "https://beta.pokeapi.co/graphql/v1beta"
    
    query = """
    query {
      pokemon_v2_pokemon(limit: 2000) {
        id
        name
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
        pokemon_v2_pokemonstats {
          base_stat
          pokemon_v2_stat {
            name
          }
        }
        pokemon_v2_pokemonforms {
          form_name
          name
          is_mega
        }
        pokemon_v2_pokemonspecy {
          id
          pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 3}}) {
            name
          }
        }
      }
    }
    """
    
    req = urllib.request.Request(
        url, 
        data=json.dumps({'query': query}).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['data']['pokemon_v2_pokemon']
    except Exception as e:
        print(f"Error fetching data from PokeAPI: {e}")
        return []

def process_data(raw_data):
    processed = []
    
    for p in raw_data:
        # Pokedex number is species id
        species = p.get('pokemon_v2_pokemonspecy')
        if not species:
            continue
            
        pokedex_num = species['id']
        
        # Base Korean name
        kr_names = species.get('pokemon_v2_pokemonspeciesnames', [])
        base_korean_name = kr_names[0]['name'] if kr_names else p['name']

        
        # Types
        types = [t['pokemon_v2_type']['name'] for t in p.get('pokemon_v2_pokemontypes', [])]
        
        # Stats
        stats_raw = p.get('pokemon_v2_pokemonstats', [])
        stats = {}
        for s in stats_raw:
            stat_name = s['pokemon_v2_stat']['name']
            if stat_name == 'special-attack': stat_name = 'spAttack'
            elif stat_name == 'special-defense': stat_name = 'spDefense'
            stats[stat_name] = s['base_stat']
            
        # Forms & Mega
        forms_raw = p.get('pokemon_v2_pokemonforms', [])
        form_str = ""
        if forms_raw:
            f = forms_raw[0]
            if f['is_mega']:
                if f['form_name'].lower().startswith('mega'):
                    form_str = f['form_name'].title()
                    if '-' in form_str: # e.g. Mega-X -> Mega X
                        form_str = form_str.replace('-', ' ')
                else:
                    form_str = "Mega"
                    if f['form_name']:
                        form_str += f" {f['form_name'].title()}"
            elif f['form_name']:
                form_str = f['form_name'].title()
        
        # Set primary key based on name and form
        pk = p['name']
        
        # Map to official Korean form name
        form_ko = translate_form(form_str)
        korean_name = f"{base_korean_name}-{form_ko}" if form_ko else base_korean_name
        
        data = {
            "id": pk,
            "pokedexNumber": pokedex_num,
            "name": p['name'],
            "koreanName": korean_name,
            "_baseKoreanName": base_korean_name,
            "form": form_str,
            "types": types,
            "baseStats": {
                "hp": stats.get('hp', 0),
                "attack": stats.get('attack', 0),
                "defense": stats.get('defense', 0),
                "spAttack": stats.get('spAttack', 0),
                "spDefense": stats.get('spDefense', 0),
                "speed": stats.get('speed', 0),
            }
        }
        processed.append(data)
        
    # Sort by Pokedex Number, then by ID (to keep base form before megas/alt forms)
    processed.sort(key=lambda x: (x['pokedexNumber'], x['form'] != '', x['id']))
    return processed

def deduplicate_forms(data):
    from collections import defaultdict
    grouped = defaultdict(list)
    
    for p in data:
        pokedex_num = p['pokedexNumber']
        types_tuple = tuple(sorted(p['types']))
        stats_tuple = (
            p['baseStats']['hp'],
            p['baseStats']['attack'],
            p['baseStats']['defense'],
            p['baseStats']['spAttack'],
            p['baseStats']['spDefense'],
            p['baseStats']['speed'],
        )
        signature = (types_tuple, stats_tuple)
        
        # Keep if signature is unique for this pokedex_num
        if not any(sig == signature for sig, _ in grouped[pokedex_num]):
            grouped[pokedex_num].append((signature, p))
            
    deduped = []
    for pokedex_num, kept_forms in grouped.items():
        if len(kept_forms) == 1:
            # Only one form kept. Force base name and empty form.
            form_obj = kept_forms[0][1]
            if '_baseKoreanName' in form_obj:
                form_obj['koreanName'] = form_obj['_baseKoreanName']
                del form_obj['_baseKoreanName']
            form_obj['form'] = ""
            deduped.append(form_obj)
        else:
            for sig, form_obj in kept_forms:
                if '_baseKoreanName' in form_obj:
                    del form_obj['_baseKoreanName']
                deduped.append(form_obj)
                
    deduped.sort(key=lambda x: (x['pokedexNumber'], x['form'] != '', x['id']))
    return deduped

if __name__ == "__main__":
    print("Fetching data from PokeAPI...")
    raw_data = fetch_pokemon_data()
    print(f"Fetched {len(raw_data)} pokemon entries.")
    
    if raw_data:
        processed_data = process_data(raw_data)
        processed_data = deduplicate_forms(processed_data)
        
        print(f"Processed {len(processed_data)} entries.")
        
        # Print first 2 to verify
        print("Sample data:")
        print(json.dumps(processed_data[:2], indent=2, ensure_ascii=False))
        
        # Save to file
        os.makedirs("src/data", exist_ok=True)
        with open("src/data/pokemon.json", "w", encoding="utf-8") as f:
            json.dump(processed_data, f, indent=2, ensure_ascii=False)
        print("Saved to src/data/pokemon.json")
