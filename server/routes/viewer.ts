import express, { Router, Request, Response } from "express";
import { updateUser, getCaughtPokemon, getSelectedPokemon, updateSelectedPokemon } from "../config/database";
import { User } from "../interfaces/userInterface";
import { capitalizeFirstLetter } from "../utils/helper-functions";

const router: Router = express.Router();

router.get("/", async (req, res) => {
    const user: User | undefined = req.session.user;
    if (!user) {
        res.status(400).send("User not found in session");
        return;
    }

    try {
        const caughtPokemon = await getCaughtPokemon(user._id);
        const selectedPokemonId = user.selectedPokemon || '';
        const selectedPokemon = selectedPokemonId ? await getSelectedPokemon(selectedPokemonId) : null;

        // Capitalize Pokémon names
        caughtPokemon.forEach(pokemon => pokemon.name = capitalizeFirstLetter(pokemon.name));
        if (selectedPokemon) {
            selectedPokemon.name = capitalizeFirstLetter(selectedPokemon.name);
        }

        res.render("pokeViewer", { user, caughtPokemon, selectedPokemon });
    } catch (error) {
        console.error("Error fetching caught Pokémon:", error);
        res.status(500).render("error", { message: "An error occurred while fetching caught Pokémon.", error });
    }
});

function isUserDefined(user: any): user is User {
    return user !== undefined && user._id !== undefined;
}

router.post("/", async (req: Request, res: Response) => {
    try {
        const { username, email } = req.body;
        const user = req.session.user;
        if (!user || !isUserDefined(user)) {
            res.status(400).send("User not found in session or missing ID");
            return;
        }

        await updateUser(user._id!.toString(), username, email);
        if (username) {
            req.session.user!.username = username;
        }
        if (email) {
            req.session.user!.email = email;
        }
        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                res.status(500).render("error", { message: "An error occurred while saving your session.", error: err });
                return;
            }
            res.redirect("/viewer");
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).render("error", { message: "An error occurred while updating your profile.", error });
    }
});

router.post("/set-main-pokemon", async (req: Request, res: Response) => {
    try {
        console.log("POST request to /viewer/set-main-pokemon received");
        const userId: string | undefined = req.session.user?._id?.toString();
        const selectedPokemonId: string | undefined = req.body.mainPokemon;
        console.log("UserID:", userId);
        console.log("SelectedPokemonId:", selectedPokemonId);
        if (!userId || !selectedPokemonId) {
            console.error("User ID or selected Pokémon ID not provided");
            res.status(400).send("User ID or selected Pokémon ID not provided");
            return;
        }
        req.session.user!.selectedPokemon = selectedPokemonId;
        await updateSelectedPokemon(userId, selectedPokemonId);
        console.log("Main Pokémon updated successfully");
        res.redirect("/viewer");
    } catch (error) {
        console.error("Error setting main Pokémon:", error);
        res.status(500).render("error", { message: "An error occurred while setting the main Pokémon.", error });
    }
});

export default router;
