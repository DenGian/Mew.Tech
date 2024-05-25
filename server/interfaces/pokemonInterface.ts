import { ObjectId } from "mongodb";

export interface PokemonData {
  id: string;
  name: string;
  sprites: { front_default: string };
  stats: { name: string, base_stat: number }[];
  abilities: { ability: { name: string } }[];
  url: string | null;
  evolution_chain: string[]; // To store the evolution chain
}

export interface PokemonResponse {
  name: any;
  pokemonData: PokemonData;
  evolutionChainData: any;
  habitat: string;
  flavorTexts: string[];
}

export interface Sprites {
  back_default: string;
  back_female: null;
  back_shiny: string;
  back_shiny_female: null;
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
}
