import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", async (req, res) => {
  res.send("Welcome to the Pokédex!");
});

export default router;
