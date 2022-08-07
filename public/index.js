// var layer = L.markerClusterGroup();

document.getElementById("Delhi").checked = true;
document.getElementById("all").checked = true;
r = 24;
var options = {
  radius: r,
  opacity: 0.5,
  duration: 200,
  colorRange: ["#6ca1f5", "blue"],
  radiusRange: [5, r],
};
var option = {
  radius: r,
  opacity: 0.5,
  duration: 200,
  colorRange: ["light-red", "red"],
  radiusRange: [5, r],
};
var hexLayerGOV = L.hexbinLayer(options).addTo(myMap);
var hexLayerAIR = L.hexbinLayer(option).addTo(myMap);
hexLayerGOV.dispatch().on("click", function (d, i) {
  console.log({ type: "click", event: d, index: i, context: this });
  station = stations.find((s) => s.lat == d[0].o[1] && s.lng == d[0].o[0]);
  fly(station);
  // console.log(station);
  setTimeout(() => {
    onclick({ latlng: { ...station } });
  }, 3000);
});
hexLayerAIR.dispatch().on("click",async function (d, i) {
  console.log({ type: "click", event: d, index: i, context: this });
  let x =await loadOur()
  console.log(x)
  station = x.find((s) => s.lat == d[0].o[1] && s.lng == d[0].o[0]);
  fly(station);
  station.coord={lat:station.lat,lng:station.lng}
  // console.log(station);
  setTimeout(() => {
    filldata(station);
  }, 3000);
});

setmap("Delhi", "all");

Array.from(document.getElementsByClassName("filters")).forEach((e) => {
  e.addEventListener("change", () => {
    let state = document.querySelector("input[name='filter']:checked").id;
    let type = document.querySelector("input[name='type']:checked").id;
    state = state.replace("_", " ");
    setmap(state, type);
  });
});

document.getElementById("option").addEventListener("change", function () {
  let selected = stations.find((station) => station.name == this.value);
  fly(selected);
  onclick({ latlng: { lat: selected.lat, lng: selected.lng } });
});
