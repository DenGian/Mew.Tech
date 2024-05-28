import express, { Router } from "express";
import {
  displayRandomPokemon,
  capitalizeFirstLetter,
} from "../utils/helper-functions";
import { filteredPokemon, getSelectedPokemon } from "../config/database";
import { User } from "../interfaces/userInterface";

const router: Router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user: User | undefined = req.session.user;

    // Fetch selected Pokémon if user is logged in
    let selectedPokemon = null;
    if (user) {
      const selectedPokemonId = user.selectedPokemon || "";
      selectedPokemon = selectedPokemonId
        ? await getSelectedPokemon(selectedPokemonId)
        : null;
    }

    const searchPokemon1: string | undefined = req.query.searchPokemon1 as
      | string
      | undefined;
    const searchPokemon2: string | undefined = req.query.searchPokemon2 as
      | string
      | undefined;

    const randomPokemonResult = searchPokemon1
      ? await filteredPokemon(searchPokemon1)
      : await displayRandomPokemon();
    const randomPokemon2Result = searchPokemon2
      ? await filteredPokemon(searchPokemon2)
      : await displayRandomPokemon();

    const randomPokemon = Array.isArray(randomPokemonResult)
      ? randomPokemonResult[0]
      : randomPokemonResult;
    const randomPokemon2 = Array.isArray(randomPokemon2Result)
      ? randomPokemon2Result[0]
      : randomPokemon2Result;

    if (randomPokemon) {
      randomPokemon.name = capitalizeFirstLetter(randomPokemon.name);
    }
    if (randomPokemon2) {
      randomPokemon2.name = capitalizeFirstLetter(randomPokemon2.name);
    }

    const stats1 = randomPokemon
      ? randomPokemon.stats.map((stat) => stat.base_stat)
      : [];
    const stats2 = randomPokemon2
      ? randomPokemon2.stats.map((stat) => stat.base_stat)
      : [];

    res.render("pokeCompare", {
      randomPokemon,
      randomPokemon2,
      searchPokemon1,
      searchPokemon2,
      stats1,
      stats2,
      selectedPokemon,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

export default router;
