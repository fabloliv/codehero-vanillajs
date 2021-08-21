import { API_KEY, PRIVATE_KEY } from "./apikey.js";

const searchBtn = document.getElementById("search-btn");
const results = document.getElementById("result");
const closeBtn = document.getElementById("close-btn");

searchBtn.addEventListener("click", getCharacterList);

function getCharacterList() {
  const TIMESTAMP = Date.now();
  // md5(ts+privateKey+publicKey)
  const HASH = md5(TIMESTAMP + PRIVATE_KEY + API_KEY);
  const URL = `http://gateway.marvel.com/v1/public/characters?limit=5&ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}`;

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((e) => console.log(e));
}
