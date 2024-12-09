// Function to fetch data for Pokémon by their ID
function getPokemonById(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`; // API URL to get Pokémon data by ID
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return {
        name: data.name,
        image: data.sprites.front_default,
        type: data.types.map(type => type.type.name).join(", ") // Join multiple types if available
      };
    })
    .catch(error => {
      console.error("Error fetching Pokémon data:", error);
      return null;
    });
}

// Function to handle user input and fetch the required number of Pokémon cards
function handleFormSubmit(event) {
  event.preventDefault();
  
  const numOfCards = document.getElementById('numCards').value;
  const category = document.getElementById('category').value;

  // Get Pokémon IDs based on the selected category (Example: Electric type)
  fetchPokemonByCategory(category, numOfCards);
}

// Fetch Pokémon IDs by category (type)
function fetchPokemonByCategory(category, numOfCards) {
  const url = `https://pokeapi.co/api/v2/type/${category}/`; // Fetch Pokémon by type (category)
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Extract the first 'numOfCards' Pokémon IDs from the response
      let pokemonIds = data.pokemon.slice(0, numOfCards).map(pokemon => pokemon.pokemon.url.split('/')[6]);
      
      // Fetch Pokémon data for each ID
      let promises = pokemonIds.map(id => getPokemonById(id));
      
      // Once all Pokémon data is fetched, render the cards
      Promise.all(promises).then(pokemonData => {
        renderPokemonCards(pokemonData);
      });
    })
    .catch(error => {
      console.error("Error fetching Pokémon by category:", error);
    });
}

// Render Pokémon cards to the page
function renderPokemonCards(pokemonData) {
  let container = document.getElementById('pokemon-cards-container');
  container.innerHTML = ''; // Clear the container before rendering new cards
  
  pokemonData.forEach(data => {
    if (data) {
      let cardHTML = `
        <div class="pokemon-card">
          <img src="${data.image}" alt="${data.name}">
          <h3>${data.name}</h3>
          <p>Type: ${data.type}</p>
        </div>
      `;
      container.innerHTML += cardHTML;
    }
  });
}

// Event listener for form submission
document.getElementById('pokemon-form').addEventListener('submit', handleFormSubmit);

