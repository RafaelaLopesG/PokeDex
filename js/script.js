const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
 
const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
 
let searchPokemon = 1;
 
const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}
const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';
  const data = await fetchPokemon(pokemon);
 
 
 
  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;
    pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    input.value = '';
    searchPokemon = data.id;} 
    else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});
buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});
buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});
renderPokemon(searchPokemon);

async function fetchAllPokemon() {
  const pokemonContainer = document.getElementById('pokemon-list');

  for (let i = 1; i <= totalPokemon; i++) {
      const pokemonUrl = `${apiUrl}${i}`;
      try {
          const response = await fetch(pokemonUrl);
          if (!response.ok) {
              throw new Error('Erro na requisição à API');
          }
          const pokemonData = await response.json();
          const pokemonCard = document.createElement('div');
          pokemonCard.classList.add('pokemon-card');
          pokemonCard.innerHTML = `
              <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
              <p>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</p>
          `;
          pokemonContainer.appendChild(pokemonCard);
      } catch (error) {
          console.error(`Erro ao recuperar dados do Pokémon ${i}`, error);
      }
  }
}

// Chame a função para buscar todos os 1208 Pokémon
fetchAllPokemon();
document.getElementById('search-button').addEventListener('click', () => {
  const searchInput = document.getElementById('search').value.toLowerCase();

  fetch(apiUrl + searchInput)
      .then(response => {
          if (!response.ok) {
              throw new Error('Pokémon não encontrado!');
          }
          return response.json();
      })
      .then(pokemonData => {
          clearPokemonList();
          createPokemonCard(pokemonData);
      })
      .catch(error => {
          console.error(error.message);
      });
});

// Função para limpar a lista de Pokémon no elemento com ID 'pokemon-list'
function clearPokemonList() {
  const pokemonContainer = document.getElementById('pokemon-list');
  pokemonContainer.innerHTML = ''; // Remove todo o conteúdo dentro do elemento
}

// Função para criar um card de Pokémon com base nos dados fornecidos
function createPokemonCard(pokemonData) {
  const pokemonContainer = document.getElementById('pokemon-list');
  const pokemonCard = document.createElement('div');
  pokemonCard.classList.add('pokemon-card');
  // Define o conteúdo do card com a imagem e o nome do Pokémon
  pokemonCard.innerHTML = `
<img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
<p>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</p>`;
  // Adiciona o card do Pokémon ao elemento com ID 'pokemon-list'
  pokemonContainer.appendChild(pokemonCard);
}
document.getElementById('search-button').addEventListener('click', () => {
  const searchInput = document.getElementById('search').value.toLowerCase();

  if (searchInput === '') {
      // Se a entrada de pesquisa estiver vazia, busque todos os Pokémon.
      clearPokemonList(); // Limpa a lista de Pokémon existente
      fetchAllPokemon(); // Busca todos os Pokémon novamente
  } else {
      fetch(apiUrl + searchInput)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Pokémon não encontrado!');
              }
              return response.json();
          })
          .then(pokemonData => {
              clearPokemonList();
              createPokemonCard(pokemonData); // Cria um card para o Pokémon encontrado
          })
          .catch(error => {
              console.error(error.message);
          });
  }
});

const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
let totalPokemon = 20; // Altere isso para o número inicial de Pokémon para carregar
let pokemonOffset = 0; // Rastreie o número de Pokémon já carregado
const pokemonContainer = document.getElementById('pokemon-list');

async function fetchMorePokemon() {
// Calcule o deslocamento para o próximo lote de Pokémon para carregar
const newOffset = pokemonOffset + totalPokemon;

for (let i = pokemonOffset + 1; i <= newOffset; i++) {
  const pokemonUrl = `${apiUrl}${i}`;
  try {
    const response = await fetch(pokemonUrl);
    if (!response.ok) {
      throw new Error('Error fetching Pokémon data');
    }
    const pokemonData = await response.json();
    createPokemonCard(pokemonData);
  } catch (error) {
    console.error(`Error fetching Pokémon data for ID ${i}`, error);
  }
}

// Atualize o deslocamento para o próximo lote
pokemonOffset = newOffset;
}

// Função para criar um cartão Pokémon
function createPokemonCard(pokemonData) {
const pokemonCard = document.createElement('div');
pokemonCard.classList.add('pokemon-card');

const types = pokemonData.types.map(type => type.type.name).join(', ');
const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(', ');

pokemonCard.innerHTML = `
    <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
    <p>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</p>
    <p>ID: ${pokemonData.id}</p>
    <p>Altura: ${pokemonData.height} dm</p>
    <p>Peso: ${pokemonData.weight} hg</p>
    <p>Tipos: ${types}</p>
    <p>Habilidades: ${abilities}</p>
`;
pokemonContainer.appendChild(pokemonCard);
}

// Carregue o lote inicial de Pokémon
fetchMorePokemon();

// Adicione um ouvinte de evento ao botão "Carregar mais Pokémon"
const loadMoreButton = document.getElementById('load-more-button');
loadMoreButton.addEventListener('click', () => {
fetchMorePokemon();
});