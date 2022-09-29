var SanBernardinoCoordinates = [34.1083, -117.2898];
var mapZoomLevel = 10;
// Create the createMap function.
function createMap(allIntensityLayer)
{
  // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // grayscale layer
  var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
    });
    
  // water color layer
  var waterColor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
    });


  // Create a baseMaps object to hold the streetmap layer.
  var baseMaps = {
    "Street Map": streetmap,
    "Grayscale Map": grayscale,
    "Watercolor Map": waterColor
  };
  
  // Create an overlayMaps object to hold the layer.
  var overlayMaps = {
    "All earthquakes": allIntensityLayer
  };
  // Create the map object with options.
  var map = L.map("map-id", {
    center: SanBernardinoCoordinates,
    zoom: mapZoomLevel,
    layers: [streetmap, allIntensityLayer]
  });
  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // make a variable for legend and position it in the bottom right of the screen
  var legend = L.control(
    {
        position: "bottomright"
    }
  );
  // add the properties for the legend
  legend.onAdd = function ()
  {
    // create a div for the legend
    var div = L.DomUtil.create("div", "info legend");
    console.log(div);

    var intervals = [-10, 5, 10, 30, 50, 70, 90]; //this array represents the intervals for the capacities of bike stations

    // this array represents the colors that will be associated with intervals
    // (populate these in reverse)
    var colors = [
      "#69B34C",
      "#90EE90",
      "#ACB334",
      "#FAB733",
      "#FF8E15",
      "#FF4E11",
      "#FF0D0D"
    ];

    // Use a loop to generate labels within the div
    // div starts as empty, then is populated with data from arrays
    for (var i=0; i < intervals.length; i++) {

        // use .innerHTML to set the value of the color and text for the interval
        div.innerHTML += "<i style='background: " + colors[i] + "'></i>"
        + intervals[i]
        + (intervals[i + 1] ? " &ndash; " + intervals[i+1] + " intensity<br>" : "+");
    }

    return div;

  };
  
  // add the legend to the map
  legend.addTo(map);

}

function createTectonicMap(tectonicLayer)
{

  // Create an overlayMaps object to hold the layer.
  var overlayMapsNew = {
    "Tectonic Lines": tectonicLayer
  };
  // TODO: How to add 2nd datasource to map, validate following
  // Create the map object with options.
  //var map = L.map("map-id", {
  //  layers: [tectonicLayer];
  //});
  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  // L.control.layers(overlayMapsNew, {
  //   collapsed: false
  // }).addTo(map);
 
}

// Create the createMarkers function.
function createMarkers(data)
{
  //console.log(data);

  // creates an array of earthquakes that we can use to get the data that we need
  var earthquakes = data.features;
 
  // Array to hold to all earthquakes
  var allIntensity = [];
 
  // Loop through the earthquakes array.
  for(var i = 0; i < earthquakes.length; i++)
  {
    // Change the marker size based on the intensity
    var markerRadius = earthquakes[i].geometry.coordinates[2] * 50;
    var markerColor;

    //console.log(earthquakes[i].properties.mag);

    if(earthquakes[i].properties.mag > 90)
        markerColor = "#FF0D0D"
    else if(earthquakes[i].properties.mag >= 70)
        markerColor = "#FF4E11"
    else if(earthquakes[i].properties.mag >= 50)
        markerColor = "#FF8E15"
    else if(earthquakes[i].properties.mag >= 30)
        markerColor = "#FAB733"
    else if(earthquakes[i].properties.mag >= 10)
        markerColor = "#ACB334"
    else if(earthquakes[i].properties.mag >= 5)
        markerColor = "#90EE90"
    else 
        markerColor =  "#69B34C"

    var earthquakeLocation = L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]],{
        fillOpacity: .30,
        color: "grey",
        fillColor: markerColor,
        radius: markerRadius,
        weight: 1
      })
      .bindPopup(`<h2>ID: ${earthquakes[i].properties.place} - ${earthquakes[i].properties.mag}</h2><hr><b>Code:</b> ${earthquakes[i].properties.code}`);

    // Add the marker to the earthquke markers array.
    allIntensity.push(earthquakeLocation);
 
  }
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  var allIntensityLayer = L.layerGroup(allIntensity);
  createMap(allIntensityLayer);
}

// Create the createMarkers function.
function createTectonicMarkers(data)
{
  var tectonicData = data.features;

  // creates an array of earthquakes that we can use to get the data that we need
    console.log(tectonicData);
 
  // Array to hold to all earthquakes
  var allLines = [];

  //Loop through tectonicData
  for(j = 0; j < tectonicData.length; j++){
    var markerColor = "orange";
      // Loop through coordinates 
      for(k = 0; k < tectonicData[j].geometry.coordinates.length; k++){
        //console.log(tectonicData[j].geometry.coordinates[k][0,1]);
        var tectonicLocation = L.marker([tectonicData[j].geometry.coordinates[k][0,1], tectonicData[j].geometry.coordinates[k][0,0]],{
          fillOpacity: .30,
          color: "grey",
          fillColor: markerColor,
          weight: 1
        })

        // Add the marker to the earthquke markers array.
        allLines.push(tectonicLocation);
        //console.log(allLines);
 
    }

  }
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    var allLinesLayer = L.layerGroup(allLines);
    createTectonicMap(allLinesLayer);
}




// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(
  createMarkers
);

d3.json("../Leaflet-Part-2/static/js/tectonic.json").then(
  createTectonicMarkers
);
