import express, { Router, Request, Response } from "express";
import { updateUser } from "../config/database";
import { User } from "../interfaces/userInterface";

const router: Router = express.Router();

router.get("/", (req, res) => {
    const user: User | undefined = req.session.user;
    res.render("pokeViewer", { user }); 
});

function isUserDefined(user: any): user is User {
    return user !== undefined && user._id !== undefined;
}

router.post("/", async (req: Request, res: Response) => {
  try {
      const { username, email } = req.body; 
      const user = req.session.user;
      if (!user || !isUserDefined(user)) {
          res.status(400).send("User not found in session or missing ID");
          return;
      }
      await updateUser(user._id!.toString(), username, email);
      if (username) {
          req.session.user!.username = username;
      }
      if (email) {
          req.session.user!.email = email;
      }
      req.session.save((err) => {
          if (err) {
              console.error("Error saving session:", err);
              res.status(500).render("error", { message: "An error occurred while saving your session.", error: err });
              return;
          }
          res.redirect("/main");
      });
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).render("error", { message: "An error occurred while updating your profile.", error });
  }
});

export default router;
