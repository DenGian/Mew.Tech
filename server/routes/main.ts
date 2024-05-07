import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", async(req, res) => {
  if (req.session.user) {
      res.render("pokeMain", {user: req.session.user});
  } else {
      res.redirect("/login");
  }
});

export default router;
