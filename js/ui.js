const degreeSign = "°";
const percentageSign = "%";
const weatherCodes = {
  0: "sunny",
  1: "sunny",
  2: "partly-cloudy",
  3: "overcast",
  45: "fog",
  48: "fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "drizzle",
  57: "drizzle",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "rain",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
};
export const searchResults = document.querySelector(".search-results");
export const noSearchResult = document.querySelector(".no-search-result");
export function displaySuggestions(cities) {
  if (cities.length > 0) {
    noSearchResult.classList.remove("active");
    searchResults.classList.add("active");
    searchResults.innerHTML = "";
    cities.forEach((element) => {
      searchResults.insertAdjacentHTML(
        "beforeend",
        `<li tabindex="0"
  data-country="${element.country}"
  data-admin1="${element.admin1}"
  data-name="${element.name}"
  data-lat="${element.latitude}"
  data-lon="${element.longitude}"
  class="result">
  <span class="result-city">${element.name},</span>
  <span class="result-state"> ${element.admin1 || ""},</span>
  <span class="result-country"> ${element.country}</span>
</li>`,
      );
    });
  } else {
    noSearchResult.classList.add("active");
    removeSearchResult();
  }
}
export function removeSearchResult() {
  searchResults.innerHTML = "";
  searchResults.classList.remove("active");
}

export const hourlyDayList = document.querySelector(".Hourly-day-list");
export const dayDropDownBtn = document.querySelector("#day-selected");
let weatherData;
const mainTemp = document.querySelector(".temperature-degree");
const mainWeatherVisual = document.querySelector(".weather-visual");
const mainPlaceName = document.querySelector(".main-place-name");
const mainDate = document.querySelector("time");
const feelsLike = document.querySelector(".feels-like");
const humidity = document.querySelector(".humidity-value");
const wind = document.querySelector(".wind-value");
const precipitation = document.querySelector(".precipitation-value");
const hourContainer = document.querySelector(".hours-list");
export async function showWeather(data, CityName) {
  weatherData = data;
  mainTemp.textContent = `${Math.round(data.current.temperature_2m)}${degreeSign}`;
  mainWeatherVisual.src = `assets/images/icon-${weatherCodes[data.current.weather_code]}.webp`;
  mainPlaceName.textContent = CityName;
  let date = new Date(data.current.time).toLocaleDateString("en-us", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  mainDate.textContent = date;
  feelsLike.textContent = `${Math.round(data.current.apparent_temperature)}${degreeSign}`;
  humidity.textContent = `${data.current.relative_humidity_2m || "none"}${percentageSign}`;
  wind.textContent = `${data.current.wind_speed_10m || "none"} ${data.current_units.wind_speed_10m}`;
  precipitation.textContent = `${data.current.precipitation} ${data.current_units.precipitation}`;

  let forecastDaysCont = document.querySelector(".forecast-days");
  forecastDaysCont.innerHTML = "";
  for (let i = 0; i < data.daily.time.length; i++) {
    forecastDaysCont.insertAdjacentHTML(
      "beforeend",
      `<div class="forecast-item">
      <div class="skeleton-box">
                <div class="shimmer"></div>
              </div>
                <span class="day">${new Date(
                  data.daily.time[i],
                ).toLocaleDateString("en-us", {
                  weekday: "short",
                })}</span>
                <img src="assets/images/icon-${weatherCodes[data.daily.weather_code[i]]}.webp" alt="" />
                <p>
                  <span class="high-temp">${Math.round(data.daily.temperature_2m_max[i])}${degreeSign}</span>
                  <span class="low-temp">${Math.round(data.daily.temperature_2m_min[i])}${degreeSign}</span>
                </p>
              </div>`,
    );
  }
  dayDropDownBtn.textContent = new Date(data.daily.time[0]).toLocaleDateString(
    "en-us",
    {
      weekday: "long",
    },
  );
  hourlyDayList.innerHTML = "";
  weatherData.daily.time.forEach((e, index) => {
    hourlyDayList.insertAdjacentHTML(
      "beforeend",
      `<li tabindex="0" data-index="${index}">${new Date(e).toLocaleDateString(
        "en-us",
        {
          weekday: "long",
        },
      )}</li>`,
    );
  });
  loadHourlyForecast(0);
  hideShimmer();
}

export function loadHourlyForecast(indexOfTheDay) {
  let endHour = indexOfTheDay * 24 + 24;
  hourContainer.innerHTML = "";
  for (let hour = indexOfTheDay * 24; hour < endHour; hour++) {
    hourContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="hours-item">
      <div class="skeleton-box">
                <div class="shimmer"></div>
              </div>
              <div class="hour-time">
                <img src="assets/images/icon-${weatherCodes[weatherData.hourly.weather_code[hour]]}.webp" alt="" />
                <span>${
                  new Date(weatherData.hourly.time[hour])
                    .toLocaleDateString("en-us", {
                      hour: "numeric",
                      hour12: true,
                    })
                    .split(",")[1]
                }</span>
              </div>
              <div class="hour-temp">${Math.round(weatherData.hourly.temperature_2m[hour])}${degreeSign}</div>
            </div>`,
    );
  }
  hideShimmer();
}
function hideShimmer() {
  let shimmer = document.querySelectorAll(".skeleton-box");
  shimmer.forEach((e) => {
    e.classList.add("hide");
  });
}
export function showShimmer() {
  let shimmer = document.querySelectorAll(".skeleton-box");
  shimmer.forEach((e) => {
    e.classList.remove("hide");
  });
}

let main = document.querySelector("main");
export function displayError() {
  Array.from(main.children).forEach((e) => {
    if (!e.classList.contains("hide")) {
      e.classList.add("hide");
    }
  });
  document.querySelector(".api-error-state-container").classList.remove("hide");
}
export function retried() {
  Array.from(main.children).forEach((e) => {
    if (e.classList.contains("hide")) {
      e.classList.remove("hide");
    }
  });
  document.querySelector(".api-error-state-container").classList.add("hide");
}
