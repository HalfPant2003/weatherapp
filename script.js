const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "130b0023d09e4f47914105356240303"; // Replace "YOUR_API_KEY" with your WeatherAPI key

const createWeatherCard = (weatherItem) => {
    return `<li class="card">
                <h3>${weatherItem.date}</h3>
                <img src="https:${weatherItem.day.condition.icon}" alt="weather-icon">
                <h6>Temp: ${weatherItem.day.avgtemp_c}°C</h6>
                <h6>Humidity: ${weatherItem.day.avghumidity}%</h6>
                <h6>Wind Speed: ${weatherItem.day.maxwind_kph} km/h</h6>
            </li>`;
}

const getWeatherDetails = (cityName) => {
    const currentWeatherURL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`;
    const forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7`;
    
    fetch(currentWeatherURL)
        .then(response => response.json())
        .then(data => {
            const currentWeatherHtml = `
                <div class="details">
                    <h2>${cityName}</h2>
                    <h6>Temperature: ${data.current.temp_c}°C</h6>
                    <h6>Humidity: ${data.current.humidity}%</h6>
                    <h6>Wind Speed: ${data.current.wind_kph} km/h</h6>
                    <h6>Date and Time: ${data.location.localtime}</h6>
                </div>
                <div class="icon">
                    <img src="https:${data.current.condition.icon}" alt="weather-icon">
                    <h6>${data.current.condition.text}</h6>
                </div>`;
            currentWeatherDiv.innerHTML = currentWeatherHtml;
        })
        .catch(() => {
            alert("An error occurred while fetching the current weather data!");
        });
    
    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            const forecast = data.forecast.forecastday;
            const forecastHtml = forecast.map(day => createWeatherCard(day)).join("");
            weatherCardsDiv.innerHTML = forecastHtml;
        })
        .catch(() => {
            alert("An error occurred while fetching the forecast data!");
        });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    getWeatherDetails(cityName);
}

const getUserCoordinates = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        const cityName = data.location.name;
                        getWeatherDetails(cityName);
                    })
                    .catch(() => {
                        alert("An error occurred while fetching the city name!");
                    });
            },
            error => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Geolocation request denied. Please reset location permission to grant access again.");
                } else {
                    alert("Geolocation request error. Please reset location permission.");
                }
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());