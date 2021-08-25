

let api:string = "81a628b07908ceaa2f0d789d375fd841";
let city:string = "Boston";
let state:string = "ma";
let lat:string="";
let lon:string="";

let days:string = "1"

let currentURL:string = `api.openweathermap.org/data/2.5/weather?q=${city},${state}&appid=${api}`

let currentData:any;

let forecastData:any;

let $form:JQuery = $("form")!

let forecastCardTemplate:string =     
`<div class="card" style="width: 18rem;" id="current-card">` +
`<div class="card-body">`+
  `<h5 class="card-title" id="current-title">Card title</h5>`+
  `<h6 class="card-subtitle mb-2 text-muted" id="current-temp">Card subtitle</h6>`+
  `<p class="card-text" id="current-details">Some quick example text to build on the card title and make up the bulk of the card's content.</p>`+
  `<a href="#" class="card-link">Card link</a>`+
  `<a href="#" class="card-link">Another link</a>`+
`</div>`+
`</div>`

//

// cnt	optional	A number of days, which will be returned in the API response (from 1 to 16). Learn more

// up to 16 day forecast api.openweathermap.org/data/2.5/forecast/daily?q={city name},{state code}&cnt={cnt}&appid={API key}
function getCurrent(){
  $.ajax({
    url: `http://api.openweathermap.org/data/2.5/weather?q=${city},${state},usa&cnt=3&appid=81a628b07908ceaa2f0d789d375fd841&units=imperial`
  }).then(
    (data) => {
      currentData = data;
      lat = data.coord.lat;
      lon = data.coord.lon;
      // "coord": {
      //   "lon": -71.0583,
      //   "lat": 42.3603
      console.log(lat);
      getForecast();
      

    },
    (error) => {
      console.log('bad request: ', error)
    }
  )
}

function getForecast(){
  getInputs();

  $.ajax(
    {
      url: `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=81a628b07908ceaa2f0d789d375fd841&units=imperial`
    }).then(
      (data) => 
      {
        forecastData = data;
        console.log("forecastData: " + forecastData.daily[0].sunrise);
        render();


        
      },
      (error) => {
        console.log('bad request: ', error)
    }
  )
}

function getInputs(){
  city = $("#city-input").val()?.toString()!;
  state = $("#state-input").val()?.toString()!;
  days = $("#days-input").val()?.toString()!;
  console.log("city: " + city);
  console.log("state: " + state);
}

function getWeather(event:Event){
  event.preventDefault();
  getInputs();
  getCurrent();


}

$form.on('submit', getWeather)

function render(){
  // Render current weather
  $("#current-title").text(`${city}, ${state.toUpperCase()}`)
  $("#current-temp").text(`Current Temp: ${currentData.main.temp}°F`)
  $("#current-details").text(`Expect ${currentData.weather[0].description} with winds up to ${currentData.wind.speed} mph.`)

  // Render Forecast
  $("#forecast-slides").empty();
  for(let i = 1; i < +days; i++){
  $("#forecast-slides").append(
  `<div class="card" style="width: 18rem;" id="current-card">` +
    `<div class="card-body">`+
      `<div class="title-container">` +
        `<h5 class="card-title" id="current-title">Day ${i}</h5>`+
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



