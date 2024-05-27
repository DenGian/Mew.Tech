import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", async(req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

export default router;