import { API_KEY, PRIVATE_KEY } from "./apikey.js";

// Get HTML elements

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("name");
const results = document.getElementById("result");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const closeBtn = document.getElementById("close-btn");

// Event listeners

searchBtn.addEventListener("click", () => {
  searchCharacterByName(searchInput.value.trim());
});

results.addEventListener("click", getCharacterDetails);

closeBtn.addEventListener("click", () => {
  modal.classList.remove("showModal");
});

/**
 * Functions
 */

// Create character card list

const getCharacterList = () => {
  const TIMESTAMP = Date.now();
  const HASH = md5(TIMESTAMP + PRIVATE_KEY + API_KEY); // md5(ts+privateKey+publicKey)
  const URL = `http://gateway.marvel.com/v1/public/characters?limit=16&ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}`;

  searchInput.value = "";

  fetch(URL)
    .then((response) => response.json())
    .then((response) => {
      response.data.results.forEach((e) => {
        createCharacterCard(e);
      });
    })
    .catch((e) => console.log(e));
};

// Search character by name

const searchCharacterByName = (character) => {
  const characterName = encodeURIComponent(character);

  results.innerHTML = "";

  const TIMESTAMP = Date.now();
  const HASH = md5(TIMESTAMP + PRIVATE_KEY + API_KEY);
  const URL = `http://gateway.marvel.com/v1/public/characters?name=${characterName}&ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}`;

  fetch(URL)
    .then((response) => response.json())
    .then((response) => {
      if (response.data) {
        response.data.results.forEach((e) => {
          createCharacterCard(e);
        });
        results.classList.remove("not-found");
      } else {
        let html = `Personagem não encontrado`;
        results.classList.add("not-found");
        results.innerHTML = html;
      }
    })
    .catch((e) => console.log(e));
};

// Create character card

const createCharacterCard = (e) => {
  let card = "";

  const {
    id,
    name,
    thumbnail: { path, extension },
  } = e;

  let thumb = path + "." + extension;

  card = `
          <article data-id="${id}" class="item">                
            <img src="${thumb}" alt="" class="thumbnail" />
            <p class="character-name">${name}</p>
            <a href="#" class="link-info" id="info">Detalhes</a>
          </article>
        `;

  results.insertAdjacentHTML("beforeEnd", card);
};

// Get Character details and call modal

const getCharacterDetails = (e) => {
  e.preventDefault();
  if (e.target.classList.contains("link-info")) {
    let characterId = e.target.parentElement.dataset.id;
    console.log(characterId);

    const TIMESTAMP = Date.now();
    const HASH = md5(TIMESTAMP + PRIVATE_KEY + API_KEY); // md5(ts+privateKey+publicKey)
    const URL = `http://gateway.marvel.com/v1/public/characters/${characterId}?&ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}`;

    fetch(URL)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        createCharacterModal(response.data.results);
      })
      .catch((e) => console.log(e));
  }
};

// Insert data into HTML and make modal visible.

const createCharacterModal = (e) => {
  // destructuring
  const {
    id,
    name,
    description,
    thumbnail: { path, extension },
    series: { items: seriesList },
    events: { items: eventsList },
  } = e[0];

  let html = "";
  let image = path + "." + extension;

  html = `
    <div class="character-img">
      <img src="${image}" alt="${id}" />
    </div>

    <h2 class="character-title">${name}</h2>
    <p class="character-description">${
      description ? description : "sem descrição"
    }</p>

    <h3 class="character-series">Séries</h3>
    <ul>
      <li>${seriesList.length}</li>
      ${seriesList
        .map((serie) => {
          return `<li>${serie.name}</li>`;
        })
        .join("")}     
    </ul>

    <h3 class="character-events">Eventos</h3>
    <ul>
      <li> ${eventsList.length}</li>
      ${eventsList
        .map((event) => {
          return `<li>${event.name}</li>`;
        })
        .join("")}  
    </ul>
  `;
  modalContent.innerHTML = html;
  modal.classList.add("showModal");
};

getCharacterList();
