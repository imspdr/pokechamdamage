export type StatName = 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed';

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

export interface PokemonInstance {
  level: number;
  types: string[]; // e.g. ["fire", "flying"]
  baseStats: PokemonStats;
  evs: PokemonStats; // 노력치
  nature: {
    increased?: StatName; // 증가하는 능력치 (1.1배)
    decreased?: StatName; // 감소하는 능력치 (0.9배)
  };
}

export interface Move {
  name: string;
  type: string;
  category: 'Physical' | 'Special' | 'Status';
  power: number;
}

// 포켓몬 챔피언스 전용 간소화된 50레벨 실수치 공식 (노력치는 0~32 실수치 단위)
export function calculateStat(
  statName: StatName,
  base: number,
  ev: number,
  natureModifier: number = 1.0
): number {
  if (statName === 'hp') {
    return base + 75 + ev;
  } else {
    return Math.floor((base + 20 + ev) * natureModifier);
  }
}

export function getCalculatedStats(pokemon: PokemonInstance): PokemonStats {
  const getNatureMod = (stat: StatName) => {
    if (pokemon.nature.increased === stat) return 1.1;
    if (pokemon.nature.decreased === stat) return 0.9;
    return 1.0;
  };

  return {
    hp: calculateStat('hp', pokemon.baseStats.hp, pokemon.evs.hp, 1.0),
    attack: calculateStat('attack', pokemon.baseStats.attack, pokemon.evs.attack, getNatureMod('attack')),
    defense: calculateStat('defense', pokemon.baseStats.defense, pokemon.evs.defense, getNatureMod('defense')),
    spAttack: calculateStat('spAttack', pokemon.baseStats.spAttack, pokemon.evs.spAttack, getNatureMod('spAttack')),
    spDefense: calculateStat('spDefense', pokemon.baseStats.spDefense, pokemon.evs.spDefense, getNatureMod('spDefense')),
    speed: calculateStat('speed', pokemon.baseStats.speed, pokemon.evs.speed, getNatureMod('speed')),
  };
}

// 타입 상성표 (공격 타입 -> 방어 타입: 배율)
const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

export function getTypeMultiplier(attackType: string, defendTypes: string[]): number {
  let multiplier = 1;
  const attackEffectiveness = TYPE_EFFECTIVENESS[attackType.toLowerCase()];
  
  if (attackEffectiveness) {
    for (const defendType of defendTypes) {
      const typeMod = attackEffectiveness[defendType.toLowerCase()];
      if (typeMod !== undefined) {
        multiplier *= typeMod;
      }
    }
  }
  return multiplier;
}

// 포켓몬 챔피언스 데미지 계산 (난수 0.85 ~ 1.0 적용 결과를 최소, 최대 데미지로 반환)
export function calculateDamage(
  attacker: PokemonInstance,
  defender: PokemonInstance,
  move: Move
): { min: number; max: number; typeEffectiveness: number } {
  if (move.category === 'Status' || move.power === 0) {
    return { min: 0, max: 0, typeEffectiveness: 1 };
  }

  const attackerStats = getCalculatedStats(attacker);
  const defenderStats = getCalculatedStats(defender);

  // 물리 / 특수 판정에 따른 공격력, 방어력 선택
  const A = move.category === 'Physical' ? attackerStats.attack : attackerStats.spAttack;
  const D = move.category === 'Physical' ? defenderStats.defense : defenderStats.spDefense;

  // 레벨 계산부
  const levelPart = Math.floor((2 * attacker.level) / 5) + 2;
  
  // 기본 데미지
  const baseDamage = Math.floor(Math.floor((levelPart * move.power * A) / D) / 50) + 2;

  // 자속 보정 (STAB)
  const stab = attacker.types.includes(move.type.toLowerCase()) ? 1.5 : 1;

  // 타입 상성 보정
  const typeEffectiveness = getTypeMultiplier(move.type, defender.types);

  // 최종 배율 (여기서는 기본 보정만 포함. 날씨, 도구, 크리티컬 등은 추가 가능)
  const modifiersNoRandom = stab * typeEffectiveness;

  // 데미지 계산식에 따라 0.85 ~ 1.0 난수 적용
  // 소수점 처리는 각 단계별로 버림(floor)하는 것이 일반적인 룰
  const minDamage = Math.floor(baseDamage * 0.85 * modifiersNoRandom);
  const maxDamage = Math.floor(baseDamage * 1.0 * modifiersNoRandom);

  return {
    min: minDamage,
    max: maxDamage,
    typeEffectiveness
  };
}
