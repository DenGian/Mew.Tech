import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/main", (req, res) => {
  res.render("pokeMain");
});

export default router;
