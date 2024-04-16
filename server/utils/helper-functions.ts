async function fetchPokemonData(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error: unknown) {
        console.error('Error fetching Pokémon data:', error);
        return { error: (error as Error).message };
    }
}