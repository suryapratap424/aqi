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
var layer = L.markerClusterGroup();
function showDataOnMap(stations) {
  layer.clearLayers(); //reset
  stations.forEach((station) => {
    fetch(`data?lat=${station.lat}&lon=${station.lng}`)
      .then((r) => r.json())
      .then((x) => {
        // background-color: ${color(x.list[0].main.aqi)};
        let style = `
        background-color: ${color(aqi(x.list[0].components))};
        width:2rem;
        height:2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        border: 2px solid black;`
        let icon = L.divIcon({
          className: "Circle",
          html: `<div style='${style}'>${
            aqi(x.list[0].components)
          }</div>`,
        });
       let d = L.marker([station.lat, station.lng], { icon })
          .on("click", onclick)
          .bindPopup(genPop(station), {
            offset: getOffset(station),
          });
        layer.addLayer(d);
      })
      .catch((e) => (document.getElementById("comp").innerHTML = e));
  });

  layer.addTo(myMap);
}
showDataOnMap(stations);
//-------------------------aqi-------------------------------------------------
function color(c){
  if(c<=700){
    return 'green'
  }
  if(c<800){
    return 'greenyellow'
  }
  if(c<=850){
    return 'yellow'
  }
  if(c<=900){
    return 'orange'
  }
  if(c>900){
    return 'red'
  }
}
// function color(c){
//   if(c==1){
//     return 'green'
//   }
//   if(c==2){
//     return 'greenyellow'
//   }
//   if(c==3){
//     return 'yellow'
//   }
//   if(c==4){
//     return 'orange'
//   }
//   if(c==5){
//     return 'red'
//   }
// }
function aqi(d){
  let {pm10,pm2_5,so2,no,no2,co,o3,nh3} = d
  co = co / 1000
  if(pm10<=50)
  pm10=pm10
  if(pm10>50&&pm10<=100)
  pm10=pm10
  if(pm10>100&&pm10<=250)
  pm10=100+(pm10-100)*100/150
  if(pm10>250&&pm10<=350)
  pm10=200+(pm10-250)
  if(pm10>350&&pm10<=430)
  pm10=300+(pm10-350)*(100/80)
  if(pm10>430)
  pm10=400+(pm10-430)*(100/80)
  //---------------------------------
  if(pm2_5<=30)
  pm2_5=pm2_5*50/30
  if(pm2_5>30&&pm2_5<=60)
  pm2_5=50+(pm2_5-30)*50/30
  if(pm2_5>60&&pm2_5<=90)
  pm2_5=100+(pm2_5-60)*100/30
  if(pm2_5>90&&pm2_5<=120)
  pm2_5=200+(pm2_5-90)*(100/30)
  if(pm2_5>120&&pm2_5<=250)
  pm2_5=300+(pm2_5-120)*(100/130)
  if(pm2_5>250)
  pm2_5=400+(pm2_5-250)*(100/130)
  //---------------------------------
  if(so2<=40)
  so2=so2*50/40
  if(so2>40&&so2<=80)
  so2=50+(so2-40)*50/40
  if(so2>80&&so2<=380)
  so2=100+(so2-80)*100/300
  if(so2>380&&so2<=800)
  so2=200+(so2-380)*(100/420)
  if(so2>800&&so2<=1600)
  so2=300+(so2-800)*(100/800)
  if(so2>1600)
  so2=400+(so2-1600)*(100/800)
  //---------------------------------
  if(no<=40)
  no=no*50/40
  if(no>40&&no<=80)
  no=50+(no-40)*50/40
  if(no>80&&no<=180)
  no=100+(no-80)*100/100
  if(no>180&&no<=280)
  no=200+(no-180)*(100/100)
  if(no>280&&no<=400)
  no=300+(no-280)*(100/120)
  if(no>400)
  no=400+(no-400)*(100/120)
  //---------------------------------
  if(no2<=40)
  no2=no2*50/40
  if(no2>40&&no2<=80)
  no2=50+(no2-40)*50/40
  if(no2>80&&no2<=180)
  no2=100+(no2-80)*100/100
  if(no2>180&&no2<=280)
  no2=200+(no2-180)*(100/100)
  if(no2>280&&no2<=400)
  no2=300+(no2-280)*(100/120)
  if(no2>400)
  no2=400+(no2-400)*(100/120)
  //---------------------------------
  if(co<=1)
  co=co*50/1
  if(co>1&&co<=2)
  co=50+(co-1)*50/1
  if(co>2&&co<=10)
  co=100+(co-2)*100/8
  if(co>10&&co<=17)
  co=200+(co-10)*(100/7)
  if(co>17&&co<=34)
  co=300+(co-17)*(100/17)
  if(co>34)
  co=400+(co-34)*(100/17)
  //---------------------------------
  if(o3<=50)
  o3=o3*50/50
  if(o3>50&&o3<=100)
  o3=50+(o3-50)*50/50
  if(o3>100&&o3<=168)
  o3=100+(o3-100)*100/68
  if(o3>168&&o3<=208)
  o3=200+(o3-168)*(100/40)
  if(o3>208&&o3<=748)
  o3=300+(o3-208)*(100/539)
  if(o3>748)
  o3=400+(o3-400)*(100/539)
  //---------------------------------
  if(nh3<=200)
  nh3=nh3*50/200
  if(nh3>200&&nh3<=400)
  nh3=50+(nh3-200)*50/200
  if(nh3>400&&nh3<=800)
  nh3=100+(nh3-400)*100/400
  if(nh3>800&&nh3<=1200)
  nh3=200+(nh3-800)*(100/400)
  if(nh3>1200&&nh3<=1800)
  nh3=300+(nh3-1200)*(100/600)
  if(nh3>1800)
  nh3=400+(nh3-1800)*(100/600)
  //---------------------------------
  console.log(pm10,pm2_5,so2,no,no2,co,o3,nh3)
  return Math.round(Math.max(pm10,pm2_5,so2,no,no2,co,o3,nh3))
}
        
//-----------------------------------------------------------------------------
function filldata(data) {
  list = Object.keys(data.list[0].components);
  let html = `<p id ='lat'>lat__${data.coord.lat}</p>
  <p id='lng'>lng__${data.coord.lon}</p>
  <ul id='comp'>
  ${list
    .map(
      (li) =>
        `<pre><li>${li}    -->    ${data.list[0].components[li]}</li></pre>`
    )
    .join("")}
    </ul>`;
  document.getElementById("data").innerHTML = html;
  let card = document.getElementById(`${data.coord.lat}`);
  if (card) card.innerHTML = html;
}
fetch(`data?lat=50&lon=50`)
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
  fetch(`data?lat=${lat}&lon=${lng}`)
    .then((r) => r.json())
    .then((x) => {
      console.log(x);
      filldata(x);
    })
    .catch((e) => (document.getElementById("comp").innerHTML = e));
}
