// route.ts

import express, { Router, Request, Response } from "express";
import { getAllPokemon } from "../config/database";
import { calculateTotalPages } from "../utils/helper-functions";

const router: Router = express.Router();

const POKEMON_PER_PAGE = 12; // Number of Pokémon per page

router.get("/", async (req: Request<{}, any, any, { page?: string }>, res: Response) => {
  try {
    // Get page number from query parameters (default to 1 if not provided)
    const page = parseInt(req.query.page?.toString() || "1");

    // Calculate skip value based on the page number
    const skip = (page - 1) * POKEMON_PER_PAGE;

    // Fetch Pokémon data and total count from the database
    const { pokemonData, totalPokemonCount } = await getAllPokemon(skip, POKEMON_PER_PAGE);

    // Calculate total pages based on total count and Pokémon per page
    const totalPages = calculateTotalPages(totalPokemonCount, POKEMON_PER_PAGE);

    // Render the EJS template with the fetched Pokémon data
    res.render("pokeViewer", { pokemonData, page, totalPages });
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).send("Failed to load page due to server error.");
  }
});

export default router;
