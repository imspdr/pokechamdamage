export type StatName = 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed';
import pokemonData from './data/pokemon.json';

export const STAT_SHORT_MAP: Record<StatName, string> = {
  hp: 'H', attack: 'A', defense: 'B', spAttack: 'C', spDefense: 'D', speed: 'S'
};

export const getEvSummary = (evs: Record<StatName, number>) => {
  const parts: string[] = [];
  Object.entries(evs).forEach(([key, val]) => {
    if (val > 0) parts.push(`${STAT_SHORT_MAP[key as StatName]}${val}`);
  });
  return parts.length > 0 ? parts.join(' ') : '무보정';
};

export const getNatureSummary = (nature: Record<StatName, number>) => {
  let up = '';
  let down = '';
  Object.entries(nature).forEach(([key, val]) => {
    if (val === 1.1) up = STAT_SHORT_MAP[key as StatName];
    if (val === 0.9) down = STAT_SHORT_MAP[key as StatName];
  });
  if (!up && !down) return '성격 무보정';
  return `+${up} -${down}`;
};

export const getPokemonTypes = (id: string | null): string[] => {
  if (!id) return [];
  const p = (pokemonData as any[]).find(poke => poke.id === id);
  return p ? p.types : [];
};

export const getPokemonName = (id: string | null) => {
  if (!id) return '선택 안됨';
  const p = (pokemonData as any[]).find(poke => poke.id === id);
  return p ? p.koreanName : '알 수 없음';
};

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
    // Handle both old format (increased/decreased) and new format (Record)
    if ('increased' in pokemon.nature || 'decreased' in pokemon.nature) {
      if ((pokemon.nature as any).increased === stat) return 1.1;
      if ((pokemon.nature as any).decreased === stat) return 0.9;
      return 1.0;
    }
    return (pokemon.nature as any)[stat] || 1.0;
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

export function calculateDetailedDamage(
  attacker: { stats: PokemonStats; ranks: Record<StatName, number>; types: string[] },
  defender: { stats: PokemonStats; ranks: Record<StatName, number>; types: string[] },
  move: { power: number; type: string; category: 'Physical' | 'Special' },
  extraMultipliers: number[],
  defMultipliers: number[],
  atkMultipliers: number[]
) {
  if (move.power === 0) return { rolls: Array(16).fill(0), percentages: Array(16).fill(0), typeEffectiveness: 1 };

  const getRankMultiplier = (rank: number) => {
    if (rank > 0) return (2 + rank) / 2;
    if (rank < 0) return 2 / (2 - rank);
    return 1;
  };

  let A = move.category === 'Physical' ? attacker.stats.attack : attacker.stats.spAttack;
  let D = move.category === 'Physical' ? defender.stats.defense : defender.stats.spDefense;

  A = Math.floor(A * getRankMultiplier(move.category === 'Physical' ? attacker.ranks.attack : attacker.ranks.spAttack));
  D = Math.floor(D * getRankMultiplier(move.category === 'Physical' ? defender.ranks.defense : defender.ranks.spDefense));

  for (const mod of atkMultipliers) {
    A = Math.floor(A * mod);
  }

  for (const mod of defMultipliers) {
    D = Math.floor(D * mod);
  }

  // Level 50 is fixed
  const levelPart = Math.floor((2 * 50) / 5) + 2; // 22

  const baseDamage = Math.floor(Math.floor((levelPart * move.power * A) / D) / 50) + 2;

  const stab = attacker.types.some(t => t.toLowerCase() === move.type.toLowerCase()) ? 1.5 : 1.0;
  const typeEffectiveness = getTypeMultiplier(move.type, defender.types);

  let extraMod = 1;
  for (const mod of extraMultipliers) {
    extraMod *= mod;
  }

  const rolls: number[] = [];
  const percentages: number[] = [];
  const hp = defender.stats.hp;

  for (let r = 85; r <= 100; r++) {
    let damage = Math.floor((baseDamage * r) / 100);
    damage = Math.floor(damage * stab);
    damage = Math.floor(damage * typeEffectiveness);
    damage = Math.floor(damage * extraMod);
    rolls.push(damage);
    percentages.push((damage / hp) * 100);
  }

  return {
    rolls,
    percentages,
    typeEffectiveness
  };
}
