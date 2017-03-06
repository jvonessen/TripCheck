var TripCheck = {};

// API call URLS
TripCheck.geocode_URL = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAtsQkI9rXQT7kf36Giu_qms_Ksowljab4&address=';
TripCheck.weather_URL = 'https://api.wunderground.com/api/7bf2e0a9dad48df1/forecast/q/'

// initiate map and add basic tile layer, currently launches on London.
TripCheck.map = L.map('mapid').setView([33.2148, -97.1331], 12);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, \
     <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoianZvbmVzc2VuIiwiYSI6ImNpeXVwaTQ2azAxc3Ayd21ocGw3ZnY4NHcifQ.Ae31-8rR2qFmyiYaBtwf_A'
}).addTo(TripCheck.map);

//fetch route and render onto map
TripCheck.fetchAndRenderRoute = function(callback) {
  L.Routing.control({
    waypoints: [
      L.latLng(TripCheck.originLat, TripCheck.originLng),
      L.latLng(TripCheck.destinationLat, TripCheck.destinationLng)
    ],
    showAlternatives: true,
    collapsible: true,
    units: 'imperial',
    addWaypoints: false,
    router: L.Routing.mapbox('pk.eyJ1IjoianZvbmVzc2VuIiwiYSI6ImNpeXVwaTQ2azAxc3Ayd21ocGw3ZnY4NHcifQ.Ae31-8rR2qFmyiYaBtwf_A'),
  }).addTo(TripCheck.map)
      .on('routeselected', function (e) {
        TripCheck.alongTheWay(e)});
  $(".leaflet-routing-container").addClass("leaflet-routing-container-hide");
};



//find waypoint coordinates for intermediary weather data
TripCheck.alongTheWay = function(e) {
  var interval = Math.round(e.route.coordinates.length/4);
  var weatherLocals = [];
  for (i=interval;i<=e.route.coordinates.length-10;i+=interval) {
    weatherLocals.push([e.route.coordinates[i].lat,e.route.coordinates[i].lng]);
  };
  weatherLocals.forEach(TripCheck.intervalWeather);
};

// fetch and display intermediary weather data
TripCheck.intervalWeather = function(i) {
  $('.interval-weather-icon').remove();
  var intervalWeatherIcon = L.Icon.extend({
    options: {
      iconUrl: 'icon.jpg',
      iconSize:     [50, 50],
      iconAnchor:   [25, 30], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [0, 0], // point from which the popup should open relative to the iconAnchor
      className: 'interval-weather-icon'
    }
  });
  var popupOptions = {className: "interval-popup"}
  axios.get(TripCheck.weather_URL + i[0] + ',' + i[1] + '.json')
    .then(function(response){
      var txtForecastString = response.data.forecast.txt_forecast.forecastday;
      var simpleForecastString = response.data.forecast.simpleforecast.forecastday;
      var localIcon = new intervalWeatherIcon({iconUrl: "https://icons.wxug.com/i/c/k/" + simpleForecastString[0].icon + ".gif"});
      L.marker([i[0], i[1]], {icon: localIcon}).addTo(TripCheck.map)
        .on('click', function(e) {
          L.popup(popupOptions)
            .setContent("<b>" + txtForecastString[0].title +
              ":</b></br>High " + simpleForecastString[0].high.fahrenheit + "ºF. " +
              "Chance of precipitation: " + txtForecastString[0].pop + "%" +
              "<br><b>" + txtForecastString[1].title +
              ":</b></br>Low " + simpleForecastString[0].low.fahrenheit + "ºF. " +
              "Chance of precipitation: " + txtForecastString[1].pop + "%")
            .setLatLng([i[0],i[1]])
            .openOn(TripCheck.map);
        });
    });
}

// Getting weather data
TripCheck.getWeatherData = function() {
  var weatherIcon = L.Icon.extend({
    options: {
      iconUrl: 'icon.jpg',
      iconSize:     [50, 50],
      iconAnchor:   [25, 90], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [0, 70] // point from which the popup should open relative to the iconAnchor
    }
  });
  axios.get(TripCheck.weather_URL + TripCheck.originLat + ',' + TripCheck.originLng + '.json')
    .then(function(response){
      // console.log(response.data)
      var txtForecastString = response.data.forecast.txt_forecast.forecastday;
      var simpleForecastString = response.data.forecast.simpleforecast.forecastday;
      var originIcon = new weatherIcon({iconUrl: "https://icons.wxug.com/i/c/k/" + simpleForecastString[0].icon + ".gif"});
      L.marker([TripCheck.originLat, TripCheck.originLng], {icon: originIcon}).addTo(TripCheck.map)
        .on('click', function(e) {
          L.popup({options: {offset:[0, 50]}})
            .setContent("<b>" + txtForecastString[0].title +
              ":</b></br>High " + simpleForecastString[0].high.fahrenheit + "ºF. " +
              "Chance of precipitation: " + txtForecastString[0].pop + "%" +
              "<br><b>" + txtForecastString[1].title +
              ":</b></br>Low " + simpleForecastString[0].low.fahrenheit + "ºF. " +
              "Chance of precipitation: " + txtForecastString[1].pop + "%")
            .setLatLng([TripCheck.originLat,TripCheck.originLng])
            .openOn(TripCheck.map);
        });
    });
  axios.get(TripCheck.weather_URL + TripCheck.destinationLat + ',' + TripCheck.destinationLng + '.json')
    .then(function(response){
      var txtForecastString = response.data.forecast.txt_forecast.forecastday;
      var simpleForecastString = response.data.forecast.simpleforecast.forecastday;
      var destinationIcon = new weatherIcon({iconUrl: "https://icons.wxug.com/i/c/k/" + simpleForecastString[0].icon + ".gif"});
      L.marker([TripCheck.destinationLat, TripCheck.destinationLng], {icon: destinationIcon}).addTo(TripCheck.map)
        .on('click', function(e) {
          L.popup()
            .setContent("<b>" + txtForecastString[0].title +
              ":</b></br>High " + simpleForecastString[0].high.fahrenheit + "º. " +
              "Chance of precipitation: " + txtForecastString[0].pop + "%" +
              "<br><b>" + txtForecastString[1].title +
              ":</b></br>Low " + simpleForecastString[0].low.fahrenheit + "º. " +
              "Chance of precipitation: " + txtForecastString[1].pop + "%")
            .setLatLng([TripCheck.destinationLat,TripCheck.destinationLng])
            .openOn(TripCheck.map);
        });
    });
};

function FatalError(){ Error.apply(this, arguments); this.name = "FatalError"; }
FatalError.prototype = Object.create(Error.prototype);

// starts routing process on form submit
$(".locations").submit(function(event) {
  event.preventDefault();
  if ($("label[for='start-input']").html() != "Origin Address") {
    $("label[for='start-input']").html("Origin Address");
    $("#start-input").css("border", "1px solid grey");
  };
  if ($("label[for='end-input']").html() != "Destination Address") {
    $("label[for='end-input']").html("Destination Address");
    $("#end-input").css("border", "1px solid grey");
  }
  origin = document.getElementById('start-input').value.replace(/ /g, '+');
  destination = document.getElementById('end-input').value.replace(/ /g, '+');
  axios.all([
    axios.get(TripCheck.geocode_URL + origin)
      .then(function(response) {
        TripCheck.originLat = response.data.results[0].geometry.location.lat;
        TripCheck.originLng = response.data.results[0].geometry.location.lng;
      })
      .catch(function (error) {
        $("#start-input").css("border", "2px solid red");
        $("label[for='start-input']").html("Invalid Origin Address, Try Again");
        console.log("Origin Error caught");
        throw new FatalError("Something went badly wrong!");
        console.log(error);
      }),
    axios.get(TripCheck.geocode_URL + destination)
      .then(function(response) {
        TripCheck.destinationLat = response.data.results[0].geometry.location.lat;
        TripCheck.destinationLng = response.data.results[0].geometry.location.lng;
        console.log(TripCheck.destinationLat, TripCheck.destinationLng);
      })
      .catch(function (error) {
        $("#end-input").css("border", "2px solid red")
        $("label[for='end-input']").html("Invalid Destination Address, Try Again");
        console.log("Dest Error caught");
        throw new FatalError("Something went badly wrong!");
        console.log(error);
      }),
    ])
    .then(axios.spread(function() {
      TripCheck.fetchAndRenderRoute(TripCheck.alongTheWay);
      TripCheck.getWeatherData();
      $(".input-page").addClass('hidden');
    }));
})
