var searchText = document.getElementById("search-box");
var searchBtn = document.getElementById("search-button");
var sideMenu = document.getElementById("side-menu");
var days = document.querySelectorAll("[data-date]");

var cityName;
var latitude;
var longitude;
var locationData;
var weatherData;

var cityList = [];

var image;
var temp;
var wind;
var humidity;
var uvi;
var date;
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function init() {
  var storedCities = JSON.parse(localStorage.getItem("cities"));
  if (storedCities !== null) {
    cityList = storedCities;
    for (let i = 0; i < cityList.length; i++) {
      (cityName = cityList[i]), addToList();
    }
  }
}

function addToStorage() {
  cityList.push(cityName);
  localStorage.setItem("cities", JSON.stringify(cityList));
}

function addToList() {
  let nameCapped = cityName.split(" ");
  for(let i = 0; nameCapped.length > i; i++) {
    nameCapped[i] = nameCapped[i][0].toUpperCase() + nameCapped[i].substr(1);
  }
  cityName = nameCapped.join(" ");

  var newCity = document.createElement("button");

  newCity.classList.add("btn", "btn-primary", "col-12", "m-1");
  newCity.setAttribute("value", cityName);
  sideMenu.appendChild(newCity);
  newCity.textContent = cityName;
  newCity.addEventListener("click", function () {
    cityName = newCity.value;
    console.log(cityName);
    apiGeocodeSearch();
  });
}

function apiGeocodeSearch() {
  // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

  // Replace the spaces with +'s so the api call works

  var apiCity = cityName.replace(" ", "+");

  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      apiCity +
      "&appid=ed7ad3517cceea24f5ddf34da86b3e00"
  )
    .then(function (response) {
      if (!response.ok) {
        throw alert("Error retrieving data");
      }

      return response.json();
    })
    .then(function (data) {
      locationData = data;
      console.log(locationData);
      console.log(locationData[0].lat)
      latitude = locationData[0].lat;
      longitude = locationData[0].lon;
      apiWeatherSearch(longitude, latitude);
    });
}

function apiWeatherSearch(lon, lat) {
  console.log(lon);
  console.log(lat);
  console.log(locationData);
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=imperial&appid=821ab2b933a41cb0d71c07daccdd3f14"
  )
    .then(function (response) {
      if (!response.ok) {
        throw alert("Error retrieving data");
      }

      return response.json();
    })
    .then(function (data) {
      weatherData = data;
      console.log(weatherData);
      forecast(weatherData);
    });
}
function forecast(weather) {
  for (let i = 0; i < 6; i++) {
    if (i == 0) {
      // city and date
      var setDate = document.querySelector(".city-date");
      var utcDate = weather.current.dt;
      var utcOffset = weather.timezone_offset;
      utcDate = utcDate + utcOffset;
      // set UTC to milliseconds
      date = new Date(utcDate * 1000);
      var month = months[date.getMonth()];
      var day = date.getDate();
      var year = date.getFullYear();
      var curDate = month + "-" + day + "-" + year;
      console.log(curDate);
      console.log(cityName);
      console.log(setDate);
      setDate.textContent = cityName + ": " + curDate;

      // image for weather
      var setImage = document.querySelector(".day-" + i + ".image");
      image = weather.current.weather[0].icon;
      setImage.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/" + image + "@2x.png"
      );
      console.log(setImage);
      // temp
      var setTemp = document.querySelector(".day-" + i + ".temp");
      temp = weather.current.temp;
      setTemp.textContent = "Temperature: " + temp + "°F";

      //   wind;
      var setWind = document.querySelector(".day-" + i + ".wind");
      console.log(setWind);
      wind = weather.current.wind_speed;
      var windDirection = weather.current.wind_deg;
      if (0 <= windDirection && windDirection <= 30) {
        windDirection = "N";
      } else if (
        (30 < windDirection && windDirection <= 60) ||
        windDirection > 330
      ) {
        windDirection = "NE";
      } else if (60 < windDirection && windDirection <= 120) {
        windDirection = "E";
      } else if (120 < windDirection && windDirection <= 150) {
        windDirection = "SE";
      } else if (150 < windDirection && windDirection <= 210) {
        windDirection = "S";
      } else if (210 < windDirection && windDirection <= 240) {
        windDirection = "SW";
      } else if (240 < windDirection && windDirection <= 300) {
        windDirection = "W";
      } else if (300 < windDirection && windDirection <= 330) {
        windDirection = "NW";
      }
      setWind.textContent =
        "Wind Speed (MPH) & Direction: " + wind + " " + windDirection;

      //   humidity;
      var setHumidity = document.querySelector(".day-" + i + ".humidity");
      humidity = weather.current.humidity;
      setHumidity.textContent = "Humidity: " + humidity + "%";

      //   uvi;
      var setUvi = document.querySelector(".day-" + i + ".uvi");
      uvi = weather.current.uvi;
      if (uvi < 3) {
        setUvi.style.backgroundColor = "Green";
        setUvi.style.color = "white";
        setUvi.style.padding = "3px";
        setUvi.style.borderRadius = "5px";
      } else if (uvi < 6) {
        setUvi.style.backgroundColor = "yellow";
        setUvi.style.color = "black";
        setUvi.style.padding = "3px";
        setUvi.style.borderRadius = "5px";
      } else if (uvi < 8) {
        setUvi.style.backgroundColor = "orange";
        setUvi.style.color = "black";
        setUvi.style.padding = "3px";
        setUvi.style.borderRadius = "5px";
      } else if (uvi < 11) {
        setUvi.style.backgroundColor = "red";
        setUvi.style.padding = "3px";
        setUvi.style.borderRadius = "5px";
      } else {
        setUvi.style.backgroundColor = "purple";
        setUvi.style.color = "white";
        setUvi.style.padding = "3px";
        setUvi.style.borderRadius = "5px";
      }
      setUvi.textContent = "UV Index: " + uvi;
    } else {
      // city and date
      var setDate = document.querySelector(".day-" + i + ".date");
      var utcDate = weather.daily[i - 1].dt;
      var utcOffset = weather.timezone_offset;
      utcDate = utcDate + utcOffset;
      // set UTC to milliseconds
      date = new Date(utcDate * 1000);
      var month = months[date.getMonth()];
      var day = date.getDate();
      var curDate = month + " " + day;
      setDate.textContent = curDate;

      // image for weather
      var setImage = document.querySelector(".day-" + i + ".image");
      image = weather.daily[i - 1].weather[0].icon;
      setImage.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/" + image + "@2x.png"
      );

      // max-temp
      var setMaxTemp = document.querySelector(".day-" + i + ".max-temp");
      temp = weather.daily[i - 1].temp.max;
      setMaxTemp.textContent = "Max: " + temp + "°F";

      // min-temp
      var setMinTemp = document.querySelector(".day-" + i + ".min-temp");
      temp = weather.daily[i - 1].temp.min;
      setMinTemp.textContent = "Min: " + temp + "°F";

      // wind;
      var setWind = document.querySelector(".day-" + i + ".wind");
      console.log(setWind);
      wind = weather.daily[i - 1].wind_speed;
      var windDirection = weather.daily[i - 1].wind_deg;
      if (0 <= windDirection && windDirection <= 30) {
        windDirection = "N";
      } else if (
        (30 < windDirection && windDirection <= 60) ||
        windDirection > 330
      ) {
        windDirection = "NE";
      } else if (60 < windDirection && windDirection <= 120) {
        windDirection = "E";
      } else if (120 < windDirection && windDirection <= 150) {
        windDirection = "SE";
      } else if (150 < windDirection && windDirection <= 210) {
        windDirection = "S";
      } else if (210 < windDirection && windDirection <= 240) {
        windDirection = "SW";
      } else if (240 < windDirection && windDirection <= 300) {
        windDirection = "W";
      } else if (300 < windDirection && windDirection <= 330) {
        windDirection = "NW";
      }
      setWind.textContent = "Wind: " + wind + " " + windDirection;

      //   humidity;
      var setHumidity = document.querySelector(".day-" + i + ".humidity");
      humidity = weather.daily[i - 1].humidity;
      setHumidity.textContent = "Humidity: " + humidity + "%";
    }
  }
}
init();

searchBtn.addEventListener("click", function () {
  cityName = searchText.value;
  if (cityName != "") {
    addToStorage();
    addToList();
    apiGeocodeSearch();
  }
});
