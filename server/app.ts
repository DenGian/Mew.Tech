// app.ts
import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import indexRouter from "./routes/index"; // Import the router file

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.set('views', path.join(__dirname, "..", "client", "views"));

app.set("port", process.env.PORT || 3000);

app.get("", (req, res) => {
    res.type("text/html");
    res.render("index");
});

app.use("/", indexRouter);

app.use((req, res) => {
    res.status(404).send("404, page not found");
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});
