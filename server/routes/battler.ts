import express, { Router } from "express";
import { User } from "../interfaces/userInterface";
import { getSelectedPokemon, filteredPokemon } from "../config/database";
import {
  displayRandomPokemon,
  capitalizeFirstLetter,
} from "../utils/helper-functions";

const router: Router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user: User | undefined = req.session.user;
    const searchPokemon1: string | undefined = req.query.searchPokemon1 as string | undefined;
    const searchPokemon2: string | undefined = req.query.searchPokemon2 as string | undefined;

    let selectedPokemon = null;
    if (user) {
      const selectedPokemonId = user.selectedPokemon || '';
      selectedPokemon = selectedPokemonId ? await getSelectedPokemon(selectedPokemonId) : null;
    }

    const randomPokemonResult = searchPokemon1 ? await filteredPokemon(searchPokemon1) : await displayRandomPokemon();
    const randomPokemon2Result = searchPokemon2 ? await filteredPokemon(searchPokemon2) : await displayRandomPokemon();

    const pokemon1 = Array.isArray(randomPokemonResult) ? randomPokemonResult[0] : randomPokemonResult;
    const pokemon2 = Array.isArray(randomPokemon2Result) ? randomPokemon2Result[0] : randomPokemon2Result;

    if (pokemon1) {
      pokemon1.name = capitalizeFirstLetter(pokemon1.name);
    }
    if (pokemon2) {
      pokemon2.name = capitalizeFirstLetter(pokemon2.name);
    }

    res.render("pokeBattler", {
      pokemon1,
      pokemon2,
      searchPokemon1,
      searchPokemon2,
      selectedPokemon,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

export default router;
