
    // wait for device API libraries to load
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

    // Display `Position` properties from the geolocation
    //
    function onSuccess(position) {
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
          zoom: 20,
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        goToMyLocation(map, position.coords.latitude, position.coords.longitude);
        loadPoints(map, position.coords.latitude, position.coords.longitude);
    }

    // Show an alert if there is a problem getting the geolocation
    //
    function onError() {
        alert('onError!');
    }

    function goToMyLocation(map, latitude, longitude)
    {
      var controlDiv = document.createElement('div');
      var currentLocation = new google.maps.LatLng(latitude, longitude);

     // Set CSS for the control border
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginBottom = '22px';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Click to recenter the map';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior
      var controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
      controlText.style.fontSize = '16px';
      controlText.style.lineHeight = '38px';
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.innerHTML = 'My Location';
      controlUI.appendChild(controlText);

      // Setup the click event listeners: simply set the map to my location
      google.maps.event.addDomListener(controlUI, 'click', function() {
        map.setCenter(currentLocation)
      });
      controlDiv.index = 1;
      map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(controlDiv);
    }
    function loadPoints(map, latitude, longitude) {
        var request = new XMLHttpRequest();
        request.open("GET", "http://transportapi.com/v3/uk/tube/stations/near.json?lat=" + latitude + "&lon=" + longitude + "&page=1&rpp=10&&app_id=e7198ca5&api_key=08056cfd96db1080b221b4668e9e5734", true);
        request.onreadystatechange = function() {//Call a function when the state changes.
            if (request.readyState == 4) {
                if (request.status == 200 || request.status == 0) {

                    var points = JSON.parse(request.responseText);
                    var marker,
                        myLatlng,
                        i,
                        infowindow = new google.maps.InfoWindow();

                    for (i = 0; i < points.stations.length; i++) {
                        console.log(points.stations[i].name);

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
                                infowindow.setContent(points.stations[i].name);
                                infowindow.open(map, marker);
                            }
                          })(marker, i)
                        );
                    }
                }
            }
        }
        console.log("asking for tube information");
        request.send();
    }
    function getInfoPoint(station_name,station_code,lat,lon){
        var stringHTTP = "http://transportapi.com/v3/uk/tube/"+station_name+"/"+station_code+"/live.json?lat="+lat+"&lon="+lon+"&&page=1&rpp=10&&app_id=e7198ca5&api_key=08056cfd96db1080b221b4668e9e5734";
        request.open("GET", stringHTTP);
        request.onreadystatechange = function() {//Call a function when the state changes.
                                                 if (request.readyState == 4) {
                                                     if (request.status == 200 || request.status == 0) {
                                                         var pointsInfo = JSON.parse(request.responseText);
                                                         for(linea = 0;linea< pointsInfo.lineas.length;linea++){
                                                         var lineaInfo = pointsInfo.linea[linea];
                                                         for (i = 0; i < lineaInfo.platforms.length; i++) {
                                                             var platform = pointsInfo.lines.platforms[i];
                                                             for(j=0; j < platform.length; j++){
                                                             var time = platform[i].departures[0].best_departure_estimate_mins;
                                                             }

                                                         }
                                                         }


                                                     }
                                                 }
                                             }
                                             console.log("asking for getInfoPoint");
                                             request.send();
        }