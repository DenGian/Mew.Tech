import {
  PokemonResponse,
  PokemonData,
} from "../interfaces/pokemonInterface";
import axios from "axios";

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

export {
  displayRandomPokemon,
};
