import express, { Router } from "express";


const router: Router = express.Router();

router.get("/", async (req, res) => {
  res.render("pokeBattler");
  });

export default router;