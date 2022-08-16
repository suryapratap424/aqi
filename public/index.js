// var layer = L.markerClusterGroup();

document.getElementById("Delhi").checked = true;
document.getElementById("all").checked = true;
defaultRadius = 24;
var defaultOptions = {
  radius: defaultRadius,
  opacity: 0.5,
  duration: 200,
  colorRange: ["#6ca1f5", "blue"],
  radiusRange: [5, defaultRadius],
};
var hexLayerGOV = L.hexbinLayer(defaultOptions);
var hexLayerAIR = L.hexbinLayer(defaultOptions);

myMap.on("zoomend", function (e) {
  var zoom = e.target._zoom;
  var minZoom = 11;
  var zoomDiff = zoom - minZoom;
  var newOptions = defaultOptions;

  var govt_data = hexLayerGOV._data;
  var air_data = hexLayerAIR._data;
  var newRadius = defaultRadius;
  if (zoomDiff >= 1) {
    newRadius = defaultRadius * 2 ** zoomDiff;
  }
  myMap.removeLayer(hexLayerGOV);
  myMap.removeLayer(hexLayerAIR);

  newOptions.radius = newRadius;
  newOptions.radiusRange = [newRadius, newRadius];
  console.log(newOptions);
  hexLayerGOV = L.hexbinLayer(newOptions).addTo(myMap);
  hexLayerGOV.data(govt_data);

  // d3.select("svg").remove();
  hexLayerAIR = L.hexbinLayer(newOptions)
    .colorRange(["light-red", "red"])
    .addTo(myMap);
  hexLayerAIR.data(air_data);
  
  hexLayerGOV.dispatch().on("click", function (d, i) {
    console.log({ type: "click", event: d, index: i, context: this });
    station = stations.find((s) => s.lat == d[0].o[1] && s.lng == d[0].o[0]);
    fly(station);
    // console.log(station);
    setTimeout(() => {
      onclick({ latlng: { ...station } });
    }, 3000);
  });
  hexLayerAIR.dispatch().on("click", async function (d, i) {
    console.log({ type: "click", event: d, index: i, context: this });
    let x = await loadOur();
    console.log(x);
    station = x.find((s) => s.lat == d[0].o[1] && s.lng == d[0].o[0]);
    fly(station);
    station.coord = { lat: station.lat, lng: station.lng };
    // console.log(station);
    setTimeout(() => {
      filldata(station);
    }, 3000);
  });
  
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
