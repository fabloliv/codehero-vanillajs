import { API_KEY, PRIVATE_KEY } from "./apikey.js";

// Initialize variables

const baseURL = "https://gateway.marvel.com";
const endpoint = "/v1/public/characters";

const overlay = document.createElement("div");

// Get HTML elements

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("name");
const results = document.getElementById("result");
const modal = document.getElementById("modal");
const body = document.querySelector("body");

const modalContent = document.getElementById("modal-content");
const closeBtn = document.getElementById("close-btn");

// Event listeners

searchBtn.addEventListener("click", () => {
  searchInput.value == ""
    ? alert("Digite o nome")
    : searchCharacterByName(searchInput.value.trim());
});

results.addEventListener("click", getCharacterDetails);

const toggleModal = function () {
  if (modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
    body.appendChild(overlay);
  } else {
    modal.classList.add("hidden");
    document.body.removeChild(overlay);
  }
};

closeBtn.addEventListener("click", toggleModal);

overlay.className = "overlay";
overlay.addEventListener("click", toggleModal);

/**
 * Functions
 */

// Create character card list

const getCharacterList = () => {
  const TIMESTAMP = Date.now();
  const HASH = md5(TIMESTAMP + PRIVATE_KEY + API_KEY);

  let parameters = `?limit=20&offset=40&ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}`;

  let URL = baseURL + endpoint + parameters;

  searchInput.value = "";

  fetch(URL)
    .then((response) => response.json())
    .then((response) => {
      response.data.results.forEach((e) => {
        // create card
        createCharacterCard(e);
      });
    })
    .catch((e) => console.log(e));
};

getCharacterList();

// Search character by name

const searchCharacterByName = (character) => {
  const characterName = encodeURIComponent(character);

  const TIMESTAMP = Date.now();
  const HASH = md5(TIMESTAMP + PRIVATE_KEY + API_KEY);

  let parameters = `?name=${characterName}&ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}`;

  let URL = baseURL + endpoint + parameters;

  results.innerHTML = "";

  fetch(URL)
    .then((response) => response.json())
    .then((response) => {
      if (response.data.count) {
        response.data.results.forEach((e) => {
          createCharacterCard(e);
        });
        results.classList.remove("not-found");
      } else {
        let html = `<strong>Personagem não encontrado</strong>`;
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
          <article id="${id}" class="card">
            <figure class="character-thumbnail">
              <a href="#" data-id="${id}" class="show-details" title="Veja detalhes">
                <img
                  loading="lazy"
                  src="${thumb}"
                  alt=""
                  height="150"
                />
              </a>
              <figcaption class="character-name">${name}</figcaption>
          </article>
        `;

  results.insertAdjacentHTML("beforeEnd", card);
};

// Get Character details and call modal

function getCharacterDetails(e) {
  e.preventDefault();

  if (e.target.parentElement.classList.contains("show-details")) {
    let characterId = e.target.parentElement.dataset.id;

    const TIMESTAMP = Date.now();
    const HASH = md5(TIMESTAMP + PRIVATE_KEY + API_KEY);

    let parameters = `/${characterId}?&ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}`;

    let URL = baseURL + endpoint + parameters;

    fetch(URL)
      .then((response) => response.json())
      .then((response) => {
        // send data to modal
        createCharacterModal(response.data.results);
      })
      .catch((e) => console.log(e));
  }
}

// Insert data into HTML and make modal visible.

const createCharacterModal = (e) => {
  // destructuring data
  const {
    id,
    name,
    description,
    thumbnail: { path, extension },
    series: { items: seriesList },
    events: { items: eventsList },
  } = e[0];

  let body = "";
  let image = path + "." + extension;
  let seriesSection = "";
  let eventsSection = "";

  if (seriesList.length > 0) {
    seriesSection = `
      <h3 class="character-series">Algumas séries em que participou</h3>
      <ul>
        ${seriesList
          .slice(0, 3)
          .map((serie) => {
            return `<li>${serie.name}</li>`;
          })
          .join("")}     
      </ul>
    `;
  }

  if (eventsList.length > 0) {
    eventsSection = `
      <h3 class="character-events">Alguns eventos em que participou</h3>
      <ul>
        ${eventsList
          .slice(0, 3)
          .map((event) => {
            return `<li>${event.name}</li>`;
          })
          .join("")}  
      </ul>
    `;
  }

  body = `
    <div class="character-img">
      <img src="${image}" loading="lazy" height="150" alt="${name}" />
    </div>

    <h2 class="character-title">${name}</h2>
    <p class="character-description">${
      description ? description : "Sem descrição disponível"
    }</p>
    ${seriesSection}
    ${eventsSection}
  `;

  modalContent.innerHTML = body;
  toggleModal();
};
