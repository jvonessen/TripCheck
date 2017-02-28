var TripCheck = {};

// API call URLS
TripCheck.geocode_URL = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAtsQkI9rXQT7kf36Giu_qms_Ksowljab4&address=';
TripCheck.weather_URL = 'http://api.wunderground.com/api/7bf2e0a9dad48df1/forecast/q/'

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
    .on('routesfound', function (e) {
      TripCheck.alongTheWay(e)});
  $(".leaflet-routing-container").addClass("leaflet-routing-container-hide");
};



//find waypoint coordinates for intermediary weather data
TripCheck.alongTheWay = function(e) {
  var interval = Math.round(e.routes[0].coordinates.length/4);
  var weatherLocals = [];
  for (i=interval;i<=e.routes[0].coordinates.length-10;i+=interval) {
    weatherLocals.push([e.routes[0].coordinates[i].lat,e.routes[0].coordinates[i].lng]);
  };
  TripCheck.intervalWeather(weatherLocals);
};

// fetch and display intermediary weather data
TripCheck.intervalWeather = function(weatherLocals) {
  var weatherIcon = L.Icon.extend({
    options: {
      iconUrl: 'icon.jpg',
      iconSize:     [50, 50],
      iconAnchor:   [25, 10], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [0, -70] // point from which the popup should open relative to the iconAnchor
    }
  });
  for (i=0;i<weatherLocals.length;i++) {
    axios.get(TripCheck.weather_URL + weatherLocals[i][0] + ',' + weatherLocals[i][1] + '.json')
      .then(function(response){
        // console.log(response.data);
        console.log(i);
        var txtForecastString = response.data.forecast.txt_forecast.forecastday;
        var simpleForecastString = response.data.forecast.simpleforecast.forecastday;
        var localIcon = new weatherIcon({iconUrl: simpleForecastString[0].icon_url});
        L.marker([weatherLocals[i][0], weatherLocals[i][1]], {icon: localIcon}).addTo(TripCheck.map)
          .on('click', function(e) {
            L.popup({options: {offset: [0, 50]}})
              .setContent("<b>" + txtForecastString[0].title +
                ":</b></br>High " + simpleForecastString[0].high.fahrenheit + "ºF. Low " + simpleForecastString[0].low.fahrenheit +
                "ºF. Chance of precipitation: " + txtForecastString[0].pop + "%" +
                "<br><b>" + txtForecastString[1].title +
                ":</b></br>Low " + simpleForecastString[0].low.fahrenheit + "ºF. " + txtForecastString[1].fcttext +
                " Chance of precipitation: " + txtForecastString[1].pop + "%")
              .setLatLng([weatherLocals[i][0],weatherLocals[i][1]])
              .openOn(TripCheck.map);
          });
      });

  };
}

// Getting weather data
TripCheck.getWeatherData = function() {
  var weatherIcon = L.Icon.extend({
    options: {
      iconUrl: 'icon.jpg',
      iconSize:     [50, 50],
      iconAnchor:   [25, 90], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [0, -70] // point from which the popup should open relative to the iconAnchor
    }
  });
  axios.get(TripCheck.weather_URL + TripCheck.originLat + ',' + TripCheck.originLng + '.json')
    .then(function(response){
      // console.log(response.data)
      var txtForecastString = response.data.forecast.txt_forecast.forecastday;
      var simpleForecastString = response.data.forecast.simpleforecast.forecastday;
      var originIcon = new weatherIcon({iconUrl: simpleForecastString[0].icon_url});
      L.marker([TripCheck.originLat, TripCheck.originLng], {icon: originIcon}).addTo(TripCheck.map)
        .on('click', function(e) {
          L.popup({options: {offset: [0, 50]}})
            .setContent("<b>" + txtForecastString[0].title +
              ":</b></br>High " + simpleForecastString[0].high.fahrenheit + "ºF. Low " + simpleForecastString[0].low.fahrenheit +
              "ºF. Chance of precipitation: " + txtForecastString[0].pop + "%" +
              "<br><b>" + txtForecastString[1].title +
              ":</b></br>Low " + simpleForecastString[0].low.fahrenheit + "ºF. " + txtForecastString[1].fcttext +
              " Chance of precipitation: " + txtForecastString[1].pop + "%")
            .setLatLng([TripCheck.originLat,TripCheck.originLng])
            .openOn(TripCheck.map);
        });
    });
  axios.get(TripCheck.weather_URL + TripCheck.destinationLat + ',' + TripCheck.destinationLng + '.json')
    .then(function(response){
      var txtForecastString = response.data.forecast.txt_forecast.forecastday;
      var simpleForecastString = response.data.forecast.simpleforecast.forecastday;
      var destinationIcon = new weatherIcon({iconUrl: simpleForecastString[0].icon_url});
      L.marker([TripCheck.destinationLat, TripCheck.destinationLng], {icon: destinationIcon}).addTo(TripCheck.map)
        .on('click', function(e) {
          L.popup()
            .setContent("<b>" + txtForecastString[0].title +
              ":</b></br>High " + simpleForecastString[0].high.fahrenheit + "º. " +  txtForecastString[0].fcttext +
              " Chance of precipitation: " + txtForecastString[0].pop + "%" +
              "<br><b>" + txtForecastString[1].title +
              ":</b></br>Low " + simpleForecastString[0].low.fahrenheit + "º. " + txtForecastString[1].fcttext +
              " Chance of precipitation: " + txtForecastString[1].pop + "%")
            .setLatLng([TripCheck.destinationLat,TripCheck.destinationLng])
            .openOn(TripCheck.map);
        });
    });
};

// starts routing process on button click
$(".button").click(function(event) {
  $(".input-page").addClass('hidden');
  origin = document.getElementById('start-input').value.replace(/ /g, '+');
  destination = document.getElementById('end-input').value.replace(/ /g, '+');
  axios.all([
    axios.get(TripCheck.geocode_URL + origin)
      .then(function(response) {
        TripCheck.originLat = response.data.results[0].geometry.location.lat;
        TripCheck.originLng = response.data.results[0].geometry.location.lng;
      }),
    axios.get(TripCheck.geocode_URL + destination)
      .then(function(response) {
        TripCheck.destinationLat = response.data.results[0].geometry.location.lat;
        TripCheck.destinationLng = response.data.results[0].geometry.location.lng;
      })
    ])
    .then(function() {
      TripCheck.fetchAndRenderRoute(TripCheck.alongTheWay);
      TripCheck.getWeatherData();
    })
})
