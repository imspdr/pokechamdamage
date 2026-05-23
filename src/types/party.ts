import { PokemonConfig } from './pokemon';

export interface Party {
  id: string;
  name: string;
  members: PokemonConfig[]; // Always length 6
}
