var submitBtn = $('#search-submit');
var userSearch;
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
    userSearch = $('#city-search-field').val();
    if (userSearch !== "") {
        searchHistory.push(userSearch);
        localStorage.setItem("history", JSON.stringify(searchHistory));
        renderHistory();
        getCoordinatesApi(userSearch);
    }
}

var getCoordinatesApi = function (input) {
    var geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${input || clickedItem}&limit=1&appid=${apiKey}`;

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
            $('#city-search-field').val('');
        })
        .catch(function (error) {
            alert('Please enter a valid city name');
        });
};

var getWeatherApi = function () {
    var openWeatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(openWeatherApiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            console.log(weatherData);
            var todayData = weatherData.list[0];
            var todaySkyStatus = $('<img>');
            todaySkyStatus.attr('src', `https://openweathermap.org/img/wn/${todayData.weather[0].icon}@2x.png`);
            var skyStatusContainer = $('#sky-status');
            skyStatusContainer.empty();
            skyStatusContainer.append(todaySkyStatus);
            $('#city-name').text(weatherData.city.name);
            $('#humidity').text(todayData.main.humidity + '%');
            $('#wind-speed').text(todayData.wind.speed + ' MPH');

            // forecast for the next 5 days
            var forecastDays = [];
            for (var i = 7; i < weatherData.list.length; i += 8) {
                forecastDays.push(weatherData.list[i]);
            }
            console.log(forecastDays)
            forecastDays.forEach(function (forecastData, index) {
                var forecastDay = $('#day-' + (index + 1));
                var skyStatus = $('#sky-status-day-' + (index + 1));
                var humidity = $('#humidity-day-' + (index + 1));
                var windSpeed = $('#wind-speed-day-' + (index + 1));

                var reformatDate = dayjs(forecastData.dt_txt).format('dddd, MMMM D YYYY');
                forecastDay.text(reformatDate);

                var forecastskyStati = $('<img>');
                forecastskyStati.attr('src', `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png`);
                skyStatus.empty();
                skyStatus.append(forecastskyStati);
                humidity.text(forecastData.main.humidity + '%');
                windSpeed.text(forecastData.wind.speed + ' MPH');
            });

        })
        .catch(function (error) {
            alert('Unable to find weather information. Please try again later');
        });
};


submitBtn.on('click', citySubmitHandler);
renderHistory();
getCoordinatesApi('New York');
