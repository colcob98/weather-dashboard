var submitBtn = $('#search-submit');
var userSearch;
//variable to store data from local storage
var searchHistory = JSON.parse(localStorage.getItem("history")) || [];
var apiKey = 'a2c9d397413a5b220a8838ae23f41b43';
var clickedItem;
var lat;
var lon;

//function to retreive and render data from local storage, and make each rendered item able
//to trigger another search
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

//upon user's search for a city, save item in local storage and trigger search for that item
function citySubmitHandler(event) {
    event.preventDefault();
    userSearch = $('#city-search-field').val();
    var letters = /^[A-Za-z]+$/;
    //because Geocoding API accepts numbers, 
    //conditional to check that userSearch is only letters and it is not a duplicate search
    if (userSearch.match(letters) && !searchHistory.includes(userSearch)) {
        searchHistory.push(userSearch);
        localStorage.setItem("history", JSON.stringify(searchHistory));
        renderHistory();
        getCoordinatesApi(userSearch);
    }
}

//get the coordinates needed to call weather for the searched city
var getCoordinatesApi = function (input) {
    var geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${input || clickedItem}&limit=1&appid=${apiKey}`;

    fetch(geocodingApiUrl)
        .then(function (response) {
         return response.json();
         })
        .then (function (data) {
            if (data) {
                lat = data[0].lat;
                lon = data[0].lon;
                console.log(lat);
                console.log(lon);
            }
            if (lat !== null && lon !== null) {
                getWeatherApi();
                $('#city-search-field').val('');
            } else {
                alert('Unable to locate your city')
            }
        })
        .catch(function (error) {
            alert('Please enter a valid city name');
            searchHistory.pop();
            localStorage.setItem("history", JSON.stringify(searchHistory));
            renderHistory();
            $('#city-search-field').val('');
        });
};

function convertToF (kelvin) {
    return (kelvin - 273.15) * (9/5) + 32;
}

function convertToMph (mps) {
    return (mps * 2.2369)
}

var getWeatherApi = function () {
    var openWeatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(openWeatherApiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            
            var todayData = weatherData.list[0];
            var reformateTodayDate = dayjs(todayData.dt_txt).format('dddd, MMMM D YYYY');
            $('#today-date').text(reformateTodayDate);
            var todaySkyStatus = $('<img>');
            todaySkyStatus.attr('src', `https://openweathermap.org/img/wn/${todayData.weather[0].icon}@2x.png`);
            var skyStatusContainer = $('#sky-status');
            skyStatusContainer.empty();
            skyStatusContainer.append(todaySkyStatus);
            var todayTemp = Math.round(convertToF(todayData.main.temp));
            $('#temperature').text(todayTemp + ' °F');
            $('#city-name').text(weatherData.city.name);
            $('#humidity').text(todayData.main.humidity + '%');
            var todayWind = Math.round(convertToMph(todayData.wind.speed))
            $('#wind-speed').text(todayWind + ' MPH');

            // forecast for the next 5 days
            var forecastDays = [];
            for (var i = 7; i < weatherData.list.length; i += 8) {
                forecastDays.push(weatherData.list[i]);
            }
            console.log(forecastDays)
            forecastDays.forEach(function (forecastData, index) {
                var forecastDay = $('#day-' + (index + 1));
                var skyStatus = $('#sky-status-day-' + (index + 1));
                var temperature = $('#temp-day-' + (index + 1));
                var humidity = $('#humidity-day-' + (index + 1));
                var windSpeed = $('#wind-speed-day-' + (index + 1));

                var reformatDate = dayjs(forecastData.dt_txt).format('dddd, MMMM D YYYY');
                forecastDay.text(reformatDate);

                var forecastskyStati = $('<img>');
                forecastskyStati.attr('src', `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png`);
                skyStatus.empty();
                skyStatus.append(forecastskyStati);

                var forecastTemp = Math.round(convertToF(forecastData.main.temp));
                temperature.text(forecastTemp + ' °F');
                humidity.text(forecastData.main.humidity + '%');

                var forecastWind = Math.round(convertToMph(forecastData.wind.speed));
                windSpeed.text(forecastWind + ' MPH');
            });
            //because the Geocoding API accepts non-city names, setting the variables 'lat' and 'lon' to null
            //helps to trigger error alerts for those instances
            lat = null;
            lon = null;
        })
        .catch(function (error) {
            alert('Unable to find weather information. Please enter a valid city.');
        });
};


submitBtn.on('click', citySubmitHandler);
renderHistory();
getCoordinatesApi('New York');
