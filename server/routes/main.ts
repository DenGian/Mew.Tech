import express, { Router } from "express";
import { User } from "../interfaces/userInterface";
import { getSelectedPokemon } from "../config/database";

const router: Router = express.Router();

router.get("/", async(req, res) => {
  const user: User | undefined = req.session.user;
    if (!user) {
        res.status(400).send("User not found in session");
        return;
    }
  if (req.session.user) {
    const selectedPokemonId = user.selectedPokemon || '';
        const selectedPokemon = selectedPokemonId ? await getSelectedPokemon(selectedPokemonId) : null;
      res.render("pokeMain", {user: req.session.user, selectedPokemon});
  } else {
      res.redirect("/login");
  }
});

export default router;
