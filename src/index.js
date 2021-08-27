var api = "81a628b07908ceaa2f0d789d375fd841";
var city = "";
var state = "";
// Lat and Lon are used to make API Request for future forecast.
var lat = "";
var lon = "";
// Number of days to get forecast for (1 is just Today)
var days = "1";
// Data from Current Weather Request
var currentData;
// Data from Forcast Weather Request
var forecastData;
// Form on Page
var $form = $("form");
// getCurrent gets the current weather.
// Get forecast and render all cascade through getCurrent.
// This is because to get future days, a lat and lon must be pulled form the current weather api.
function getCurrent() {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + ",usa&cnt=3&appid=" + api + "&units=imperial"
    }).then(function (data) {
        currentData = data;
        lat = data.coord.lat;
        lon = data.coord.lon;
        // Gets future forecast.
        getForecast();
    }, function (error) {
        console.log('bad request: ', error);
    });
}
// Function to get future days forecast. Must be run from getCurrent to get lat and lon values.
function getForecast() {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=81a628b07908ceaa2f0d789d375fd841&units=imperial"
    }).then(function (data) {
        forecastData = data;
        // Renders weather data on page.
        render();
    }, function (error) {
        console.log('bad request: ', error);
    });
}
// Populate City, State, and Days which are fed into API requests.
function getInputs() {
    var _a, _b, _c;
    city = (_a = $("#city-input").val()) === null || _a === void 0 ? void 0 : _a.toString();
    state = (_b = $("#state-input").val()) === null || _b === void 0 ? void 0 : _b.toString();
    days = (_c = $("#days-input").val()) === null || _c === void 0 ? void 0 : _c.toString();
    console.log("city: " + city);
    console.log("state: " + state);
}
// Function kicks off everything.
function getWeather(event) {
    event.preventDefault();
    getInputs();
    getCurrent();
}
// Listener for Submit button to get weather.
$form.on('submit', getWeather);
// Populates page with forecast/weather information.
function render() {
    // Render current weather
    $("#current-title").text(city + ", " + state.toUpperCase());
    $("#current-temp").text("Current Temp: " + currentData.main.temp + "\u00B0F");
    $("#current-details").text("Expect " + currentData.weather[0].description + " with winds up to " + currentData.wind.speed + " mph.");
    $("#current-link").empty();
    // Render Forecast
    $("#forecast-slides").empty();
    for (var i = 1; i < +days; i++) {
        $("#forecast-slides").append("<div class=\"card\" style=\"width: 18rem;\">" +
            "<div class=\"card-body\">" +
            "<div class=\"title-container\">" +
            ("<h5 class=\"card-title\" id=\"current-title\">Day " + (i + 1) + "</h5>") +
            ("<img class=\"weather-icon\" src=\"https://openweathermap.org/img/wn/" + forecastData.daily[i].weather[0].icon + ".png\" name=\"weather icon\">") +
            "</div>" +
            "<br>" +
            ("<h6 class=\"card-subtitle mb-2 text-muted\" id=\"current-temp\">Expect " + forecastData.daily[i].weather[0].description + "</h6>") +
            ("<p class=\"card-text\" id=\"current-details\">With a high of " + forecastData.daily[i].temp.max + "\u00B0 and a low of " + forecastData.daily[i].temp.max + "\u00B0</p>") +
            "</div>" +
            "</div>");
    }
}
