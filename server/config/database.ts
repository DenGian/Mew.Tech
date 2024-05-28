import { Collection, MongoClient, ObjectId } from "mongodb";
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

async function registerUser(email: string, password: string, username: string, selectedPokemonId?: string): Promise<void> {
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
        const newUser: User = {
            email,
            password: hashedPassword,
            username,
            role: "USER",
            caughtPokemon: [],
            selectedPokemon: selectedPokemonId ? selectedPokemonId : undefined
        };
        await collectionUsers.insertOne(newUser);
        console.log("User registered successfully.");
    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Failed to register user.");
    }
}

///////////////////////////////

async function fetchEvolutionChain(speciesUrl: string): Promise<{ id: string; name: string; sprite: string }[]> {
    try {
        const speciesResponse = await axios.get(speciesUrl);
        const speciesData = speciesResponse.data;
        const evolutionChainUrl = speciesData.evolution_chain.url;

        const evolutionResponse = await axios.get(evolutionChainUrl);
        const evolutionData = evolutionResponse.data;

        const chain: any = evolutionData.chain;
        const evolutionChain: { id: string; name: string; sprite: string }[] = [];

        const traverseChain = async (chainLink: any) => {
            const id = chainLink.species.url.split('/').slice(-2, -1)[0];
            const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemonData = pokemonResponse.data;
            evolutionChain.push({ id, name: pokemonData.name, sprite: pokemonData.sprites.front_default });

            if (chainLink.evolves_to.length > 0) {
                await Promise.all(chainLink.evolves_to.map(async (evolution: any) => await traverseChain(evolution)));
            }
        };

        await traverseChain(chain);
        return evolutionChain;
    } catch (error) {
        console.error('Error fetching evolution chain:', error);
        throw new Error('Failed to fetch evolution chain.');
    }
}
  
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
  
        const speciesUrl = pokemon.species ? pokemon.species.url : null;
        let evolutionChain: { id: string; name: string; sprite: string; }[] = [];
  
        if (speciesUrl) {
          evolutionChain = await fetchEvolutionChain(speciesUrl);
        }
  
        const pokemonData: PokemonData = {
          id: pokemon.id.toString(),
          name: pokemon.name,
          sprites: { front_default: pokemon.sprites.front_default },
          stats: pokemon.stats.map((stat: any) => ({ name: stat.stat.name, base_stat: stat.base_stat })),
          abilities: pokemon.abilities.map((ability: any) => ({ ability: { name: ability.ability.name } })),
          url: speciesUrl,
          evolution_chain: evolutionChain,
          types: pokemon.types.map((type: any) => ({ type: { name: type.type.name } }))
        };
  
        await collectionPokemon.insertOne(pokemonData);
        console.log(`Inserted ${pokemonData.name} into MongoDB`);
      }
      console.log('All Pokémon data inserted successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  }

async function getAllPokemon(skip: number = 0, limit: number = Infinity): Promise<{ pokemonData: PokemonData[]; totalPokemonCount: number }> {
    try {
        const pokemonData = await collectionPokemon.find({}).skip(skip).limit(limit).toArray();
        const totalPokemonCount = await collectionPokemon.countDocuments();
        return { pokemonData, totalPokemonCount };
    } catch (error) {
        throw new Error(`An error occurred while fetching Pokémon data: ${error}`);
    }
}

async function getCaughtPokemon(userId: any) {
    try {
        const user = await collectionUsers.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }
        const caughtPokemonIds = user.caughtPokemon;
        const caughtPokemonData = await collectionPokemon.find({ id: { $in: caughtPokemonIds } }).toArray();
        return caughtPokemonData;
    } catch (error) {
        console.error("Error fetching caught Pokémon:", error);
        throw new Error("Failed to fetch caught Pokémon.");
    }
}

async function updateUser(userId: string, newUsername: string, newEmail: string) {
    try {
        const result = await collectionUsers.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { username: newUsername, email: newEmail } }
        );
        if (result.matchedCount === 0) {
            throw new Error("No user found with the given ID");
        }
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user.");
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

async function updatePokemonName(pokemonId: string, newName: string) {
    try {
        await collectionPokemon.updateOne({ id: pokemonId }, { $set: { name: newName } });
    } catch (error) {
        throw new Error(`An error occurred while updating Pokémon name: ${error}`);
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

export { connect, getAllPokemon, updatePokemonName, updateUser, getPokemonById, filteredPokemon, loadPokemonsFromApi, collectionPokemon, getCaughtPokemon, registerUser, isEmailRegistered, isUsernameRegistered, collectionUsers };

