import { getAllPokemon, getPokemonById, collectionPokemon } from "../config/database";
import { PokemonData } from "../interfaces/pokemonInterface";

// Function to display a random Pokémon
async function displayRandomPokemon(): Promise<PokemonData | null> {
    try {
        const { pokemonData } = await getAllPokemon(0, 0); // Retrieve all Pokémon from the database
        if (pokemonData.length === 0) {
            throw new Error("No Pokémon found in the database.");
        }
        const randomIndex = Math.floor(Math.random() * pokemonData.length); // Select a random index
        return pokemonData[randomIndex]; // Return the randomly selected Pokémon
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

// Function to get the evolution chain of a Pokémon
async function getEvolutionChain(pokemonId: string): Promise<{ name: string, id: string, sprite: string }[]> {
  try {
    const pokemon = await collectionPokemon.findOne({ id: pokemonId });
    if (!pokemon || !pokemon.evolution_chain) return [];

    const evolutionChain: { name: string, id: string, sprite: string }[] = [];
    for (const evo of pokemon.evolution_chain) {
      const evoPokemon = await collectionPokemon.findOne({ id: evo.id });
      if (evoPokemon) {
        evolutionChain.push({
          name: evoPokemon.name,
          id: evoPokemon.id,
          sprite: evoPokemon.sprites.front_default
        });
      }
    }

    return evolutionChain;
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    return [];
  }
}

function calculateTotalPages(totalPokemonCount: number, pokemonPerPage: number): number {
    return Math.ceil(totalPokemonCount / pokemonPerPage);
}

export { displayRandomPokemon, catchPokemon, calculateTotalPages, getEvolutionChain };
