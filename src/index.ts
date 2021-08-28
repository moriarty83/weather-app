

let api:string = "81a628b07908ceaa2f0d789d375fd841";
let city:string = "";
let state:string = "";

// Lat and Lon are used to make API Request for future forecast.
let lat:string="";
let lon:string="";

// Number of days to get forecast for (1 is just Today)
let days:string = "1"

// Data from Current Weather Request
let currentData:any;

// Data from Forcast Weather Request
let forecastData:any;

// Form on Page
let $form:JQuery = $("form")!

// getCurrent gets the current weather.
// Get forecast and render all cascade through getCurrent.
// This is because to get future days, a lat and lon must be pulled form the current weather api.
function getCurrent(){
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},usa&cnt=3&appid=${api}&units=imperial`
  }).then(
    (data) => {
      currentData = data;
      lat = data.coord.lat;
      lon = data.coord.lon;

      // Gets future forecast.
      getForecast();
      
    },
    (error) => {
      console.log('bad request: ', error)
    }
  )
}


// Function to get future days forecast. Must be run from getCurrent to get lat and lon values.
function getForecast(){
  $.ajax(
    {
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=81a628b07908ceaa2f0d789d375fd841&units=imperial`
    }).then(
      (data) => 
      {
        forecastData = data;

        // Renders weather data on page.
        render();
      },
      (error) => {
        console.log('bad request: ', error)
    }
  )
}

// Populate City, State, and Days which are fed into API requests.
function getInputs(){
  city = $("#city-input").val()?.toString()!;
  // Corrects case of city name.
  city = city[0].toLocaleUpperCase() + city.slice(1).toLowerCase();

  state = $("#state-input").val()?.toString()!;
  days = $("#days-input").val()?.toString()!;
  
  console.log("city: " + city);
  console.log("state: " + state);
}


// Function kicks off everything.
function getWeather(event:Event){
  event.preventDefault();
  getInputs();
  getCurrent();


}

// Listener for Submit button to get weather.
$form.on('submit', getWeather)


// Populates page with forecast/weather information.
function render(){
  // Render current weather
  $("#current-title").text(`${city}, ${state.toUpperCase()}`)
  $("#current-temp").text(`Current Temp: ${currentData.main.temp}°F`)
  $("#current-details").text(`Expect ${currentData.weather[0].description} with winds up to ${currentData.wind.speed} mph.`)
  $("#current-link").empty();

  // Render Forecast
  $("#forecast-slides").empty();
  for(let i = 1; i < +days; i++){
  $("#forecast-slides").append(
  `<div class="card" style="width: 18rem;">` +
    `<div class="card-body">`+
      `<div class="title-container">` +
        `<h5 class="card-title" id="current-title">Day ${i+1}</h5>`+
        `<img class="weather-icon" src="https://openweathermap.org/img/wn/${forecastData.daily[i].weather[0].icon}.png" name="weather icon">` +
      `</div>` +
      `<br>` +
      `<h6 class="card-subtitle mb-2 text-muted" id="current-temp">Expect ${forecastData.daily[i].weather[0].description}</h6>`+
      `<p class="card-text" id="current-details">With a high of ${forecastData.daily[i].temp.max}° and a low of ${forecastData.daily[i].temp.max}°</p>`+
    `</div>`+
  `</div>`
  )
} 
}



