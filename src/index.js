var api = "81a628b07908ceaa2f0d789d375fd841";
var city = "Boston";
var state = "ma";
var lat = "";
var lon = "";
var days = "1";
var currentURL = "api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "&appid=" + api;
var currentData;
var forecastData;
var $form = $("form");
var forecastCardTemplate = "<div class=\"card\" style=\"width: 18rem;\" id=\"current-card\">" +
    "<div class=\"card-body\">" +
    "<h5 class=\"card-title\" id=\"current-title\">Card title</h5>" +
    "<h6 class=\"card-subtitle mb-2 text-muted\" id=\"current-temp\">Card subtitle</h6>" +
    "<p class=\"card-text\" id=\"current-details\">Some quick example text to build on the card title and make up the bulk of the card's content.</p>" +
    "<a href=\"#\" class=\"card-link\">Card link</a>" +
    "<a href=\"#\" class=\"card-link\">Another link</a>" +
    "</div>" +
    "</div>";
//
// cnt	optional	A number of days, which will be returned in the API response (from 1 to 16). Learn more
// up to 16 day forecast api.openweathermap.org/data/2.5/forecast/daily?q={city name},{state code}&cnt={cnt}&appid={API key}
function getCurrent() {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + ",usa&cnt=3&appid=81a628b07908ceaa2f0d789d375fd841&units=imperial"
    }).then(function (data) {
        currentData = data;
        lat = data.coord.lat;
        lon = data.coord.lon;
        // "coord": {
        //   "lon": -71.0583,
        //   "lat": 42.3603
        console.log(lat);
        getForecast();
    }, function (error) {
        console.log('bad request: ', error);
    });
}
function getForecast() {
    getInputs();
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=81a628b07908ceaa2f0d789d375fd841&units=imperial"
    }).then(function (data) {
        forecastData = data;
        console.log("forecastData: " + forecastData.daily[0].sunrise);
        render();
    }, function (error) {
        console.log('bad request: ', error);
    });
}
function getInputs() {
    var _a, _b, _c;
    city = (_a = $("#city-input").val()) === null || _a === void 0 ? void 0 : _a.toString();
    state = (_b = $("#state-input").val()) === null || _b === void 0 ? void 0 : _b.toString();
    days = (_c = $("#days-input").val()) === null || _c === void 0 ? void 0 : _c.toString();
    console.log("city: " + city);
    console.log("state: " + state);
}
function getWeather(event) {
    event.preventDefault();
    getInputs();
    getCurrent();
}
$form.on('submit', getWeather);
function render() {
    // Render current weather
    $("#current-title").text(city + ", " + state.toUpperCase());
    $("#current-temp").text("Current Temp: " + currentData.main.temp + "\u00B0F");
    $("#current-details").text("Expect " + currentData.weather[0].description + " with winds up to " + currentData.wind.speed + " mph.");
    // Render Forecast
    $("#forecast-slides").empty();
    for (var i = 1; i < +days; i++) {
        $("#forecast-slides").append("<div class=\"card\" style=\"width: 18rem;\" id=\"current-card\">" +
            "<div class=\"card-body\">" +
            "<div class=\"title-container\">" +
            ("<h5 class=\"card-title\" id=\"current-title\">Day " + i + "</h5>") +
            ("<img class=\"weather-icon\" src=\"https://openweathermap.org/img/wn/" + forecastData.daily[i].weather[0].icon + ".png\" name=\"weather icon\">") +
            "</div>" +
            "<br>" +
            ("<h6 class=\"card-subtitle mb-2 text-muted\" id=\"current-temp\">Expect " + forecastData.daily[i].weather[0].description + "</h6>") +
            ("<p class=\"card-text\" id=\"current-details\">With a high of " + forecastData.daily[i].temp.max + "\u00B0 and a low of " + forecastData.daily[i].temp.max + "\u00B0</p>") +
            "</div>" +
            "</div>");
    }
}
