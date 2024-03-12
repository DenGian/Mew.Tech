/* Leaflet */
let map = L.map("map").setView([51.229835, 4.415417], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
let marker = L.marker([51.229835, 4.415417]).addTo(map);
