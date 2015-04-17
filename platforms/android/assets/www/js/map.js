var mapNs = {
    // device APIs are available
    onDeviceReady: function() {
        var options = {
            maximumAge: 0,
            timeout: 10000,
            enableHighAccuracy: true
        };
        if (api.checkOnline()) {
            navigator.geolocation.getCurrentPosition(mapNs.onSuccess, mapNs.onError, options);
        } else {
            location.href = 'index.html';
        }
    },

    // Display `Position` properties from the geolocation
    onSuccess: function(position) {

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

        mapNs.goToMyLocation(map, position.coords.latitude, position.coords.longitude);
        api.loadPoints(map, position.coords.latitude, position.coords.longitude);
    },
    // Show an alert if there is a problem getting the geolocation
    onError: function() {
        //console.log('unable to get the current location');
        location.href = 'index.html?error=yes';
    },
    // Go to current location
    goToMyLocation: function(map, latitude, longitude) {
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
};

// wait for device API libraries to load
document.addEventListener("deviceready", mapNs.onDeviceReady, false);