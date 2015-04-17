// wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
    var options = {
        maximumAge: 0,
        timeout: 10000,
        enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}

// Display `Position` properties from the geolocation
function onSuccess(position) {

    var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var map = new google.maps.Map(document.getElementById('full-height'), {
        zoom: 20,
        center: currentLocation,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    var image = 'img/location.gif';
    var beachMarker = new google.maps.Marker({
        position: currentLocation,
        map: map,
        icon: image
    });

    goToMyLocation(map, position.coords.latitude, position.coords.longitude);
    loadPoints(map, position.coords.latitude, position.coords.longitude);
}

// Show an alert if there is a problem getting the geolocation
//
function onError() {
    //console.log('unable to get the current location');
    location.href = 'index.html?error=yes';
}

function goToMyLocation(map, latitude, longitude) {
    var controlDiv = document.createElement('div');
    var currentLocation = new google.maps.LatLng(latitude, longitude);

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    var controlText = document.createElement('button');
    controlText.setAttribute("class", "btn");
    controlText.innerHTML = 'MY LOCATION';
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to my location
    google.maps.event.addDomListener(controlUI, 'click', function() {
        map.setCenter(currentLocation)
    });
    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlDiv);
}

function loadPoints(map, latitude, longitude) {
    var request = new XMLHttpRequest();
    request.open("GET", "http://transportapi.com/v3/uk/tube/stations/near.json?lat=" + latitude + "&lon=" + longitude + "&page=1&rpp=10&&app_id=e7198ca5&api_key=08056cfd96db1080b221b4668e9e5734", true);
    request.onreadystatechange = function() { //Call a function when the state changes.
            if (request.readyState == 4) {
                if (request.status == 200 || request.status == 0) {

                    var points = JSON.parse(request.responseText);
                    var marker,
                        myLatlng,
                        i,
                        infowindow = new google.maps.InfoWindow();

                    for (i = 0; i < points.stations.length; i++) {
                        //console.log(points.stations[i].name);

                        myLatlng = new google.maps.LatLng(
                            points.stations[i].latitude,
                            points.stations[i].longitude
                        );

                        marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: points.stations[i].name
                        });

                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                                infowindow.setContent(
                                    '<h3>' + points.stations[i].name + '</h3> <div id="' + points.stations[i].station_code + '" style="width:100%;text-align:center"><img id="loading-' + points.stations[i].station_code + '" src="img/loading.gif" align="middle" alt="Loading..."/><div>'
                                );
                                infowindow.open(map, marker);
                                getInfoPoint(points.stations[i].station_code, points.stations[i].lines);
                            }
                        })(marker, i));
                    }
                }
            }
        }
        //console.log("asking for tube information");
    request.send();
}

function getInfoPoint(station_code, lines) {

    for (var line in lines) {
        //console.log('getting info of ' + lines[line]);
        getInfoLine(station_code, lines[line]);
    }

}

function getInfoLine(station_code, line) {
    var result = $('#' + station_code);
    var request = new XMLHttpRequest();
    var stringHTTP = "http://transportapi.com/v3/uk/tube/" + line + "/" + station_code + "/live.json?app_id=e7198ca5&api_key=08056cfd96db1080b221b4668e9e5734";
    request.open("GET", stringHTTP);
    request.onreadystatechange = function() { //Call a function when the state changes.
        if (request.readyState == 4) {
            if (request.status == 200 || request.status == 0) {

                // Hide loading
                document.getElementById("loading-" + station_code).style.display = 'none';

                var pointsInfo = JSON.parse(request.responseText);

                for (var line in pointsInfo.lines) {

                    var lineInfo = pointsInfo.lines[line];

                    for (var platformName in lineInfo.platforms) {

                        var platform = lineInfo.platforms[platformName];

                        var platformId = platformName.toLowerCase()
                            .replace(/ /g, '-')
                            .replace(/[^\w-]+/g, '');
                        //console.log(platformId);
                        result.append('<div id="' + platformId + '" class="collapsible" data-role="collapsible" data-collapsed="true" data-theme="c" data-content-theme="c"></div>');
                        var collapsible = $('#' + platformId);
                        collapsible.append('<h3>' + line +' ('+ platformName +')</h3>');
                        collapsible.append('<h4>' + platformName + '</h4>');
                        collapsible.append('<button onclick="myFavorite()"type="button">Favorite</button>');

                        collapsible.append('<ul id="' + platformId + '-ul" class="list" data-role="listview" data-inset="false"></ul>');
                        var list = $('#' + platformId + '-ul');
                        for (j = 0; j < platform.departures.length; j++) {
                            if (j > 2) {
                                break;
                            }
                            var departure = platform.departures[j];
                            //console.log(platformName);
                            //console.log(departure.best_departure_estimate_mins);
                            list.append("<li><span style='text-transform: uppercase;'> </span> To "+departure.destination_name+" in <strong> " + departure.best_departure_estimate_mins + " min.</strong> </li>");

                        }
                    }
                }
                //console.log(result.html());
                $('.list').listview();
                $('.collapsible').collapsible();
            }
        }
    }

    //console.log("asking for getInfoPoint");
    request.send();

    function myFavorite(){
    var storage = window.localStorage.setItem("Favorit", "value");
    }
}