import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    email: string;
    password?: string;
    username?: string;
    role: "ADMIN" | "USER";
    caughtPokemon?: string[];
    selectedPokemon?: string;
}
