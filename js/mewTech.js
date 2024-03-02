async function getPokemonAPI() {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
      const data = await response.json(); // Parse the response body as JSON
      console.log(data); // Log the data to the console
    } catch (error) {
      console.error('Error:', error); // Handle any errors
    }
  }
  
  getPokemonAPI(); // Call the function