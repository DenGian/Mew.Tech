import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { pokemon } from "../interfaces/pokemonInterface";
import { PokemonData } from "../interfaces/pokemonInterface";
import { User } from "../interfaces/userInterface";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

const collectionPokemon: Collection<pokemon> = client.db("wpl").collection<pokemon>("pokemon");
const collectionPokemonData: Collection<PokemonData> = client.db("wpl").collection<PokemonData>("pokemonData");
const collectionUsers: Collection<User> = client.db("wpl").collection<User>("users");

const pokemonApi = "https://pokeapi.co/api/v2/pokemon/";

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

const saltRounds : number = 10;

async function createInitialUser() {
    if (await collectionUsers.countDocuments() > 0) {
        return;
    }
    let email : string | undefined = process.env.ADMIN_EMAIL;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await collectionUsers.insertOne({
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    });
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await collectionUsers.findOne<User>({email: email});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Email/password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

///////////////////////////////

async function loadPokemonsFromApi(collectionPokemon: Collection<pokemon>) {
    try {
        console.log("Loading pokemons from API...");

        const batchSize = 100;

        const generationRanges = [
            { start: 1, end: 151 },
            { start: 152, end: 251 }
        ];

        for (const range of generationRanges) {
            for (let i = range.start; i <= range.end; i += batchSize) {
                const response = await fetch(`${pokemonApi}?limit=${batchSize}&offset=${i}`);
                const data = await response.json();

                const pokemonData = await Promise.all(data.results.map(async (pokemonInfo: any) => {
                    const pokemonResponse = await fetch(pokemonInfo.url);
                    const pokemonDetails = await pokemonResponse.json();

                    return {
                        id: pokemonDetails.id,
                        name: pokemonDetails.name,
                        url: pokemonInfo.url,
                        sprites: pokemonDetails.sprites
                    };
                }));

                if (pokemonData.length > 0) {
                    console.log("Inserting pokemons into the database...");
                    await collectionPokemon.insertMany(pokemonData);
                    console.log(`${pokemonData.length} pokemons inserted into the database.`);
                } else {
                    console.log("No more pokemons to insert.");
                }
            }
        }
        console.log("Database is up to date, no action needed");
    } catch (error) {
        console.error("An error occurred while loading pokemons from API: ", error);
    }
}

async function loadPokemonDataFromApi(collectionPokemonData: Collection<PokemonData>) {
    try {
        console.log("Loading detailed Pokémon data from API...");

        const batchSize = 100;

        const generationRanges = [
            { start: 1, end: 151 },
            { start: 152, end: 251 }
        ];

        for (const range of generationRanges) {
            for (let i = range.start; i <= range.end; i += batchSize) {
                const response = await fetch(`${pokemonApi}?limit=${batchSize}&offset=${i}`);
                const data = await response.json();

                const pokemonData = await Promise.all(data.results.map(async (pokemonInfo: any) => {
                    try {
                        const pokemonResponse = await fetch(pokemonInfo.url);
                        const pokemonDetails = await pokemonResponse.json();

                        const formattedPokemonData: PokemonData = {
                            id: pokemonDetails.id,
                            name: pokemonDetails.name,
                            sprites: pokemonDetails.sprites,
                            stats: pokemonDetails.stats,
                            abilities: pokemonDetails.abilities
                        };

                        return formattedPokemonData;
                    } catch (error) {
                        console.error(`Error processing Pokémon data for ${pokemonInfo.name}: ${error}`);
                        return null;
                    }
                }));

                const filteredPokemonData = pokemonData.filter((pokemon) => pokemon !== null);

                if (filteredPokemonData.length > 0) {
                    console.log("Inserting Pokémon data into the database...");
                    try {
                        await collectionPokemonData.insertMany(filteredPokemonData);
                        console.log(`${filteredPokemonData.length} Pokémon data inserted into the database.`);
                    } catch (error) {
                        console.error("Error inserting Pokémon data into the database:", error);
                    }
                } else {
                    console.log("No Pokémon data to insert.");
                }
            }
        }
        console.log("Database is up to date, no action needed");
    } catch (error) {
        console.error("An error occurred while loading Pokémon data from API: ", error);
    }
}


async function getAllPokemon(): Promise<PokemonData[]> {
    try {
        const data = await collectionPokemonData.find({}).toArray();
        return data;
    } catch (error) {
        throw new Error(`An error occurred while fetching data: ${error}`);
    }
}

async function filteredPokemon(searchTerm: string): Promise<pokemon[]> {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    try {
        const searchResult = await collectionPokemon.find({
            name: { $regex: lowerCaseSearchTerm, $options: "i" }
        }).toArray();
        return searchResult;
    } catch (error) {
        console.error("An error occurred while filtering pokemon:", error);
        return [];
    }
}

async function getPokemonById(pokemonId: string): Promise<pokemon | null> {
    try {
        return await collectionPokemon.findOne({ id: pokemonId }) || null;
    } catch (error) {
        throw new Error(`An error occurred while fetching data: ${error}`);
    }
}

export async function updateLanguage(pokemonId: string, updatedPokemon: pokemon) {
    try {
        await collectionPokemon.updateOne({ id: pokemonId }, { $set: updatedPokemon });
    } catch (error) {
        throw new Error(`An error occurred while updating language: ${error}`);
    }
}

async function connect() {
    await client.connect();
    await loadPokemonsFromApi(collectionPokemon);
    await loadPokemonDataFromApi(collectionPokemonData);
    await createInitialUser();
    console.log("Connected to database");
    process.on("SIGINT", exit);
}

export { connect, getAllPokemon, getPokemonById, filteredPokemon, loadPokemonsFromApi, loadPokemonDataFromApi, collectionPokemon, collectionPokemonData };
