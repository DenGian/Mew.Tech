import {
  pokemon,
  PokemonResponse,
  PokemonData,
  PokemonSpecies,
} from "../interfaces/pokemonInterface";
import axios from "axios";

const PokemonData = "https://pokeapi.co/api/v2/pokemon/";

// function to fetch Pokémon data

async function fetchPokemonData(
  nameOrID: string | number
): Promise<PokemonResponse | null> {
  try {
    const { data: pokemonData }: { data: PokemonData } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${nameOrID}`
    );

    const { data: speciesData }: { data: PokemonSpecies } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`
    );

    const habitat = speciesData.habitat ? speciesData.habitat.name : "unknown";
    const flavorTexts = speciesData.flavor_text_entries
      .filter((entry) => entry.language.name === "en")
      .map((entry) => entry.flavor_text);

    const { data: evolutionChainData } = await axios.get(
      speciesData.evolution_chain.url
    );

    return {
      name: pokemonData.name, // Add the 'name' property
      pokemonData,
      evolutionChainData,
      habitat,
      flavorTexts,
    };
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return null;
  }
}

// Function to fetch evolution chain with sprites
async function getEvolutionChainWithSprites(chain: any) {
  const results: { name: any; id: any; sprite: any }[] = [];

  async function recursiveFetch(chainNode: {
    species: { url: string; name: any };
    evolves_to: any;
  }) {
    const pokemonID = chainNode.species.url.split("/")[6];
    const { data: pokemonData } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonID}`
    );

    results.push({
      name: chainNode.species.name,
      id: pokemonID,
      sprite: pokemonData.sprites.front_default,
    });

    for (const nextNode of chainNode.evolves_to) {
      await recursiveFetch(nextNode);
    }
  }

  await recursiveFetch(chain);
  return results;
}

// Function to display a random Pokémon

async function displayRandomPokemon() {
  try {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`
    );
    const data = await response.json(); // Convert the response to JSON
    return data;
  } catch (error) {
    console.error("Failed to fetch random Pokémon:", error);
    return null;
  }
}

export async function displayRandomPokemon2() {
  const randomID = Math.floor(Math.random() * 151) + 1;
  const data = await fetchPokemonData(randomID as any);
  if (data === null) {
    throw new Error("Failed to fetch Pokémon data");
  }
  const { pokemonData, evolutionChainData, habitat, flavorTexts } = data;
  const evolutionChainWithSprites = await getEvolutionChainWithSprites(evolutionChainData.chain);
  return { pokemonData, evolutionChainWithSprites, habitat, flavorTexts };
}

function searchPokemon(
  pokemonName: string,
  pokemonList: pokemon[]
): pokemon | null {
  return pokemonList.find((poke: pokemon) => poke.name === pokemonName) || null;
}

export {
  fetchPokemonData,
  displayRandomPokemon,
  searchPokemon,
  getEvolutionChainWithSprites,
};
