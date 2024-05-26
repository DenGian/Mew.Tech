// route.ts

import express, { Router, Request, Response } from "express";
import { getAllPokemon, getPokemonById } from "../config/database";
import { calculateTotalPages } from "../utils/helper-functions";

const router: Router = express.Router();

const POKEMON_PER_PAGE = 4; 
const MAX_PAGES_DISPLAYED = 7;

router.get("/", async (req: Request<{}, any, any, { page?: string }>, res: Response) => {
    try {
        const page = parseInt(req.query.page?.toString() || "1");
        const skip = (page - 1) * POKEMON_PER_PAGE;
        const { pokemonData, totalPokemonCount } = await getAllPokemon(skip, POKEMON_PER_PAGE);
        const totalPages = calculateTotalPages(totalPokemonCount, POKEMON_PER_PAGE);
        let startPage = Math.max(1, page - Math.floor(MAX_PAGES_DISPLAYED / 2));
        let endPage = Math.min(totalPages, startPage + MAX_PAGES_DISPLAYED - 1);
        if (endPage - startPage + 1 < MAX_PAGES_DISPLAYED) {
            startPage = Math.max(1, endPage - MAX_PAGES_DISPLAYED + 1);
        }
        res.render("pokeDex", { pokemonData, page, totalPages, startPage, endPage });
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        res.status(500).send("Failed to load page due to server error.");
    }
});

router.get('/:pokemonId', async (req, res) => {
  try {
      const pokemonId = req.params.pokemonId;
      const pokemon = await getPokemonById(pokemonId);
      if (!pokemon) {
          return res.status(404).send('Pokémon not found');
      }
      res.render('detail-pokemon', { pokemon });
  } catch (error) {
      console.error('Error fetching Pokémon stats:', error);
      res.status(500).send('Failed to load Pokémon stats due to server error.');
  }
});

export default router;
