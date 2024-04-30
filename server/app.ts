import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import indexRouter from "./routes/index";
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

app.use(handleError);

app.use(pageNotFoundMiddleware);

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
function session(arg0: { secret: string; resave: boolean; saveUninitialized: boolean; cookie: { secure: string; }; }): any {
  throw new Error("Function not implemented.");
}

