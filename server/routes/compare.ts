import express, { Router } from "express";
import { displayRandomPokemon } from "../utils/helper-functions";
import { filteredPokemon } from "../config/database";

const router: Router = express.Router();

router.get("/", async (req, res) => {
    try {
        const searchPokemon1: string | undefined = req.query.searchPokemon1 as string | undefined;
        const searchPokemon2: string | undefined = req.query.searchPokemon2 as string | undefined;

        const randomPokemon = await displayRandomPokemon();
        const randomPokemon2 = await displayRandomPokemon();

        const filtered1 = searchPokemon1 ? await filteredPokemon(searchPokemon1) : undefined;
        const filtered2 = searchPokemon2 ? await filteredPokemon(searchPokemon2) : undefined;

        res.render("pokeCompare", 
        { randomPokemon, 
          randomPokemon2, 
          filtered1, 
          filtered2, 
          searchPokemon1, 
          searchPokemon2 });
    } catch (error) {
        console.error("Error fetching random Pokémon:", error);
        res.status(500).send("Failed to load page due to server error.");
    }
});

export default router;
