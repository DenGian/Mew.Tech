import express, { Router } from "express";
import {
  displayRandomPokemon,
  getEvolutionChain,
} from "../utils/helper-functions";

const router: Router = express.Router();

router.get("/", async (req, res) => {
  try {
    const searchPokemon = req.query.searchPokemon as string | undefined;
    const randomPokemon = await displayRandomPokemon();
    if (!randomPokemon) {
      throw new Error("No random Pokémon found.");
    }
    const pokemonId = randomPokemon.id; // Ensure randomPokemon has an id property
    const evolutionChain = await getEvolutionChain(pokemonId);

    res.render("pokeDex", {
      pokemonData: randomPokemon,
      searchPokemon,
      evolutionChainWithSprites: evolutionChain,
    });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

// router.get("/search", async (req, res) => {
//   const searchQuery = req.query.searchPokemon;
//   try {
//     // Implement a search function to find Pokémon based on `searchQuery`
//     const searchResults = await searchPokemon(searchQuery);
//     res.render("pokeDex", {
//       pokemonData: searchResults,
//       searchPokemon: searchQuery,
//     });
//   } catch (error) {
//     console.error("Error during search:", error);
//     res.status(500).send("Failed to perform search.");
//   }
// });

export default router;
