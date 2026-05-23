import json

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
    "Crowned": "검왕", # or 방패왕
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
    "Origin": "오리진",
    "Hero": "백전연마", # Hero of Many Battles
    "Black": "블랙",
    "White": "화이트",
    "Active": "액티브",
    "Aria": "보이스",
    "Pirouette": "스텝",
    "Hangry": "배고픈",
    "Full-Belly": "배부른",
    "Gorging": "꿀꺽",
    "Gulping": "우걱",
    "Amped": "하이",
    "Low-Key": "로우",
    "Noice": "나이스",
    "Ice": "아이스",
    "Heat": "히트",
    "Wash": "워시",
    "Mow": "커트",
    "Fan": "스핀",
    "Frost": "프로스트",
    "Standard": "노말",
    "Original": "오리지널",
    "Totem": "주인",
    "Totem-Alola": "주인-알로라",
    "Sunny": "태양",
    "Rainy": "빗방울",
    "Snowy": "설운",
    "Busted": "들킨",
    "Disguised": "탈",
}

def translate_form(form):
    if not form:
        return ""
    if form in FORM_TRANSLATION:
        return FORM_TRANSLATION[form]
    
    # Try partial matching for compound forms like "Galar-Standard"
    parts = form.split("-")
    translated_parts = [FORM_TRANSLATION.get(p, p) for p in parts]
    return "-".join(translated_parts)

def main():
    with open("src/data/pokemon.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    for p in data:
        form_ko = translate_form(p["form"])
        if form_ko:
            # Check if it's already appended to avoid duplication if run multiple times
            if not p["koreanName"].endswith(f"-{form_ko}"):
                p["koreanName"] = f"{p['koreanName']}-{form_ko}"
                
    with open("src/data/pokemon.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()
