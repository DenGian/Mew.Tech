import express, { Router } from "express";
import { displayRandomPokemon } from "../utils/helper-functions";

const router: Router = express.Router();

router.get("/", async (req, res) => {
    try {
      const searchPokemon = req.query.searchPokemon;
      const randomPokemon = await displayRandomPokemon();
      res.render("pokeDex", {
        randomPokemon,
        searchPokemon,
      });
    } catch (error) {
      console.error("Error fetching random Pokémon:", error);
      res.status(500).send("Failed to load page due to server error.");
    }
  });

export default router;