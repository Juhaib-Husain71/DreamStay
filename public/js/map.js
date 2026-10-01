const map = L.map("map").setView([coordinates[1], coordinates[0]], 10);     //lat come first

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// console.log(coordinates);

//lat come first
const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);

marker.bindPopup("<p>Exact location will be provided after booking.</p>");

marker.on("mouseover", function () {
    this.openPopup();
});

marker.on("mouseout", function () {
    this.closePopup();
});