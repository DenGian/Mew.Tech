<<<<<<< HEAD
export interface pokemon{
        id: number;
        name : string;
        url : string;
        sprites : Sprites;
=======
import { ObjectId } from "mongodb";

export interface pokeDex {
    abilities:                Ability[];
    base_experience:          number;
    cries:                    Cries;
    forms:                    Species[];
    game_indices:             GameIndex[];
    height:                   number;
    held_items:               HeldItem[];
    id:                       string;
    is_default:               boolean;
    location_area_encounters: string;
    moves:                    Move[];
    name:                     string;
    order:                    number;
    past_abilities:           any[];
    past_types:               any[];
    species:                  Species;
    sprites:                  Sprites;
    stats:                    Stat[];
    types:                    Type[];
    weight:                   number;
}

export interface pokemon{
    _id?: ObjectId;
    id: string;
    name : string;
    url : string;
    sprites : Sprites;
>>>>>>> ian
}

export interface PokemonSpecies {
        habitat: { name: string };
        flavor_text_entries: { flavor_text: string; language: { name: string } }[];
        evolution_chain: { url: string };
}

export interface PokemonData {
        id: number;
        name: string;
        sprites: { front_default: string };
        stats: { base_stat: number }[];
        abilities: { ability: { name: string } }[];
}

export interface PokemonResponse {
        name: any;
        pokemonData: PokemonData;
        evolutionChainData: any;
        habitat: string;
        flavorTexts: string[];
}


export interface Sprites {
        back_default:       string;
        back_female:        null;
        back_shiny:         string;
        back_shiny_female:  null;
        front_default:      string;
        front_female:       null;
        front_shiny:        string;
        front_shiny_female: null;
}


