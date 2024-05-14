import express, { Router } from "express";
import { Request, Response } from "express";
import { registerUser, isEmailRegistered, isUsernameRegistered } from "../config/database";
import { validateRegisterForm } from "../middleware/handleFormValidation";

const router: Router = express.Router();

router.get("/", (req, res) => {
    res.type("text/html");
    res.render("register");
  });

  router.post("/", validateRegisterForm, async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).send("email, password, username need to be filled in");
        }
        const emailExists = await isEmailRegistered(email);
        if (emailExists) {
            req.session.message = { type: "error", message: "Email is already registered." };
            return res.redirect("/register");
        }
        const usernameExists = await isUsernameRegistered(username);
        if (usernameExists) {
            req.session.message = { type: "error", message: "Username is already taken." };
            return res.redirect("/register");
        }
        await registerUser(email, password, username);
        req.session.message = { type: "success", message: "Registration successful" };
        res.redirect("/login");
    } catch (e: any) {
        req.session.message = { type: "error", message: e.message };
        console.error("Error registering user:", e);
        res.status(500).redirect("/register");
    }
});

export default router;