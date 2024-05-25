import express, { Router } from "express";
import { displayRandomPokemon } from "../utils/helper-functions";
import { collectionPokemon } from "../config/database";

const router: Router = express.Router();

router.get("/", async (req, res) => {
  try {
    const randomPokemon = await displayRandomPokemon();
    if (!randomPokemon) {
      throw new Error("No random Pokémon found.");
    }

    res.render("pokeGuess", {
      pokemonData: randomPokemon,
      correctGuesses: req.session.correctGuesses || 0,
      incorrectGuesses: req.session.incorrectGuesses || 0,
      feedback: null,
    });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

router.post("/", async (req, res) => {
  const { pokemonID, guess } = req.body;
  const pokemon = await collectionPokemon.findOne({ id: pokemonID });

  if (pokemon) {
    const correct = pokemon.name.toLowerCase() === guess.toLowerCase();
    if (correct) {
      req.session.correctGuesses = (req.session.correctGuesses || 0) + 1;
      res.render("pokeGuess", {
        pokemonData: pokemon,
        correctGuesses: req.session.correctGuesses,
        incorrectGuesses: req.session.incorrectGuesses || 0,
        feedback: `Correct! Het is ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}!`,
      });
    } else {
      req.session.incorrectGuesses = (req.session.incorrectGuesses || 0) + 1;
      res.render("pokeGuess", {
        pokemonData: pokemon,
        correctGuesses: req.session.correctGuesses || 0,
        incorrectGuesses: req.session.incorrectGuesses,
        feedback: `Incorrect! Probeer het opnieuw.`,
      });
    }
  } else {
    res.status(400).send("Invalid Pokémon ID.");
  }
});

router.post("/next", async (req, res) => {
  try {
    const randomPokemon = await displayRandomPokemon();
    if (!randomPokemon) {
      throw new Error("No random Pokémon found.");
    }

    res.render("pokeGuess", {
      pokemonData: randomPokemon,
      correctGuesses: req.session.correctGuesses || 0,
      incorrectGuesses: req.session.incorrectGuesses || 0,
      feedback: null,
    });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

export default router;