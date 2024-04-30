import express, { Router } from "express";
import { displayRandomPokemon } from "../utils/helper-functions";

const router: Router = express.Router();

router.get("/catcher", async (req, res) => {
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
    function catchPokemon(): { message: string; caught: boolean } {
      const catchRate = 0.25; // Chance to catch the Pokémon
      const random = Math.random(); // Generate a random number between 0 and 1
      if (random < catchRate) {
        return { message: "You caught the Pokémon!", caught: true };
      } else {
        return { message: "The Pokémon escaped!", caught: false };
      }
    }
  
    const result = catchPokemon();
    res.json(result);
  });

export default router;