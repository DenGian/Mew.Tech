import { pokeDex, pokemon } from "../interfaces/pokemonInterface";

const PokemonData = "https://pokeapi.co/api/v2/pokemon/";

// function to fetch Pokémon data
export async function fetchPokemonData(
  limit: number = 100
): Promise<pokemon[] | undefined> {
  try {
    const response = await fetch(`${PokemonData}?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: { results: pokemon[] } = await response.json();
    return data.results;
  } catch (error) {
    console.error(`An error occurred while fetching data: ${error}`);
  }
}

// function to get a random Pokémon
export async function getRandomPokemon(): Promise<pokemon | undefined> {
  const pokemonList = await fetchPokemonData();
  if (!pokemonList) {
    console.error("No Pokémon data available.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * pokemonList.length);
  return pokemonList[randomIndex];
}

// function to try to catch a Pokémon
export async function tryToCatchPokemon(): Promise<void> {
  const pokemon = await getRandomPokemon();
  if (!pokemon) {
    console.log("No Pokémon found to catch.");
    return;
  }

  console.log(`A wild ${pokemon.name} appears!`);
  let attempts = 3;
  for (let i = 0; i < attempts; i++) {
    if (await catchPokemon()) {
      console.log(`Congratulations! You caught ${pokemon.name}!`);
      return;
    } else {
      console.log(`Oh no! ${pokemon.name} resisted!`);
    }
  }
  console.log(`${pokemon.name} ran away!`);
}

// function to simulate catching a Pokémon
 export async function catchPokemon(): Promise<boolean> {
  return Math.random() < 0.5; // 50% chance to catch the Pokémon
}


// function to fetch Pokémon data by name
export async function fetchPokemonByName(name: string): Promise<pokemon> {
  try {
    const response = await fetch(`${PokemonData}${name}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: pokemon = await response.json();
    return data;
  } catch (error) {
    throw new Error(`An error occurred while fetching data: ${error}`);
  }
}
