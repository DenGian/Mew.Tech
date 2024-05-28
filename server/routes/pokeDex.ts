import express, { Router, Request, Response } from "express";
import { getCaughtPokemon, getPokemonById, collectionPokemon, updatePokemonName, getAllPokemon } from "../config/database";
import { calculateTotalPages } from "../utils/helper-functions";

const router: Router = express.Router();

const POKEMON_PER_PAGE = 1000;
const MAX_PAGES_DISPLAYED = 4;

router.get("/", async (req: Request<{}, any, any, { page?: string, showAll?: string }>, res: Response) => {
    try {
        const page = parseInt(req.query.page?.toString() || "1");
        const showAll = req.query.showAll === "true";
        
        let pokemonData;
        let totalPokemonCount;
        
        if (showAll) {
            const skip = (page - 1) * POKEMON_PER_PAGE;
            ({ pokemonData, totalPokemonCount } = await getAllPokemon(skip, POKEMON_PER_PAGE));
        } else {
            if (!req.session.user || !req.session.user._id) {
                return res.status(401).send("User not authenticated");
            }
            const userId = req.session.user._id.toString();
            const skip = (page - 1) * POKEMON_PER_PAGE;
            const caughtPokemonData = await getCaughtPokemon(userId);
            totalPokemonCount = caughtPokemonData.length;
            pokemonData = caughtPokemonData.slice(skip, skip + POKEMON_PER_PAGE);
        }

        const totalPages = calculateTotalPages(totalPokemonCount, POKEMON_PER_PAGE);
        let startPage = Math.max(1, page - Math.floor(MAX_PAGES_DISPLAYED / 2));
        let endPage = Math.min(totalPages, startPage + MAX_PAGES_DISPLAYED - 1);
        if (endPage - startPage + 1 < MAX_PAGES_DISPLAYED) {
            startPage = Math.max(1, endPage - MAX_PAGES_DISPLAYED + 1);
        }
        res.render("pokeDex", { pokemonData, page, totalPages, startPage, endPage, showAll });
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
        const { pokemonId } = req.params;
        const { newName, wins, losses } = req.body;
        if (newName) {
            await updatePokemonName(pokemonId, newName);
        }
        if (!isNaN(wins) && !isNaN(losses)) {
            await collectionPokemon.updateOne(
                { id: pokemonId },
                { $set: { wins: parseInt(wins), losses: parseInt(losses) } }
            );
        }
        res.redirect(`/pokeDex/${pokemonId}`);
    } catch (error) {
        console.error('Error updating Pokémon:', error);
        res.status(500).send('Failed to update Pokémon');
    }
});


export default router;
