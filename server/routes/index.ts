import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/contact", (req, res) => {
    res.render("index");
});

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/", (req, res) => {
    res.render("index");
});

export default router;