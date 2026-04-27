document.addEventListener("DOMContentLoaded", async () => {
  await loadSvgMap();
});

async function loadSvgMap() {
  const wrap = document.getElementById("svgMapWrap");
  const res = await fetch("/static/assets/world.svg");
  const svgText = await res.text();
  wrap.innerHTML = svgText;

  const svg = wrap.querySelector("svg");
  if (svg) {
    const box = svg.getBBox();
    svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
    svg.removeAttribute("width");
    svg.removeAttribute("height");
  }

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const countries = [...wrap.querySelectorAll("svg g[id]")].filter(country => country.id.toUpperCase().length === 2);

  countries.forEach(country => {
    country.classList.add("country");
    country.addEventListener("click", async () => selectCountry(country, countries, regionNames));
  });

  const defaultCountry = countries.find(country => country.id.toUpperCase() === "US");
  if (defaultCountry) {
    await selectCountry(defaultCountry, countries, regionNames);
  }
}

async function selectCountry(country, countries, regionNames) {
  countries.forEach(c => c.classList.remove("selected-country"));
  country.classList.add("selected-country");
  const countryName = regionNames.of(country.id.toUpperCase());
  await loadCountryArticles(countryName);
}

async function loadCountryArticles(countryName) {
  const selectedCountry = document.getElementById("selectedCountry");
  const grid = document.getElementById("contentGrid");
  selectedCountry.textContent = countryName;
  grid.innerHTML = "<p>Loading articles...</p>";
  const response = await fetch(`/partials/country?country=${encodeURIComponent(countryName)}`);
  grid.innerHTML = await response.text();
}
