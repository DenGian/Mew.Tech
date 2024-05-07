import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import session from 'express-session';
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

// Session middleware configuration
app.use(session({
  secret: 'your_secret_key',  // Change 'your_secret_key' to a real secret in production
  resave: false,
  saveUninitialized: false,   // Changed to false for better security with uninitialized sessions
  cookie: {
    secure: false,  // Set to true if you’re using HTTPS, false if you’re using HTTP
    maxAge: 1000 * 60 * 60 * 24 // Sets cookie to expire in 24 hours
  }
}));

app.set("port", process.env.PORT || 3000);

app.use(loggingMiddleware);

// Route that uses session
app.use("/", indexRouter);

app.use(handleError);

app.use(pageNotFoundMiddleware);

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
