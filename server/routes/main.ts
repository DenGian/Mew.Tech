import express, { Router, Request, Response } from "express";
import { User } from "../interfaces/userInterface";
import { getSelectedPokemon, getRandomPokemons, updateSelectedPokemon } from "../config/database";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const user: User | undefined = req.session.user;
    if (!user) {
        res.status(400).send("User not found in session");
        return;
    }

    try {
        const selectedPokemonId = user.selectedPokemon || '';
        const selectedPokemon = selectedPokemonId ? await getSelectedPokemon(selectedPokemonId) : null;

        // Fetch 3 random Pokémon from the database
        const randomPokemon = await getRandomPokemons(3);
        const showStarterModal = !selectedPokemonId;

        res.render("pokeMain", { user: req.session.user, selectedPokemon, randomPokemon, showStarterModal });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).render("error", { message: "An error occurred while fetching data.", error });
    }
});

router.post("/choose-starter", async (req: Request, res: Response) => {
    const userId: string | undefined = req.session.user?._id?.toString();
    const { starterPokemon } = req.body;

    if (!userId || !starterPokemon) {
        res.status(400).send("User ID or starter Pokémon not provided");
        return;
    }

    try {
        await updateSelectedPokemon(userId, starterPokemon);
        req.session.user!.selectedPokemon = starterPokemon;
        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                res.status(500).render("error", { message: "An error occurred while saving your session.", error: err });
                return;
            }
            res.redirect("/main");
        });
    } catch (error) {
        console.error("Error setting starter Pokémon:", error);
        res.status(500).render("error", { message: "An error occurred while setting the starter Pokémon.", error });
    }
});

export default router;
