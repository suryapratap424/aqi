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

var southWest = L.latLng(-89.98155760646617, -180),
  northEast = L.latLng(89.99346179538875, 180);
var bounds = L.latLngBounds(southWest, northEast);

myMap.setMaxBounds(bounds);

function genPop(station) {
  return `<p>coords:${station.lat},${station.lng}</p>
  <h2 class='heading'>${station.name}</h2>
    <div id='${station.lat}'></div>
    <div class='bottom'>
    <span class='green'></span>
    <span>GOOD</span>
    <span class='yellow'></span>
    <span>MEDIUM</span>
    <span class='red'></span>
    <span>BAD</span></div>
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
var layer = L.markerClusterGroup();
function showDataOnMap(stations) {
  layer.clearLayers(); //reset
  let count = 0;
  // console.log(stations)
  stations.forEach((station) => {
    fetch(`data?lat=${station.lat}&lon=${station.lng}`)
      .then((r) => r.json())
      .then((x) => {
        // let b = color(x.list[0].main.aqi);
        let { pm10, pm2_5 } = x.list[0].components;
        let b = color(Math.max(pm10, pm2_5));
        // station.color = b;
        let style = `
        color: ${b};
        background-color: ${b};`;
        // let icon = L.divIcon({className: "Circle",html: `<div style='${style}'>${aqi(x.list[0].components)}</div>`});
        let icon = L.divIcon({
          className: "Circle",
          html: `<div style='${style}'></div>`,
        });
        let d = L.marker([station.lat, station.lng], { icon })
          .on("click", onclick)
          .bindPopup(genPop(station), {
            offset: getOffset(station),
          });
        layer.addLayer(d);
        document.getElementById(
          "loaded"
        ).innerHTML = `Loaded Stations - ${++count}`;
      })
      .catch((e) => console.log(e.message));
  });
  layer.addTo(myMap);
}
document.getElementById("Delhi").checked = true;
// let state = document.querySelector("input[name='filter']:checked").id;
// state = state.replace("_", " ");
// myMap.flyToBounds(bboxes.find((e) => e.ST_NM == "Delhi").bbox);
// let filtered = stations.filter((e) => e.state == "Delhi");
// showDataOnMap(filtered);
// startcounter(filtered);
// let list = document.getElementById("list");
// list.innerHTML = "";
// list.innerHTML = filtered
//   .map((station) => `<option value='${station.name}'>`)
//   .join("");
setmap('Delhi')
Array.from(document.getElementsByName("filter")).forEach((e) => {
  e.addEventListener("change", () => {
    let state = document.querySelector("input[name='filter']:checked").id;
    state = state.replace("_", " ");
    setmap(state)
  });
});
function setmap(state){
  myMap.flyToBounds(bboxes.find((e) => e.ST_NM == state).bbox);
  let filtered = stations.filter((e) =>
    state == "All India" ? true : e.state == state
  );
  showDataOnMap(filtered);
  startcounter(filtered);
  let list = document.getElementById("list");
  list.innerHTML = "";
  list.innerHTML = filtered
    .map((station) => `<option value='${station.name}'>`)
    .join("");
}
document.getElementById("option").addEventListener("change", function () {
  let selected = stations.find((station) => station.name == this.value);
  fly(selected);
  onclick({ latlng: { lat: selected.lat, lng: selected.lng } });
});
function fly(station) {
  const lat = station.lat;
  const lng = station.lng;
  myMap.flyTo([lat, lng], 15, {
    duration: 2,
  });
  setTimeout(() => {
    L.popup({ offset: getOffset(station) })
      .setLatLng([lat, lng])
      .setContent(genPop(station))
      .openOn(myMap);
  }, 2000);
}
//-------------------------aqi-------------------------------------------------
function color(c) {
  if (c < 50) {
    return "green";
  }
  if (c < 100) {
    return "#70b900";
  }
  if (c < 250) {
    return "#ffeb3b";
  }
  if (c < 400) {
    return "orange";
  }
  if (c > 400) {
    return "red";
  }
}
function colorclass(Pname, Pvalue) {
  let up, low;
  if (Pname == "co") {
    low = 2000;
    up = 17000;
  }
  if (Pname == "no") {
    low = 80;
    up = 280;
  }
  if (Pname == "no2") {
    low = 80;
    up = 280;
  }
  if (Pname == "o3") {
    low = 100;
    up = 208;
  }
  if (Pname == "so2") {
    low = 80;
    up = 800;
  }
  if (Pname == "pm_25") {
    low = 50;
    up = 250;
  }
  if (Pname == "pm10") {
    low = 50;
    up = 250;
  }
  if (Pname == "nh3") {
    low = 400;
    up = 1200;
  }
  if (Pvalue < low) {
    return "green";
  } else if (Pvalue > up) {
    return "red";
  } else {
    return "yellow";
  }
}
function aqi(d) {
  let { pm10, pm2_5 } = d;
  return Math.round(Math.max(pm10, pm2_5));
}

//-----------------------------------------------------------------------------
function filldata(data) {
  list = Object.keys(data.list[0].components);
  let html = `
  <div class='comp'>
  ${list
    .map(
      (li) =>
        `<span>${li}</span><span class="vals">${
          data.list[0].components[li]
        }</span><span class='${colorclass(
          li,
          data.list[0].components[li]
        )}'></span>`
    )
    .join("")}
    </div>`;
  // document.getElementById("data").innerHTML = html;
  let card = document.getElementById(`${data.coord.lat}`);
  if (card) card.innerHTML = html;
}

function onclick(e) {
  // document.getElementById("comp").innerHTML = `Loading....`;
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  fetch(`data?lat=${lat}&lon=${lng}`)
    .then((r) => r.json())
    .then((x) => {
      console.log(x);
      filldata(x);
    })
    .catch((e) => console.log(e));
}
