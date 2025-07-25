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

function showToast() {
  const toast = document.getElementById("toast");
  toast.style.opacity = 1;
  setTimeout(() => {
    toast.style.opacity = 0;
  }, 2500);
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
      document.getElementById("postForm").reset();
      showToast();

    }, () => alert("Couldn't get location"));
  }
});

// 👇 Add this at the end
function toggleAbout() {
  const panel = document.getElementById("aboutPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}
