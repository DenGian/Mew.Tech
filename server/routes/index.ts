import express, { Router } from "express";
import {
  fetchPokemonData,
  catchPokemon,
  displayRandomPokemon,
  searchPokemon,
} from "../utils/helper-functions";

import { error } from "console";

const router: Router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/contact", (req, res) => {
  res.render("contactPage");
});

router.get("/battler", (req, res) => {
  res.render("pokeBattler");
});

// Route to render the page with a random Pokémon
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

router.get("/compare", async (req, res) => {
  try {
    const searchPokemon = req.query.searchPokemon;
    const randomPokemon = await displayRandomPokemon();
    const randomPokemon2 = await displayRandomPokemon();
    res.render("pokeCompare", { randomPokemon, randomPokemon2, searchPokemon});
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

router.get("/pokeDex", (req, res) => {
  res.render("pokeDex");
});

router.get("/pokeGuess", (req, res) => {
  res.render("pokeGuess");
});

router.get("/main", (req, res) => {
  res.render("pokeMain");
});

router.get("/viewer", (req, res) => {
  res.render("pokeViewer");
});

router.get("/acces-denied", (req, res) => {
  res.render("acces-denied");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

export default router;
