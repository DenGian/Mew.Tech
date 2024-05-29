import express, { Router } from "express";
import {
  displayRandomPokemon,
  capitalizeFirstLetter,
} from "../utils/helper-functions";
import { collectionPokemon, getSelectedPokemon } from "../config/database";
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

      // Capitalize the selected Pokémon's name
      if (selectedPokemon) {
        selectedPokemon.name = capitalizeFirstLetter(selectedPokemon.name);
      }
    }

    const randomPokemon = await displayRandomPokemon();
    if (!randomPokemon) {
      throw new Error("No random Pokémon found.");
    }

    res.render("pokeGuess", {
      pokemonData: randomPokemon,
      correctGuesses: req.session.correctGuesses || 0,
      incorrectGuesses: req.session.incorrectGuesses || 0,
      feedback: null,
      selectedPokemon,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

router.post("/", async (req, res) => {
  try {
    const { pokemonID, guess } = req.body;
    const pokemon = await collectionPokemon.findOne({ id: pokemonID });

    const user: User | undefined = req.session.user;
    let selectedPokemon = null;
    if (user) {
      const selectedPokemonId = user.selectedPokemon || "";
      selectedPokemon = selectedPokemonId
        ? await getSelectedPokemon(selectedPokemonId)
        : null;

      // Capitalize the selected Pokémon's name
      if (selectedPokemon) {
        selectedPokemon.name = capitalizeFirstLetter(selectedPokemon.name);
      }
    }

    if (pokemon) {
      const correct = pokemon.name.toLowerCase() === guess.toLowerCase();
      if (correct) {
        req.session.correctGuesses = (req.session.correctGuesses || 0) + 1;
        res.render("pokeGuess", {
          pokemonData: pokemon,
          correctGuesses: req.session.correctGuesses,
          incorrectGuesses: req.session.incorrectGuesses || 0,
          feedback: `Correct! It is ${
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
          }!`,
          selectedPokemon,
          user: req.session.user,
        });
      } else {
        req.session.incorrectGuesses = (req.session.incorrectGuesses || 0) + 1;
        res.render("pokeGuess", {
          pokemonData: pokemon,
          correctGuesses: req.session.correctGuesses || 0,
          incorrectGuesses: req.session.incorrectGuesses,
          feedback: "Incorrect! Try again.",
          selectedPokemon,
          user: req.session.user,
        });
      }
    } else {
      res.status(400).send("Invalid Pokémon ID.");
    }
  } catch (error) {
    console.error("Error processing guess:", error);
    res.status(500).send("Failed to process guess due to server error.");
  }
});

router.post("/next", async (req, res) => {
  try {
    const user: User | undefined = req.session.user;

    // Fetch selected Pokémon if user is logged in
    let selectedPokemon = null;
    if (user) {
      const selectedPokemonId = user.selectedPokemon || "";
      selectedPokemon = selectedPokemonId
        ? await getSelectedPokemon(selectedPokemonId)
        : null;

      // Capitalize the selected Pokémon's name
      if (selectedPokemon) {
        selectedPokemon.name = capitalizeFirstLetter(selectedPokemon.name);
      }
    }

    const randomPokemon = await displayRandomPokemon();
    if (!randomPokemon) {
      throw new Error("No random Pokémon found.");
    }

    res.render("pokeGuess", {
      pokemonData: randomPokemon,
      correctGuesses: req.session.correctGuesses || 0,
      incorrectGuesses: req.session.incorrectGuesses || 0,
      feedback: null,
      selectedPokemon,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

export default router;
