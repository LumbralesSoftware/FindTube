
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
        loadPoints();
    }

    // Show an alert if there is a problem getting the geolocation
    //
    function onError() {
        alert('onError!');
    }
    function loadPoints() {
        var request = new XMLHttpRequest();
        request.open("GET", "http://transportapi.com/v3/uk/tube/stations/near.json?lat=51.527789&lon=-0.102323&&page=1&rpp=10&&app_id=e7198ca5&api_key=08056cfd96db1080b221b4668e9e5734", true);
        request.onreadystatechange = function() {//Call a function when the state changes.
            if (request.readyState == 4) {
                if (request.status == 200 || request.status == 0) {
                    var points = JSON.parse(request.responseText);
                    var show = document.getElementById("latestTweets");
                                        show.innerHTML = points;
                    for (i = 0; i < points.stations.length; i++) {
                        points[i].longitude;
                        points[i].latitude;
                       alert( points[i].name);

                    }



                }
            }
        }
        console.log("asking for tweets");
        request.send();
    }