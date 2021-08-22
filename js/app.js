import { API_KEY, PRIVATE_KEY } from "./apikey.js";

const searchBtn = document.getElementById("search-btn");
const results = document.getElementById("result");
const closeBtn = document.getElementById("close-btn");

searchBtn.addEventListener("click", getCharacterList);

// Home
function getCharacterList() {
  let searchInput = document.getElementById("name").value.trim();

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
      } else {
        html = `Personagem não encontrado`;
        results.classList.add("not-found");
      }
      results.innerHTML = html;
    })
    .catch((e) => console.log(e));

  // console.log(searchInput);
}
