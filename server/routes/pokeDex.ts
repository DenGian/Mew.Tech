import express, { Router, Request, Response } from "express";
import { 
  getCaughtPokemon, 
  getPokemonById, 
  updatePokemonName, 
  getAllPokemon, 
  filteredPokemon, 
  collectionUsers, 
  collectionPokemon, 
  getSelectedPokemon
} from "../config/database";
import { User } from "../interfaces/userInterface";
import { capitalizeFirstLetter } from "../utils/helper-functions";

const router: Router = express.Router();

router.get("/", async (req: Request<{}, any, any, { showAll?: string, search?: string }>, res: Response) => {
  try {
    const showAll = req.query.showAll === "true";
    const searchTerm = req.query.search ? capitalizeFirstLetter(req.query.search) : "";
    let pokemonData;

    // Fetch selected Pokémon if user is logged in
    const user: User | undefined = req.session.user;
    let selectedPokemon = null;
    let caughtPokemonIds: string | string[] = [];
    if (user) {
      const selectedPokemonId = user.selectedPokemon || '';
      selectedPokemon = selectedPokemonId ? await getSelectedPokemon(selectedPokemonId) : null;
      
      const caughtPokemon = await getCaughtPokemon(user._id?.toString() || '');
      caughtPokemonIds = caughtPokemon.map(p => p.id);
    }

    if (showAll) {
      if (searchTerm) {
        pokemonData = await filteredPokemon(searchTerm);
      } else {
        const result = await getAllPokemon();
        pokemonData = result.pokemonData;
      }
    } else {
      if (!req.session.user || !req.session.user._id) {
        return res.status(401).send("User not authenticated");
      }
      const userId = req.session.user._id.toString();
      const caughtPokemon = await getCaughtPokemon(userId);

      if (searchTerm) {
        pokemonData = caughtPokemon.filter(pokemon =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        pokemonData = caughtPokemon;
      }
    }

    // Add caught information to each Pokémon
    pokemonData = pokemonData.map(pokemon => ({
      ...pokemon,
      isCaught: caughtPokemonIds.includes(pokemon.id),
      name: capitalizeFirstLetter(pokemon.name)
    }));

    res.render("pokeDex", { pokemonData, showAll, searchTerm, selectedPokemon, user: req.session.user });
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
    const stats = pokemon.stats.map(stat => stat.base_stat);

    // Fetch selected Pokémon if user is logged in
    const user: User | undefined = req.session.user;
    let selectedPokemon = null;
    if (user) {
      const selectedPokemonId = user.selectedPokemon || '';
      selectedPokemon = selectedPokemonId ? await getSelectedPokemon(selectedPokemonId) : null;
    }

    pokemon.name = capitalizeFirstLetter(pokemon.name);

    res.render('detail-pokemon', { pokemon, selectedPokemon, user: req.session.user, stats});
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
      await updatePokemonName(pokemonId, capitalizeFirstLetter(newName));
    }
    if (!isNaN(wins) && !isNaN(losses)) {
      await collectionPokemon.updateOne(
        { id: pokemonId },
        { $set: { wins: parseInt(wins), losses: parseInt(losses) } }
      );
    }

    // Fetch selected Pokémon if user is logged in
    const user: User | undefined = req.session.user;
    let selectedPokemon = null;
    if (user) {
      const selectedPokemonId = user.selectedPokemon || '';
      selectedPokemon = selectedPokemonId ? await getSelectedPokemon(selectedPokemonId) : null;
    }

    res.redirect(`/pokeDex/${pokemonId}`);
  } catch (error) {
    console.error('Error updating Pokémon:', error);
    res.status(500).send('Failed to update Pokémon');
  }
});

export default router;
