import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/contact", (req, res) => {
    res.render("index");
});

router.get("/battler", (req, res) => {
    res.render("index");
});

router.get("/catcher", (req, res) => {
    res.render("index");
});

router.get("/compare", (req, res) => {
    res.render("index");
});

router.get("/pokeDex", (req, res) => {
    res.render("index");
});

router.get("/pokeGuess", (req, res) => {
    res.render("index");
});

router.get("/main", (req, res) => {
    res.render("index");
});

router.get("/viewer", (req, res) => {
    res.render("index");
});

router.get("/acces-denied", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("index");
});

router.get("/register", (req, res) => {
    res.render("index");
});

export default router;