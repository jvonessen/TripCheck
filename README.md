## TripCheck

A web app to find and display directions for a route and display the weather forecast for origin, destination, and interval weather along the way.

![Screenshot](https://github.com/jvonessen/TripCheck/blob/master/screenshot.png)

## Usage

Originally intended for motorcycles to not be caught in unexpected weather without proper gear; however, it is useful for anyone driving a long distance and curious about what weather they might encounter along the way. All weather icons are clickable to retrieve additional information and extended forecasts.

## APIs and Other Technology In Use

This project uses several APIs to achieve the final product.

* [Leaflet](leafletjs.com) Open-source JS library for mobile friendly interactive maps. In TripCheck it provides all of the map containers and the map tiling system. Routing information is also done through the [Leaflet Routing Machine](http://www.liedman.net/leaflet-routing-machine/) with Mapbox being used for the routing data.

* [Mapbox](mapbox.com) Mapping platform that offers various map features and styles to be customized. In TripCheck it provides the route data and the imagery for the map tile layer.

* [Google Maps Geocoder](https://developers.google.com/maps/) Used to convert the user given addresses into geographic coordinates.

* [Weather Underground](https://www.wunderground.com/weather/api/d/docs?MR=1) All weather and forecast data, as well as the weather icons themselves, are retrieved from Weather Underground.

Other libraries and technologies are listed below.

* [Jquery](http://jquery.com/) DOM manipulation and traversal.
* [Axios](https://github.com/mzabriskie/axios) Promise based HTTP client for the browser and node.js.
