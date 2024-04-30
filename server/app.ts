import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import indexRouter from "./routes/index";
import accesDeniedRouter from "./routes/accesDenied";
import battlerRouter from "./routes/battler";
import catcherRouter from "./routes/catcher";
import compareRouter from "./routes/compare";
import contactRouter from "./routes/contact";
import guessRouter from "./routes/guess";
import loginRouter from "./routes/login";
import pokeDexRouter from "./routes/pokeDex";
import registerRouter from "./routes/register";
import viewerRouter from "./routes/viewer";
import { handleError } from "./middleware/handleError";
import { loggingMiddleware } from "./middleware/handleLogging";
import { pageNotFoundMiddleware } from "./middleware/handlePageNotFound";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.set("views", path.join(__dirname, "..", "client", "views"));


app.set("port", process.env.PORT || 3000);

app.use(loggingMiddleware);

app.use("/", indexRouter);
app.use("/acces-denied", accesDeniedRouter);
app.use("/battler", battlerRouter);
app.use("/catcher", catcherRouter);
app.use("/compare", compareRouter);
app.use("/contact", contactRouter);
app.use("/pokeGuess", guessRouter);
app.use("/login", loginRouter);
app.use("/pokeDex", pokeDexRouter);
app.use("/register", registerRouter);
app.use("/viewer", viewerRouter);


app.use(handleError);

app.use(pageNotFoundMiddleware);

app.listen(app.get("port"), async () => {
  console.log(`Server is running on port ${app.get("port")}`);
});


