var country_selector_element = document.getElementById("country_selector");
var city_selector_element = document.getElementById("city_selector");
var weather_data_element = document.getElementById("weather_data");
var daily_weather_container_element = document.getElementById(
  "daily-weather-container"
);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

country_selector_element.addEventListener("change", async function () {
  let country_name = country_selector_element.value;
  const countryData = await fetchCityList(country_name);
  let city_list = countryData.cities;
  // If a country has no city, then we use country data for name, latitude and longitude
  if (city_list.length == 0) {
    city_list.push(countryData);
  }
  populateCitySelector(city_list);
});

city_selector_element.addEventListener("change", async function () {
  const cityData = await fetchCityData();
  let latitude = getCityLatitude(cityData);
  let longitude = getCityLongitude(cityData);
  const weatherData = await fetchWeatherData(latitude, longitude);
  console.log(weatherData);
  getDailyWeatherData(weatherData, 6);
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
  return country;
}

function populateCitySelector(cityList) {
  city_selector_element.innerHTML = `<option selected disabled>-- Select a city --</option>`;
  cityList.forEach((city) => {
    let option = document.createElement("option");
    option.textContent = city.name;
    option.value = city.id;
    city_selector_element.appendChild(option);
  });
}

async function fetchCityData() {
  const response = await fetch("json/countries+cities.json");
  const data = await response.json();
  const countryName = country_selector_element.value;
  const cityId = parseInt(city_selector_element.value);
  const countryData = data.find((country) => country.name === countryName);
  const cityData = countryData.cities.find((city) => city.id === cityId);
  // If a country had no city, the country data is used instead for name, latitude and longitude
  if (cityData == undefined) {
    return countryData;
  }
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

function getWindDirection(weatherData, index) {
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
  return wind_direction;
}

function getWindSpeed(weatherData, index) {
  return Math.round(weatherData.daily.wind_speed_10m_max[index]);
}

function getWindGusts(weatherData, index) {
  return Math.round(weatherData.daily.wind_gusts_10m_max[index]);
}

function getTemperatureMin(weatherData, index) {
  return Math.round(weatherData.daily.temperature_2m_min[index]);
}

function getTemperatureMax(weatherData, index) {
  return Math.round(weatherData.daily.temperature_2m_max[index]);
}

function getPrecipitation(weatherData, index) {
  return Math.round(
    weatherData.daily.rain_sum[index] + weatherData.daily.showers_sum[index]
  );
}

function getSnow(weatherData, index) {
  return Math.round(weatherData.daily.snowfall_sum[index]);
}

function getSunrise(weatherData, index) {
  const sunrise_date = new Date(weatherData.daily.sunrise[index]);
  let sunrise_hours = sunrise_date.getHours();
  let sunrise_minutes = sunrise_date.getMinutes();
  return `${sunrise_hours}:${
    sunrise_minutes < 10 ? "0" + sunrise_minutes : sunrise_minutes
  }`;
}

function getSunset(weatherData, index) {
  const sunset_date = new Date(weatherData.daily.sunset[index]);
  let sunset_hours = sunset_date.getHours();
  let sunset_minutes = sunset_date.getMinutes();
  return `${sunset_hours}:${
    sunset_minutes < 10 ? "0" + sunset_minutes : sunset_minutes
  }`;
}

function getDate(weatherData, index) {
  var date = new Date(weatherData.daily.time[index]);
  var month = months[date.getMonth()];
  var day = days[date.getDay()];
  var day_letter = date.getDate();
  var year = date.getFullYear();
  return `${day}, ${month} ${day_letter} ${year}`;
}

function getWeatherSymbol(weatherDate, index) {
  var weather_code = weatherDate.daily.weather_code[index];

  const weatherCodeMap = new Map([
    [0, "&#9728;"], // Clear
    [1, "&#9729;"],
    [2, "&#9729;"],
    [3, "&#9729;"], // Cloudy
    [45, "&#127787;"],
    [48, "&#127787;"], // Fog
    [51, "&#127784;"],
    [53, "&#127784;"],
    [55, "&#127784;"],
    [56, "&#127784;"],
    [57, "&#127784;"], // Drizzle
    [61, "&#127783;"],
    [63, "&#127783;"],
    [65, "&#127783;"],
    [66, "&#127783;"],
    [67, "&#127783;"],
    [80, "&#127783;"],
    [81, "&#127783;"],
    [82, "&#127783;"], // Rain
    [71, "&#127784;"],
    [73, "&#127784;"],
    [75, "&#127784;"],
    [77, "&#127784;"],
    [85, "&#127784;"],
    [86, "&#127784;"], // Snow
    [95, "&#127785;"],
    [96, "&#127785;"],
    [99, "&#127785;"], // Thunderstorm
  ]);

  return `${weatherCodeMap.get(weather_code)}`;
}

function getDailyWeatherData(weatherData, numberOfItem) {
  daily_weather_container_element.innerHTML = "";
  for (let index = 0; index < numberOfItem; index++) {
    const daily_weather = {};
    daily_weather.date = getDate(weatherData, index);
    daily_weather.weatherSymbol = getWeatherSymbol(weatherData, index);
    daily_weather.temperatureMin = getTemperatureMin(weatherData, index);
    daily_weather.temperatureMax = getTemperatureMax(weatherData, index);
    daily_weather.precipitation = getPrecipitation(weatherData, index);
    daily_weather.snow = getSnow(weatherData, index);
    daily_weather.wind = getWindDirection(weatherData, index);
    daily_weather.windSpeed = getWindSpeed(weatherData, index);
    daily_weather.gustsSpeed = getWindGusts(weatherData, index);
    daily_weather.sunrise = getSunrise(weatherData, index);
    daily_weather.sunset = getSunset(weatherData, index);
    console.log(daily_weather);

    daily_weather_container_element.innerHTML += `<div class="daily-weather col-xl-2 col-lg-4 col-sm-6 col-12"><p><strong>${daily_weather.date}</strong></p>
          <p class="text-left font-size-5rem">${daily_weather.weatherSymbol}</p>
          <p class="text-left"><strong>Temp : </strong>${daily_weather.temperatureMax}&#8451; / ${daily_weather.temperatureMin}&#8451;</p>
          <p class="text-left"><strong>Prec : </strong>${daily_weather.precipitation} mm</p>
          <p class="text-left"><strong>Wind Dir. : </strong>${daily_weather.wind}</p>
          <p class="text-left"><strong>Wind : </strong>${daily_weather.windSpeed} km/h</p>
          <p class="text-left"><strong>Gusts : </strong>${daily_weather.gustsSpeed} km/h</p>
          <p class="text-left"><strong>Sunrise : </strong>${daily_weather.sunrise}</p>
          <p class="text-left"><strong>Sunset : </strong>${daily_weather.sunset}</p>
        </div>`;
  }
}
