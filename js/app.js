import { API_KEY, PRIVATE_KEY } from "./apikey.js";

const searchBtn = document.getElementById("search-btn");
const results = document.getElementById("result");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const closeBtn = document.getElementById("close-btn");

searchBtn.addEventListener("click", getCharacterList);

closeBtn.addEventListener("click", () => {
  modal.classList.remove("showModal");
});

// Home
function getCharacterList() {
  //let searchInput = document.getElementById("name").value.trim();

  const TIMESTAMP = Date.now();
  // md5(ts+privateKey+publicKey)
  const HASH = md5(TIMESTAMP + PRIVATE_KEY + API_KEY);
  const URL = `http://gateway.marvel.com/v1/public/characters?limit=10&ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}`;

  fetch(URL)
    .then((response) => response.json())
    .then((response) => {
      let html = "";
      let thumb = "";

      if (response.data) {
        response.data.results.map(
          ({ id, name, thumbnail: { path, extension } }) => {
            thumb = path + "." + extension;

            html += `
              <article data-id="${id}" class="item">                
                <img src="${thumb}" alt="" class="thumbnail" />
                <p class="character-name">${name}</p>
                <a href="#" class="link-info" id="info">Detalhes</a>
              </article>
            `;
            //console.log(name + id + path + "." + extension);
          }
        );
        results.classList.remove("not-found");
      } else {
        html = `Personagem não encontrado`;
        results.classList.add("not-found");
      }
      results.innerHTML = html;
    })
    .catch((e) => console.log(e));

  // console.log(searchInput);
}

function createModal() {
  let html = "";
  html = `
    <div class="character-img">
      <img src="img/character.jpg" alt="" />
    </div>

    <h2 class="character-title">Tony Stark</h2>
    <p class="character-description">
      Genius. Billionaire. Philanthropist. Tony Stark's confidence is
      only matched by his high-flying abilities as the hero called Iron
      Man.
    </p>

    <h3 class="character-series">Séries</h3>
    <ul>
      <li>Amazing Spider-Man (1999 - 2013)</li>
      <li>AMAZING SPIDER-MAN VOL. 10: NEW AVENGERS TPB (2005)</li>
      <li>Black Goliath (1976)</li>
    </ul>

    <h3 class="character-events">Eventos</h3>
    <ul>
      <li>Civil War</li>
      <li>House of M</li>
      <li>Other - Evolve or Die</li>
    </ul>
  `;
  modalContent.innerHTML = html;
  modal.classList.add("showModal");
}
createModal();
