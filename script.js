var country_selector_element = document.getElementById("country_selector");
var city_selector_element = document.getElementById("city_selector");
var weather_data_element = document.getElementById("weather_data");

country_selector_element.addEventListener("change", async function () {
  let country_name = country_selector_element.value;
  let city_list = await fetchCityList(country_name);
  populateCitySelector(city_list);
});

city_selector_element.addEventListener("change", async function () {
  const cityData = await fetchCityData();
  let latitude = getCityLatitude(cityData);
  let longitude = getCityLongitude(cityData);
  const weatherData = await fetchWeatherData(latitude, longitude);
  console.log(weatherData);
  displayWweatherData(weatherData, 7);
});

window.onload = async function () {
  let countryList = await fetchCountryList();
  populateCountrySelector(countryList);
};

async function fetchCountryList() {
  const response = await fetch("json/countries+cities.json");
  const data = await response.json();
  let countryList = [];
  data.forEach((country) => {
    countryList.push(country.name);
  });
  return countryList;
}

function populateCountrySelector(countryList) {
  countryList.forEach((country) => {
    let option = document.createElement("option");
    option.textContent = country;
    option.value = country;
    country_selector_element.appendChild(option);
  });
}

async function fetchCityList(countryName) {
  const response = await fetch("json/countries+cities.json");
  const data = await response.json();
  const country = data.find((country) => country.name === countryName);
  return country.cities;
}

function populateCitySelector(cityList) {
  city_selector_element.innerHTML = `<option selected disabled>-- Select a city --</option>`;
  cityList.forEach((city) => {
    let option = document.createElement("option");
    option.textContent = city.name;
    option.value = city.name;
    city_selector_element.appendChild(option);
  });
}

async function fetchCityData() {
  const response = await fetch("json/countries+cities.json");
  const data = await response.json();
  const countryName = country_selector_element.value;
  const cityName = city_selector_element.value;
  const countryData = data.find((country) => country.name === countryName);
  const cityData = countryData.cities.find((city) => city.name === cityName);
  return cityData;
}

function getCityLatitude(cityData) {
  return cityData.latitude;
}
function getCityLongitude(cityData) {
  return cityData.longitude;
}

async function fetchWeatherData(latitude, longitude) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`
  );
  const data = await response.json();
  return data;
}

function displayWweatherData(weatherData, numberOfItem) {
  weather_data_element.innerHTML = "";
  for (let index = 0; index < numberOfItem; index++) {
    weather_data_element.innerHTML += "<div>";
    displayPrecipitation(weatherData, index);
    displaySnow(weatherData, index);
    displaySunrise(weatherData, index);
    displaySunset(weatherData, index);
    weather_data_element.innerHTML += "</div><hr>";
  }
}

function displayPrecipitation(weatherData, index) {
  weather_data_element.innerHTML += `<div>Prec : ${weatherData.daily.precipitation_sum[index]} mm</div>`;
}

function displaySnow(weatherData, index) {
  weather_data_element.innerHTML += `<div>Snow : ${weatherData.daily.snowfall_sum[index]} cm</div>`;
}

function displaySunrise(weatherData, index) {
  const sunrise_date = new Date(weatherData.daily.sunrise[index]);
  let sunrise_hours = sunrise_date.getHours();
  let sunrise_minutes = sunrise_date.getMinutes();
  weather_data_element.innerHTML += `<div>Sunrise : ${sunrise_hours}:${
    sunrise_minutes < 10 ? "0" + sunrise_minutes : sunrise_minutes
  }</div>`;
}

function displaySunset(weatherData, index) {
  const sunset_date = new Date(weatherData.daily.sunset[index]);
  let sunset_hours = sunset_date.getHours();
  let sunset_minutes = sunset_date.getMinutes();
  weather_data_element.innerHTML += `<div>Sunset : ${sunset_hours}:${
    sunset_minutes < 10 ? "0" + sunset_minutes : sunset_minutes
  }</div>`;
}
