import urllib.request
import json
import os
from bs4 import BeautifulSoup

FORM_TRANSLATION = {
    "Gmax": "거다이맥스",
    "Mega": "메가",
    "Mega X": "메가 X",
    "Mega Y": "메가 Y",
    "Alola": "알로라",
    "Galar": "가라르",
    "Hisui": "히스이",
    "Paldea": "팔데아",
    "Paldea-Combat-Breed": "팔데아-컴뱃종",
    "Paldea-Blaze-Breed": "팔데아-블레이즈종",
    "Paldea-Aqua-Breed": "팔데아-워터종",
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
    "Average": "보통사이즈",
    "Small": "작은사이즈",
    "Large": "큰사이즈",
    "Super": "특대사이즈",
    "Female": "암컷",
    "Male": "수컷",
    "Eternal": "영원의꽃",
}

def get_form_string(name, f):
    if not f: return ""
    
    if name == "Rotom":
        if f == "h": return "Heat"
        if f == "f": return "Wash" 
        if f == "s": return "Fan"
        if f == "m": return "Mow"
    if name == "Gourgeist":
        if f == "s": return "Small"
        if f == "l": return "Large"
        if f == "h": return "Super"
    if name == "Tauros":
        if f == "p": return "Paldea-Combat-Breed"
        if f == "b": return "Paldea-Blaze-Breed"
        if f == "a": return "Paldea-Aqua-Breed"
    if name == "Meowstic":
        if f == "f": return "Female"
    if name == "Lycanroc":
        if f == "m": return "Midnight"
        if f == "d": return "Dusk"
        return "Midday"
        
    if f == "m": return "Mega"
    if f == "mx": return "Mega X"
    if f == "my": return "Mega Y"
    if f == "a": return "Alola"
    if f == "g": return "Gmax"
    if f == "b": return "Blade"
    if f == "d": return "Defense" 
    if f == "h": return "Hisui"
    if f == "e": return "Eternal"
    return f.title()

def get_korean_base_names(old_data):
    name_map = {}
    
    name_map["mr. mime"] = "마임맨"
    name_map["mr. rime"] = "마임꽁꽁"
    name_map["mime jr."] = "흉내내"
    name_map["type: null"] = "타입:널"
    name_map["farfetch'd"] = "파오리" 
    name_map["sirfetch'd"] = "창파나이트"
    name_map["flabébé"] = "플라베베"

    for p in old_data:
        eng_name = p['name'].split('-')[0].lower() 
        base_ko = p.get('_baseKoreanName') or p['koreanName'].split('-')[0]
        name_map[eng_name] = base_ko
        name_map[p['name'].lower()] = base_ko
        
    manual = {
        "kommo-o": "짜랑고우거",
        "hakamo-o": "짜랑고우",
        "jangmo-o": "짜랑꼬",
        "ho-oh": "칠색조",
        "porygon-z": "폴리곤Z",
        "ting-lu": "딩루",
        "chien-pao": "파오젠",
        "wo-chien": "총지엔",
        "chi-yu": "위유이",
        "tapu koko": "카푸꼬꼬꼭",
        "tapu lele": "카푸나비나",
        "tapu bulu": "카푸브루루",
        "tapu fini": "카푸느지느",
        "basculegion": "대쓰여너",
        "maushold": "파밀리쥐",
        "mimikyu": "따라큐",
        "morpeko": "모르페코",
        "aegislash": "킬가르도",
        "palafin": "돌핀맨",
        "meowstic": "냐오닉스",
        "lycanroc": "루가루암",
        "gourgeist": "펌킨인",
        "flabebe": "플라베베"
    }
    for k, v in manual.items():
        name_map[k.lower()] = v
        
    return name_map

def scrape_serebii():
    url = "https://serebii.net/pokedex-champions/stat/sp-attack.shtml"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    print(f"Fetching data from {url} ...")
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('iso-8859-1')

    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('table', {'class': 'dextable'})
    data = []

    if tables:
        for tr in tables[0].find_all('tr')[1:]:
            tds = tr.find_all('td', recursive=False)
            if len(tds) > 10:
                try:
                    dex_no = int(tds[0].text.strip().replace('#', ''))
                except ValueError:
                    continue
                name = tds[2].text.strip()
                
                type_td = tds[3] if len(tds)>3 else None
                types = []
                if type_td:
                    for img in type_td.find_all('img'):
                        if 'type' in img.get('src', ''):
                            t = img['src'].split('/')[-1].split('.')[0].title()
                            types.append(t)
                
                try:
                    hp = int(tds[5].text.strip())
                    atk = int(tds[6].text.strip())
                    df = int(tds[7].text.strip())
                    spa = int(tds[8].text.strip())
                    spd = int(tds[9].text.strip())
                    spe = int(tds[10].text.strip())
                except Exception as e:
                    continue

                img_tag = tr.find('img', src=lambda s: s and '/icon/' in s)
                form_code = ""
                if img_tag:
                    icon_src = img_tag['src']
                    parts = icon_src.split('/')[-1].split('.')[0].split('-')
                    if len(parts) > 1:
                        form_code = parts[1]
                
                data.append({
                    "dex_no": dex_no,
                    "name": name,
                    "form_code": form_code,
                    "types": types,
                    "stats": {
                        "hp": hp,
                        "attack": atk,
                        "defense": df,
                        "spAttack": spa,
                        "spDefense": spd,
                        "speed": spe
                    }
                })
    return data

def main():
    old_data = []
    if os.path.exists("src/data/pokemon.json"):
        with open("src/data/pokemon.json", "r", encoding="utf-8") as f:
            old_data = json.load(f)
            
    base_korean_names = get_korean_base_names(old_data)
    
    serebii_data = scrape_serebii()
    processed_data = []
    
    for p in serebii_data:
        eng_name = p['name']
        form_code = p['form_code']
        form_str = get_form_string(eng_name, form_code)
        
        lower_name = eng_name.lower()
        base_ko = base_korean_names.get(lower_name)
        if not base_ko:
            clean_name = lower_name.replace("'", "").replace(".", "")
            base_ko = base_korean_names.get(clean_name, eng_name) 
            
        form_ko = FORM_TRANSLATION.get(form_str, form_str) if form_str else ""
        korean_name = f"{base_ko}-{form_ko}" if form_ko else base_ko
        
        if form_str:
            pk = f"{lower_name}-{form_str.lower().replace(' ', '-')}"
        else:
            pk = lower_name
            
        pk = pk.replace("'", "").replace(".", "")
            
        new_entry = {
            "id": pk,
            "pokedexNumber": p['dex_no'],
            "name": eng_name,
            "koreanName": korean_name,
            "_baseKoreanName": base_ko,
            "form": form_str,
            "types": p['types'],
            "baseStats": p['stats']
        }
        processed_data.append(new_entry)
        
    
    # Deduplicate forms with identical stats and types
    deduped = []
    seen = set()
    for p in processed_data:
        sig = (
            p['pokedexNumber'],
            tuple(sorted(p['types'])),
            p['baseStats']['hp'],
            p['baseStats']['attack'],
            p['baseStats']['defense'],
            p['baseStats']['spAttack'],
            p['baseStats']['spDefense'],
            p['baseStats']['speed']
        )
        if sig not in seen:
            seen.add(sig)
            deduped.append(p)
            
    print(f"Processed {len(deduped)} unique entries (removed {len(processed_data) - len(deduped)} duplicates).")
    
    os.makedirs("src/data", exist_ok=True)
    with open("src/data/pokemon.json", "w", encoding="utf-8") as f:
        json.dump(deduped, f, indent=2, ensure_ascii=False)
    print("Saved to src/data/pokemon.json")

if __name__ == "__main__":
    main()
