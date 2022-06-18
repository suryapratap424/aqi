const myMap = L.map("map").setView([23, 80], 5);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const osm = L.tileLayer(tileUrl, {
  attribution,
  minZoom: 2,
  // noWrap: true,
});
// osm.addTo(myMap);

const CartoDB_DarkMatter = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    minZoom: 2,
    // maxZoom: 19
  }
);
CartoDB_DarkMatter.addTo(myMap);
const googleStreets = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    minZoom: 2,
    // maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
//  googleStreets.addTo(myMap);

const googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    minZoom: 2,
    // maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
// googleSat.addTo(myMap);

const Stamen_Watercolor = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    minZoom: 2,
    // maxZoom: 20,
    ext: "jpg",
  }
);
// Stamen_Watercolor.addTo(myMap);

var baseLayers = {
  OpenStreetMap: osm,
  Satellite: googleSat,
  "Google Map": googleStreets,
  "Water Color": Stamen_Watercolor,
  Dark: CartoDB_DarkMatter,
};

L.control.layers(baseLayers, {}).addTo(myMap);

var southWest = L.latLng(-90, -180),
  northEast = L.latLng(90, 180);
var bounds = L.latLngBounds(southWest, northEast);

myMap.setMaxBounds(bounds);