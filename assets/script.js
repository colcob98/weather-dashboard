var submitBtn = $('#search-submit');
var searchHistory = JSON.parse(localStorage.getItem("history")) || [];

function renderHistory() {
    var searchHistoryList = $('#search-history');

    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var searchedItem = $('<li>');
        searchedItem.addClass('searched-item');
        searchedItem.text(searchHistory[i]); 

        searchHistoryList.append(searchedItem);
    }
}

function citySubmitHandler(event) {
    event.preventDefault();
    var userSearch = $('#city-search-field').val();
    if (userSearch !== "") {
        
        searchHistory.push(userSearch);
        localStorage.setItem("history", JSON.stringify(searchHistory));
    }

}

submitBtn.on('click', citySubmitHandler);
renderHistory();

    /*var searchHistoryList = $('#search-history');
    var searchedItem = document.createElement('li');
    s
    
    searchedItem.on('click', getApi);
    getApi();*/
