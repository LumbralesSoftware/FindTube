
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
    }

    // Show an alert if there is a problem getting the geolocation
    //
    function onError() {
        alert('onError!');
    }