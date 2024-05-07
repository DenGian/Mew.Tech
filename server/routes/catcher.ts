import express, { Router } from "express";
import { catchPokemon, displayRandomPokemon } from "../utils/helper-functions";

const router: Router = express.Router();

router.get("/", async (req, res) => {
    try {
      const randomPokemon = await displayRandomPokemon();
      res.render("pokeCatcher", { randomPokemon });
    } catch (error) {
      console.error("Error fetching random Pokémon:", error);
      res.status(500).send("Failed to load page due to server error.");
    }
  });
  
  // Route to handle catching a Pokémon
  router.post("/catch-pokemon", (req, res) => {
    const result = catchPokemon();
    res.json(result);
  });

export default router;