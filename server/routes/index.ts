import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", (req, res) => {
  const user = req.session.user || null;
  res.render("index", { user }); 
});

export default router;
