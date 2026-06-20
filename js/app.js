import { fetchLocations, fetchWeather } from "./api.js";
import {
  displaySuggestions,
  searchResults,
  removeSearchResult,
  showWeather,
  hourlyDayList,
  dayDropDownBtn,
  loadHourlyForecast,
  noSearchResult,
  showShimmer,
} from "./ui.js";

const userPreference = JSON.parse(localStorage.getItem("userPreference")) || {
  temperature: "celcius",
  wind: "kmh",
  precipitation: "mm",
};
const cityDetails = {
  lat: 52.52437,
  lon: 13.41053,
  name: "Berlin",
  admin1: "State Of Berlin",
  country: "Germany",
};

let unitBtn = document.querySelector("#unit-btn");
unitBtn.addEventListener("click", function () {
  document.querySelector(".units-menu").classList.toggle("active");
});
let selectDay = document.querySelector("#select-day");
selectDay.addEventListener("click", () => {
  document.querySelector(".days-list ul").classList.toggle("active");
});

let searchInput = document.querySelector("#search-input");
let searchBtn = document.querySelector("#search-btn");
searchInput.addEventListener("input", handleSearch);

let debounceTimer;
function handleSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async function () {
    let cities;
    if (searchInput.value.length > 0) {
      cities = await fetchLocations(
        searchInput.value.replace(/[^a-zA-Z0-9_-]/g, ""),
        5,
      );
      displaySuggestions(cities);
    } else if (searchInput.value.length === 0) {
      cities = [];
      displaySuggestions(cities);
    }
    if (searchInput.value === "") {
      noSearchResult.classList.remove("active");
    }
  }, 300);
}

searchResults.addEventListener("click", (e) => {
  getCoordinates(e);
});
searchBtn.addEventListener("click", (e) => {
  getCoordinates(e, document.querySelector(".search-results .result"));
});

export let CityName =
  "" || `${cityDetails.name}, ${cityDetails.admin1}, ${cityDetails.country}`;
async function getCoordinates(e, searchBtnQuery) {
  let res = e.target.closest(".result") || searchBtnQuery;
  if (res) {
    for (const key in cityDetails) {
      cityDetails[key] = res.dataset[key];
    }
    CityName = `${cityDetails.name}, ${cityDetails.admin1}, ${cityDetails.country}`;
    searchInput.value = `${cityDetails.name}, ${cityDetails.admin1}, ${cityDetails.country}`;
    removeSearchResult();
    updateWeather();
  }
}

hourlyDayList.onclick = (e) => {
  let li = e.target.closest("li");
  if (li) {
    li.parentElement.classList.remove("active");
    dayDropDownBtn.textContent = li.textContent;
    loadHourlyForecast(Number(li.dataset.index));
  }
};

const unitMenu = document.querySelector(".units-menu");
unitMenu.addEventListener("click", async (e) => {
  const li = e.target.closest("li");
  if (li) {
    userPreference[li.parentElement.dataset.group] = li.id;
    localStorage.setItem("userPreference", JSON.stringify(userPreference));
    unitMenu.classList.remove("active");
    li.parentElement.querySelectorAll("li").forEach((e) => {
      e.classList.remove("active");
    });
    li.classList.add("active");
    updateWeather();
  }
});

(async () => {
  showWeather(await fetchWeather(cityDetails, userPreference));
  for (const key in userPreference) {
    document.querySelector(`#${userPreference[key]}`)?.classList.add("active");
  }
})();

let retryBtn = document.querySelector(".retry");
retryBtn.addEventListener("click", async () => {
  showWeather(await fetchWeather(cityDetails, userPreference));
});

async function updateWeather() {
  showShimmer();
  showWeather(await fetchWeather(cityDetails, userPreference));
}
