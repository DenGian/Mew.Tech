import express, { Router, Request, Response } from "express";
import {
  displayRandomPokemon,
  capitalizeFirstLetter,
} from "../utils/helper-functions";
import { collectionUsers, getSelectedPokemon } from "../config/database";
import { ObjectId } from "mongodb";
import { User } from "../interfaces/userInterface";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const user: User | undefined = req.session.user;

    // Fetch selected Pokémon if user is logged in
    let selectedPokemon = null;
    if (user) {
      const selectedPokemonId = user.selectedPokemon || "";
      selectedPokemon = selectedPokemonId
        ? await getSelectedPokemon(selectedPokemonId)
        : null;

      // Capitalize the first letter of the selected Pokémon's name
      if (selectedPokemon) {
        selectedPokemon.name = capitalizeFirstLetter(selectedPokemon.name);
      }
    }

    const randomPokemon = await displayRandomPokemon();
    if (randomPokemon) {
      randomPokemon.name = capitalizeFirstLetter(randomPokemon.name);
    }
    const maxAttempts = 3;

    res.render("pokeCatcher", {
      randomPokemon,
      maxAttempts,
      selectedPokemon,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

router.post("/catch-pokemon", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  const { pokemonId } = req.body;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "User not authenticated." });
  }

  try {
    const result = await collectionUsers.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { caughtPokemon: pokemonId } }
    );

    if (result.modifiedCount > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Failed to update user data." });
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
