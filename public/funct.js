function genPop(station) {
  return `<p>coords:${station.lat},${station.lng}</p>
    <h2 class='heading'>${station.name}</h2>
      <div id='${station.lat.toFixed(4)}'>
      <div class='loader'></div>
      </div>
      <div class='bottom'>
      <span class="vals">GOOD</span>
      <span class='green'></span>
      <span class="vals">MEDIUM</span>
      <span class='yellow'></span>
      <span class="vals">BAD</span>
      <span class='red'></span>
      </div>
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

function color(c) {
  if (c < 10) {
    return "green";
  }
  if (c < 20) {
    // return "green-yellow";
    return "#70b900";
  }
  if (c < 30) {
    // return "yellow";
    return "#ffeb3b";
  }
  if (c < 40) {
    return "orange";
  }
  if (c > 40) {
    return "red";
  }
  if (c == "jt") {
    return "blue";
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
  let id = data.coord.lat.toFixed(4) + "";
  let card = document.getElementById(id);
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

async function loadOur() {
  data = await fetch("https://jt-stationsapi.herokuapp.com/")
  // data = await fetch("http://127.0.0.1:8000/")
    .then((r) => r.json())
    .then((x) => {
      let start = 0;
      let counter = setInterval(() => {
        start += 1;
        document.getElementById("jtstations").innerHTML =
          "Our Stations - " + start;
        if (x.length == start) clearInterval(counter);
      }, 5);
      hexLayerAIR.data(x.map(s=>[s.lng,s.lat]))
      return x
      // x.forEach((station) => {
      //   // let { PM25 } = station.list[0].components;
      //   let b = color("jt");
      //   style = b;
      //   // station.color = b;
      //   // let style = `color: ${b};background-color: ${b};`;
        
      //   // let icon = L.divIcon({
      //   //   className: "Circle",
      //   //   html: `<div style='${style}'></div>`,
      //   // });
      //   let icon = L.divIcon({
      //     className: "hexagon-part",
      //     html: `<div class="hexagon-shape hex-${style}"></div>`,
      //   });
      //   station.coord = { lat: station.lat, lng: station.lng };
      //   let d = L.marker([station.lat, station.lng], { icon })
      //     .bindPopup(genPop(station), {
      //       offset: getOffset(station),
      //     })
      //     .on("click", () => filldata(station));
      //   layer.addLayer(d);
      // });
    });
    // console.log(data)
    return data
}

function setmap(state, type) {
  document.getElementById("govt").innerHTML = "";
  document.getElementById("loaded").innerHTML = "";
  document.getElementById("jtstations").innerHTML = "";
  hexLayerGOV.data([])
  hexLayerAIR.data([])
  if (type != "Govt") {
    // layer.clearLayers();
    myMap.flyToBounds(bboxes.find((e) => e.ST_NM == "Delhi").bbox);
    loadOur();
  }
  if (type != "Aircubic") {
    myMap.flyToBounds(bboxes.find((e) => e.ST_NM == state).bbox);
    let filtered = stations.filter((e) =>
      state == "All India" ? true : e.state == state
    );
    setTimeout(() => {
      showDataOnMap(filtered);
    }, 500);
    startcounter(filtered);
    let list = document.getElementById("list");
    list.innerHTML = "";
    list.innerHTML = filtered
      .map((station) => `<option value='${station.name}'>`)
      .join("");
  }
}

function showDataOnMap(stations) {
  // console.log(stations)
  hexLayerGOV.data(stations.map((s) => [s.lng, s.lat]));
  // hexLayerGOV.colorRange(async(d)=>{
  //   console.log(d)
  //   let x = await fetch(`data?lat=${d[0].o[1]}&lon=${d[0].o[0]}`)
  //     .then((r) => r.json())
  //     .then((x) => {
  //       console.log(x)
  //       let { pm10, pm2_5 } = x.list[0].components;
  //       let b = color(Math.max(pm10, pm2_5));
  //       return b
  //     }).catch(e=>console.log(e.message))
  //     console.log([x,x])
  //   return [x,x]
  // })
  // layer.clearLayers(); //reset
  // let count = 0;
  // stations.forEach((station) => {
  //   fetch(`data?lat=${station.lat}&lon=${station.lng}`)
  //     .then((r) => r.json())
  //     .then((x) => {
        // let { pm10, pm2_5 } = x.list[0].components;
        // let b = color(Math.max(pm10, pm2_5));
        // let style = b;
        // let style = `color: ${b};
        //   background-color: ${b};`;
        // let icon = L.divIcon({
        //   className: "hexagon-part",
        //   html: `<div class="hexagon-shape hex-${style}"></div>`,
        // })
        // let icon = L.divIcon({
        //   className: "Circle",
        //   html: `<div style='${style}'></div>`,
        // });
        // let d = L.marker([station.lat, station.lng], { icon })
        //   .on("click", onclick)
        //   .bindPopup(genPop(station), {
        //     offset: getOffset(station),
        //   });
        // layer.addLayer(d);
      //   document.getElementById(
      //     "loaded"
      //   ).innerHTML = `Loaded Stations - ${++count}`;
      // })
      // .catch((e) => console.log(e.message));
  // });
  // layer.addTo(myMap);
}
