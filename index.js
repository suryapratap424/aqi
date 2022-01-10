const APIKEY = "28e11712f2e26aa40b72ca261be15e9f";
const myMap = L.map("map").setView([28.5915128, 77.2192949], 10);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileLayer = L.tileLayer(tileUrl, {
  attribution,
  minZoom: 5,
  noWrap: true,
});
tileLayer.addTo(myMap);

var southWest = L.latLng(-89.98155760646617, -180),
  northEast = L.latLng(89.99346179538875, 180);
var bounds = L.latLngBounds(southWest, northEast);

myMap.setMaxBounds(bounds);

function genPop(station) {
    return `<h1>${station.name}</h1>
    <h1>${station.lat}</h1><h1>${station.lng}</h1>
    <div id='${station.lat}'></div>
    `;
  }

  function getOffset(station) {
    let a = 0,
      b = 10;
    if (station.lat > 75) b = 310;
    if (station.lng < -150) a = 120;
    if (station.lng > 150) a = -120;
    return [a, b];
  }
  var layer;
  function showDataOnMap(stations) {
    let temp = new Array();
    stations.forEach((station) => {
      temp.push(
        L.marker([station.lat, station.lng]).on('click',onclick)
        .bindPopup(genPop(station), {
          offset: getOffset(station),
        })
      );
    });
    if (layer != undefined) {
      layer.clearLayers(); //reset
    }
    layer = L.layerGroup(temp).addTo(myMap);
  }
  showDataOnMap(stations)
//-----------------------------------------------------------------------------
function filldata(data) {
  list = Object.keys(data.list[0].components);
  let html=`<p id ='lat'>lat__${data.coord.lat}</p>
  <p id='lng'>lng__${data.coord.lon}</p>
  <ul id='comp'>
  ${list
    .map(
      (li) =>
        `<pre><li>${li}    -->    ${data.list[0].components[li]}</li></pre>`
    )
    .join("")}
    </ul>`;
    document.getElementById('data').innerHTML=html
    let card = document.getElementById(`${data.coord.lat}`)
    if(card)
    card.innerHTML=html
    // return html
//   document.getElementById("lat").innerHTML = `lat-${data.coord.lat}`;
//   document.getElementById("lng").innerHTML = `lng-${data.coord.lon}`;
//   document.getElementById("comp").innerHTML = list
//     .map(
//       (li) =>
//         `<pre><li>${li}    -->    ${data.list[0].components[li]}</li></pre>`
//     )
//     .join("");
}
var marker;
fetch(
  `http://api.openweathermap.org/data/2.5/air_pollution?lat=50&lon=50&appid=${APIKEY}`
)
  .then((r) => r.json())
  .then((x) => {
    console.log(x);
    filldata(x);
  })
  .catch((e) => (document.getElementById("comp").innerHTML = e));
function onclick(e) {
  document.getElementById("comp").innerHTML = `Loading....`;
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  if (marker != undefined) {
    myMap.removeLayer(marker);
  }
  marker = L.marker(e.latlng).addTo(myMap);
  fetch(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${APIKEY}`
  )
    .then((r) => r.json())
    .then((x) => {
      console.log(x);
      filldata(x);
    })
    .catch((e) => (document.getElementById("comp").innerHTML = e));
}
