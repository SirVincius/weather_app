var country_selector_element = document.getElementById("country_selector");
var city_selector_element = document.getElementById("city_selector");
var weather_data_element = document.getElementById("weather_data");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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

function displayWindDirection(weatherData, index) {
  var wind_direction_degrees =
    weatherData.daily.wind_direction_10m_dominant[index];
  var wind_direction;

  if (
    (wind_direction_degrees >= 0 && wind_direction_degrees <= 22) ||
    (wind_direction_degrees >= 338 && wind_direction_degrees <= 360)
  ) {
    wind_direction = "N";
  } else if (wind_direction_degrees >= 23 && wind_direction_degrees <= 67) {
    wind_direction = "NE";
  } else if (wind_direction_degrees >= 68 && wind_direction_degrees <= 112) {
    wind_direction = "E";
  } else if (wind_direction_degrees >= 113 && wind_direction_degrees <= 157) {
    wind_direction = "SE";
  } else if (wind_direction_degrees >= 158 && wind_direction_degrees <= 202) {
    wind_direction = "S";
  } else if (wind_direction_degrees >= 203 && wind_direction_degrees <= 247) {
    wind_direction = "SW";
  } else if (wind_direction_degrees >= 248 && wind_direction_degrees <= 292) {
    wind_direction = "W";
  } else if (wind_direction_degrees >= 293 && wind_direction_degrees <= 337) {
    wind_direction = "NW";
  } else {
    wind_direction = "Invalid direction"; // Optional fallback
  }
  weather_data_element.innerHTML += `<div>Wind direction : ${wind_direction}</div>`;
}

function displayWindSpeed(weatherData, index) {
  weather_data_element.innerHTML += `<div>Wind speed : ${weatherData.daily.wind_speed_10m_max[index]} km/h</div>`;
}

function displayWindGusts(weatherData, index) {
  weather_data_element.innerHTML += `<div>Wind gusts speed : ${weatherData.daily.wind_gusts_10m_max[index]} km/h</div>`;
}

function displayTemperatureMin(weatherData, index) {
  weather_data_element.innerHTML += `<div>Temp (min) : ${weatherData.daily.temperature_2m_min[index]}&#176;C</div>`;
}

function displayTemperatureMax(weatherData, index) {
  weather_data_element.innerHTML += `<div>Temp (max) : ${weatherData.daily.temperature_2m_max[index]}&#176;C</div>`;
}

function displayPrecipitation(weatherData, index) {
  weather_data_element.innerHTML += `<div>Prec : ${
    weatherData.daily.rain_sum[index] + weatherData.daily.showers_sum[index]
  } mm</div>`;
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

function displayDate(weatherData, index) {
  var date = new Date(weatherData.daily.time[index]);
  var month = months[date.getMonth()];
  var day = days[date.getDay()];
  var day_letter = date.getDate();
  var year = date.getFullYear();
  weather_data_element.innerHTML += `<div><span id="day_${index}">${day},</span> <span id="month_${index}">${month} </span><span id="day_letter_${index}">${day_letter} </span><span id="year_${index}">${year}</span></div>`;
}

function displayWeatherSymbol(weatherDate, index) {
  var weather_code = weatherDate.daily.weather_code[index];
  var weather_image_url;

  if (weather_code === 0) {
    weather_image_url = "&#9728;";
  } else if (weather_code === 1 || weather_code === 2 || weather_code === 3) {
    weather_image_url = "&#9729;";
  } else if (weather_code === 45 || weather_code === 48) {
    weather_image_url = "&#127787";
  } else if (
    weather_code === 51 ||
    weather_code === 53 ||
    weather_code === 55 ||
    weather_code === 56 ||
    weather_code === 57
  ) {
    weather_image_url = "&#127784;";
  } else if (
    weather_code === 61 ||
    weather_code === 63 ||
    weather_code === 65 ||
    weather_code === 66 ||
    weather_code === 67 ||
    weather_code === 80 ||
    weather_code === 81 ||
    weather_code === 82
  ) {
    weather_image_url = "&#127783;";
  } else if (
    weather_code === 71 ||
    weather_code === 73 ||
    weather_code === 65 ||
    weather_code === 75 ||
    weather_code === 77 ||
    weather_code === 85 ||
    weather_code === 86
  ) {
    weather_image_url = "&#127784;";
  } else if (
    weather_code === 95 ||
    weather_code === 96 ||
    weather_code === 99
  ) {
    weather_image_url = "&#127785;";
  } else {
    weather_image_url = "images/unknown.png";
  }

  weather_data_element.innerHTML += `<div>Weather description : ${weather_image_url}</div>`;
}

function displayWweatherData(weatherData, numberOfItem) {
  weather_data_element.innerHTML = "";
  for (let index = 0; index < numberOfItem; index++) {
    weather_data_element.innerHTML += "<div>";
    displayDate(weatherData, index);
    displayWeatherSymbol(weatherData, index);
    displayTemperatureMin(weatherData, index);
    displayTemperatureMax(weatherData, index);
    displayPrecipitation(weatherData, index);
    displaySnow(weatherData, index);
    displayWindDirection(weatherData, index);
    displayWindSpeed(weatherData, index);
    displayWindGusts(weatherData, index);
    displaySunrise(weatherData, index);
    displaySunset(weatherData, index);
    weather_data_element.innerHTML += "</div><hr>";
  }
}
