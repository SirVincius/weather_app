var country_selector_element = document.getElementById("country_selector");
var city_selector_element = document.getElementById("city_selector");

country_selector_element.addEventListener("change", async function () {
  let country_name = country_selector_element.value;
  let city_list = await fetchCityList(country_name);
  populateCitySelector(city_list);
});

city_selector_element.addEventListener("change", async function () {
  const cityData = await fetchCityData();
  let latitude = getCityLatitude(cityData);
  let longitude = getCityLongitude(cityData);
  getWeatherData(latitude, longitude);
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
    console.log(city);
    let option = document.createElement("option");
    option.textContent = city.name;
    option.value = city.name;
    option.setAttribute("x", city.latitude);
    option.setAttribute("y", city.longitude);
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
  console.log(cityData);
  return cityData;
}

function getCityLatitude(cityData) {
  return cityData.latitude;
}
function getCityLongitude(cityData) {
  return cityData.longitude;
}

async function getWeatherData(latitude, longitude) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant`
  );
  const data = await response.json();
  console.log(data);
}
