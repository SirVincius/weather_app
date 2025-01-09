window.onload = async function () {
  let citiesList = await getEveryCities();
  console.log(citiesList);
};

async function getEveryCities() {
  let citiesList = [];
  let response = await fetch("https://countriesnow.space/api/v0.1/countries");
  let data = await response.json();
  data.data.forEach((country) => {
    citiesList = citiesList.concat(country.cities);
  });
  citiesList.sort();
  return citiesList;
}
