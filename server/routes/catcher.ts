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
    let caughtPokemonIds: string[] = [];
    if (user) {
      const selectedPokemonId = user.selectedPokemon || "";
      selectedPokemon = selectedPokemonId
        ? await getSelectedPokemon(selectedPokemonId)
        : null;

      // Capitalize the first letter of the selected Pokémon's name
      if (selectedPokemon) {
        selectedPokemon.name = capitalizeFirstLetter(selectedPokemon.name);
      }

      const userRecord = await collectionUsers.findOne(
        { _id: new ObjectId(user._id) },
        { projection: { caughtPokemon: 1 } }
      );
      caughtPokemonIds = userRecord?.caughtPokemon || [];
    }

    const randomPokemon = await displayRandomPokemon();
    let isCaught = false;
    if (randomPokemon) {
      randomPokemon.name = capitalizeFirstLetter(randomPokemon.name);
      isCaught = caughtPokemonIds.includes(randomPokemon.id);
    }

    const maxAttempts = 3;

    res.render("pokeCatcher", {
      randomPokemon,
      maxAttempts,
      selectedPokemon,
      user: req.session.user,
      isCaught,
    });
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

router.post("/catch-pokemon", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  const { pokemonId, release } = req.body;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "User not authenticated." });
  }

  try {
    let result;
    if (release === 'true') {
      result = await collectionUsers.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { caughtPokemon: pokemonId } }
      );
    } else {
      result = await collectionUsers.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { caughtPokemon: pokemonId } }
      );
    }

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
