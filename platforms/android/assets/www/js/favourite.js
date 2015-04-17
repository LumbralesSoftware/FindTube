function loadFavorites(){
            var result = $('#favourites');
            var favourites = window.localStorage.getItem("favourites");
            console.log(favourites);
            var obj = jQuery.parseJSON(favourites);
            for (var station in obj) {
                console.log(obj[station].name);
                result.append('<h3>'+obj[station].name+'</h3><div id="' + obj[station].code + '"><img id="loading-' + obj[station].code + '" src="img/loading.gif" align="middle" alt="Loading..."/></div>');
                api.getInfoPoint(obj[station].code, obj[station].lines);
            }
}
// wait for device API libraries to load
document.addEventListener("deviceready", loadFavorites, false);