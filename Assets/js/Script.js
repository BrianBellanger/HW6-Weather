var cityInputEl = document.querySelector(".cityForm");
var cityListEl = document.querySelector(".cityList");
var searchBtn = document.getElementById("button-addon");

var cityContainerEl = document.querySelector(".cityName");
var todayContainerEl = document.querySelector(".todayOutput");
var previousSearch = document.querySelector(".cityHistory");
var cards = document.querySelector(".card-deck")


// Global Variables
var citySearches = [];
var today = moment().format("L");
 
// Functions
var submitForm = function (event) {
    event.preventDefault();
    var citySearch = cityInputEl.value.trim();
    if (citySearch) {
        getWeather(citySearch);
        cityInputEl.value = '';
    } else {
        alert('Please enter a City');
    }
    citySearches.push(citySearch);
    storeCity(citySearches);
    renderCities();
};

function storeCity () {
    localStorage.setItem("searchCity", JSON.stringify(citySearches));
    return;
};

function getWeather (location) {
    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=2febd22c729bf7b99b9f79af03e82de4&units=imperial';
    fetch(apiUrl).then (function(response){
            if (response.ok){
                response.json().then(function(currentData){
                    displayWeather(currentData, location);
                    getForcast(currentData, location);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
};

function renderCities () {
    var renderSearches = JSON.parse(localStorage.getItem("searchCity"));
    previousSearch.innerHTML = '';
    for (var i=0; i< renderSearches.length; i++) {
        var city = renderSearches[i];
        var li = document.createElement("li");
        li.textContent = citySearches[i];
        li.classList.add("list-group-item");
        previousSearch.appendChild(li)[i];
    }
}

var displayWeather = function (currentForecast, searchLocation) {
    if (currentForecast.length === 0) {
        todayContainerEl.textContent = 'No Weather Returned.';
    };
    
    cityContainerEl.textContent = currentForecast.name + " " + today;

    var temp = Math.round(currentForecast.main.temp);
    var wind = Math.round(currentForecast.wind.speed);
    var humidity = currentForecast.main.humidity;
   
    var displayTemp = document.querySelector(".temp");
    var displayWind = document.querySelector(".wind");
    var displayHumidity = document.querySelector(".humidity");
    

    displayTemp.textContent = "Temperature: " + temp + " degrees F";
    displayWind.textContent = "Wind: " + wind + " mph";
    displayHumidity.textContent = "Humidity: " + humidity + " %";
}

var getForcast = function (returnedInfo, cityNameSearched) {
         var apiUrl2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + returnedInfo.name + "&appid=2febd22c729bf7b99b9f79af03e82de4&units=imperial";
         fetch(apiUrl2)
             .then(function (response2) {
                 if (response2.ok) {
                     response2.json().then (function (futureData) {
                         console.log(futureData);
                         showWeatherPrediction(futureData, location);
                     });
                 } else {
                     alert('Error: ' + response2.statusText);
                 }
             })
             .catch(function (error) {
                 alert('Cannot connect to OpenWeather');
             });

}


var showWeatherPrediction = function (prediction, where) {
 // create array for forecast info
 var week = [];
 week = [prediction.list[0], prediction.list[8], prediction.list[16], prediction.list[24],prediction.list[32]];    
 cards.innerHTML = '';
// display 5 day forecast
 for (var i=0; i < week.length; i++) {
     var unix = week[i].dt;
     var date = moment.unix(unix).format("L");
     var displayDate = document.createElement("div");
     displayDate.textContent = date;
     displayDate.classList.add("cdate");
     displayDate.classList.add("mb-3");
     cards.appendChild(displayDate);
     displayDate.classList.add("card");

     var displayTempForecast = document.createElement("p");
     var displayWindForecast = document.createElement("p");
     var displayHumidityForecast = document.createElement("p");

     displayTempForecast.textContent = "Temp: " + week[i].main.temp + " F";
     displayWindForecast.textContent = "Wind: " + week[i].wind.speed + " mph";
     displayHumidityForecast.textContent = "Humidity: " + week[i].main.humidity + " %";
     
     displayTempForecast.classList.add("ctemp");
     displayWindForecast.classList.add("cwind");
     displayHumidityForecast.classList.add("chumidity")
     
     displayDate.append(displayTempForecast);
     displayTempForecast.append(displayWindForecast);
     displayWindForecast.append(displayHumidityForecast);
 }};


// Event Listeners
searchBtn.addEventListener('click', submitForm);