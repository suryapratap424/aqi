var layer = L.markerClusterGroup();

document.getElementById("Delhi").checked = true;
document.getElementById("all").checked = true;

setmap("Delhi");

Array.from(document.getElementsByClassName("filters")).forEach((e) => {
  e.addEventListener("change", () => {
    let state = document.querySelector("input[name='filter']:checked").id;
    let type = document.querySelector("input[name='type']:checked").id;
    state = state.replace("_", " ");
    setmap(state,type);
  });
});

document.getElementById("option").addEventListener("change", function () {
  let selected = stations.find((station) => station.name == this.value);
  fly(selected);
  onclick({ latlng: { lat: selected.lat, lng: selected.lng } });
});

loadOur();
