import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import indexRouter from "./routes/index";
import mainRouter from "./routes/main"
import accessDeniedRouter from "./routes/accessDenied";
import battlerRouter from "./routes/battler";
import catcherRouter from "./routes/catcher";
import compareRouter from "./routes/compare";
import contactRouter from "./routes/contact";
import guessRouter from "./routes/guess";
import loginRouter from "./routes/login";
import logoutRouter from "./routes/logout"
import pokeDexRouter from "./routes/pokeDex";
import registerRouter from "./routes/register";
import viewerRouter from "./routes/viewer";
import { handleError } from "./middleware/handleError";
import { loggingMiddleware } from "./middleware/handleLogging";
import { pageNotFoundMiddleware } from "./middleware/handlePageNotFound";
import { secureMiddleware } from "./middleware/handleSecure";
import { connect } from "./config/database";
import session from "./middleware/handleSession";
import cookieParser from "cookie-parser";
import { flashMiddleware } from "./middleware/handleFlash";


dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.set("views", path.join(__dirname, "..", "client", "views"));

app.use(cookieParser());

app.use(session);

const PORT = process.env.PORT || 3000;

app.use(loggingMiddleware);

app.use(flashMiddleware);

app.use("/", indexRouter);
app.use("/main", mainRouter);
app.use("/access-denied", accessDeniedRouter);
app.use("/battler", secureMiddleware, battlerRouter);
app.use("/catcher", secureMiddleware, catcherRouter);
app.use("/compare", secureMiddleware, compareRouter);
app.use("/contact", secureMiddleware, contactRouter);
app.use("/pokeGuess", secureMiddleware, guessRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/pokeDex", secureMiddleware, pokeDexRouter);
app.use("/register", registerRouter);
app.use("/viewer", secureMiddleware, viewerRouter);


app.use(handleError);

app.use(pageNotFoundMiddleware);

app.listen(PORT, async () => {
	try {
		await connect();
		console.log(`Server is running on port ${PORT}`);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
});
