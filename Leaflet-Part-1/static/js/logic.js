var newYorkCoords = [40.73, -74.0059];
var mapZoomLevel = 12;
// Create the createMap function.
function createMap(earthquakeLayer)
{
  // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  // Create a baseMaps object to hold the streetmap layer.
  var baseMaps = {
    "Street Map": streetmap
  };
  // Create an overlayMaps object to hold the bikeStations layer.
  var overlayMaps = {
    "Bike Stations": earthquakeLayer
  };
  // Create the map object with options.
  var map = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [streetmap, earthquakeLayer]
  });
  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}
// Create the createMarkers function.
function createMarkers(data)
{
  console.log(data);
  // Pull the "stations" property from response.data.
  // creates an array of stations that we can use to get the data that we need
  var earthquakes = data.features;
  // Initialize an array to hold the bike markers.
  var earthquakeMarkers  = [];
  // Loop through the stations array.
  for(var i = 0; i < earthquakes.length; i++)
  {
    // For each station, create a marker, and bind a popup with the station's name.
    //var bikeStation = L.marker([stations[i].lat, stations[i].lon])
    var earthquakeLocation = L.marker([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]])
        .bindPopup(`<h2>ID: ${earthquakes[i].properties.place} - ${earthquakes[i].properties.place}</h2><hr><b>Capacity:</b> ${earthquakes[i].properties.place}`);
    // Add the marker to the bikeMarkers array.
    earthquakeMarkers.push(earthquakeLocation);
  }
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  var earthquakeLayer = L.layerGroup(earthquakeMarkers);
  createMap(earthquakeLayer);
}
// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(
  createMarkers
);