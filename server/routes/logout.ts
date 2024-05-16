import express, { Router } from "express";

const router: Router = express.Router();

router.post("/", async(req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

export default router;