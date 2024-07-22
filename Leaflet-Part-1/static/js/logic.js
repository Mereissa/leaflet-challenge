// Initialize the map
const map = L.map('map').setView([0, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a function to get color based on depth
function getColor(depth) {
  return depth > 90 ? '#FF6347' :
         depth > 70 ? '#FF4500' :
         depth > 50 ? '#FFA07A' :
         depth > 30 ? '#FFD700' :
         depth > 10 ? '#98FB98' :
                      '#00FF00';
}

// Define a function to set marker size based on magnitude
function getSize(magnitude) {
  return magnitude * 4;
}

// Fetch the earthquake data
fetch('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(response => response.json())
  .then(data => {
    const earthquakes = data.features;
    earthquakes.forEach(earthquake => {
      const coords = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
      const magnitude = earthquake.properties.mag;
      const depth = earthquake.geometry.coordinates[2];
      const color = getColor(depth);
      const size = getSize(magnitude);

      L.circle(coords, {
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        radius: size
      }).bindPopup(`<h3>${earthquake.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`)
        .addTo(map);
    });
  });

// Add a legend to the map
const legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend');
  const depths = [0, 10, 30, 50, 70, 90];
  const colors = ['#00FF00', '#98FB98', '#FFD700', '#FFA07A', '#FF4500', '#FF6347'];
  
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      (depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km'));
  }
  return div;
};
legend.addTo(map);
