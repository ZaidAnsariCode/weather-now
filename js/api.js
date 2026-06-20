import { showWeather, displayError, retried } from "./ui.js";

const urlAddons = {
  temperature: {
    unit: "fahrenheit",
    url: "&temperature_unit=fahrenheit",
  },
  wind: {
    unit: "mph",
    url: "&wind_speed_unit=mph",
  },
  precipitation: {
    unit: "in",
    url: "&precipitation_unit=inch",
  },
};

export async function fetchLocations(cityName, count) {
  try {
    let result = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=${count}`,
    );
    let data = await result.json();
    return data.results || [];
  } catch (error) {
    displayError();
  }
}

export async function fetchWeather(location, userPreference) {
  try {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,weather_code,precipitation,wind_speed_10m,apparent_temperature,relative_humidity_2m&timezone=auto`;

    for (const key in userPreference) {
      if (userPreference[key] === urlAddons[key].unit) {
        url += urlAddons[key].url;
      }
    }
    let res = await fetch(url);
    let data = await res.json();
    retried();
    return data;
  } catch (error) {
    displayError();
  }
}
