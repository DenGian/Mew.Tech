import express, { Router } from "express";
import {
  fetchPokemonData,
  displayRandomPokemon,
  displayRandomPokemon2,
  getEvolutionChainWithSprites,
} from "../utils/helper-functions";
const bodyParser = require("body-parser");

const router: Router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/battler", async (req, res) => {
  try {
    const randomPokemon = await displayRandomPokemon();
    const randomPokemon2 = await displayRandomPokemon();
    res.render("pokeBattler", { randomPokemon, randomPokemon2 });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

router.get("/catcher", async (req, res) => {
  try {
    const randomPokemon = await displayRandomPokemon();
    (req.session as any).attempts = 0; // Reset or initialize the number of attempts
    (req.session as any).caught = false; // Reset caught status
    res.render("pokeCatcher", { randomPokemon });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

router.post("/catch-pokemon", (req, res) => {
  if ((req.session as any).caught || (req.session as any).attempts >= 3) {
    // If already caught or exceeded attempts, stop further processing
    res.json({
      message: "Start a new game to try again.",
      caught: (req.session as any).caught,
    });
    return;
  }

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
  (req.session as any).attempts += 1; // Increment the number of attempts
  if (result.caught) {
    (req.session as any).caught = true; // Update session if Pokémon is caught
  }

  res.json({
    ...result,
    attemptsLeft: 3 - (req.session as any).attempts,
    buttonToShow:
      (req.session as any).caught || (req.session as any).attempts >= 3,
  });
});

router.get("/compare", async (req, res) => {
  try {
    const searchPokemon = req.query.searchPokemon;
    const update = req.query.update;  // Determines which Pokémon to update

    // Initialize or use existing Pokémon data in the session
    if (!(req.session as any).randomPokemon || update === 'randomPokemon1') {
      (req.session as any).randomPokemon = await displayRandomPokemon();
    }
    if (!(req.session as any).randomPokemon2 || update === 'randomPokemon2') {
      (req.session as any).randomPokemon2 = await displayRandomPokemon();
    }

    res.render("pokeCompare", {
      randomPokemon: (req.session as any).randomPokemon,
      randomPokemon2: (req.session as any).randomPokemon2,
      searchPokemon
    });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});


router.get("/pokeDex", async (req, res) => {
  try {
    const searchPokemon = req.query.searchPokemon;

    let pokemonData, evolutionChainWithSprites, habitat;

    if (searchPokemon) {
      const {
        pokemonData: pData,
        evolutionChainData,
        habitat: pHabitat,
      } = (await fetchPokemonData(searchPokemon.toString().toLowerCase())) as {
        pokemonData: any;
        evolutionChainData: any;
        habitat: any;
      };
      if (!pData) {
        return res.status(404).send("Pokémon not found");
      }
      pokemonData = pData;
      habitat = pHabitat;

      evolutionChainWithSprites = await getEvolutionChainWithSprites(
        evolutionChainData.chain
      );
    } else {
      const {
        pokemonData: rData,
        evolutionChainWithSprites: eChain,
        habitat: rHabitat,
      } = await displayRandomPokemon2();
      pokemonData = rData;
      evolutionChainWithSprites = eChain;
      habitat = rHabitat;
    }

    res.render("pokeDex", {
      pokemonData,
      evolutionChainWithSprites,
      habitat,
    });
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    res.send("An error occurred while fetching Pokémon data.");
  }
});

router.get("/pokeGuess", async (req, res) => {
  try {
    const pokemonData = await displayRandomPokemon();

    // Store Pokémon data in session
    (req.session as any).pokemonData = pokemonData;

    // Initialize session values if they don't exist
    (req.session as any).correctGuesses =
      (req.session as any).correctGuesses || 0;
    (req.session as any).incorrectGuesses =
      (req.session as any).incorrectGuesses || 0;

    res.render("pokeGuess", {
      pokemonData,
      correctGuesses: (req.session as any).correctGuesses,
      incorrectGuesses: (req.session as any).incorrectGuesses,
      feedback: "", // Initialize feedback to empty string for GET requests
    });
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

router.post("/pokeGuess", async (req, res) => {
  try {
    const guessedName = req.body.guess.trim().toLowerCase(); // Normalize the guessed name from the form
    const pokemonData = (req.session as any).pokemonData; // Retrieve Pokémon data from session
    const pokemonName = pokemonData
      ? pokemonData.name.toLowerCase().trim()
      : ""; // Safely handle potential null

    let feedback = "";
    let correctGuesses = (req.session as any).correctGuesses || 0;
    let incorrectGuesses = (req.session as any).incorrectGuesses || 0;

    if (pokemonData && guessedName === pokemonName) {
      correctGuesses++;
      feedback = "Correct!";
      // Fetch new Pokémon data for next guess
      const newPokemonData = await displayRandomPokemon();
      (req.session as any).pokemonData = newPokemonData; // Add missing property 'pokemonData' to the session object
    } else {
      incorrectGuesses++;
      feedback = "Incorrect!";
      const newPokemonData = await displayRandomPokemon();
      (req.session as any).pokemonData = newPokemonData; // Add missing property 'pokemonData' to the session object
    }

    // Update session values
    (req.session as any).correctGuesses = correctGuesses;
    (req.session as any).incorrectGuesses = incorrectGuesses;

    res.render("pokeGuess", {
      pokemonData: (req.session as any).pokemonData, // Send current or new Pokémon data
      correctGuesses,
      incorrectGuesses,
      feedback,
    });
  } catch (error) {
    console.error("Error processing guess:", error);
    res.status(500).send("An error occurred while processing your guess.");
  }
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
