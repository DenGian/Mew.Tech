/* Leaflet */

let map = L.map("map").setView([51.229835, 4.415417], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
let pokeball = L.icon({
  iconUrl: "../../assets/images/poke-ball.png",
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});
L.marker([51.229835, 4.41517], { icon: pokeball }).addTo(map);
