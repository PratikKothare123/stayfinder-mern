// 3. Initialize map centered on India (Latitude, Longitude, Zoom Level)
let map = L.map('map').setView([20.5937, 78.9629], 5);

// 4. Load the completely free OpenStreetMap graphics
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Optional: Add a marker
L.marker([21.1458, 79.0882]).addTo(map) // Coordinates for Nagpur
    .bindPopup('Hello! No API key needed here.')
    .openPopup();