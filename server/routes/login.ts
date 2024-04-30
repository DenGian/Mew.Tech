import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
  });

  router.post("/", (req, res) => {
    res.cookie("username", req.body.username);
    res.redirect("/register");
  });
export default router;