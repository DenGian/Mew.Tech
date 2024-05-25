import dotenv from "dotenv";
import session, { MemoryStore } from "express-session";
import { User } from "../interfaces/userInterface";
import { FlashMessage } from "../interfaces/flashMessageInterface";
import mongoDbSession from "connect-mongodb-session";
const MongoDBStore = mongoDbSession(session);

dotenv.config();

const mongoStore = new MongoDBStore({
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017",
    collection: "sessions",
    databaseName: "wpl",
});

declare module 'express-session' {
    export interface SessionData {
        user?: User
        message?: FlashMessage;
    }
}

declare module 'express-session' {
    interface SessionData {
      correctGuesses: number;
      incorrectGuesses: number;
    }
  }

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
});