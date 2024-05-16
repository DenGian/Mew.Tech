import express, { Router } from "express";


const router: Router = express.Router();

// router.get("/", async (req, res) => {
//     try {
//       const pokemonList = await fetchPokemonData(2);
//       res.render("pokeBattler", { pokemonList });
//     } catch (error) {
//       console.error("Error fetching Pokémon data:", error);
//       res.status(500).send("Failed to load page due to server error.");
//     }
//   });

router.get("/", async (req, res) => {
  });

export default router;