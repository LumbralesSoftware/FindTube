var api = api || {};

api.apiKey = "08056cfd96db1080b221b4668e9e5734";
api.appId = "e7198ca5";

api.loadPoints = function (map, latitude, longitude) {
    var request = new XMLHttpRequest();
    request.open("GET", "http://transportapi.com/v3/uk/tube/stations/near.json?lat=" + latitude + "&lon=" + longitude + "&page=1&rpp=10&app_id=" + this.appId + "&api_key=" + this.apiKey, true);
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
                                    '<h3>' + points.stations[i].name + '</h3> \
                                    <a onclick="api.saveString(\'' + escape(JSON.stringify(points.stations[i])) + '\')"> \
                                    <button>My favorite</button> \
                                    </a>\
                                    <div id="' + points.stations[i].station_code + '" style="width:100%;text-align:center"> \
                                    <img id="loading-' + points.stations[i].station_code + '" src="img/loading.gif" align="middle" alt="Loading..."/> \
                                    <div>'
                                );
                                infowindow.open(map, marker);
                                api.getInfoPoint(points.stations[i].station_code, points.stations[i].lines);
                            }
                        })(marker, i));
                    }
                }
            }
        }
        //console.log("asking for tube information");
    request.send();
}
api.saveString = function(station){
    var jsonStation = jQuery.parseJSON(unescape(station));
    var savedFavourites = jQuery.parseJSON(window.localStorage.getItem("favourites"));
    if (!jQuery.isArray(savedFavourites)) {
        savedFavourites = [];
    }
    var stationData = {"name": jsonStation.name, "code": jsonStation.station_code, "lines": jsonStation.lines};
    console.log(JSON.stringify(stationData));
    savedFavourites.push(stationData);
    window.localStorage.setItem("favourites", JSON.stringify(savedFavourites));
    console.log(JSON.stringify(savedFavourites));

}


api.getInfoPoint = function(station_code, lines) {

    for (var line in lines) {
        console.log('getting info of ' + lines[line]);
        this.getInfoLine(station_code, lines[line]);
    }

}

api.getInfoLine = function (station_code, line) {
    var result = $('#' + station_code);
    var request = new XMLHttpRequest();
    var stringHTTP = "http://transportapi.com/v3/uk/tube/" + line + "/" + station_code + "/live.json?app_id=" + this.appId + "&api_key=" + this.apiKey;
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
}