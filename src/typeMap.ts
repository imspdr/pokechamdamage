export const TYPE_MAP: Record<string, { ko: string; color: string; textColor: string }> = {
  normal: { ko: '노말', color: '#A8A77A', textColor: '#FFFFFF' },
  fire: { ko: '불꽃', color: '#EE8130', textColor: '#FFFFFF' },
  water: { ko: '물', color: '#6390F0', textColor: '#FFFFFF' },
  electric: { ko: '전기', color: '#F7D02C', textColor: '#000000' },
  grass: { ko: '풀', color: '#7AC74C', textColor: '#000000' },
  ice: { ko: '얼음', color: '#96D9D6', textColor: '#000000' },
  fighting: { ko: '격투', color: '#C22E28', textColor: '#FFFFFF' },
  poison: { ko: '독', color: '#A33EA1', textColor: '#FFFFFF' },
  ground: { ko: '땅', color: '#E2BF65', textColor: '#000000' },
  flying: { ko: '비행', color: '#A98FF3', textColor: '#000000' },
  psychic: { ko: '에스퍼', color: '#F95587', textColor: '#FFFFFF' },
  bug: { ko: '벌레', color: '#A6B91A', textColor: '#000000' },
  rock: { ko: '바위', color: '#B6A136', textColor: '#FFFFFF' },
  ghost: { ko: '고스트', color: '#735797', textColor: '#FFFFFF' },
  dragon: { ko: '드래곤', color: '#6F35FC', textColor: '#FFFFFF' },
  dark: { ko: '악', color: '#705746', textColor: '#FFFFFF' },
  steel: { ko: '강철', color: '#B7B7CE', textColor: '#000000' },
  fairy: { ko: '페어리', color: '#D685AD', textColor: '#000000' }
};

export const getTypeInfo = (typeEn: string) => {
  return TYPE_MAP[typeEn.toLowerCase()] || { ko: typeEn, color: '#68A090', textColor: '#FFFFFF' };
};
