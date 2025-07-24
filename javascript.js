let map;
let markers = [];

function initMap() {
  map = L.map('map').setView([0, 0], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 16);
    }, () => alert("Location permission denied!"));
  }
}

function addMarker(lat, lon, title, description, category) {
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(`<strong>${category}</strong><br>${title}<br>${description}`);
  markers.push(marker);
}

document.getElementById("postForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const category = document.getElementById("category").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      addMarker(lat, lon, title, description, category);

      // You can also push this to a backend later
      document.getElementById("postForm").reset();
      alert("Post added to map!");

    }, () => alert("Couldn't get location"));
  }
});

initMap();
