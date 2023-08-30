var submitBtn = $('#search-submit');
var searchHistory = JSON.parse(localStorage.getItem("history")) || [];
var apiKey = 'a2c9d397413a5b220a8838ae23f41b43';
var clickedItem;
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
            clickedItem = $(this).text();
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
        getCoordinatesApi();
        $('#city-search-field').val('');
    }
}

var getCoordinatesApi = function (input, limit = 1) {
    var input = $('#city-search-field').val();
    var geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${input || clickedItem}&limit=${limit}&appid=${apiKey}`;

    fetch(geocodingApiUrl)
        .then(function (response) {
         return response.json();
         })
        .then (function (data) {
            for (var i = 0; i < data.length; i++) {
                lat = data[0].lat;
                lon = data[0].lon;
                console.log(lat);
                console.log(lon);
            }
            getWeatherApi();
        })
        .catch(function (error) {
            alert('Please enter a valid city name');
        });
};

var getWeatherApi = function (lat, lon) {
    var openWeatherApiUrl = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(openWeatherApiUrl)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            for (var i = 0; i <data.length; i++) {

            }
        })
        .catch (function (error) {
            console.log('couldnt find weather info')
        });
}

submitBtn.on('click', citySubmitHandler);
renderHistory();
