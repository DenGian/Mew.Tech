import express, { Router, Request, Response } from "express";
import { getCaughtPokemon, getPokemonById, updatePokemonName, getAllPokemon, filteredPokemon, collectionPokemon } from "../config/database";

const router: Router = express.Router();

router.get("/", async (req: Request<{}, any, any, { showAll?: string, search?: string }>, res: Response) => {
    try {
        const showAll = req.query.showAll === "true";
        const searchTerm = req.query.search || "";
        let pokemonData;

        if (searchTerm) {
            pokemonData = await filteredPokemon(searchTerm);
        } else if (showAll) {
            const result = await getAllPokemon();
            pokemonData = result.pokemonData;
        } else {
            if (!req.session.user || !req.session.user._id) {
                return res.status(401).send("User not authenticated");
            }
            const userId = req.session.user._id.toString();
            pokemonData = await getCaughtPokemon(userId);
        }

        res.render("pokeDex", { pokemonData, showAll, searchTerm });
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
