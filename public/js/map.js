const mapDiv = document.getElementById("map");


console.log(mapDiv);
console.log(mapDiv.dataset.coordinates);
console.log(mapDiv.dataset.title);

const coordinates = JSON.parse(mapDiv.dataset.coordinates);

console.log(coordinates);
const listingTitle = mapDiv.dataset.title;

const longitude = coordinates[0];
const latitude = coordinates[1];

let map = L.map("map").setView([latitude, longitude], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup(listingTitle)
    .openPopup();