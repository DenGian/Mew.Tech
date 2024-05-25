
document.addEventListener('DOMContentLoaded', () => {
    const inputField1 = document.getElementById('pokemon-input-1');
    const inputField2 = document.getElementById('pokemon-input-2');
    const resultContainer1 = document.getElementById('result-container-1');
    const resultContainer2 = document.getElementById('result-container-2')
    const fetchPokemon = async (query, container) => {
        if (query) {
            try {
                const response = await fetch(`/compare/search?name=${query}`);
                const result = await response.json();
                container.innerHTML = `
                    <h2>${result.name}</h2>
                    <img src="${result.image}" alt="${result.name}">
                `;
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
            }
        } else {
            container.innerHTML = '';
        }
    }
    inputField1.addEventListener('input', () => {
        fetchPokemon(inputField1.value.trim(), resultContainer1);
    })
    inputField2.addEventListener('input', () => {
        fetchPokemon(inputField2.value.trim(), resultContainer2);
    });
});
