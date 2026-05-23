import { StatName } from '../util';

export interface PokemonConfig {
  id: string | null;
  evs: Record<StatName, number>;
  nature: Record<StatName, 1.1 | 1.0 | 0.9>;
  ranks: Record<StatName, number>;
}

export const createDefaultConfig = (): PokemonConfig => ({
  id: null,
  evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
  nature: { hp: 1.0, attack: 1.0, defense: 1.0, spAttack: 1.0, spDefense: 1.0, speed: 1.0 },
  ranks: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
});
