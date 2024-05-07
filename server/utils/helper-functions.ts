import { getAllPokemon } from "../config/database";
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
    const allPokemon = await getAllPokemon(); // Retrieve all Pokémon from the database
    if (allPokemon.length === 0) {
      throw new Error("No Pokémon found in the database.");
    }
    const randomIndex = Math.floor(Math.random() * allPokemon.length); // Select a random index
    return allPokemon[randomIndex]; // Return the randomly selected Pokémon
  } catch (error) {
    console.error("Failed to fetch random Pokémon:", error);
    return null;
  }
}
// Function to catch a Pokémon
function catchPokemon() {
  const catchRate = 0.25; // Chance to catch the Pokémon
  const random = Math.random(); // Generate a random number between 0 and 1
  if (random < catchRate) {
    return { message: "You caught the Pokémon!", caught: true };
  } else {
    return { message: "The Pokémon escaped!", caught: false };
  }
}

export {
  fetchPokemonData,
  displayRandomPokemon,
  getEvolutionChainWithSprites,
  catchPokemon,
};
