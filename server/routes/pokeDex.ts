import express, { Router, Request, Response } from "express";
import { getCaughtPokemon, getPokemonById, collectionPokemon } from "../config/database";
import { calculateTotalPages } from "../utils/helper-functions";

const router: Router = express.Router();

const POKEMON_PER_PAGE = 6; 
const MAX_PAGES_DISPLAYED = 7;

router.get("/", async (req: Request<{}, any, any, { page?: string }>, res: Response) => {
    try {
        if (!req.session.user) {
            return res.status(401).send("User not authenticated");
        }
        const userId = req.session.user._id;
        const page = parseInt(req.query.page?.toString() || "1");
        const skip = (page - 1) * POKEMON_PER_PAGE;
        const caughtPokemonData = await getCaughtPokemon(userId);
        const totalPokemonCount = caughtPokemonData.length;
        const paginatedPokemon = caughtPokemonData.slice(skip, skip + POKEMON_PER_PAGE);
        const totalPages = calculateTotalPages(totalPokemonCount, POKEMON_PER_PAGE);
        let startPage = Math.max(1, page - Math.floor(MAX_PAGES_DISPLAYED / 2));
        let endPage = Math.min(totalPages, startPage + MAX_PAGES_DISPLAYED - 1);
        if (endPage - startPage + 1 < MAX_PAGES_DISPLAYED) {
            startPage = Math.max(1, endPage - MAX_PAGES_DISPLAYED + 1);
        }
        res.render("pokeDex", { pokemonData: paginatedPokemon, page, totalPages, startPage, endPage });
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

router.post('/:pokemonId', async (req, res) => {
    try {
        // Extract the Pokémon ID from the URL parameters
        const { pokemonId } = req.params;

        // Retrieve the wins and losses values from the request body
        const { wins, losses } = req.body;

        // Validate wins and losses values
        if (isNaN(wins) || isNaN(losses)) {
            throw new Error('Wins and losses must be valid numbers.');
        }

        // Update the corresponding Pokémon document in the database
        await collectionPokemon.updateOne(
            { id: pokemonId },
            { $set: { wins: parseInt(wins), losses: parseInt(losses) } }
        );

        // Redirect the user back to the same page
        res.redirect(`/${pokemonId}`);
    } catch (error) {
        // Handle errors and send an error response to the client
        console.error('Error updating wins and losses:', error);
        res.status(500).send('Failed to update wins and losses');
    }
});

export default router;
