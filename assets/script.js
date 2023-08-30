var submitBtn = $('#search-submit');
var searchHistory = JSON.parse(localStorage.getItem("history")) || [];
var openWeatherAPI = `api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}`;
var apiKey = 'a2c9d397413a5b220a8838ae23f41b43'; 
var lat;
var lon;


function renderHistory() {
    var searchHistoryList = $('#search-history');
    $('.searched-item').remove();
    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var searchedItem = $('<li>');
        searchedItem.addClass('searched-item');
        searchedItem.text(searchHistory[i]); 
        searchHistoryList.append(searchedItem);
        searchedItem.on('click', function(event) {
            var clickedItem = $(this).text();
            getCoordinatesApi(clickedItem);
        });
    }
}

function citySubmitHandler(event) {
    event.preventDefault();
    var userSearch = $('#city-search-field').val();
    if (userSearch !== "") {
        searchHistory.push(userSearch);
        localStorage.setItem("history", JSON.stringify(searchHistory));
        renderHistory();
        $('#city-search-field').val('');
        //getWeatherApi(userSearch);
    }
}

function autocompletePlaces() {
    var input = document.getElementById('city-search-field');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        lat = place.geometry.location.lat();
        lon = place.geometry.location.lng();
        console.log(lat);
        console.log(lon);
    });
}

google.maps.event.addDomListener(window, 'load', function() {
    autocompletePlaces()
    submitBtn.on('click', citySubmitHandler);
    renderHistory();
});

    /*var searchHistoryList = $('#search-history');
    var searchedItem = document.createElement('li');
    s
    
    searchedItem.on('click', getApi);
    getApi();*/


    //google apikey = AIzaSyAQ5K2OMNObvvvTMWxpHlHT7YAJjt18CjE

        /*const autocomplete = new google.maps.places.Autocomplete(userSearch);
    autocomplete.on('place_changed', () => {
        const place = autocomplete.getPlace();
        const cityName = place.name;
    })/*
    
}

/*getCoordinatesApi(cityName, limit=1) {
    var cityName = $('#city-search-field').val();
    var stateCode;
    var countryCode;
    var geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`

    fetch(geocodingApiUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var 
    })

}*/