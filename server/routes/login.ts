import express, { Router } from "express";
import { User } from "../interfaces/userInterface";
import { login } from "../config/database";

const router: Router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
  });

  router.post("/", async(req, res) => {
    const email : string = req.body.email;
    const password : string = req.body.password;
    try {
        let user : User = await login(email, password);
        delete user.password; 
        req.session.user = user;
        req.session.message = {type: "success", message: "Login successful"};
        res.redirect("/");
    } catch (e : any) {
        req.session.message = {type: "error", message: e.message};
        res.redirect("/login");
    }
});

export default router;