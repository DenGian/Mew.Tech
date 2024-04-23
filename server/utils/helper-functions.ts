import { pokeDex, pokemon } from "../interfaces/pokemonInterface";

const PokemonData = "https://pokeapi.co/api/v2/pokemon/";

// function to fetch Pokémon data

async function fetchPokemonData(limit: number = 150): Promise<pokemon[]> {
  try {
    const response = await fetch(`${PokemonData}?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: { results: pokemon[] } = await response.json();
    return data.results;
  } catch (error) {
    console.error(`An error occurred while fetching data: ${error}`);
    return []; // Return an empty array to handle errors gracefully
  }
}

// Function to display a random Pokémon

async function displayRandomPokemon() {
  try {
      const randomId = Math.floor(Math.random() * 151) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json(); // Convert the response to JSON
      return data;
  } catch (error) {
      console.error("Failed to fetch random Pokémon:", error);
      return null;
  }
}
// function to catch a Pokémon

function catchPokemon(): void{
  const catchRate = 0.25; // Chance to catch the Pokémon
  const random = Math.random(); // Generate a random number between 0 and 1
  if (random < catchRate) {
    console.log("You caught the Pokémon!");
  } else {
    console.log("The Pokémon escaped!");
  }
}

function searchPokemon(pokemonName: string, pokemonList: pokemon[]): pokemon | null {
  return pokemonList.find((poke: pokemon) => poke.name === pokemonName) || null;
}

export { fetchPokemonData, catchPokemon, displayRandomPokemon, searchPokemon };
