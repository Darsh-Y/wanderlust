const lat = coordinates[1];
const lng = coordinates[0];

const map = L.map("map").setView([lat, lng], 16);

L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ug38fTaYtK486ZSEyyRm", {
  attribution:
    '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([lat, lng])
  .addTo(map)
  .bindPopup("Exact location will be provided after booking");
