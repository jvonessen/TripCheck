// API call URLS
var geocode_URL = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAtsQkI9rXQT7kf36Giu_qms_Ksowljab4&address=';
var weather_URL = 'http://api.wunderground.com/api/7bf2e0a9dad48df1/forecast/q/'

//establish start/end locations
var origin, destination, originLat, originLng, destinationLat, destinationLng, originWeather, destinationWeather;

// initiate map and add basic tile layer, currently launches on London.
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoianZvbmVzc2VuIiwiYSI6ImNpeXVwaTQ2azAxc3Ayd21ocGw3ZnY4NHcifQ.Ae31-8rR2qFmyiYaBtwf_A'
}).addTo(mymap);

//Goodle geocoder API call
function getGeocodeInfo(callback) {
  var addresses = [origin, destination];
  for (i=0;i<addresses.length;i++) {
    addresses[i].replace(' ', '+')
    $.getJSON(geocode_URL + addresses[i], callback)
  };
}

// Assign coordinates from input to variables
function assignGeocodeInfo(data) {
  var streetNumber = data.results[0].address_components[0].long_name;
  if (streetNumber == origin.substring(0, streetNumber.length)) {
    originLat = data.results[0].geometry.location.lat;
    originLng = data.results[0].geometry.location.lng;
  } else {
    destinationLat = data.results[0].geometry.location.lat;
    destinationLng = data.results[0].geometry.location.lng;
  };
  fetchAndRenderRoute();
  getWeatherData(displayWeatherData);
}

//fetch route and render onto map
function fetchAndRenderRoute() {
  L.Routing.control({
    waypoints: [
      L.latLng(originLat, originLng),
      L.latLng(destinationLat, destinationLng)
    ],
    showAlternatives: true,
    router: L.Routing.mapbox('pk.eyJ1IjoianZvbmVzc2VuIiwiYSI6ImNpeXVwaTQ2azAxc3Ayd21ocGw3ZnY4NHcifQ.Ae31-8rR2qFmyiYaBtwf_A'),
  }).addTo(mymap);
}

// Getting weather data
function getWeatherData(callback) {
  var cities = [
    [originLat,originLng],
    [destinationLat,destinationLng]
  ];
  originWeather = $.getJSON(weather_URL + cities[0] + '.json');
  destinationWeather = $.getJSON(weather_URL + cities[1] + '.json');
  // for (i=0;i<cities.length;i++) {
  //   $.getJSON(weather_URL + cities[i] + '.json', callback);
  // };
  displayWeatherData();
}

function displayWeatherData() {
  console.log(originWeather);
//   var greenIcon = L.icon({
//     iconUrl: data.forecast.simpleforecast[0].icon_url,
//     iconSize:     [38, 95], // size of the icon
//     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//     shadowAnchor: [4, 62],  // the same for the shadow
//     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });
}

// Promise and call for route and weather layers
// var newLayerCalls = new Promise(
//   function(resolve, reject) {
//     getGeocodeInfo(assignGeocodeInfo);
//     if (originLat && destinationLat) {
//       resolve(originLat)
//     } else {
//       var errorMessage = 'Error. Please check your addresses and try again.';
//       reject(errorMessage);
//     }
//   }
// );
//
// var initCalls = function() {
//   newLayerCalls
//     .then(function(fulfilled) {
//       fetchAndRenderRoute();
//       getWeatherData(displayWeatherData);
//     })
//     .catch(function(error) {
//       alert(errorMessage);
//     })
// }

// starts routing process on button click
$(".button").click(function(){
  origin = document.getElementById('start-input').value;
  destination = document.getElementById('end-input').value;
  getGeocodeInfo(assignGeocodeInfo);
})
