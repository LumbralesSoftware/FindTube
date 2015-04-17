function loadFavorites() {
    if (!api.checkOnline()) {
        location.href = 'index.html';
    } else {
        listEmpty();
        var result = $('#favourites');
        var favourites = window.localStorage.getItem("favourites");
        var obj = jQuery.parseJSON(favourites);
        for (var station in obj) {
            result.append('<h3>' + obj[station].name + '</h3><div id="' + obj[station].code + '"><img id="loading-' + obj[station].code + '" src="img/loading.gif" align="middle" alt="Loading..."/></div>');
            api.getInfoPoint(obj[station].code, obj[station].lines);
        }
    }
}

function listEmpty() {
        var favourites = window.localStorage.getItem("favourites");
        console.log(favourites);
        if (!favourites) {
            alert("You don't have any favourites");
            location.href = 'index.html';
        }
    }

// wait for device API libraries to load
document.addEventListener("deviceready", loadFavorites, false);