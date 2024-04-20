import express, { Router } from "express";
import { getRandomPokemon, tryToCatchPokemon, catchPokemon } from "../utils/helper-functions";

const router: Router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/contact", (req, res) => {
  res.render("contactPage");
});

router.get("/battler", (req, res) => {
  res.render("pokeBattler");
});

router.get("/catcher", async (req, res) => {
  const randomPokemon = await getRandomPokemon();
  const tryToCatchPokemonResult = await tryToCatchPokemon();
  const catchPokemonResult = await catchPokemon();

  res.render("pokeCatcher", { randomPokemon, catchPokemon: catchPokemonResult, tryToCatchPokemon: tryToCatchPokemonResult});
});

router.get("/compare", (req, res) => {
  res.render("pokeCompare");
});

router.get("/pokeDex", (req, res) => {
  res.render("pokeDex");
});

router.get("/pokeGuess", (req, res) => {
  res.render("pokeGuess");
});

router.get("/main", (req, res) => {
  res.render("pokeMain");
});

router.get("/viewer", (req, res) => {
  res.render("pokeViewer");
});

router.get("/acces-denied", (req, res) => {
  res.render("acces-denied");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

export default router;
