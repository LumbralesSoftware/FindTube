function getInfoFavoriteLine(station_code, line) {
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