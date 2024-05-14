import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PokemonData } from "../interfaces/pokemonInterface";
import { User } from "../interfaces/userInterface";
import axios from "axios";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

const client = new MongoClient(MONGODB_URI);

const collectionPokemon: Collection<PokemonData> = client.db("wpl").collection<PokemonData>("pokemon");
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

async function isEmailRegistered(email: string): Promise<boolean> {
    try {
        const existingUser = await collectionUsers.findOne({ email });
        return !!existingUser;
    } catch (error) {
        console.error("Error checking email registration:", error);
        throw new Error("Failed to check email registration.");
    }
}

async function isUsernameRegistered(username: string): Promise<boolean> {
    try {
        const existingUser = await collectionUsers.findOne({ username });
        return !!existingUser;
    } catch (error) {
        console.error("Error checking username registration:", error);
        throw new Error("Failed to check username registration.");
    }
}

async function registerUser(email: string, password: string, username: string): Promise<void> {
    try {
        const emailExists = await isEmailRegistered(email);
        if (emailExists) {
            throw new Error("Email is already registered.");
        }
        const usernameExists = await isUsernameRegistered(username);
        if (usernameExists) {
            throw new Error("Username is already taken.");
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await collectionUsers.insertOne({
            email,
            password: hashedPassword,
            username,
            role: "USER"
        });
        console.log("User registered successfully.");
    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Failed to register user.");
    }
}

///////////////////////////////

async function loadPokemonsFromApi(collectionPokemon: Collection<PokemonData>) {
    const MAX_POKEMON_ID = 251;

    try {
        const count = await collectionPokemon.countDocuments();
        if (count > 0) {
            console.log('Pokémon data already exists in the database. Skipping fetch operation.');
            return;
        }
        for (let i = 1; i <= MAX_POKEMON_ID; i++) {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const pokemon = response.data;

            const pokemonData: PokemonData = {
                id: pokemon.id.toString(),
                name: pokemon.name,
                sprites: { front_default: pokemon.sprites.front_default },
                stats: pokemon.stats.map((stat: any) => ({ name: stat.stat.name, base_stat: stat.base_stat })),
                abilities: pokemon.abilities.map((ability: any) => ({ ability: { name: ability.ability.name } })),
                url: pokemon.species ? pokemon.species.url : null,
            };
            
            await collectionPokemon.insertOne(pokemonData);
            console.log(`Inserted ${pokemonData.name} into MongoDB`);
        }
        console.log('All Pokémon data inserted successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

<<<<<<< HEAD
=======
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


>>>>>>> 5da78bb (stash)
async function getAllPokemon(): Promise<PokemonData[]> {
    try {
        const data = await collectionPokemonData.find({}).toArray();
        return data;
    } catch (error) {
        throw new Error(`An error occurred while fetching data: ${error}`);
    }
}

async function filteredPokemon(searchTerm: string): Promise<PokemonData[]> {
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

async function getPokemonById(pokemonId: string): Promise<PokemonData | null> {
    try {
        return await collectionPokemon.findOne({ id: pokemonId }) || null;
    } catch (error) {
        throw new Error(`An error occurred while fetching data: ${error}`);
    }
}

export async function updateLanguage(pokemonId: string, updatedPokemon: PokemonData) {
    try {
        await collectionPokemon.updateOne({ id: pokemonId }, { $set: updatedPokemon });
    } catch (error) {
        throw new Error(`An error occurred while updating language: ${error}`);
    }
}

async function connect() {
    await client.connect();
    await loadPokemonsFromApi(collectionPokemon);
    await createInitialUser();
    console.log("Connected to database");
    process.on("SIGINT", async () => {
        console.log("\nSIGINT received. Shutting down...");
        await exit();
    });
    process.on("SIGTERM", async () => {
        console.log("\nSIGTERM received. Shutting down...");
        await exit();
    });
}

export { connect, getAllPokemon, getPokemonById, filteredPokemon, loadPokemonsFromApi, collectionPokemon, registerUser, isEmailRegistered, isUsernameRegistered };
