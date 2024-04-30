import express, { Router } from "express";
import { fetchPokemonData } from "../utils/helper-functions";

const router: Router = express.Router();

router.get("/", async (req, res) => {
    try {
      const pokemonList = await fetchPokemonData();
      res.render("pokeBattler", { pokemonList });
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      res.status(500).send("Failed to load page due to server error.");
    }
  });

export default router;